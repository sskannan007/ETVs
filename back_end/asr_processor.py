import os
import uuid
import json
import time
import shutil
import logging
import natsort
from typing import List, Optional
from pydub import AudioSegment
from sarvamai import SarvamAI
from dotenv import load_dotenv
from datetime import datetime
import torch
import gc
import subprocess
import numpy as np
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq

# -----------------------------------------------------
# Load environment variables
# -----------------------------------------------------
# Use absolute path to find .env in the backend root
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
FFMPEG_PATH = os.getenv("FFMPEG_PATH") # e.g. C:\ffmpeg\bin

# -----------------------------------------------------
# Logger
# -----------------------------------------------------
logger = logging.getLogger("ASRProcessor")
logger.setLevel(logging.INFO)

def check_dependencies():
    """Verify that ffmpeg/ffprobe are available."""
    # 1. Try if it's already in PATH
    try:
        subprocess.run(["ffprobe", "-version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # 2. Try FFMPEG_PATH from .env
    if FFMPEG_PATH:
        probe_exe = os.path.join(FFMPEG_PATH, "ffprobe.exe")
        ffmpeg_exe = os.path.join(FFMPEG_PATH, "ffmpeg.exe")
        if os.path.exists(probe_exe) and os.path.exists(ffmpeg_exe):
            # Update PATH for this process
            os.environ["PATH"] += os.pathsep + FFMPEG_PATH
            return True

    # 3. Search common locations
    common_paths = [
        "C:\\ffmpeg\\bin",
        "C:\\Program Files\\ffmpeg\\bin",
        os.path.expanduser("~\\ffmpeg\\bin")
    ]
    for cp in common_paths:
        if os.path.exists(os.path.join(cp, "ffprobe.exe")):
            os.environ["PATH"] += os.pathsep + cp
            return True

    return False

def get_has_ffmpeg():
    # We do a fresh check in case the user updated .env or path
    return check_dependencies()

# -----------------------------------------------------
# Global Model Instances (Lazy loading or pre-loading)
# -----------------------------------------------------
_whisper_processor = None
_whisper_model = None
_device = "cuda" if torch.cuda.is_available() else "cpu"
WHISPER_MODEL_ID = "distil-whisper/distil-large-v3"
TARGET_SR = 16000

def get_whisper():
    global _whisper_processor, _whisper_model
    if _whisper_processor is None:
        logger.info(f"Loading Whisper model {WHISPER_MODEL_ID} on {_device}...")
        _whisper_processor = AutoProcessor.from_pretrained(WHISPER_MODEL_ID)
        _whisper_model = AutoModelForSpeechSeq2Seq.from_pretrained(WHISPER_MODEL_ID).to(_device)
        logger.info("Whisper model loaded successfully.")
    return _whisper_processor, _whisper_model

def get_sarvam_client():
    if not SARVAM_API_KEY:
        logger.error("SARVAM_API_KEY is missing in environment variables")
        return None
    try:
        return SarvamAI(api_subscription_key=SARVAM_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize SarvamAI client: {e}")
        return None

# -----------------------------------------------------
# Helper: Merge JSON Transcriptions
# -----------------------------------------------------
def merge_json_transcriptions(output_dir: str) -> str:
    json_files = natsort.natsorted([f for f in os.listdir(output_dir) if f.endswith(".json")])
    if not json_files:
        return ""
    combined_text = ""
    for jf in json_files:
        try:
            with open(os.path.join(output_dir, jf), "r", encoding="utf-8") as f:
                data = json.load(f)
            text = data.get("transcript", "")
            if text and text.strip():
                combined_text += text.strip() + "\n\n"
        except Exception:
            pass
    return combined_text.strip()

# -----------------------------------------------------
# Helper: Audio Splitter
# -----------------------------------------------------
def split_audio(input_file: str, chunk_length_ms: int, output_dir: str) -> List[str]:
    os.makedirs(output_dir, exist_ok=True)
    audio = AudioSegment.from_file(input_file)
    duration_ms = len(audio)
    chunk_paths = []
    start = 0
    idx = 1
    while start < duration_ms:
        end = min(start + chunk_length_ms, duration_ms)
        chunk = audio[start:end]
        chunk_path = os.path.join(output_dir, f"chunk_{idx}.wav")
        chunk.export(chunk_path, format="wav")
        chunk_paths.append(chunk_path)
        start = end
        idx += 1
    return chunk_paths

# -----------------------------------------------------
# Whisper Chunk Processing
# -----------------------------------------------------
def transcribe_whisper_chunk(chunk_path: str) -> str:
    proc, model = get_whisper()
    
    # Load with pydub to avoid torchaudio/torchcodec version issues
    audio = AudioSegment.from_file(chunk_path)
    audio = audio.set_frame_rate(TARGET_SR).set_channels(1)
    
    # Convert to numpy array
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    
    # Normalize to [-1, 1]
    # For 16-bit PCM, max value is 32768
    if audio.sample_width == 2:
        samples /= 32768.0
    elif audio.sample_width == 1:
        samples = (samples - 128) / 128.0
    
    inputs = proc(samples, sampling_rate=TARGET_SR, return_tensors="pt")
    input_features = inputs.input_features.to(_device)
    
    with torch.no_grad():
        generated_ids = model.generate(input_features, max_new_tokens=256)
    
    text = proc.batch_decode(generated_ids, skip_special_tokens=True)[0]
    
    del samples, inputs, input_features, generated_ids
    torch.cuda.empty_cache()
    gc.collect()
    return text

# -----------------------------------------------------
# Main Transcribe Function
# -----------------------------------------------------
def transcribe_audio_file(file_path: str, language: str) -> str:
    """
    Transcribes an audio file based on the selected language.
    """
    if not get_has_ffmpeg():
        raise RuntimeError(
            "FFmpeg/FFprobe not found on the system. "
            "Please install FFmpeg and add it to your PATH, or set FFMPEG_PATH in your .env file."
        )

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found at: {file_path}")

    lang_lower = language.lower()
    req_id = uuid.uuid4().hex
    temp_dir = f"./temp_asr_{req_id}"
    input_dir = os.path.join(temp_dir, "input")
    chunk_dir = os.path.join(temp_dir, "chunks")
    output_dir = os.path.join(temp_dir, "output")
    os.makedirs(input_dir, exist_ok=True)
    os.makedirs(chunk_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    try:
        # Use the provided file or copy to temp if needed (here we use it directly)
        audio = AudioSegment.from_file(file_path)
        duration_min = len(audio) / (1000 * 60)

        if lang_lower == "english":
            # Whisper Logic
            chunk_ms = 30000 if duration_min <= 60 else 60000
            chunk_paths = split_audio(file_path, chunk_ms, chunk_dir)
            combined_text = ""
            for cp in chunk_paths:
                combined_text += transcribe_whisper_chunk(cp) + " "
            return combined_text.strip()

        elif lang_lower in ["hindi", "telugu"]:
            # SarvamAI Logic
            client = get_sarvam_client()
            if not client:
                raise Exception("SarvamAI client not available. Check API key.")
            
            lang_code = "hi-IN" if lang_lower == "hindi" else "te-IN"
            chunk_ms = 300000 if duration_min < 60 else 900000 # 5-15 mins
            chunk_paths = split_audio(file_path, chunk_ms, chunk_dir)

            job = client.speech_to_text_job.create_job(
                language_code=lang_code,
                model="saarika:v2.5",
                with_timestamps=False,
                with_diarization=False
            )
            job.upload_files(file_paths=chunk_paths)
            job.start()
            job.wait_until_complete()

            if job.is_failed():
                raise Exception("STT job failed on SarvamAI")

            job.download_outputs(output_dir=output_dir)
            return merge_json_transcriptions(output_dir)

        else:
            raise ValueError(f"Unsupported language: {language}")

    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

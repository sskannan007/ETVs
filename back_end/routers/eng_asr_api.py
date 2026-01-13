# # routers/english_asr_api.py without dairisation
 
import os
import uuid
import json
import time
import shutil
import logging
import natsort
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from datetime import datetime
from pydub import AudioSegment
import torch
import torchaudio
import gc
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
 
 
# -----------------------------------------------------

# Logger

# -----------------------------------------------------

logger = logging.getLogger("EnglishASR")
 
router = APIRouter(prefix="/english", tags=["English ASR"])
 
 
# -----------------------------------------------------

# Load local Whisper model ONCE (global)

# -----------------------------------------------------

device = "cuda" if torch.cuda.is_available() else "cpu"

model_id = "distil-whisper/distil-large-v3"
 
logger.info("Loading Distil-Whisper model...")

processor = AutoProcessor.from_pretrained(model_id)

model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id).to(device)

logger.info(f"Model loaded on {device}")
 
TARGET_SR = 16000
 
 
# -----------------------------------------------------

# MERGE JSON TRANSCRIPTIONS

# -----------------------------------------------------

def merge_json_transcriptions(output_dir: str) -> str:

    logger.info(f"Merging JSON transcription files in: {output_dir}")
 
    json_files = natsort.natsorted(

        [f for f in os.listdir(output_dir) if f.endswith(".json")]

    )

    if not json_files:

        logger.error("No JSON output files found!")

        return None
 
    combined_text = ""
 
    for jf in json_files:

        file_path = os.path.join(output_dir, jf)

        try:

            with open(file_path, "r", encoding="utf-8") as f:

                data = json.load(f)
 
            text = data.get("transcript", "")
 
            if text and text.strip():

                combined_text += text.strip() + "\n\n"
 
        except Exception as e:

            logger.error(f"Error reading JSON {jf}: {e}")
 
    final_path = os.path.join(output_dir, "final_transcription.txt")
 
    with open(final_path, "w", encoding="utf-8") as out:

        out.write(combined_text.strip())
 
    logger.info(f"Final merged transcription saved at: {final_path}")

    return final_path
 
 
# -----------------------------------------------------

# AUDIO SPLITTER

# -----------------------------------------------------

def split_audio(input_file: str, chunk_length_ms: int, output_dir: str) -> List[str]:

    logger.info(

        f"Splitting audio: {input_file} into chunks of {chunk_length_ms/1000}s each"

    )
 
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
 
        logger.info(

            f"Chunk {idx}: {start/1000:.2f}s → {end/1000:.2f}s"

        )
 
        chunk_paths.append(chunk_path)

        start = end

        idx += 1
 
    logger.info(f"Total chunks created: {len(chunk_paths)}")

    return chunk_paths
 
 
# -----------------------------------------------------

# PROCESS ONE CHUNK USING WHISPER

# -----------------------------------------------------

def transcribe_chunk(chunk_path: str) -> str:

    waveform, sr = torchaudio.load(chunk_path)
 
    # Convert stereo → mono

    if waveform.shape[0] > 1:

        waveform = waveform.mean(dim=0, keepdim=True)
 
    # Resample

    if sr != TARGET_SR:

        waveform = torchaudio.transforms.Resample(

            orig_freq=sr, new_freq=TARGET_SR

        )(waveform)
 
    speech_array = waveform.squeeze().numpy()
 
    inputs = processor(speech_array, sampling_rate=TARGET_SR,

                       return_tensors="pt")

    input_features = inputs.input_features.to(device)
 
    with torch.no_grad():

        generated_ids = model.generate(input_features, max_new_tokens=128)
 
    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
 
    del waveform, inputs, input_features, generated_ids

    torch.cuda.empty_cache()

    gc.collect()
 
    return text
 
 
# -----------------------------------------------------

# MAIN TRANSCRIPTION ROUTE

# -----------------------------------------------------

@router.post("/transcribe")

async def english_transcription_api(request: Request, file: UploadFile = File(...)):
 
    start_timestamp = datetime.utcnow().isoformat()

    start_time = time.time()

    client_ip = request.client.host

    filename = file.filename
 
    logger.info(

        f"[START REQUEST] {start_timestamp} | From: {client_ip} | File: {filename}"

    )
 
    try:

        # -------------------------

        # Temp Directories

        # -------------------------

        req_id = uuid.uuid4().hex

        base_dir = f"./temp_english_{req_id}"

        input_dir = os.path.join(base_dir, "input")

        chunk_dir = os.path.join(base_dir, "chunks")

        output_dir = os.path.join(base_dir, "output")
 
        os.makedirs(input_dir, exist_ok=True)

        os.makedirs(chunk_dir, exist_ok=True)

        os.makedirs(output_dir, exist_ok=True)
 
        # -------------------------

        # Save uploaded file

        # -------------------------

        ext = filename.split(".")[-1].lower()

        if ext not in ["mp3", "wav", "mp4", "m4a", "flac"]:

            raise HTTPException(status_code=400, detail="Supported formats: mp3/wav/mp4/m4a/flac")
 
        input_path = os.path.join(input_dir, f"input.{ext}")
 
        with open(input_path, "wb") as f:

            f.write(await file.read())
 
        logger.info(f"Saved file → {input_path}")
 
        # -------------------------

        # Determine Chunk Size

        # -------------------------

        audio = AudioSegment.from_file(input_path)

        duration_min = len(audio) / (1000 * 60)
 
        chunk_ms = 30_000 if duration_min <= 60 else 60_000

        logger.info(f"Chunk size: {chunk_ms/1000:.0f}s")
 
        # -------------------------

        # Split Audio

        # -------------------------

        chunk_paths = split_audio(input_path, chunk_ms, chunk_dir)
 
        # -------------------------

        # Transcribe Each Chunk

        # -------------------------

        for idx, cp in enumerate(chunk_paths, 1):

            logger.info(f"Transcribing chunk {idx}/{len(chunk_paths)} → {cp}")
 
            text = transcribe_chunk(cp)
 
            json_output = {

                "chunk_id": idx,

                "transcript": text

            }
 
            json_path = os.path.join(output_dir, f"out_{idx}.json")

            with open(json_path, "w", encoding="utf-8") as jf:

                json.dump(json_output, jf, indent=2, ensure_ascii=False)
 
        # -------------------------

        # Merge Final Transcript

        # -------------------------

        final_text_path = merge_json_transcriptions(output_dir)
 
        with open(final_text_path, "r", encoding="utf-8") as f:

            transcription = f.read()
 
        # -------------------------

        # Cleanup

        # -------------------------

        shutil.rmtree(base_dir)
 
        processing_time = round((time.time() - start_time) / 60, 2)

        end_stamp = datetime.utcnow().isoformat()
 
        logger.info(

            f"[END REQUEST] {end_stamp} | File: {filename} | "

            f"Processing Time: {processing_time} mins | Client: {client_ip}"

        )
 
        return JSONResponse({

            "status": "success",

            "processing_time_mins": processing_time,

            "transcription": transcription

        })
 
    except Exception as e:

        logger.error(f"FATAL ERROR: {e}")

        return JSONResponse(

            {"detail": f"Transcription failed: {str(e)}"},

            status_code=500

        )

#With router with diarisation

# import os
# import uuid
# import json
# import time
# import shutil
# import logging
# import natsort
# from typing import List
# from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
# from fastapi.responses import JSONResponse
# from pydub import AudioSegment
# from dotenv import load_dotenv
# from datetime import datetime
# import torch
# import torchaudio
# import gc

# from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq

# # -----------------------------------------------------
# # Load environment variables
# # -----------------------------------------------------
# load_dotenv()

# # ---------------------------
# # ENV VARIABLES
# # ---------------------------
# HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
# API_AUTH_KEY = os.getenv("API_AUTH_KEY")
# SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

# if not HUGGINGFACE_TOKEN:
#     raise ValueError("HUGGINGFACE_TOKEN missing in environment")

# # -----------------------------------------------------
# # Logger
# # -----------------------------------------------------
# logger = logging.getLogger("EnglishASR")
# logger.setLevel(logging.DEBUG)  # Set to DEBUG to see detailed logs

# router = APIRouter(prefix="/english", tags=["English ASR"])

# # -----------------------------------------------------
# # Verify API Key
# # -----------------------------------------------------
# def verify_api_key(request: Request):
#     client_key = request.headers.get("x-api-key")
#     if client_key != API_AUTH_KEY:
#         logger.warning(f"Unauthorized access from {request.client.host}")
#         raise HTTPException(status_code=401, detail="Invalid API Key")

# # -----------------------------------------------------
# # Load Whisper model
# # -----------------------------------------------------
# device = "cuda" if torch.cuda.is_available() else "cpu"
# model_id = "distil-whisper/distil-large-v3"

# logger.info("Loading Distil-Whisper model...")

# processor = AutoProcessor.from_pretrained(model_id, use_auth_token=HUGGINGFACE_TOKEN)
# model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id, use_auth_token=HUGGINGFACE_TOKEN).to(device)

# logger.info(f"Model loaded on {device}")

# TARGET_SR = 16000

# # -----------------------------------------------------
# # DIARIZATION MODULE (Following diarization.py methodology)
# # -----------------------------------------------------
# from pyannote.audio import Pipeline
# from pyannote.audio.pipelines.utils.hook import ProgressHook
# from huggingface_hub import login, snapshot_download
# from huggingface_hub.utils import LocalEntryNotFoundError
# from pathlib import Path

# MODEL_ID = "pyannote/speaker-diarization-3.1"
# MODEL_CACHE_DIR = Path("./.cache/pyannote_diarization")
# _diarization_pipeline = None


# def _resolve_diarization_model_path() -> Path:
#     """
#     Resolve the local model path, downloading if necessary.
#     """
#     MODEL_CACHE_DIR.mkdir(parents=True, exist_ok=True)
#     try:
#         path = snapshot_download(
#             repo_id=MODEL_ID,
#             cache_dir=str(MODEL_CACHE_DIR),
#             local_dir=str(MODEL_CACHE_DIR),
#             local_dir_use_symlinks=False,
#             local_files_only=True,
#         )
#         logger.info("Loaded diarization model from local cache.")
#         return Path(path)
#     except LocalEntryNotFoundError:
#         if not HUGGINGFACE_TOKEN:
#             raise RuntimeError(
#                 "Cached diarization model not found. Set HUGGINGFACE_TOKEN and run once online."
#             )
#         login(HUGGINGFACE_TOKEN)
#         path = snapshot_download(
#             repo_id=MODEL_ID,
#             cache_dir=str(MODEL_CACHE_DIR),
#             local_dir=str(MODEL_CACHE_DIR),
#             local_dir_use_symlinks=False,
#         )
#         logger.info("Downloaded diarization model and cached locally.")
#         return Path(path)


# def _load_diarization_pipeline() -> Pipeline:
#     """
#     Load the diarization pipeline (singleton pattern).
#     """
#     global _diarization_pipeline
#     if _diarization_pipeline is not None:
#         return _diarization_pipeline

#     local_model_path = _resolve_diarization_model_path()
#     pipeline = Pipeline.from_pretrained(local_model_path)
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     pipeline.to(device)
#     _diarization_pipeline = pipeline
#     logger.info(f"Diarization pipeline loaded on {device}")
#     return _diarization_pipeline


# def perform_diarization(audio_file_path: str, pipeline: Pipeline) -> list:
#     """
#     Performs speaker diarization on the given audio file.
   
#     Args:
#         audio_file_path (str): Path to the audio file.
#         pipeline (Pipeline): The loaded diarization pipeline.
   
#     Returns:
#         list: A list of diarization entries with speaker, start_time, and end_time.
#     """
#     result_list = []
   
#     try:
#         st = time.time()
#         logger.info(f"Starting diarization for {audio_file_path}")
        
#         output = pipeline(audio_file_path)
        
#         et = time.time()
#         logger.info(f"{et-st:.2f}s taken to complete the diarization process for {audio_file_path}")
        
#         for turn, speaker in output.speaker_diarization:
#             start_min = int(turn.start // 60)
#             start_sec = int(turn.start % 60)
#             end_min = int(turn.end // 60)
#             end_sec = int(turn.end % 60)
            
#             entry = {
#                 "speaker": speaker,
#                 "start_time": f"{start_min:02d}:{start_sec:02d}",
#                 "end_time": f"{end_min:02d}:{end_sec:02d}",
#                 "start_seconds": turn.start,
#                 "end_seconds": turn.end
#             }
#             result_list.append(entry)
        
#         logger.info(f"Diarization completed: {len(result_list)} speaker segments found")
        
#     except Exception as e:
#         logger.exception(f"Error during diarization of {audio_file_path}: {e}")
#         raise
   
#     return result_list


# def extract_audio_segment(audio_path: str, start_seconds: float, end_seconds: float, output_path: str) -> str:
#     """
#     Extract a segment from audio file based on start and end timestamps.
   
#     Args:
#         audio_path (str): Path to the source audio file.
#         start_seconds (float): Start time in seconds.
#         end_seconds (float): End time in seconds.
#         output_path (str): Path to save the extracted segment.
   
#     Returns:
#         str: Path to the extracted audio segment.
#     """
#     audio = AudioSegment.from_file(audio_path)
#     start_ms = int(start_seconds * 1000)
#     end_ms = int(end_seconds * 1000)
   
#     segment = audio[start_ms:end_ms]
#     segment.export(output_path, format="wav")
   
#     return output_path


# def transcribe_chunk(chunk_path: str) -> str:
#     waveform, sr = torchaudio.load(chunk_path)

#     if waveform.shape[0] > 1:
#         waveform = waveform.mean(dim=0, keepdim=True)

#     if sr != TARGET_SR:
#         waveform = torchaudio.transforms.Resample(orig_freq=sr, new_freq=TARGET_SR)(waveform)

#     speech_array = waveform.squeeze().numpy()

#     inputs = processor(speech_array, sampling_rate=TARGET_SR, return_tensors="pt")
#     input_features = inputs.input_features.to(device)

#     with torch.no_grad():
#         generated_ids = model.generate(input_features, max_new_tokens=128)

#     text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

#     del waveform, inputs, input_features, generated_ids
#     torch.cuda.empty_cache()
#     gc.collect()

#     return text


# def transcribe_diarization_segments(audio_path: str, diarization_segments: list, segment_dir: str) -> list:
#     """
#     Transcribe each diarization segment by extracting and processing audio chunks.
   
#     Args:
#         audio_path (str): Path to the original audio file.
#         diarization_segments (list): List of diarization entries with timestamps.
#         segment_dir (str): Directory to save temporary segment files.
   
#     Returns:
#         list: Updated diarization segments with transcript field populated.
#     """
#     os.makedirs(segment_dir, exist_ok=True)
   
#     for idx, segment in enumerate(diarization_segments):
#         try:
#             segment_path = os.path.join(segment_dir, f"segment_{idx}.wav")
#             extract_audio_segment(
#                 audio_path,
#                 segment["start_seconds"],
#                 segment["end_seconds"],
#                 segment_path
#             )
            
#             # Transcribe the segment
#             transcript = transcribe_chunk(segment_path)
#             segment["transcript"] = transcript.strip()
            
#             logger.info(f"Segment {idx+1}/{len(diarization_segments)}: Speaker {segment['speaker']} - '{transcript[:50]}...'")
            
#         except Exception as e:
#             logger.error(f"Failed to transcribe segment {idx}: {e}")
#             segment["transcript"] = ""
   
#     return diarization_segments


# def merge_consecutive_speakers(diarization_segments: list) -> list:
#     """
#     Merge consecutive segments from the same speaker.
   
#     Args:
#         diarization_segments (list): List of diarization entries with transcripts.
   
#     Returns:
#         list: Merged diarization segments where consecutive same-speaker entries are combined.
#     """
#     if not diarization_segments:
#         return []
   
#     merged = []
#     current_segment = diarization_segments[0].copy()
   
#     for i in range(1, len(diarization_segments)):
#         next_segment = diarization_segments[i]
        
#         # If same speaker, merge with current segment
#         if next_segment["speaker"] == current_segment["speaker"]:
#             # Extend end time
#             current_segment["end_seconds"] = next_segment["end_seconds"]
#             current_segment["end_time"] = next_segment["end_time"]
            
#             # Append transcript with space
#             if next_segment.get("transcript", "").strip():
#                 current_transcript = current_segment.get("transcript", "")
#                 current_segment["transcript"] = f"{current_transcript} {next_segment['transcript']}".strip()
            
#             logger.info(f"Merged speaker {current_segment['speaker']}: extended to {current_segment['end_time']}")
#         else:
#             # Different speaker, save current and start new
#             merged.append(current_segment)
#             current_segment = next_segment.copy()
   
#     # Add the last segment
#     merged.append(current_segment)
   
#     logger.info(f"Merged {len(diarization_segments)} segments into {len(merged)} segments")
#     return merged


# # Load diarization pipeline at startup
# logger.info("Loading diarization pipeline...")
# diarization_pipeline = _load_diarization_pipeline()
# logger.info("Diarization pipeline loaded successfully")

# # -----------------------------------------------------
# # MERGE JSON TRANSCRIPTIONS
# # -----------------------------------------------------
# def merge_json_transcriptions(output_dir: str) -> str:
#     json_files = natsort.natsorted([f for f in os.listdir(output_dir) if f.endswith(".json")])
#     combined_text = ""

#     for jf in json_files:
#         with open(os.path.join(output_dir, jf), "r", encoding="utf-8") as f:
#             data = json.load(f)
#         text = data.get("transcript", "")
#         if text.strip():
#             combined_text += text.strip() + "\n\n"

#     final_path = os.path.join(output_dir, "final_transcription.txt")
#     with open(final_path, "w", encoding="utf-8") as out:
#         out.write(combined_text.strip())

#     return final_path

# # -----------------------------------------------------
# # AUDIO SPLITTER
# # -----------------------------------------------------
# def split_audio(input_file: str, chunk_length_ms: int, output_dir: str) -> List[str]:
#     os.makedirs(output_dir, exist_ok=True)
#     audio = AudioSegment.from_file(input_file)

#     duration_ms = len(audio)
#     chunk_paths = []
#     start = 0
#     idx = 1

#     while start < duration_ms:
#         end = min(start + chunk_length_ms, duration_ms)
#         chunk = audio[start:end]
#         chunk_path = os.path.join(output_dir, f"chunk_{idx}.wav")
#         chunk.export(chunk_path, format="wav")
#         chunk_paths.append(chunk_path)
#         start = end
#         idx += 1

#     return chunk_paths

# # -----------------------------------------------------
# # Health Check
# # -----------------------------------------------------
# @router.get("/health")
# def health_check():
#     return {"status": "ok", "message": "English ASR API is healthy"}


# # -----------------------------------------------------
# # MAIN TRANSCRIPTION ROUTE (ASR + DIARIZATION)
# # -----------------------------------------------------
# @router.post("/transcribe", dependencies=[Depends(verify_api_key)])
# async def english_transcription_api(request: Request, file: UploadFile = File(...)):

#     start_timestamp = datetime.utcnow().isoformat()
#     start_time = time.time()
#     client_ip = request.client.host
#     filename = file.filename

#     logger.info(
#         f"[START REQUEST] {start_timestamp} | From: {client_ip} | File: {filename}"
#     )

#     base_dir = None
#     try:
#         # -------------------------
#         # Temp directory setup
#         # -------------------------
#         req_id = uuid.uuid4().hex
#         base_dir = f"./temp/{req_id}"

#         input_dir = os.path.join(base_dir, "input")
#         chunk_dir = os.path.join(base_dir, "chunks")
#         output_dir = os.path.join(base_dir, "output")
        
#         os.makedirs(input_dir, exist_ok=True)
#         os.makedirs(chunk_dir, exist_ok=True)
#         os.makedirs(output_dir, exist_ok=True)

#         logger.info(f"Created temp directory: {base_dir}")

#         # -------------------------
#         # Save uploaded file
#         # -------------------------
#         ext = filename.split(".")[-1].lower()
#         if ext not in ["mp3", "wav", "mp4"]:
#             logger.error("Unsupported file format")
#             raise HTTPException(status_code=400, detail="File must be mp3/wav/mp4")

#         input_path = os.path.join(input_dir, f"input.{ext}")

#         with open(input_path, "wb") as f:
#             f.write(await file.read())

#         logger.info(f"Saved uploaded file → {input_path}")

#         # -------------------------
#         # Determine chunk size
#         # -------------------------
#         audio = AudioSegment.from_file(input_path)
#         duration_min = len(audio) / (1000 * 60)

#         logger.info(f"Audio duration: {duration_min:.2f} minutes")

#         # 30s chunks if <=1hr, 1min if >1hr
#         chunk_ms = 30000 if duration_min <= 60 else 60000
#         logger.info(f"Chunk size selected: {chunk_ms/1000:.0f} seconds")

#         # -------------------------
#         # Split audio
#         # -------------------------
#         chunk_paths = split_audio(input_path, chunk_ms, chunk_dir)

#         # -------------------------
#         # Transcribe chunks
#         # -------------------------
#         logger.info("Transcribing audio chunks...")
#         for idx, cp in enumerate(chunk_paths, 1):
#             text = transcribe_chunk(cp)
#             json_path = os.path.join(output_dir, f"out_{idx}.json")

#             with open(json_path, "w", encoding="utf-8") as jf:
#                 json.dump({"chunk_id": idx, "transcript": text}, jf, indent=2, ensure_ascii=False)

#         # -------------------------
#         # Merge transcriptions
#         # -------------------------
#         final_text_path = merge_json_transcriptions(output_dir)
#         with open(final_text_path, "r", encoding="utf-8") as f:
#             transcription = f.read()

#         # ------------------------------
#         # DIARIZATION WITH TRANSCRIPTION
#         # ------------------------------
#         logger.info("Performing speaker diarization...")
#         diarization_raw = perform_diarization(input_path, diarization_pipeline)
        
#         # Create directory for diarization segments
#         segment_dir = os.path.join(base_dir, "diarization_segments")
        
#         # Transcribe each diarization segment
#         logger.info("Transcribing diarization segments...")
#         diarization_with_transcript = transcribe_diarization_segments(
#             input_path,
#             diarization_raw,
#             segment_dir
#         )
        
#         # Merge consecutive same-speaker segments
#         logger.info("Merging consecutive same-speaker segments...")
#         diarization_merged = merge_consecutive_speakers(diarization_with_transcript)
        
#         # Create speaker mapping to renumber from 1
#         unique_speakers = []
#         for segment in diarization_merged:
#             if segment["speaker"] not in unique_speakers:
#                 unique_speakers.append(segment["speaker"])
        
#         speaker_mapping = {speaker: f"SPEAKER_{i+1}" for i, speaker in enumerate(unique_speakers)}
#         logger.info(f"Speaker mapping: {speaker_mapping}")
        
#         # Convert diarization to match Sarvam format
#         diarization_entries = []
#         for segment in diarization_merged:
#             diarization_entries.append({
#                 "speaker_id": speaker_mapping[segment["speaker"]],
#                 "start_time_seconds": segment["start_seconds"],
#                 "end_time_seconds": segment["end_seconds"],
#                 "transcript": segment.get("transcript", "")
#             })

#         # -------------------------
#         # Calculate processing time
#         # -------------------------
#         processing_time = round((time.time() - start_time) / 60, 2)
#         end_stamp = datetime.utcnow().isoformat()
        
#         logger.info(
#             f"[END REQUEST] {end_stamp} | File: {filename} | "
#             f"Processing Time: {processing_time} mins | Client: {client_ip}"
#         )
        
#         # -------------------------
#         # Build response
#         # -------------------------
#         response_data = {
#             "status": "success",
#             "file_name": filename,
#             "processing_time_mins": processing_time,
#             "transcription": transcription.strip(),
#             "diarized_transcript": {
#                 "entries": diarization_entries
#             }
#         }
        
#         logger.info(f"Response includes {len(diarization_entries)} diarized segments")
        
#         return JSONResponse(response_data)
#     except Exception as e:
#         logger.error(f"FATAL ERROR: {e}")
#         return JSONResponse(
#             {"detail": f"Transcription failed: {str(e)}"},
#             status_code=500
#         )
#     finally:
#         if base_dir and os.path.exists(base_dir):
#             shutil.rmtree(base_dir, ignore_errors=True)
#             logger.info(f"Cleaned temp directory: {base_dir}")
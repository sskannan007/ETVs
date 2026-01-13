import os
import subprocess
import logging
from asr_processor import FFMPEG_PATH

logger = logging.getLogger("VideoProcessor")

def extract_audio_from_video(video_path: str, output_audio_path: str) -> bool:
    """
    Extracts audio from a video file and saves it as a WAV file using FFmpeg.
    """
    logger.info(f"Extracting audio from {video_path} to {output_audio_path}")
    
    # Base command
    ffmpeg_exe = "ffmpeg"
    if FFMPEG_PATH:
        ffmpeg_exe = os.path.join(FFMPEG_PATH, "ffmpeg.exe")
        if not os.path.exists(ffmpeg_exe):
            ffmpeg_exe = "ffmpeg" # fallback

    command = [
        ffmpeg_exe,
        "-i", video_path,
        "-vn", # Disable video
        "-acodec", "pcm_s16le", # Encode as PCM 16-bit
        "-ar", "16000", # Sample rate 16kHz
        "-ac", "1", # Mono
        "-y", # Overwrite output
        output_audio_path
    ]
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        logger.info(f"FFmpeg output: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg extraction failed: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during audio extraction: {e}")
        return False

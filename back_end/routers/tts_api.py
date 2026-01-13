# routers/tts_api.py
 
#GENDER A,B,C,D,E,F,G

import os
import uuid
import time
import base64
import re
import shutil
import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
import database, models, auth
from fastapi import APIRouter, UploadFile, Form, Request, HTTPException, Depends, BackgroundTasks, File, Body
from fastapi.responses import FileResponse, StreamingResponse
import io
import zipfile
from pydub import AudioSegment
from dotenv import load_dotenv
from sarvamai import SarvamAI

# ----------------------------
# Load environment variables
# ----------------------------
# Use absolute path to find .env in the backend root
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
API_AUTH_KEY = os.getenv("API_AUTH_KEY")

# ----------------------------
# Logger
# ----------------------------
logger = logging.getLogger("TTS")

router = APIRouter(prefix="/tts", tags=["TTS"])

# ----------------------------
# Verify API Key
# ----------------------------
def verify_api_key(request: Request):
    client_key = request.headers.get("x-api-key")
    if client_key != API_AUTH_KEY:
        logger.warning(f"Unauthorized access from {request.client.host}")
        raise HTTPException(status_code=401, detail="Invalid API Key")

# ----------------------------
# SarvamAI client
# ----------------------------
def get_sarvam_client():
    if not SARVAM_API_KEY:
        logger.error("SARVAM_API_KEY is missing in environment variables")
        return None
    try:
        return SarvamAI(api_subscription_key=SARVAM_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize SarvamAI client: {e}")
        return None

# ----------------------------
# Language Mapping
# ----------------------------
LANGUAGE_MAP = {
    "Hindi": "hi-IN",
    "Telugu": "te-IN",
    "English": "en-IN"
}

# ----------------------------
# Speaker Label Mapping
# ----------------------------
VOICE_MAP = {
    "Male": {
        "A": "abhilash",
        "B": "karun",
        "C": "hitesh"
    },
    "Female": {
        "D": "anushka",
        "E": "manisha",
        "F": "vidya",
        "G": "arya"
    }
}

# ----------------------------
# Text Splitter
# ----------------------------
def split_text(text: str, max_len: int = 180) -> List[str]:
    sentences = re.split(r"[।.!?\n]+", text)
    chunks, current = [], ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if len(current) + len(s) < max_len:
            current += s + "। "
        else:
            chunks.append(current.strip())
            current = s + "। "
    if current.strip():
        chunks.append(current.strip())
    return chunks

# ----------------------------
# TTS Processor
# ----------------------------
def process_text_to_speech(
    text: str,
    language: str,
    speaker: str,
    pitch: float,
    pace: float,
    loudness: float,
    audio_format: str,
    output_dir: str
) -> str:

    logger.info("Splitting text into chunks...")
    chunks = split_text(text)
    chunk_files = []

    for idx, chunk in enumerate(chunks, 1):
        logger.info(f"Generating TTS for chunk {idx}/{len(chunks)}")

        client = get_sarvam_client()
        if not client:
            raise Exception("SarvamAI client not initialized. Check API Key.")

        res = client.text_to_speech.convert(
            text=chunk,
            target_language_code=language,
            speaker=speaker,
            pitch=pitch,
            pace=pace,
            loudness=loudness,
            output_audio_codec=audio_format,
            speech_sample_rate=22050,
            enable_preprocessing=True,
            model="bulbul:v2"
        )

        audio_bytes = base64.b64decode(res.audios[0])
        chunk_path = os.path.join(output_dir, f"chunk_{idx}.{audio_format}")

        with open(chunk_path, "wb") as f:
            f.write(audio_bytes)

        chunk_files.append(chunk_path)

    logger.info("Combining chunks into final audio...")
    combined = AudioSegment.empty()

    for f in chunk_files:
        combined += AudioSegment.from_file(f, format=audio_format)
        os.remove(f)

    final_path = os.path.join(output_dir, f"final.{audio_format}")
    combined.export(final_path, format=audio_format)

    logger.info(f"Final TTS audio saved at: {final_path}")
    return final_path

# ----------------------------
# TTS API Endpoint (FILE MANDATORY)
# ----------------------------
@router.post("/generate-tts", dependencies=[Depends(verify_api_key)])
async def generate_tts(
    request: Request,
    background_tasks: BackgroundTasks,
    language: str = Form("English"),
    gender: str = Form("Female"),
    speaker: str = Form("D"),
    pitch: float = Form(0.4),
    pace: float = Form(0.95),
    loudness: float = Form(1.0),
    audio_format: str = Form("wav"),
    file: UploadFile = None
):

    start_timestamp = datetime.utcnow().isoformat()
    start_time = time.time()
    client_ip = request.client.host
    uid = str(uuid.uuid4())[:8]

    logger.info(f"[START REQUEST] {start_timestamp} | From: {client_ip} | UID: {uid}")

    base_dir = os.path.join("temp_tts", uid)
    os.makedirs(base_dir, exist_ok=True)

    try:
        # ------------------------
        # File Validation (MANDATORY)
        # ------------------------
        if not file:
            raise HTTPException(
                status_code=400,
                detail="Please upload a file"
            )

        content = (await file.read()).decode("utf-8")

        if not content.strip():
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )

        # ------------------------
        # Resolve Language
        # ------------------------
        lang_key = language.title()
        lang_code = LANGUAGE_MAP.get(lang_key, "en-IN")

        # ------------------------
        # Resolve Speaker Label → Actual Voice
        # ------------------------
        gender_key = gender.title()
        speaker_key = speaker.upper()

        if gender_key not in VOICE_MAP or speaker_key not in VOICE_MAP[gender_key]:
            raise HTTPException(
                status_code=400,
                detail="Invalid speaker selection. Use Male: A/B/C or Female: D/E/F/G"
            )

        actual_speaker = VOICE_MAP[gender_key][speaker_key]

        logger.info(
            f"Language: {lang_key} | Gender: {gender_key} | Label: {speaker_key} | Voice: {actual_speaker}"
        )

        # ------------------------
        # Generate TTS
        # ------------------------
        final_audio_path = process_text_to_speech(
            text=content,
            language=lang_code,
            speaker=actual_speaker,
            pitch=pitch,
            pace=pace,
            loudness=loudness,
            audio_format=audio_format,
            output_dir=base_dir
        )

        processing_time = round((time.time() - start_time) / 60, 2)
        end_stamp = datetime.utcnow().isoformat()

        logger.info(f"[END REQUEST] {end_stamp} | UID: {uid} | Time: {processing_time} mins")

        background_tasks.add_task(shutil.rmtree, base_dir, ignore_errors=True)

        return FileResponse(final_audio_path, filename=os.path.basename(final_audio_path))

    except Exception as e:
        logger.error(f"FATAL ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@router.get("/uploads")
def get_tts_uploads(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    uploads = db.query(models.TtsUpload).filter(models.TtsUpload.user_email == current_user.email).order_by(models.TtsUpload.uploaded_at.desc()).all()
    return {"uploads": uploads}

@router.post("/upload-text")
async def upload_text(file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    content = (await file.read()).decode("utf-8")
    new_upload = models.TtsUpload(
        user_email=current_user.email,
        filename=file.filename,
        file_path=file.filename, # Provide dummy file_path as it's NOT NULL
        text_content=content,
        language=None, # It's nullable anyway
        status="uploaded"
    )
    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)
    return new_upload

@router.post("/select-uploads")
def select_uploads(data: dict = Body(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    ids = data.get("ids", [])
    db.query(models.TtsUpload).filter(models.TtsUpload.id.in_(ids)).update({"selected_for_processing": True, "selected_at": datetime.utcnow()}, synchronize_session=False)
    db.commit()
    return {"message": "Uploads selected for processing"}

@router.post("/generate-preview")
async def generate_preview(request: Request, current_user: models.User = Depends(auth.get_current_user)):
    try:
        data = await request.json()
    except:
        # Fallback to form if json fails
        form_data = await request.form()
        data = dict(form_data)
    
    text = data.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required for TTS generation")

    language = data.get("language", "English")
    gender = data.get("gender", "Female")
    speaker_label = data.get("speaker", "anushka") # Frontend sends anushka/abhilash etc now
    pitch = float(data.get("pitch", 0.4))
    pace = float(data.get("pace", 0.95))
    loudness = float(data.get("loudness", 1.0))
    audio_format = data.get("audio_format", "wav")

    # Resolve Voice
    lang_code = LANGUAGE_MAP.get(language.title(), "en-IN")
    
    # The frontend is now sending the actual voice name (anushka, abhilash, etc.)
    # in the 'speaker' field based on my previous check of TTSHome.jsx voiceOptions.
    # However, VOICE_MAP uses labels A, B, C...
    # Let's handle both or just use the speaker directly if it's already a voice name.
    
    actual_voice = speaker_label.lower() 
    # Check if it needs mapping (in case it was a label)
    gender_key = gender.title()
    if gender_key in VOICE_MAP and speaker_label.upper() in VOICE_MAP[gender_key]:
        actual_voice = VOICE_MAP[gender_key][speaker_label.upper()]

    uid = str(uuid.uuid4())[:8]
    output_dir = os.path.join("uploads", "tts_previews", uid)
    os.makedirs(output_dir, exist_ok=True)

    try:
        final_audio_path = process_text_to_speech(
            text=text,
            language=lang_code,
            speaker=actual_voice,
            pitch=pitch,
            pace=pace,
            loudness=loudness,
            audio_format=audio_format,
            output_dir=output_dir
        )
        
        # Construct URL for frontend
        relative_path = final_audio_path.replace("\\", "/").split("uploads/")[-1]
        audio_url = f"/uploads/{relative_path}"
        
        response_data = {
            "generated_count": 1,
            "preview_files": [
                {
                    "filename": os.path.basename(final_audio_path),
                    "text_preview": text[:50] + "...",
                    "audio_url": audio_url,
                    "processing_time": "Real-time",
                    "text": text,
                    "language": language,
                    "speaker": actual_voice
                }
            ]
        }
        return response_data
    except Exception as e:
        logger.error(f"Preview generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/confirm-and-store")
def confirm_and_store(data: dict = Body(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    generated_audio = data.get("generated_audio", {})
    preview_files = generated_audio.get("preview_files", [])
    
    stored_count = 0
    for file_info in preview_files:
        new_record = models.TtsRecord(
            tts_upload_id=0, # Placeholder
            user_email=current_user.email,
            text_content=file_info.get("text") or "",
            language=file_info.get("language") or "unknown",
            speaker=file_info.get("speaker") or "unknown",
            gender="unknown",
            audio_path=file_info.get("audio_url") or "",
            audio_url=file_info.get("audio_url") or "",
            from_manual_input=True # If coming from preview confirm, it's usually manual or confirmed preview
        )
        db.add(new_record)
        stored_count += 1
    
    db.commit()
    return {"message": "TTS records stored successfully", "stored_count": stored_count}

# ----------------------------
# TTS Admin Endpoints
# ----------------------------

@router.get("/admin/records")
def get_tts_admin_records(user_email: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(models.TtsRecord)
    if user_email and user_email != 'all':
        query = query.filter(models.TtsRecord.user_email == user_email)
    
    records = query.order_by(models.TtsRecord.created_at.desc()).all()
    return {"records": records}

@router.get("/admin/records/{record_id}/download")
def download_tts_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = db.query(models.TtsRecord).filter(models.TtsRecord.id == record_id).first()
    if not record or not record.audio_path:
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # audio_path might be "/uploads/..." 
    relative_path = record.audio_path.lstrip("/")
    physical_path = os.path.join(os.getcwd(), relative_path)
    
    if not os.path.exists(physical_path):
        raise HTTPException(status_code=404, detail="Physical audio file missing")
        
    return FileResponse(physical_path, media_type="audio/wav", filename=os.path.basename(physical_path))

@router.get("/admin/records/download-all")
def download_all_tts_records(user_email: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(models.TtsRecord)
    if user_email and user_email != 'all':
        query = query.filter(models.TtsRecord.user_email == user_email)
    
    records = query.all()
    if not records:
        raise HTTPException(status_code=404, detail="No records found")
        
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for record in records:
            if record.audio_path:
                rel_path = record.audio_path.lstrip("/")
                phys_path = os.path.join(os.getcwd(), rel_path)
                if os.path.exists(phys_path):
                    zip_file.write(phys_path, f"{record.id}_{os.path.basename(phys_path)}")
    
    zip_buffer.seek(0)
    filename = "all_tts_records.zip" if not user_email or user_email == 'all' else f"{user_email.split('@')[0]}_tts_records.zip"
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/admin/records/{record_id}")
def delete_tts_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = db.query(models.TtsRecord).filter(models.TtsRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully"}

@router.post("/admin/records/{record_id}/reassign")
def reassign_tts_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = db.query(models.TtsRecord).filter(models.TtsRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    # For TTS, reassigning might mean putting the source TtsUpload back to 'uploaded' status
    if record.tts_upload_id:
        db.query(models.TtsUpload).filter(models.TtsUpload.id == record.tts_upload_id).update({"status": "uploaded", "selected_for_processing": False})
        
    db.delete(record)
    db.commit()
    return {"message": "Record reassigned and source updated"}

# ----------------------------
# Health Check
# ----------------------------
@router.get("/")
def tts_health():
    return {"status": "ok", "message": "SarvamAI TTS API is healthy"}

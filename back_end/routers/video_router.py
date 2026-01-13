from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
import database, models, schemas, auth
from typing import List, Optional
from datetime import datetime
import os
import asr_processor
import video_processor
import logging

logger = logging.getLogger("VideoRouter")

router = APIRouter(prefix="/user", tags=["Video ASR"])

@router.get("/video-tasks", response_model=dict)
def get_video_tasks(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = db.query(models.VideoTask).filter(models.VideoTask.user_email == current_user.email).all()
    return {"tasks": tasks}

@router.post("/process-video/{task_id}")
async def process_video(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.VideoTask).filter(models.VideoTask.id == task_id, models.VideoTask.user_email == current_user.email).first()
    if not task:
        # Check if user is admin, maybe they can process any task? 
        # Frontend shows current user tasks, so stick with owner check
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.status == "completed" and task.extracted_text:
        return {"message": "Video already processed", "extracted_text": task.extracted_text}
    
    task.status = "processing"
    db.commit()
    
    # Resolve physical path
    video_rel_path = task.video_path.lstrip("/")
    video_phys_path = os.path.join(os.getcwd(), video_rel_path)
    
    if not os.path.exists(video_phys_path):
        task.status = "failed"
        task.error_message = "Video file missing on server"
        db.commit()
        raise HTTPException(status_code=404, detail="Video file not found")
        
    # Extract audio
    output_dir = os.path.join("uploads", "video_audio_temp")
    os.makedirs(output_dir, exist_ok=True)
    audio_phys_path = os.path.join(output_dir, f"{task.id}_audio.wav")
    
    success = video_processor.extract_audio_from_video(video_phys_path, audio_phys_path)
    if not success:
        task.status = "failed"
        task.error_message = "Audio extraction failed"
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to extract audio from video")
        
    try:
        # Transcribe
        transcription = asr_processor.transcribe_audio_file(audio_phys_path, task.language)
        task.extracted_text = transcription
        task.status = "completed"
        task.processed_at = datetime.utcnow()
        db.commit()
        
        # Cleanup temp audio
        if os.path.exists(audio_phys_path):
            os.remove(audio_phys_path)
            
        return {"status": "success", "extracted_text": transcription}
    except Exception as e:
        task.status = "failed"
        task.error_message = str(e)
        db.commit()
        logger.error(f"Video transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset-video-task/{task_id}")
def reset_video_task(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.VideoTask).filter(models.VideoTask.id == task_id, models.VideoTask.user_email == current_user.email).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = "assigned"
    task.extracted_text = None
    task.error_message = None
    db.commit()
    return {"message": "Task reset successfully"}

@router.post("/share-video-text/{task_id}")
def share_video_text(task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = db.query(models.VideoTask).filter(models.VideoTask.id == task_id, models.VideoTask.user_email == current_user.email).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.shared_with_admin = True
    
    # Also save to AudioTranscription table for admin visibility if that's where admin looks
    new_transcription = models.AudioTranscription(
        user_email=current_user.email,
        filename=task.video_filename or "unknown_video",
        audio_path=task.video_path or "",
        transcription_text=task.extracted_text or "No text",
        language=task.language or "unknown",
        confirmed_at=datetime.utcnow()
    )
    db.add(new_transcription)
    db.commit()
    return {"message": "Text shared and stored successfully"}

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
import database, models, schemas, auth
from typing import List, Optional
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import timedelta
import os
import traceback
import logging
from jose import JWTError, jwt
import asr_processor

logger = logging.getLogger("Main")

router = APIRouter(tags=["User & Files"])

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        password=hashed_password,
        firstname=user.firstname,
        lastname=user.lastname,
        dob=user.dob,
        contactno=user.contactno,
        place=user.place,
        city=user.city,
        state=user.state,
        pincode=user.pincode,
        gender=user.gender
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.get("/user/uploaded-audio-files")
def get_user_audio_files(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    files = db.query(models.AudioFile).filter(models.AudioFile.user_id == current_user.id).all()
    return {"files": files}

@router.post("/user/extract-audio-transcription")
async def extract_transcription(req: schemas.TranscriptionRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    audio_file = db.query(models.AudioFile).filter(models.AudioFile.id == req.file_id, models.AudioFile.user_id == current_user.id).first()
    if not audio_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    audio_file.status = "processing"
    db.commit()
    
    # Resolve physical path
    # audio_file.audio_url might be like "/uploads/foo.mp3"
    relative_path = audio_file.audio_url.lstrip("/") # "uploads/foo.mp3"
    physical_path = os.path.join(os.getcwd(), relative_path)
    
    try:
        transcription = asr_processor.transcribe_audio_file(physical_path, req.language)
        audio_file.extracted_text = transcription
        audio_file.status = "completed"
        db.commit()
        return {"status": "success", "message": "Transcription extraction completed", "transcription": transcription}
    except Exception as e:
        audio_file.status = "failed"
        db.commit()
        logger.error(f"Transcription failed: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/confirm-audio-transcription")
def confirm_transcription(req: schemas.TranscriptionConfirm, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    audio_file = db.query(models.AudioFile).filter(models.AudioFile.id == req.file_id, models.AudioFile.user_id == current_user.id).first()
    if not audio_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    audio_file.confirmed = True
    
    # Also save to AudioTranscription table for History
    new_transcription = models.AudioTranscription(
        user_email=current_user.email,
        filename=audio_file.filename or "unknown",
        audio_path=audio_file.audio_url or "",
        transcription_text=audio_file.extracted_text or "No text", # Ensure NOT NULL
        language=req.language or "unknown",
        confirmed_at=datetime.utcnow()
    )
    db.add(new_transcription)
    db.commit()
    return {"status": "success", "message": "Transcription confirmed and saved"}

@router.post("/api/forgot-password")
async def forgot_password(email_req: dict = Body(...), db: Session = Depends(database.get_db)):
    email = email_req.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # For security reasons, don't reveal if user exists, but here we can be helpful for now
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a reset token (short-lived: 15 mins)
    reset_token_expires = timedelta(minutes=15)
    reset_token = auth.create_access_token(
        data={"sub": user.email, "type": "reset"}, 
        expires_delta=reset_token_expires
    )

    # Email configuration
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    mail_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    
    mail_port_str = os.getenv("MAIL_PORT", "587")
    try:
        mail_port = int(mail_port_str) if mail_port_str.strip() else 587
    except ValueError:
        mail_port = 587
        
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    logger.info(f"Attempting forgot password for {email}")

    if not mail_username or not mail_password:
        # Fallback for debugging if not set
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        logger.warning(f"Email service not configured. Reset Link: {reset_link}")
        return {"message": "Email service not configured. Check server logs for the reset link."}

    try:
        msg = MIMEMultipart()
        msg['From'] = mail_username
        msg['To'] = email
        msg['Subject'] = "Password Reset Request - ETV"

        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        body = f"""
        Hi {user.firstname},

        You requested a password reset for your ETV account.
        Click the link below to set a new password:

        {reset_link}

        This link will expire in 15 minutes.
        If you didn't request this, please ignore this email.
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(mail_server, mail_port)
        server.starttls()
        server.login(mail_username, mail_password)
        server.send_message(msg)
        server.quit()
        
        return {"message": "Password reset link sent to your email"}
    except Exception as e:
        error_msg = f"Forgot password error: {str(e)}"
        logger.error(error_msg)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@router.post("/api/reset-password")
async def reset_password(req: dict = Body(...), db: Session = Depends(database.get_db)):
    token = req.get("token")
    new_password = req.get("new_password")
    
    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and new password required")

    try:
        # Decode the token (reusing auth secrets)
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Token expired or invalid")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    user.password = auth.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/languages")
def get_languages():
    return ["English", "Hindi", "Telugu"]

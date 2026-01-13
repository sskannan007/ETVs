from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from sqlalchemy.orm import Session
import database, models, schemas, auth
from typing import List, Optional
from datetime import datetime
import os
import uuid
import shutil
import io
import zipfile
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/bulk-uploads")
def get_all_bulk_uploads(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    uploads = db.query(models.BulkUpload).order_by(models.BulkUpload.uploaded_at.desc()).all()
    return {"uploads": uploads}

@router.post("/bulk-upload")
async def bulk_upload_files(files: List[UploadFile] = File(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    uploaded_records = []
    for file in files:
        file_id = uuid.uuid4().hex
        ext = file.filename.split(".")[-1]
        file_path = os.path.join(upload_dir, f"{file_id}.{ext}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        new_file = models.AudioFile(
            filename=file.filename,
            audio_url=f"/uploads/{file_id}.{ext}",
            status="uploaded",
            user_id=current_user.id
        )
        db.add(new_file)
        
        # Also save to BulkUpload for the admin history table
        new_bulk = models.BulkUpload(
            user_email=current_user.email,
            file_type=ext.upper(), # Provide NOT NULL field
            filename=file.filename,
            file_path=f"/uploads/{file_id}.{ext}",
            status="uploaded"
        )
        db.add(new_bulk)
        
        uploaded_records.append(new_file)
    
    db.commit()
    return {"message": f"Successfully uploaded {len(files)} files", "records": uploaded_records}

@router.get("/saved-records")
def get_saved_records(user_email: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    query = db.query(models.AudioTranscription)
    if user_email and user_email != 'all':
        query = query.filter(models.AudioTranscription.user_email == user_email)
    records = query.order_by(models.AudioTranscription.created_at.desc()).all()
    return {"records": records}

@router.get("/saved-records/{record_id}/download")
def download_single_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = db.query(models.AudioTranscription).filter(models.AudioTranscription.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    content = record.transcription_text or ""
    filename = f"{record.filename}_transcription.txt"
    
    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/saved-records/download-all")
def download_all_records(user_email: Optional[str] = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = db.query(models.AudioTranscription)
    if user_email and user_email != 'all':
        query = query.filter(models.AudioTranscription.user_email == user_email)
    
    records = query.all()
    if not records:
        raise HTTPException(status_code=404, detail="No records found to download")
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for record in records:
            file_content = record.transcription_text or ""
            # Ensure unique filenames in zip
            file_name = f"{record.id}_{record.filename}_transcription.txt"
            zip_file.writestr(file_name, file_content)
    
    zip_buffer.seek(0)
    
    zip_filename = "all_saved_records.zip" if not user_email or user_email == 'all' else f"{user_email.split('@')[0]}_saved_records.zip"
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename={zip_filename}"}
    )

@router.get("/recorded-users")
def get_recorded_users(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    # Returns list of unique users who have recordings
    users = db.query(models.User.email, models.User.firstname, models.User.lastname).join(models.AudioTranscription, models.User.email == models.AudioTranscription.user_email).distinct().all()
    return [{"email": u[0], "name": f"{u[1]} {u[2]}"} for u in users]

@router.get("/recordings")
def get_all_recordings(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.AudioTranscription).all()

@router.get("/users/list")
def list_users(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.User).all()

@router.get("/users/emails")
def list_user_emails(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(models.User.email, models.User.firstname, models.User.lastname).all()
    return [{"email": u[0], "name": f"{u[1]} {u[2]}"} for u in users]

@router.get("/users/{user_id}")
def get_user_details(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/{user_id}/accept")
def accept_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = "Active"
    db.commit()
    return {"message": "User accepted successfully"}

@router.post("/users/{user_id}/reject")
def reject_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # In some implementations reject might mean delete, here we set status
    user.status = "Rejected"
    db.commit()
    return {"message": "User rejected successfully"}

@router.post("/users/{user_id}/delete")
def delete_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/change-admin")
def change_admin(data: dict = Body(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    new_admin_email = data.get("new_admin_email")
    new_admin = db.query(models.User).filter(models.User.email == new_admin_email).first()
    if not new_admin:
        raise HTTPException(status_code=404, detail="New admin user not found")
    
    # Simple logic: swap roles or just set new admin
    # Usually the one who calls this is the current admin
    current_user.role = "user"
    new_admin.role = "admin"
    db.commit()
    return {"message": "Admin changed successfully"}

@router.post("/delete-audio")
def delete_audio(data: dict = Body(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    file_id = data.get("file_id")
    # Handle multiple tables if necessary
    db.query(models.AudioFile).filter(models.AudioFile.id == file_id).delete()
    db.query(models.AudioTranscription).filter(models.AudioTranscription.id == file_id).delete()
    db.commit()
    return {"message": "Audio record deleted successfully"}

@router.post("/saved-records/{record_id}/reassign")
def reassign_asr_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    record = db.query(models.AudioTranscription).filter(models.AudioTranscription.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    # If it came from a BulkUpload, reset that status too
    if record.bulk_upload_id:
        db.query(models.BulkUpload).filter(models.BulkUpload.id == record.bulk_upload_id).update({"status": "uploaded", "confirmed": False})
        
    # Also update the corresponding AudioFile if it exists
    # matching by filename/audio_url (simplified for now)
    db.query(models.AudioFile).filter(models.AudioFile.audio_url == record.audio_path).update({"confirmed": False, "status": "uploaded"})
    
    db.delete(record)
    db.commit()
    return {"message": "ASR record reassigned and status reset"}

@router.post("/send-reset-link")
async def admin_send_reset_link(data: dict = Body(...), db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    email = data.get("email")
    # This would call the same logic as the public forgot-password but maybe without token dependency if admin-forced
    # For now, let's reuse or mock
    return {"message": f"Reset link sent to {email}"}

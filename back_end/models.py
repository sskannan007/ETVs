from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    dob = Column(Date, nullable=True) # Changed to Date to match DB
    contactno = Column(String, nullable=True)
    place = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    role = Column(String, default="user")
    status = Column(String, default="Pending") # Pending, Active, Rejected
    is_active = Column(Boolean, default=True)
    password_reset_requested = Column(Boolean, default=False)
    account_created_at = Column(DateTime, default=datetime.datetime.utcnow)

    audio_files = relationship("AudioFile", back_populates="owner")

class AudioFile(Base):
    __tablename__ = "audio_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    audio_url = Column(String)
    extracted_text = Column(Text, nullable=True)
    confirmed = Column(Boolean, default=False)
    status = Column(String, default="uploaded") # uploaded, processing, completed
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="audio_files")

class AudioTranscription(Base):
    __tablename__ = "audio_transcriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    bulk_upload_id = Column(Integer)
    filename = Column(String)
    audio_path = Column(String)
    transcription_text = Column(Text, nullable=True)
    language = Column(String)
    confirmed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String, nullable=True)
    processing_time = Column(String, nullable=True)

class BulkUpload(Base):
    __tablename__ = "bulk_uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    file_type = Column(String)
    filename = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="uploaded")
    processed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    confirmed = Column(Boolean, default=False)
    processing_duration = Column(String, nullable=True)

class TtsUpload(Base):
    __tablename__ = "tts_uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    filename = Column(String)
    file_path = Column(String)
    text_content = Column(Text, nullable=True)
    language = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="uploaded")
    selected_for_processing = Column(Boolean, default=False)
    selected_at = Column(DateTime, nullable=True)

class TtsRecord(Base):
    __tablename__ = "tts_records"

    id = Column(Integer, primary_key=True, index=True)
    tts_upload_id = Column(Integer)
    user_email = Column(String)
    text_content = Column(Text, nullable=True)
    language = Column(String)
    speaker = Column(String)
    gender = Column(String)
    pitch = Column(Integer, nullable=True)
    pace = Column(Integer, nullable=True)
    loudness = Column(Integer, nullable=True)
    audio_format = Column(String)
    audio_path = Column(String)
    audio_url = Column(String)
    processing_time = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    from_manual_input = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

class VideoTask(Base):
    __tablename__ = "video_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    video_filename = Column(String)
    video_path = Column(String)
    extracted_text = Column(Text, nullable=True)
    status = Column(String, default="assigned") # assigned, processing, completed, failed
    language = Column(String)
    shared_with_admin = Column(Boolean, default=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

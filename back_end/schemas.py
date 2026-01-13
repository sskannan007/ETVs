from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    firstname: str
    lastname: str
    dob: Optional[Any] = None
    contactno: Optional[str] = None
    place: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    gender: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    status: str
    is_active: bool
    account_created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class AudioFileBase(BaseModel):
    filename: str
    audio_url: str

class AudioFileCreate(AudioFileBase):
    pass

class AudioFile(AudioFileBase):
    id: int
    extracted_text: Optional[str] = None
    confirmed: bool
    status: str
    uploaded_at: datetime
    user_id: int

    class Config:
        orm_mode = True

class AudioTranscription(BaseModel):
    id: int
    user_email: str
    filename: str
    audio_path: str
    transcription_text: Optional[str] = None
    language: str
    confirmed_at: Optional[datetime] = None
    created_at: datetime
    processing_time: Optional[str] = None

    class Config:
        orm_mode = True

class TtsUpload(BaseModel):
    id: int
    user_email: str
    filename: str
    file_path: str
    text_content: Optional[str] = None
    language: Optional[str] = None
    uploaded_at: datetime
    status: str

    class Config:
        orm_mode = True

class TtsRecord(BaseModel):
    id: int
    user_email: str
    text_content: Optional[str] = None
    language: str
    speaker: str
    gender: Optional[str] = None
    pitch: Optional[int] = None
    pace: Optional[int] = None
    loudness: Optional[int] = None
    audio_format: str
    audio_path: str
    audio_url: str
    processing_time: Optional[str] = None
    from_manual_input: bool
    created_at: datetime

    class Config:
        orm_mode = True

class BulkUpload(BaseModel):
    id: int
    user_email: str
    file_type: str
    filename: str
    file_path: str
    uploaded_at: datetime
    status: str
    processed_at: Optional[datetime] = None
    confirmed: bool

    class Config:
        orm_mode = True

class VideoTask(BaseModel):
    id: int
    user_email: str
    video_filename: str
    video_path: str
    extracted_text: Optional[str] = None
    status: str
    language: str
    shared_with_admin: bool
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class TranscriptionRequest(BaseModel):
    file_id: int
    language: str

class TranscriptionConfirm(BaseModel):
    file_id: int
    language: str

# main.py

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
import logging
import logging.config
import datetime
import traceback
from dotenv import load_dotenv

# Load environment variables at the very beginning
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Import database and models
import database, models, schemas, auth
from routers.user_router import router as user_router
from routers.admin_router import router as admin_router


# Initialize database
models.Base.metadata.create_all(bind=database.engine)

# Standardize database schema (migration for missing columns)
from sqlalchemy import text
def migrate_db():
    try:
        with database.engine.connect() as conn:
            # Check for from_manual_input in tts_records
            check_col = conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'tts_records' AND column_name = 'from_manual_input');")).fetchone()[0]
            if not check_col:
                print("Migrating database: Adding column 'from_manual_input' to 'tts_records'...")
                conn.execute(text("ALTER TABLE tts_records ADD COLUMN from_manual_input BOOLEAN DEFAULT FALSE;"))
                conn.commit()
                print("Migration successful.")
    except Exception as e:
        print(f"Migration error: {e}")

migrate_db()

# Import routers
from routers.eng_asr_api import router as english_router
from routers.hin_asr_api import router as hin_asr_router
from routers.tel_asr_api import router as telugu_router
from routers.tts_api import router as tts_api
from routers.video_router import router as video_router

from fastapi.staticfiles import StaticFiles

# -----------------------------
# App Initialization for ASTR and TTS
# -----------------------------
app = FastAPI(
    title="ETV ASR API",
    description="Automatic Speech Recognition APIs for English, Hindi, and Telugu, plus TTS",
    version="1.0.0"
)

# Serve static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -----------------------------
# Logging Setup (Centralized)
# -----------------------------
os.makedirs("routers/logs", exist_ok=True)

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(name)s - %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "main_file": {
            "class": "logging.FileHandler",
            "filename": "routers/logs/main.log",
            "formatter": "default",
            "encoding": "utf8",
        },
        "english_file": {
            "class": "logging.FileHandler",
            "filename": "routers/logs/english_asr_api.log",
            "formatter": "default",
            "encoding": "utf8",
        },
        "hindi_file": {
            "class": "logging.FileHandler",
            "filename": "routers/logs/hindi_asr_api.log",
            "formatter": "default",
            "encoding": "utf8",
        },
        "telugu_file": {
            "class": "logging.FileHandler",
            "filename": "routers/logs/telugu_asr_api.log",
            "formatter": "default",
            "encoding": "utf8",
        },
        "tts_file": {
            "class": "logging.FileHandler",
            "filename": "routers/logs/tts_api.log",
            "formatter": "default",
            "encoding": "utf8",
        },
    },
    "loggers": {
        "Main": {
            "handlers": ["console", "main_file"],
            "level": "INFO",
            "propagate": False,
        },
        "EnglishASR": {
            "handlers": ["console", "english_file"],
            "level": "INFO",
            "propagate": False,
        },
        "HindiASR": {
            "handlers": ["console", "hindi_file"],
            "level": "INFO",
            "propagate": False,
        },
        "TeluguASR": {
            "handlers": ["console", "telugu_file"],
            "level": "INFO",
            "propagate": False,
        },
        "TTS": {
            "handlers": ["console", "tts_file"],
            "level": "INFO",
            "propagate": False,
        },
    },
})

logger = logging.getLogger("Main")
logger.info("Logging initialized successfully")

# -----------------------------
# CORS Middleware
# -----------------------------
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Middleware caught error: {e}")
        traceback.print_exc()
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "error": str(e)}
        )

# -----------------------------
# Auth Endpoints
# -----------------------------
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# -----------------------------
# Root Health Endpoint
# -----------------------------
@app.get("/")
def root():
    logger.info("Health check called")
    return {"status": "ok", "message": "ETV ASR APIs are running successfully"}

# -----------------------------
# Include Routers
# -----------------------------
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(english_router)
app.include_router(hin_asr_router)
app.include_router(telugu_router)
app.include_router(tts_api)
app.include_router(video_router)

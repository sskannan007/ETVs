# Base image
FROM python:3.10-slim

# Set timezone to IST (Asia/Kolkata) and avoid tzdata prompts
ENV DEBIAN_FRONTEND=noninteractive TZ=Asia/Kolkata

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy requirements first for caching
COPY requirements.txt .

# Install system dependencies for audio processing + timezone data
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Make sure logs directory exists
RUN mkdir -p /app/routers/logs

# Expose FastAPI port
EXPOSE 8000

# CMD with logging enabled
# - access.log  => access logs
# - error.log   => gunicorn error logs + traceback
CMD ["gunicorn", "main:app", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--workers", "2", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "600", \
     "--access-logfile", "/app/routers/logs/access.log", \
     "--error-logfile", "/app/routers/logs/error.log", \
     "--log-level", "info"]

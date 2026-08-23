# ── Hugging Face Spaces — Flask + PyTorch (CPU) backend ──────────────────────
FROM python:3.10-slim

# HF Spaces runs as a non-root user on port 7860
ENV PORT=7860
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch first (much smaller image, ~1GB saved)
RUN pip install --no-cache-dir \
    torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app.py .

# HF Spaces expects port 7860
EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

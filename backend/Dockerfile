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

# Copy LoRA adapter files from repo root (one level up — handled at build time)
# These are COPY'd separately so Docker layer cache is efficient
COPY adapter_config.json .
COPY adapter_model.safetensors .
COPY tokenizer.json .
COPY tokenizer_config.json .
COPY chat_template.jinja .

# Point the app at the adapter files in the working directory
ENV ADAPTER_DIR=/app
ENV BASE_MODEL_ID=Qwen/Qwen2.5-0.5B-Instruct
ENV CORS_ORIGINS=*

# HF Spaces expects port 7860
EXPOSE 7860

CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "2", "--timeout", "600", "app:app"]

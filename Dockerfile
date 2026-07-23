FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code and models
COPY backend/ ./backend/
COPY *.json *.safetensors ./

# Expose port
EXPOSE 7860

# Run the FastAPI app
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "7860"]

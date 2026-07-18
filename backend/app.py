"""
AI PowerPoint Prompt Generator — Flask Backend (Production-Ready)

Dev:        python app.py
Production: gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 600 app:app
"""

import os
import time
import logging
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

# ─────────────────────────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Config  (all overridable via environment variables on Render)
# ─────────────────────────────────────────────────────────────────────────────
# Adapter files live one level above backend/ in the repo root
ADAPTER_DIR = Path(
    os.environ.get("ADAPTER_DIR", Path(__file__).parent.parent)
).resolve()

BASE_MODEL_ID = os.environ.get("BASE_MODEL_ID", "Qwen/Qwen2.5-0.5B-Instruct")

# CORS_ORIGINS: comma-separated list of allowed origins, or * for all
_raw = os.environ.get("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in _raw.split(",")] if _raw != "*" else "*"

logger.info(f"Adapter dir : {ADAPTER_DIR}")
logger.info(f"Base model  : {BASE_MODEL_ID}")
logger.info(f"CORS origins: {CORS_ORIGINS}")

# ─────────────────────────────────────────────────────────────────────────────
# Device
# ─────────────────────────────────────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Device: {DEVICE}")

# ─────────────────────────────────────────────────────────────────────────────
# Model globals  (loaded once at startup)
# ─────────────────────────────────────────────────────────────────────────────
tokenizer = None
model = None
model_loaded = False
load_error: str | None = None


def load_model():
    """Load tokenizer, base model, apply LoRA adapter, merge and unload."""
    global tokenizer, model, model_loaded, load_error
    try:
        logger.info("Loading tokenizer …")
        tokenizer = AutoTokenizer.from_pretrained(
            str(ADAPTER_DIR), trust_remote_code=True
        )

        logger.info(f"Loading base model: {BASE_MODEL_ID} …")
        dtype = torch.float16 if DEVICE == "cuda" else torch.float32
        base = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_ID,
            torch_dtype=dtype,
            device_map="auto" if DEVICE == "cuda" else None,
            trust_remote_code=True,
        )

        logger.info("Applying LoRA adapter …")
        peft_model = PeftModel.from_pretrained(
            base, str(ADAPTER_DIR), torch_dtype=dtype
        )

        logger.info("Merging LoRA weights …")
        model = peft_model.merge_and_unload()
        if DEVICE == "cpu":
            model = model.to(DEVICE)
        model.eval()
        model_loaded = True
        logger.info("✅ Model ready.")
    except Exception as exc:
        load_error = str(exc)
        logger.exception("❌ Model loading failed")


# ─────────────────────────────────────────────────────────────────────────────
# Prompt helpers
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = (
    "You are an expert PowerPoint presentation designer. "
    "Generate a detailed, professional, and structured PowerPoint presentation prompt "
    "with slide-by-slide breakdown, design requirements, visual descriptions, and speaker notes."
)


def _build_messages(data: dict) -> list:
    if "messages" in data:
        msgs = list(data["messages"])
    else:
        msgs = [{"role": "user", "content": str(data.get("message", ""))}]
    if not msgs or msgs[0].get("role") != "system":
        msgs = [{"role": "system", "content": SYSTEM_PROMPT}] + msgs
    return msgs


def generate_response(data: dict) -> str:
    prompt = tokenizer.apply_chat_template(
        _build_messages(data), tokenize=False, add_generation_prompt=True
    )
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)

    t0 = time.time()
    with torch.no_grad():
        ids = model.generate(
            **inputs,
            max_new_tokens=int(data.get("max_tokens", 1024)),
            temperature=float(data.get("temperature", 0.7)),
            top_p=float(data.get("top_p", 0.9)),
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )
    logger.info(f"Generated in {time.time() - t0:.1f}s")

    new_ids = ids[:, inputs["input_ids"].shape[1]:]
    return tokenizer.decode(new_ids[0], skip_special_tokens=True).strip()


# ─────────────────────────────────────────────────────────────────────────────
# Flask application
# ─────────────────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "model": "loaded" if model_loaded else ("error" if load_error else "loading"),
        "load_error": load_error,
        "device": DEVICE,
        "base_model": BASE_MODEL_ID,
    })


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if not model_loaded:
        return jsonify({
            "success": False,
            "error": load_error or "Model is still loading. Please wait."
        }), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON body."}), 400
    if "message" not in data and "messages" not in data:
        return jsonify({"success": False, "error": "'message' or 'messages' required."}), 400
    if "message" in data and not str(data["message"]).strip():
        return jsonify({"success": False, "error": "Message cannot be empty."}), 400

    try:
        return jsonify({"success": True, "response": generate_response(data)})
    except Exception as exc:
        logger.exception("Generation error")
        return jsonify({"success": False, "error": str(exc)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# Startup — load model before accepting requests
# ─────────────────────────────────────────────────────────────────────────────
load_model()   # runs on import (works for both gunicorn and direct python)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

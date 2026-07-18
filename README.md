# 🎯 AI PPT Generator

A full-stack AI chatbot that generates professional PowerPoint presentation prompts using a fine-tuned **Qwen2.5-0.5B-Instruct** model with a custom LoRA adapter.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Flask](https://img.shields.io/badge/Flask-2.3-black?logo=flask) ![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-yellow?logo=huggingface) ![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel) ![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

---

## ✨ Features

- 💬 **ChatGPT-style interface** — natural language conversations
- 🧠 **Fine-tuned LoRA model** — generates slide-by-slide PowerPoint prompts
- 📋 **Copy & Download** — save outputs as `.txt`
- 🗂️ **Chat history** — multiple sessions stored in localStorage
- 🌙 **Dark glassmorphism UI** — Framer Motion animations
- ⚡ **Production-ready** — Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Python, Flask, Flask-CORS, Gunicorn |
| AI Model | Qwen2.5-0.5B-Instruct + LoRA (PEFT) |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start (Local)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🌐 Deployment

See the full step-by-step guide for deploying on **Render** and **Vercel**:

### Environment Variables

**Frontend (Vercel)**
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` |

**Backend (Render)**
| Variable | Value |
|---|---|
| `CORS_ORIGINS` | `https://your-app.vercel.app` |
| `BASE_MODEL_ID` | `Qwen/Qwen2.5-0.5B-Instruct` |

---

## 📁 Project Structure

```
promte_ai/
├── adapter_config.json         ← LoRA adapter config
├── adapter_model.safetensors   ← LoRA trained weights
├── tokenizer.json              ← Qwen tokenizer
├── tokenizer_config.json
├── backend/
│   ├── app.py                  ← Flask REST API
│   ├── requirements.txt
│   └── Procfile                ← Render start command
└── frontend/
    ├── src/
    │   ├── api/                ← Axios client
    │   ├── components/         ← Chat UI components
    │   ├── context/            ← ChatContext (state)
    │   ├── hooks/              ← useChat interaction logic
    │   └── pages/              ← Chat page
    ├── vercel.json             ← SPA routing
    └── vite.config.js
```

---

## 📄 License

MIT

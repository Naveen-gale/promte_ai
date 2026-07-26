# Prompte AI Deployment Guide

This guide covers how to deploy your AI PowerPoint Prompt Generator to the web. Since PyTorch/Hugging Face models require significant memory and long-running processes, the standard approach is to split the deployment:

- **Frontend (React/Vite)**: Deployed to **Vercel** (Optimized for fast static hosting).
- **Backend (FastAPI)**: Deployed to **Render** (Optimized for running Python servers and AI models).

---

## Part 1: Deploying the Backend to Render

*Note: Vercel serverless functions have strict timeout (10s) and memory (250MB) limits, so they cannot run a PyTorch model. Render is perfect for this.*

### 1. Push to GitHub
Ensure your latest code (including the updated `app.py`) is committed and pushed to a GitHub repository.

### 2. Create a Web Service on Render
1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New** > **Web Service**.
2. Connect your GitHub account and select your repository.
3. Configure the service:
   - **Name**: `prompte-ai-backend` (or similar)
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Instance Type**: 
   - The `Qwen2.5-0.5B-Instruct` model requires about 1.5GB to 2GB of RAM.
   - The free tier (512MB RAM) will likely crash with an Out Of Memory (OOM) error. You should select the **Starter ($7/mo)** or **Standard** tier which provides enough RAM to load the AI model.

### 3. Add Environment Variables
Scroll down to **Environment Variables** and add the following:
- `PYTHON_VERSION` = `3.10` (Forces Render to use a modern Python version)
- `BASE_MODEL_ID` = `Qwen/Qwen2.5-0.5B-Instruct`
- `ADAPTER_ID` = `n99av80n/ppt-prompt-model`
- `CORS_ORIGINS` = `*` *(You can restrict this to your Vercel domain later for security)*

### 4. Deploy
Click **Create Web Service**. 
- Render will install PyTorch and Transformers (this may take a few minutes).
- Once it says **Live**, copy your backend URL (e.g., `https://prompte-ai-backend.onrender.com`).
- Test it by visiting `https://your-url.onrender.com/health` in your browser.

---

## Part 2: Deploying the Frontend to Vercel

### 1. Configure the API URL
Before deploying to Vercel, make sure your frontend is configured to talk to your new Render backend instead of `localhost`.
- If you use `.env` variables (like `VITE_API_URL`), you will configure that in Vercel.
- If it's hardcoded in your frontend files (like `src/hooks/useChat.js`), make sure it points to the Render URL or reads from an environment variable.

### 2. Create a Project on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import the exact same GitHub repository.
3. Configure the project:
   - **Project Name**: `prompte-ai`
   - **Framework Preset**: `Vite` (Vercel should auto-detect this).
   - **Root Directory**: Click **Edit**, select `frontend`, and save.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Add Environment Variables
If your frontend relies on an environment variable for the backend URL, add it here:
- **Key**: `VITE_API_URL` (or whatever variable you use)
- **Value**: `https://prompte-ai-backend.onrender.com` (Your Render URL)

### 4. Deploy
Click **Deploy**. 
Vercel will quickly build your frontend and assign it a live URL.

---

## Part 3: Final Verification

1. Open your new Vercel URL.
2. Send a test message to generate a PowerPoint prompt.
3. **Important Note on First Run**: The very first request will take longer (sometimes 30-60 seconds) because the Render backend will download the Qwen model and your LoRA adapter from Hugging Face into memory. Subsequent requests will be much faster.

If you encounter issues, check the **Logs** tab in your Render dashboard—it will show the model downloading and any errors if they occur!

# 🚀 Prompte AI: Complete Free Hosting Guide

To host this AI application entirely for free without errors, we will use a split architecture. AI models require significant RAM (which most free tiers don't offer), but **Hugging Face Spaces** provides a generous free tier perfect for this. For the frontend, **Vercel** is the gold standard for React/Vite apps.

**Architecture:**
*   **Backend (AI API):** Hugging Face Spaces (Free tier offers 16GB RAM, 2 vCPUs)
*   **Frontend (React/Vite):** Vercel (100% Free for hobbyists)

---

## Part 1: Host the Backend on Hugging Face Spaces

Hugging Face Spaces supports Gradio, which natively supports our FastAPI backend.

### 1. Create a Hugging Face Account & Space
1. Go to [huggingface.co](https://huggingface.co/) and create a free account.
2. Click on your profile picture (top right) -> **New Space**.
3. **Space name:** `promte-ai-backend` (or similar)
4. **License:** MIT (or your choice)
5. **Select the Space SDK:** Choose **Gradio**. *(Note: Gradio is 100% free and supports FastAPI!)*
6. **Space Hardware:** Keep it on the free **CPU basic (16GB · 2 vCPU)**.
7. Click **Create Space**.

### 2. Upload the Backend Files
Hugging Face Spaces are Git repositories, but you can upload files directly via the browser interface.
Navigate to your new Space's **Files** tab and click **Add file > Upload files**.

You need to upload the following files from your local project into the **root** of the Hugging Face Space:

1.  From the `backend/` folder:
    *   `app.py`
    *   `requirements.txt`
2.  From the root of your local project (the AI adapter files):
    *   `adapter_config.json`
    *   `adapter_model.safetensors`
    *   `tokenizer.json`
    *   `tokenizer_config.json`
    *   `chat_template.jinja`

> [!WARNING]
> Make sure `app.py` and `requirements.txt` are placed in the **root directory** of your Space alongside the model files, otherwise the app will fail to run!

### 3. Build & Get Your API URL
Once you commit those files, Hugging Face will automatically start building your Gradio application. 
1. Watch the **Logs** tab to ensure it installs PyTorch and the model without errors.
2. Once the status says **Running**, click the three dots (`...`) in the top right corner of the Space and select **Embed this Space**.
3. Copy the **Direct URL** provided (it usually looks like `https://username-promte-ai-backend.hf.space`).

This is your `VITE_API_URL` for the frontend.

---

## Part 2: Host the Frontend on Vercel

### 1. Push Your Frontend Code to GitHub
1. Create a new repository on [GitHub](https://github.com/).
2. Push your `promte_ai` project (or just the `frontend` folder) to this GitHub repository.

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com/) and create a free account.
2. Click **Add New...** -> **Project**.
3. Connect your GitHub account and import the repository you just created.
4. **Crucial Setup Step:**
   *   If your frontend is inside a `frontend` folder, edit the **Root Directory** setting and select `frontend`.
   *   Framework Preset should auto-detect **Vite**.
5. Open the **Environment Variables** section. Add the following variable:
   *   **Name:** `VITE_API_URL`
   *   **Value:** `https://username-promte-ai-backend.hf.space` *(Paste the Direct URL from Hugging Face)*
6. Click **Deploy**.

### 3. Verify
Vercel will build your React application in seconds. Once finished, click on the preview URL. Your frontend is now live and securely communicating with your free Hugging Face AI backend!

---

## Why this is the best setup:
*   **Cost:** $0.00 forever.
*   **Performance:** HF gives 16GB RAM which is enough for the `Qwen2.5-0.5B-Instruct` model and your LoRA adapter. Traditional free hosts like Render/Heroku only give 512MB RAM, which would cause "Out of Memory" errors.
*   **Uptime:** Vercel never sleeps. HF Spaces sleep after 48 hours of inactivity, but wake up automatically on the first request (taking ~1-2 minutes to boot).

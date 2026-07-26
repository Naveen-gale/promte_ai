# Prompte AI Deployment Guide (All 100% Free Alternatives)

Because AI models require at least **1.5GB to 2GB of RAM** to load into memory, standard free hosts (like Render, Heroku, Railway) which only offer 512MB will crash instantly. Hugging Face Spaces also recently started charging for Python apps.

If you don't want to pay, here are the **top 5 completely free alternatives** in existence for hosting high-memory Python applications.

---

## 1. Oracle Cloud "Always Free" Tier (The Best 24/7 Option)
Oracle Cloud gives you a permanent **ARM server with 24GB of RAM and 4 CPUs completely for free, forever.**
- **Pros**: It runs 24/7, gives you a permanent public IP address, and has huge amounts of RAM.
- **Cons**: Registration is notoriously strict (requires credit card verification to block bots), and you have to configure the Linux server via the command line yourself.

---

## 2. GitHub Codespaces (The Easiest Temporary Cloud)
Every GitHub user gets **120 free core-hours per month** of GitHub Codespaces. It gives you a powerful Linux machine (8GB RAM) directly in your browser.
- **Pros**: 8GB RAM, instant setup, no credit card required, and GitHub automatically provides a public URL for your running backend.
- **Cons**: You are limited to 120 hours per month (about 5 days of 24/7 uptime). When you close the browser, the server shuts down to save your hours.
- **How to use**: 
  1. Go to your GitHub repository and click the green **Code** button.
  2. Switch to the **Codespaces** tab and click **Create codespace**.
  3. Once the VS Code editor loads in your browser, open the terminal and run: 
     `pip install -r requirements.txt` and `uvicorn app:app --host 0.0.0.0 --port 8000`.
  4. GitHub will show a pop-up saying "Your application running on port 8000 is available". Click the link, make it public, and use that URL in your Vercel frontend!

---

## 3. Lightning AI Studios (The Developer Option)
Lightning AI provides a generous free tier for developers, giving you **16GB of RAM** on their basic CPU instances.
- **Pros**: Massive 16GB RAM, persistent file storage (it saves your downloaded models unlike Colab).
- **Cons**: It "sleeps" when you aren't actively using it. You have to open their dashboard to wake it up.
- **How to use**: Sign up at [Lightning.ai](https://lightning.ai), start a new "Studio", open a terminal, install your requirements, and use a tool like `localtunnel` or `ngrok` to get a public URL.

---

## 4. Google Colab + Cloudflare Tunnel (The Free GPU Option)
Google gives away free **12GB RAM servers with GPUs**.
- **Pros**: Generates text extremely fast because it uses a GPU. No account setup required.
- **Cons**: Ephemeral (it deletes your files when you close the tab), and you have to change your frontend URL every time you run it.
- **How to use**: 
  Paste this into a Colab cell, select a T4 GPU, and click Run:
  ```python
  !git clone YOUR_GITHUB_REPO_URL
  %cd prompte_ai/backend
  !pip install -r requirements.txt
  !npm install -g localtunnel
  import subprocess, time
  subprocess.Popen(["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"])
  time.sleep(5)
  !lt --port 8000
  ```
  It will print a public URL (e.g., `https://crazy-frogs.loca.lt`) that you can plug into your Vercel frontend.

---

## 5. Host on Your Own PC (The "Always Free" Local Tunnel)
Since you are already running the backend perfectly on your own Windows computer, you can just keep running it there and expose it to the internet securely!
- **Pros**: Infinite limits (depends on your PC), 100% free forever, no cloud restrictions.
- **Cons**: Your computer must be turned on and connected to the internet for the app to work.
- **How to use**: 
  1. Start your backend on your PC like normal (`uvicorn app:app --port 8000`).
  2. Download [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/) or [ngrok](https://ngrok.com/).
  3. Run the command: `ngrok http 8000` (or `cloudflared tunnel --url http://localhost:8000`).
  4. It will give you a public URL (like `https://1234abcd.ngrok-free.app`). Put this URL into your Vercel frontend!

# Nexus Arena — Render-ready website

A responsive Flask website with a modern Orbitron-powered homepage, a math expression solver, 1v1 / 2v2 / 5v5 play-mode previews, and a demo shop with chests and coin balance.

## Run locally

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

## Deploy on Render

1. Extract this ZIP and push the contents to a new GitHub repository.
2. Sign in to Render and choose **New + → Blueprint**.
3. Connect the repository. Render reads `render.yaml` and creates the web service.
4. Wait for deployment, then open the generated `onrender.com` URL.

You can also create a **Web Service** manually with:
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

## Included

- Responsive dark neon homepage
- Orbitron headings and Inter body font (Google Fonts)
- Math Lab supports arithmetic, brackets, powers, `sqrt()`, `abs()`, `sin()`, `cos()`, `tan()`, `log()`, `ln()`, `pi`, and `e`
- Play mode selection UI for 1v1, 2v2, and 5v5
- Demo chest shop, coin balance, and daily reward

## Important demo limitations

The play buttons are UI previews, not live multiplayer matchmaking. The shop uses temporary browser-session coins and does not process payments or persist inventory. For a production version, add authentication, a database, server-side inventory, and a multiplayer game server.

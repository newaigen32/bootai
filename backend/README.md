# Boot AI – Backend

A small **Python FastAPI** server for the Boot AI chat UI.
It gets its answers from an AI model (**llama3.2**) running on your computer with **Ollama**.

```
UI (port 5173)  →  this backend (port 8000)  →  Ollama (port 11434)  →  llama3.2
```

## Project structure

Organized by feature, like the frontend's `src/` folder:

```
backend/
├── requirements.txt        # Python packages the backend needs (like package.json)
├── .env.example            # Example settings. Copy it to .env
├── .gitignore              # Keeps .venv, cache files and .env out of Git
└── app/
    ├── main.py             # Starting point: creates the app, CORS, plugs in routes (like main.tsx)
    ├── config.py           # Settings read from .env
    ├── health/
    │   └── routes.py       # GET /api/health – is the server running?
    ├── chat/
    │   ├── routes.py       # POST /api/chat – receives the message, returns the reply
    │   ├── schemas.py      # Shape of the request and response data
    │   └── service.py      # Adds Boot AI's instructions (system prompt) and asks the model
    └── llm/
        └── ollama.py       # Calls Ollama's API (like frontend's src/api/chatApi.ts)
```

**How a message flows:**
`routes.py` receives `{"message": "hi"}` → `schemas.py` checks it → `service.py` adds the system prompt → `ollama.py` asks the model → `routes.py` sends back `{"reply": "..."}`

The `__init__.py` files are empty. They just tell Python "this folder is a package", so files can import each other.

## Before you start: Ollama

1. Install Ollama from https://ollama.com/download
2. Download the model: `ollama pull llama3.2`
3. Check it works: open http://localhost:11434 → "Ollama is running"

To use a different model, run `ollama pull <model>` and set `OLLAMA_MODEL=<model>` in `.env`, then restart the backend.

## Run it on your computer (Windows)

Open a terminal in the `backend` folder:

```powershell
# 1. Create a virtual environment (only once)
python -m venv .venv

# 2. Turn it on (do this every time you open a new terminal)
.venv\Scripts\activate

# 3. Install the packages (only once, or when requirements.txt changes)
pip install -r requirements.txt

# 4. Create your settings file (only once)
copy .env.example .env

# 5. Start the server
uvicorn app.main:app --reload --port 8000
```

> If PowerShell blocks step 2, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then try again.

## Run it on the AWS instance (Ubuntu)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

`--host 0.0.0.0` lets other computers reach the server. Also open port **8000** in the instance's security group.

## Test it

- Health check: open http://localhost:8000/api/health → `{"status":"ok"}`
- Try the chat: open **http://localhost:8000/docs**, click **POST /api/chat** → **Try it out**, send:

  ```json
  { "message": "What is Docker?" }
  ```

  You get the model's answer in `reply`. The first answer can take a few seconds while the model loads.

- If Ollama isn't running or the model isn't downloaded, you get status **503** with the reason in `detail`.

## API

**POST** `/api/chat`

| | Body |
|---|---|
| Request | `{ "message": "hi" }` |
| Response | `{ "reply": "<the model's answer>" }` |
| Error | `503` with `{ "detail": "<reason>" }` when Ollama can't answer |

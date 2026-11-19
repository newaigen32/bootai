# Boot AI – Chatbot Frontend

Boot AI is a ChatGPT-style chatbot web app. This folder holds the **frontend** (the part you see in the browser), built with **React**, **TypeScript** and **Vite**.

> **Note:** The chat gets its replies from the Python backend in the `backend/` folder. Start the backend first (see `backend/README.md`), or the bot will say it couldn't reach the server. The backend uses simple fixed replies for now; an AI model comes later.

---

## What the chatbot does

| Feature | What it does |
|---|---|
| **Chat window** | Type a message and press **Enter** to send. **Shift + Enter** adds a new line. |
| **Suggestions** | On an empty chat, click a suggestion such as "Debug my code" to start quickly. |
| **Typing indicator** | Shows that Boot AI is "typing" while it waits for the backend's reply. |
| **New chat** | Click **New chat** in the sidebar to start a fresh conversation. |
| **Recent chats** | The sidebar lists your past chats, newest first. Click one to reopen it. The first message becomes the chat title. |
| **Delete chat** | Delete a chat from the sidebar. A confirm popup asks before deleting. |
| **Saved chats** | Chats are saved in your browser's `localStorage`, so they stay after you refresh the page. |
| **Login / Sign up** | Click the profile button at the bottom of the sidebar to open the login popup. It supports Google, email + password, and phone + verification code. *(Screens only for now; no real sign-in yet.)* |

The **Library**, **Plugins**, **Settings** and **Help** buttons are placeholders for future features.

---

## Project structure

```
frontend/
├── index.html              # The HTML page the app loads into
├── package.json            # Project info, dependencies and npm scripts
├── vite.config.ts          # Vite settings
├── public/                 # Static files (favicon, icons)
└── src/
    ├── main.tsx            # Starting point – loads <App />
    ├── App.tsx             # Main layout: sidebar + chat + popups
    ├── api/
    │   └── chatApi.ts          # Sends messages to the backend (POST /api/chat)
    ├── chat/
    │   ├── chat.tsx            # Chat screen: messages, input box, suggestions
    │   └── useConversations.ts # Stores chats, gets replies from the backend, saves to localStorage
    ├── sidebar/
    │   └── sidebar.tsx         # Left menu: new chat, recent chats, profile
    ├── login/
    │   └── loginmodal.tsx      # Login / sign-up popup
    └── popup/
        ├── popup.tsx           # Reusable popup window
        └── confirmdialog.tsx   # "Are you sure?" dialog
```

---

## How to run it in the browser

### 1. Install the requirements

- **Node.js** version **20.19 or newer** (version 22 LTS recommended). npm comes with Node.js.
- Check what you have:

  ```bash
  node -v
  npm -v
  ```

  If Node.js is missing or too old, download it from https://nodejs.org.

### 2. Get the code

```bash
git clone https://github.com/newaigen32/bootai.git
cd bootai
git checkout feature/backend
cd frontend
```

### 3. Install the packages

```bash
npm install
```

This downloads everything listed in `package.json` into a `node_modules` folder. You only need to run it once, and again whenever `package.json` changes.

### 4. Start the app

```bash
npm run dev
```

You will see output like this:

```
  VITE  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. Boot AI is now running.

When you save a code change, the page updates by itself. To stop the server, press **Ctrl + C** in the terminal.

---

## All npm commands

| Command | What it does |
|---|---|
| `npm install` | Installs all the packages the project needs. |
| `npm run dev` | Starts the development server at http://localhost:5173 with live reload. |
| `npm run build` | Checks the TypeScript code, then creates an optimized production build in the `dist/` folder. |
| `npm run preview` | Serves the `dist/` build locally (at http://localhost:4173) so you can test it before deploying. Run `npm run build` first. |
| `npm run lint` | Checks the code for mistakes and style problems using Oxlint. |

---

## Troubleshooting

- **`npm: command not found`**: Node.js is not installed. Install it from https://nodejs.org and open a new terminal.
- **Port 5173 is already in use**: Vite picks the next free port (for example 5174). Use the address shown in the terminal.
- **Clear all saved chats**: open the browser's DevTools (F12) → **Application** → **Local Storage** → delete the `bootai.conversations` key.

---

## Backend address

By default the frontend calls the backend at `http://localhost:8000`.
To use a different address (for example, your AWS instance), copy `.env.example` to `.env` and change it:

```
VITE_API_URL=http://<public-ip>:8000
```

Restart `npm run dev` (or run `npm run build` again) after changing `.env`.

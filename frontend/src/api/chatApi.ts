// Talks to the Boot AI backend (backend/app/chat/routes.py)

// Backend address. Set VITE_API_URL in frontend/.env to change it (e.g. on AWS).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

type ChatResponse = {
  reply: string
}

/** Sends the user's message to POST /api/chat and returns the bot's reply. */
export async function sendChatMessage(message: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Backend returned status ${response.status}`)
  }

  const data = (await response.json()) as ChatResponse
  return data.reply
}

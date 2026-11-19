import { useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../api/chatApi'

export type Message = {
  id: string
  role: 'user' | 'bot'
  text: string
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

const STORAGE_KEY = 'bootai.conversations'
const TITLE_MAX_LENGTH = 40
const ERROR_REPLY = "Sorry, I couldn't reach the Boot AI server. Make sure the backend is running and try again."

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Conversation[]) : []
  } catch {
    return []
  }
}

function saveConversations(conversations: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {
    // Storage full or blocked — chats still work for this session
  }
}

function makeTitle(text: string) {
  const singleLine = text.replaceAll(/\s+/g, ' ')
  return singleLine.length > TITLE_MAX_LENGTH
    ? `${singleLine.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`
    : singleLine
}

function newMessage(role: Message['role'], text: string): Message {
  return { id: crypto.randomUUID(), role, text }
}

/** Holds all chats, the open chat, and gets bot replies from the backend. */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [typingIds, setTypingIds] = useState<string[]>([])
  // Requests still waiting for a reply, so they can be cancelled
  const pendingRequests = useRef(new Map<string, AbortController>())

  useEffect(() => saveConversations(conversations), [conversations])

  // Cancel waiting requests on unmount
  useEffect(() => {
    const requests = pendingRequests.current
    return () => requests.forEach((controller) => controller.abort())
  }, [])

  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)
  const activeConversation = conversations.find((c) => c.id === activeId) ?? null
  const isTyping = activeId !== null && typingIds.includes(activeId)

  function appendMessage(conversationId: string, message: Message) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
          : c,
      ),
    )
  }

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage = newMessage('user', trimmed)
    let conversationId = activeId

    if (conversationId === null) {
      const created: Conversation = {
        id: crypto.randomUUID(),
        title: makeTitle(trimmed),
        messages: [userMessage],
        updatedAt: Date.now(),
      }
      conversationId = created.id
      setConversations((prev) => [created, ...prev])
      setActiveId(created.id)
    } else {
      appendMessage(conversationId, userMessage)
    }

    const id = conversationId
    setTypingIds((prev) => [...prev, id])

    // Ask the backend for a reply (see src/api/chatApi.ts)
    const controller = new AbortController()
    pendingRequests.current.set(id, controller)

    sendChatMessage(trimmed, controller.signal)
      .then((reply) => appendMessage(id, newMessage('bot', reply)))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return // chat was deleted — ignore
        console.error('Chat request failed:', error)
        appendMessage(id, newMessage('bot', ERROR_REPLY))
      })
      .finally(() => {
        if (pendingRequests.current.get(id) === controller) pendingRequests.current.delete(id)
        setTypingIds((prev) => prev.filter((typingId) => typingId !== id))
      })
  }

  function deleteConversation(id: string) {
    pendingRequests.current.get(id)?.abort()
    pendingRequests.current.delete(id)
    setTypingIds((prev) => prev.filter((typingId) => typingId !== id))
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  return {
    conversations: sortedConversations,
    activeId,
    activeConversation,
    isTyping,
    selectConversation: setActiveId,
    startNewChat: () => setActiveId(null),
    sendMessage,
    deleteConversation,
  }
}

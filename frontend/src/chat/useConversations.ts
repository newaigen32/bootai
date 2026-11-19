import { useEffect, useRef, useState } from 'react'

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
const FAKE_REPLY_DELAY_MS = 900

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

/** Holds all chats, the open chat, and a placeholder bot reply (UI only). */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [typingIds, setTypingIds] = useState<string[]>([])
  const replyTimers = useRef(new Map<string, number>())

  useEffect(() => saveConversations(conversations), [conversations])

  // Clear pending fake replies on unmount
  useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach((timer) => window.clearTimeout(timer))
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

    // UI only — replace this with a call to your chatbot API
    const timer = window.setTimeout(() => {
      appendMessage(
        id,
        newMessage('bot', 'This is a placeholder reply. Connect the backend to get real answers.'),
      )
      setTypingIds((prev) => prev.filter((typingId) => typingId !== id))
      replyTimers.current.delete(id)
    }, FAKE_REPLY_DELAY_MS)
    replyTimers.current.set(id, timer)
  }

  function deleteConversation(id: string) {
    window.clearTimeout(replyTimers.current.get(id))
    replyTimers.current.delete(id)
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

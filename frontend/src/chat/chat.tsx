import { useEffect, useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react'
import { ArrowUp, Paperclip, Sparkles } from 'lucide-react'
import type { Message } from './useConversations'
import './chat.css'

type ChatProps = Readonly<{
  messages: Message[]
  isTyping: boolean
  onSend: (text: string) => void
}>

const SUGGESTIONS = [
  'Explain a concept simply',
  'Help me write an email',
  'Brainstorm project ideas',
  'Debug my code',
]

const MAX_TEXTAREA_HEIGHT = 200

function Chat({ messages, isTyping, onSend }: ChatProps) {
  const [input, setInput] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0

  // Grow the textarea with its content, up to a max height
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
  }, [input])

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus the message box when a chat opens
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    onSend(text)
    setInput('')
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage(input)
  }

  // Enter sends, Shift+Enter adds a new line
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      sendMessage(input)
    }
  }

  const composer = (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="composer-input"
        rows={1}
        placeholder="Message Boot AI..."
        aria-label="Message"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="composer-actions">
        <button type="button" className="composer-icon" aria-label="Attach file">
          <Paperclip size={18} />
        </button>
        <button
          type="submit"
          className="composer-send"
          aria-label="Send message"
          disabled={!input.trim() || isTyping}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  )

  if (!hasMessages) {
    return (
      <div className="chat chat-empty">
        <h1>What can I help with?</h1>
        {composer}
        <div className="suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="suggestion"
              onClick={() => sendMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="chat">
      <div className="chat-messages" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.role === 'bot' && (
              <span className="bot-avatar" aria-hidden="true">
                <Sparkles size={15} />
              </span>
            )}
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <span className="bot-avatar" aria-hidden="true">
              <Sparkles size={15} />
            </span>
            <div className="typing" aria-label="Boot AI is typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-footer">
        {composer}
        <p className="chat-disclaimer">Boot AI can make mistakes. Check important info.</p>
      </div>
    </div>
  )
}

export default Chat

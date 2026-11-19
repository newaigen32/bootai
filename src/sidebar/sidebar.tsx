import './sidebar.css'
import {
  CircleQuestionMark,
  Library,
  MessageSquare,
  Puzzle,
  Settings,
  SquarePen,
  Trash2,
  User,
} from 'lucide-react'
import type { Conversation } from '../chat/useConversations'

type SidebarProps = Readonly<{
  conversations: Conversation[]
  activeId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onLoginClick: () => void
}>

function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onLoginClick,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Top zone: main actions */}
      <div className="sidebar-top">
        <button type="button" className="sidebar-item" onClick={onNewChat}>
          <span className="icon"><SquarePen size={18} /></span>{' '}
          New chat
        </button>
        <button type="button" className="sidebar-item">
          <span className="icon"><Library size={18} /></span>{' '}
          Library
        </button>
        <button type="button" className="sidebar-item">
          <span className="icon"><Puzzle size={18} /></span>{' '}
          Plugins
        </button>
      </div>

      {/* Middle zone: recent chats */}
      <nav className="sidebar-recent" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="sidebar-heading">Recent</h2>

        {conversations.length === 0 ? (
          <p className="recent-empty">Your chats will show up here.</p>
        ) : (
          <ul className="recent-list">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeId
              return (
                <li
                  key={conversation.id}
                  className={isActive ? 'recent-item active' : 'recent-item'}
                >
                  <button
                    type="button"
                    className="recent-open"
                    aria-current={isActive ? 'page' : undefined}
                    title={conversation.title}
                    onClick={() => onSelectChat(conversation.id)}
                  >
                    <MessageSquare size={15} className="recent-icon" aria-hidden="true" />
                    <span className="recent-title">{conversation.title}</span>
                  </button>
                  <button
                    type="button"
                    className="recent-delete"
                    aria-label={`Delete chat "${conversation.title}"`}
                    onClick={() => onDeleteChat(conversation.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </nav>

      {/* Bottom zone: settings, help, profile */}
      <div className="sidebar-bottom">
        <button type="button" className="sidebar-item">
          <span className="icon"><Settings size={18} /></span>{' '}
          Settings
        </button>
        <button type="button" className="sidebar-item">
          <span className="icon"><CircleQuestionMark size={18} /></span>{' '}
          Help
        </button>
        <button type="button" className="sidebar-item" onClick={onLoginClick}>
          <span className="avatar"><User size={16} /></span>{' '}
          Log in
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

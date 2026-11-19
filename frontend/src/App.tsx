import { useState } from 'react'
import Sidebar from './sidebar/sidebar'
import './App.css'
import LoginModal from './login/loginmodal'
import Chat from './chat/chat'
import { useConversations } from './chat/useConversations'
import ConfirmDialog from './popup/confirmdialog'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const {
    conversations,
    activeId,
    activeConversation,
    isTyping,
    selectConversation,
    startNewChat,
    sendMessage,
    deleteConversation,
  } = useConversations()

  const pendingDelete = conversations.find((c) => c.id === pendingDeleteId)

  function confirmDelete() {
    if (pendingDeleteId) deleteConversation(pendingDeleteId)
    setPendingDeleteId(null)
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={startNewChat}
        onSelectChat={selectConversation}
        onDeleteChat={setPendingDeleteId}
        onLoginClick={() => setIsLoginOpen(true)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ConfirmDialog
        isOpen={pendingDelete !== undefined}
        title="Delete chat?"
        message={
          <>
            Are you sure you want to delete the chat <strong>"{pendingDelete?.title}"</strong>?
            This can't be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
      <main className="main">
        <Chat
          key={activeId ?? 'new'}
          messages={activeConversation?.messages ?? []}
          isTyping={isTyping}
          onSend={sendMessage}
        />
      </main>
    </div>
  )
}

export default App

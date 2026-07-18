import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

const ChatContext = createContext(null)

const STORAGE_KEY = 'ai-ppt-chats'
const MAX_CHATS = 50

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      // Strip any stale isGenerating flags left from a previous session
      const parsed = JSON.parse(stored)
      return parsed.map(chat => ({
        ...chat,
        messages: chat.messages.map(({ isGenerating, ...rest }) => rest)
      }))
    } catch {
      return []
    }
  })

  const [activeChatId, setActiveChatId] = useState(null)

  // Keep a live ref so async callbacks can always read the latest activeChatId
  const activeChatIdRef = useRef(activeChatId)
  activeChatIdRef.current = activeChatId

  // Persist to localStorage (skip if any message is still generating)
  useEffect(() => {
    try {
      const clean = chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(({ isGenerating, ...rest }) => rest)
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
    } catch {
      // Ignore storage quota errors
    }
  }, [chats])

  const createNewChat = useCallback(() => {
    const newChat = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
      title: 'New Chat',
      updatedAt: new Date().toISOString(),
      messages: [],
    }
    setChats(prev => [newChat, ...prev].slice(0, MAX_CHATS))
    setActiveChatId(newChat.id)
    return newChat.id
  }, [])

  // Auto-create or restore active chat on first load
  useEffect(() => {
    if (chats.length === 0 && !activeChatId) {
      createNewChat()
    } else if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id)
    }
  }, [chats.length, activeChatId, createNewChat])

  const activeChat = chats.find(c => c.id === activeChatId) || null

  /** Append a message to the currently active chat */
  const addMessageToActiveChat = useCallback((message) => {
    const id = activeChatIdRef.current
    setChats(prev => prev.map(chat => {
      if (chat.id !== id) return chat
      const newMessages = [...chat.messages, message]
      let title = chat.title
      if (title === 'New Chat' && message.role === 'user') {
        title = message.content.substring(0, 35) + (message.content.length > 35 ? '…' : '')
      }
      return { ...chat, title, updatedAt: new Date().toISOString(), messages: newMessages }
    }))
  }, []) // no deps — uses ref

  /** Replace the content of the last message and clear isGenerating */
  const updateLastMessage = useCallback((content) => {
    const id = activeChatIdRef.current
    setChats(prev => prev.map(chat => {
      if (chat.id !== id || chat.messages.length === 0) return chat
      const newMessages = [...chat.messages]
      const { isGenerating: _ig, ...rest } = newMessages[newMessages.length - 1]
      newMessages[newMessages.length - 1] = { ...rest, content }
      return { ...chat, messages: newMessages }
    }))
  }, []) // no deps — uses ref

  /** Mark the last message as generating again (for regenerate) */
  const setLastMessageGenerating = useCallback(() => {
    const id = activeChatIdRef.current
    setChats(prev => prev.map(chat => {
      if (chat.id !== id || chat.messages.length === 0) return chat
      const newMessages = [...chat.messages]
      newMessages[newMessages.length - 1] = {
        ...newMessages[newMessages.length - 1],
        content: '',
        isGenerating: true
      }
      return { ...chat, messages: newMessages }
    }))
  }, [])

  const deleteChat = useCallback((id) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id)
      if (activeChatIdRef.current === id) {
        setActiveChatId(filtered.length > 0 ? filtered[0].id : null)
      }
      return filtered
    })
  }, [])

  const renameChat = useCallback((id, newTitle) => {
    setChats(prev => prev.map(chat =>
      chat.id === id ? { ...chat, title: newTitle } : chat
    ))
  }, [])

  const clearAllChats = useCallback(() => {
    setChats([])
    setActiveChatId(null)
  }, [])

  return (
    <ChatContext.Provider value={{
      chats,
      activeChatId,
      activeChat,
      setActiveChatId,
      createNewChat,
      addMessageToActiveChat,
      updateLastMessage,
      setLastMessageGenerating,
      deleteChat,
      renameChat,
      clearAllChats
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}

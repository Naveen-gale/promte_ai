import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddLine, RiChat3Line, RiDeleteBinLine, RiEditLine, RiCloseLine, RiSearchLine } from 'react-icons/ri'
import { useChat } from '../context/ChatContext'

export default function ChatSidebar({ isOpen, onClose, isMobile }) {
  const { chats, activeChatId, setActiveChatId, createNewChat, deleteChat, renameChat } = useChat()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))

  const handleRenameSubmit = (id) => {
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim())
    }
    setEditingId(null)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      {/* Header & New Chat */}
      <div className="p-4 space-y-4">
        {isMobile && (
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
              <RiCloseLine className="text-xl" />
            </button>
          </div>
        )}
        <button
          onClick={() => {
            createNewChat()
            if (isMobile) onClose()
          }}
          className="flex items-center gap-2 w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-violet-500/20"
        >
          <RiAddLine className="text-lg" />
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {filteredChats.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-8">No chats found.</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id)
                if (isMobile) onClose()
              }}
              className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                activeChatId === chat.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <RiChat3Line className={`text-lg flex-shrink-0 ${activeChatId === chat.id ? 'text-violet-400' : 'text-slate-500'}`} />
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRenameSubmit(chat.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(chat.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-black/30 border border-violet-500/50 rounded px-2 py-0.5 text-sm outline-none w-full"
                  />
                ) : (
                  <span className="truncate text-sm font-medium">{chat.title}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditTitle(chat.title)
                    setEditingId(chat.id)
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10"
                >
                  <RiEditLine />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChat(chat.id)
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-white/10"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a0e1a] border-r border-white/5 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop sidebar (always visible)
  return (
    <div className={`hidden md:flex flex-col w-72 bg-navy-900 border-r border-white/5 transition-all duration-300 ${isOpen ? 'ml-0' : '-ml-72'}`}>
      {sidebarContent}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import ChatSidebar from '../components/ChatSidebar'
import ChatArea from '../components/ChatArea'
import ChatInput from '../components/ChatInput'
import TopBar from '../components/TopBar'
import { useChat } from '../context/ChatContext'
import { useChatInteraction } from '../hooks/useChat'

export default function Chat({ settings, onSettingsClick, showToast }) {
  const { activeChat } = useChat()
  const { isGenerating, error, sendMessage, regenerateLast } = useChatInteraction(settings)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onSettingsClick={onSettingsClick}
        />

        {/* Chat Area (scrollable) */}
        <ChatArea
          messages={activeChat?.messages || []}
          onRegenerate={regenerateLast}
        />

        {/* Fixed Input at bottom */}
        <div className="w-full bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent pt-4 pb-4 px-2">
          <ChatInput
            onSendMessage={sendMessage}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  )
}

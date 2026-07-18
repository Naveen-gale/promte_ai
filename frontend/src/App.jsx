import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import FloatingBackground from './components/FloatingBackground'
import SettingsModal from './components/SettingsModal'
import Toast from './components/Toast'

import Chat from './pages/Chat'
import Settings from './pages/Settings'

import { useToast } from './hooks/useToast'
import { ChatProvider } from './context/ChatContext'

const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 1024,
  topP: 0.9,
}

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeOut' },
}

export default function App() {
  const location = useLocation()
  
  // Global settings (forwarded to generation)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ppt-settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('ppt-settings', JSON.stringify(settings))
    } catch {}
  }, [settings])

  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  
  // Toast system
  const { toasts, showToast, removeToast } = useToast()

  return (
    <ChatProvider>
      <div className="relative h-screen overflow-hidden">
        {/* Background */}
        <FloatingBackground />

        {/* Page Routes with animated transitions */}
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...PAGE_TRANSITION} className="h-full">
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <Chat
                    settings={settings}
                    onSettingsClick={() => setSettingsModalOpen(true)}
                    showToast={showToast}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings settings={settings} onSettingsChange={setSettings} />
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* Toast Notifications */}
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </ChatProvider>
  )
}

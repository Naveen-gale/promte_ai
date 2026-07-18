import { useCallback, useRef, useState } from 'react'
import { sendChatMessage } from '../api/generateApi'
import { useChat as useChatContext } from '../context/ChatContext'

/**
 * Custom hook — ALL hooks must be declared in the SAME order every render.
 * Order: useContext → useState → useState → useRef → useCallback → useCallback
 */
export function useChatInteraction(settings) {
  // ── 1. Context (always first) ─────────────────────────────────────────────
  const {
    activeChat,
    addMessageToActiveChat,
    updateLastMessage,
    setLastMessageGenerating,
  } = useChatContext()

  // ── 2. State ──────────────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  // ── 3. Ref (stable pointer to latest activeChat — avoids stale closure) ──
  const activeChatRef = useRef(activeChat)
  activeChatRef.current = activeChat

  // ── 4. sendMessage callback ───────────────────────────────────────────────
  const sendMessage = useCallback(async (content) => {
    if (!content || !content.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)

    // Snapshot current messages BEFORE state updates so we don't double-send
    const currentMessages = (activeChatRef.current?.messages || [])
      .filter(m => !m.isGenerating)
      .map(m => ({ role: m.role, content: m.content }))

    // Add user bubble + loading assistant bubble to the UI
    addMessageToActiveChat({ role: 'user', content })
    addMessageToActiveChat({ role: 'assistant', content: '', isGenerating: true })

    // Payload = existing history + new user turn
    const payload = [...currentMessages, { role: 'user', content }]

    try {
      const data = await sendChatMessage(payload, settings)

      if (data.success) {
        updateLastMessage(data.response)
      } else {
        const msg = data.error || 'Generation failed.'
        setError(msg)
        updateLastMessage('⚠️ ' + msg)
      }
    } catch (err) {
      let msg = 'An unexpected error occurred.'
      if (err.code === 'ECONNABORTED') msg = 'Request timed out. Please try again.'
      else if (err.response?.status === 503) msg = 'Model is still loading — please wait a moment.'
      else if (err.response?.data?.error) msg = err.response.data.error
      else if (!err.response) msg = 'Cannot reach the backend server. Is it running on port 5000?'

      setError(msg)
      updateLastMessage('⚠️ ' + msg)
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, addMessageToActiveChat, updateLastMessage, settings])

  // ── 5. regenerateLast callback ────────────────────────────────────────────
  const regenerateLast = useCallback(async () => {
    const chat = activeChatRef.current
    if (!chat || chat.messages.length < 2 || isGenerating) return

    const clean = chat.messages.filter(m => !m.isGenerating)
    const lastUserIdx = clean.map(m => m.role).lastIndexOf('user')
    if (lastUserIdx === -1) return

    const payload = clean
      .slice(0, lastUserIdx + 1)
      .map(m => ({ role: m.role, content: m.content }))

    setIsGenerating(true)
    setError(null)
    setLastMessageGenerating()

    try {
      const data = await sendChatMessage(payload, settings)
      if (data.success) {
        updateLastMessage(data.response)
      } else {
        const msg = data.error || 'Generation failed.'
        setError(msg)
        updateLastMessage('⚠️ ' + msg)
      }
    } catch {
      updateLastMessage('⚠️ Error regenerating. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, updateLastMessage, setLastMessageGenerating, settings])

  return { isGenerating, error, sendMessage, regenerateLast }
}

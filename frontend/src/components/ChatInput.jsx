import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiSendPlaneFill, RiStopCircleLine } from 'react-icons/ri'

export default function ChatInput({ onSendMessage, isGenerating }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSend = () => {
    if (input.trim() && !isGenerating) {
      onSendMessage(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = input.trim() && !isGenerating

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative"
      >
        {/* Glow behind the input */}
        <div
          className="absolute -inset-0.5 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.15))',
            filter: 'blur(12px)',
            opacity: canSend ? 0.8 : 0.3,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Input box */}
        <div
          className="relative flex items-end w-full rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,14,26,0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the PowerPoint presentation you want…"
            disabled={isGenerating}
            className="w-full max-h-[200px] bg-transparent border-none resize-none text-slate-200 placeholder:text-slate-600 px-5 py-4 focus:outline-none focus:ring-0 text-base leading-relaxed"
            rows={1}
          />

          <div className="flex-shrink-0 pr-3 pb-3">
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
              style={
                canSend
                  ? {
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      boxShadow: '0 0 20px rgba(124,58,237,0.5)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      cursor: 'not-allowed',
                    }
              }
            >
              {isGenerating ? (
                <RiStopCircleLine className="text-xl text-white animate-pulse" />
              ) : (
                <RiSendPlaneFill className={`text-xl ${canSend ? 'text-white' : 'text-slate-600'}`} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <p className="text-center mt-3 text-xs text-slate-600">
        Prompte AI may make mistakes. Press <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-500 text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-500 text-[10px] font-mono">Shift+Enter</kbd> for new line.
      </p>
    </div>
  )
}

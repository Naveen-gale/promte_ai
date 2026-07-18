import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RiSendPlaneFill, RiStopCircleLine } from 'react-icons/ri'

export default function ChatInput({ onSendMessage, isGenerating }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative">
      <div className="relative flex items-end w-full glass-card bg-[#0a0e1a]/80 border-white/10 p-2 shadow-2xl shadow-black/50">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the PowerPoint presentation you want..."
          disabled={isGenerating}
          className="w-full max-h-[200px] bg-transparent border-none resize-none text-slate-200 placeholder:text-slate-500 px-4 py-3 focus:outline-none focus:ring-0 text-base leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
          rows={1}
        />
        
        <div className="flex-shrink-0 p-1">
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              input.trim() && !isGenerating
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <RiStopCircleLine className="text-xl animate-pulse" />
            ) : (
               <RiSendPlaneFill className="text-xl" />
            )}
          </button>
        </div>
      </div>
      <div className="text-center mt-3 text-xs text-slate-500">
        AI PPT Generator can make mistakes. Consider verifying important information.
      </div>
    </div>
  )
}

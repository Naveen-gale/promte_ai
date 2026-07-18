import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSparklingFill } from 'react-icons/ri'
import MessageBubble from './MessageBubble'

export default function ChatArea({ messages, onRegenerate }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 glow-violet mx-auto flex items-center justify-center mb-6 shadow-2xl">
            <RiSparklingFill className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">How can I help you today?</h2>
          <p className="text-slate-400 mb-8">
            Describe the PowerPoint presentation you want to create, and I'll generate a detailed prompt for it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              "Create a presentation on Machine Learning for college students.",
              "Generate a professional business pitch about AI.",
              "I need a 15-slide deck on Cyber Security.",
              "Modern PowerPoint prompt about Cloud Computing."
            ].map((suggestion, i) => (
              <div key={i} className="glass-card p-4 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-default">
                {suggestion}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto w-full scroll-smooth">
      <div className="max-w-4xl mx-auto py-8">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <MessageBubble 
              key={index} 
              message={msg} 
              onRegenerate={index === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : undefined}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-6" />
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSparklingFill } from 'react-icons/ri'
import MessageBubble from './MessageBubble'

const suggestions = [
  "Create a presentation on Machine Learning for college students.",
  "Generate a professional business pitch about AI startups.",
  "I need a 15-slide deck on Cyber Security threats.",
  "Modern PowerPoint prompt about Cloud Computing.",
]

export default function ChatArea({ messages, onRegenerate }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl w-full text-center"
        >
          {/* Glowing orb icon */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                boxShadow: '0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(6,182,212,0.2)',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />
            <div className="relative w-20 h-20 flex items-center justify-center">
              <RiSparklingFill className="text-white text-4xl drop-shadow-lg" />
            </div>
          </div>

          <h2
            className="text-3xl font-black mb-3"
            style={{
              background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            How can I help you today?
          </h2>
          <p className="text-slate-400 mb-10 text-base leading-relaxed">
            Describe your PowerPoint presentation and I'll craft a detailed, slide-by-slide prompt for you.
          </p>

          {/* Suggestion cards with glass effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {suggestions.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="group cursor-default p-4 rounded-2xl text-sm text-slate-300 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                whileHover={{
                  background: 'rgba(124,58,237,0.08)',
                  borderColor: 'rgba(124,58,237,0.3)',
                  boxShadow: '0 4px 30px rgba(124,58,237,0.15)',
                }}
              >
                <span className="text-violet-400 font-semibold text-xs uppercase tracking-wider block mb-1.5">Try this →</span>
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto w-full scroll-smooth">
      <div className="max-w-4xl mx-auto py-6">
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

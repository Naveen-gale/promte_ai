import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  RiUser3Line, RiSparklingFill,
  RiFileCopyLine, RiCheckLine, RiDownloadLine, RiRefreshLine
} from 'react-icons/ri'

function ElapsedTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <span className="text-xs text-slate-500 tabular-nums ml-2">
      {m > 0 ? `${m}m ` : ''}{s}s
    </span>
  )
}

export default function MessageBubble({ message, onRegenerate }) {
  const isUser = message.role === 'user'
  const isGenerating = message.isGenerating
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = message.content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([message.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'presentation-prompt.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const actionBtnClass = "p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-white/8 transition-all duration-200"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex w-full py-5 ${isUser ? '' : ''}`}
      style={
        !isUser
          ? {
              background: 'rgba(255,255,255,0.018)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }
          : {}
      }
    >
      <div className={`flex max-w-3xl w-full mx-auto px-4 sm:px-8 gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
          style={
            isUser
              ? {
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }
              : {
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                }
          }
        >
          {isUser ? (
            <RiUser3Line className="text-slate-300 text-base" />
          ) : (
            <RiSparklingFill className={`text-white text-base ${isGenerating ? 'animate-pulse' : ''}`} />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-semibold text-sm text-slate-300">
              {isUser ? 'You' : 'Prompte AI'}
            </span>
          </div>

          <div className={`w-full ${isUser ? 'max-w-xl' : 'w-full'}`}>
            {isUser ? (
              /* User bubble — glass pill */
              <div
                className="inline-block px-5 py-3 rounded-2xl rounded-tr-sm text-slate-200 text-base leading-relaxed whitespace-pre-wrap max-w-full"
                style={{
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {message.content}
              </div>
            ) : isGenerating ? (
              /* Loading state */
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-3 text-violet-400 font-medium text-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-400 rounded-full flex-shrink-0"
                  />
                  <span>Generating your presentation prompt…</span>
                  <ElapsedTimer />
                </div>
                <div className="space-y-2 mt-1">
                  {[85, 70, 90, 55].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-2 rounded-full"
                      style={{
                        width: `${w}%`,
                        background: 'rgba(124,58,237,0.15)',
                      }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  ⏱️ CPU inference can take 3–5 minutes. Please wait…
                </p>
              </div>
            ) : (
              /* AI response */
              <div className="output-prose w-full">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!isUser && !isGenerating && message.content && (
            <div className="flex items-center gap-0.5 mt-3">
              <button onClick={handleCopy} className={actionBtnClass} title="Copy">
                {copied ? <RiCheckLine className="text-emerald-400" /> : <RiFileCopyLine />}
              </button>
              <button onClick={handleDownloadTxt} className={actionBtnClass} title="Download TXT">
                <RiDownloadLine />
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className={actionBtnClass} title="Regenerate">
                  <RiRefreshLine />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

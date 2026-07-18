import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  RiUser3Line, RiSparklingFill,
  RiFileCopyLine, RiCheckLine, RiDownloadLine, RiRefreshLine
} from 'react-icons/ri'

// ── Elapsed time counter shown while generating ────────────────────────────
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

// ── Main bubble component ──────────────────────────────────────────────────
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

  const actionBtnClass = "p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex w-full py-6 ${isUser ? 'justify-end' : 'justify-start bg-white/[0.02]'}`}
    >
      <div className={`flex max-w-4xl w-full mx-auto px-4 gap-4 sm:gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-slate-600 to-slate-700'
            : 'bg-gradient-to-br from-violet-600 to-cyan-500 glow-violet'
        }`}>
          {isUser ? (
            <RiUser3Line className="text-white text-lg" />
          ) : (
            <RiSparklingFill className={`text-white text-lg ${isGenerating ? 'animate-pulse' : ''}`} />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-semibold text-slate-200">{isUser ? 'You' : 'AI PPT Generator'}</span>
          </div>

          <div className={`w-full ${isUser ? 'max-w-2xl bg-white/5 rounded-2xl rounded-tr-sm px-5 py-3.5 text-slate-200' : 'prose-container'}`}>
            {isGenerating ? (
              /* ── Loading state: spinner + live elapsed timer ── */
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-3 text-violet-400 font-medium">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-400 rounded-full flex-shrink-0"
                  />
                  <span>Generating your presentation prompt…</span>
                  <ElapsedTimer />
                </div>
                {/* Skeleton loading bars */}
                <div className="space-y-2 mt-1">
                  {[90, 70, 85, 60].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-2.5 bg-white/10 rounded-full"
                      style={{ width: `${w}%` }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ⏱️ CPU inference can take 3–5 minutes. Please wait…
                </p>
              </div>
            ) : isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="output-prose w-full">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* AI Actions (only shown after generation is done) */}
          {!isUser && !isGenerating && message.content && (
            <div className="flex items-center gap-1 mt-3">
              <button onClick={handleCopy} className={actionBtnClass} title="Copy to clipboard">
                {copied ? <RiCheckLine className="text-green-400" /> : <RiFileCopyLine />}
              </button>
              <button onClick={handleDownloadTxt} className={actionBtnClass} title="Download TXT">
                <RiDownloadLine />
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className={actionBtnClass} title="Regenerate response">
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

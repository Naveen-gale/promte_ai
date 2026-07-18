import { motion } from 'framer-motion'

/**
 * Full-screen loading overlay shown while the model generates.
 * Features animated brain, pulsing rings, and live elapsed time.
 */
export default function LoadingScreen({ elapsedTime }) {
  const messages = [
    'Initializing AI model…',
    'Analyzing your presentation requirements…',
    'Generating slide structure…',
    'Crafting speaker notes…',
    'Finalizing design recommendations…',
    'Almost there…',
  ]

  // Cycle through messages based on elapsed time
  const messageIndex = Math.min(Math.floor(elapsedTime / 8), messages.length - 1)
  const currentMessage = messages[messageIndex]

  // Estimate: first run (cold) ~60s, warm ~15s
  const estimatedTime = elapsedTime < 15 ? '15–60s' : 'almost done…'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5, 8, 16, 0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex flex-col items-center gap-8 text-center max-w-md px-6">
        {/* Brain with pulsing rings */}
        <div className="relative flex items-center justify-center">
          {/* Rings */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-violet-500/30 ring-pulse"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}

          {/* Brain SVG */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 12px rgba(124,58,237,0.8))',
                'drop-shadow(0 0 28px rgba(6,182,212,0.9))',
                'drop-shadow(0 0 12px rgba(124,58,237,0.8))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl"
          >
            {/* Brain Icon — inline SVG */}
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current" aria-hidden="true">
              <path d="M13 3a4 4 0 0 1 4 4c0 .55-.11 1.08-.3 1.57A4 4 0 0 1 19 12a4 4 0 0 1-2 3.46V17a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-1.54A4 4 0 0 1 5 12a4 4 0 0 1 2.3-3.59A4 4 0 0 1 7 7a4 4 0 0 1 4-4h2zm0 2h-2a2 2 0 0 0-2 2c0 .34.09.67.24.96l.5.97-.97.5A2 2 0 0 0 7 12a2 2 0 0 0 1.5 1.94l.5.13V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.93l.5-.13A2 2 0 0 0 17 12a2 2 0 0 0-1.27-1.87l-.97-.5.5-.97c.15-.29.24-.62.24-.96a2 2 0 0 0-2-2z" />
            </svg>
          </motion.div>
        </div>

        {/* Title */}
        <div>
          <motion.h2
            className="text-2xl font-bold gradient-text mb-2"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Thinking…
          </motion.h2>
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-slate-400 text-sm"
          >
            {currentMessage}
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Generating…</span>
            <span>{elapsedTime}s elapsed</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
              animate={{ width: ['10%', '85%'] }}
              transition={{ duration: 55, ease: 'easeInOut' }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">
            Estimated time: {estimatedTime}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

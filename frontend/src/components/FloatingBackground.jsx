import { motion } from 'framer-motion'

/**
 * Animated floating gradient orbs background — purely decorative.
 */
export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Top-left violet orb */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top-right cyan orb */}
      <motion.div
        className="absolute -top-20 right-0 w-80 h-80 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Center-left violet orb */}
      <motion.div
        className="absolute top-1/3 -left-20 w-72 h-72 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Bottom-right rose orb */}
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, -15, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Bottom-left cyan small */}
      <motion.div
        className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

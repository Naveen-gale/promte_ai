import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiSparklingFill, RiMenuLine } from 'react-icons/ri'

export default function TopBar({ onMenuClick }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 h-14 z-30"
      style={{
        background: 'rgba(10, 14, 26, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <RiMenuLine className="text-xl" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}
          >
            <RiSparklingFill className="text-white text-sm" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-bold text-sm tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Prompte AI
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">PPT Generator</span>
          </div>
        </Link>
      </div>

      {/* Right side — status pill only */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-400"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Online
      </div>
    </motion.header>
  )
}

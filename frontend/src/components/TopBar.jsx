import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiSparklingFill, RiMenuLine, RiSettings3Line, RiGithubFill } from 'react-icons/ri'

export default function TopBar({ onMenuClick, onSettingsClick }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 h-14 bg-navy-900/80 backdrop-blur-md border-b border-white/5 z-30"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <RiMenuLine className="text-xl" />
        </button>
        
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 shadow-md group-hover:scale-105 transition-transform">
            <RiSparklingFill className="text-white text-sm" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-white tracking-wide">AI PPT Generator</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onSettingsClick}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title="Settings"
        >
          <RiSettings3Line className="text-lg" />
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden sm:block"
          title="GitHub"
        >
          <RiGithubFill className="text-lg" />
        </a>
      </div>
    </motion.header>
  )
}

import { motion } from 'framer-motion'
import { RiSettings3Line, RiMoonLine, RiSunLine, RiComputerLine } from 'react-icons/ri'
import { useTheme } from '../context/ThemeContext'
import SettingsModal from '../components/SettingsModal'
import { useState } from 'react'

const THEMES = [
  { value: 'dark', label: 'Dark Mode', icon: RiMoonLine, description: 'Deep navy dark background' },
  { value: 'light', label: 'Light Mode', icon: RiSunLine, description: 'Clean bright interface' },
  { value: 'system', label: 'System', icon: RiComputerLine, description: 'Follows your OS preference' },
]

export default function Settings({ settings, onSettingsChange }) {
  const { theme, setTheme } = useTheme()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen pt-24 section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black gradient-text mb-1">Settings</h1>
          <p className="text-slate-500 text-sm">Customize your experience and model parameters</p>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 mb-5"
        >
          <h2 className="font-bold text-white mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
            <RiSettings3Line className="text-violet-400" />
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                id={`theme-${value}-btn`}
                onClick={() => setTheme(value)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  theme === value
                    ? 'border-violet-500/60 bg-violet-500/10 text-violet-300'
                    : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                <Icon className="text-2xl mx-auto mb-2" />
                <div className="font-semibold text-sm mb-0.5">{label}</div>
                <div className="text-xs opacity-60">{description}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Model Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 mb-5"
        >
          <h2 className="font-bold text-white mb-1 text-sm uppercase tracking-wider flex items-center gap-2">
            <RiSettings3Line className="text-violet-400" />
            Generation Parameters
          </h2>
          <p className="text-xs text-slate-500 mb-5">Fine-tune how the model generates responses</p>

          <div className="space-y-5">
            {[
              { label: 'Temperature', key: 'temperature', min: 0.1, max: 2.0, step: 0.1 },
              { label: 'Max Tokens', key: 'maxTokens', min: 256, max: 2048, step: 64 },
              { label: 'Top P', key: 'topP', min: 0.1, max: 1.0, step: 0.05 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <label htmlFor={`settings-page-${key}`} className="text-sm font-medium text-slate-300">{label}</label>
                  <span className="text-sm font-mono font-bold gradient-text">{settings[key]}</span>
                </div>
                <input
                  id={`settings-page-${key}`}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={settings[key]}
                  onChange={(e) => onSettingsChange({ ...settings, [key]: parseFloat(e.target.value) })}
                  className="range-slider w-full"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Model Information</h2>
          <div className="space-y-3">
            {[
              { label: 'Base Model', value: 'Qwen/Qwen2.5-0.5B-Instruct' },
              { label: 'Adapter Type', value: 'LoRA (PEFT)' },
              { label: 'Rank (r)', value: '16' },
              { label: 'Alpha (α)', value: '32' },
              { label: 'Dropout', value: '0.05' },
              { label: 'Target Modules', value: 'q_proj, k_proj, v_proj, o_proj' },
              { label: 'Task Type', value: 'CAUSAL_LM' },
              { label: 'PEFT Version', value: '0.19.1' },
              { label: 'Frontend', value: 'React 18 + Vite 5 + Tailwind 3' },
              { label: 'Backend', value: 'Python Flask + Transformers' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="text-slate-300 text-sm font-mono">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <SettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </main>
  )
}

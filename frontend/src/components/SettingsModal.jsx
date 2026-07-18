import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiSettings3Line, RiCloseLine, RiThermometerLine, RiHashtag, RiPercentLine, RiInformationLine } from 'react-icons/ri'

function SliderField({ id, label, icon: Icon, value, min, max, step, onChange, displayValue }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon className="text-violet-400" />
          {label}
        </label>
        <span className="text-sm font-mono font-bold gradient-text">{displayValue ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range-slider w-full"
      />
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
  const set = (key, val) => onSettingsChange({ ...settings, [key]: val })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-card w-full max-w-md pointer-events-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                    <RiSettings3Line className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Generation Settings</h3>
                    <p className="text-xs text-slate-500">Fine-tune model parameters</p>
                  </div>
                </div>
                <button
                  id="close-settings-btn"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                >
                  <RiCloseLine />
                </button>
              </div>

              {/* Settings */}
              <div className="p-5 space-y-7">
                <SliderField
                  id="settings-temperature"
                  label="Temperature"
                  icon={RiThermometerLine}
                  value={settings.temperature}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  onChange={(v) => set('temperature', v)}
                />
                <SliderField
                  id="settings-max-tokens"
                  label="Max Tokens"
                  icon={RiHashtag}
                  value={settings.maxTokens}
                  min={256}
                  max={2048}
                  step={64}
                  onChange={(v) => set('maxTokens', v)}
                />
                <SliderField
                  id="settings-top-p"
                  label="Top P"
                  icon={RiPercentLine}
                  value={settings.topP}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  onChange={(v) => set('topP', v)}
                />

                {/* Model Info */}
                <div className="glass-card p-4 space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <RiInformationLine className="text-violet-400" />
                    Model Information
                  </h4>
                  {[
                    { label: 'Base Model', value: 'Qwen2.5-0.5B-Instruct' },
                    { label: 'Adapter', value: 'LoRA (r=16, α=32)' },
                    { label: 'Task', value: 'Causal Language Modeling' },
                    { label: 'Targets', value: 'q/k/v/o_proj' },
                    { label: 'PEFT Version', value: '0.19.1' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-300 font-mono font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-0">
                <button
                  id="save-settings-btn"
                  onClick={onClose}
                  className="btn-primary w-full py-3 text-sm font-semibold"
                >
                  <span className="relative z-10">Save & Close</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

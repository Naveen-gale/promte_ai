import { AnimatePresence, motion } from 'framer-motion'
import {
  RiCheckLine,
  RiAlertLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiCloseLine,
} from 'react-icons/ri'

const ICONS = {
  success: RiCheckLine,
  error: RiErrorWarningLine,
  warning: RiAlertLine,
  info: RiInformationLine,
}

import { forwardRef } from 'react'

const ToastItem = forwardRef(({ toast, onRemove }, ref) => {
  const Icon = ICONS[toast.type] || ICONS.info

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 80, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`toast-item toast-${toast.type}`}
      role="alert"
    >
      <Icon className="text-lg flex-shrink-0" />
      <span className="flex-1 text-sm">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <RiCloseLine className="text-sm" />
      </button>
    </motion.div>
  )
})

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

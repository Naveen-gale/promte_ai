import { useState, useCallback, useRef } from 'react'

let toastIdCounter = 0

/**
 * Custom hook for displaying toast notifications.
 * Returns: toasts array + showToast, removeToast functions.
 */
export function useToast() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = `toast-${++toastIdCounter}`
      const toast = { id, message, type }
      setToasts((prev) => [...prev, toast])

      // Auto-remove after duration
      timersRef.current[id] = setTimeout(() => {
        removeToast(id)
      }, duration)

      return id
    },
    [removeToast]
  )

  return { toasts, showToast, removeToast }
}

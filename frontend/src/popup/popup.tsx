import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './popup.css'

type PopupProps = Readonly<{
  isOpen: boolean
  onClose: () => void
  /** id of the heading inside `children` that names this popup */
  labelledBy?: string
  /** id of the text inside `children` that describes this popup */
  describedBy?: string
  /** "small" is for short confirmations; "default" is 500px wide */
  size?: 'default' | 'small'
  children: ReactNode
}>

function Popup({
  isOpen,
  onClose,
  labelledBy,
  describedBy,
  size = 'default',
  children,
}: PopupProps) {
  // Close on Escape (keyboard alternative to clicking the backdrop)
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="popup-overlay">
      <button
        type="button"
        className="popup-backdrop"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        className={size === 'small' ? 'popup popup-small' : 'popup'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        <button type="button" className="popup-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup

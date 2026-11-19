import { useEffect, useRef, type ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import Popup from './popup'
import './confirmdialog.css'

type ConfirmDialogProps = Readonly<{
  isOpen: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}>

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Focus the safe choice ("No") so pressing Enter doesn't delete by accident
  useEffect(() => {
    if (isOpen) cancelRef.current?.focus()
  }, [isOpen])

  return (
    <Popup
      isOpen={isOpen}
      onClose={onCancel}
      labelledBy="confirm-title"
      describedBy="confirm-message"
      size="small"
    >
      <div className="confirm">
        <div className="confirm-icon" aria-hidden="true">
          <Trash2 size={22} />
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message" className="confirm-message">
          {message}
        </p>

        <div className="confirm-actions">
          <button ref={cancelRef} type="button" className="confirm-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Popup>
  )
}

export default ConfirmDialog

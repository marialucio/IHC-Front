import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import './GlobalConfirm.css'

export function GlobalConfirm() {
  const { confirmDialog, resolveConfirm } = useApp()

  useEffect(() => {
    if (!confirmDialog) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        resolveConfirm(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [confirmDialog, resolveConfirm])

  if (!confirmDialog) return null

  return (
    <div className="global-confirm" role="dialog" aria-modal="true" aria-labelledby="global-confirm-title">
      <div className="global-confirm__backdrop" onClick={() => resolveConfirm(false)} />
      <div className="global-confirm__card">
        <h2 id="global-confirm-title" className="global-confirm__title">
          {confirmDialog.title}
        </h2>
        <p className="global-confirm__message">{confirmDialog.message}</p>
        <div className="global-confirm__actions">
          <button type="button" className="global-confirm__btn global-confirm__btn--cancel" onClick={() => resolveConfirm(false)}>
            {confirmDialog.cancelText}
          </button>
          <button
            type="button"
            className={`global-confirm__btn ${
              confirmDialog.tone === 'danger'
                ? 'global-confirm__btn--danger'
                : confirmDialog.tone === 'success'
                  ? 'global-confirm__btn--success'
                  : 'global-confirm__btn--confirm'
            }`}
            onClick={() => resolveConfirm(true)}
          >
            {confirmDialog.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

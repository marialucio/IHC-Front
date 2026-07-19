import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { AppAlert } from '../context/AppContext'
import './GlobalAlert.css'

const EXIT_DURATION_MS = 280
const VISIBLE_DURATION_MS = 3200

function CheckIcon() {
  return (
    <svg className="global-alert__icon" viewBox="0 0 24 24" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg className="global-alert__icon" viewBox="0 0 24 24" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="global-alert__icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3 2 21h20L12 3z" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="global-alert__icon global-alert__icon--spinner" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" strokeDasharray="15.7 50" />
    </svg>
  )
}

export function GlobalAlert() {
  const { alert, hideAlert } = useApp()
  const [renderedAlert, setRenderedAlert] = useState<AppAlert | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (!alert) return
    setRenderedAlert(alert)
    setIsLeaving(false)
  }, [alert])

  useEffect(() => {
    if (!renderedAlert || isLeaving) return

    let exitTimer: number | undefined
    const hideTimer = window.setTimeout(() => {
      setIsLeaving(true)
      exitTimer = window.setTimeout(() => hideAlert(), EXIT_DURATION_MS)
    }, VISIBLE_DURATION_MS)

    return () => {
      window.clearTimeout(hideTimer)
      if (exitTimer) window.clearTimeout(exitTimer)
    }
  }, [renderedAlert, isLeaving, hideAlert])

  useEffect(() => {
    if (alert || !renderedAlert) return
    setIsLeaving(true)

    const removeTimer = window.setTimeout(() => {
      setRenderedAlert(null)
      setIsLeaving(false)
    }, EXIT_DURATION_MS)

    return () => window.clearTimeout(removeTimer)
  }, [alert, renderedAlert])

  if (!renderedAlert) return null

  return (
    <div className="global-alert-wrap" role="status" aria-live="polite">
      <div
        className={`global-alert global-alert--${renderedAlert.type} ${
          isLeaving ? 'global-alert--leaving' : ''
        }`}
      >
        {renderedAlert.type === 'success' ? <CheckIcon /> : null}
        {renderedAlert.type === 'error' ? <ErrorIcon /> : null}
        {renderedAlert.type === 'warning' ? <WarningIcon /> : null}
        {renderedAlert.type === 'loading' ? <SpinnerIcon /> : null}
        {renderedAlert.message ? (
          <p className="global-alert__message">{renderedAlert.message}</p>
        ) : null}
      </div>
    </div>
  )
}

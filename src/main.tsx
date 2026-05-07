import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import '@/app/styles/global.css'
import App from '@/app/app'

// ── PWA Service Worker (autoUpdate) ──────────────────────────
registerSW({
  onRegistered(registration) {
    console.info('[SW] Registered:', registration)
  },
  onOfflineReady() {
    console.info('[SW] App is ready to work offline.')
  },
  onNeedRefresh() {
    // autoUpdate handles this automatically — the new SW activates on next navigation.
    console.info('[SW] New content available; will update automatically.')
  },
  onRegisterError(error) {
    console.error('[SW] Registration error:', error)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

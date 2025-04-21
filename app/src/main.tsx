import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initTelegram } from './global/telegram'
import './index.css'

try {
  initTelegram()
}
catch (error: any) {
  console.error('This is not running in Telegram Mini App, error:', error)
}

document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

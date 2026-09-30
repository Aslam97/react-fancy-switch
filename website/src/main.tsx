import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element "#root" was not found in the document.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
    {__VERCEL_DEPLOYMENT__ && <Analytics />}
  </StrictMode>
)

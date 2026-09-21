import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyTheme, getInitialTheme } from './shared/lib/theme'
import { App } from './app/App'
import 'react-datepicker/dist/react-datepicker.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"> exists in index.html')
}
applyTheme(getInitialTheme())

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import './globals.css'

// Replaces src/app/layout.tsx. The <html>/<body> shell, <title>, meta tags and
// font links all live in index.html now.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="min-h-screen text-black dark:text-white transition-colors duration-300">
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>,
)

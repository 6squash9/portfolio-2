import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Reads the theme the pre-paint script in index.html already applied, so React's
 * first render agrees with the DOM instead of flipping it on mount.
 */
function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  // useLayoutEffect, not useEffect: toggleTheme wraps the state update in
  // flushSync so the class lands synchronously, which is what lets the View
  // Transition snapshot capture the new theme.
  useLayoutEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    const next: Theme = root.classList.contains('dark') ? 'light' : 'dark'

    // Suppress every per-element CSS transition for the duration of the switch.
    // Without this, ~113 elements animate their own colors over four different
    // durations (0.15s/0.2s/0.3s/0.5s) while the gradient column — a
    // background-image, which CSS cannot transition — snaps instantly. Freezing
    // them means the whole page changes in one step, and the crossfade below is
    // the only thing the eye actually sees moving.
    root.classList.add('theme-switching')

    const apply = () => {
      flushSync(() => setTheme(next))
    }

    const startViewTransition = document.startViewTransition?.bind(document)

    if (!startViewTransition || prefersReducedMotion()) {
      apply()
      // Restore transitions once the browser has painted the new theme.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove('theme-switching'))
      })
      return
    }

    const transition = startViewTransition(apply)
    transition.finished.finally(() => root.classList.remove('theme-switching'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

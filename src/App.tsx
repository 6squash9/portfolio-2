import { lazy, Suspense, useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import { useTheme } from '@/context/ThemeContext'

// Split into separate downloads so the first paint only needs Hero. Each arrives
// a moment later and swaps out its skeleton.
const ContributionGraph = lazy(() => import('@/components/ContributionGraph'))
const Skills = lazy(() => import('@/components/Skills'))
const Projects = lazy(() => import('@/components/Projects'))
const Education = lazy(() => import('@/components/Education'))
const Contact = lazy(() => import('@/components/Contact'))
const PixelBlast = lazy(() => import('@/components/ui/pixel-blast'))

const sectionSkeleton = (
  <div className="py-10 px-6 md:px-12 w-full">
    <div className="max-w-[52rem] mx-auto">
      <div className="h-40 w-full animate-pulse rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50" />
    </div>
  </div>
)

/**
 * Decides whether to load the WebGL background at all, and defers it until the
 * browser is idle so the ~536KB three.js chunk never competes with first paint.
 *
 * Returns false permanently when the visitor has asked for reduced motion — the
 * background is a continuously animating full-screen shader, which is exactly
 * what that setting exists to suppress. The solid background behind it is a
 * complete design on its own, so there is nothing to fall back to.
 */
function useShouldRenderBackground() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    // TS's DOM lib types requestIdleCallback as always present, but Safari
    // only shipped it in 16.4 — hence the runtime check and setTimeout fallback.
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const handle = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 200)

    return () => {
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [])

  return ready
}

export default function App() {
  const { theme } = useTheme()
  const showBackground = useShouldRenderBackground()

  return (
    <div className="min-h-screen transition-colors duration-300 selection:bg-neutral-200 dark:selection:bg-neutral-800 relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-[#0b0b0b] transition-colors duration-300">
        {showBackground && (
          <Suspense fallback={null}>
            <PixelBlast
              variant="triangle"
              pixelSize={3}
              color={theme === 'dark' ? '#ffffff' : 'blue'}
              pixelSizeJitter={0.35}
              patternScale={3.75}
              patternDensity={0.75}
              speed={2}
              edgeFade={0.2}
              enableRipples={true}
              liquid={false}
            />
          </Suspense>
        )}
      </div>

      <main className="w-full relative flex justify-center">
        <div className="w-full max-w-[80rem] min-h-screen overflow-hidden bg-[linear-gradient(90deg,transparent_0%,#ffffffd9_15%,#ffffffd9_85%,transparent_100%)] dark:bg-[linear-gradient(90deg,transparent_0%,#0b0b0bd9_15%,#0b0b0bd9_85%,transparent_100%)]">
          <Hero />
          <Suspense fallback={sectionSkeleton}>
            <ContributionGraph />
          </Suspense>
          <Suspense fallback={sectionSkeleton}>
            <Projects />
          </Suspense>
          <Suspense fallback={sectionSkeleton}>
            <Skills />
          </Suspense>
          <Suspense fallback={sectionSkeleton}>
            <Education />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </div>
  )
}

import { lazy, Suspense, useMemo } from 'react'
import { Github, Link as LinkIcon, ArrowUpRight } from 'lucide-react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { useTheme } from '@/context/ThemeContext'
import { projects, contactLinks } from '@/data/site'

// Only downloaded when a project has no image — TextPressure powers the animated
// "SOON!" card, so most visits never fetch it.
const TextPressure = lazy(() => import('./TextPressure'))

export default function Projects() {
  const { theme } = useTheme()

  const cards = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        header: project.image ? (
          <div className="w-full h-60 rounded-xl overflow-hidden relative">
            {/* Wrapper is `relative` with a fixed height, so inset-0 fills it. */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 grayscale opacity-90 group-hover/bento:opacity-100 dark:opacity-100 dark:brightness-75 group-hover/bento:grayscale-0 group-hover/bento:brightness-100"
            />
          </div>
        ) : (
          <div className="w-full h-60 rounded-xl overflow-hidden relative flex items-center justify-center">
            <Suspense fallback={null}>
              <TextPressure
                text="SOON!"
                flex={false}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor={theme === 'dark' ? '#FFFFFF' : '#171717'}
                minFontSize={24}
              />
            </Suspense>
          </div>
        ),
      })),
    [theme],
  )

  return (
    <section id="projects" className="py-10 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-[52rem] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-2 decoration-neutral-400 dark:decoration-neutral-600">
            Things I've Built
          </h2>
        </div>

        <BentoGrid className="max-w-[52rem] mx-auto md:grid-cols-2 md:auto-rows-[25rem]">
          {cards.map((item, i) => (
            <BentoGridItem
              key={i}
              title={
                <div className="flex items-center justify-between w-full">
                  <h3>{item.title}</h3>
                  <div className="flex items-center gap-3">
                    {item.repo && (
                      <a
                        href={item.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              }
              description={
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-neutral-700 dark:text-neutral-400">
                    {item.description}
                  </span>
                </div>
              }
              header={item.header}
              className=""
            />
          ))}
        </BentoGrid>

        <div className="flex justify-center mt-12">
          <a
            href={contactLinks.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-900 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            More Projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

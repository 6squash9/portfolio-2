import { GraduationCap, Calendar } from 'lucide-react'
import { education, type Education as EducationEntry } from '@/data/site'

/**
 * "2021 — 2023" for finished study, "2023 — 2027 (expected)" for in-progress.
 *
 * Deriving this from years rather than storing a display string means an
 * in-progress entry can't drift out of sync with how it's labelled.
 */
function formatPeriod(entry: EducationEntry): string {
  if (entry.endYear) return `${entry.startYear} — ${entry.endYear}`
  if (entry.expectedYear) return `${entry.startYear} — ${entry.expectedYear} (expected)`
  return `${entry.startYear} — Present`
}

export default function Education() {
  return (
    <section id="education" className="py-20 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-[52rem] mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-neutral-200 flex items-center gap-2 underline underline-offset-4 decoration-2 decoration-neutral-400 dark:decoration-neutral-600">
          Education
        </h2>

        <div className="space-y-6">
          {education.map((entry, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-white/10 p-6 rounded-lg bg-white dark:bg-transparent transition-colors duration-300 hover:shadow-lg dark:hover:border-white/20"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-black dark:text-white transition-colors duration-300">
                      {entry.institution}
                    </h3>
                  </div>

                  <div className="mb-3">
                    <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400 px-3 py-1 rounded-full text-sm font-medium">
                      {entry.degree}
                    </div>
                  </div>

                  <div className="text-md font-semibold mb-2 text-black dark:text-white transition-colors duration-300">
                    {entry.field}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300 text-base">
                    {entry.description}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                      {entry.coursework}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatPeriod(entry)}
                    </div>
                    {entry.grade && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{entry.grade}</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

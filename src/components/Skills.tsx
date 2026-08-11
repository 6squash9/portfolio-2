import type { IconType } from 'react-icons'
import { motion } from 'framer-motion'
import { FaJava } from 'react-icons/fa'
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiMysql,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiSpringboot,
  SiPostgresql,
  SiGnubash,
  SiCss,
  SiHtml5,
  SiYaml,
  SiVite,
  SiVercel,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiHuggingface,
  SiNpm,
  SiGithub,
} from 'react-icons/si'
import { techStack, type TechName } from '@/data/site'

// Maps the plain strings in data/site.ts to their icons. Add an entry here when
// you add a technology to techStack.
const icons: Record<TechName, IconType> = {
  Java: FaJava,
  Bash: SiGnubash,
  // Upstream Simple Icons renamed SiCss3 -> SiCss in react-icons 5.5.
  CSS: SiCss,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  TypeScript: SiTypescript,
  Python: SiPython,
  YAML: SiYaml,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  Vite: SiVite,
  Springboot: SiSpringboot,
  Vercel: SiVercel,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Postgres: SiPostgresql,
  Redis: SiRedis,
  Supabase: SiSupabase,
  'Hugging Face': SiHuggingface,
  GitHub: SiGithub,
  npm: SiNpm,
}

export default function Skills() {
  return (
    <section id="skills" className="py-10 px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-[52rem] mx-auto">
        <h2 className="text-2xl font-bold mb-12 text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-2 decoration-neutral-400 dark:decoration-neutral-600">
          Tech Stack
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((name, idx) => {
            const Icon = icons[name]
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-default group"
              >
                <Icon className="w-5 h-5 text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

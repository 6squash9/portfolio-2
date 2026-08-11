import { Mail, BookOpen } from 'lucide-react'
import { FaJava } from 'react-icons/fa'
import { SiSpringboot, SiReact, SiJavascript } from 'react-icons/si'
import { profile, contactLinks } from '@/data/site'

export default function Hero() {
  return (
    <section className="relative pt-12 pb-8 md:pt-24 md:pb-12 px-6 md:px-12 overflow-hidden text-black dark:text-white transition-colors duration-300">
      <div className="max-w-[52rem] mx-auto z-10 w-full relative">
        <div className="flex flex-col items-start gap-10">
          {/* Header Row: Image & Name */}
          <div className="flex gap-8">
            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
              {/* Parent is `relative` with a fixed size, so absolute inset-0
                  makes the image fill it exactly at any breakpoint. */}
              <img
                src={profile.avatar}
                alt={profile.name}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl border-2 border-white dark:border-neutral-800 shadow-lg"
              />
            </div>

            <div className="flex flex-col justify-between py-1">
              {profile.handle && (
                <div className="text-sm font-bold font-mono tracking-widest text-violet-600 dark:text-violet-400">
                  {profile.handle}
                </div>
              )}
              <div>
                {/* Tailwind's preflight resets heading size/weight to inherit,
                    so the explicit classes below fully control the appearance. */}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-start space-y-8">
            <div>
              <div className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-full">
                <p className="mb-2">
                  I build scalable web applications with{' '}
                  <TechBadge>
                    <FaJava className="w-4 h-4 mr-1 text-[#007396]" /> Java
                  </TechBadge>
                  ,{' '}
                  <TechBadge>
                    <SiSpringboot className="w-4 h-4 mr-1 text-[#6DB33F]" /> Spring Boot
                  </TechBadge>
                  ,{' '}
                  <TechBadge>
                    <SiReact className="w-4 h-4 mr-1 text-[#61DAFB]" /> React
                  </TechBadge>
                  , and{' '}
                  <TechBadge>
                    <SiJavascript className="w-4 h-4 mr-1 text-[#F7DF1E]" /> JavaScript
                  </TechBadge>
                  .
                </p>
                <p className="mb-3">
                  Deeply focused on{' '}
                  {profile.bio.focus.map((item, idx) => (
                    <span key={item}>
                      <span className="font-semibold text-black dark:text-white">
                        {item}
                      </span>
                      {idx < profile.bio.focus.length - 1 ? (idx === profile.bio.focus.length - 2 ? ', and ' : ', ') : ''}
                    </span>
                  ))}
                  .
                </p>
                <p>{profile.bio.closing}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* While contactLinks.blog is still the '#' placeholder, skip
                  target="_blank" so clicking it can't open an empty tab. */}
              <a
                href={contactLinks.blog}
                target={contactLinks.blog.startsWith('http') ? '_blank' : undefined}
                rel={contactLinks.blog.startsWith('http') ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </a>
              <a
                href={`mailto:${contactLinks.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-80 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-lg font-semibold mx-1 align-middle">
      {children}
    </span>
  )
}

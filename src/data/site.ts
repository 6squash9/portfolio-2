/**
 * Single source of truth for every piece of content on the site.
 *
 * This file holds no layout, styling, or logic — just facts. Components under
 * src/components/ own how things look; this owns what they say. Editing your
 * details should never mean opening a component.
 *
 * Nothing imports this file's neighbours: dependencies point outward only, from
 * data to components.
 */

export interface Profile {
  name: string
  /**
   * Optional short alias shown in mono above the name (e.g. "aka NOVA").
   * Leave it out entirely and the hero simply doesn't render that line.
   */
  handle?: string
  role: string
  avatar: string
  bio: {
    /** Bolded terms in the "Deeply focused on …" sentence. */
    focus: readonly string[]
    /** Closing paragraph of the hero. */
    closing: string
  }
}

export const profile: Profile = {
  name: 'Suyash Mandaokar',
  role: 'Software Developer',
  avatar: '/images/profile.jpg',
  bio: {
    focus: ['AI', 'Product Management', 'Engineering'],
    closing:
      'I build scalable, reliable software with a focus on clean engineering, performance, and practical solutions. I’m passionate about exploring new technologies, AI, and innovative approaches to solving complex problems.',
  },
}

/**
 * Drives the contribution graph. Fetched from github-contributions-api.jogruber.de
 * at runtime, so it must be a real public account — an unknown handle renders an
 * error message instead of a graph.
 */
export const githubUsername = '6squash9'

export const contactLinks = {
  email: 'suyashmandaokar7@gmail.com',
  /** Drives the "Blog" button in the hero. */
  blog: 'https://suyash7.hashnode.dev/',
  linkedin: 'https://www.linkedin.com/in/suyash-mandaokar-89b4072a2/',
  twitter: 'https://x.com/suyaxhh',
  /** Also used by the "More Projects" button under the project grid. */
  github: 'https://github.com/6squash9',
} as const

export interface Project {
  title: string
  description: string
  /** Image path under /public. When null, the card shows the "SOON!" animation. */
  image: string | null
  repo: string | null
  link: string | null
  tech: string
}

export const projects: Project[] = [
  {
    title: 'PeerSend',
    description:
      'a serverless peer-to-peer file transfer web app where files stream directly browser-to-browser over encrypted WebRTC DataChannels',
    image: '/images/project-one.svg',
    repo: 'https://github.com/6squash9/p2p-share',
    link: 'https://peersend.app/',
    tech: 'React, Spring Boot, WebRTC',
  },
  {
    title: 'TradeCore',
    description:
      'A multi-stage exchange pipeline (validation → sequencing → matching → publishing) in Java, sustaining 60,000+ orders/sec under stress testing with P50 latency of ~1.2ms',
    image: '/images/project-two.svg',
    repo: 'https://github.com/6squash9/stock-exchange-simulation',
    link: null,
    tech: 'Java, Maven',
  },
  {
    title: 'Project Three',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: '/images/project-three.svg',
    repo: null,
    link: null,
    tech: 'React, Node.js',
  },
  {
    title: 'Project Four',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    image: '/images/project-four.svg',
    repo: null,
    link: null,
    tech: 'Python, FastApi',
  },
]

export interface Education {
  institution: string
  /** Rendered as the highlighted pill, e.g. "B.Tech" or "High School Diploma". */
  degree: string
  /** Course of study, shown under the pill. */
  field: string
  startYear: number
  /** Omit for education still in progress — the card then shows "Expected". */
  endYear?: number
  /** When still in progress, the year you expect to finish. */
  expectedYear?: number
  description: string
  /** Notable coursework or focus areas, shown in the mono accent line. */
  coursework: string
  /** Optional GPA, percentage, or honours. */
  grade?: string
}

/** Listed newest first — Education.tsx renders them in array order. */
export const education: Education[] = [
  {
    institution: 'Woolf University',
    degree: 'Master of Science',
    field: 'Computer Science',
    startYear: 2024,
    expectedYear: 2026,
    description:
      'Focused on Java, DSA, software development, databases, system design, product management, and data engineering.',
    coursework: 'Data Structures & Algorithms, Advanced Algorithms, System Design, Low-Level Design & Design Patterns, Relational Databases, Computer Systems, Data Engineering, Practical Software Engineering',
    grade: 'GPA 4 / 4',
  },
  {
    institution: 'Nagpur University',
    degree: 'Bachelor of Engineering',
    field: '',
    startYear: 2017,
    endYear: 2021,
    description:
      'Focused on programming, mathematics, calculus, physics, problem-solving, and engineering fundamentals.',
    coursework: 'Programming, Data Structures, Engineering Mathematics, Calculus, Physics, Numerical Methods and Statistics',
    grade: 'CGPA 8.47/10',
  },
]

/**
 * Tech stack pills. Icon names are keys into the react-icons/si map built in
 * Skills.tsx — add an entry there when adding a new technology here.
 */
export const techStack = [
  'Java',
  'Bash',
  'CSS',
  'JavaScript',
  'HTML',
  'TypeScript',
  'Python',
  'YAML',
  'Next.js',
  'Node.js',
  'React',
  'Tailwind CSS',
  'Vite',
  'Springboot',
  'Vercel',
  'MySQL',
  'MongoDB',
  'Postgres',
  'Redis',
  'Supabase',
  'Hugging Face',
  'GitHub',
  'npm',
] as const

export type TechName = (typeof techStack)[number]

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

/* ── Project data ── */
const projects = [
  {
    id: 'fmc',
    name: 'FindMeCourts',
    number: '01',
    category: 'Sports Platform',
    desc: 'A user-friendly platform that allows you to quickly locate and book nearby tennis, pickleball, badminton courts, soccer turfs, and sports events in just three clicks.',
    tags: ['React', 'JavaScript', 'jQuery', 'Amazon S3', 'AWS'],
    link: '#',
    accent: '#ea580c',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    id: 'qw',
    name: 'QuizWizard',
    number: '02',
    category: 'EdTech Platform',
    desc: 'An online platform that enables users to create, share, and participate in interactive quizzes across various subjects with real-time leaderboards.',
    tags: ['React', 'Emotion', 'core-js', 'jQuery', 'Amazon S3', 'AWS'],
    link: '#',
    accent: '#ea580c',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'stk',
    name: 'Strawket',
    number: '03',
    category: 'Learning Platform',
    desc: 'An extra-curricular learning platform connecting coaches and kids worldwide, enabling skill development beyond the classroom through live and async sessions.',
    tags: ['JavaScript', 'React', 'Bootstrap', 'AWS'],
    link: '#',
    accent: '#ea580c',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: 'mu',
    name: 'ManageUpgrades',
    number: '04',
    category: 'Dev Tools',
    desc: 'A platform providing tools and resources for managing software updates and maintenance modes, with Flutter package support and customizable UI components.',
    tags: ['React.js', 'Next.js', 'Tailwind', 'MongoDB'],
    link: '#',
    accent: '#ea580c',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
  },
]

/* ── Cinematic 3D depth transition ──
   Exit:  card tilts away on Y-axis + shrinks into depth + fades out
   Enter: card erupts from deep Z, rotates back to flat, content staggers in
*/
const EASE_EXPO = [0.16, 1, 0.3, 1]
const EASE_BACK = [0.34, 1.56, 0.64, 1]

const pageVariantsDesktop = {
  enter: (dir) => ({
    rotateY: dir > 0 ? 55 : -55,
    rotateX: -6,
    scale: 0.82,
    z: -400,
    opacity: 0,
    filter: 'blur(8px)',
  }),
  center: {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    z: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: EASE_EXPO,
    },
  },
  exit: (dir) => ({
    rotateY: dir > 0 ? -45 : 45,
    rotateX: 8,
    scale: 0.88,
    z: -300,
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      duration: 0.65,
      ease: [0.4, 0, 1, 1],
    },
  }),
}

const pageVariantsMobile = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    rotateY: dir > 0 ? 18 : -18,
    scale: 0.9,
    opacity: 0,
  }),
  center: {
    x: '0%',
    rotateY: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_EXPO },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-60%' : '60%',
    rotateY: dir > 0 ? -12 : 12,
    scale: 0.88,
    opacity: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 1, 1] },
  }),
}

/* ── Content stagger for inner elements ── */
const contentV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const rowV = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_EXPO } },
}

/* ── Parallax 3D tilt on mouse (desktop only) ── */
function TiltCard({ children, className, style, isMobile }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 })

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX: isMobile ? 0 : rotX, rotateY: isMobile ? 0 : rotY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

/* ── Icons ── */
const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const ExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
)

export default function Projects() {
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-80px' })
  const [[idx, dir], setIdx] = useState([0, 0])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const go = (newDir) => {
    const next = idx + newDir
    if (next < 0 || next >= projects.length) return
    setIdx([next, newDir])
  }

  const project = projects[idx]
  const activeVariants = isMobile ? pageVariantsMobile : pageVariantsDesktop

  return (
    <section className="pj-root section" id="projects">
      <div className="container">

        {/* Header */}
        <motion.div
          ref={headerRef}
          className="pj-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pj-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            Portfolio
          </div>
          <h2 className="pj-title">
            Our <span className="pj-title-accent">Projects</span>
          </h2>
          <p className="pj-subtitle">Featured work that showcases our expertise</p>
        </motion.div>

        {/* ── Slider viewport ── */}
        <div className="pj-book" style={{ perspective: isMobile ? 'none' : '1600px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={project.id}
              className="pj-page"
              custom={dir}
              variants={activeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ transformStyle: 'preserve-3d' }}
            >

              {/* ── Left: text side with stagger ── */}
              <TiltCard
                className="pj-page-left"
                isMobile={isMobile}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="pj-bg-num">{project.number}</div>

                <motion.div
                  className="pj-page-left-inner"
                  variants={contentV}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="pj-category" variants={rowV}>
                    {project.category}
                  </motion.div>

                  <motion.div className="pj-icon-wrap" variants={rowV}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                    transition={{ duration: 0.45 }}
                  >
                    {project.icon}
                  </motion.div>

                  <motion.h3 className="pj-name" variants={rowV}>
                    {project.name}
                  </motion.h3>

                  <motion.p className="pj-desc" variants={rowV}>
                    {project.desc}
                  </motion.p>

                  <motion.div className="pj-tags" variants={rowV}>
                    {project.tags.map((t) => (
                      <span key={t} className="pj-tag">{t}</span>
                    ))}
                  </motion.div>

                  <motion.a
                    href={project.link}
                    className="pj-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={rowV}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    View Project <ExternalLink />
                  </motion.a>
                </motion.div>
              </TiltCard>

              {/* ── Right: visual side ── */}
              <TiltCard
                className="pj-page-right"
                isMobile={isMobile}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="pj-right-grid" />

                <motion.div
                  className="pj-right-glow"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.95, 0.45] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Floating icon with depth */}
                <motion.div
                  className="pj-right-icon"
                  initial={{ scale: 0.7, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: EASE_BACK }}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                >
                  {project.icon}
                </motion.div>

                {/* Orbiting ring decoration */}
                <motion.div
                  className="pj-orbit-ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />

                <div className="pj-right-num">{project.number}</div>
                <div className="pj-right-label">{project.name.toUpperCase()}</div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="pj-controls">
          <motion.button
            className="pj-nav-btn"
            onClick={() => go(-1)}
            disabled={idx === 0}
            whileHover={idx > 0 ? { scale: 1.08 } : {}}
            whileTap={idx > 0 ? { scale: 0.92 } : {}}
            aria-label="Previous project"
          >
            <ArrowLeft />
          </motion.button>

          <div className="pj-progress">
            {projects.map((_, i) => (
              <motion.button
                key={i}
                className={`pj-pip${i === idx ? ' active' : ''}`}
                onClick={() => setIdx([i, i > idx ? 1 : -1])}
                whileHover={{ scale: 1.4 }}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            className="pj-nav-btn"
            onClick={() => go(1)}
            disabled={idx === projects.length - 1}
            whileHover={idx < projects.length - 1 ? { scale: 1.08 } : {}}
            whileTap={idx < projects.length - 1 ? { scale: 0.92 } : {}}
            aria-label="Next project"
          >
            <ArrowRight />
          </motion.button>

          <motion.span
            className="pj-counter"
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </motion.span>
        </div>

      </div>
    </section>
  )
}

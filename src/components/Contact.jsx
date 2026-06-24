import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ── Icons ── */
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const SpinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
)

const socials = [
  { icon: XIcon,        name: 'X',        href: '#' },
  { icon: LinkedInIcon, name: 'LinkedIn', href: '#' },
  { icon: GitHubIcon,   name: 'GitHub',   href: '#' },
]

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

const companyLinks = [
  { label: 'About Us',   href: '#' },
  { label: 'Careers',    href: '#' },
  { label: 'Blog',       href: '#' },
  { label: 'Privacy',    href: '#' },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) =>
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1400))
    setSending(false)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <section className="cf-root" id="contact" ref={ref}>
      <div className="cf-wrapper">

        {/* ══════════════ LEFT BRAND CARD ══════════════ */}
        <motion.div
          className="cf-brand-card"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated glow blobs */}
          <div className="cf-card-blob cf-blob-1" />
          <div className="cf-card-blob cf-blob-2" />

          {/* Logo */}
          <div className="cf-card-logo">
            <div className="cf-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#cf-logo-g)"/>
                <path d="M2 17L12 22L22 17" stroke="#fb923c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                <defs>
                  <linearGradient id="cf-logo-g" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ea580c"/>
                    <stop offset="1" stopColor="#fb923c"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="cf-logo-text">Gencoft</span>
          </div>

          {/* Tagline */}
          <div className="cf-card-body">
            <p className="cf-tagline">
              Innovative software<br/>
              solutions, <em>built to scale.</em>
            </p>
          </div>

          {/* Social links label + icons */}
          <div className="cf-card-footer">
            <span className="cf-stay-label">Stay in touch!</span>
            <div className="cf-socials">
              {socials.map(({ icon: Icon, name, href }) => (
                <motion.a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="cf-social-btn"
                  whileHover={{ scale: 1.15, background: 'rgba(234,88,12,0.25)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <motion.div
          className="cf-right-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Nav columns row */}
          <div className="cf-nav-cols">
            <div className="cf-nav-col">
              <h4 className="cf-col-heading">Navigation</h4>
              <ul className="cf-col-links">
                {navLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="cf-nav-link">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cf-nav-col">
              <h4 className="cf-col-heading">Company</h4>
              <ul className="cf-col-links">
                {companyLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="cf-nav-link">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cf-nav-col cf-contact-col">
              <h4 className="cf-col-heading">Contact</h4>
              <a href="mailto:support@gencoft.com" className="cf-email-link">
                support@gencoft.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="cf-divider" />

          {/* Contact form area */}
          <div className="cf-form-area">
            <div className="cf-form-headline">
              <p className="cf-form-sub">Let's build something great.</p>
              <h3 className="cf-form-title">Get in touch with Gencoft.</h3>
            </div>

            <form className="cf-form" onSubmit={handleSubmit}>
              <div className="cf-form-row">
                <div className="cf-field">
                  <input
                    id="cf-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="cf-input"
                  />
                </div>
                <div className="cf-field">
                  <input
                    id="cf-email"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="cf-input"
                  />
                </div>
              </div>

              <div className="cf-field">
                <textarea
                  id="cf-message"
                  name="message"
                  placeholder="Your message..."
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="cf-input cf-textarea"
                />
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.button
                    key="sent"
                    type="button"
                    className="cf-submit cf-submit-sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckIcon /> Message Sent!
                  </motion.button>
                ) : (
                  <motion.button
                    key="send"
                    type="submit"
                    className="cf-submit"
                    disabled={sending}
                    whileHover={!sending ? { scale: 1.02 } : {}}
                    whileTap={!sending ? { scale: 0.97 } : {}}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {sending ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-flex' }}
                        >
                          <SpinIcon />
                        </motion.span>
                        Sending...
                      </>
                    ) : (
                      <> Send Message <SendIcon /> </>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Copyright bottom */}
          <div className="cf-copyright">
            <span>© 2026 Gencoft Technologies. All rights reserved.</span>
          </div>
        </motion.div>
      </div>

      {/* Giant GENCOFT watermark */}
      <div className="cf-footer-watermark" aria-hidden="true">GENCOFT</div>
    </section>
  )
}

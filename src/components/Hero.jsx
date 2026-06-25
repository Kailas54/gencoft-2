import React from 'react'
import { motion } from 'framer-motion'

/* ── animation variants ── */
const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const itemV = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero({ theme }) {
  return (
    <section className="hero-split-container" id="home">
      
      {/* ── Fullscreen looping video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      {/* ── Left Column: Text & Content ── */}
      <div className="hero-left-col">
        <motion.div
          className="hero-left-content-inner"
          variants={containerV}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading GENCOFT */}
          <motion.h1 className="hero-title-left" variants={itemV}>
            GENCOFT
          </motion.h1>

          {/* Eyebrow tag */}
          <motion.p className="hero-eyebrow-new" variants={itemV}>
            <span className="hero-eyebrow-dot" />
            Innovative Software Agency
          </motion.p>

          {/* Description */}
          <motion.p className="hero-desc-new" variants={itemV}>
            We shape striking digital identities through bold contrasts and
            meaningful motion. Our development process transforms ideas into
            powerful, scalable products.
          </motion.p>

          {/* CTA buttons */}
          <motion.div className="hero-ctas-new" variants={itemV}>
            <motion.a
              href="#contact"
              className="hero-btn-primary-new"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.a>

            <motion.a
              href="#services"
              className="hero-btn-ghost-new"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Our Services
            </motion.a>
          </motion.div>

          {/* Bottom meta row */}
          <motion.div className="hero-bottom-meta-new" variants={itemV}>
            <a href="#projects" className="hero-meta-link-new">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
              Explore our work
            </a>
            <span className="hero-meta-sep-new" />
            <a href="mailto:hello@gencoft.com" className="hero-meta-link-new">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Contact
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Column: 3D Visual & Technologies Title ── */}
      <div className="hero-right-col">
        {/* Canvas overlay gradient */}
        <div className="hero-canvas-overlay-new" />

        {/* Big heading TECHNOLOGIES overlapping bottom */}
        <h2 className="hero-title-right">
          TECHNOLOGIES
        </h2>
      </div>

    </section>
  )
}

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ── animation variants ── */
const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const itemV = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Animated fog plane (scroll noise shader) ── */
function FogMesh({ theme }) {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  // vertex shader inlined for performant animated noise
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.04
    }
  })

  // Synchronize theme changes with uniforms
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uIsLight.value = theme === 'light' ? 1.0 : 0.0
    }
  }, [theme])

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uIsLight;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.45;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 5; i++) {
        v += a * snoise(p);
        p = rot * p * 2.1 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.06;

      vec2 p = uv * 2.2 - 1.1;
      float q1 = fbm(p + t * 0.4);
      float q2 = fbm(p + vec2(1.0, 0.0) + t * 0.3);

      vec2 r = vec2(q1, q2);
      float f = fbm(p + 1.6 * r + vec2(1.7, 9.2) + 0.15 * t);

      // Dark Mode palette
      vec3 darkFog1 = vec3(0.04, 0.04, 0.05);   // near black / dark grey
      vec3 darkFog2 = vec3(0.24, 0.08, 0.01);   // deep glowing ember/brown-orange
      vec3 darkFog3 = vec3(0.58, 0.16, 0.02);   // rich warm burnt orange
      vec3 darkFog4 = vec3(0.92, 0.42, 0.06);   // bright glowing amber orange

      // Light Mode palette (dreamy pastel orange/peach against white)
      vec3 lightFog1 = vec3(0.97, 0.98, 0.99);  // very light grey
      vec3 lightFog2 = vec3(0.99, 0.89, 0.82);  // soft pastel peach
      vec3 lightFog3 = vec3(0.98, 0.76, 0.62);  // warm peach orange
      vec3 lightFog4 = vec3(0.94, 0.54, 0.34);  // bright orange accent

      vec3 fog1 = mix(darkFog1, lightFog1, uIsLight);
      vec3 fog2 = mix(darkFog2, lightFog2, uIsLight);
      vec3 fog3 = mix(darkFog3, lightFog3, uIsLight);
      vec3 fog4 = mix(darkFog4, lightFog4, uIsLight);

      float fi = clamp(f * 1.2 + 0.25, 0.0, 1.0);
      vec3 color = mix(fog1, fog2, fi);
      color = mix(color, fog3, clamp(length(r) * 0.75, 0.0, 1.0));
      color = mix(color, fog4, clamp(f * f * 0.7, 0.0, 1.0));

      // Amber highlight glow
      float warmth = smoothstep(0.65, 0.0, length(uv - vec2(0.6, 0.4)));
      color += mix(vec3(0.14, 0.05, 0.0), vec3(0.08, 0.03, 0.0), uIsLight) * warmth;

      // Vignette
      float vignette = uv.x * uv.y * (1.0-uv.x) * (1.0-uv.y);
      vignette = pow(16.0 * vignette, 0.4);
      color *= vignette;

      float alpha = clamp(fi * 0.95, 0.0, 1.0);
      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[8, 8, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uIsLight: { value: theme === 'light' ? 1.0 : 0.0 }
        }}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ── Slow drifting particles ── */
function DriftParticles({ theme }) {
  const pointsRef = useRef(null)
  const count = 120

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3
  }

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.025
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.08
    }
  })

  const isLight = theme === 'light'

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color={isLight ? "#ea580c" : "#fb923c"}
        transparent
        opacity={isLight ? 0.45 : 0.65}
        sizeAttenuation
      />
    </points>
  )
}

/* ── Three.js scene ── */
function Scene({ theme }) {
  const groupRef = useRef(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.07) * 0.03
    }
  })

  const isLight = theme === 'light'

  return (
    <>
      <ambientLight intensity={isLight ? 0.45 : 0.12} />
      <pointLight position={[2, 2, 3]} intensity={isLight ? 0.75 : 0.6} color={isLight ? "#ea580c" : "#fb923c"} />
      <pointLight position={[-3, -2, 1]} intensity={isLight ? 0.35 : 0.4} color="#ea580c" distance={7} />

      <group ref={groupRef}>
        <FogMesh theme={theme} />
        <DriftParticles theme={theme} />
      </group>



      {/* Distant star field */}
      <Stars
        radius={25}
        depth={8}
        count={300}
        factor={1.2}
        saturation={0}
        fade
        speed={0.3}
      />
    </>
  )
}

/* ── Hero Component ── */
export default function Hero({ theme }) {
  return (
    <section className="hero-split-container" id="home">
      
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
        {/* 3D WebGL Canvas */}
        <div className="hero-canvas-container">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 55 }}
            gl={{ antialias: false, alpha: true }}
            dpr={Math.min(window.devicePixelRatio, 1.5)}
            style={{ width: '100%', height: '100%' }}
          >
            <Scene theme={theme} />
          </Canvas>
        </div>

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

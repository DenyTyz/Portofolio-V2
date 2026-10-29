import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Code2, 
  Sparkles, 
  Mail, 
  Github, 
  Linkedin, 
  ArrowRight,
  Volume2,
  Menu
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#3b82f6" intensity={2} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5} position={[2.5, 1, -1]}>
        <mesh>
          <torusGeometry args={[0.6, 0.2, 16, 32]} />
          <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2} position={[-2.2, -0.8, -0.5]}>
        <mesh>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.7} roughness={0.2} />
        </mesh>
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
      <nav className="flex items-center justify-between px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
        <span className="font-display font-bold text-lg tracking-tight">Deny Nurcahyanto.</span>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#home" className="hover:text-white transition">Home</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#work" className="hover:text-white transition">Work</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Volume2 size={16} className="text-blue-400" />
          </button>
          <button className="md:hidden p-2 rounded-full hover:bg-white/10 transition">
            <Menu size={18} />
          </button>
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const workRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      })
      gsap.from('.hero-sub', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
      })
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9
      })

      gsap.from('.about-card', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      })

      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: workRef.current,
          start: 'top 75%',
        },
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out'
      })
    })

    return () => ctx.revert()
  }, [])

  const projects = [
    {
      title: 'Neon Dashboard',
      desc: 'Real-time analytics dashboard with 3D visualizations',
      tags: ['React', 'Three.js', 'GSAP'],
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'AI Content Bot',
      desc: 'Automated article generation & publishing system',
      tags: ['React', 'Tailwind', 'API'],
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Student Portal',
      desc: 'Centralized student data management platform',
      tags: ['React', 'Supabase', 'GSAP'],
      color: 'from-cyan-500/20 to-blue-500/20'
    }
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 -z-10">
        <Scene />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-[#050510]/40 to-[#050510]" />
      </div>

      <Navbar />

      {/* Hero */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-white/70">Creative Fullstack Developer</span>
          </div>
          <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6">
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">immersive</span>
            <br />digital experiences
          </h1>
          <p className="hero-sub text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Junior developer specializing in React, Three.js & modern web animations. 
            Turning ideas into interactive 3D products.
          </p>
          <div className="hero-cta flex flex-wrap items-center justify-center gap-4">
            <a href="#work" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 transition font-medium">
              View Work <ArrowRight size={18} />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" ref={aboutRef} className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-white/60 max-w-2xl mb-16">
            Passionate about creating beautiful, functional digital experiences with modern web technologies.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Frontend', desc: 'React, Tailwind CSS, GSAP animations' },
              { icon: Sparkles, title: '3D & Graphics', desc: 'Three.js, React Three Fiber, WebGL' },
              { icon: Mail, title: 'Tools', desc: 'Vite, Vercel, Lucide, Spotify widgets' }
            ].map((item, i) => (
              <div key={i} className="about-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
                <item.icon className="text-blue-400 mb-4" size={28} />
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="work" ref={workRef} className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Selected Work</h2>
          <p className="text-white/60 mb-16">Projects built with React, Three.js & modern tools.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <div key={i} className={`project-card group p-8 rounded-3xl bg-gradient-to-br ${p.color} border border-white/10 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
                <div className="h-40 rounded-2xl bg-black/30 mb-6 flex items-center justify-center">
                  <Code2 size={48} className="text-white/20 group-hover:text-blue-400 transition" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/10">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotify + Contact */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-4xl font-bold mb-4">Currently Listening</h2>
            <p className="text-white/60 mb-8">Daily Rotation — coding soundtrack</p>
            <iframe 
              style={{ borderRadius: 12 }} 
              src="https://open.spotify.com/embed/playlist/3XXwLc91K6JYhtotQO98S4?utm_source=generator&theme=dark" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Spotify Playlist"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-white/60 mb-8">Have a project in mind? Let's talk.</p>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Your name" 
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition"
              />
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition"
              />
              <textarea 
                placeholder="Message" 
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition resize-none"
              />
              <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-medium">
                Send Message
              </button>
            </form>
            <div className="flex gap-4 mt-8">
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition"><Github size={20} /></a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition"><Linkedin size={20} /></a>
              <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition"><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-white/40 text-sm">
        Built with React, Tailwind, Three.js, GSAP & deployed on Vercel
      </footer>
    </div>
  )
}

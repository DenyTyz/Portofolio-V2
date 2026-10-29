import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Check,
  Code2,
  FileBadge,
  Github,
  Layers3,
  Menu,
  Music2,
  Palette,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { LiquidGlass } from './components/ui/LiquidGlass.jsx'
import { LoadingScreen } from './components/LoadingScreen.jsx'

const Lanyard = lazy(() => import('./components/Lanyard.jsx'))
const LOADER_MIN_DURATION = 2200
const LOADER_TIMEOUT = 4000
const LOADER_EXIT_DURATION = 320

const projects = [
  {
    title: 'Neon Dashboard',
    description: 'Dashboard analitik dengan visualisasi data dan antarmuka yang responsif.',
    tags: ['React', 'Three.js', 'GSAP'],
    icon: Layers3,
    tone: 'violet',
  },
  {
    title: 'AI Content Bot',
    description: 'Eksperimen otomasi untuk membantu proses pembuatan dan pengelolaan konten.',
    tags: ['React', 'Tailwind', 'API'],
    icon: Sparkles,
    tone: 'blue',
  },
  {
    title: 'Student Portal',
    description: 'Portal data siswa dengan pengalaman yang sederhana dan mudah digunakan.',
    tags: ['React', 'Supabase', 'UI'],
    icon: Code2,
    tone: 'cyan',
  },
]

const skills = [
  { name: 'React', type: 'Frontend' },
  { name: 'JavaScript', type: 'Frontend' },
  { name: 'Tailwind CSS', type: 'Styling' },
  { name: 'Three.js', type: '3D & WebGL' },
  { name: 'GSAP', type: 'Animation' },
  { name: 'Figma', type: 'Design' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className="site-header">
      <div className="navbar-anchor">
        <LiquidGlass className="navbar-glass" contentClassName="navbar-glass-content" style={{ backgroundColor: 'rgb(14 16 30 / 62%)' }}>
          <nav className="navbar" aria-label="Navigasi utama">
            <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
              <span className="brand-mark"><Code2 size={17} /></span>
              <span>Deny<span className="brand-muted">.dev</span></span>
            </a>
            <div className="nav-links">
              {links.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>
            <span className="nav-caption">PORTFOLIO / 2026</span>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </LiquidGlass>
        {menuOpen && (
          <div className="nav-menu">
            {links.map((link, index) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                <span className="nav-number">0{index + 1}</span>
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading${centered ? ' centered' : ''}`}>
      <span className="eyebrow"><span />{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Projects')
  const [copied, setCopied] = useState(false)
  const [formError, setFormError] = useState('')
  const [lanyardReady, setLanyardReady] = useState(false)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [loaderExiting, setLoaderExiting] = useState(false)
  const loaderStartedAt = useRef(performance.now())

  useEffect(() => {
    let dismissed = false
    let readyTimer
    let fallbackTimer
    let exitTimer

    const dismissLoader = () => {
      if (dismissed) return
      dismissed = true
      setLoaderExiting(true)
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      exitTimer = window.setTimeout(
        () => setLoaderVisible(false),
        reducedMotion ? 0 : LOADER_EXIT_DURATION,
      )
    }

    const elapsed = performance.now() - loaderStartedAt.current
    if (lanyardReady) {
      readyTimer = window.setTimeout(
        dismissLoader,
        Math.max(0, LOADER_MIN_DURATION - elapsed),
      )
    }
    fallbackTimer = window.setTimeout(
      dismissLoader,
      Math.max(0, LOADER_TIMEOUT - elapsed),
    )

    return () => {
      window.clearTimeout(readyTimer)
      window.clearTimeout(fallbackTimer)
      window.clearTimeout(exitTimer)
    }
  }, [lanyardReady])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let cancelled = false
    let idleCallbackId
    let fallbackTimer
    let animationContext

    const loadAnimations = async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        animationContext = gsap.context(() => {
          gsap.from('.hero-copy > *', {
            y: 28,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.15,
          })

          gsap.utils.toArray('.reveal').forEach((element) => {
            gsap.from(element, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            })
          })
        })
      } catch (error) {
        console.error('Gagal memuat animasi portfolio:', error)
      }
    }

    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(loadAnimations, { timeout: 1000 })
    } else {
      fallbackTimer = window.setTimeout(loadAnimations, 250)
    }

    return () => {
      cancelled = true
      if (idleCallbackId !== undefined) window.cancelIdleCallback(idleCallbackId)
      window.clearTimeout(fallbackTimer)
      animationContext?.revert()
    }
  }, [])

  async function handleContactSubmit(event) {
    event.preventDefault()
    setCopied(false)
    setFormError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const draft = [
      `Nama: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      '',
      String(formData.get('message')),
    ].join('\n')

    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      form.reset()
    } catch (error) {
      setFormError('Pesan tidak dapat disalin. Periksa izin clipboard browser Anda.')
      console.error('Gagal menyalin pesan kontak:', error)
    }
  }

  return (
    <div className="app-shell">
      {loaderVisible && <LoadingScreen exiting={loaderExiting} />}
      <div className="site-background" aria-hidden="true">
        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />
        <div className="background-grid" />
      </div>

      <Navbar />

      <main>
        <section className="hero-section" id="home">
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <Suspense fallback={null}>
            <div className="lanyard-stage" role="img" aria-label="Ilustrasi kartu lanyard 3D Deny">
              <Lanyard
                className="lanyard-scene"
                style={{ width: '100%', height: '100%' }}
                frontImage="/lanyard-front.jpeg"
                backImage="/lanyard-back.jpeg"
                onReady={() => setLanyardReady(true)}
                cardColor="#ffffff"
                strapColor="#111111"
                strapWidth={0.8}
                strapLength={0.7}
                size={0.5}
                breeze={0.24}
                damping={0.58}
              />
            </div>
          </Suspense>
          <div className="hero-copy">
            <LiquidGlass
              className="hero-glass-kicker"
              contentClassName="hero-kicker"
              radius={999}
              bevelDepth={8}
              scale={20}
              aberration={1}
              frost={0.25}
            >
              <IconSparkles size={14} aria-hidden="true" />
              <span>JUNIOR DEVELOPER / INDONESIA</span>
            </LiquidGlass>
            <h1>
              Membangun
              <span>hal digital.</span>
            </h1>
            <p className="hero-role">React &amp; Three.js Enthusiast</p>
            <p className="hero-description">
              Halo, saya Deny — developer pemula yang senang mengubah ide menjadi
              pengalaman web yang berguna, intuitif, dan terasa menyenangkan.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary hero-glass-cta"
                href="#portfolio"
              >
                Lihat Projek <IconArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button button-quiet" href="#contact">
                Hubungi Saya <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="hero-bottom">
              <div className="hero-socials">
                <span>FIND ME</span>
                <a href="https://github.com/DenyTyz" target="_blank" rel="noreferrer" aria-label="GitHub DenyTyz"><Github size={17} /></a>
              </div>
              <a className="scroll-cue" href="#about">
                <span>GULIR UNTUK MENGENAL SAYA</span><ArrowDown size={14} />
              </a>
            </div>
          </div>
        </section>

        <section className="about-section section-wrap" id="about">
          <SectionHeading
            eyebrow="A LITTLE ABOUT ME"
            title="About Me"
            description="Senang mengeksplorasi teknologi dan merancang pengalaman digital yang terasa hidup."
          />
          <div className="about-layout">
            <article className="profile-card reveal">
              <div className="profile-card-label"><span /> AVAILABLE FOR CREATIVE PROJECTS</div>
              <div className="profile-monogram">DN<span>.</span></div>
              <h3>Hi, I&apos;m<br /><span>Deny Nurcahyanto</span></h3>
              <p>Frontend developer yang tertarik pada pengalaman interaktif dan visual 3D di web.</p>
              <a className="text-link" href="#contact">Mari terhubung <ArrowRight size={15} /></a>
              <div className="profile-card-index">01 / PROFILE</div>
            </article>
            <div className="about-details">
              <div className="about-copy reveal">
                <p className="lead-copy">
                  Saya suka memadukan <span>teknologi dan kreativitas</span> untuk
                  menciptakan produk digital yang fungsional sekaligus menyenangkan
                  digunakan.
                </p>
                <p>
                  Dari antarmuka yang rapi hingga eksperimen 3D, saya terus belajar
                  membangun web yang responsif, intuitif, dan punya karakter.
                </p>
              </div>
              <div className="focus-grid">
                <article className="focus-card reveal">
                  <Code2 size={20} />
                  <span className="focus-number">01</span>
                  <h3>Web Development</h3>
                  <p>Mengubah ide menjadi antarmuka yang cepat dan mudah digunakan.</p>
                </article>
                <article className="focus-card reveal">
                  <Palette size={20} />
                  <span className="focus-number">02</span>
                  <h3>Visual &amp; Interaction</h3>
                  <p>Memperhatikan detail visual, motion, dan pengalaman pengguna.</p>
                </article>
              </div>
            </div>
          </div>
          <div className="stats-row reveal">
            <div><strong>03</strong><span>PROJECTS</span></div>
            <div><strong>06</strong><span>TOOLS</span></div>
            <div><strong>02</strong><span>FOCUS AREAS</span></div>
            <div className="stats-note"><BriefcaseBusiness size={17} /><span>Selalu terbuka untuk belajar dan berkolaborasi</span></div>
          </div>
          <div className="journey-grid reveal">
            <article>
              <span className="journey-index">01 / EDUCATION</span>
              <h3>Pendidikan</h3>
              <p>Informasi pendidikan akan ditambahkan setelah detailnya dikonfirmasi.</p>
            </article>
            <article>
              <span className="journey-index">02 / EXPERIENCE</span>
              <h3>Pengalaman</h3>
              <p>Untuk saat ini, portfolio ini berfokus pada proses belajar dan eksplorasi proyek.</p>
            </article>
          </div>
        </section>

        <section className="music-section">
          <div className="music-glow" aria-hidden="true" />
          <div className="music-content section-wrap reveal">
            <div>
              <span className="eyebrow"><Music2 size={14} /> ON REPEAT</span>
              <h2>A little music.<br /><span>A lot of ideas.</span></h2>
              <p>Musik yang menemani proses merancang, mencoba, dan mewujudkan ide.</p>
              <span className="music-note">Playlist Deny akan ditautkan di sini.</span>
            </div>
            <div className="music-player">
              <div className="record-art"><Music2 size={28} /></div>
              <div className="track-info">
                <span>NOW PLAYING</span>
                <strong>Music for making</strong>
                <small>Playlist pilihan akan segera hadir</small>
              </div>
              <Music2 className="music-player-icon" size={20} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="portfolio-section section-wrap" id="portfolio">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Portfolio"
            description="Beberapa eksplorasi dan teknologi yang saya gunakan."
          />
          <div className="portfolio-tabs" role="tablist" aria-label="Konten portfolio">
            {['Projects', 'Certificates', 'Achievements', 'Tech Stack'].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Projects' ? <Layers3 size={15} /> : tab === 'Certificates' ? <FileBadge size={15} /> : tab === 'Achievements' ? <Award size={15} /> : <Code2 size={15} />}
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'Projects' && (
            <div className="project-grid" role="tabpanel">
              {projects.map((project, index) => {
                const ProjectIcon = project.icon
                return (
                  <article className={`project-card project-${project.tone} reveal`} key={project.title}>
                    <div className="project-art">
                      <span className="project-index">0{index + 1} / CONCEPT</span>
                      <div className="project-art-orbit" />
                      <ProjectIcon size={34} strokeWidth={1.4} />
                      <ArrowUpRight className="project-arrow" size={18} />
                    </div>
                    <div className="project-card-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="tag-list">
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
          {activeTab === 'Tech Stack' && (
            <div className="skills-grid" role="tabpanel">
              {skills.map((skill, index) => (
                <article className="skill-card reveal" key={skill.name}>
                  <span className="skill-index">0{index + 1}</span>
                  <div><strong>{skill.name}</strong><span>{skill.type}</span></div>
                  <ArrowUpRight size={16} />
                </article>
              ))}
            </div>
          )}
          {['Certificates', 'Achievements'].includes(activeTab) && (
            <div className="empty-portfolio reveal" role="tabpanel">
              {activeTab === 'Certificates' ? <FileBadge size={23} /> : <Award size={23} />}
              <p>Belum ada {activeTab === 'Certificates' ? 'sertifikat' : 'pencapaian'} yang ditampilkan.</p>
            </div>
          )}
        </section>

        <section className="contact-section section-wrap" id="contact">
          <SectionHeading
            eyebrow="LET'S CONNECT"
            title="Ada ide menarik?"
            description="Ceritakan apa yang ingin kamu bangun. Saya senang mendengar ide baru."
            centered
          />
          <div className="contact-layout">
            <div className="contact-intro reveal">
              <span className="contact-icon"><Send size={20} /></span>
              <h3>Hubungi saya</h3>
              <p>Isi pesan di samping untuk menyalin draft dan mengirimkannya melalui aplikasi pilihanmu.</p>
              <div className="social-links">
                <a href="https://github.com/DenyTyz" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={handleContactSubmit}>
              <label>
                Nama
                <input name="name" type="text" placeholder="Nama kamu" autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="email@contoh.com" autoComplete="email" required />
              </label>
              <label>
                Pesan
                <textarea name="message" rows="4" placeholder="Ceritakan ide atau proyekmu..." required />
              </label>
              <button className="button button-primary submit-button" type="submit">
                {copied ? <>Pesan Tersalin <Check size={17} /></> : <>Salin Pesan <ArrowRight size={17} /></>}
              </button>
              {copied && <p className="form-feedback" role="status">Draft pesan tersalin. Tempelkan ke email atau aplikasi pesan pilihanmu.</p>}
              {formError && <p className="form-error" role="alert">{formError}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#home">
          <span className="brand-mark"><Code2 size={17} /></span>
          <span>Deny<span className="brand-muted">.dev</span></span>
        </a>
        <span>© 2026 Deny Nurcahyanto. Built with curiosity.</span>
        <a className="back-to-top" href="#home">Back to top <ArrowUpRight size={14} /></a>
      </footer>
    </div>
  )
}

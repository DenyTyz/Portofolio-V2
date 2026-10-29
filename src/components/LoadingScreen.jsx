export function LoadingScreen({ exiting = false }) {
  return (
    <div
      className={`loading-screen${exiting ? ' is-exiting' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-topline">
        <span className="loading-brand"><span className="loading-brand-mark">D</span> DENY.DEV</span>
        <span className="loading-index">PORTFOLIO <span>2026</span></span>
      </div>
      <div className="loading-content">
        <div className="loading-orbit" aria-hidden="true">
          <span className="loading-orbit-ring loading-orbit-ring-outer" />
          <span className="loading-orbit-ring loading-orbit-ring-inner" />
          <span className="loading-orbit-dot" />
          <span className="loading-monogram">D<span>.</span></span>
        </div>
        <span className="loading-eyebrow"><span /> DIGITAL CREATIVE PORTFOLIO</span>
        <p className="loading-title">Halo, Deny di sini<span>.</span></p>
        <div className="loading-status">
          <span className="loading-label">MENYIAPKAN PENGALAMAN</span>
          <span className="loading-track" aria-hidden="true"><span /></span>
          <span className="loading-percent">2026</span>
        </div>
      </div>
      <div className="loading-footer"><span>DESIGN <i /> CODE <i /> EXPERIENCE</span><span>INDONESIA</span></div>
    </div>
  )
}

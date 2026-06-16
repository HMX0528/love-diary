import { useState, useEffect } from 'react'

const navItems = [
  { label: '首页', href: '#hero' },
  { label: '关于她', href: '#about' },
  { label: '我们的故事', href: '#timeline' },
  { label: '专属相册', href: '#album' },
  { label: '悄悄话', href: '#whisper' },
  { label: '愿望清单', href: '#wishlist' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <a href="#hero" className="navbar__logo" onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#e87ea0">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>恋爱日记</span>
        </a>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="navbar__link"
              onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--nav-height);
          transition: var(--transition-smooth);
          background: transparent;
        }
        .navbar--scrolled {
          background: rgba(254, 250, 246, 0.92);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 20px rgba(212, 98, 138, 0.08);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Noto Serif SC', serif;
          font-size: 1.15rem;
          color: var(--pink-deep);
          font-weight: 600;
          letter-spacing: 1px;
          transition: opacity 0.3s;
        }
        .navbar__logo:hover { opacity: 0.8; }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 36px;
        }
        .navbar__link {
          font-size: 0.9rem;
          color: var(--text-secondary);
          letter-spacing: 1px;
          position: relative;
          transition: var(--transition-smooth);
          padding: 4px 0;
        }
        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--pink-accent);
          transition: var(--transition-smooth);
          border-radius: 1px;
        }
        .navbar__link:hover { color: var(--pink-deep); }
        .navbar__link:hover::after { width: 100%; }
        .navbar__toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 4px;
          z-index: 1001;
        }
        .navbar__toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: var(--transition-smooth);
        }
        .navbar__toggle--active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .navbar__toggle--active span:nth-child(2) { opacity: 0; }
        .navbar__toggle--active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .navbar__links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: 100vh;
            flex-direction: column;
            background: rgba(254, 246, 249, 0.98);
            backdrop-filter: blur(20px);
            padding: 100px 40px 40px;
            gap: 24px;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -10px 0 40px rgba(74, 53, 64, 0.06);
          }
          .navbar__links--open { right: 0; }
          .navbar__toggle { display: flex; }
          .navbar__link { font-size: 1.05rem; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar

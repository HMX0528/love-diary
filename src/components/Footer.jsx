import { useState, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { ChibiGirl, ChibiBoy } from './Decorative'
import { useAdmin } from '../context/AdminContext'

const Footer = () => {
  const { content } = useAdmin()
  const [secRef, secVisible] = useScrollReveal();
  const [loveDays, setLoveDays] = useState(0)

  useEffect(() => {
    const startDate = new Date(content.footer.startDate)
    const calcDays = () => {
      const now = new Date()
      const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
      setLoveDays(diff)
    }
    calcDays()
    const timer = setInterval(calcDays, 1000 * 60 * 60)
    return () => clearInterval(timer)
  }, [content.footer.startDate])

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="footer" ref={secRef} className={`footer-section section-reveal ${secVisible ? "section-reveal--visible" : ""}`}>
      <div className="footer__bg" />
      <div className="container footer__content">
        <div className="footer__counter">
          <div className="footer__counter-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--pink-accent)">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="footer__counter-text">
            <span className="footer__counter-label">我们已经在一起</span>
            <div className="footer__counter-number">
              <span className="footer__counter-days">{loveDays}</span>
              <span className="footer__counter-unit">天</span>
            </div>
          </div>
        </div>

        <div className="footer__divider">
          <span className="footer__divider-icon">&#10085;</span>
        </div>

        <div className="footer__dedication">
          <p className="footer__dedication-text">{content.footer.dedication}</p>
          <p className="footer__dedication-sign">{content.footer.dedicationSign}</p>
        </div>

        <div className="footer__actions">
          <button className="footer__btn footer__btn--top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            回到顶部
          </button>
          <button className="footer__btn footer__btn--message" onClick={() => scrollTo('#whisper')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            写留言
          </button>
        </div>
      </div>

      <style>{`
        .footer-section { position: relative; min-height: 70vh; display: flex; align-items: center; background: linear-gradient(160deg, var(--pink-soft) 0%, var(--pink-blush) 25%, var(--pink-mist) 50%, var(--pink-lightest) 75%, var(--cream) 100%); overflow: hidden; }
        .footer__bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 80%, rgba(232, 126, 160, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(212, 98, 138, 0.06) 0%, transparent 50%); pointer-events: none; }
        .footer__content { position: relative; z-index: 1; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 40px; padding: 100px 24px; text-align: center; }
        .footer__counter { display: flex; align-items: center; gap: 24px; }
        .footer__counter-icon { animation: heartBeat 2s ease-in-out infinite; }
        @keyframes heartBeat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1); } 45% { transform: scale(1.1); } 60% { transform: scale(1); } }
        .footer__counter-text { text-align: left; }
        .footer__counter-label { font-size: 0.9rem; color: var(--text-light); letter-spacing: 3px; display: block; margin-bottom: 8px; }
        .footer__counter-number { display: flex; align-items: baseline; gap: 8px; }
        .footer__counter-days { font-size: 5rem; font-weight: 700; font-family: 'Noto Serif SC', serif; background: linear-gradient(135deg, var(--pink-deep), var(--rose)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
        .footer__counter-unit { font-size: 1.4rem; color: var(--text-secondary); letter-spacing: 2px; }
        .footer__divider { width: 100%; max-width: 300px; display: flex; align-items: center; gap: 16px; }
        .footer__divider::before, .footer__divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--pink-soft), transparent); }
        .footer__divider-icon { font-size: 1.2rem; color: var(--pink-accent); }
        .footer__dedication-text { font-size: 1.2rem; line-height: 2.2; color: var(--text-secondary); letter-spacing: 3px; font-family: 'Noto Serif SC', serif; white-space: pre-line; }
        .footer__dedication-sign { margin-top: 20px; font-size: 1rem; color: var(--pink-deep); letter-spacing: 3px; }
        .footer__actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .footer__btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 50px; font-size: 0.85rem; letter-spacing: 2px; transition: var(--transition-smooth); }
        .footer__btn--top { background: rgba(255,255,255,0.7); color: var(--text-secondary); border: 1px solid var(--pink-soft); backdrop-filter: blur(4px); }
        .footer__btn--top:hover { background: rgba(255,255,255,0.9); transform: translateY(-2px); }
        .footer__btn--message { background: linear-gradient(135deg, var(--pink-accent), var(--pink-deep)); color: #fff; box-shadow: 0 4px 20px rgba(212, 98, 138, 0.3); }
        .footer__btn--message:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(212, 98, 138, 0.4); }
      `}</style>
    </section>
  )
}

export default Footer

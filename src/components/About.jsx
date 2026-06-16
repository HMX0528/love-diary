import { useRef, useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

/* ── Scroll-reveal wrapper ── */
const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`about__reveal ${show ? "about__reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

/* ── Floating hearts decoration ── */
const FloatingHearts = () => (
  <div className="about__hearts" aria-hidden="true">
    {[...Array(6)].map((_, i) => (
      <span key={i} className="about__heart" style={{ left: `${10 + i * 16}%`, animationDelay: `${i * 1.2}s` }} />
    ))}
    <style>{`
      .about__hearts {
        position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
      }
      .about__heart {
        position: absolute; bottom: -20px;
        font-size: ${10 + 6}px;
        opacity: 0.15;
        animation: heartFloat 6s ease-in-out infinite;
      }
      .about__heart::before { content: "♥"; }
      @keyframes heartFloat {
        0%   { transform: translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
        15%  { opacity: 0.2; }
        50%  { transform: translateY(-40vh) rotate(180deg) scale(1); opacity: 0.15; }
        85%  { opacity: 0.08; }
        100% { transform: translateY(-80vh) rotate(360deg) scale(0.4); opacity: 0; }
      }
    `}</style>
  </div>
);

/* ============================================================ */
const About = () => {
  const { content, getImage } = useAdmin();
  const { about } = content;
  const portraitImg = getImage("about.portrait");

  return (
    <section id="about" className="about-section">
      <FloatingHearts />

      <div className="container">
        {/* ── Title ── */}
        <Reveal>
          <h2 className="section-title">关于她</h2>
          <p className="section-subtitle">世界上的另一个我</p>
        </Reveal>

        {/* ── Main grid ── */}
        <div className="about__grid">
          {/* Portrait column */}
          <Reveal delay={0.1}>
            <div className="about__portrait">
              <div className="about__portrait-glow">
                <div className="about__portrait-frame">
                  {portraitImg ? (
                    <img src={portraitImg} alt={about.name} className="about__portrait-img" />
                  ) : (
                    <div className="about__portrait-placeholder">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--pink-soft)" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>她的照片</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="about__portrait-info">
                <h3 className="about__name">{about.name}</h3>
                <p className="about__desc">{about.desc}</p>
              </div>
            </div>
          </Reveal>

          {/* Details column */}
          <div className="about__details">
            {/* Info cards */}
            <Reveal delay={0.25}>
              <div className="about__info-cards">
                {about.infoCards.map((card, i) => (
                  <div key={i} className="about__info-card" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="about__info-label">{card.label}</span>
                    <span className="about__info-value">{card.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Personality tags */}
            <Reveal delay={0.4}>
              <h4 className="about__section-label">性格标签</h4>
              <div className="about__tags-list">
                {about.personalityTags.map((tag, i) => (
                  <span key={i} className="about__tag" style={{ animationDelay: `${i * 0.06}s` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Favorites */}
            <Reveal delay={0.55}>
              <h4 className="about__section-label">喜好清单</h4>
              <div className="about__favorites-grid">
                {about.favorites.map((item, i) => (
                  <div key={i} className="about__fav-item" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="about__fav-emoji">{item.emoji}</span>
                    <div>
                      <span className="about__fav-label">{item.label}</span>
                      <span className="about__fav-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Confession ── */}
        <Reveal delay={0.7}>
          <div className="about__confession">
            <div className="about__confession-heart">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--pink-accent)">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <p className="about__confession-text">{about.confession}</p>
            <div className="about__confession-sign">{about.confessionSign}</div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .about-section {
          position: relative;
          padding: 120px 0;
          background: var(--cream);
          overflow: hidden;
        }

        /* ── Scroll reveal base ── */
        .about__reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        .about__reveal--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Portrait ── */
        .about__portrait {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .about__portrait-glow {
          width: 100%; max-width: 380px; aspect-ratio: 3/4;
          border-radius: var(--radius-lg);
          position: relative;
          animation: floatGlow 4s ease-in-out infinite;
        }
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0); filter: drop-shadow(0 8px 30px rgba(212,98,138,0.12)); }
          50% { transform: translateY(-8px); filter: drop-shadow(0 16px 40px rgba(212,98,138,0.22)); }
        }
        .about__portrait-glow::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: calc(var(--radius-lg) + 6px);
          background: linear-gradient(135deg, var(--pink-blush), var(--pink-accent), var(--pink-lightest), var(--pink-accent));
          background-size: 300% 300%;
          animation: glowSpin 6s ease-in-out infinite;
          z-index: -1;
          opacity: 0.5;
        }
        @keyframes glowSpin {
          0%, 100% { background-position: 0% 50%; opacity: 0.4; }
          50% { background-position: 100% 50%; opacity: 0.7; }
        }
        .about__portrait-frame {
          width: 100%; height: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: linear-gradient(145deg, var(--pink-blush), var(--pink-lightest));
          position: relative;
        }
        .about__portrait-img { width: 100%; height: 100%; object-fit: cover; }
        .about__portrait-placeholder {
          position: absolute; inset: 12px;
          border: 2px dashed var(--pink-soft);
          border-radius: calc(var(--radius-lg) - 8px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px; color: var(--pink-warm); font-size: 0.9rem; letter-spacing: 2px;
        }
        .about__portrait-info { text-align: center; }
        .about__name {
          font-size: 1.6rem; color: var(--text-primary); margin-bottom: 6px;
          animation: nameShimmer 3s ease-in-out infinite;
          background: linear-gradient(90deg, var(--text-primary), var(--pink-deep), var(--text-primary));
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes nameShimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .about__desc { font-size: 0.9rem; color: var(--text-light); letter-spacing: 1px; }

        /* ── Info cards ── */
        .about__details { display: flex; flex-direction: column; gap: 32px; }
        .about__info-cards {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        }
        .about__info-card {
          background: var(--warm-white);
          padding: 16px 20px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--pink-mist);
          display: flex; flex-direction: column; gap: 4px;
          opacity: 0;
          transform: scale(0.85);
          animation: cardPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: inherit;
          transition: var(--transition-smooth);
        }
        .about__reveal--visible .about__info-card {
          opacity: 0;
          animation: cardPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes cardPopIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .about__info-card:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 6px 20px rgba(212, 98, 138, 0.12);
          border-color: var(--pink-accent);
        }
        .about__info-label { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 2px; }
        .about__info-value { font-size: 1rem; color: var(--text-primary); font-weight: 500; }

        /* ── Tags ── */
        .about__section-label {
          font-size: 1rem; color: var(--rose); margin-bottom: 16px;
          letter-spacing: 2px; font-family: "Noto Serif SC", serif;
        }
        .about__tags-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .about__tag {
          padding: 8px 18px;
          background: var(--warm-white);
          border: 1px solid var(--pink-blush);
          border-radius: 50px;
          font-size: 0.85rem; color: var(--text-secondary);
          opacity: 0;
          transform: translateY(16px);
          animation: tagBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: inherit;
          transition: var(--transition-smooth);
        }
        .about__reveal--visible .about__tag {
          opacity: 0;
          animation: tagBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes tagBounceIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.8); }
          60% { opacity: 1; transform: translateY(-4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .about__tag:hover {
          background: var(--pink-mist);
          border-color: var(--pink-accent);
          color: var(--pink-deep);
          transform: translateY(-2px) scale(1.06);
        }

        /* ── Favorites ── */
        .about__favorites-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
        }
        .about__fav-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; background: var(--warm-white);
          border-radius: var(--radius-sm); border: 1px solid var(--pink-mist);
          opacity: 0;
          transform: translateX(-20px);
          animation: favSlideIn 0.5s ease forwards;
          animation-delay: inherit;
          transition: var(--transition-smooth);
        }
        .about__reveal--visible .about__fav-item {
          opacity: 0;
          animation: favSlideIn 0.5s ease forwards;
        }
        .about__fav-item:nth-child(even) {
          transform: translateX(20px);
        }
        .about__reveal--visible .about__fav-item:nth-child(even) {
          animation-name: favSlideInRight;
        }
        @keyframes favSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes favSlideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .about__fav-item:hover {
          border-color: var(--pink-accent);
          transform: translateX(4px) scale(1.02);
          box-shadow: 0 4px 16px rgba(212, 98, 138, 0.1);
        }
        .about__fav-emoji { font-size: 1.4rem; }
        .about__fav-label { display: block; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 2px; }
        .about__fav-value { display: block; font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }

        /* ── Confession ── */
        .about__confession {
          text-align: center;
          padding: 50px 40px;
          background: linear-gradient(135deg, var(--pink-lightest), var(--warm-white));
          border-radius: var(--radius-xl);
          border: 1px solid var(--pink-blush);
          position: relative;
          overflow: hidden;
        }
        .about__confession::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(232,126,160,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .about__confession-heart {
          margin-bottom: 16px;
          animation: confessionHeart 2.5s ease-in-out infinite;
        }
        @keyframes confessionHeart {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.2); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        .about__confession-text {
          font-size: 1.15rem; line-height: 2.2; color: var(--text-secondary);
          letter-spacing: 2px; font-family: "Noto Serif SC", serif;
          white-space: pre-line;
          position: relative;
          z-index: 1;
        }
        .about__confession-sign {
          margin-top: 20px; font-size: 0.9rem; color: var(--pink-accent);
          letter-spacing: 2px; position: relative; z-index: 1;
        }

        @media (max-width: 1024px) {
          .about__grid { grid-template-columns: 1fr; gap: 40px; }
          .about__portrait-glow { max-width: 300px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          .about-section { padding: 80px 0; }
          .about__info-cards { grid-template-columns: repeat(2, 1fr); }
          .about__favorites-grid { grid-template-columns: 1fr; }
          .about__confession { padding: 36px 24px; }
          .about__confession-text { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default About;
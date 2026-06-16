import { useState, useEffect, useRef } from "react";
import CloudGallery from './CloudGallery'
import { useAdmin } from "../context/AdminContext";

/* ── Duck SVG component ── */
const Duck = ({ direction = "right", label }) => (
  <div className="hero-duck">
    <svg viewBox="0 0 90 80" width="90" height="80" style={{ transform: direction === "left" ? "scaleX(-1)" : "none" }}>
      <ellipse cx="45" cy="58" rx="28" ry="20" fill="#FFD54F" />
      <circle cx="45" cy="32" r="18" fill="#FFD54F" />
      <circle cx="50" cy="28" r="4.5" fill="#3E2723" />
      <circle cx="52" cy="26" r="2" fill="#fff" />
      <ellipse cx="66" cy="36" rx="12" ry="4.5" fill="#FF8A65" />
      <ellipse cx="38" cy="60" rx="14" ry="16" fill="#FFC107" transform="rotate(-15 38 60)" />
      <ellipse cx="36" cy="70" rx="8" ry="4" fill="#FF8A65" />
    </svg>
    <span className="hero-duck__label">{label}</span>
  </div>
);

/* ── Floating Cloud ── */
const Cloud = ({ style }) => (
  <div className="hero-cloud" style={style}>
    <div className="hero-cloud__inner" />
  </div>
);

/* ── Main Hero ── */
const Hero = () => {
  const { content } = useAdmin();
  const { hero = {} } = content || {};
  const [time, setTime] = useState({ days: 0, h: "00", m: "00", s: "00" });

  useEffect(() => {
    const start = new Date(content.footer.startDate || "2023-09-15");
    const tick = () => {
      const now = new Date();
      const diff = now - start;
      if (diff <= 0) { setTime({ days: 0, h: "00", m: "00", s: "00" }); return; }
      const days = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        days,
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [content.footer.startDate]);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero-new">
      {/* ── Scene background ── */}
      <CloudGallery />\n      <div className="hero-scene">
        <div className="hero-sky" />
        <Cloud style={{ top: "8%", left: "5%", width: 120, animationDelay: "0s" }} />
        <Cloud style={{ top: "14%", left: "35%", width: 160, animationDelay: "-8s" }} />
        <Cloud style={{ top: "10%", right: "10%", width: 100, animationDelay: "-16s" }} />
        <Cloud style={{ top: "20%", left: "60%", width: 130, animationDelay: "-4s" }} />
        <div className="hero-hills" />
        <div className="hero-hill hero-hill--back" />
        <div className="hero-hill hero-hill--front" />
        <div className="hero-grid" />
      </div>

      {/* ── Content ── */}
      <div className="hero-new__content">
        {/* Ducks + Heart */}
        <div className="hero-couple">
          <Duck direction="right" label={hero.duckLeft} />
          <div className="hero-heart-wrap">
            <svg className="hero-heart" viewBox="0 0 32 32" width="40" height="40">
              <path d="M16 28.5l-2.2-2C6 19 2.5 15.5 2.5 11 2.5 7.5 5.2 4.5 8.5 4.5c2 0 4 1 5.5 2.8C15.5 5.5 17.5 4.5 19.5 4.5 22.8 4.5 25.5 7.5 25.5 11c0 4.5-3.5 8-11.3 15.5L16 28.5z" fill="#e74c3c" />
            </svg>
          </div>
          <Duck direction="left" label={hero.duckRight} />
        </div>

        {/* Timer */}
        <div className="hero-timer">
          <p className="hero-timer__title">这是我们一起走过的</p>
          <div className="hero-timer__display">
            <div className="hero-timer__days-wrap">
              <span className="hero-timer__days-num">{time.days}</span>
              <span className="hero-timer__days-unit">天</span>
            </div>
            <div className="hero-timer__colon">:</div>
            <div className="hero-timer__digit">{time.h}</div>
            <div className="hero-timer__colon">:</div>
            <div className="hero-timer__digit">{time.m}</div>
            <div className="hero-timer__colon">:</div>
            <div className="hero-timer__digit">{time.s}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hero-nav">
          <button className="hero-nav__btn hero-nav__btn--purple" onClick={() => scrollTo("#album")}>
            <span className="hero-nav__emoji">✨</span>
            <span>点点滴滴</span>
          </button>
          <button className="hero-nav__btn hero-nav__btn--blue" onClick={() => scrollTo("#whisper")}>
            <span className="hero-nav__emoji">💬</span>
            <span>留言板</span>
          </button>
          <button className="hero-nav__btn hero-nav__btn--yellow" onClick={() => scrollTo("#about")}>
            <span className="hero-nav__emoji">💕</span>
            <span>关于我们</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="hero-new__scroll">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(120,140,130,0.4)" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <style>{`
        /* ── Scene ── */
        .hero-new {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f0f4f2;
        }
        .hero-scene {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .hero-sky {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #c9e8ff 0%, #d8f0e8 55%, #e8f5e9 100%);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,190,185,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,190,185,0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .hero-hills {
          position: absolute;
          bottom: 0;
          width: 120%;
          height: 28vh;
          background: linear-gradient(180deg, #b5dab0 0%, #8fca8a 100%);
          border-radius: 50% 50% 0 0;
          left: -10%;
        }
        .hero-hill--back {
          bottom: 0;
          width: 100%;
          height: 22vh;
          background: linear-gradient(180deg, #c5e4c0 0%, #a0d49c 100%);
          border-radius: 50% 50% 0 0;
          left: 15%;
          z-index: 1;
        }
        .hero-hill--front {
          bottom: 0;
          width: 110%;
          height: 18vh;
          background: linear-gradient(180deg, #d5ecd0 0%, #b8dfb4 100%);
          border-radius: 50% 50% 0 0;
          left: -5%;
          z-index: 2;
        }
        .hero-hill--back, .hero-hill--front {
          position: absolute;
        }

        /* ── Clouds ── */
        .hero-cloud {
          position: absolute;
          z-index: 1;
          animation: cloudDrift 35s linear infinite;
          pointer-events: none;
        }
        .hero-cloud__inner {
          padding-top: 35%;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          filter: blur(10px);
        }
        @keyframes cloudDrift {
          0%   { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }

        /* ── Content card ── */
        .hero-new__content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 40px 32px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 12px 48px rgba(120,140,130,0.08);
          max-width: 520px;
          width: 90%;
          margin: 80px 12px 40px;
        }

        /* ── Ducks ── */
        .hero-couple {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
        }
        .hero-duck {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .hero-duck__label {
          font-size: 0.85rem;
          color: #7a8a78;
          letter-spacing: 3px;
          font-weight: 500;
        }
        .hero-heart-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: heartPulse 1.8s ease-in-out infinite;
          margin: 0 4px;
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          12% { transform: scale(1.2); }
          25% { transform: scale(1); }
          38% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }

        /* ── Timer ── */
        .hero-timer {
          text-align: center;
          width: 100%;
        }
        .hero-timer__title {
          font-size: 0.85rem;
          color: #8a9a88;
          letter-spacing: 4px;
          margin-bottom: 12px;
        }
        .hero-timer__display {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }
        .hero-timer__days-wrap {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-right: 6px;
        }
        .hero-timer__days-num {
          font-size: 3.2rem;
          font-weight: 700;
          color: #6a8a68;
          line-height: 1;
          font-family: "Noto Serif SC", serif;
        }
        .hero-timer__days-unit {
          font-size: 1rem;
          color: #8aaa88;
          letter-spacing: 2px;
        }
        .hero-timer__digit {
          font-size: 2.6rem;
          font-weight: 600;
          color: #5a7a58;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          font-family: "Noto Serif SC", serif;
          min-width: 1.4em;
          text-align: center;
        }
        .hero-timer__colon {
          font-size: 2rem;
          color: #8aaa88;
          margin: 0 2px;
          animation: colonBlink 1s step-end infinite;
          line-height: 1;
        }
        @keyframes colonBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* ── Navigation ── */
        .hero-nav {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
        }
        .hero-nav__btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 22px;
          border-radius: 50px;
          font-size: 0.9rem;
          letter-spacing: 2px;
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          font-weight: 500;
        }
        .hero-nav__btn:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(120,140,130,0.12);
        }
        .hero-nav__btn--purple {
          background: #ede4f5;
          color: #6a4a7a;
        }
        .hero-nav__btn--blue {
          background: #e0edf5;
          color: #4a6a7a;
        }
        .hero-nav__btn--yellow {
          background: #f5f0d8;
          color: #7a6a3a;
        }
        .hero-nav__emoji {
          font-size: 1.1rem;
        }

        /* ── Scroll ── */
        .hero-new__scroll {
          margin-top: 4px;
          animation: scrollBounce 2.5s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%,100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 0.7; }
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .hero-new__content {
            padding: 28px 20px;
            gap: 22px;
            margin: 60px 8px 30px;
          }
          .hero-timer__days-num { font-size: 2.4rem; }
          .hero-timer__digit { font-size: 2rem; }
          .hero-timer__colon { font-size: 1.6rem; }
          .hero-nav__btn { padding: 8px 16px; font-size: 0.8rem; }
          .hero-duck svg { width: 60px; height: auto; }
          .hero-heart-wrap svg { width: 30px; height: auto; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
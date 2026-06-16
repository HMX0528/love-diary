import { useState } from "react";
import useScrollReveal from '../hooks/useScrollReveal'
import { ChibiGirl, ChibiBoy } from './Decorative'
import { useAdmin } from "../context/AdminContext";
import Lightbox from "./Lightbox";

const INITIAL_SHOW = 12;

const Album = () => {
  const { content, getImage } = useAdmin();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [secRef, secVisible] = useScrollReveal();

  const photos = content.album.map((photo, i) => ({
    ...photo,
    src: getImage(`album.${i}`) || photo.src,
  }));

  const openLightbox = (index) => {
    // If the grid is collapsed and user clicks the show-all card, don't open lightbox
    setLightboxIndex(index);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const nextImage = () =>
    setLightboxIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  const visible = showAll ? photos : photos.slice(0, INITIAL_SHOW);
  const hiddenCount = photos.length - INITIAL_SHOW;

  return (
    <section id="album" ref={secRef} className={`album-section section-reveal ${secVisible ? "section-reveal--visible" : ""}`}>
      <ChibiGirl className="deco-char--left" style={{ top: 20, left: 12 }} />
<ChibiBoy className="deco-char--right" style={{ bottom: 20, right: 12 }} />
      <div className="container">
        <h2 className="section-title">专属相册</h2>
        <p className="section-subtitle">每一帧画面，都是心动的证据</p>

        <div className="album__grid">
          {visible.map((photo, i) => (
            <div
              key={photo.id}
              className={`album__card album__card--${photo.layout}`}
              onClick={() => openLightbox(showAll ? i : i)}
            >
              <div className="album__card-inner">
                {photo.src ? (
                  <img src={photo.src} alt={photo.caption} className="album__img" />
                ) : (
                  <div className="album__placeholder">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--pink-warm)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
                <div className="album__card-overlay">
                  <div className="album__card-info">
                    <span className="album__card-caption">{photo.caption}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show-all card — only when collapsed */}
          {!showAll && hiddenCount > 0 && (
            <div className="album__card album__card--showall" onClick={() => setShowAll(true)}>
              <div className="album__showall-inner">
                <div className="album__showall-stack">
                  {photos.slice(INITIAL_SHOW, INITIAL_SHOW + 3).map((p, j) => (
                    <div
                      key={p.id}
                      className="album__showall-thumb"
                      style={{
                        background: p.src
                          ? `url(${p.src}) center/cover`
                          : `linear-gradient(135deg, var(--pink-blush), var(--pink-lightest))`,
                        transform: `rotate(${(j - 1) * 4}deg)`,
                        zIndex: 3 - j,
                      }}
                    />
                  ))}
                </div>
                <div className="album__showall-text">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--pink-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span className="album__showall-count">+{hiddenCount}</span>
                  <span className="album__showall-label">点击展开全部</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapse button — only when expanded */}
        {showAll && hiddenCount > 0 && (
          <div className="album__collapse-wrap">
            <button className="album__collapse-btn" onClick={() => setShowAll(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="19" x2="12" y2="5"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              收起
            </button>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <style>{`
        .album-section { padding: 120px 0; background: var(--cream); }
        .album__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 200px;
          gap: 16px;
        }
        .album__card {
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .album__card-inner {
          width: 100%; height: 100%;
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
        }
        .album__card:hover .album__card-inner { transform: scale(1.05); }
        .album__img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); }
        .album__placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--pink-blush), var(--pink-lightest));
          border: 2px dashed var(--pink-soft);
        }
        .album__card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(74,53,64,0.7));
          opacity: 0; transition: var(--transition-smooth);
          display: flex; align-items: flex-end; padding: 16px;
        }
        .album__card:hover .album__card-overlay { opacity: 1; }
        .album__card-info { display: flex; align-items: center; justify-content: space-between; width: 100%; color: #fff; }
        .album__card-caption { font-size: 0.85rem; letter-spacing: 1px; font-weight: 400; }

        .album__card--large { grid-column: span 2; grid-row: span 2; }
        .album__card--medium { grid-column: span 2; grid-row: span 1; }
        .album__card--small { grid-column: span 1; grid-row: span 1; }

        /* Show-all card */
        .album__card--showall {
          grid-column: span 2;
          grid-row: span 2;
          cursor: pointer;
          background: linear-gradient(135deg, var(--pink-lightest), var(--pink-mist));
          border: 2px dashed var(--pink-soft);
          transition: var(--transition-smooth);
        }
        .album__card--showall:hover {
          border-color: var(--pink-accent);
          background: linear-gradient(135deg, var(--pink-mist), var(--pink-blush));
          transform: scale(1.02);
        }
        .album__showall-inner {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px;
          position: relative;
        }
        .album__showall-stack {
          position: relative;
          width: 80px; height: 56px;
        }
        .album__showall-thumb {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          border: 2px solid var(--warm-white);
          box-shadow: 0 2px 8px rgba(74,53,64,0.08);
          background: var(--pink-blush);
        }
        .album__showall-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .album__showall-text svg { animation: showallPulse 2s ease-in-out infinite; }
        @keyframes showallPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .album__showall-count {
          font-size: 2.4rem;
          font-weight: 700;
          font-family: "Noto Serif SC", serif;
          color: var(--pink-deep);
          line-height: 1;
        }
        .album__showall-label {
          font-size: 0.85rem;
          color: var(--pink-accent);
          letter-spacing: 3px;
        }

        .album__collapse-wrap {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .album__collapse-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 28px;
          border: 1px solid var(--pink-blush);
          border-radius: 50px;
          color: var(--text-light);
          font-size: 0.85rem;
          letter-spacing: 2px;
          background: var(--warm-white);
          transition: var(--transition-smooth);
        }
        .album__collapse-btn:hover {
          border-color: var(--pink-soft);
          background: var(--pink-lightest);
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .album__grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 180px; }
        }
        @media (max-width: 768px) {
          .album__grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; gap: 12px; }
          .album__card--large { grid-column: span 2; grid-row: span 2; }
          .album__card--medium { grid-column: span 2; grid-row: span 1; }
          .album__card--small { grid-column: span 1; grid-row: span 1; }
          .album__card--showall { grid-column: span 2; grid-row: span 2; }
        }
      `}</style>
    </section>
  );
};

export default Album;
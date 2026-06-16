import { useState, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

const CLOUD_COUNT = 16;

const CloudGallery = () => {
  const { content, getImage } = useAdmin();
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  const clouds = useMemo(() => {
    if (hidden) return [];
    const items = [];
    const albumPhotos = content.album || [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const idx = i % Math.max(albumPhotos.length, 1);
      const img = getImage(`album.${idx}`);
      const isLeft = i < CLOUD_COUNT / 2;
      items.push({
        id: i,
        size: 60 + Math.random() * 90,
        left: isLeft ? 2 + Math.random() * 30 : 68 + Math.random() * 30,
        duration: 20 + Math.random() * 12,
        delay: Math.random() * 8,
        span: 12 + Math.random() * 24,
        img: img || null,
        gradient: ["#fce4ec","#f3e5f5","#fbe9e7","#e8f5e9","#e3f2fd","#fff3e0","#fce4ec","#f3e5f5","#fbe9e7","#e0f7fa","#f1f8e9","#fce4ec","#fff8e1","#fce4ec","#f3e5f5","#e8f5e9"][i],
      });
    }
    return items;
  }, [content.album, getImage, hidden]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setHidden(true); setClosing(false); }, 1800);
  };

  const handleReopen = () => {
    setHidden(false);
  };

  if (hidden && !closing) return (
    <button className="cloud-reopen" onClick={handleReopen} title="显示云朵相册">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
      <style>{`.cloud-reopen {
        position: fixed; bottom: 80px; right: 80px; z-index: 100;
        width: 44px; height: 44px; border-radius: 50%;
        background: rgba(255,255,255,0.6); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.5);
        display: flex; align-items: center; justify-content: center;
        color: #8aaa88; cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        box-shadow: 0 2px 12px rgba(120,140,130,0.1);
      }
      .cloud-reopen:hover { transform: scale(1.1); box-shadow: 0 4px 20px rgba(120,140,130,0.15); }
      @media (max-width: 768px) { .cloud-reopen { bottom: 20px; right: 20px; } }`}</style>
    </button>
  );

  return (
    <div className="cloud-gallery">
      <button className="cloud-close" onClick={handleClose} title="关闭云朵">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {clouds.map((c) => (
        <div
          key={c.id}
          className={`cloud-item ${closing ? "cloud-item--closing" : ""}`}
          style={{
            width: c.size, height: c.size * 0.7,
            left: `${c.left}%`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            "--span": `${c.span}px`,
          }}
        >
          <div className="cloud-item__body">
            <div
              className="cloud-item__image"
              style={
                c.img
                  ? { backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: `linear-gradient(135deg, ${c.gradient}, ${c.gradient}88)` }
              }
            />
          </div>
        </div>
      ))}

      <style>{`
        .cloud-gallery {
          position: absolute; inset: 0; overflow: hidden;
          pointer-events: none; z-index: 1;
        }
        .cloud-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.3); backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          color: rgba(120,140,130,0.5); cursor: pointer;
          transition: all 0.3s; pointer-events: auto;
        }
        .cloud-close:hover { background: rgba(255,255,255,0.5); color: rgba(120,140,130,0.8); }

        .cloud-item {
          position: absolute; bottom: -15%;
          animation: cloudFloat ease-in-out infinite;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .cloud-item--closing {
          animation: none !important;
          transition: transform 1.8s ease-in, opacity 1.8s ease-in !important;
          transform: translateY(120vh) scale(0.4) !important;
          opacity: 0 !important;
        }

        .cloud-item__body {
          width: 100%; height: 100%;
          padding: 4px;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(3px);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          box-shadow: 0 8px 32px rgba(120,140,130,0.08), 0 0 0 1px rgba(255,255,255,0.4);
        }
        .cloud-item__image {
          width: 100%; height: 100%;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background-size: cover; background-position: center;
          opacity: 0.85;
        }

        @keyframes cloudFloat {
          0%   { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          12%  { transform: translateY(-12vh) translateX(calc(var(--span,20px)*-0.3)) scale(1); opacity: 0.95; }
          30%  { transform: translateY(-30vh) translateX(calc(var(--span,20px)*0.35)) scale(1.02); opacity: 0.9; }
          50%  { transform: translateY(-50vh) translateX(calc(var(--span,20px)*-0.2)) scale(1); opacity: 0.75; }
          70%  { transform: translateY(-70vh) translateX(calc(var(--span,20px)*0.15)) scale(0.95); opacity: 0.5; }
          88%  { transform: translateY(-88vh) translateX(calc(var(--span,20px)*-0.05)) scale(0.85); opacity: 0.2; }
          100% { transform: translateY(-105vh) translateX(0) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CloudGallery;
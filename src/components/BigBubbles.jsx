import { useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

const BigBubbles = () => {
  const { content, getImage } = useAdmin();

  const bubbles = useMemo(() => {
    const items = [];
    const albumPhotos = content.album || [];
    for (let i = 0; i < 8; i++) {
      const idx = i % albumPhotos.length;
      const img = getImage(`album.${idx}`);
      const isLeft = i < 4;
      items.push({
        id: i,
        size: 35 + Math.random() * 50,
        left: isLeft ? 4 + Math.random() * 16 : 80 + Math.random() * 16,
        duration: 28 + Math.random() * 14,
        delay: i * 3.5 + Math.random() * 5,
        img: img || null,
        gradient: ["#fce4ec","#f3e5f5","#fbe9e7","#e8f5e9","#e3f2fd","#fff3e0","#fce4ec","#f3e5f5"][i],
      });
    }
    return items;
  }, [content.album, getImage]);

  return (
    <div className="big-bubbles" aria-hidden="true">
      {bubbles.map((b) => (
        <div key={b.id} className="big-bubble"
          style={{
            width: b.size, height: b.size,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div className="big-bubble__inner"
            style={b.img ? { backgroundImage: `url(${b.img})` } : { background: `linear-gradient(135deg, ${b.gradient}, ${b.gradient}88)` }}
          />
        </div>
      ))}
      <style>{`
        .big-bubbles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .big-bubble {
          position: absolute; bottom: -15%;
          border-radius: 50%;
          opacity: 0;
          animation: bubbleFloat linear infinite;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
        .big-bubble__inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          background-size: cover; background-position: center;
          box-shadow: 0 4px 16px rgba(212,98,138,0.08);
          opacity: 0.5;
        }
        @keyframes bubbleFloat {
          0%   { transform: translateY(0) scale(0.3); opacity: 0; }
          12%  { transform: translateY(-10vh) scale(1); opacity: 0.55; }
          40%  { transform: translateY(-35vh) scale(1.02); opacity: 0.45; }
          65%  { transform: translateY(-60vh) scale(0.95); opacity: 0.3; }
          88%  { transform: translateY(-85vh) scale(0.7); opacity: 0.12; }
          100% { transform: translateY(-105vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
export default BigBubbles;
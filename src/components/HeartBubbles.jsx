import { useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

const HEART_COUNT = 14;
const heartMask = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='white'/%3E%3C/svg%3E\")";

const HeartBubbles = () => {
  const { content, getImage } = useAdmin();
  const hearts = useMemo(() => {
    const items = [];
    for (let i = 0; i < HEART_COUNT; i++) {
      const img = getImage(`album.${i % content.album.length}`);
      const isLeft = i < HEART_COUNT / 2;
      items.push({
        id: i, size: 50 + Math.random() * 60,
        left: isLeft ? 4 + Math.random() * 16 : 80 + Math.random() * 16,
        duration: 18 + Math.random() * 8, delay: (isLeft ? i : i - 7) * 2 + Math.random() * 3,
        img, gradient: ["#fce4ec","#f3e5f5","#fbe9e7","#e8f5e9","#e3f2fd","#fff3e0","#fce4ec","#f3e5f5","#fbe9e7","#e0f7fa","#f1f8e9","#fce4ec","#fff8e1","#fce4ec"][i],
      });
    }
    return items;
  }, [content.album, getImage]);

  return (
    <div className="heart-bubbles" aria-hidden="true">
      {hearts.map((h) => (
        <div key={h.id} className="heart-bubble"
          style={{ width: h.size, height: h.size * 0.92, left: `${h.left}%`, animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}
        >
          <div className="heart-bubble__inner"
            style={h.img ? { backgroundImage: `url(${h.img})` } : { background: `linear-gradient(135deg, ${h.gradient}, ${h.gradient}88)` }}
          />
        </div>
      ))}
      <style>{`
        .heart-bubbles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .heart-bubble { position: absolute; bottom: -15%; opacity: 0; animation: heartRise ease-in-out infinite; animation-fill-mode: forwards; will-change: transform, opacity; }
        .heart-bubble__inner { width: 100%; height: 100%; mask-image: ${heartMask}; -webkit-mask-image: ${heartMask}; mask-size: contain; mask-repeat: no-repeat; mask-position: center; background-size: cover; background-position: center; opacity: 0.9; }
        @keyframes heartRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          10% { transform: translateY(-8vh) scale(1); opacity: 0.95; }
          35% { transform: translateY(-32vh) scale(1.05); opacity: 0.85; }
          60% { transform: translateY(-56vh) scale(0.95); opacity: 0.6; }
          85% { transform: translateY(-84vh) scale(0.8); opacity: 0.25; }
          100% { transform: translateY(-105vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
export default HeartBubbles;
import { useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

const HangingFrames = () => {
  const { content, getImage } = useAdmin();
  const frames = useMemo(() => {
    const items = [];
    const albumPhotos = content.album || [];
    for (let i = 0; i < 8; i++) {
      const img = getImage(`album.${i % albumPhotos.length}`);
      const isLeft = i < 4;
      items.push({
        id: i, size: 80 + Math.random() * 100,
        left: isLeft ? 3 + Math.random() * 20 : 77 + Math.random() * 20,
        duration: 16 + Math.random() * 8,
        delay: (isLeft ? i : i - 4) * 3 + Math.random() * 3,
        img, swing: 8 + Math.random() * 8, drop: 30 + Math.random() * 25,
        gradient: ["#fce4ec","#f3e5f5","#fbe9e7","#e8f5e9","#e3f2fd","#fff3e0","#fce4ec","#f3e5f5"][i],
      });
    }
    return items;
  }, [content.album, getImage]);

  return (
    <div className="frame-falling" aria-hidden="true">
      {frames.map((f) => (
        <div key={f.id} className="frame-item"
          style={{
            width: f.size, height: f.size * 1.2, left: `${f.left}%`,
            animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`,
            "--swing": `${f.swing}deg`, "--drop": `${f.drop}vh`,
          }}
        >
          <div className="frame-item__string" />
          <div className="frame-item__body">
            <div className="frame-item__img"
              style={f.img ? { backgroundImage: `url(${f.img})` } : { background: `linear-gradient(135deg, ${f.gradient}, ${f.gradient}88)` }}
            />
          </div>
        </div>
      ))}
      <style>{`
        .frame-falling { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .frame-item { position: absolute; top: 0; transform-origin: top center; transform: translateY(-120%); opacity: 0; animation: frameAnim ease-in-out infinite; animation-fill-mode: forwards; will-change: transform, opacity; }
        .frame-item__string { width: 1px; height: 16px; margin: 0 auto; background: linear-gradient(180deg, transparent, rgba(160,130,140,0.2)); }
        .frame-item__body { width: 100%; height: calc(100% - 16px); padding: 5px; background: rgba(255,255,255,0.65); border-radius: 3px; box-shadow: 0 6px 24px rgba(120,80,90,0.10); }
        .frame-item__img { width: 100%; height: 100%; border-radius: 1px; background-size: cover; background-position: center; opacity: 0.92; }
        @keyframes frameAnim {
          0% { transform: translateY(-120%) rotate(0deg); opacity: 0; }
          12% { transform: translateY(var(--drop,30vh)) rotate(0deg); opacity: 1; }
          20% { transform: translateY(var(--drop,30vh)) rotate(calc(var(--swing,10deg)*-1)); }
          30% { transform: translateY(calc(var(--drop,30vh)-4px)) rotate(calc(var(--swing,10deg)*0.85)); }
          40% { transform: translateY(var(--drop,30vh)) rotate(calc(var(--swing,10deg)*-0.6)); }
          50% { transform: translateY(calc(var(--drop,30vh)-2px)) rotate(calc(var(--swing,10deg)*0.35)); }
          58% { transform: translateY(var(--drop,30vh)) rotate(calc(var(--swing,10deg)*-0.1)); }
          64% { transform: translateY(var(--drop,30vh)) rotate(0deg); opacity: 1; }
          72% { transform: translateY(calc(var(--drop,30vh)*0.3)) rotate(0deg); opacity: 0.5; }
          80% { transform: translateY(-30%) rotate(0deg); opacity: 0; }
          100% { transform: translateY(-120%) rotate(0deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
export default HangingFrames;
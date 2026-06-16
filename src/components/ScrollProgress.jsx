import { useState, useEffect } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        setProgress(p);
        setVisible(scrollTop > 50);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`scroll-progress ${visible ? "scroll-progress--visible" : ""}`}>
      <div className="scroll-progress__bar" style={{ width: `${progress * 100}%` }} />
      <style>{`
        .scroll-progress {
          position: fixed; top: 0; left: 0; right: 0;
          height: 3px; z-index: 1001;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .scroll-progress--visible { opacity: 1; }
        .scroll-progress__bar {
          height: 100%;
          background: linear-gradient(90deg, var(--pink-accent), var(--pink-deep), var(--rose));
          border-radius: 0 2px 2px 0;
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(212, 98, 138, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ScrollProgress;
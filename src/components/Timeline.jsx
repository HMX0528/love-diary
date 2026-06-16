import { useRef, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";

const typeLabels = {
  meet: "相遇", date: "约会", confess: "告白",
  love: "浪漫", anniversary: "纪念", travel: "旅行",
};

const RevealCard = ({ children, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`timeline__reveal ${visible ? "timeline__reveal--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      {children}
    </div>
  );
};

const Timeline = () => {
  const { content, getImage } = useAdmin();

  return (
    <section id="timeline" className="timeline-section">
      <div className="container">
        <h2 className="section-title">我们的故事</h2>
        <p className="section-subtitle">从相遇到相守，每一步都值得铭记</p>

        <div className="timeline">
          <div className="timeline__line" />
          {content.timeline.map((event, i) => {
            const imgSrc = getImage(`timeline.${i}`);
            return (
              <RevealCard key={i} index={i}>
                <div
                  className={`timeline__card ${
                    i % 2 === 0 ? "timeline__card--left" : "timeline__card--right"
                  }`}
                >
                  <div className="timeline__card-dot">
                    <span className="timeline__card-year">{event.year}</span>
                  </div>
                  <div className="timeline__card-body">
                    <div className="timeline__card-header">
                      <span className="timeline__card-month">{event.month}</span>
                      <span className={`timeline__card-type timeline__card-type--${event.type}`}>
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    <h3 className="timeline__card-title">{event.title}</h3>
                    <p className="timeline__card-subtitle">{event.subtitle}</p>
                    <p className="timeline__card-desc">{event.description}</p>
                    <div className="timeline__card-photo">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={event.title}
                          style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                        />
                      ) : (
                        <div className="timeline__photo-placeholder">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--pink-warm)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>添加合照</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RevealCard>
            );
          })}
        </div>
      </div>

      <style>{`
        .timeline-section {
          padding: 120px 0;
          background: linear-gradient(180deg, var(--cream) 0%, var(--pink-lightest) 100%);
          overflow: hidden;
        }
        .timeline { position: relative; max-width: 1000px; margin: 0 auto; padding: 20px 0; }

        /* === Reveal animation === */
        .timeline__reveal {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          filter: blur(6px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity, filter;
        }
        .timeline__reveal--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .timeline__reveal:nth-child(even) .timeline__card--left .timeline__card-body,
        .timeline__reveal:nth-child(even) .timeline__card--right .timeline__card-body {
          transition-delay: inherit;
        }

        /* === Line animation === */
        .timeline__line {
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--pink-soft), var(--pink-accent), var(--pink-soft));
          transform: translateX(-50%);
          animation: lineGrow 2s ease-out forwards;
          transform-origin: top center;
        }
        @keyframes lineGrow {
          from { transform: translateX(-50%) scaleY(0); }
          to { transform: translateX(-50%) scaleY(1); }
        }

        .timeline__card { position: relative; width: 50%; padding: 20px 0; }
        .timeline__card--left { padding-right: 50px; left: 0; }
        .timeline__card--right { padding-left: 50px; left: 50%; }
        .timeline__card-dot {
          position: absolute; top: 32px; width: 20px; height: 20px;
          background: var(--pink-accent); border: 4px solid var(--cream);
          border-radius: 50%; box-shadow: 0 0 0 4px var(--pink-soft),
            0 0 20px rgba(212, 98, 138, 0.25);
          z-index: 2;
          transition: box-shadow 0.5s ease;
        }
        .timeline__card-body:hover + .timeline__card-dot,
        .timeline__card:hover .timeline__card-dot {
          box-shadow: 0 0 0 4px var(--pink-accent), 0 0 30px rgba(212, 98, 138, 0.4);
        }
        .timeline__card--left .timeline__card-dot { right: -10px; }
        .timeline__card--right .timeline__card-dot { left: -10px; }

        .timeline__card-year {
          position: absolute; top: -28px; left: 50%; transform: translateX(-50%);
          font-size: 0.7rem; color: var(--pink-deep); white-space: nowrap; font-weight: 500;
        }
        .timeline__card-body {
          background: var(--warm-white); border-radius: var(--radius-md);
          padding: 28px; box-shadow: var(--shadow-card);
          border: 1px solid var(--pink-mist);
          transition:
            transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.5s ease,
            border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        /* Dreamy glow on hover */
        .timeline__card-body::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(232, 126, 160, 0.04) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .timeline__card-body:hover::before { opacity: 1; }
        .timeline__card-body:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 12px 40px rgba(212, 98, 138, 0.18);
          border-color: var(--pink-soft);
        }
        .timeline__card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .timeline__card-month { font-size: 0.8rem; color: var(--text-muted); letter-spacing: 2px; }
        .timeline__card-type { font-size: 0.7rem; padding: 3px 12px; border-radius: 50px; letter-spacing: 1px; }
        .timeline__card-type--meet { background: #fce4ec; color: #c44a7a; }
        .timeline__card-type--date { background: #f3e5f5; color: #7b1fa2; }
        .timeline__card-type--confess { background: #fce4ec; color: #d4628a; }
        .timeline__card-type--love { background: #fbe9e7; color: #bf360c; }
        .timeline__card-type--anniversary { background: #e8f5e9; color: #2e7d32; }
        .timeline__card-type--travel { background: #e3f2fd; color: #1565c0; }
        .timeline__card-title { font-size: 1.3rem; color: var(--text-primary); margin-bottom: 4px; }
        .timeline__card-subtitle { font-size: 0.85rem; color: var(--pink-accent); margin-bottom: 12px; letter-spacing: 1px; }
        .timeline__card-desc { font-size: 0.9rem; line-height: 1.8; color: var(--text-secondary); }
        .timeline__card-photo { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--pink-mist); }
        .timeline__photo-placeholder {
          display: flex; align-items: center; gap: 10px;
          padding: 20px; border: 2px dashed var(--pink-blush);
          border-radius: var(--radius-sm); color: var(--pink-warm);
          font-size: 0.8rem; letter-spacing: 1px; justify-content: center;
          transition: var(--transition-smooth);
        }
        .timeline__photo-placeholder:hover { border-color: var(--pink-accent); background: var(--pink-lightest); }

        @media (max-width: 768px) {
          .timeline__line { left: 20px; }
          .timeline__card { width: 100%; padding: 20px 0 20px 50px; left: 0 !important; }
          .timeline__card--left { padding-right: 0; padding-left: 50px; }
          .timeline__card--right { padding-left: 50px; }
          .timeline__card--left .timeline__card-dot,
          .timeline__card--right .timeline__card-dot { left: 10px; right: auto; }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
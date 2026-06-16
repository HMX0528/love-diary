import { useEffect, useCallback } from 'react'

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!images || images.length === 0 || currentIndex === null) return null

  const image = images[currentIndex]

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="关闭">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="上一张">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="下一张">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </>
      )}

      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox__image-container">
          {image.src ? (
            <img src={image.src} alt={image.caption || ''} className="lightbox__image" />
          ) : (
            <div className="lightbox__placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--pink-soft)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>照片待添加</p>
            </div>
          )}
        </div>
        {image.caption && (
          <p className="lightbox__caption">{image.caption}</p>
        )}
        <div className="lightbox__counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30, 20, 24, 0.92);
          backdrop-filter: blur(12px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFadeIn 0.3s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lightbox__close {
          position: absolute;
          top: 24px;
          right: 24px;
          color: #fff;
          opacity: 0.7;
          padding: 8px;
          z-index: 2001;
          transition: opacity 0.3s;
        }
        .lightbox__close:hover { opacity: 1; }
        .lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
          opacity: 0.6;
          padding: 16px;
          z-index: 2001;
          transition: var(--transition-smooth);
        }
        .lightbox__nav:hover { opacity: 1; }
        .lightbox__nav--prev { left: 20px; }
        .lightbox__nav--next { right: 20px; }
        .lightbox__content {
          max-width: 80vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .lightbox__image-container {
          max-width: 80vw;
          max-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox__image {
          max-width: 80vw;
          max-height: 75vh;
          object-fit: contain;
          border-radius: var(--radius-sm);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .lightbox__placeholder {
          width: 400px;
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
          border: 2px dashed rgba(255,255,255,0.15);
          color: var(--pink-warm);
        }
        .lightbox__caption {
          color: rgba(255,255,255,0.8);
          font-size: 0.95rem;
          letter-spacing: 1px;
          text-align: center;
        }
        .lightbox__counter {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          letter-spacing: 2px;
        }
        @media (max-width: 768px) {
          .lightbox__content { max-width: 95vw; }
          .lightbox__image-container { max-width: 95vw; }
          .lightbox__image { max-width: 95vw; }
          .lightbox__placeholder { width: 280px; height: 280px; }
        }
      `}</style>
    </div>
  )
}

export default Lightbox

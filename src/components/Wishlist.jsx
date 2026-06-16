import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { ChibiGirl, ChibiBoy } from './Decorative'
import { useAdmin } from '../context/AdminContext'

const Wishlist = () => {
  const { content, setContent } = useAdmin()
  const [secRef, secVisible] = useScrollReveal();
  const [newWish, setNewWish] = useState('')
  const [filter, setFilter] = useState('all')

  const wishes = content.wishlist

  const toggleWish = (id) => {
    setContent(prev => ({
      ...prev,
      wishlist: prev.wishlist.map(w => w.id === id ? { ...w, done: !w.done } : w),
    }))
  }

  const addWish = () => {
    if (!newWish.trim()) return
    const wish = { id: Date.now(), text: newWish.trim(), done: false }
    setContent(prev => ({ ...prev, wishlist: [...prev.wishlist, wish] }))
    setNewWish('')
  }

  const deleteWish = (id) => {
    setContent(prev => ({ ...prev, wishlist: prev.wishlist.filter(w => w.id !== id) }))
  }

  const doneCount = wishes.filter(w => w.done).length
  const filtered = filter === 'all' ? wishes : filter === 'done' ? wishes.filter(w => w.done) : wishes.filter(w => !w.done)

  return (
    <section id="wishlist" ref={secRef} className={`wishlist-section section-reveal ${secVisible ? "section-reveal--visible" : ""}`}>
      <ChibiGirl className="deco-char--left" style={{ top: 20, left: 12 }} />
<ChibiBoy className="deco-char--right" style={{ bottom: 20, right: 12 }} />
      <div className="container">
        <h2 className="section-title">情侣愿望清单</h2>
        <p className="section-subtitle">想和你一起做完这些事</p>

        <div className="wishlist__progress">
          <div className="wishlist__progress-info">
            <span>已完成 {doneCount}/{wishes.length}</span>
            <span>{Math.round((doneCount / wishes.length) * 100)}%</span>
          </div>
          <div className="wishlist__progress-bar">
            <div className="wishlist__progress-fill" style={{ width: `${(doneCount / wishes.length) * 100}%` }} />
          </div>
        </div>

        <div className="wishlist__filters">
          {[
            { key: 'all', label: '全部' },
            { key: 'done', label: '已完成' },
            { key: 'pending', label: '待打卡' },
          ].map(f => (
            <button key={f.key} className={`wishlist__filter-btn ${filter === f.key ? 'wishlist__filter-btn--active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        <div className="wishlist__grid">
          {filtered.map(wish => (
            <div key={wish.id} className={`wishlist__item ${wish.done ? 'wishlist__item--done' : ''}`}>
              <label className="wishlist__checkbox">
                <input type="checkbox" checked={wish.done} onChange={() => toggleWish(wish.id)} />
                <span className="wishlist__checkmark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              </label>
              <span className="wishlist__text">{wish.text}</span>
              <button className="wishlist__delete" onClick={() => deleteWish(wish.id)} aria-label="删除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="wishlist__add">
          <input className="wishlist__add-input" placeholder="写下想一起做的事..." value={newWish} onChange={e => setNewWish(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addWish() }} />
          <button className="wishlist__add-btn" onClick={addWish} disabled={!newWish.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            新增心愿
          </button>
        </div>
      </div>

      <style>{`
        .wishlist-section { padding: 120px 0; background: linear-gradient(180deg, var(--cream) 0%, var(--pink-lightest) 100%); }
        .wishlist__progress { max-width: 600px; margin: 0 auto 32px; }
        .wishlist__progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px; letter-spacing: 1px; }
        .wishlist__progress-bar { height: 6px; background: var(--pink-blush); border-radius: 3px; overflow: hidden; }
        .wishlist__progress-fill { height: 100%; background: linear-gradient(90deg, var(--pink-accent), var(--pink-deep)); border-radius: 3px; transition: width 0.5s ease; }
        .wishlist__filters { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
        .wishlist__filter-btn { padding: 8px 24px; border-radius: 50px; font-size: 0.85rem; color: var(--text-secondary); border: 1px solid var(--pink-blush); background: var(--warm-white); transition: var(--transition-smooth); letter-spacing: 1px; }
        .wishlist__filter-btn--active, .wishlist__filter-btn:hover { background: var(--pink-accent); color: #fff; border-color: var(--pink-accent); }
        .wishlist__grid { max-width: 700px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .wishlist__item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--warm-white); border: 1px solid var(--pink-mist); border-radius: var(--radius-sm); transition: var(--transition-smooth); }
        .wishlist__item:hover { border-color: var(--pink-soft); transform: translateY(-2px); box-shadow: var(--shadow-card); }
        .wishlist__item--done { opacity: 0.65; }
        .wishlist__item--done .wishlist__text { text-decoration: line-through; color: var(--text-muted); }
        .wishlist__checkbox { position: relative; width: 22px; height: 22px; flex-shrink: 0; cursor: pointer; }
        .wishlist__checkbox input { position: absolute; opacity: 0; cursor: pointer; }
        .wishlist__checkmark { position: absolute; top: 0; left: 0; width: 22px; height: 22px; border: 2px solid var(--pink-soft); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: var(--transition-smooth); color: transparent; }
        .wishlist__checkbox input:checked + .wishlist__checkmark { background: var(--pink-accent); border-color: var(--pink-accent); color: #fff; }
        .wishlist__text { font-size: 0.9rem; color: var(--text-secondary); flex: 1; }
        .wishlist__delete { color: var(--text-muted); opacity: 0; transition: var(--transition-smooth); padding: 4px; flex-shrink: 0; }
        .wishlist__item:hover .wishlist__delete { opacity: 0.4; }
        .wishlist__delete:hover { opacity: 1 !important; color: var(--rose); }
        .wishlist__add { max-width: 600px; margin: 32px auto 0; display: flex; gap: 12px; }
        .wishlist__add-input { flex: 1; padding: 14px 20px; border: 1px solid var(--pink-blush); border-radius: var(--radius-sm); background: var(--warm-white); font-size: 0.9rem; color: var(--text-primary); transition: var(--transition-smooth); }
        .wishlist__add-input:focus { border-color: var(--pink-accent); }
        .wishlist__add-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--pink-accent), var(--pink-deep)); color: #fff; border-radius: var(--radius-sm); font-size: 0.9rem; letter-spacing: 1px; transition: var(--transition-smooth); white-space: nowrap; }
        .wishlist__add-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(212, 98, 138, 0.3); }
        .wishlist__add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) { .wishlist__grid { grid-template-columns: 1fr; } .wishlist__add { flex-direction: column; } }
      `}</style>
    </section>
  )
}

export default Wishlist

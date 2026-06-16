import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="admin-section">
      <button className="admin-section__header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="admin-section__body">{children}</div>}
    </div>
  )
}

const Field = ({ label, value, onChange, multiline = false, small = false }) => (
  <div className="admin-field">
    <label className="admin-field__label">{label}</label>
    {multiline ? (
      <textarea className="admin-field__input admin-field__input--multiline" value={value || ''} onChange={e => onChange(e.target.value)} rows={small ? 2 : 3} />
    ) : (
      <input className="admin-field__input" value={value || ''} onChange={e => onChange(e.target.value)} />
    )}
  </div>
)


// Compress image before saving to localStorage (avoids QuotaExceededError)
const compressImage = (dataUrl, maxSize = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        const ratio = Math.min(maxSize / w, maxSize / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
};

const AdminPanel = () => {
const compressImage = (dataUrl, maxSize = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxSize || h > maxSize) {
        const ratio = Math.min(maxSize / w, maxSize / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.src = dataUrl
  })
}

  const { editMode, setEditMode, content, setContent, saveContent, dirty, importImage, getImage, importedImages, resetAll } = useAdmin()

  const handleExport = async () => {
      try {
        const res = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, imageCount: Object.keys(importedImages || {}).length }),
        });
        const data = await res.json();
        if (data.ok) alert('✅ 数据已导出到项目文件！');
        else alert('❌ 导出失败: ' + (data.error || ''));
      } catch (e) {
        alert('❌ 导出失败: ' + e.message);
      }
    };
  const [activeTab, setActiveTab] = useState('hero')

  if (!editMode) return null

  const update = (path, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = newContent
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return newContent
    })
  }

  const updateArrayItem = (path, index, key, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const target = path.split('.').reduce((o, k) => o[k], newContent)
      if (key === null) { target[index] = value } else { target[index][key] = value }
      return newContent
    })
  }

  const addArrayItem = (path, item) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const arr = path.split('.').reduce((o, k) => o[k], newContent)
      arr.push(item)
      return newContent
    })
  }

  const removeArrayItem = (path, index) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const arr = path.split('.').reduce((o, k) => o[k], newContent)
      arr.splice(index, 1)
      return newContent
    })
  }

  const handleImageUpload = (path, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      importImage(path, reader.result)
    }
    reader.readAsDataURL(file); e.target.value = ''
  }

  const tabs = [
    { id: 'hero', label: '首页' },
    { id: 'about', label: '关于她' },
    { id: 'timeline', label: '时间线' },
    { id: 'album', label: '相册' },
    { id: 'wishlist', label: '愿望' },
    { id: 'footer', label: '底部' },
  ]

  return (
    <>
      {/* Toggle button */}
      <button className="admin-float-btn" onClick={() => setEditMode(false)} title="关闭编辑面板">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      {/* Panel */}
      <div className="admin-panel">
        <div className="admin-panel__header">
          <h3 className="admin-panel__title">网站内容编辑</h3>
          <div className="admin-panel__actions">
            {dirty && <span className="admin-panel__unsaved">未保存</span>}
            <button className="admin-panel__save-btn" onClick={saveContent}>保存</button>
            <button className="admin-panel__export-btn" onClick={handleExport} style={{padding:"6px 10px",background:"var(--pink-mist)",color:"var(--pink-deep)",borderRadius:6,fontSize:12}}>导出</button>`n            <button className="admin-panel__reset-btn" onClick={() => { if (confirm('确定要重置所有内容吗？')) resetAll() }}>重置</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-panel__body">
          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <Section title="首页 Hero" defaultOpen>
              <Field label="徽章文字" value={content.hero.badge} onChange={v => update('hero.badge', v)} />
              <Field label="主标题" value={content.hero.title} onChange={v => update('hero.title', v)} />
              <Field label="主标题（强调）" value={content.hero.titleAccent} onChange={v => update('hero.titleAccent', v)} />
              <Field label="副标题" value={content.hero.subtitle} onChange={v => update('hero.subtitle', v)} />
            </Section>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <>
              <Section title="基础信息" defaultOpen>
                <Field label="她的名字" value={content.about.name} onChange={v => update('about.name', v)} />
                <Field label="描述文字" value={content.about.desc} onChange={v => update('about.desc', v)} />
                <div className="admin-field">
                  <label className="admin-field__label">她的照片</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload('about.portrait', e)} />
                  {getImage('about.portrait') && <img src={getImage('about.portrait')} alt="" style={{ width: 80, height: 106, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
                </div>
              </Section>
              <Section title="信息卡片">
                {content.about.infoCards.map((card, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input className="admin-field__input" style={{ width: '40%' }} value={card.label} onChange={e => updateArrayItem('about.infoCards', i, 'label', e.target.value)} placeholder="标签" />
                    <input className="admin-field__input" style={{ flex: 1 }} value={card.value} onChange={e => updateArrayItem('about.infoCards', i, 'value', e.target.value)} placeholder="值" />
                  </div>
                ))}
              </Section>
              <Section title="性格标签">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {content.about.personalityTags.map((tag, i) => (
                    <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input className="admin-field__input" style={{ width: 100, padding: '4px 8px', fontSize: 12 }} value={tag} onChange={e => updateArrayItem('about.personalityTags', i, null, e.target.value)} />
                      <button style={{ color: '#e74c3c', fontSize: 14 }} onClick={() => removeArrayItem('about.personalityTags', i)}>×</button>
                    </div>
                  ))}
                </div>
                <button className="admin-add-btn" onClick={() => addArrayItem('about.personalityTags', '新标签')}>+ 添加标签</button>
              </Section>
              <Section title="喜好清单">
                {content.about.favorites.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                    <input className="admin-field__input" style={{ width: 50 }} value={item.emoji} onChange={e => updateArrayItem('about.favorites', i, 'emoji', e.target.value)} />
                    <input className="admin-field__input" style={{ width: '30%' }} value={item.label} onChange={e => updateArrayItem('about.favorites', i, 'label', e.target.value)} />
                    <input className="admin-field__input" style={{ flex: 1 }} value={item.value} onChange={e => updateArrayItem('about.favorites', i, 'value', e.target.value)} />
                  </div>
                ))}
              </Section>
              <Section title="告白文案">
                <Field label="告白文字" value={content.about.confession} onChange={v => update('about.confession', v)} multiline />
                <Field label="落款" value={content.about.confessionSign} onChange={v => update('about.confessionSign', v)} />
              </Section>
            </>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <Section title="故事时间线" defaultOpen>
              {content.timeline.map((event, i) => (
                <div key={i} className="admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>{event.title}</strong>
                    <button style={{ color: '#e74c3c', fontSize: 12 }} onClick={() => removeArrayItem('timeline', i)}>删除</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input className="admin-field__input" style={{ width: '40%' }} value={event.year} onChange={e => updateArrayItem('timeline', i, 'year', e.target.value)} placeholder="年" />
                    <input className="admin-field__input" style={{ flex: 1 }} value={event.month} onChange={e => updateArrayItem('timeline', i, 'month', e.target.value)} placeholder="月" />
                  </div>
                  <input className="admin-field__input" style={{ marginBottom: 6 }} value={event.title} onChange={e => updateArrayItem('timeline', i, 'title', e.target.value)} placeholder="标题" />
                  <input className="admin-field__input" style={{ marginBottom: 6 }} value={event.subtitle} onChange={e => updateArrayItem('timeline', i, 'subtitle', e.target.value)} placeholder="副标题" />
                  <textarea className="admin-field__input admin-field__input--multiline" style={{ minHeight: 60, marginBottom: 6 }} value={event.description} onChange={e => updateArrayItem('timeline', i, 'description', e.target.value)} placeholder="描述" />
                  <div className="admin-field">
                    <label className="admin-field__label">配图</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(`timeline.${i}`, e)} />
                    {getImage(`timeline.${i}`) && <img src={getImage(`timeline.${i}`)} alt="" style={{ width: '100%', maxHeight: 80, objectFit: 'cover', borderRadius: 4, marginTop: 4 }} />}
                  </div>
                </div>
              ))}
              <button className="admin-add-btn" onClick={() => addArrayItem('timeline', { year: '2026', month: '1月', title: '新事件', subtitle: '副标题', description: '描述文字', type: 'love', imgSrc: null })}>+ 添加事件</button>
            </Section>
          )}

          {/* Album Tab */}
          {activeTab === 'album' && (
            <Section title="相册管理" defaultOpen>
              <p style={{ fontSize: 12, color: '#9a7d8a', marginBottom: 12 }}>点击下方的"上传"按钮替换照片，点击"标题"修改文字</p>
              {(content.album || []).map((photo, i) => (
                <div key={photo.id} className="admin-card" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input className="admin-field__input" style={{ marginBottom: 4 }} value={photo.caption} onChange={e => updateArrayItem('album', i, 'caption', e.target.value)} />
                    <span style={{ fontSize: 11, color: '#b8a0ac' }}>布局: {photo.layout}</span>
                  </div>
                  <div>
                    <input type="file" accept="image/*" style={{ fontSize: 11, width: 100 }} onChange={e => handleImageUpload(`album.${i}`, e)} />
                    {getImage(`album.${i}`) && <img src={getImage(`album.${i}`)} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginTop: 4 }} />}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <Section title="愿望清单" defaultOpen>
              {content.wishlist.map((wish, i) => (
                <div key={wish.id} className="admin-card" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="admin-field__input" style={{ flex: 1 }} value={wish.text} onChange={e => updateArrayItem('wishlist', i, 'text', e.target.value)} />
                  <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={wish.done} onChange={e => updateArrayItem('wishlist', i, 'done', e.target.checked)} />
                    完成
                  </label>
                  <button style={{ color: '#e74c3c', fontSize: 14 }} onClick={() => removeArrayItem('wishlist', i)}>×</button>
                </div>
              ))}
              <button className="admin-add-btn" onClick={() => addArrayItem('wishlist', { id: Date.now(), text: '新心愿', done: false })}>+ 添加心愿</button>
            </Section>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <Section title="底部收尾" defaultOpen>
              <Field label="告白白话" value={content.footer.dedication} onChange={v => update('footer.dedication', v)} multiline />
              <Field label="落款" value={content.footer.dedicationSign} onChange={v => update('footer.dedicationSign', v)} />
              <Field label="纪念日开始日期" value={content.footer.startDate} onChange={v => update('footer.startDate', v)} small />
            </Section>
          )}
        </div>
      </div>

      <style>{`
        .admin-float-btn {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1500;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink-accent), var(--pink-deep));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(212, 98, 138, 0.4);
          transition: var(--transition-smooth);
        }
        .admin-float-btn:hover { transform: translateY(-50%) scale(1.1); }

        .admin-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          background: #fff;
          z-index: 1499;
          box-shadow: -10px 0 40px rgba(74, 53, 64, 0.1);
          display: flex;
          flex-direction: column;
          font-size: 13px;
          color: #4a3540;
        }
        .admin-panel__header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--pink-mist);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .admin-panel__title { font-size: 15px; font-weight: 600; color: var(--pink-deep); }
        .admin-panel__actions { display: flex; gap: 8px; align-items: center; }
        .admin-panel__unsaved { font-size: 11px; color: #e67e22; }
        .admin-panel__save-btn {
          padding: 6px 16px;
          background: var(--pink-accent);
          color: #fff;
          border-radius: 6px;
          font-size: 12px;
          transition: opacity 0.2s;
        }
        .admin-panel__save-btn:hover { opacity: 0.85; }
        .admin-panel__reset-btn {
          padding: 6px 12px;
          background: transparent;
          color: #b8a0ac;
          font-size: 12px;
          border: 1px solid var(--pink-blush);
          border-radius: 6px;
        }
        .admin-panel__reset-btn:hover { border-color: #e74c3c; color: #e74c3c; }

        .admin-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 20px 8px;
          overflow-x: auto;
          flex-shrink: 0;
          border-bottom: 1px solid var(--pink-mist);
        }
        .admin-tab {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-light);
          white-space: nowrap;
          transition: var(--transition-smooth);
          background: transparent;
        }
        .admin-tab--active {
          background: var(--pink-mist);
          color: var(--pink-deep);
          font-weight: 500;
        }
        .admin-tab:hover { background: var(--pink-blush); }

        .admin-panel__body {
          flex: 1;
          overflow-y: auto;
          padding: 8px 20px 100px;
        }
        .admin-panel__body::-webkit-scrollbar { width: 4px; }
        .admin-panel__body::-webkit-scrollbar-thumb { background: var(--pink-blush); border-radius: 2px; }

        .admin-section {
          margin-bottom: 12px;
          border: 1px solid var(--pink-mist);
          border-radius: 10px;
          overflow: hidden;
        }
        .admin-section__header {
          width: 100%;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--pink-lightest);
          transition: background 0.2s;
        }
        .admin-section__header:hover { background: var(--pink-mist); }
        .admin-section__body {
          padding: 14px;
        }

        .admin-field {
          margin-bottom: 10px;
        }
        .admin-field__label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
          letter-spacing: 1px;
        }
        .admin-field__input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid var(--pink-blush);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary);
          background: var(--warm-white);
          transition: border-color 0.2s;
        }
        .admin-field__input:focus { border-color: var(--pink-accent); }
        .admin-field__input--multiline {
          resize: vertical;
          min-height: 60px;
          line-height: 1.5;
        }
        .admin-field input[type="file"] {
          font-size: 12px;
        }

        .admin-card {
          padding: 10px;
          background: var(--pink-lightest);
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid var(--pink-mist);
        }

        .admin-add-btn {
          width: 100%;
          padding: 8px;
          border: 1px dashed var(--pink-soft);
          border-radius: 6px;
          color: var(--pink-accent);
          font-size: 12px;
          transition: var(--transition-smooth);
          margin-top: 4px;
        }
        .admin-add-btn:hover {
          background: var(--pink-mist);
          border-color: var(--pink-accent);
        }

        @media (max-width: 480px) {
          .admin-panel { width: 100vw; }
          .admin-float-btn { right: 10px; }
        }
      `}</style>
    </>
  )
}

export default AdminPanel

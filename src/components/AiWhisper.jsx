import { useState, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import { ChibiGirl, ChibiBoy } from './Decorative'
import { useAdmin } from '../context/AdminContext'

const loveQuotes = [
  '你是我所有温柔和心动的来源。',
  '世界很大，但我的眼里只有你。',
  '遇见你之后，所有的日子都泛着光。',
  '你是藏在云层里的浪漫，是我终将到达的终点。',
  '我喜欢你，从黑夜到黎明，从冷冬到暖春，从一秒到一生。',
  '你是我疲惫生活中的英雄梦想。',
  '想把世界上所有的温柔都给你。',
  '你的笑，是我这辈子最大的幸运。',
  '今晚月色真美，风也温柔，就像你一样。',
  '你是我的，半截的诗，不许别人更改一个字。',
  '我想和你一起生活，在某个小镇，共享无尽的黄昏和绵绵不绝的钟声。',
  '人间太吵了，你来我心里吧。',
  '所有的晦暗都留给过往，从遇见你开始，凛冬散尽，星河长明。',
  '你是我这一生，等了半世未拆的礼物。',
  '我在贩卖日落，你像神明一样，将我的橘色天空全部点亮。',
]

const AiWhisper = () => {
  const { content } = useAdmin()
  const [secRef, secVisible] = useScrollReveal();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('whisper-messages')
      return saved ? JSON.parse(saved) : [
        { id: 1, text: '今天也想你，每一天都想你。', time: '2024-01-15 20:30', author: '你' },
        { id: 2, text: '有你在身边，连空气都是甜的。', time: '2024-02-20 14:15', author: '我' },
      ]
    } catch { return [] }
  })

  const [newMsg, setNewMsg] = useState('')
  const [nickname, setNickname] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [quoteHistory, setQuoteHistory] = useState([])

  const generateQuote = () => {
    if (isGenerating) return
    setIsGenerating(true)
    let idx
    do { idx = Math.floor(Math.random() * loveQuotes.length) }
    while (quoteHistory.includes(idx) && quoteHistory.length < loveQuotes.length)
    setQuoteHistory(prev => [...prev, idx])
    setCurrentQuote(loveQuotes[idx])
    setIsGenerating(false)
  }

  useEffect(() => { if (!currentQuote) generateQuote() }, [])

  const addMessage = () => {
    if (!newMsg.trim()) return
    const msg = { id: Date.now(), text: newMsg.trim(), time: new Date().toLocaleString('zh-CN', { hour12: false }), author: nickname.trim() || '匿名' }
    const updated = [...messages, msg]
    setMessages(updated)
    localStorage.setItem('whisper-messages', JSON.stringify(updated))
    setNewMsg('')
  }

  const deleteMessage = (id) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated)
    localStorage.setItem('whisper-messages', JSON.stringify(updated))
  }

  return (
    <section id="whisper" ref={secRef} className={`whisper-section section-reveal ${secVisible ? "section-reveal--visible" : ""}`}>
      <ChibiGirl className="deco-char--left" style={{ top: 20, left: 12 }} />
<ChibiBoy className="deco-char--right" style={{ bottom: 20, right: 12 }} />
      <div className="container">
        <h2 className="section-title">AI 悄悄话</h2>
        <p className="section-subtitle">让AI代我说出藏在心底的情话</p>

        <div className="whisper__ai-box">
          <div className="whisper__ai-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--pink-deep)">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{content.whisper.aiName}</span>
          </div>
          <div className="whisper__quote-box">
            <p className={`whisper__quote-text ${isGenerating ? 'whisper__quote-text--loading' : ''}`}>
              {currentQuote || content.whisper.defaultQuote}
            </p>
          </div>
          <button className="whisper__generate-btn" onClick={generateQuote} disabled={isGenerating}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            生成新情话
          </button>
        </div>

        <div className="whisper__board">
          <div className="whisper__board-header">
            <h3 className="whisper__board-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pink-deep)" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              甜蜜留言板
            </h3>
            <span className="whisper__board-count">{messages.length} 条留言</span>
          </div>

          <div className="whisper__messages">
            {messages.length === 0 ? (
              <div className="whisper__empty"><p>还没有留言，来说第一句话吧</p></div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="whisper__message">
                  <div className="whisper__msg-header">
                    <span className="whisper__msg-author">{msg.author}</span>
                    <span className="whisper__msg-time">{msg.time}</span>
                  </div>
                  <p className="whisper__msg-text">{msg.text}</p>
                  <button className="whisper__msg-delete" onClick={() => deleteMessage(msg.id)} aria-label="删除">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="whisper__input-area">
            <input className="whisper__nickname" placeholder="你的昵称" value={nickname} onChange={e => setNickname(e.target.value)} />
            <textarea className="whisper__input" placeholder="写下你想说的话..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMessage() }}} rows={3} />
            <button className="whisper__submit" onClick={addMessage} disabled={!newMsg.trim()}>发送留言</button>
          </div>
        </div>
      </div>

      <style>{`
        .whisper-section { padding: 120px 0; background: linear-gradient(180deg, var(--pink-lightest) 0%, var(--cream) 100%); }
        .whisper__ai-box { max-width: 600px; margin: 0 auto 60px; background: linear-gradient(135deg, var(--warm-white), var(--pink-lightest)); border: 1px solid var(--pink-blush); border-radius: var(--radius-lg); padding: 36px; text-align: center; box-shadow: var(--shadow-card); }
        .whisper__ai-header { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.1rem; color: var(--pink-deep); font-weight: 500; margin-bottom: 24px; letter-spacing: 2px; font-family: 'Noto Serif SC', serif; }
        .whisper__quote-box { min-height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .whisper__quote-text { font-size: 1.2rem; line-height: 1.8; color: var(--text-secondary); letter-spacing: 2px; font-family: 'Noto Serif SC', serif; transition: opacity 0.3s; }
        .whisper__quote-text--loading { opacity: 0.5; }
        .whisper__generate-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; background: var(--warm-white); border: 1px solid var(--pink-soft); border-radius: 50px; color: var(--pink-deep); font-size: 0.85rem; letter-spacing: 1px; transition: var(--transition-smooth); }
        .whisper__generate-btn:hover:not(:disabled) { background: var(--pink-mist); border-color: var(--pink-accent); }
        .whisper__generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .whisper__board { max-width: 700px; margin: 0 auto; }
        .whisper__board-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--pink-blush); }
        .whisper__board-title { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: var(--text-primary); letter-spacing: 2px; }
        .whisper__board-count { font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px; }
        .whisper__messages { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; max-height: 400px; overflow-y: auto; }
        .whisper__empty { text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.9rem; letter-spacing: 1px; }
        .whisper__message { background: var(--warm-white); border: 1px solid var(--pink-mist); border-radius: var(--radius-sm); padding: 16px 20px; position: relative; transition: var(--transition-smooth); }
        .whisper__message:hover { border-color: var(--pink-soft); }
        .whisper__msg-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .whisper__msg-author { font-size: 0.8rem; color: var(--pink-accent); font-weight: 500; }
        .whisper__msg-time { font-size: 0.7rem; color: var(--text-muted); }
        .whisper__msg-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }
        .whisper__msg-delete { position: absolute; top: 12px; right: 12px; color: var(--text-muted); opacity: 0; transition: var(--transition-smooth); padding: 4px; }
        .whisper__message:hover .whisper__msg-delete { opacity: 0.4; }
        .whisper__msg-delete:hover { opacity: 1 !important; color: var(--rose); }
        .whisper__input-area { display: flex; flex-direction: column; gap: 12px; }
        .whisper__nickname { width: 200px; padding: 10px 16px; border: 1px solid var(--pink-blush); border-radius: var(--radius-sm); background: var(--warm-white); font-size: 0.85rem; color: var(--text-primary); transition: var(--transition-smooth); }
        .whisper__nickname:focus { border-color: var(--pink-accent); }
        .whisper__input { width: 100%; padding: 14px 16px; border: 1px solid var(--pink-blush); border-radius: var(--radius-sm); background: var(--warm-white); font-size: 0.9rem; color: var(--text-primary); resize: none; transition: var(--transition-smooth); line-height: 1.6; }
        .whisper__input:focus { border-color: var(--pink-accent); }
        .whisper__submit { align-self: flex-end; padding: 12px 32px; background: linear-gradient(135deg, var(--pink-accent), var(--pink-deep)); color: #fff; border-radius: 50px; font-size: 0.9rem; letter-spacing: 2px; transition: var(--transition-smooth); }
        .whisper__submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(212, 98, 138, 0.3); }
        .whisper__submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </section>
  )
}

export default AiWhisper

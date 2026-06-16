import { AdminProvider, useAdmin } from './context/AdminContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ErrorBoundary from './components/ErrorBoundary'
import SparkleField from './components/SparkleField'
import LoveParticles from './components/LoveParticles'
import About from './components/About'
import Timeline from './components/Timeline'
import Album from './components/Album'
import AiWhisper from './components/AiWhisper'
import Wishlist from './components/Wishlist'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import ScrollProgress from './components/ScrollProgress'
import HeartCursor from './components/HeartCursor'

const SectionDivider = () => (
  <div className="section-divider">
    <div className="section-divider__line" />
    <div className="section-divider__icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--pink-soft)">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
    <div className="section-divider__line" />
  </div>
)

const AppContent = () => {
  const { theme, toggleTheme } = useTheme()
  const { editMode, setEditMode } = useAdmin()

  return (
    <div className="app">
      <LoveParticles count={35} />
      <ScrollProgress />
      <HeartCursor />
      <PaperGrain />
      <SparkleField />
      <Navbar />

      {!editMode && (
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "totoro" ? "🎀" : "🌳"}
        </button>
      )}
      {!editMode && (
        <button className="global-edit-btn" onClick={() => setEditMode(true)} title="编辑网站内容">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          编辑
        </button>
      )}

      <main>
        <Hero />
          <SectionDivider />
        <About />
          <SectionDivider />
        <Timeline />
          <SectionDivider />
        <Album />
          <SectionDivider />
        <AiWhisper />
          <SectionDivider />
        <Wishlist />
          <SectionDivider />
      </main>
      <Footer />
      <AdminPanel />

      <style>{`
        .global-edit-btn {
          position: fixed; right: 20px; top: 50%;
          transform: translateY(-50%); z-index: 100;
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--pink-accent), var(--pink-deep));
          color: #fff;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1px; font-size: 9px; letter-spacing: 1px;
          box-shadow: 0 4px 20px rgba(212,98,138,0.4);
          transition: var(--transition-smooth); padding-bottom: 2px;
        }
        .global-edit-btn:hover { transform: translateY(-50%) scale(1.1); }
      `}</style>

      <style>{`
        .paper-grain {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 9998;
          opacity: 0.03;
        }
      `}</style>
    </div>
  )
}

const PaperGrain = () => <div className="paper-grain" />

const App = () => {
  return (
    <ThemeProvider>
      <AdminProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AdminProvider>
    </ThemeProvider>
  )
}

export default App
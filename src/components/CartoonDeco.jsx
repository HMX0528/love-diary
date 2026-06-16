import { useTheme } from "../context/ThemeContext";

/* ── Totoro character ── */
const TotorChar = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 60 70" width="50" height="58" style={style}>
    <ellipse cx="30" cy="42" rx="26" ry="26" fill="#8a9a8a"/>
    <path d="M14 18 L10 5 L22 12" fill="#8a9a8a"/>
    <path d="M46 18 L50 5 L38 12" fill="#8a9a8a"/>
    <ellipse cx="30" cy="47" rx="16" ry="17" fill="#b8c8b8"/>
    <circle cx="22" cy="31" r="5" fill="#3a4a3a"/>
    <circle cx="38" cy="31" r="5" fill="#3a4a3a"/>
    <circle cx="24" cy="29" r="2" fill="#fff"/>
    <circle cx="40" cy="29" r="2" fill="#fff"/>
    <ellipse cx="30" cy="38" rx="3" ry="2" fill="#5a6a5a"/>
    <line x1="5" y1="34" x2="14" y2="37" stroke="#6a7a6a" strokeWidth="1"/>
    <line x1="5" y1="40" x2="14" y2="40" stroke="#6a7a6a" strokeWidth="1"/>
    <line x1="55" y1="34" x2="46" y2="37" stroke="#6a7a6a" strokeWidth="1"/>
    <line x1="55" y1="40" x2="46" y2="40" stroke="#6a7a6a" strokeWidth="1"/>
    <path d="M30 12 Q36 4 42 10 Q36 16 30 12" fill="#5a8a3c"/>
  </svg>
);

/* ── Kuromi character ── */
const KuromiChar = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 60 70" width="50" height="58" style={style}>
    <path d="M10 28 Q10 5 30 0 Q50 5 50 28 L46 42 L14 42 Z" fill="#2a1a2a"/>
    <circle cx="30" cy="30" r="18" fill="#fff"/>
    <circle cx="30" cy="24" r="5" fill="#aaa"/>
    <circle cx="28" cy="25" r="1.5" fill="#333"/>
    <circle cx="32" cy="25" r="1.5" fill="#333"/>
    <ellipse cx="23" cy="33" rx="3" ry="4" fill="#333"/>
    <ellipse cx="37" cy="33" rx="3" ry="4" fill="#333"/>
    <circle cx="24" cy="31" r="1.5" fill="#fff"/>
    <circle cx="38" cy="31" r="1.5" fill="#fff"/>
    <path d="M26 39 Q30 43 34 39" fill="none" stroke="#333" strokeWidth="1.2"/>
    <circle cx="50" cy="14" r="7" fill="#e84a8a"/>
    <path d="M43 10 Q50 4 57 10 Q50 18 43 10" fill="#e84a8a"/>
  </svg>
);

/* ── Soot sprite ── */
const SootSprite = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" style={style}>
    <circle cx="12" cy="12" r="10" fill="#3a3a3a"/>
    <circle cx="9" cy="10" r="2.5" fill="#fff"/>
    <circle cx="15" cy="10" r="2.5" fill="#fff"/>
    <circle cx="9.5" cy="9.5" r="1" fill="#333"/>
    <circle cx="15.5" cy="9.5" r="1" fill="#333"/>
    <circle cx="12" cy="16" r="1.5" fill="#555"/>
  </svg>
);

/* ── Star decoration ── */
const StarDeco = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 20 20" width="16" height="16" style={style}>
    <path d="M10 0 L12.5 7.5 L20 7.5 L14 12.5 L16 20 L10 15 L4 20 L6 12.5 L0 7.5 L7.5 7.5 Z" fill="var(--theme-yellow)"/>
  </svg>
);

/* ── Bow decoration ── */
const BowDeco = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 24 12" width="20" height="10" style={style}>
    <path d="M4 6 Q12 0 20 6 Q12 12 4 6" fill="var(--theme-pink)" opacity="0.6"/>
    <circle cx="12" cy="6" r="2" fill="var(--theme-accent-light)" opacity="0.7"/>
  </svg>
);

/* ── Leaf decoration ── */
const LeafDeco = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 16 20" width="14" height="18" style={style}>
    <path d="M8 18 Q1 12 4 3 Q8 6 12 3 Q15 12 8 18" fill="var(--theme-accent-light)" opacity="0.5"/>
    <line x1="8" y1="16" x2="8" y2="3" stroke="var(--theme-accent-dark)" strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

/* ── Bat wing decoration ── */
const WingDeco = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 24 16" width="20" height="14" style={style}>
    <path d="M12 14 Q0 12 2 2 Q6 6 12 8 Q18 6 22 2 Q24 12 12 14" fill="var(--theme-accent-dark)" opacity="0.3"/>
  </svg>
);

/* ── Cloud decoration ── */
const CloudDeco = ({ className = "", style = {} }) => (
  <svg className={className} viewBox="0 0 40 24" width="36" height="20" style={style}>
    <ellipse cx="20" cy="14" rx="18" ry="8" fill="rgba(255,255,255,0.6)"/>
    <circle cx="14" cy="10" r="7" fill="rgba(255,255,255,0.6)"/>
    <circle cx="26" cy="10" r="7" fill="rgba(255,255,255,0.6)"/>
  </svg>
);

/* ── Main decorative wrapper ── */
export default function CartoonDecorations({ position = "corner" }) {
  const { theme } = useTheme();
  const isTotoro = theme === "totoro";

  const baseClass = "deco-char";

  if (position === "corner") {
    return (
      <>
        {isTotoro ? (
          <TotorChar className={baseClass} style={{ top: 10, left: 10 }} />
        ) : (
          <KuromiChar className={baseClass} style={{ top: 10, left: 10 }} />
        )}
        {isTotoro ? (
          <CloudDeco className={`${baseClass} deco-char--slow`} style={{ top: 60, left: 16 }} />
        ) : (
          <StarDeco className={`${baseClass} deco-char--right`} style={{ top: 60, left: 20 }} />
        )}
        {isTotoro ? (
          <>
            <SootSprite className={baseClass} style={{ bottom: 20, right: 20 }} />
            <LeafDeco className={`${baseClass} deco-char--slow`} style={{ bottom: 50, left: 16 }} />
          </>
        ) : (
          <>
            <WingDeco className={baseClass} style={{ bottom: 20, right: 20 }} />
            <BowDeco className={`${baseClass} deco-char--right`} style={{ bottom: 50, left: 20 }} />
          </>
        )}
      </>
    );
  }

  return null;
}
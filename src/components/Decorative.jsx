const ChibiGirl = ({ className = "", style = {} }) => (
  <svg className={`deco-char ${className}`} viewBox="0 0 50 60" width="44" height="52" style={style}>
    <path d="M10 28 Q10 8 25 5 Q40 8 40 28" fill="#5D4037"/>
    <path d="M5 30 Q3 15 10 10" fill="#5D4037"/>
    <path d="M45 30 Q47 15 40 10" fill="#5D4037"/>
    <circle cx="25" cy="28" r="16" fill="#FFE0E0"/>
    <circle cx="19" cy="26" r="3.5" fill="#333"/>
    <circle cx="31" cy="26" r="3.5" fill="#333"/>
    <circle cx="20" cy="25" r="1.2" fill="#fff"/>
    <circle cx="32" cy="25" r="1.2" fill="#fff"/>
    <ellipse cx="15" cy="32" rx="3" ry="1.5" fill="#FFB0B0" opacity="0.4"/>
    <ellipse cx="35" cy="32" rx="3" ry="1.5" fill="#FFB0B0" opacity="0.4"/>
    <path d="M22 34 Q25 37 28 34" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M15 42 L18 58 L32 58 L35 42" fill="#F48FB1" opacity="0.5"/>
  </svg>
);

const ChibiBoy = ({ className = "", style = {} }) => (
  <svg className={`deco-char ${className}`} viewBox="0 0 50 60" width="44" height="52" style={style}>
    <path d="M8 30 Q8 5 25 3 Q42 5 42 30" fill="#4E342E"/>
    <path d="M10 18 Q15 8 25 5 Q35 8 40 18" fill="#5D4037"/>
    <circle cx="25" cy="30" r="17" fill="#FFE8E0"/>
    <circle cx="18" cy="28" r="3.5" fill="#333"/>
    <circle cx="32" cy="28" r="3.5" fill="#333"/>
    <circle cx="19" cy="27" r="1.2" fill="#fff"/>
    <circle cx="33" cy="27" r="1.2" fill="#fff"/>
    <ellipse cx="14" cy="34" rx="3" ry="1.5" fill="#FFB0B0" opacity="0.3"/>
    <ellipse cx="36" cy="34" rx="3" ry="1.5" fill="#FFB0B0" opacity="0.3"/>
    <path d="M21 36 Q25 39 29 36" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 44 L18 58 L32 58 L34 44" fill="#BBDEFB" opacity="0.5"/>
  </svg>
);

export { ChibiGirl, ChibiBoy };
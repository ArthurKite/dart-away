// MapBorder.tsx
// Absolutely-positioned overlay (z-index: 16, pointer-events: none) covering the full screen
// with an ornate Age-of-Exploration map border.

export default function MapBorder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 16,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ============================================================
          MAIN BORDER FRAME — stretches to fill entire screen
      ============================================================ */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Outermost dark frame line */}
        <rect
          x={0.3}
          y={0.3}
          width={99.4}
          height={99.4}
          fill="none"
          stroke="#3a1f08"
          strokeWidth={1.2}
        />

        {/* Dark band along all 4 edges (outer fill band ~1.5% wide) */}
        <path
          d="M0.3,0.3 L99.7,0.3 L99.7,99.7 L0.3,99.7 Z M1.8,1.8 L98.2,1.8 L98.2,98.2 L1.8,98.2 Z"
          fill="#3a1f08"
          fillRule="evenodd"
        />

        {/* Gold line */}
        <rect
          x={2}
          y={2}
          width={96}
          height={96}
          fill="none"
          stroke="#c9a84c"
          strokeWidth={0.4}
        />

        {/* Rope/chain dashed effect */}
        <rect
          x={2.2}
          y={2.2}
          width={95.6}
          height={95.6}
          fill="none"
          stroke="#a07040"
          strokeWidth={0.3}
          strokeDasharray="1.5,0.8"
        />

        {/* Inner dark line */}
        <rect
          x={2.5}
          y={2.5}
          width={95}
          height={95}
          fill="none"
          stroke="#5c3a1e"
          strokeWidth={0.25}
        />
      </svg>

      {/* ============================================================
          CORNER ORNAMENTS
      ============================================================ */}
      <CornerOrnament style={{ position: 'absolute', top: 0, left: 0 }} />
      <CornerOrnament
        style={{ position: 'absolute', top: 0, right: 0, transform: 'scaleX(-1)' }}
      />
      <CornerOrnament
        style={{ position: 'absolute', bottom: 0, left: 0, transform: 'scaleY(-1)' }}
      />
      <CornerOrnament
        style={{ position: 'absolute', bottom: 0, right: 0, transform: 'scale(-1)' }}
      />

      {/* ============================================================
          EDGE CENTRE DECORATIONS
      ============================================================ */}
      {/* Top edge banner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <EdgeBanner />
      </div>

      {/* Bottom edge banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) scaleY(-1)',
        }}
      >
        <EdgeBanner />
      </div>

      {/* Left edge anchor */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
        }}
      >
        <EdgeAnchor />
      </div>

      {/* Right edge anchor */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
        }}
      >
        <EdgeAnchor />
      </div>
    </div>
  )
}

/* ============================================================
   CORNER ORNAMENT — 100×100px SVG with 8-pointed compass star
============================================================ */
function CornerOrnament({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      width={100}
      height={100}
      viewBox="0 0 100 100"
      style={{ ...style, display: 'block' }}
    >
      {/* Dark corner background fill */}
      <path
        d="M0,0 L0,100 L18,100 L18,18 L100,18 L100,0 Z"
        fill="#3a1f08"
      />

      {/* L-shaped bracket lines blending with the main border */}
      <line x1={0}  y1={18} x2={18} y2={18} stroke="#c9a84c" strokeWidth={0.5} />
      <line x1={18} y1={0}  x2={18} y2={18} stroke="#c9a84c" strokeWidth={0.5} />

      {/* Rope/chain along L-bracket */}
      <line x1={0}  y1={18} x2={18} y2={18} stroke="#a07040" strokeWidth={0.3} strokeDasharray="1.5,0.8" />
      <line x1={18} y1={0}  x2={18} y2={18} stroke="#a07040" strokeWidth={0.3} strokeDasharray="1.5,0.8" />

      {/* Inner accent lines */}
      <line x1={0}  y1={20} x2={20} y2={20} stroke="#5c3a1e" strokeWidth={0.25} />
      <line x1={20} y1={0}  x2={20} y2={20} stroke="#5c3a1e" strokeWidth={0.25} />

      {/* Circular ring around star */}
      <circle cx={9} cy={9} r={10} fill="none" stroke="#c9a84c" strokeWidth={0.5} />
      <circle cx={9} cy={9} r={9}  fill="none" stroke="#8b6030" strokeWidth={0.25} />

      {/* 8-pointed compass star centered at (9,9) */}
      {/* 4 long cardinal points */}
      <polygon points={compassPoint(9, 9, 270, 12, 1.5)} fill="#c9a84c" stroke="#3d2010" strokeWidth={0.3} />
      <polygon points={compassPoint(9, 9,  90, 12, 1.5)} fill="#5c3a1e" stroke="#3d2010" strokeWidth={0.3} />
      <polygon points={compassPoint(9, 9,   0, 12, 1.5)} fill="#c9a84c" stroke="#3d2010" strokeWidth={0.3} />
      <polygon points={compassPoint(9, 9, 180, 12, 1.5)} fill="#5c3a1e" stroke="#3d2010" strokeWidth={0.3} />

      {/* 4 shorter diagonal points */}
      <polygon points={compassPoint(9, 9, 315, 8, 1.0)} fill="#a07840" stroke="#3d2010" strokeWidth={0.2} />
      <polygon points={compassPoint(9, 9,  45, 8, 1.0)} fill="#a07840" stroke="#3d2010" strokeWidth={0.2} />
      <polygon points={compassPoint(9, 9, 225, 8, 1.0)} fill="#a07840" stroke="#3d2010" strokeWidth={0.2} />
      <polygon points={compassPoint(9, 9, 135, 8, 1.0)} fill="#a07840" stroke="#3d2010" strokeWidth={0.2} />

      {/* Radiating decorative lines */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
        const r1 = 4
        const r2 = 11
        const rad = (angle * Math.PI) / 180
        return (
          <line
            key={i}
            x1={9 + Math.cos(rad) * r1}
            y1={9 + Math.sin(rad) * r1}
            x2={9 + Math.cos(rad) * r2}
            y2={9 + Math.sin(rad) * r2}
            stroke="#c9a84c"
            strokeWidth={0.2}
            opacity={0.5}
          />
        )
      })}

      {/* Center circle */}
      <circle cx={9} cy={9} r={2.2} fill="#3d2010" stroke="#c9a84c" strokeWidth={0.5} />
      <circle cx={9} cy={9} r={0.9} fill="#c9a84c" />

      {/* Decorative dots at each corner of the square region */}
      <circle cx={2} cy={2} r={0.8} fill="#c9a84c" opacity={0.8} />
      <circle cx={16} cy={2} r={0.6} fill="#c9a84c" opacity={0.6} />
      <circle cx={2} cy={16} r={0.6} fill="#c9a84c" opacity={0.6} />
    </svg>
  )
}

/* Helper: generate a narrow diamond polygon around center (cx, cy)
   pointing in given angle, with the given length and base half-width */
function compassPoint(
  cx: number,
  cy: number,
  angleDeg: number,
  length: number,
  baseHalfW: number,
): string {
  const rad = (angleDeg * Math.PI) / 180
  const tx = cx + Math.cos(rad) * length
  const ty = cy + Math.sin(rad) * length
  const lx = cx + Math.cos(rad - Math.PI / 2) * baseHalfW
  const ly = cy + Math.sin(rad - Math.PI / 2) * baseHalfW
  const rx = cx + Math.cos(rad + Math.PI / 2) * baseHalfW
  const ry = cy + Math.sin(rad + Math.PI / 2) * baseHalfW
  return `${lx},${ly} ${tx},${ty} ${rx},${ry} ${cx},${cy}`
}

/* ============================================================
   EDGE BANNER — small ribbon banner for top/bottom edges
============================================================ */
function EdgeBanner() {
  return (
    <svg
      width={60}
      height={20}
      viewBox="0 0 60 20"
      style={{ display: 'block' }}
    >
      {/* Banner ribbon body */}
      <path
        d="M5,4 L55,4 L58,10 L55,16 L5,16 L2,10 Z"
        fill="#3a1f08"
        stroke="#c9a84c"
        strokeWidth={0.6}
      />
      {/* Ribbon fold lines */}
      <line x1={5}  y1={4}  x2={5}  y2={16} stroke="#c9a84c" strokeWidth={0.3} opacity={0.5} />
      <line x1={55} y1={4}  x2={55} y2={16} stroke="#c9a84c" strokeWidth={0.3} opacity={0.5} />
      {/* Center diamond ornament */}
      <polygon points="30,6 33,10 30,14 27,10" fill="#c9a84c" opacity={0.8} />
      <circle cx={30} cy={10} r={1.2} fill="#3a1f08" />
      {/* Small dots along ribbon */}
      <circle cx={14} cy={10} r={0.8} fill="#c9a84c" opacity={0.6} />
      <circle cx={46} cy={10} r={0.8} fill="#c9a84c" opacity={0.6} />
      <circle cx={22} cy={10} r={0.5} fill="#a07040" opacity={0.6} />
      <circle cx={38} cy={10} r={0.5} fill="#a07040" opacity={0.6} />
    </svg>
  )
}

/* ============================================================
   EDGE ANCHOR — small anchor/trident for left/right edges
============================================================ */
function EdgeAnchor() {
  return (
    <svg
      width={40}
      height={22}
      viewBox="0 0 40 22"
      style={{ display: 'block' }}
    >
      {/* Anchor shank (vertical bar) */}
      <line x1={20} y1={4}  x2={20} y2={18} stroke="#c9a84c" strokeWidth={1.2} strokeLinecap="round" />
      {/* Anchor ring at top */}
      <circle cx={20} cy={3} r={2.5} fill="none" stroke="#c9a84c" strokeWidth={0.9} />
      {/* Anchor stock (horizontal bar) */}
      <line x1={13} y1={7}  x2={27} y2={7}  stroke="#c9a84c" strokeWidth={0.8} strokeLinecap="round" />
      {/* Anchor arms — curving outward and upward */}
      <path d="M20,18 Q13,18 11,14" stroke="#c9a84c" strokeWidth={1} fill="none" strokeLinecap="round" />
      <path d="M20,18 Q27,18 29,14" stroke="#c9a84c" strokeWidth={1} fill="none" strokeLinecap="round" />
      {/* Flukes (ends of arms) */}
      <path d="M9.5,14 L11,14 L12,11" stroke="#c9a84c" strokeWidth={0.8} fill="none" strokeLinecap="round" />
      <path d="M30.5,14 L29,14 L28,11" stroke="#c9a84c" strokeWidth={0.8} fill="none" strokeLinecap="round" />
      {/* Small background rect to hide map behind anchor area */}
      {/* (none — transparent background is fine for edge decorations) */}
    </svg>
  )
}

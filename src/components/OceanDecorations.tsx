// OceanDecorations.tsx
// Rendered INSIDE ZoomableGroup — uses the 800×420 SVG viewBox coordinate space.

export default function OceanDecorations() {
  return (
    <g>
      {/* =============================================
          WAVE PATTERNS — subtle tiled ocean texture
      ============================================= */}
      <WavePatterns />

      {/* =============================================
          OCEAN NAME LABELS
      ============================================= */}
      <OceanLabels />

      {/* =============================================
          SAILING GALLEONS
      ============================================= */}
      <Galleon x={258} y={148} flip={false} />
      <Galleon x={318} y={162} flip={true} />
      <Galleon x={300} y={298} flip={false} />
      <Galleon x={78}  y={152} flip={true} />
      <Galleon x={92}  y={312} flip={false} />
      <Galleon x={572} y={262} flip={true} />
      <Galleon x={208} y={182} flip={false} />
      <Galleon x={748} y={150} flip={false} />
      <Galleon x={532} y={198} flip={true} />
      <Galleon x={718} y={318} flip={false} />

      {/* =============================================
          SEA MONSTERS
      ============================================= */}
      {/* Monster 1 — North Atlantic, facing right, scale 0.55 */}
      <SeaMonster x={232} y={172} flip={false} scale={0.55} />
      {/* Monster 2 — South Pacific, facing left, scale 0.5 */}
      <SeaMonster x={648} y={298} flip={true} scale={0.5} />
      {/* Monster 3 — South Atlantic, facing right, scale 0.45 */}
      <SeaMonster x={330} y={318} flip={false} scale={0.45} />

      {/* =============================================
          COMPASS ROSE — South Pacific ocean
      ============================================= */}
      <MapCompassRose x={148} y={352} size={28} />

      {/* =============================================
          CARTOUCHE — South Pacific lower-left area
      ============================================= */}
      <Cartouche x={42} y={355} />
    </g>
  )
}

/* ============================================================
   WAVE PATTERNS
============================================================ */
function WavePatterns() {
  // A small wave path unit: Q-curve approximating ~
  const wave = (x: number, y: number, key: string) => (
    <path
      key={key}
      d={`M${x},${y} Q${x + 3},${y - 2} ${x + 6},${y} Q${x + 9},${y + 2} ${x + 12},${y}`}
      stroke="#7ab8cc"
      strokeWidth={0.6}
      fill="none"
      opacity={0.35}
    />
  )

  const waves: React.ReactElement[] = []
  // Row definitions: [y, xStart, xEnd, xStep]
  // Avoid heavy land masses — stay in ocean areas
  const rows: [number, number[], number][] = [
    // North Atlantic / North Pacific — y ≈ 110
    [110, [0,10,20,30,40,50,60,70,80,90,100,110,120, 220,230,240,250,260,270,280,290, 620,630,640,650,660,670,680,690,700,710,720,730,740,750,760,770,780,790], 14],
    // Mid Atlantic / Indian — y ≈ 200
    [200, [0,14,28,42,56,70,84,98,112,126, 210,224,238,252,266,280,294, 510,524,538,552,566,580,594,608,622,636,650,664,678,692,706,720,734,748,762,776,790], 14],
    // Equatorial belt — y ≈ 248
    [248, [0,14,28,42,56,70,84,98,112,126,140,154, 690,704,718,732,746,760,774,788], 14],
    // South Atlantic / South Pacific — y ≈ 310
    [310, [0,14,28,42,56,70,84,98,112,126,140,154,168,182, 250,264,278,292,306,320, 660,674,688,702,716,730,744,758,772,786], 14],
    // Southern Ocean — y ≈ 390
    [390, [0,14,28,42,56,70,84,98,112,126,140,154,168,182,196,210,224,238,252,266,280,294,308,322,336,350,364,378,392,406,420,434,448,462,476,490,504,518,532,546,560,574,588,602,616,630,644,658,672,686,700,714,728,742,756,770,784], 14],
    // Arctic — y ≈ 30
    [30, [0,14,28,42,56,70,84,98,112,126,140,154,168,182,196,210,224,238,252,266,280,294,308,322,336,350,364,378,392,406,420,434,448,462,476,490,504,518,532,546,560,574,588,602,616,630,644,658,672,686,700,714,728,742,756,770,784], 14],
  ]

  rows.forEach(([y, xPositions, _step], ri) => {
    xPositions.forEach((x, xi) => {
      waves.push(wave(x, y, `w-${ri}-${xi}`))
    })
  })

  return <g>{waves}</g>
}

/* ============================================================
   OCEAN LABELS
============================================================ */
function OceanLabels() {
  const style: React.CSSProperties = {
    fontFamily: '"Garamond", "IM Fell English", "Palatino Linotype", "Book Antiqua", Georgia, serif',
    fontStyle: 'italic',
    fill: '#1a4455',
    letterSpacing: '0.18em',
    pointerEvents: 'none',
    userSelect: 'none',
  }
  return (
    <g>
      <text x={68}  y={182} fontSize={8.5} transform="rotate(-5, 68, 182)"    style={style}>NORTH PACIFIC OCEAN</text>
      <text x={72}  y={338} fontSize={8}   transform="rotate(-3, 72, 338)"    style={style}>SOUTH PACIFIC OCEAN</text>
      <text x={258} y={178} fontSize={8.5}                                      style={style}>NORTH ATLANTIC</text>
      <text x={270} y={190} fontSize={8.5}                                      style={style}>OCEAN</text>
      <text x={295} y={322} fontSize={7.5}                                      style={style}>SOUTH ATLANTIC</text>
      <text x={308} y={332} fontSize={7.5}                                      style={style}>OCEAN</text>
      <text x={558} y={298} fontSize={8.5}                                      style={style}>INDIAN OCEAN</text>
      <text x={382} y={22}  fontSize={7.5}                                      style={style}>ARCTIC OCEAN</text>
      <text x={388} y={410} fontSize={7}                                        style={style}>SOUTHERN OCEAN</text>
      <text x={432} y={162} fontSize={6.5}                                      style={style}>MEDITERRANEAN SEA</text>
      <text x={512} y={215} fontSize={6.5}                                      style={style}>ARABIAN SEA</text>
    </g>
  )
}

/* ============================================================
   GALLEON — detailed side-view sailing ship
============================================================ */
interface GalleonProps { x: number; y: number; flip: boolean }

function Galleon({ x, y, flip }: GalleonProps) {
  const transform = flip
    ? `translate(${x}, ${y}) scale(-1, 1) translate(-14, 0)`
    : `translate(${x - 14}, ${y})`

  return (
    <g transform={transform} opacity={0.88}>
      {/* === HULL === */}
      {/* Main hull body — sweeping shape */}
      <path
        d="M2,6 Q4,4 8,3.5 L20,3.5 Q24,3.5 26,4.5 L28,6 Q29,7 28,8 L24,10 Q20,11 14,11 Q8,11 4,10 L2,8 Q1,7 2,6 Z"
        fill="#5a2e0e"
        stroke="#3a1a06"
        strokeWidth={0.4}
      />
      {/* Hull planking lines */}
      <line x1={4} y1={6.5}  x2={26} y2={6.5}  stroke="#3a1a06" strokeWidth={0.2} opacity={0.5} />
      <line x1={3} y1={8}    x2={27} y2={8}    stroke="#3a1a06" strokeWidth={0.2} opacity={0.5} />
      {/* Gun ports */}
      <rect x={7}  y={6} width={1.8} height={1.2} rx={0.2} fill="#2a1006" opacity={0.8} />
      <rect x={12} y={6} width={1.8} height={1.2} rx={0.2} fill="#2a1006" opacity={0.8} />
      <rect x={17} y={6} width={1.8} height={1.2} rx={0.2} fill="#2a1006" opacity={0.8} />
      <rect x={22} y={6} width={1.8} height={1.2} rx={0.2} fill="#2a1006" opacity={0.8} />
      {/* Stern castle (aft) */}
      <path
        d="M22,3.5 L24,1 L27,1 L28,3.5 Z"
        fill="#6b3510"
        stroke="#3a1a06"
        strokeWidth={0.3}
      />
      {/* Stern windows */}
      <rect x={23} y={1.5} width={1.2} height={1.2} rx={0.2} fill="#c9a84c" opacity={0.7} />
      <rect x={25} y={1.5} width={1.2} height={1.2} rx={0.2} fill="#c9a84c" opacity={0.7} />
      {/* Forecastle (bow) */}
      <path
        d="M2,6 Q1,5 2,4 L5,3.5 L7,3.5 L7,6 Z"
        fill="#6b3510"
        stroke="#3a1a06"
        strokeWidth={0.3}
      />
      {/* Bowsprit */}
      <line x1={2} y1={4}  x2={-3} y2={1}   stroke="#5a2e0e" strokeWidth={0.5} />
      {/* Bowsprit sail */}
      <path
        d="M-2,1.5 L2,3.5 L1,0 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.3}
        opacity={0.9}
      />

      {/* === MASTS === */}
      {/* Foremast */}
      <line x1={8}  y1={3.5} x2={8}  y2={-8} stroke="#4a2a0e" strokeWidth={0.5} />
      {/* Mainmast */}
      <line x1={15} y1={3}   x2={15} y2={-11} stroke="#4a2a0e" strokeWidth={0.6} />
      {/* Mizzenmast */}
      <line x1={22} y1={3}   x2={22} y2={-6} stroke="#4a2a0e" strokeWidth={0.4} />

      {/* Cross spars */}
      <line x1={5}  y1={-4} x2={11} y2={-4} stroke="#4a2a0e" strokeWidth={0.3} />
      <line x1={5}  y1={-7} x2={11} y2={-7} stroke="#4a2a0e" strokeWidth={0.25} />
      <line x1={11} y1={-5} x2={19} y2={-5} stroke="#4a2a0e" strokeWidth={0.35} />
      <line x1={11} y1={-8.5} x2={19} y2={-8.5} stroke="#4a2a0e" strokeWidth={0.28} />
      <line x1={19} y1={-2} x2={25} y2={-2} stroke="#4a2a0e" strokeWidth={0.28} />

      {/* === SAILS === */}
      {/* Foremast lower sail */}
      <path
        d="M5,-4 Q8,-3 11,-4 L11,-7 Q8,-7.5 5,-7 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.3}
        opacity={0.92}
      />
      {/* Foremast upper topsail */}
      <path
        d="M5.5,-7 Q8,-7.5 10.5,-7 L10,-9 Q8,-9.5 6,-9 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.25}
        opacity={0.85}
      />
      {/* Mainmast lower sail — biggest, slightly billowing */}
      <path
        d="M11,-5 Q15,-4 19,-5 L19,-8.5 Q15,-9.2 11,-8.5 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.3}
        opacity={0.93}
      />
      {/* Mainmast topsail */}
      <path
        d="M11.5,-8.5 Q15,-9.2 18.5,-8.5 L18,-10.5 Q15,-11.2 12,-10.5 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.25}
        opacity={0.85}
      />
      {/* Mizzen sail */}
      <path
        d="M19,-2 Q22,-1.5 25,-2 L24,-4 Q22,-4.5 20,-4 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.25}
        opacity={0.88}
      />
      {/* Lateen sail on mizzenmast */}
      <path
        d="M22,-2 L22,-5.5 L26,-2 Z"
        fill="#dfd4a0"
        stroke="#b8a870"
        strokeWidth={0.3}
        opacity={0.82}
      />

      {/* === RIGGING (simplified shroud lines) === */}
      <line x1={8}  y1={3.5}  x2={4}  y2={-4}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />
      <line x1={8}  y1={3.5}  x2={12} y2={-4}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />
      <line x1={15} y1={3}    x2={10} y2={-5}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />
      <line x1={15} y1={3}    x2={20} y2={-5}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />
      <line x1={22} y1={3}    x2={20} y2={-2}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />
      <line x1={22} y1={3}    x2={25} y2={-2}  stroke="#6b4020" strokeWidth={0.2} opacity={0.6} />

      {/* === FLAGS === */}
      {/* Mainmast pennant */}
      <path
        d="M15,-11 L15,-9.5 L18,-10.2 Z"
        fill="#6b1a00"
        stroke="#3a0a00"
        strokeWidth={0.2}
      />
      {/* Foremast pennant */}
      <path
        d="M8,-8 L8,-6.5 L11,-7.2 Z"
        fill="#6b1a00"
        stroke="#3a0a00"
        strokeWidth={0.2}
      />

      {/* === WAKE / WATER LINES === */}
      <path
        d="M28,9 Q32,9.5 36,9 Q40,8.5 44,9"
        stroke="#88c4d4"
        strokeWidth={0.5}
        fill="none"
        opacity={0.7}
      />
      <path
        d="M27,10 Q33,11 38,10.5 Q43,10 48,10.5"
        stroke="#88c4d4"
        strokeWidth={0.4}
        fill="none"
        opacity={0.5}
      />
      {/* Bow wave */}
      <path
        d="M2,8 Q-1,8.5 -4,8 Q-7,7.5 -10,8"
        stroke="#88c4d4"
        strokeWidth={0.5}
        fill="none"
        opacity={0.65}
      />
    </g>
  )
}

/* ============================================================
   SEA MONSTER — sinuous serpentine Leviathan
============================================================ */
interface MonsterProps { x: number; y: number; flip: boolean; scale: number }

function SeaMonster({ x, y, flip, scale }: MonsterProps) {
  const transform = flip
    ? `translate(${x}, ${y}) scale(${-scale}, ${scale})`
    : `translate(${x}, ${y}) scale(${scale})`

  return (
    <g transform={transform} opacity={0.75}>
      {/* ---- BODY COILS ---- */}
      {/* Main sinuous body — several segments forming an S/C curve */}
      <path
        d="M0,0 C10,-8 25,-10 30,-5 C35,0 32,10 25,12 C18,14 8,10 5,16 C2,22 8,30 20,28"
        stroke="#2a5040"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      {/* Body fill / underside colour */}
      <path
        d="M0,0 C10,-8 25,-10 30,-5 C35,0 32,10 25,12 C18,14 8,10 5,16 C2,22 8,30 20,28"
        stroke="#3a7060"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* ---- SCALES / SPINES along the back ---- */}
      {/* Spines are small triangles poking out perpendicular to the curve */}
      {[
        [8,-7],  [13,-8], [18,-8.5],[23,-7], [28,-3],
        [30,2],  [28,7],  [25,10.5],[20,12], [15,13],
        [10,12], [6.5,15],[5,19],   [7,24],  [13,27],
      ].map(([sx, sy], i) => (
        <path
          key={i}
          d={`M${sx},${sy} L${sx - 1},${sy - 3} L${sx + 1},${sy - 3} Z`}
          fill="#1a3020"
          stroke="#0d2010"
          strokeWidth={0.2}
        />
      ))}

      {/* ---- HEAD ---- */}
      {/* Neck connecting body to head */}
      <ellipse cx={-2} cy={-3} rx={4} ry={3} fill="#2a5040" stroke="#1a3020" strokeWidth={0.4} transform="rotate(-30,-2,-3)" />
      {/* Head — elongated dragon-like snout */}
      <path
        d="M-8,-8 C-12,-12 -16,-10 -18,-7 C-20,-4 -18,-1 -14,0 C-10,1 -6,0 -4,-3 Z"
        fill="#2a5040"
        stroke="#1a3020"
        strokeWidth={0.5}
      />
      {/* Upper jaw / snout ridge */}
      <path
        d="M-8,-8 C-13,-13 -18,-11 -20,-8 C-21,-6 -19,-4 -16,-4"
        stroke="#1a3020"
        strokeWidth={0.4}
        fill="none"
      />
      {/* Mouth / teeth */}
      <path
        d="M-18,-6 L-16,-8 L-14,-6 L-12,-8 L-10,-7 L-8,-8"
        stroke="#0d2010"
        strokeWidth={0.3}
        fill="none"
        opacity={0.8}
      />
      {/* Teeth */}
      {[-17,-15,-13,-11].map((tx, i) => (
        <path key={i} d={`M${tx},-6.5 L${tx - 0.5},-8 L${tx + 0.5},-8 Z`} fill="#e8e0c8" opacity={0.9} />
      ))}
      {/* Horns */}
      <path d="M-12,-9 L-11,-13 L-9,-9" fill="#1a3020" stroke="#0d2010" strokeWidth={0.3} />
      <path d="M-14,-9.5 L-13,-13.5 L-11,-9.5" fill="#1a3020" stroke="#0d2010" strokeWidth={0.3} />
      {/* Glowing eye */}
      <circle cx={-14} cy={-7} r={1.5} fill="#ffee40" />
      <circle cx={-14} cy={-7} r={0.8} fill="#ff8800" />
      <circle cx={-14} cy={-7} r={0.3} fill="#220000" />
      {/* Eye glow */}
      <circle cx={-14} cy={-7} r={2.5} fill="none" stroke="#ffee40" strokeWidth={0.4} opacity={0.5} />
      {/* Nostril */}
      <ellipse cx={-18} cy={-8} rx={0.6} ry={0.4} fill="#0d2010" />

      {/* ---- TAIL FIN ---- */}
      <path
        d="M20,28 C22,32 18,36 14,34 C10,32 12,28 16,30 C18,31 19,34 15,35"
        stroke="#2a5040"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {/* Tail fin flare */}
      <path
        d="M20,28 L26,32 L23,37 L17,35 L20,28 Z"
        fill="#2a5040"
        stroke="#1a3020"
        strokeWidth={0.4}
        opacity={0.85}
      />
      {/* Tail fin membrane lines */}
      <line x1={20} y1={28} x2={25} y2={33} stroke="#1a3020" strokeWidth={0.3} opacity={0.7} />
      <line x1={20} y1={28} x2={22} y2={36} stroke="#1a3020" strokeWidth={0.3} opacity={0.7} />

      {/* ---- WATER DISTURBANCE around monster ---- */}
      <path
        d="M-5,2 Q-8,3 -11,2 Q-14,1 -17,2"
        stroke="#88c4d4"
        strokeWidth={0.6}
        fill="none"
        opacity={0.6}
      />
      <path
        d="M22,20 Q26,21 30,20 Q34,19 38,20"
        stroke="#88c4d4"
        strokeWidth={0.6}
        fill="none"
        opacity={0.6}
      />
    </g>
  )
}

/* ============================================================
   MAP COMPASS ROSE — 16-point star
============================================================ */
interface CompassRoseProps { x: number; y: number; size: number }

function MapCompassRose({ x, y, size }: CompassRoseProps) {
  const s = size
  const long = s         // long cardinal point length
  const med  = s * 0.62 // medium diagonal
  const sml  = s * 0.38 // small inter-cardinal
  const w    = s * 0.12 // point base half-width

  // Generate a compass point polygon: a narrow diamond
  const point = (angle: number, length: number, baseW: number) => {
    const rad = (angle * Math.PI) / 180
    const px = Math.cos(rad) * length
    const py = Math.sin(rad) * length
    const lx = Math.cos(rad - Math.PI / 2) * baseW
    const ly = Math.sin(rad - Math.PI / 2) * baseW
    const rx = Math.cos(rad + Math.PI / 2) * baseW
    const ry = Math.sin(rad + Math.PI / 2) * baseW
    return `${lx},${ly} ${px},${py} ${rx},${ry} 0,0`
  }

  const cardinalAngles  = [270, 90, 0, 180] // N S E W
  const diagonalAngles  = [315, 45, 225, 135]
  const interAngles     = [292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5]

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Background shadow */}
      <circle cx={0} cy={0} r={s * 0.55} fill="rgba(0,0,0,0.15)" />
      {/* Outer decorative ring */}
      <circle cx={0} cy={0} r={s * 0.52} fill="none" stroke="#c9a84c" strokeWidth={0.8} />
      <circle cx={0} cy={0} r={s * 0.48} fill="none" stroke="#8b6030" strokeWidth={0.3} />

      {/* Inter-cardinal small points (8) */}
      {interAngles.map((a, i) => (
        <polygon key={`ic-${i}`} points={point(a, sml, w * 0.5)} fill="#8b6030" stroke="#5c3a1e" strokeWidth={0.2} />
      ))}

      {/* Diagonal medium points (4) */}
      {diagonalAngles.map((a, i) => (
        <polygon key={`d-${i}`} points={point(a, med, w * 0.6)} fill="#a07840" stroke="#5c3a1e" strokeWidth={0.25} />
      ))}

      {/* Cardinal long points — alternating gold/dark */}
      {cardinalAngles.map((a, i) => (
        <polygon
          key={`c-${i}`}
          points={point(a, long, w * 0.7)}
          fill={i % 2 === 0 ? '#c9a84c' : '#5c3a1e'}
          stroke="#3d2010"
          strokeWidth={0.3}
        />
      ))}

      {/* Center circle decoration */}
      <circle cx={0} cy={0} r={s * 0.14} fill="#3d2010" stroke="#c9a84c" strokeWidth={0.6} />
      <circle cx={0} cy={0} r={s * 0.06} fill="#c9a84c" />

      {/* Cardinal letter labels */}
      {[
        { label: 'N', dx: 0,      dy: -(long + 3) },
        { label: 'S', dx: 0,      dy:   long + 4.5 },
        { label: 'E', dx: long + 3, dy: 0.8 },
        { label: 'W', dx: -(long + 5.5), dy: 0.8 },
      ].map(({ label, dx, dy }) => (
        <text
          key={label}
          x={dx}
          y={dy}
          textAnchor="middle"
          fontSize={s * 0.22}
          fontFamily='"Garamond", "Palatino Linotype", Georgia, serif'
          fontWeight="bold"
          fill="#3d2010"
          stroke="#c9a84c"
          strokeWidth={0.3}
          paintOrder="stroke"
        >
          {label}
        </text>
      ))}
    </g>
  )
}

/* ============================================================
   CARTOUCHE — ornate scroll banner
============================================================ */
interface CartoucheProps { x: number; y: number }

function Cartouche({ x, y }: CartoucheProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Drop shadow */}
      <rect x={-22} y={-13} width={44} height={26} rx={4} ry={4} fill="rgba(0,0,0,0.2)" transform="translate(1.5, 1.5)" />

      {/* Main body fill */}
      <rect x={-22} y={-13} width={44} height={26} rx={4} ry={4} fill="#e8d5a3" stroke="#c9a84c" strokeWidth={1.2} />

      {/* Inner border line */}
      <rect x={-20} y={-11} width={40} height={22} rx={3} ry={3} fill="none" stroke="#a07840" strokeWidth={0.4} />

      {/* Rope-style border dashes */}
      <rect
        x={-21} y={-12} width={42} height={24} rx={3.5} ry={3.5}
        fill="none"
        stroke="#c9a84c"
        strokeWidth={0.7}
        strokeDasharray="1.8,1.2"
      />

      {/* Top curling scroll end — left */}
      <path d="M-22,-13 C-26,-13 -28,-9 -25,-7 C-22,-5 -20,-8 -22,-10 C-24,-12 -26,-11 -24,-9" stroke="#a07840" strokeWidth={0.8} fill="none" />
      {/* Top curling scroll end — right */}
      <path d="M22,-13 C26,-13 28,-9 25,-7 C22,-5 20,-8 22,-10 C24,-12 26,-11 24,-9" stroke="#a07840" strokeWidth={0.8} fill="none" />
      {/* Bottom curling scroll end — left */}
      <path d="M-22,13 C-26,13 -28,9 -25,7 C-22,5 -20,8 -22,10 C-24,12 -26,11 -24,9" stroke="#a07840" strokeWidth={0.8} fill="none" />
      {/* Bottom curling scroll end — right */}
      <path d="M22,13 C26,13 28,9 25,7 C22,5 20,8 22,10 C24,12 26,11 24,9" stroke="#a07840" strokeWidth={0.8} fill="none" />

      {/* Corner flourishes */}
      <circle cx={-18} cy={-9}  r={1.2} fill="none" stroke="#c9a84c" strokeWidth={0.5} />
      <circle cx={ 18} cy={-9}  r={1.2} fill="none" stroke="#c9a84c" strokeWidth={0.5} />
      <circle cx={-18} cy={ 9}  r={1.2} fill="none" stroke="#c9a84c" strokeWidth={0.5} />
      <circle cx={ 18} cy={ 9}  r={1.2} fill="none" stroke="#c9a84c" strokeWidth={0.5} />

      {/* Decorative top line */}
      <line x1={-14} y1={-7} x2={14} y2={-7} stroke="#a07840" strokeWidth={0.4} />
      {/* Decorative bottom line */}
      <line x1={-14} y1={ 7} x2={14} y2={ 7} stroke="#a07840" strokeWidth={0.4} />

      {/* Title text */}
      <text
        x={0}
        y={-1.5}
        textAnchor="middle"
        fontSize={5}
        fontFamily='"Garamond", "Palatino Linotype", "Book Antiqua", Georgia, serif'
        fontStyle="italic"
        fontWeight="bold"
        fill="#4a2a08"
        letterSpacing="0.12em"
      >
        MARE
      </text>
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize={5}
        fontFamily='"Garamond", "Palatino Linotype", "Book Antiqua", Georgia, serif'
        fontStyle="italic"
        fontWeight="bold"
        fill="#4a2a08"
        letterSpacing="0.12em"
      >
        PACIFICUM
      </text>
    </g>
  )
}

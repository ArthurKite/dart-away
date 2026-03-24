interface CompassRoseProps {
  size?: number
}

export default function CompassRose({ size = 100 }: CompassRoseProps) {
  const gold  = '#b8860b'
  const dark  = '#3d2b1f'
  const cream = '#f4e4c1'

  // Diamond path for a single point, tip pointing up from origin
  const cardinalPoint      = 'M 0,-38 L 7,-8 L 0,8 L -7,-8 Z'
  const intercardinalPoint = 'M 0,-26 L 5,-5 L 0,6 L -5,-5 Z'

  const cardinalAngles      = [0, 90, 180, 270]
  const intercardinalAngles = [45, 135, 225, 315]

  const labels = [
    { label: 'N', x:  0,  y: -44, anchor: 'middle' as const },
    { label: 'S', x:  0,  y:  52, anchor: 'middle' as const },
    { label: 'E', x:  47, y:   4, anchor: 'start'  as const },
    { label: 'W', x: -47, y:   4, anchor: 'end'    as const },
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Compass rose"
    >
      <defs>
        <filter id="compass-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor={dark} floodOpacity="0.4" />
        </filter>
      </defs>

      <g transform="translate(50, 50)" filter="url(#compass-shadow)">
        {/* Intercardinal points — gold, behind cardinal points */}
        {intercardinalAngles.map((angle) => (
          <path
            key={`ic-${angle}`}
            d={intercardinalPoint}
            fill={gold}
            stroke={dark}
            strokeWidth="0.5"
            transform={`rotate(${angle})`}
          />
        ))}

        {/* Cardinal points — alternating dark/cream for classic antique look */}
        {cardinalAngles.map((angle, i) => (
          <path
            key={`c-${angle}`}
            d={cardinalPoint}
            fill={i % 2 === 0 ? dark : cream}
            stroke={dark}
            strokeWidth="0.6"
            transform={`rotate(${angle})`}
          />
        ))}

        {/* Outer decorative ring */}
        <circle r="10" fill="none" stroke={gold} strokeWidth="0.8" />
        {/* Inner white hub */}
        <circle r="7" fill={cream} stroke={dark} strokeWidth="0.8" />
        {/* Centre dot */}
        <circle r="2.5" fill={gold} />

        {/* Cardinal direction labels */}
        {labels.map(({ label, x, y, anchor }) => (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="9"
            fontFamily="Playfair Display, serif"
            fontWeight="700"
            fill={dark}
            style={{ userSelect: 'none' }}
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  )
}

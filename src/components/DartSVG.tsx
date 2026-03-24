/**
 * Medieval quill-pen style dart — inline SVG, ~45px tall.
 * The tip points DOWN (toward the map) so the dart "sticks" into the target.
 */
export default function DartSVG({ size = 45 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dart"
      style={{ overflow: 'visible' }}
    >
      {/* Shaft — slightly tapered wooden rod */}
      <line
        x1="20" y1="12" x2="20" y2="65"
        stroke="#8B6914"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Inner shaft highlight */}
      <line
        x1="20" y1="12" x2="20" y2="65"
        stroke="#C49A3C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Metal tip — dark steel point */}
      <polygon
        points="20,80 16,62 20,65 24,62"
        fill="#4a4a4a"
        stroke="#2a2a2a"
        strokeWidth="0.5"
      />
      {/* Tip highlight */}
      <polygon
        points="20,78 18,64 20,66"
        fill="#6a6a6a"
        opacity="0.6"
      />

      {/* Quill fletching — three feather vanes at the tail */}
      {/* Left feather */}
      <path
        d="M 20,10 Q 8,4 6,0 Q 12,8 20,18 Z"
        fill="#8B2500"
        stroke="#5c1a00"
        strokeWidth="0.4"
        opacity="0.9"
      />
      {/* Right feather */}
      <path
        d="M 20,10 Q 32,4 34,0 Q 28,8 20,18 Z"
        fill="#8B2500"
        stroke="#5c1a00"
        strokeWidth="0.4"
        opacity="0.9"
      />
      {/* Center feather (behind, slightly visible) */}
      <path
        d="M 20,8 Q 20,-2 20,0 Q 22,6 20,16 Z"
        fill="#6B1C00"
        stroke="#4c1400"
        strokeWidth="0.3"
        opacity="0.7"
      />

      {/* Binding wrap where feathers meet shaft */}
      <rect x="18" y="14" width="4" height="5" rx="1" fill="#C49A3C" />
      <rect x="18.5" y="15" width="3" height="0.8" fill="#8B6914" />
      <rect x="18.5" y="17" width="3" height="0.8" fill="#8B6914" />
    </svg>
  )
}

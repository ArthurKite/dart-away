import { useState } from 'react'
import { isMuted, setMuted } from '../utils/sounds'

export default function MuteButton() {
  const [muted, setMutedState] = useState(isMuted())

  const toggle = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '2px solid #b8860b',
        background: 'linear-gradient(to bottom, #7a5230, #5c3a1e)',
        color: '#f4e4c1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        opacity: muted ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Bell shape */}
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {muted && (
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2.5" />
        )}
      </svg>
    </button>
  )
}

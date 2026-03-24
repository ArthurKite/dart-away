import type { HistoryEntry } from '../types'

interface HistorySidebarProps {
  open: boolean
  onToggle: () => void
  entries: HistoryEntry[]
  onEntryClick: (entry: HistoryEntry) => void
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

export default function HistorySidebar({ open, onToggle, entries, onEntryClick }: HistorySidebarProps) {
  return (
    <>
      {/* Toggle button — top-left */}
      <button
        onClick={onToggle}
        aria-label={open ? 'Close expedition log' : 'Open expedition log'}
        title="Expedition Log"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 25,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid #b8860b',
          background: open
            ? 'linear-gradient(to bottom, #5c3a1e, #3d2510)'
            : 'linear-gradient(to bottom, #7a5230, #5c3a1e)',
          color: '#f4e4c1',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'background 0.2s',
        }}
      >
        <BookIcon />
      </button>

      {/* Sidebar panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 22,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s ease-in-out',
          background: 'linear-gradient(180deg, #f4e4c1 0%, #e8d4a8 40%, #dcc89c 100%)',
          borderRight: '3px solid #b8860b',
          boxShadow: open ? '4px 0 20px rgba(20,10,0,0.3)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"Crimson Text", Georgia, serif',
          color: '#3d2b1f',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '60px 20px 14px',
            borderBottom: '2px solid #d4a96a',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 20,
              fontWeight: 900,
              margin: 0,
              letterSpacing: '0.04em',
              textShadow: '1px 1px 2px rgba(62,30,5,0.2)',
            }}
          >
            Expedition Log
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.6, fontStyle: 'italic' }}>
            {entries.length} {entries.length === 1 ? 'expedition' : 'expeditions'} recorded
          </p>
        </div>

        {/* Entries list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {entries.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                fontSize: 15,
                fontStyle: 'italic',
                opacity: 0.5,
                lineHeight: 1.6,
              }}
            >
              No expeditions yet...<br />throw a dart!
            </p>
          ) : (
            entries.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => onEntryClick(entry)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: '1px solid rgba(184,134,11,0.15)',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: '"Crimson Text", Georgia, serif',
                  color: '#3d2b1f',
                  fontSize: 14,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(184,134,11,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Entry number */}
                <span
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 900,
                    fontSize: 16,
                    color: '#b8860b',
                    minWidth: 22,
                    textAlign: 'right',
                  }}
                >
                  {entries.length - i}
                </span>

                {/* Flag */}
                {entry.countryCode ? (
                  <img
                    src={`https://flagcdn.com/w40/${entry.countryCode}.png`}
                    alt=""
                    width={24}
                    style={{ borderRadius: 2, border: '1px solid #d4a96a', flexShrink: 0 }}
                  />
                ) : (
                  <span style={{ width: 24, height: 16, flexShrink: 0 }} />
                )}

                {/* Country + temp */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.country}
                    </span>
                    {entry.isRepeat && (
                      <span style={{ fontSize: 11, flexShrink: 0 }} title="Visited again!">
                        🔄
                      </span>
                    )}
                  </div>
                  {entry.weather && (
                    <span style={{ fontSize: 12, opacity: 0.6 }}>
                      {entry.weather.emoji} {entry.weather.temperature}°C
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {open && (
        <div
          onClick={onToggle}
          className="block sm:hidden"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 21,
            background: 'rgba(20,10,0,0.3)',
          }}
        />
      )}
    </>
  )
}

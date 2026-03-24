interface ThrowButtonProps {
  disabled: boolean
  onClick: () => void
}

export default function ThrowButton({ disabled, onClick }: ThrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-display"
      style={{
        background: disabled
          ? 'linear-gradient(180deg, #7a5230 0%, #5c3a1e 50%, #3d2510 100%)'
          : 'linear-gradient(180deg, #7a5230 0%, #5c3a1e 50%, #3d2510 100%)',
        color: disabled ? '#b8a080' : '#f4e4c1',
        fontSize: '1.35rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        padding: '14px 40px',
        border: '3px solid #b8860b',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        boxShadow: disabled
          ? 'inset 0 2px 4px rgba(0,0,0,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(92,58,30,0.5)',
        textShadow: disabled ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
        transform: 'scale(1)',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        const el = e.currentTarget
        el.style.transform = 'scale(1.05)'
        el.style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 20px rgba(0,0,0,0.5), 0 0 25px rgba(184,134,11,0.3), 0 0 0 1px rgba(184,134,11,0.6)'
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
        el.style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(92,58,30,0.5)'
      }}
    >
      {disabled ? 'Throwing...' : 'Throw a Dart 🎯'}
    </button>
  )
}

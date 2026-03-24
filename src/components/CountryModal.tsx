import { useEffect, useState, useCallback, useRef } from 'react'
import { getCountryCode } from '../utils/countryCodes'
import { fetchWeather, type WeatherData } from '../utils/weather'
import { getFunFact } from '../utils/funFacts'
import { getSlackMessage } from '../utils/slackMessages'

export interface ModalData {
  weather: WeatherData | null
  funFact: string | null
  slackMessage: string | null
}

interface CountryModalProps {
  country: string
  onClose: () => void
  onThrowAgain: () => void
  preloaded?: ModalData | null
  onDataLoaded?: (data: ModalData) => void
}

/* ─── Decorative SVG elements ─── */

function ScrollTop() {
  return (
    <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d="M0,18 Q10,0 30,2 L370,2 Q390,0 400,18" fill="#e6d5a8" stroke="#b8960b" strokeWidth="1" />
      <path d="M30,2 L370,2" stroke="#c9a84c" strokeWidth="0.5" opacity="0.6" />
      {/* Curl ends */}
      <ellipse cx="12" cy="10" rx="12" ry="8" fill="none" stroke="#b8960b" strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="388" cy="10" rx="12" ry="8" fill="none" stroke="#b8960b" strokeWidth="1.2" opacity="0.5" />
    </svg>
  )
}

function ScrollBottom() {
  return (
    <svg width="100%" height="18" viewBox="0 0 400 18" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d="M0,0 Q10,18 30,16 L370,16 Q390,18 400,0" fill="#e6d5a8" stroke="#b8960b" strokeWidth="1" />
      <path d="M30,16 L370,16" stroke="#c9a84c" strokeWidth="0.5" opacity="0.6" />
      <ellipse cx="12" cy="8" rx="12" ry="8" fill="none" stroke="#b8960b" strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="388" cy="8" rx="12" ry="8" fill="none" stroke="#b8960b" strokeWidth="1.2" opacity="0.5" />
    </svg>
  )
}

function Divider() {
  return (
    <svg width="200" height="12" viewBox="0 0 200 12" style={{ display: 'block', margin: '0 auto' }}>
      <line x1="0" y1="6" x2="80" y2="6" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <line x1="120" y1="6" x2="200" y2="6" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <path d="M90,6 L95,2 L100,6 L105,2 L110,6" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.7" />
      <circle cx="100" cy="6" r="2" fill="#c9a84c" opacity="0.5" />
    </svg>
  )
}

function WaxSeal({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: '2.5px solid #5a1208',
        background: 'radial-gradient(circle at 38% 32%, #c0402a 0%, #8a1a0a 55%, #501008 100%)',
        color: '#f4e4c1',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: '"Playfair Display", serif',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 3px 10px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,200,150,0.25), inset 0 -1px 2px rgba(0,0,0,0.3)',
        lineHeight: 1,
        zIndex: 5,
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      ✕
    </button>
  )
}

/* ─── Main component ─── */

export default function CountryModal({ country, onClose, onThrowAgain, preloaded, onDataLoaded }: CountryModalProps) {
  const hasPreloaded = !!preloaded
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(preloaded?.weather ?? null)
  const [weatherLoading, setWeatherLoading] = useState(!hasPreloaded)
  const [weatherError, setWeatherError] = useState(false)
  const countryCode = getCountryCode(country)
  const funFact = getFunFact(country)

  const [slackMessage, setSlackMessage] = useState<string>(
    preloaded?.slackMessage ?? getSlackMessage(country, funFact)
  )
  const slackMessageSet = useRef(!!preloaded?.slackMessage)
  const displaySlack = slackMessage

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (hasPreloaded) return
    let cancelled = false
    fetchWeather(country)
      .then((data) => {
        if (!cancelled) {
          setWeather(data)
          setWeatherLoading(false)
          if (!slackMessageSet.current) {
            slackMessageSet.current = true
            const msg = getSlackMessage(country, funFact, `${data.temperature}°C ${data.description}`, data.capital)
            setSlackMessage(msg)
          }
          onDataLoaded?.({ weather: data, funFact, slackMessage })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherError(true)
          setWeatherLoading(false)
          onDataLoaded?.({ weather: null, funFact, slackMessage })
        }
      })
    return () => { cancelled = true }
  }, [country, hasPreloaded, onDataLoaded, funFact, slackMessage])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displaySlack)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = displaySlack
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [displaySlack])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(15, 8, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
        onClick={onClose}
      />

      {/* Modal scroll */}
      <div
        className="modal-card"
        style={{
          position: 'relative',
          zIndex: 1,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
        }}
      >
        {/* Scroll top edge */}
        <ScrollTop />

        {/* Main parchment body */}
        <div
          style={{
            background: 'linear-gradient(180deg, #f5e6c8 0%, #eedcb0 30%, #f2e3c0 70%, #e8d5a8 100%)',
            borderLeft: '3px solid #b8960b',
            borderRight: '3px solid #b8960b',
            padding: '20px 28px 24px',
            fontFamily: '"Crimson Text", Georgia, serif',
            color: '#2c1a0e',
            position: 'relative',
            // Subtle paper texture via repeating gradient
            backgroundImage: `
              linear-gradient(180deg, #f5e6c8 0%, #eedcb0 30%, #f2e3c0 70%, #e8d5a8 100%),
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,105,20,0.03) 3px, rgba(139,105,20,0.03) 4px)
            `,
          }}
        >
          <WaxSeal onClick={onClose} />

          {/* ── Header: Flag + Country name + Weather ── */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            {/* Flag */}
            {countryCode && (
              <div style={{ marginBottom: 10 }}>
                <img
                  src={`https://flagcdn.com/w160/${countryCode}.png`}
                  alt={`Flag of ${country}`}
                  width={100}
                  style={{
                    borderRadius: 3,
                    border: '2px solid #c9a84c',
                    boxShadow: '0 3px 12px rgba(40,20,0,0.25)',
                  }}
                />
              </div>
            )}

            {/* Country name */}
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 32,
              fontWeight: 900,
              margin: '0 0 4px',
              letterSpacing: '0.04em',
              color: '#2c1a0e',
              textShadow: '1px 2px 4px rgba(62,30,5,0.2)',
              lineHeight: 1.1,
            }}>
              {country}
            </h2>

            {/* Weather badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 6,
              padding: '4px 14px',
              borderRadius: 20,
              background: 'rgba(139,105,20,0.1)',
              border: '1px solid rgba(185,150,11,0.3)',
              fontSize: 15,
              color: '#5a3d1a',
            }}>
              {weatherLoading ? (
                <>
                  <span style={{
                    display: 'inline-block', width: 14, height: 14,
                    border: '2px solid #c9a84c', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                  <span style={{ opacity: 0.7 }}>Loading weather...</span>
                </>
              ) : weatherError ? (
                <span style={{ opacity: 0.6 }}>Weather unavailable</span>
              ) : weather ? (
                <>
                  <span style={{ fontSize: 18 }}>{weather.emoji}</span>
                  <span><strong>{weather.temperature}°C</strong> in {weather.capital}</span>
                  <span style={{ opacity: 0.6 }}>— {weather.description}</span>
                </>
              ) : null}
            </div>
          </div>

          <Divider />

          {/* ── Fun Fact section ── */}
          <div style={{ margin: '14px 0 16px', textAlign: 'center' }}>
            <div style={{
              fontSize: 11,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#8b6914',
              marginBottom: 6,
            }}>
              Historical Curiosity
            </div>
            <p style={{
              fontSize: 16,
              lineHeight: 1.55,
              margin: 0,
              fontStyle: 'italic',
              color: '#3d2b1f',
              padding: '0 8px',
            }}>
              &ldquo;{funFact}&rdquo;
            </p>
          </div>

          <Divider />

          {/* ── Slack Message section ── */}
          <div style={{ margin: '14px 0 18px' }}>
            <div style={{
              fontSize: 11,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: '#8b6914',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Your Message to the Boss
            </div>
            <blockquote style={{
              margin: 0,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(139,105,20,0.06) 0%, rgba(139,105,20,0.12) 100%)',
              borderLeft: '3px solid #c9a84c',
              borderRadius: '0 8px 8px 0',
              fontSize: 14.5,
              lineHeight: 1.6,
              color: '#3d2b1f',
              fontStyle: 'italic',
              position: 'relative',
            }}>
              <span style={{ fontSize: 24, color: '#c9a84c', fontFamily: 'Georgia, serif', position: 'absolute', top: 4, left: 8, lineHeight: 1, opacity: 0.4 }}>&ldquo;</span>
              <span style={{ paddingLeft: 12, display: 'block' }}>{displaySlack}</span>
            </blockquote>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                maxWidth: 200,
                padding: '10px 16px',
                background: copied
                  ? 'linear-gradient(to bottom, #4a7c3f, #3a6230)'
                  : 'linear-gradient(to bottom, #6b4422, #4a2d14)',
                color: '#f4e4c1',
                border: `2px solid ${copied ? '#5a9c4f' : '#8b6914'}`,
                borderRadius: 8,
                fontFamily: '"Playfair Display", serif',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Message'}
            </button>

            <button
              onClick={onThrowAgain}
              style={{
                flex: 1,
                maxWidth: 200,
                padding: '10px 16px',
                background: 'linear-gradient(to bottom, #8b6914, #6b4c10)',
                color: '#f4e4c1',
                border: '2px solid #c9a84c',
                borderRadius: 8,
                fontFamily: '"Playfair Display", serif',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              🎯 Throw Again
            </button>
          </div>
        </div>

        {/* Scroll bottom edge */}
        <ScrollBottom />
      </div>
    </div>
  )
}

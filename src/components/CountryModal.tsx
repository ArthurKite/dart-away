import { useEffect, useState, useCallback } from 'react'
import { getCountryCode } from '../utils/countryCodes'
import { fetchWeather, type WeatherData } from '../utils/weather'

interface CountryModalProps {
  country: string
  onClose: () => void
  onThrowAgain: () => void
}

function CornerOrnament({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ position: 'absolute', ...style }}
      aria-hidden="true"
    >
      <path
        d="M2 38 Q2 20 10 12 Q14 8 20 6 Q14 10 10 16 Q6 22 4 34 Z"
        fill="#8b6914"
        opacity={0.5}
      />
      <path
        d="M2 38 Q4 28 8 22 Q12 16 18 12"
        stroke="#8b6914"
        strokeWidth="1.5"
        fill="none"
        opacity={0.7}
      />
      <path
        d="M2 38 Q6 32 12 28 Q18 24 26 22"
        stroke="#8b6914"
        strokeWidth="1"
        fill="none"
        opacity={0.4}
      />
      <circle cx="2" cy="38" r="2" fill="#8b6914" opacity={0.6} />
    </svg>
  )
}

export default function CountryModal({ country, onClose, onThrowAgain }: CountryModalProps) {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState(false)
  const [aiContent, setAiContent] = useState<{ funFact: string; slackMessage: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(true)
  const countryCode = getCountryCode(country)

  const fallbackSlack = `Hey boss, I just threw a dart at a map and it landed on ${country}! I think the universe is telling me I need a vacation there. Can I book some time off? 🎯✈️`
  const displaySlack = aiContent?.slackMessage || fallbackSlack

  // Trigger entrance animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Fetch weather on mount, then fetch AI content once weather resolves
  useEffect(() => {
    let cancelled = false
    fetchWeather(country)
      .then((data) => {
        if (!cancelled) {
          setWeather(data)
          setWeatherLoading(false)
          // Now fetch AI content with weather info
          const tempStr = `${data.temperature}°C, ${data.description}`
          fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country, temperature: tempStr }),
          })
            .then((res) => res.ok ? res.json() : Promise.reject(new Error('API error')))
            .then((ai) => {
              if (!cancelled) {
                setAiContent(ai)
                setAiLoading(false)
              }
            })
            .catch(() => {
              if (!cancelled) setAiLoading(false)
            })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherError(true)
          setWeatherLoading(false)
          // Still try AI without weather info
          fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country, temperature: 'unknown' }),
          })
            .then((res) => res.ok ? res.json() : Promise.reject(new Error('API error')))
            .then((ai) => {
              if (!cancelled) {
                setAiContent(ai)
                setAiLoading(false)
              }
            })
            .catch(() => {
              if (!cancelled) setAiLoading(false)
            })
        }
      })
    return () => { cancelled = true }
  }, [country])

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(20, 10, 0, 0.55)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 460,
          width: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f4e4c1 0%, #ecdcb0 50%, #f0debb 100%)',
          border: '3px solid #8b6914',
          borderRadius: 8,
          boxShadow: '0 8px 40px rgba(20, 10, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
          padding: '36px 32px 28px',
          fontFamily: '"Crimson Text", Georgia, serif',
          color: '#3d2b1f',
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament style={{ top: 4, left: 4 }} />
        <CornerOrnament style={{ top: 4, right: 4, transform: 'scaleX(-1)' }} />
        <CornerOrnament style={{ bottom: 4, left: 4, transform: 'scaleY(-1)' }} />
        <CornerOrnament style={{ bottom: 4, right: 4, transform: 'scale(-1, -1)' }} />

        {/* Wax seal close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid #6b1c00',
            background: 'radial-gradient(circle at 40% 35%, #a0321e 0%, #7a1a0a 60%, #501008 100%)',
            color: '#f4e4c1',
            fontSize: 15,
            fontWeight: 'bold',
            fontFamily: '"Playfair Display", serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.15)',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Country name */}
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 28,
            fontWeight: 900,
            textAlign: 'center',
            margin: '0 0 16px',
            letterSpacing: '0.03em',
            textShadow: '1px 2px 3px rgba(62,30,5,0.25)',
          }}
        >
          {country}
        </h2>

        {/* Flag */}
        {countryCode && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img
              src={`https://flagcdn.com/w160/${countryCode}.png`}
              alt={`Flag of ${country}`}
              width={120}
              style={{
                borderRadius: 4,
                border: '2px solid #d4a96a',
                boxShadow: '0 2px 8px rgba(62,30,5,0.2)',
              }}
            />
          </div>
        )}

        {/* Temperature */}
        <p style={{ fontSize: 18, textAlign: 'center', margin: '12px 0' }}>
          {weatherLoading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  border: '2px solid #d4a96a',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Fetching weather...
            </span>
          ) : weatherError ? (
            '🌡️ Weather data unavailable'
          ) : weather ? (
            `${weather.emoji} ${weather.temperature}°C in ${weather.capital} — ${weather.description}`
          ) : null}
        </p>

        {/* Fun fact */}
        <div style={{ margin: '12px 0' }}>
          {aiLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '80%', height: 14, borderRadius: 4, background: '#d4a96a', opacity: 0.25, animation: 'skeleton-pulse 1.2s ease-in-out infinite' }} />
              <div style={{ width: '60%', height: 14, borderRadius: 4, background: '#d4a96a', opacity: 0.25, animation: 'skeleton-pulse 1.2s ease-in-out infinite 0.15s' }} />
            </div>
          ) : (
            <p style={{ fontSize: 17, textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
              📜 {aiContent?.funFact || 'Did you know? This country has a fascinating history waiting to be explored!'}
            </p>
          )}
        </div>

        {/* Slack message */}
        <div style={{ margin: '20px 0 16px' }}>
          {aiLoading ? (
            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(139, 105, 20, 0.08)',
                borderLeft: '4px solid #b8860b',
                borderRadius: '0 6px 6px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ width: '90%', height: 13, borderRadius: 4, background: '#d4a96a', opacity: 0.25, animation: 'skeleton-pulse 1.2s ease-in-out infinite' }} />
              <div style={{ width: '95%', height: 13, borderRadius: 4, background: '#d4a96a', opacity: 0.25, animation: 'skeleton-pulse 1.2s ease-in-out infinite 0.1s' }} />
              <div style={{ width: '70%', height: 13, borderRadius: 4, background: '#d4a96a', opacity: 0.25, animation: 'skeleton-pulse 1.2s ease-in-out infinite 0.2s' }} />
            </div>
          ) : (
            <blockquote
              style={{
                margin: 0,
                padding: '14px 16px',
                background: 'rgba(139, 105, 20, 0.08)',
                borderLeft: '4px solid #b8860b',
                borderRadius: '0 6px 6px 0',
                fontSize: 15,
                lineHeight: 1.55,
                fontStyle: 'italic',
              }}
            >
              {displaySlack}
            </blockquote>
          )}
        </div>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          {/* Copy Slack Message */}
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 20px',
              background: copied
                ? 'linear-gradient(to bottom, #4a7c3f, #3a6230)'
                : 'linear-gradient(to bottom, #7a5230, #5c3a1e)',
              color: '#f4e4c1',
              border: `2px solid ${copied ? '#5a9c4f' : '#b8860b'}`,
              borderRadius: 6,
              fontFamily: '"Playfair Display", serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              minWidth: 150,
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Slack Message'}
          </button>

          {/* Throw Again */}
          <button
            onClick={onThrowAgain}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(to bottom, #7a5230, #5c3a1e, #3d2510)',
              color: '#f4e4c1',
              border: '2px solid #b8860b',
              borderRadius: 6,
              fontFamily: '"Playfair Display", serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            🎯 Throw Again
          </button>
        </div>
      </div>
    </div>
  )
}

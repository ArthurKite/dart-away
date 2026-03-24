import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import WorldMap, { type GeoFeature } from './components/WorldMap'
import MapBorder from './components/MapBorder'
import CompassRose from './components/CompassRose'
import ThrowButton from './components/ThrowButton'
import DartAnimation from './components/DartAnimation'
import CountryModal, { type ModalData } from './components/CountryModal'
import MuteButton from './components/MuteButton'
import DustParticles from './components/DustParticles'
import HistorySidebar from './components/HistorySidebar'
import { getCountryCentroidViewport } from './utils/projection'
import { getCountryCode } from './utils/countryCodes'
import { playWhoosh, playLand } from './utils/sounds'
import type { HistoryEntry } from './types'

interface ThrowState {
  country: string
  targetX: number
  targetY: number
  geo: GeoFeature
}

export default function App() {
  const [geographies, setGeographies] = useState<GeoFeature[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isThrowing, setIsThrowing] = useState(false)
  const [throwState, setThrowState] = useState<ThrowState | null>(null)
  const [dartLanded, setDartLanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Map zoom/pan state (controlled)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const [mapZoom, setMapZoom] = useState(1)

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [historyModal, setHistoryModal] = useState<HistoryEntry | null>(null)
  const nextIdRef = useRef(1)
  const pendingEntryRef = useRef<Partial<HistoryEntry> | null>(null)

  const handleGeographiesLoaded = useCallback((geos: GeoFeature[]) => {
    setGeographies(geos)
  }, [])

  const handleMapMoveEnd = useCallback(
    (position: { coordinates: [number, number]; zoom: number }) => {
      setMapCenter(position.coordinates)
      setMapZoom(position.zoom)
    },
    [],
  )

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8
      const y = (e.clientY / window.innerHeight - 0.5) * 8
      setParallax({ x, y })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const handleThrow = () => {
    if (geographies.length === 0 || isThrowing) return

    // Reset map to default view first so projection calculation is correct
    setMapCenter([0, 0])
    setMapZoom(1)
    setIsThrowing(true)
    setDartLanded(false)
    playWhoosh()

    // Small delay to let the map animate back before computing centroid
    setTimeout(() => {
      // Pick a random country, retrying if centroid projection fails
      let geo: GeoFeature | null = null
      let coords: [number, number] | null = null
      let attempts = 0
      while (!coords && attempts < 20) {
        geo = geographies[Math.floor(Math.random() * geographies.length)]
        coords = getCountryCentroidViewport(geo)
        attempts++
      }

      if (!geo || !coords) {
        console.warn('Could not find a projectable country')
        setIsThrowing(false)
        return
      }

      const country = geo.properties.name
      console.log('🎯 Dart thrown toward:', country)
      setSelectedCountry(country)
      setThrowState({ country, targetX: coords[0], targetY: coords[1], geo })

      // Prepare a pending history entry
      const isRepeat = history.some((e) => e.country === country)
      pendingEntryRef.current = {
        id: nextIdRef.current++,
        country,
        countryCode: getCountryCode(country),
        isRepeat,
        timestamp: Date.now(),
      }
    }, 350) // wait for map to reset to default position
  }

  const handleDartLanded = useCallback(() => {
    setDartLanded(true)
    playLand()
    console.log('🎯 Dart landed!')
    // Open modal 2 seconds after landing
    modalTimerRef.current = setTimeout(() => setShowModal(true), 2000)
  }, [])

  // Called by CountryModal when it finishes fetching data
  const handleModalDataLoaded = useCallback((data: ModalData) => {
    if (!pendingEntryRef.current) return
    const entry: HistoryEntry = {
      id: pendingEntryRef.current.id!,
      country: pendingEntryRef.current.country!,
      countryCode: pendingEntryRef.current.countryCode ?? null,
      weather: data.weather,
      funFact: data.funFact,
      slackMessage: data.slackMessage,
      isRepeat: pendingEntryRef.current.isRepeat!,
      timestamp: pendingEntryRef.current.timestamp!,
    }
    setHistory((prev) => [entry, ...prev])
    pendingEntryRef.current = null
  }, [])

  const handleReset = useCallback(() => {
    // Clear any pending modal timer
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current)
      modalTimerRef.current = null
    }
    setShowModal(false)
    setHistoryModal(null)
    // Start the reset: zoom out + fade highlight (CSS transitions take ~0.8s)
    setDartLanded(false)

    // Wait for CSS transitions to finish before fully clearing state
    setTimeout(() => {
      setThrowState(null)
      setSelectedCountry(null)
      setIsThrowing(false)
    }, 800)
  }, [])

  const handleHistoryEntryClick = useCallback((entry: HistoryEntry) => {
    setSidebarOpen(false)
    setHistoryModal(entry)
  }, [])

  const handleHistoryModalClose = useCallback(() => {
    setHistoryModal(null)
  }, [])

  // Compute zoom transform style for the map wrapper
  const mapZoomStyle = useMemo(() => {
    if (dartLanded && throwState) {
      return {
        transformOrigin: `${throwState.targetX}px ${throwState.targetY}px`,
        transform: `scale(1.4) translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)`,
        transition: 'transform 0.8s ease-out',
      }
    }
    return {
      transform: `scale(1) translate(${parallax.x}px, ${parallax.y}px)`,
      transition: 'transform 0.3s ease-out',
    }
  }, [dartLanded, throwState, parallax])

  return (
    <div className="page-reveal parchment-texture vignette relative h-full w-full overflow-hidden bg-parchment">

      {/* World map — fills the full viewport as the base layer */}
      <div className="absolute inset-0 z-0" style={mapZoomStyle}>
        <WorldMap
          onGeographiesLoaded={handleGeographiesLoaded}
          selectedCountry={selectedCountry}
          dartLanded={dartLanded}
          center={mapCenter}
          zoom={mapZoom}
          onMoveEnd={handleMapMoveEnd}
        />
      </div>

      {/* Dust particles overlay */}
      <DustParticles />

      {/* History sidebar */}
      <HistorySidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        entries={history}
        onEntryClick={handleHistoryEntryClick}
      />

      {/* Title — centred at the top, above textures */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pb-4 pt-6">
        <h1
          className="font-display text-5xl font-black tracking-wide text-ink md:text-7xl"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            textShadow:
              '2px 3px 6px rgba(62,30,5,0.45), 0 0 30px rgba(184,134,11,0.18)',
            letterSpacing: '0.07em',
          }}
        >
          Dart Away
        </h1>
      </header>

      {/* Mute button — top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <MuteButton />
      </div>

      {/* Compass rose — bottom-right corner, above textures, slowly rotating */}
      <div
        className="pointer-events-none absolute bottom-14 right-6 z-20 md:bottom-6"
        style={{ animation: 'compass-rotate 60s linear infinite' }}
      >
        <CompassRose size={110} />
      </div>

      {/* Throw button — fixed bottom center, above all layers, thumb-reachable */}
      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center md:bottom-8">
        <ThrowButton disabled={isThrowing || geographies.length === 0} onClick={handleThrow} />
      </div>

      {/* Footer */}
      <footer
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-1 text-center"
        style={{
          fontFamily: '"Crimson Text", Georgia, serif',
          fontSize: 11,
          color: '#6b4c35',
          opacity: 0.6,
        }}
      >
        Dart Away — Because every vacation starts with a random dart throw ✈️
      </footer>

      {/* Dart animation layer */}
      {throwState && (
        <DartAnimation
          key={`${throwState.country}-${throwState.targetX}`}
          targetX={throwState.targetX}
          targetY={throwState.targetY}
          onLanded={handleDartLanded}
        />
      )}

      {/* Country info modal — fresh throw */}
      {showModal && selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={handleReset}
          onThrowAgain={handleReset}
          onDataLoaded={handleModalDataLoaded}
        />
      )}

      {/* Country info modal — history replay (preloaded data, no fetching) */}
      {historyModal && (
        <CountryModal
          key={`history-${historyModal.id}`}
          country={historyModal.country}
          onClose={handleHistoryModalClose}
          onThrowAgain={handleHistoryModalClose}
          preloaded={{
            weather: historyModal.weather,
            funFact: historyModal.funFact,
            slackMessage: historyModal.slackMessage,
          }}
        />
      )}

      {/* Ornate map border overlay — rendered last, on top of everything */}
      <MapBorder />

    </div>
  )
}

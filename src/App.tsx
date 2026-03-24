import { useState, useCallback } from 'react'
import WorldMap, { type GeoFeature } from './components/WorldMap'
import CompassRose from './components/CompassRose'
import ThrowButton from './components/ThrowButton'
import DartAnimation from './components/DartAnimation'
import { getCountryCentroidViewport } from './utils/projection'

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

  const handleGeographiesLoaded = useCallback((geos: GeoFeature[]) => {
    setGeographies(geos)
  }, [])

  const handleThrow = () => {
    if (geographies.length === 0 || isThrowing) return
    setIsThrowing(true)

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
  }

  const handleDartLanded = useCallback(() => {
    console.log('🎯 Dart landed on:', selectedCountry)
  }, [selectedCountry])

  const handleAnimationComplete = useCallback(() => {
    // Animation done (flight + 2s pin) — reset state
    setThrowState(null)
    setIsThrowing(false)
  }, [])

  return (
    <div className="parchment-texture vignette relative h-full w-full overflow-hidden bg-parchment">

      {/* World map — fills the full viewport as the base layer */}
      <div className="absolute inset-0 z-0">
        <WorldMap onGeographiesLoaded={handleGeographiesLoaded} />
      </div>

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

      {/* Compass rose — bottom-right corner, above textures */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-20">
        <CompassRose size={110} />
      </div>

      {/* Throw button — fixed bottom center, above all layers */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center">
        <ThrowButton disabled={isThrowing || geographies.length === 0} onClick={handleThrow} />
      </div>

      {/* Dart animation layer */}
      {throwState && (
        <DartAnimation
          key={`${throwState.country}-${throwState.targetX}`}
          targetX={throwState.targetX}
          targetY={throwState.targetY}
          onLanded={handleDartLanded}
          onComplete={handleAnimationComplete}
        />
      )}

    </div>
  )
}

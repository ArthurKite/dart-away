import WorldMap from './components/WorldMap'
import CompassRose from './components/CompassRose'

export default function App() {
  return (
    <div className="parchment-texture vignette relative h-full w-full overflow-hidden bg-parchment">

      {/* World map — fills the full viewport as the base layer */}
      <div className="absolute inset-0 z-0">
        <WorldMap />
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

    </div>
  )
}

import { useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Must match the ComposableMap props below
export const MAP_WIDTH = 800
export const MAP_HEIGHT = 420
export const MAP_SCALE = 147

export interface GeoFeature {
  rsmKey: string
  properties: { name: string }
  geometry: GeoJSON.Geometry
}

interface WorldMapProps {
  onGeographiesLoaded?: (geos: GeoFeature[]) => void
  selectedCountry?: string | null
  dartLanded?: boolean
}

const DEFAULT_FILL = '#e8d5a3'
const GOLD_FILL = '#c9a84c'
const DIMMED_OPACITY = 0.5

export default function WorldMap({
  onGeographiesLoaded,
  selectedCountry,
  dartLanded,
}: WorldMapProps) {
  const reportedRef = useRef(false)

  return (
    <div className="w-full h-full" style={{ background: '#c9dce8' }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: MAP_SCALE, center: [0, 0] }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => {
            if (!reportedRef.current && onGeographiesLoaded && geographies.length > 0) {
              reportedRef.current = true
              onGeographiesLoaded(geographies as GeoFeature[])
            }

            return geographies.map((geo) => {
              const name = geo.properties.name
              const isSelected = dartLanded && name === selectedCountry
              const isDimmed = dartLanded && selectedCountry && name !== selectedCountry

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isSelected ? GOLD_FILL : DEFAULT_FILL}
                  stroke="#d4a96a"
                  strokeWidth={isSelected ? 1 : 0.5}
                  style={{
                    default: {
                      outline: 'none',
                      opacity: isDimmed ? DIMMED_OPACITY : 1,
                      transition: 'fill 0.4s ease, opacity 0.4s ease, filter 0.4s ease, stroke-width 0.4s ease',
                      animation: isSelected ? 'country-glow-pulse 2s ease-in-out infinite' : 'none',
                      filter: isSelected
                        ? 'drop-shadow(0 0 6px rgba(201, 168, 76, 0.7))'
                        : 'none',
                    },
                    hover: {
                      outline: 'none',
                      fill: isSelected ? GOLD_FILL : DEFAULT_FILL,
                      opacity: isDimmed ? DIMMED_OPACITY : 1,
                    },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }}
        </Geographies>
      </ComposableMap>
    </div>
  )
}

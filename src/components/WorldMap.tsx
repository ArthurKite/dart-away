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
}

export default function WorldMap({ onGeographiesLoaded }: WorldMapProps) {
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

            return geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e8d5a3"
                stroke="#d4a96a"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover:   { outline: 'none', fill: '#e8d5a3' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }}
        </Geographies>
      </ComposableMap>
    </div>
  )
}

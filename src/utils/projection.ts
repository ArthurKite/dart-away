import { geoCentroid, geoNaturalEarth1 } from 'd3-geo'
import { MAP_WIDTH, MAP_HEIGHT, MAP_SCALE, type GeoFeature } from '../components/WorldMap'

/**
 * Build the same projection that ComposableMap uses internally.
 * react-simple-maps calls: projections["geoNaturalEarth1"]().translate([w/2, h/2]).scale(config.scale)
 */
function getProjection() {
  return geoNaturalEarth1()
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
    .scale(MAP_SCALE)
}

/**
 * Convert SVG viewBox coordinates → viewport pixel coordinates.
 * Accounts for preserveAspectRatio="xMidYMid meet" (default).
 */
function svgToViewport(svgX: number, svgY: number): [number, number] {
  const vw = window.innerWidth
  const vh = window.innerHeight

  const scaleX = vw / MAP_WIDTH
  const scaleY = vh / MAP_HEIGHT
  const scale = Math.min(scaleX, scaleY) // "meet" = use the smaller

  const offsetX = (vw - MAP_WIDTH * scale) / 2
  const offsetY = (vh - MAP_HEIGHT * scale) / 2

  return [
    offsetX + svgX * scale,
    offsetY + svgY * scale,
  ]
}

/**
 * Given a GeoJSON feature (country), return its centroid in viewport pixels.
 * Returns null if the projection fails (e.g. degenerate geometry).
 */
export function getCountryCentroidViewport(geo: GeoFeature): [number, number] | null {
  const [lon, lat] = geoCentroid(geo as unknown as GeoJSON.Feature)
  const proj = getProjection()
  const svgPoint = proj([lon, lat])
  if (!svgPoint) return null
  return svgToViewport(svgPoint[0], svgPoint[1])
}

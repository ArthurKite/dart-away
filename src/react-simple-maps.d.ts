declare module 'react-simple-maps' {
  import { ComponentType, CSSProperties, SVGProps, Ref } from 'react'

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    style?: CSSProperties
    children?: React.ReactNode
  }
  export const ComposableMap: ComponentType<ComposableMapProps>

  interface GeographiesProps {
    geography: string | Record<string, unknown>
    children: (data: { geographies: Array<Record<string, unknown>> }) => React.ReactNode
  }
  export const Geographies: ComponentType<GeographiesProps>

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Record<string, unknown>
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
  }
  export const Geography: ComponentType<GeographyProps>

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveStart?: (position: unknown) => void
    onMove?: (position: unknown) => void
    onMoveEnd?: (position: unknown) => void
    children?: React.ReactNode
    ref?: Ref<SVGGElement>
  }
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>

  interface GraticuleProps {
    stroke?: string
    strokeWidth?: number
    fill?: string
    step?: [number, number]
    clipPath?: string
  }
  export const Graticule: ComponentType<GraticuleProps>
}

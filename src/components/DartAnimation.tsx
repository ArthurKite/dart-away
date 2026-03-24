import { useEffect, useRef, useState } from 'react'
import DartSVG from './DartSVG'

interface DartAnimationProps {
  targetX: number
  targetY: number
  onLanded: () => void
}

/** Quadratic bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2 */
function bezier(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
): [number, number] {
  const u = 1 - t
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ]
}

/** Tangent of quadratic bezier: B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1) */
function bezierTangent(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
): [number, number] {
  const u = 1 - t
  return [
    2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]),
    2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]),
  ]
}

/** Ease-out cubic */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const FLIGHT_DURATION = 1200
const DART_WIDTH = 23  // size/2 (SVG is 1:2 ratio)
const DART_HEIGHT = 45

export default function DartAnimation({ targetX, targetY, onLanded }: DartAnimationProps) {
  const dartRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'flying' | 'pinned'>('flying')

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const p0: [number, number] = [vw + 40, vh + 40]
    const p2: [number, number] = [targetX, targetY]

    const midX = (p0[0] + p2[0]) / 2
    const highY = Math.min(p0[1], p2[1]) - Math.max(vh * 0.35, 200)
    const p1: [number, number] = [midX, highY]

    // The dart SVG tip is at bottom-center of the element.
    // We use a wrapper positioned so element top-left = (left, top),
    // and apply transforms to place the tip at the bezier point.
    //
    // Strategy: set left/top so the tip (center-bottom) is at (x,y):
    //   element left = x - DART_SIZE/2
    //   element top  = y - DART_SIZE
    // Then rotate around the tip point using transform-origin: 50% 100% (center bottom).

    const halfW = DART_WIDTH / 2

    let startTime: number | null = null
    let rafId: number

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const rawT = Math.min(elapsed / FLIGHT_DURATION, 1)
      const t = easeOutCubic(rawT)

      const [x, y] = bezier(t, p0, p1, p2)
      const [dx, dy] = bezierTangent(t, p0, p1, p2)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90

      if (dartRef.current) {
        // Position element so its bottom-center (tip) is at (x, y)
        dartRef.current.style.left = `${x - halfW}px`
        dartRef.current.style.top = `${y - DART_HEIGHT}px`
        // Rotate around the tip (bottom-center of element)
        dartRef.current.style.transform = `rotate(${angle}deg)`
      }

      if (rawT < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        // Snap to exact position with no rotation — tip exactly on target
        if (dartRef.current) {
          dartRef.current.style.left = `${targetX - halfW}px`
          dartRef.current.style.top = `${targetY - DART_HEIGHT}px`
          dartRef.current.style.transform = 'rotate(0deg)'
        }
        setPhase('pinned')
        onLanded()

        if (rippleRef.current) {
          rippleRef.current.style.left = `${targetX}px`
          rippleRef.current.style.top = `${targetY}px`
          rippleRef.current.style.opacity = '1'
        }
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [targetX, targetY, onLanded])

  return (
    <>
      <div
        ref={dartRef}
        style={{
          position: 'absolute',
          left: window.innerWidth + 40,
          top: window.innerHeight + 40,
          width: DART_WIDTH,
          height: DART_HEIGHT,
          zIndex: 50,
          pointerEvents: 'none',
          willChange: 'transform, left, top',
          // Rotate around the tip = bottom-center of the element
          transformOrigin: '50% 100%',
        }}
      >
        <DartSVG size={DART_HEIGHT} />
      </div>

      {phase === 'pinned' && (
        <div
          ref={rippleRef}
          style={{
            position: 'absolute',
            zIndex: 49,
            pointerEvents: 'none',
            left: targetX,
            top: targetY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '2px solid rgba(184, 134, 11, 0.7)',
              animation: 'ripple-pulse 0.8s ease-out forwards',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '1.5px solid rgba(184, 134, 11, 0.4)',
              animation: 'ripple-pulse 0.8s ease-out 0.15s forwards',
            }}
          />
        </div>
      )}
    </>
  )
}

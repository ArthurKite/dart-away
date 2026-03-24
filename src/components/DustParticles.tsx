import { useMemo } from 'react'

const PARTICLE_COUNT = 15

interface Particle {
  id: number
  left: string
  size: number
  duration: number
  delay: number
  startY: number
  drift: number
  opacity: number
}

export default function DustParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 12 + Math.random() * 18,
      delay: -(Math.random() * 20),
      startY: Math.random() * 100,
      drift: -30 + Math.random() * 60,
      opacity: 0.15 + Math.random() * 0.2,
    }))
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 12,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#b8860b',
            opacity: p.opacity,
            animation: `dust-float ${p.duration}s linear ${p.delay}s infinite`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

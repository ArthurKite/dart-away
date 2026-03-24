/**
 * Synthesized sound effects using the Web Audio API.
 * No external audio files needed.
 */

let audioCtx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function isMuted(): boolean {
  return muted
}

export function setMuted(m: boolean): void {
  muted = m
}

/** Quick "whoosh" — noise burst with falling bandpass filter */
export function playWhoosh(): void {
  if (muted) return
  const ctx = getCtx()
  const duration = 0.35

  // White noise source
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  // Bandpass filter with falling frequency
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 2
  filter.frequency.setValueAtTime(2000, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration)

  // Envelope
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.25, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(ctx.currentTime)
  noise.stop(ctx.currentTime + duration)
}

/** Short "thud" + "ding" — low click + high sine ping */
export function playLand(): void {
  if (muted) return
  const ctx = getCtx()
  const now = ctx.currentTime

  // Thud: low-frequency click
  const thudOsc = ctx.createOscillator()
  thudOsc.type = 'sine'
  thudOsc.frequency.setValueAtTime(80, now)
  thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12)

  const thudGain = ctx.createGain()
  thudGain.gain.setValueAtTime(0.3, now)
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  thudOsc.connect(thudGain)
  thudGain.connect(ctx.destination)
  thudOsc.start(now)
  thudOsc.stop(now + 0.12)

  // Ding: short high sine ping, slightly delayed
  const dingOsc = ctx.createOscillator()
  dingOsc.type = 'sine'
  dingOsc.frequency.setValueAtTime(1800, now + 0.05)

  const dingGain = ctx.createGain()
  dingGain.gain.setValueAtTime(0, now)
  dingGain.gain.setValueAtTime(0.15, now + 0.05)
  dingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

  dingOsc.connect(dingGain)
  dingGain.connect(ctx.destination)
  dingOsc.start(now + 0.05)
  dingOsc.stop(now + 0.35)
}

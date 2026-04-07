// Audio Manager using native HTML5 Audio API
// Uses base64 encoded short sounds to avoid external dependencies

// Simple beep sounds using Web Audio API (no external files needed)
class AudioManager {
  private audioContext: AudioContext | null = null
  private lastPlayTime: { [key: string]: number } = {}
  private cooldownMs: { [key: string]: number } = {
    drop: 100,
    cash: 200,
    error: 300
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Play a simple beep/tone
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    const now = Date.now()
    const key = `${frequency}-${type}`
    
    // Cooldown check to prevent sound spam
    const cooldown = this.cooldownMs[key] || 50
    if (this.lastPlayTime[key] && now - this.lastPlayTime[key] < cooldown) {
      return
    }
    this.lastPlayTime[key] = now

    try {
      const ctx = this.getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // Drop sound - metallic click
  playDropSound() {
    // High pitch click followed by lower thud
    this.playTone(800, 0.08, 'square', 0.15)
    setTimeout(() => this.playTone(300, 0.1, 'sine', 0.2), 50)
  }

  // Cash/coin sound - register cha-ching
  playCashSound() {
    // Two high notes for "cha-ching"
    this.playTone(1200, 0.1, 'sine', 0.2)
    setTimeout(() => this.playTone(1500, 0.15, 'sine', 0.25), 100)
  }

  // Error sound - buzzer
  playErrorSound() {
    // Low harsh buzz
    this.playTone(150, 0.3, 'sawtooth', 0.15)
  }

  // Success/completion sound
  playSuccessSound() {
    // Ascending pleasant tones
    this.playTone(523, 0.1, 'sine', 0.15) // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.15), 80) // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.2), 160) // G5
  }

  // Purchase sound
  playPurchaseSound() {
    this.playTone(600, 0.08, 'triangle', 0.2)
    setTimeout(() => this.playTone(900, 0.12, 'triangle', 0.2), 60)
  }

  // Bot execution sound
  playBotSound() {
    // Mechanical whir then confirmation
    this.playTone(400, 0.15, 'sawtooth', 0.1)
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.15), 120)
  }
}

export const audioManager = new AudioManager()

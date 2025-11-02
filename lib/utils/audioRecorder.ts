/**
 * Audio recording utilities using Web Audio API
 * Handles microphone access, recording, and audio blob creation
 */

export interface AudioRecorderState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  error: string | null
}

export interface RecordingOptions {
  sampleRate?: number
  channels?: number
  maxDuration?: number // in seconds
  onProgress?: (duration: number) => void
  onError?: (error: Error) => void
}

/**
 * AudioRecorder class for handling microphone recording
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private startTime: number = 0
  private durationInterval: NodeJS.Timeout | null = null
  
  public isRecording: boolean = false
  public isPaused: boolean = false
  public duration: number = 0
  public error: string | null = null

  private options: Required<Omit<RecordingOptions, 'onProgress' | 'onError'>> & {
    onProgress?: (duration: number) => void
    onError?: (error: Error) => void
  }

  constructor(options: RecordingOptions = {}) {
    this.options = {
      sampleRate: options.sampleRate ?? 44100,
      channels: options.channels ?? 1,
      maxDuration: options.maxDuration ?? 60,
      onProgress: options.onProgress,
      onError: options.onError,
    }
  }

  /**
   * Check if the browser supports audio recording
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') return false
    return !!(
      navigator.mediaDevices?.getUserMedia &&
      (window.AudioContext || (window as any).webkitAudioContext) &&
      MediaRecorder.isTypeSupported
    )
  }

  /**
   * Request microphone access
   */
  async requestPermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: this.options.channels,
          sampleRate: this.options.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      
      this.stream = stream
      return stream
    } catch (error) {
      const err = error as Error
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.error = 'Microphone access denied. Please allow microphone access in your browser settings.'
      } else if (err.name === 'NotFoundError') {
        this.error = 'No microphone found. Please connect a microphone and try again.'
      } else {
        this.error = `Failed to access microphone: ${err.message}`
      }
      
      this.options.onError?.(new Error(this.error))
      throw new Error(this.error)
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording')
      return
    }

    try {
      // Request permission if we don't have a stream
      if (!this.stream) {
        await this.requestPermission()
      }

      if (!this.stream) {
        throw new Error('No audio stream available')
      }

      // Create AudioContext for real-time analysis
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContextClass()
      
      // Create analyser for waveform visualization
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      
      const source = this.audioContext.createMediaStreamSource(this.stream)
      source.connect(this.analyser)

      // Setup MediaRecorder
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/webm;codecs=pcm',
      ]

      const supportedMimeType = mimeTypes.find((mime) =>
        MediaRecorder.isTypeSupported(mime)
      ) || 'audio/webm'

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: supportedMimeType,
      })

      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = (event) => {
        const error = new Error('Recording error occurred')
        this.error = error.message
        this.options.onError?.(error)
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
      this.isRecording = true
      this.startTime = Date.now()

      // Update duration every second
      this.durationInterval = setInterval(() => {
        this.duration = Math.floor((Date.now() - this.startTime) / 1000)
        this.options.onProgress?.(this.duration)

        // Check max duration
        if (this.duration >= this.options.maxDuration) {
          this.stopRecording()
        }
      }, 1000)

    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to start recording'
      this.options.onError?.(new Error(this.error))
      this.isRecording = false
      throw new Error(this.error)
    }
  }

  /**
   * Pause recording
   */
  pauseRecording(): void {
    if (!this.isRecording || this.isPaused) return

    this.mediaRecorder?.pause()
    this.isPaused = true
    
    if (this.durationInterval) {
      clearInterval(this.durationInterval)
      this.durationInterval = null
    }
  }

  /**
   * Resume recording
   */
  resumeRecording(): void {
    if (!this.isRecording || !this.isPaused) return

    this.mediaRecorder?.resume()
    this.isPaused = false
    this.startTime = Date.now() - this.duration * 1000

    this.durationInterval = setInterval(() => {
      this.duration = Math.floor((Date.now() - this.startTime) / 1000)
      this.options.onProgress?.(this.duration)

      if (this.duration >= this.options.maxDuration) {
        this.stopRecording()
      }
    }, 1000)
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording) {
      return null
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType })
        this.cleanup()
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
      this.isRecording = false

      if (this.durationInterval) {
        clearInterval(this.durationInterval)
        this.durationInterval = null
      }
    })
  }

  /**
   * Cancel recording without returning audio
   */
  cancelRecording(): void {
    if (!this.isRecording) return

    this.mediaRecorder?.stop()
    this.audioChunks = []
    this.cleanup()
  }

  /**
   * Get current audio level for visualization
   */
  getAudioLevel(): number {
    if (!this.analyser) return 0

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)

    // Calculate average audio level
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i]
    }
    return sum / dataArray.length / 255 // Normalize to 0-1
  }

  /**
   * Get audio waveform data for visualization
   */
  getWaveformData(bufferLength: number = 256): number[] {
    if (!this.analyser) return new Array(bufferLength).fill(0)

    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteTimeDomainData(dataArray)

    // Normalize to -1 to 1
    const normalized = Array.from(dataArray).map((value) => (value - 128) / 128)
    return normalized
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval)
      this.durationInterval = null
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    this.isRecording = false
    this.isPaused = false
    this.analyser = null
  }

  /**
   * Clean up all resources (call when done with recorder)
   */
  dispose(): void {
    this.cancelRecording()
    this.cleanup()
  }
}

/**
 * Convert audio blob to base64 data URL
 */
export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Create an audio element from a blob
 */
export function createAudioElement(blob: Blob): HTMLAudioElement {
  const audioUrl = URL.createObjectURL(blob)
  const audio = new Audio(audioUrl)
  
  // Clean up URL when audio is loaded
  audio.addEventListener('loadend', () => {
    URL.revokeObjectURL(audioUrl)
  })
  
  return audio
}

/**
 * Get audio duration from blob
 */
export function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = createAudioElement(blob)
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration)
      URL.revokeObjectURL(audio.src)
    })
    audio.addEventListener('error', reject)
  })
}


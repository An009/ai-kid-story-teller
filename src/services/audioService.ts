interface AudioConfig {
  voiceId: string;
  modelId: string;
  text: string;
  volume?: number;
  loop?: boolean;
  stability?: number;
  similarityBoost?: number;
}

interface SoundEffectConfig {
  prompt: string;
  duration?: number;
  volume?: number;
  loop?: boolean;
}

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private apiKey: string;
  private isInitialized: boolean = false;
  private audioQueue: HTMLAudioElement[] = [];
  private isPlaying: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.isInitialized = !!this.apiKey;
    
    if (!this.apiKey) {
      console.warn('⚠️ ElevenLabs API key not found. Audio features will be limited.');
    } else {
      console.log('🎵 AudioService initialized with ElevenLabs integration');
    }
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }

  // Force stop all audio instances
  private forceStopAll(): void {
    console.log('🛑 Force stopping all audio instances');
    
    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentAudio.src) {
        URL.revokeObjectURL(this.currentAudio.src);
        this.currentAudio.src = '';
      }
      this.currentAudio = null;
    }

    // Stop all queued audio
    this.audioQueue.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
        audio.src = '';
      }
    });
    this.audioQueue = [];
    
    this.isPlaying = false;
  }

  async generateSpeech(config: AudioConfig): Promise<Blob> {
    if (!this.isInitialized) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log('🎤 Generating speech with ElevenLabs:', {
      voiceId: config.voiceId,
      textLength: config.text.length
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: config.text,
          model_id: config.modelId || 'eleven_turbo_v2_5',
          voice_settings: {
            stability: config.stability || 0.75,
            similarity_boost: config.similarityBoost || 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', response.status, errorText);
      throw new Error(`Audio generation failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Speech generated successfully');
    return await response.blob();
  }

  async generateSoundEffect(config: SoundEffectConfig): Promise<Blob> {
    if (!this.isInitialized) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log('🔊 Generating sound effect with ElevenLabs:', config.prompt);

    const response = await fetch(
      'https://api.elevenlabs.io/v1/sound-generation',
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: config.prompt,
          duration_seconds: config.duration || 3.0,
          prompt_influence: 0.3
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs Sound Generation API error:', response.status, errorText);
      throw new Error(`Sound effect generation failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Sound effect generated successfully');
    return await response.blob();
  }

  async playAudio(config: AudioConfig): Promise<void> {
    try {
      // CRITICAL: Force stop all existing audio before starting new one
      this.forceStopAll();

      console.log('🎵 Starting new audio playback');
      this.isPlaying = true;

      const audioBlob = await this.generateSpeech(config);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = Math.max(0, Math.min(1, config.volume || 1));
      this.currentAudio.loop = config.loop || false;

      // Set up event listeners for proper cleanup
      this.currentAudio.addEventListener('ended', () => {
        console.log('🎵 Audio playback ended');
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.isPlaying = false;
      });

      this.currentAudio.addEventListener('error', (e) => {
        console.error('❌ Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this.isPlaying = false;
      });

      // Ensure only one audio plays at a time
      this.currentAudio.addEventListener('loadstart', () => {
        console.log('🎵 Audio loading started - ensuring single playback');
      });

      await this.currentAudio.play();
      console.log('🎵 Audio playback started successfully');
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  async playSoundEffect(config: SoundEffectConfig): Promise<void> {
    try {
      // Don't interrupt main audio for sound effects, but limit concurrent effects
      if (this.audioQueue.length > 2) {
        console.log('🔊 Too many sound effects queued, skipping');
        return;
      }

      const audioBlob = await this.generateSoundEffect(config);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0, Math.min(1, config.volume || 0.5));
      audio.loop = config.loop || false;

      // Add to queue for tracking
      this.audioQueue.push(audio);

      // Clean up when finished
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        const index = this.audioQueue.indexOf(audio);
        if (index > -1) {
          this.audioQueue.splice(index, 1);
        }
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(audioUrl);
        const index = this.audioQueue.indexOf(audio);
        if (index > -1) {
          this.audioQueue.splice(index, 1);
        }
      });

      await audio.play();
      console.log('🔊 Sound effect playback started');
    } catch (error) {
      console.error('❌ Sound effect playback failed:', error);
      throw error;
    }
  }

  pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      console.log('⏸️ Audio paused');
    }
  }

  resume(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
      console.log('▶️ Audio resumed');
    }
  }

  stop(): void {
    console.log('⏹️ Stopping all audio');
    this.forceStopAll();
  }

  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
      console.log('🔊 Volume set to:', volume);
    }
  }

  isSpeaking(): boolean {
    return this.isPlaying && this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended;
  }

  isPaused(): boolean {
    return this.currentAudio && this.currentAudio.paused && this.currentAudio.currentTime > 0;
  }

  getCurrentTime(): number {
    return this.currentAudio?.currentTime || 0;
  }

  getDuration(): number {
    return this.currentAudio?.duration || 0;
  }

  // Method to check if any audio is currently active
  hasActiveAudio(): boolean {
    return this.isPlaying || this.audioQueue.length > 0;
  }

  // Emergency cleanup method
  emergencyStop(): void {
    console.log('🚨 Emergency stop - clearing all audio');
    this.forceStopAll();
    
    // Additional cleanup for any rogue audio elements
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      if (audio.src) {
        audio.src = '';
      }
    });
  }
}

export const audioService = new AudioService();

// Export for debugging and emergency cleanup
(window as any).audioService = audioService;
(window as any).emergencyStopAudio = () => audioService.emergencyStop();
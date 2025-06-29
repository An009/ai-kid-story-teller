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
          model_id: config.modelId || 'eleven_monolingual_v1',
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
      // Stop any currently playing audio
      this.stop();

      const audioBlob = await this.generateSpeech(config);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = Math.max(0, Math.min(1, config.volume || 1));
      this.currentAudio.loop = config.loop || false;

      // Clean up URL when audio ends
      this.currentAudio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });

      await this.currentAudio.play();
      console.log('🎵 Audio playback started');
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
      throw error;
    }
  }

  async playSoundEffect(config: SoundEffectConfig): Promise<void> {
    try {
      const audioBlob = await this.generateSoundEffect(config);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0, Math.min(1, config.volume || 0.5));
      audio.loop = config.loop || false;

      // Clean up URL when audio ends
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
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
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      
      // Clean up the audio source
      if (this.currentAudio.src) {
        URL.revokeObjectURL(this.currentAudio.src);
        this.currentAudio.src = '';
      }
      
      this.currentAudio = null;
      console.log('⏹️ Audio stopped');
    }
  }

  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
      console.log('🔊 Volume set to:', volume);
    }
  }

  isSpeaking(): boolean {
    return this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended;
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
}

export const audioService = new AudioService();

// Export for debugging
(window as any).audioService = audioService;
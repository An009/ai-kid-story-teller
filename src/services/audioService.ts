interface AudioConfig {
  voiceId: string;
  modelId: string;
  text: string;
  volume?: number;
  loop?: boolean;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface AudioDiagnostics {
  apiKeyValid: boolean;
  networkConnected: boolean;
  audioContextSupported: boolean;
  lastError: string | null;
  audioQuality: 'low' | 'medium' | 'high';
  bufferHealth: number;
}

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private apiKey: string;
  private isInitialized: boolean = false;
  private audioQueue: HTMLAudioElement[] = [];
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private duration: number = 0;
  private diagnostics: AudioDiagnostics;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.isInitialized = !!this.apiKey;
    
    this.diagnostics = {
      apiKeyValid: this.isInitialized,
      networkConnected: navigator.onLine,
      audioContextSupported: 'AudioContext' in window || 'webkitAudioContext' in window,
      lastError: null,
      audioQuality: 'medium',
      bufferHealth: 100
    };

    if (!this.apiKey) {
      console.warn('⚠️ ElevenLabs API key not found. Audio features will be limited.');
      this.diagnostics.lastError = 'API key not configured';
    } else {
      console.log('🎵 AudioService initialized with ElevenLabs integration');
      this.initializeAudioContext();
    }

    // Monitor network status
    window.addEventListener('online', () => {
      this.diagnostics.networkConnected = true;
      console.log('🌐 Network connection restored');
    });

    window.addEventListener('offline', () => {
      this.diagnostics.networkConnected = false;
      console.warn('🌐 Network connection lost');
    });
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🎵 Audio context initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize audio context:', error);
      this.diagnostics.audioContextSupported = false;
      this.diagnostics.lastError = 'Audio context initialization failed';
    }
  }

  isServiceReady(): boolean {
    return this.isInitialized && this.diagnostics.networkConnected;
  }

  getDiagnostics(): AudioDiagnostics {
    return { ...this.diagnostics };
  }

  // Enhanced error handling with specific error types
  private handleApiError(response: Response, errorText: string): Error {
    let errorMessage = 'Audio generation failed';
    
    switch (response.status) {
      case 401:
        errorMessage = 'Invalid API key. Please check your ElevenLabs API key configuration.';
        this.diagnostics.apiKeyValid = false;
        break;
      case 403:
        errorMessage = 'API access forbidden. Check your ElevenLabs subscription and permissions.';
        break;
      case 429:
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        break;
      case 422:
        errorMessage = 'Invalid voice settings. Please check voice configuration.';
        break;
      case 500:
        errorMessage = 'ElevenLabs server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'ElevenLabs service temporarily unavailable. Please try again later.';
        break;
      default:
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail?.message || errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
    }

    this.diagnostics.lastError = errorMessage;
    return new Error(errorMessage);
  }

  // Optimized voice settings for different scenarios
  private getOptimizedSettings(config: AudioConfig): any {
    const baseSettings = {
      stability: config.stability || 0.75,
      similarity_boost: config.similarityBoost || 0.75,
      style: config.style || 0.0,
      use_speaker_boost: config.useSpeakerBoost !== false
    };

    // Adjust settings based on content length and type
    const textLength = config.text.length;
    
    if (textLength > 2000) {
      // Long content - prioritize consistency
      return {
        ...baseSettings,
        stability: Math.min(baseSettings.stability + 0.1, 1.0),
        similarity_boost: Math.max(baseSettings.similarity_boost - 0.1, 0.0)
      };
    } else if (textLength < 100) {
      // Short content - allow more expression
      return {
        ...baseSettings,
        style: Math.min(baseSettings.style + 0.2, 1.0)
      };
    }

    return baseSettings;
  }

  // Force stop all audio instances with comprehensive cleanup
  private forceStopAll(): void {
    console.log('🛑 Force stopping all audio instances');
    
    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentAudio.src && this.currentAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(this.currentAudio.src);
      }
      this.currentAudio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
      this.currentAudio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.currentAudio.removeEventListener('ended', this.handleEnded);
      this.currentAudio.removeEventListener('error', this.handleError);
      this.currentAudio = null;
    }

    // Stop all queued audio
    this.audioQueue.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
    });
    this.audioQueue = [];
    
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.retryCount = 0;
  }

  // Event handlers for better memory management
  private handleLoadedMetadata = () => {
    this.duration = this.currentAudio?.duration || 0;
    this.diagnostics.bufferHealth = 100;
    console.log('🎵 Audio duration:', this.duration);
  };

  private handleTimeUpdate = () => {
    this.currentTime = this.currentAudio?.currentTime || 0;
    
    // Calculate buffer health
    if (this.currentAudio && this.currentAudio.buffered.length > 0) {
      const buffered = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1);
      this.diagnostics.bufferHealth = Math.min((buffered / this.duration) * 100, 100);
    }
  };

  private handleEnded = () => {
    console.log('🎵 Audio playback ended');
    this.cleanup();
  };

  private handleError = (e: Event) => {
    console.error('❌ Audio playback error:', e);
    const error = (e.target as HTMLAudioElement)?.error;
    let errorMessage = 'Audio playback failed';
    
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Audio playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error during audio playback';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Audio decoding error - file may be corrupted';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Audio format not supported';
          break;
      }
    }
    
    this.diagnostics.lastError = errorMessage;
    this.cleanup();
  };

  private cleanup(): void {
    if (this.currentAudio?.src && this.currentAudio.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentAudio.src);
    }
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
  }

  async generateSpeech(config: AudioConfig): Promise<Blob> {
    if (!this.isInitialized) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!this.diagnostics.networkConnected) {
      throw new Error('No network connection available');
    }

    console.log('🎤 Generating speech with ElevenLabs:', {
      voiceId: config.voiceId,
      textLength: config.text.length,
      model: config.modelId
    });

    const optimizedSettings = this.getOptimizedSettings(config);

    const requestBody = {
      text: config.text,
      model_id: config.modelId || 'eleven_turbo_v2_5',
      voice_settings: optimizedSettings
    };

    console.log('📋 Request settings:', optimizedSettings);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', response.status, errorText);
      throw this.handleApiError(response, errorText);
    }

    const audioBlob = await response.blob();
    
    // Validate audio blob
    if (audioBlob.size === 0) {
      throw new Error('Received empty audio data from ElevenLabs');
    }

    console.log('✅ Speech generated successfully, size:', audioBlob.size, 'bytes');
    this.diagnostics.lastError = null;
    this.diagnostics.apiKeyValid = true;
    
    return audioBlob;
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

      // Set up event listeners with proper cleanup
      this.currentAudio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
      this.currentAudio.addEventListener('timeupdate', this.handleTimeUpdate);
      this.currentAudio.addEventListener('ended', this.handleEnded);
      this.currentAudio.addEventListener('error', this.handleError);

      // Resume audio context if suspended (required for some browsers)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      await this.currentAudio.play();
      console.log('🎵 Audio playback started successfully');
      this.retryCount = 0;
      
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;
      
      // Retry logic for transient errors
      if (this.retryCount < this.maxRetries && 
          (error instanceof Error && 
           (error.message.includes('network') || error.message.includes('timeout')))) {
        this.retryCount++;
        console.log(`🔄 Retrying audio playback (${this.retryCount}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.playAudio(config);
      }
      
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
      this.currentAudio.play().catch(error => {
        console.error('❌ Resume failed:', error);
        this.diagnostics.lastError = 'Failed to resume audio playback';
      });
      console.log('▶️ Audio resumed');
    }
  }

  stop(): void {
    console.log('⏹️ Stopping all audio');
    this.forceStopAll();
  }

  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = clampedVolume;
      console.log('🔊 Volume set to:', clampedVolume);
    }
  }

  isSpeaking(): boolean {
    return this.isPlaying && this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended;
  }

  isPaused(): boolean {
    return this.currentAudio && this.currentAudio.paused && this.currentAudio.currentTime > 0;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getDuration(): number {
    return this.duration;
  }

  // Method to check if any audio is currently active
  hasActiveAudio(): boolean {
    return this.isPlaying || this.audioQueue.length > 0;
  }

  // Test API connectivity and settings
  async testApiConnection(): Promise<{ success: boolean; error?: string; latency?: number }> {
    if (!this.isInitialized) {
      return { success: false, error: 'API key not configured' };
    }

    const startTime = Date.now();
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          error: `API test failed: ${response.status} ${response.statusText}`,
          latency 
        };
      }

      this.diagnostics.apiKeyValid = true;
      this.diagnostics.lastError = null;
      
      return { success: true, latency };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - startTime
      };
    }
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
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
        audio.src = '';
      }
    });

    // Reset diagnostics
    this.diagnostics.lastError = null;
    this.diagnostics.bufferHealth = 100;
  }

  // Get recommended settings based on content analysis
  getRecommendedSettings(text: string): Partial<AudioConfig> {
    const wordCount = text.split(' ').length;
    const hasDialogue = text.includes('"') || text.includes("'");
    const hasEmphasis = text.includes('!') || text.includes('?');
    
    let stability = 0.75;
    let similarityBoost = 0.75;
    let style = 0.0;
    
    // Adjust for content characteristics
    if (wordCount > 500) {
      stability += 0.1; // More stability for longer content
    }
    
    if (hasDialogue) {
      style += 0.2; // More expressive for dialogue
      similarityBoost -= 0.1;
    }
    
    if (hasEmphasis) {
      style += 0.1; // Slight increase for emphasis
    }
    
    return {
      stability: Math.min(stability, 1.0),
      similarityBoost: Math.max(similarityBoost, 0.0),
      style: Math.min(style, 1.0),
      useSpeakerBoost: true
    };
  }
}

export const audioService = new AudioService();

// Export for debugging and emergency cleanup
(window as any).audioService = audioService;
(window as any).emergencyStopAudio = () => audioService.emergencyStop();
(window as any).testAudioConnection = () => audioService.testApiConnection();
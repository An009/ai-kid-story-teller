import { audioService } from './audioService';

interface SoundEffectMapping {
  [key: string]: {
    prompt: string;
    duration: number;
    volume: number;
  };
}

interface ThematicSoundEffects {
  [theme: string]: {
    [setting: string]: SoundEffectMapping;
  };
}

// Thematic sound effects mapping for different story combinations
const thematicSoundEffects: ThematicSoundEffects = {
  adventure: {
    forest: {
      ambient: {
        prompt: "Gentle forest ambience with birds chirping, leaves rustling, and a distant stream flowing",
        duration: 10,
        volume: 0.3
      },
      action: {
        prompt: "Exciting adventure music with footsteps on forest floor, branches snapping",
        duration: 5,
        volume: 0.4
      },
      discovery: {
        prompt: "Magical discovery sound with twinkling chimes and wonder",
        duration: 3,
        volume: 0.5
      }
    },
    ocean: {
      ambient: {
        prompt: "Peaceful ocean waves with seagulls and gentle water sounds",
        duration: 10,
        volume: 0.3
      },
      action: {
        prompt: "Underwater adventure with bubbles, swimming sounds, and dolphin calls",
        duration: 5,
        volume: 0.4
      },
      discovery: {
        prompt: "Magical underwater discovery with mystical whale songs",
        duration: 3,
        volume: 0.5
      }
    },
    space: {
      ambient: {
        prompt: "Cosmic space ambience with distant stars and gentle spacecraft hum",
        duration: 10,
        volume: 0.3
      },
      action: {
        prompt: "Space adventure with rocket engines and cosmic energy",
        duration: 5,
        volume: 0.4
      },
      discovery: {
        prompt: "Alien discovery with otherworldly chimes and cosmic wonder",
        duration: 3,
        volume: 0.5
      }
    }
  },
  friendship: {
    village: {
      ambient: {
        prompt: "Cozy village atmosphere with gentle wind, distant laughter, and peaceful sounds",
        duration: 10,
        volume: 0.3
      },
      heartwarming: {
        prompt: "Warm friendship moment with soft piano and gentle strings",
        duration: 4,
        volume: 0.4
      },
      celebration: {
        prompt: "Joyful celebration with happy music and community sounds",
        duration: 5,
        volume: 0.5
      }
    },
    castle: {
      ambient: {
        prompt: "Royal castle atmosphere with gentle echoes and distant music",
        duration: 10,
        volume: 0.3
      },
      heartwarming: {
        prompt: "Royal friendship moment with elegant harp and warm strings",
        duration: 4,
        volume: 0.4
      },
      celebration: {
        prompt: "Royal celebration with fanfare and joyful court music",
        duration: 5,
        volume: 0.5
      }
    }
  },
  magic: {
    forest: {
      ambient: {
        prompt: "Enchanted forest with magical sparkles, mystical wind, and fairy sounds",
        duration: 10,
        volume: 0.3
      },
      spellcasting: {
        prompt: "Magic spell being cast with mystical energy and sparkling sounds",
        duration: 3,
        volume: 0.5
      },
      transformation: {
        prompt: "Magical transformation with shimmering energy and wonder",
        duration: 4,
        volume: 0.6
      }
    },
    castle: {
      ambient: {
        prompt: "Magical castle with echoing spells, mystical energy, and ancient magic",
        duration: 10,
        volume: 0.3
      },
      spellcasting: {
        prompt: "Powerful wizard casting spells with deep magical resonance",
        duration: 3,
        volume: 0.5
      },
      transformation: {
        prompt: "Grand magical transformation with powerful energy waves",
        duration: 4,
        volume: 0.6
      }
    }
  }
};

class SoundService {
  private currentAmbientSound: HTMLAudioElement | null = null;
  private soundEffectQueue: HTMLAudioElement[] = [];
  private masterVolume: number = 0.7;
  private isEnabled: boolean = true;

  constructor() {
    console.log('🔊 SoundService initialized');
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
    console.log('🔊 Sound effects', enabled ? 'enabled' : 'disabled');
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update volume for currently playing sounds
    if (this.currentAmbientSound) {
      this.currentAmbientSound.volume = this.masterVolume * 0.3;
    }
    
    this.soundEffectQueue.forEach(audio => {
      audio.volume = this.masterVolume * 0.5;
    });
    
    console.log('🔊 Master volume set to:', this.masterVolume);
  }

  async playThematicSound(theme: string, setting: string, type: string = 'ambient'): Promise<void> {
    if (!this.isEnabled || !audioService.isServiceReady()) {
      console.log('🔇 Sound service disabled or not ready');
      return;
    }

    try {
      const soundConfig = thematicSoundEffects[theme]?.[setting]?.[type];
      if (!soundConfig) {
        console.warn('⚠️ No sound configuration found for:', { theme, setting, type });
        return;
      }

      console.log('🎵 Playing thematic sound:', { theme, setting, type });

      const effectConfig = {
        prompt: soundConfig.prompt,
        duration: soundConfig.duration,
        volume: this.masterVolume * soundConfig.volume,
        loop: type === 'ambient'
      };

      if (type === 'ambient') {
        // Stop current ambient sound before playing new one
        this.stopAmbient();
        
        // Generate and play ambient sound
        const audioBlob = await audioService.generateSoundEffect(effectConfig);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        this.currentAmbientSound = new Audio(audioUrl);
        this.currentAmbientSound.volume = effectConfig.volume;
        this.currentAmbientSound.loop = true;
        
        this.currentAmbientSound.addEventListener('ended', () => {
          URL.revokeObjectURL(audioUrl);
        });
        
        await this.currentAmbientSound.play();
      } else {
        // Play one-time sound effect
        await audioService.playSoundEffect(effectConfig);
      }

    } catch (error) {
      console.error('❌ Failed to play thematic sound:', error);
    }
  }

  async playStoryTransition(fromTheme: string, toTheme: string): Promise<void> {
    if (!this.isEnabled || !audioService.isServiceReady()) return;

    try {
      const transitionConfig = {
        prompt: `Smooth musical transition from ${fromTheme} story to ${toTheme} story with gentle fade`,
        duration: 2,
        volume: this.masterVolume * 0.4
      };

      await audioService.playSoundEffect(transitionConfig);
    } catch (error) {
      console.error('❌ Failed to play story transition:', error);
    }
  }

  async playEmotionalCue(emotion: string, intensity: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    if (!this.isEnabled || !audioService.isServiceReady()) return;

    try {
      const intensityMap = {
        low: 'subtle',
        medium: 'moderate',
        high: 'dramatic'
      };

      const emotionConfig = {
        prompt: `${intensityMap[intensity]} ${emotion} emotional music cue for children's story`,
        duration: 3,
        volume: this.masterVolume * (intensity === 'high' ? 0.6 : intensity === 'medium' ? 0.4 : 0.3)
      };

      await audioService.playSoundEffect(emotionConfig);
    } catch (error) {
      console.error('❌ Failed to play emotional cue:', error);
    }
  }

  stopAmbient(): void {
    if (this.currentAmbientSound) {
      this.currentAmbientSound.pause();
      this.currentAmbientSound.currentTime = 0;
      
      if (this.currentAmbientSound.src) {
        URL.revokeObjectURL(this.currentAmbientSound.src);
      }
      
      this.currentAmbientSound = null;
      console.log('⏹️ Ambient sound stopped');
    }
  }

  stopAll(): void {
    this.stopAmbient();
    
    // Stop all sound effects
    this.soundEffectQueue.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
    });
    
    this.soundEffectQueue = [];
    console.log('⏹️ All sounds stopped');
  }

  fadeOut(duration: number = 2000): void {
    const fadeAudio = (audio: HTMLAudioElement) => {
      const startVolume = audio.volume;
      const fadeStep = startVolume / (duration / 100);
      
      const fadeInterval = setInterval(() => {
        if (audio.volume > fadeStep) {
          audio.volume -= fadeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, 100);
    };

    if (this.currentAmbientSound) {
      fadeAudio(this.currentAmbientSound);
    }
    
    this.soundEffectQueue.forEach(fadeAudio);
  }

  // Get available sound types for a theme/setting combination
  getAvailableSounds(theme: string, setting: string): string[] {
    const sounds = thematicSoundEffects[theme]?.[setting];
    return sounds ? Object.keys(sounds) : [];
  }

  // Check if service is ready
  isReady(): boolean {
    return audioService.isServiceReady() && this.isEnabled;
  }
}

export const soundService = new SoundService();

// Export for debugging
(window as any).soundService = soundService;
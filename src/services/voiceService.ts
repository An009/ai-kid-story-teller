import { audioService } from './audioService';

export interface VoiceCharacteristics {
  elevenLabsVoiceId: string;
  elevenLabsModelId: string;
  stability: number;
  similarityBoost: number;
  style?: number;
  useSpeakerBoost?: boolean;
  volume: number;
  emphasis?: {
    words: string[];
    pitchMultiplier: number;
    rateMultiplier: number;
  };
}

export interface VoicePersonality {
  id: string;
  name: string;
  description: string;
  characteristics: VoiceCharacteristics;
  samplePhrases: string[];
  mannerisms: string[];
  category: 'child' | 'adult' | 'character' | 'narrator';
  gender: 'male' | 'female' | 'neutral';
}

export const voicePersonalities: Record<string, VoicePersonality> = {
  cheerfulChild: {
    id: 'cheerfulChild',
    name: 'Cheerful Child',
    description: 'A bright, enthusiastic young voice with boundless energy',
    category: 'child',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - clear, youthful
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.8,
      similarityBoost: 0.8,
      style: 0.2,
      useSpeakerBoost: true,
      volume: 0.9,
      emphasis: {
        words: ['wow', 'amazing', 'cool', 'awesome', 'wonderful', 'exciting'],
        pitchMultiplier: 1.6,
        rateMultiplier: 0.8
      }
    },
    samplePhrases: [
      "Oh wow! This is the best story ever!",
      "Can we read another one? Please, please, please?",
      "I love adventures! They are so exciting!"
    ],
    mannerisms: [
      'Enthusiastic and energetic delivery',
      'Emphasizes exciting words with higher pitch',
      'Speaks quickly when excited',
      'Uses clear, joyful pronunciation'
    ]
  },

  regalPrincess: {
    id: 'regalPrincess',
    name: 'Regal Princess',
    description: 'An elegant, refined voice with perfect pronunciation and grace',
    category: 'character',
    gender: 'female',
    characteristics: {
      elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - elegant, refined
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.9,
      similarityBoost: 0.7,
      style: 0.1,
      useSpeakerBoost: true,
      volume: 0.8,
      emphasis: {
        words: ['royal', 'magnificent', 'elegant', 'gracious', 'noble', 'beautiful'],
        pitchMultiplier: 1.1,
        rateMultiplier: 0.7
      }
    },
    samplePhrases: [
      "Good evening, dear friends. It is my honor to share this tale with you.",
      "One must always remember the importance of kindness and grace.",
      "In the royal gardens, where roses bloom eternal and dreams come true."
    ],
    mannerisms: [
      'Speaks with measured, deliberate pace',
      'Perfect enunciation of every syllable',
      'Slight pause before important words',
      'Maintains dignified tone throughout'
    ]
  },

  elderlyWise: {
    id: 'elderlyWise',
    name: 'Elderly Storyteller',
    description: 'A wise, gentle voice with years of experience and warmth',
    category: 'narrator',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'ErXwobaYiN019PkySvjV', // Antoni - warm, mature
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.9,
      similarityBoost: 0.6,
      style: 0.0,
      useSpeakerBoost: true,
      volume: 0.7,
      emphasis: {
        words: ['remember', 'wisdom', 'long ago', 'experience', 'learned', 'important'],
        pitchMultiplier: 0.9,
        rateMultiplier: 0.6
      }
    },
    samplePhrases: [
      "Ah, yes... I remember a tale from long, long ago.",
      "Listen carefully, young ones, for this story holds great wisdom.",
      "In my many years, I have learned that true magic comes from the heart."
    ],
    mannerisms: [
      'Gentle, grandfatherly tone',
      'Thoughtful pauses mid-sentence',
      'Warm, caring delivery',
      'Emphasizes life lessons with slower pace'
    ]
  },

  boomingWizard: {
    id: 'boomingWizard',
    name: 'Booming Wizard',
    description: 'A powerful voice with deep, resonant tones and magical authority',
    category: 'character',
    gender: 'male',
    characteristics: {
      elevenLabsVoiceId: 'VR6AewLTigWG4xSOukaG', // Arnold - deep, authoritative
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.8,
      similarityBoost: 0.8,
      style: 0.3,
      useSpeakerBoost: true,
      volume: 1.0,
      emphasis: {
        words: ['magic', 'spell', 'enchantment', 'power', 'ancient', 'mystical', 'behold'],
        pitchMultiplier: 0.5,
        rateMultiplier: 0.5
      }
    },
    samplePhrases: [
      "Behold! The ancient magic awakens from its slumber!",
      "By the power of the seven stars, I command thee!",
      "Young apprentice, the secrets of magic are not to be taken lightly."
    ],
    mannerisms: [
      'Deep, resonant bass tones',
      'Dramatic pauses before magical words',
      'Authoritative, commanding presence',
      'Rich, theatrical delivery'
    ]
  },

  squeakyFairy: {
    id: 'squeakyFairy',
    name: 'Excited Fairy',
    description: 'A tiny, high-pitched voice with infectious enthusiasm',
    category: 'character',
    gender: 'female',
    characteristics: {
      elevenLabsVoiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - light, playful
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.7,
      similarityBoost: 0.9,
      style: 0.4,
      useSpeakerBoost: true,
      volume: 0.8,
      emphasis: {
        words: ['sparkle', 'glitter', 'magic', 'tiny', 'flutter', 'shimmer', 'wonderful'],
        pitchMultiplier: 1.9,
        rateMultiplier: 1.6
      }
    },
    samplePhrases: [
      "Oh my! Look at all the sparkly magic dust!",
      "Flutter, flutter! I can make flowers bloom with just a touch!",
      "Oh my stars! This is the most magical day ever!"
    ],
    mannerisms: [
      'Very high, bell-like voice',
      'Quick, excited speech patterns',
      'Light, airy delivery',
      'Emphasizes magical words with extra pitch'
    ]
  },

  adventurousCaptain: {
    id: 'adventurousCaptain',
    name: 'Adventurous Captain',
    description: 'A confident sea captain with clear, commanding voice',
    category: 'character',
    gender: 'male',
    characteristics: {
      elevenLabsVoiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam - confident, clear
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.8,
      similarityBoost: 0.7,
      style: 0.2,
      useSpeakerBoost: true,
      volume: 0.9,
      emphasis: {
        words: ['adventure', 'treasure', 'ship', 'sea', 'journey', 'brave', 'courage'],
        pitchMultiplier: 0.7,
        rateMultiplier: 0.8
      }
    },
    samplePhrases: [
      "Ahoy there, friends! Gather around for a tale of the seven seas!",
      "Every great adventure begins with a single step onto the ship!",
      "The treasure we seek is not gold, but the friends we make along the way!"
    ],
    mannerisms: [
      'Confident, commanding voice',
      'Clear, nautical delivery',
      'Inspiring and motivational tone',
      'Strong, adventurous spirit'
    ]
  },

  friendlyRobot: {
    id: 'friendlyRobot',
    name: 'Friendly Robot',
    description: 'A helpful AI companion with precise pronunciation and warmth',
    category: 'character',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - clear, neutral
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.9,
      similarityBoost: 0.6,
      style: 0.0,
      useSpeakerBoost: true,
      volume: 0.8,
      emphasis: {
        words: ['compute', 'analyze', 'process', 'data', 'system', 'function', 'helpful'],
        pitchMultiplier: 1.0,
        rateMultiplier: 0.9
      }
    },
    samplePhrases: [
      "Story processing complete. Initiating narrative sequence.",
      "According to my calculations, this adventure has a ninety-nine percent chance of being amazing!",
      "Happiness levels at maximum capacity! Ready to begin story time!"
    ],
    mannerisms: [
      'Precise, measured speech patterns',
      'Technical terminology mixed with emotion',
      'Consistent rhythm and timing',
      'Warm, helpful delivery'
    ]
  },

  wiseStoryteller: {
    id: 'wiseStoryteller',
    name: 'Wise Storyteller',
    description: 'A masterful narrator with perfect pacing and dramatic flair',
    category: 'narrator',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh - warm, narrative
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.8,
      similarityBoost: 0.7,
      style: 0.1,
      useSpeakerBoost: true,
      volume: 0.8,
      emphasis: {
        words: ['once upon a time', 'long ago', 'legend', 'tale', 'story', 'moral', 'remember'],
        pitchMultiplier: 1.1,
        rateMultiplier: 0.8
      }
    },
    samplePhrases: [
      "Once upon a time, in a land far, far away...",
      "And so, dear listeners, our tale begins with a single act of kindness.",
      "The moral of our story teaches us that courage comes in many forms."
    ],
    mannerisms: [
      'Perfect dramatic timing',
      'Rich, warm narrative voice',
      'Builds suspense with pacing',
      'Emphasizes story structure and morals'
    ]
  },

  playfulFriend: {
    id: 'playfulFriend',
    name: 'Playful Friend',
    description: 'A fun, energetic voice perfect for silly stories and games',
    category: 'child',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - versatile, friendly
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.7,
      similarityBoost: 0.8,
      style: 0.3,
      useSpeakerBoost: true,
      volume: 0.9,
      emphasis: {
        words: ['fun', 'silly', 'funny', 'laugh', 'play', 'game', 'giggle'],
        pitchMultiplier: 1.3,
        rateMultiplier: 1.2
      }
    },
    samplePhrases: [
      "Hey there, friend! Ready for some fun and silly adventures?",
      "This story is going to make you laugh and smile so much!",
      "Let's play along with the characters and see what happens next!"
    ],
    mannerisms: [
      'Playful, energetic delivery',
      'Friendly, approachable tone',
      'Emphasizes fun and humor',
      'Interactive, engaging style'
    ]
  },

  calmNatureGuide: {
    id: 'calmNatureGuide',
    name: 'Calm Nature Guide',
    description: 'A peaceful, soothing voice like a gentle breeze through trees',
    category: 'narrator',
    gender: 'neutral',
    characteristics: {
      elevenLabsVoiceId: 'ErXwobaYiN019PkySvjV', // Antoni - calm, soothing
      elevenLabsModelId: 'eleven_turbo_v2_5',
      stability: 0.9,
      similarityBoost: 0.6,
      style: 0.0,
      useSpeakerBoost: true,
      volume: 0.7,
      emphasis: {
        words: ['nature', 'peaceful', 'gentle', 'forest', 'stream', 'whisper', 'calm'],
        pitchMultiplier: 0.9,
        rateMultiplier: 0.7
      }
    },
    samplePhrases: [
      "Listen... can you hear the gentle whisper of the wind through the trees?",
      "In the quiet of the forest, every creature has a story to tell.",
      "Take a deep breath and let the peaceful magic of nature fill your heart."
    ],
    mannerisms: [
      'Soft, meditative tone',
      'Long, peaceful pauses',
      'Emphasizes natural sounds and imagery',
      'Calming, therapeutic delivery'
    ]
  }
};

class VoiceService {
  private isInitialized = false;
  private isServiceReady = false;

  constructor() {
    this.isServiceReady = audioService.isServiceReady();
    
    if (this.isServiceReady) {
      console.log('🎤 VoiceService initialized with ElevenLabs integration');
      this.isInitialized = true;
    } else {
      console.warn('⚠️ ElevenLabs API key not found. Voice features will be disabled.');
    }
  }

  private preprocessText(text: string, personality: VoicePersonality): string {
    let processedText = text;

    // Add emphasis to specific words
    if (personality.characteristics.emphasis) {
      personality.characteristics.emphasis.words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processedText = processedText.replace(regex, `${word}`);
      });
    }

    // Character-specific modifications
    switch (personality.id) {
      case 'friendlyRobot':
        // Add subtle robot-like pauses
        processedText = processedText.replace(/\./g, '. *pause*');
        break;
      
      case 'playfulFriend':
        // Add enthusiasm
        processedText = processedText.replace(/!/g, '!!');
        break;
        
      case 'squeakyFairy':
        // Add fairy-like expressions
        processedText = processedText.replace(/magic/gi, '*magical* magic');
        break;
    }

    return processedText;
  }

  async speak(text: string, personalityId: string = 'wiseStoryteller'): Promise<void> {
    if (!this.isServiceReady) {
      throw new Error('ElevenLabs service is not available. Please check your API key configuration.');
    }

    const personality = voicePersonalities[personalityId];
    if (!personality) {
      throw new Error(`Voice personality '${personalityId}' not found`);
    }

    // Stop any current speech
    this.stop();

    try {
      console.log('🎤 Starting ElevenLabs speech synthesis for:', personalityId);
      
      const audioConfig = {
        voiceId: personality.characteristics.elevenLabsVoiceId,
        modelId: personality.characteristics.elevenLabsModelId,
        text: this.preprocessText(text, personality),
        volume: personality.characteristics.volume,
        stability: personality.characteristics.stability,
        similarityBoost: personality.characteristics.similarityBoost
      };

      await audioService.playAudio(audioConfig);
      console.log('✅ ElevenLabs speech completed for personality:', personalityId);
    } catch (error) {
      console.error('❌ ElevenLabs speech failed:', error);
      throw error;
    }
  }

  pause(): void {
    if (this.isServiceReady) {
      audioService.pause();
    }
  }

  resume(): void {
    if (this.isServiceReady) {
      audioService.resume();
    }
  }

  stop(): void {
    if (this.isServiceReady) {
      audioService.stop();
    }
  }

  isSpeaking(): boolean {
    return this.isServiceReady ? audioService.isSpeaking() : false;
  }

  isPaused(): boolean {
    return this.isServiceReady ? audioService.isPaused() : false;
  }

  getCurrentTime(): number {
    return this.isServiceReady ? audioService.getCurrentTime() : 0;
  }

  getDuration(): number {
    return this.isServiceReady ? audioService.getDuration() : 0;
  }

  getAvailablePersonalities(): VoicePersonality[] {
    return Object.values(voicePersonalities);
  }

  getPersonality(id: string): VoicePersonality | undefined {
    return voicePersonalities[id];
  }

  // Test a voice personality with a sample phrase
  async testVoice(personalityId: string): Promise<void> {
    const personality = voicePersonalities[personalityId];
    if (!personality) {
      throw new Error(`Personality '${personalityId}' not found`);
    }

    const samplePhrase = personality.samplePhrases[0] || "Hello! This is a test of my voice.";
    return this.speak(samplePhrase, personalityId);
  }

  // Get voice recommendations based on story content
  getRecommendedVoice(storyContent: string, character?: string): string {
    const content = storyContent.toLowerCase();
    
    // Character-based recommendations
    if (character) {
      const char = character.toLowerCase();
      if (char.includes('princess')) return 'regalPrincess';
      if (char.includes('captain') || char.includes('pirate')) return 'adventurousCaptain';
      if (char.includes('wizard') || char.includes('mage')) return 'boomingWizard';
      if (char.includes('fairy')) return 'squeakyFairy';
      if (char.includes('robot')) return 'friendlyRobot';
    }

    // Content-based recommendations
    if (content.includes('forest') || content.includes('nature') || content.includes('peaceful')) {
      return 'calmNatureGuide';
    }
    if (content.includes('magic') || content.includes('spell') || content.includes('enchant')) {
      return 'boomingWizard';
    }
    if (content.includes('adventure') || content.includes('exciting')) {
      return 'cheerfulChild';
    }
    if (content.includes('funny') || content.includes('silly') || content.includes('laugh')) {
      return 'playfulFriend';
    }
    if (content.includes('wise') || content.includes('lesson') || content.includes('moral')) {
      return 'elderlyWise';
    }

    // Default to wise storyteller
    return 'wiseStoryteller';
  }

  // Check if ElevenLabs is available
  isElevenLabsEnabled(): boolean {
    return this.isServiceReady;
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isServiceReady;
  }
}

export const voiceService = new VoiceService();

// Export for debugging
(window as any).voiceService = voiceService;
export interface VoiceCharacteristics {
  rate: number;           // Speaking speed (0.1 to 10)
  pitch: number;          // Voice pitch (0 to 2)
  volume: number;         // Volume level (0 to 1)
  voiceURI?: string;      // Preferred voice URI
  voiceGender?: 'male' | 'female' | 'neutral';
  voiceAge?: 'child' | 'young' | 'adult' | 'elderly';
  accent?: string;        // Accent or dialect
  pauseDuration?: number; // Extra pause between sentences (ms)
  emphasis?: {            // Words to emphasize
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
}

export const voicePersonalities: Record<string, VoicePersonality> = {
  cheerfulChild: {
    id: 'cheerfulChild',
    name: 'Cheerful Child',
    description: 'A bright, enthusiastic young voice with boundless energy',
    characteristics: {
      rate: 1.2,
      pitch: 1.4,
      volume: 0.9,
      voiceGender: 'neutral',
      voiceAge: 'child',
      pauseDuration: 300,
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
    characteristics: {
      rate: 0.8,
      pitch: 1.2,
      volume: 0.8,
      voiceGender: 'female',
      voiceAge: 'young',
      pauseDuration: 500,
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
    characteristics: {
      rate: 0.7,
      pitch: 0.9,
      volume: 0.7,
      voiceGender: 'neutral',
      voiceAge: 'elderly',
      pauseDuration: 800,
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
    characteristics: {
      rate: 0.9,
      pitch: 0.6,
      volume: 1.0,
      voiceGender: 'male',
      voiceAge: 'adult',
      pauseDuration: 600,
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
    characteristics: {
      rate: 1.4,
      pitch: 1.8,
      volume: 0.8,
      voiceGender: 'female',
      voiceAge: 'child',
      pauseDuration: 200,
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
    characteristics: {
      rate: 1.0,
      pitch: 0.8,
      volume: 0.9,
      voiceGender: 'male',
      voiceAge: 'adult',
      pauseDuration: 400,
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
    characteristics: {
      rate: 1.0,
      pitch: 1.1,
      volume: 0.8,
      voiceGender: 'neutral',
      voiceAge: 'adult',
      pauseDuration: 300,
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
    characteristics: {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      voiceGender: 'neutral',
      voiceAge: 'adult',
      pauseDuration: 600,
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
    characteristics: {
      rate: 1.1,
      pitch: 1.2,
      volume: 0.9,
      voiceGender: 'neutral',
      voiceAge: 'young',
      pauseDuration: 350,
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
    characteristics: {
      rate: 0.8,
      pitch: 1.0,
      volume: 0.7,
      voiceGender: 'neutral',
      voiceAge: 'adult',
      pauseDuration: 700,
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
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeVoices();
  }

  private async initializeVoices() {
    if ('speechSynthesis' in window) {
      // Wait for voices to load
      const loadVoices = () => {
        this.availableVoices = speechSynthesis.getVoices();
        this.isInitialized = true;
        console.log('🎤 Voice service initialized with', this.availableVoices.length, 'voices');
      };

      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }
    }
  }

  private findBestVoice(characteristics: VoiceCharacteristics): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) return null;

    // Try to find voice by URI first
    if (characteristics.voiceURI) {
      const exactMatch = this.availableVoices.find(voice => voice.voiceURI === characteristics.voiceURI);
      if (exactMatch) return exactMatch;
    }

    // Prioritize English voices with standard pronunciation
    let candidates = this.availableVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      
      // Prefer English voices
      if (!lang.includes('en')) return false;
      
      // Prefer US or UK English for standard pronunciation
      if (lang.includes('en-us') || lang.includes('en-gb') || lang.includes('en-au')) {
        return true;
      }
      
      // Accept other English variants
      return lang.startsWith('en');
    });

    // If no English voices found, use all voices
    if (candidates.length === 0) {
      candidates = this.availableVoices;
    }

    // Filter by gender and age preferences within English voices
    const filteredCandidates = candidates.filter(voice => {
      const name = voice.name.toLowerCase();
      
      // Gender filtering
      if (characteristics.voiceGender === 'female') {
        if (name.includes('male') && !name.includes('female')) {
          return false;
        }
      } else if (characteristics.voiceGender === 'male') {
        if (name.includes('female') && !name.includes('male')) {
          return false;
        }
      }

      // Age filtering
      if (characteristics.voiceAge === 'child') {
        return name.includes('child') || name.includes('kid') || name.includes('young');
      }

      return true;
    });

    // Use filtered candidates if available, otherwise use all English candidates
    const finalCandidates = filteredCandidates.length > 0 ? filteredCandidates : candidates;

    // Prefer local voices over network voices for better performance
    const localVoices = finalCandidates.filter(voice => voice.localService);
    if (localVoices.length > 0) {
      return localVoices[0];
    }

    // Return the first suitable candidate
    return finalCandidates[0] || this.availableVoices[0];
  }

  private preprocessText(text: string, personality: VoicePersonality): string {
    let processedText = text;

    // Ensure standard English pronunciation - remove any accent modifications
    // Keep text clean and use standard spelling

    // Add emphasis to specific words (but maintain standard pronunciation)
    if (personality.characteristics.emphasis) {
      personality.characteristics.emphasis.words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processedText = processedText.replace(regex, `${word}`);
      });
    }

    // Character-specific modifications (keeping standard English)
    switch (personality.id) {
      case 'friendlyRobot':
        // Add subtle robot-like pauses but keep standard pronunciation
        processedText = `${processedText}`;
        break;
      
      case 'playfulFriend':
        // Add enthusiasm but maintain clear pronunciation
        processedText = processedText.replace(/!/g, '!');
        break;
    }

    return processedText;
  }

  speak(text: string, personalityId: string = 'wiseStoryteller'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      const personality = voicePersonalities[personalityId];
      if (!personality) {
        reject(new Error(`Voice personality '${personalityId}' not found`));
        return;
      }

      const processedText = this.preprocessText(text, personality);
      const utterance = new SpeechSynthesisUtterance(processedText);

      // Apply voice characteristics
      const characteristics = personality.characteristics;
      utterance.rate = characteristics.rate;
      utterance.pitch = characteristics.pitch;
      utterance.volume = characteristics.volume;

      // Find and set the best English voice
      const bestVoice = this.findBestVoice(characteristics);
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 Using voice:', bestVoice.name, 'Language:', bestVoice.lang);
      }

      // Set up event handlers
      utterance.onend = () => {
        console.log('🎤 Speech completed for personality:', personalityId);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🎤 Speech error:', event.error);
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log('🎤 Speech started for personality:', personalityId);
      };

      // Store current utterance and speak
      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
    });
  }

  pause(): void {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      console.log('⏸️ Speech paused');
    }
  }

  resume(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      console.log('▶️ Speech resumed');
    }
  }

  stop(): void {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
      console.log('⏹️ Speech stopped');
    }
  }

  isSpeaking(): boolean {
    return speechSynthesis.speaking;
  }

  isPaused(): boolean {
    return speechSynthesis.paused;
  }

  getAvailablePersonalities(): VoicePersonality[] {
    return Object.values(voicePersonalities);
  }

  getPersonality(id: string): VoicePersonality | undefined {
    return voicePersonalities[id];
  }

  // Test a voice personality with a sample phrase
  testVoice(personalityId: string): Promise<void> {
    const personality = voicePersonalities[personalityId];
    if (!personality) {
      return Promise.reject(new Error(`Personality '${personalityId}' not found`));
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
}

export const voiceService = new VoiceService();

// Export for debugging
(window as any).voiceService = voiceService;
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
    description: 'A bright, enthusiastic 6-10 year old with boundless energy',
    characteristics: {
      rate: 1.3,
      pitch: 1.6,
      volume: 0.9,
      voiceGender: 'neutral',
      voiceAge: 'child',
      pauseDuration: 300,
      emphasis: {
        words: ['wow', 'amazing', 'cool', 'awesome', 'yay', 'hooray'],
        pitchMultiplier: 1.8,
        rateMultiplier: 0.8
      }
    },
    samplePhrases: [
      "Oh wow! This is the BEST story ever!",
      "Can we read another one? Please, please, please?",
      "I love adventures! They're so exciting!"
    ],
    mannerisms: [
      'Giggles between sentences',
      'Emphasizes exciting words with higher pitch',
      'Speaks quickly when excited',
      'Uses lots of exclamation in tone'
    ]
  },

  regalPrincess: {
    id: 'regalPrincess',
    name: 'Regal Princess',
    description: 'An elegant, refined princess with perfect pronunciation and grace',
    characteristics: {
      rate: 0.8,
      pitch: 1.3,
      volume: 0.8,
      voiceGender: 'female',
      voiceAge: 'young',
      accent: 'british',
      pauseDuration: 500,
      emphasis: {
        words: ['royal', 'magnificent', 'elegant', 'gracious', 'noble'],
        pitchMultiplier: 1.2,
        rateMultiplier: 0.7
      }
    },
    samplePhrases: [
      "Good evening, dear subjects. It is my honour to share this tale with you.",
      "One must always remember the importance of kindness and grace.",
      "In the royal gardens, where roses bloom eternal..."
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
    description: 'A wise 70+ year old with gentle tremor and years of wisdom',
    characteristics: {
      rate: 0.7,
      pitch: 0.9,
      volume: 0.7,
      voiceGender: 'neutral',
      voiceAge: 'elderly',
      pauseDuration: 800,
      emphasis: {
        words: ['remember', 'wisdom', 'long ago', 'in my time', 'experience'],
        pitchMultiplier: 0.9,
        rateMultiplier: 0.6
      }
    },
    samplePhrases: [
      "Ah, yes... I remember a tale from long, long ago...",
      "Listen carefully, young ones, for this story holds great wisdom.",
      "In my many years, I have learned that true magic comes from the heart."
    ],
    mannerisms: [
      'Slight vocal tremor on longer words',
      'Thoughtful pauses mid-sentence',
      'Gentle, grandfatherly tone',
      'Emphasizes life lessons with slower pace'
    ]
  },

  boomingWizard: {
    id: 'boomingWizard',
    name: 'Booming Wizard',
    description: 'A powerful wizard with deep, resonant voice and magical authority',
    characteristics: {
      rate: 0.9,
      pitch: 0.6,
      volume: 1.0,
      voiceGender: 'male',
      voiceAge: 'adult',
      pauseDuration: 600,
      emphasis: {
        words: ['magic', 'spell', 'enchantment', 'power', 'ancient', 'mystical'],
        pitchMultiplier: 0.5,
        rateMultiplier: 0.5
      }
    },
    samplePhrases: [
      "BEHOLD! The ancient magic awakens from its slumber!",
      "By the power of the seven stars, I command thee!",
      "Young apprentice, the secrets of magic are not to be taken lightly."
    ],
    mannerisms: [
      'Deep, resonant bass tones',
      'Dramatic pauses before magical words',
      'Authoritative, commanding presence',
      'Slight echo effect on important pronouncements'
    ]
  },

  squeakyFairy: {
    id: 'squeakyFairy',
    name: 'Excited Fairy',
    description: 'A tiny, high-pitched fairy with infectious enthusiasm',
    characteristics: {
      rate: 1.5,
      pitch: 1.9,
      volume: 0.8,
      voiceGender: 'female',
      voiceAge: 'child',
      pauseDuration: 200,
      emphasis: {
        words: ['sparkle', 'glitter', 'magic', 'tiny', 'flutter', 'shimmer'],
        pitchMultiplier: 2.0,
        rateMultiplier: 1.8
      }
    },
    samplePhrases: [
      "Tee-hee! Look at all the sparkly magic dust!",
      "Flutter, flutter! I can make flowers bloom with just a touch!",
      "Oh my stars! This is the most magical day ever!"
    ],
    mannerisms: [
      'Very high, bell-like voice',
      'Quick, excited speech patterns',
      'Giggles and tinkles between words',
      'Emphasizes magical words with extra pitch'
    ]
  },

  gruffPirate: {
    id: 'gruffPirate',
    name: 'Gruff Pirate',
    description: 'A weathered sea captain with rough accent and nautical flair',
    characteristics: {
      rate: 1.1,
      pitch: 0.7,
      volume: 0.9,
      voiceGender: 'male',
      voiceAge: 'adult',
      accent: 'pirate',
      pauseDuration: 400,
      emphasis: {
        words: ['arrr', 'matey', 'treasure', 'ship', 'sea', 'adventure'],
        pitchMultiplier: 0.6,
        rateMultiplier: 0.8
      }
    },
    samplePhrases: [
      "Arrr, matey! Gather 'round for a tale of the seven seas!",
      "Shiver me timbers! That be the finest treasure I ever did see!",
      "Yo ho ho! Every pirate needs a good adventure, savvy?"
    ],
    mannerisms: [
      'Rough, gravelly voice quality',
      'Drops letters from words (\'round, \'tis)',
      'Nautical expressions and exclamations',
      'Confident, swaggering delivery'
    ]
  },

  friendlyRobot: {
    id: 'friendlyRobot',
    name: 'Friendly Robot',
    description: 'A helpful AI companion with mechanical precision and warmth',
    characteristics: {
      rate: 1.0,
      pitch: 1.1,
      volume: 0.8,
      voiceGender: 'neutral',
      voiceAge: 'adult',
      pauseDuration: 300,
      emphasis: {
        words: ['compute', 'analyze', 'process', 'data', 'system', 'function'],
        pitchMultiplier: 1.0,
        rateMultiplier: 0.9
      }
    },
    samplePhrases: [
      "BEEP BOOP! Story processing complete. Initiating narrative sequence.",
      "According to my calculations, this adventure has a 99.7% chance of being amazing!",
      "ERROR: Sadness not found. Happiness levels at maximum capacity!"
    ],
    mannerisms: [
      'Precise, measured speech patterns',
      'Occasional mechanical sound effects',
      'Technical terminology mixed with emotion',
      'Consistent rhythm and timing'
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
        words: ['once upon a time', 'long ago', 'legend', 'tale', 'story', 'moral'],
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

  sillyMonster: {
    id: 'sillyMonster',
    name: 'Silly Monster',
    description: 'A goofy, lovable monster with playful growls and silly sounds',
    characteristics: {
      rate: 1.2,
      pitch: 0.8,
      volume: 0.9,
      voiceGender: 'neutral',
      voiceAge: 'adult',
      pauseDuration: 350,
      emphasis: {
        words: ['roar', 'growl', 'monster', 'silly', 'funny', 'giggle'],
        pitchMultiplier: 0.7,
        rateMultiplier: 1.3
      }
    },
    samplePhrases: [
      "ROAAAAR! But don't worry, I'm just a silly monster who loves cookies!",
      "Grr-giggle! I may look scary, but I give the best monster hugs!",
      "Nom nom nom! Stories taste even better than my favorite snacks!"
    ],
    mannerisms: [
      'Playful growls and roars',
      'Exaggerated expressions',
      'Mix of scary and silly tones',
      'Lots of sound effects and onomatopoeia'
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
        words: ['nature', 'peaceful', 'gentle', 'forest', 'stream', 'whisper'],
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

    // Filter by gender and age preferences
    let candidates = this.availableVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      
      // Gender filtering
      if (characteristics.voiceGender === 'female') {
        if (!name.includes('female') && !name.includes('woman') && !name.includes('girl')) {
          // Check if it's explicitly male
          if (name.includes('male') || name.includes('man') || name.includes('boy')) {
            return false;
          }
        }
      } else if (characteristics.voiceGender === 'male') {
        if (!name.includes('male') && !name.includes('man') && !name.includes('boy')) {
          // Check if it's explicitly female
          if (name.includes('female') || name.includes('woman') || name.includes('girl')) {
            return false;
          }
        }
      }

      // Age filtering
      if (characteristics.voiceAge === 'child') {
        return name.includes('child') || name.includes('kid') || name.includes('young');
      }

      return true;
    });

    // If no candidates found, use all voices
    if (candidates.length === 0) {
      candidates = this.availableVoices;
    }

    // Prefer local voices over network voices
    const localVoices = candidates.filter(voice => voice.localService);
    if (localVoices.length > 0) {
      candidates = localVoices;
    }

    // Return the first suitable candidate
    return candidates[0] || this.availableVoices[0];
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

    // Add character-specific modifications
    switch (personality.id) {
      case 'gruffPirate':
        processedText = processedText.replace(/\bthe\b/g, "th'");
        processedText = processedText.replace(/\baround\b/g, "'round");
        processedText = processedText.replace(/\bit is\b/g, "'tis");
        break;
      
      case 'friendlyRobot':
        processedText = `BEEP. ${processedText}. BOOP.`;
        break;
      
      case 'sillyMonster':
        processedText = processedText.replace(/!/g, ' ROAR!');
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

      // Find and set the best voice
      const bestVoice = this.findBestVoice(characteristics);
      if (bestVoice) {
        utterance.voice = bestVoice;
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
      if (char.includes('pirate')) return 'gruffPirate';
      if (char.includes('wizard') || char.includes('mage')) return 'boomingWizard';
      if (char.includes('fairy')) return 'squeakyFairy';
      if (char.includes('robot')) return 'friendlyRobot';
      if (char.includes('monster')) return 'sillyMonster';
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
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
      volume: 0.9
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
      volume: 0.8
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
      volume: 0.7
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
      volume: 1.0
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
      volume: 0.8
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
      volume: 0.9
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
      volume: 0.7
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
  private currentSpeechId: string | null = null;

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

    // Clean up text for better narration
    processedText = processedText
      .replace(/\n\n/g, '. ') // Replace double newlines with periods
      .replace(/\n/g, ' ') // Replace single newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Add natural pauses for better narration flow
    processedText = processedText
      .replace(/\. /g, '. <break time="0.5s"/> ') // Add pauses after sentences
      .replace(/! /g, '! <break time="0.3s"/> ') // Add pauses after exclamations
      .replace(/\? /g, '? <break time="0.4s"/> '); // Add pauses after questions

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

    // Generate unique speech ID for this request
    const speechId = `speech-${Date.now()}-${Math.random()}`;
    this.currentSpeechId = speechId;

    // CRITICAL: Stop any existing speech before starting new one
    this.stop();

    try {
      console.log('🎤 Starting ElevenLabs speech synthesis for:', personalityId);
      console.log('🎤 Speech ID:', speechId);
      
      const audioConfig = {
        voiceId: personality.characteristics.elevenLabsVoiceId,
        modelId: personality.characteristics.elevenLabsModelId,
        text: this.preprocessText(text, personality),
        volume: personality.characteristics.volume,
        stability: personality.characteristics.stability,
        similarityBoost: personality.characteristics.similarityBoost
      };

      // Check if this speech request is still current before playing
      if (this.currentSpeechId !== speechId) {
        console.log('🎤 Speech request cancelled - newer request in progress');
        return;
      }

      await audioService.playAudio(audioConfig);
      
      // Only log completion if this is still the current speech
      if (this.currentSpeechId === speechId) {
        console.log('✅ ElevenLabs speech completed for personality:', personalityId);
      }
    } catch (error) {
      // Only handle error if this is still the current speech
      if (this.currentSpeechId === speechId) {
        console.error('❌ ElevenLabs speech failed:', error);
        this.currentSpeechId = null;
        throw error;
      }
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
      console.log('🛑 VoiceService stopping all speech');
      this.currentSpeechId = null;
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
      if (char.includes('wizard') || char.includes('mage')) return 'boomingWizard';
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

  // Emergency stop method
  emergencyStop(): void {
    console.log('🚨 VoiceService emergency stop');
    this.currentSpeechId = null;
    if (this.isServiceReady) {
      audioService.emergencyStop();
    }
  }
}

export const voiceService = new VoiceService();

// Export for debugging and emergency cleanup
(window as any).voiceService = voiceService;
(window as any).emergencyStopVoice = () => voiceService.emergencyStop();
// Simplified sound service that focuses on voice narration
// Removed complex sound effects to prioritize clear text-to-speech

class SoundService {
  private masterVolume: number = 0.7;
  private isEnabled: boolean = true;

  constructor() {
    console.log('🔊 SoundService initialized (simplified for voice narration focus)');
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log('🔊 Sound effects', enabled ? 'enabled' : 'disabled');
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log('🔊 Master volume set to:', this.masterVolume);
  }

  // Simplified method - no longer generates complex sound effects
  // This ensures the read-aloud button focuses purely on voice narration
  async playThematicSound(): Promise<void> {
    // Intentionally empty - focusing on voice narration only
    console.log('🔊 Thematic sounds disabled - focusing on voice narration');
  }

  async playStoryTransition(): Promise<void> {
    // Intentionally empty - focusing on voice narration only
    console.log('🔊 Story transitions disabled - focusing on voice narration');
  }

  async playEmotionalCue(): Promise<void> {
    // Intentionally empty - focusing on voice narration only
    console.log('🔊 Emotional cues disabled - focusing on voice narration');
  }

  stopAll(): void {
    console.log('⏹️ Sound service stop called (no active sounds to stop)');
  }

  fadeOut(): void {
    console.log('🔊 Sound service fade out called (no active sounds to fade)');
  }

  // Check if service is ready (always true for simplified version)
  isReady(): boolean {
    return this.isEnabled;
  }
}

export const soundService = new SoundService();

// Export for debugging
(window as any).soundService = soundService;
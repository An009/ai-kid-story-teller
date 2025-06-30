# ElevenLabs Text-to-Speech Troubleshooting Guide

## 🎯 Quick Diagnosis

### Check These First:
1. **API Key**: Verify `VITE_ELEVENLABS_API_KEY` is set in your `.env` file
2. **Internet Connection**: Ensure stable internet connectivity
3. **Browser Support**: Use Chrome, Firefox, Safari, or Edge (latest versions)
4. **Account Status**: Check your ElevenLabs account has sufficient credits

---

## 🔧 Common Issues & Solutions

### 1. Audio Distortion or Poor Quality

**Symptoms:**
- Robotic or unnatural voice
- Audio cuts out or stutters
- Muffled or unclear speech

**Solutions:**

#### Optimize Voice Settings:
```javascript
// Recommended settings for high quality
const voiceSettings = {
  stability: 0.75,        // Higher = more consistent
  similarity_boost: 0.75, // Higher = more accurate to voice
  style: 0.0,            // Lower = more natural
  use_speaker_boost: true // Always enable
};
```

#### Content-Specific Adjustments:
- **Long Stories (>1000 chars)**: Increase stability to 0.85, reduce similarity to 0.65
- **Dialogue-Heavy**: Increase style to 0.2, reduce similarity to 0.65
- **Short Content (<100 chars)**: Increase style to 0.3 for more expression

#### Network Optimization:
- Use wired internet connection when possible
- Minimum 1 Mbps upload speed recommended
- Close other bandwidth-heavy applications

---

### 2. Voice Inconsistencies

**Symptoms:**
- Voice changes mid-sentence
- Different pronunciation of same words
- Emotional tone varies unexpectedly

**Solutions:**

#### Text Preprocessing:
```javascript
// Clean text for better consistency
function preprocessText(text) {
  return text
    .replace(/\n\n/g, '. ')           // Replace paragraphs with periods
    .replace(/\n/g, ' ')              // Replace line breaks with spaces
    .replace(/\s+/g, ' ')             // Normalize multiple spaces
    .replace(/[^\w\s.,!?;:'"()-]/g, '') // Remove special characters
    .trim();
}
```

#### Voice Model Selection:
- **Use Turbo v2.5**: Latest model with best consistency
- **Avoid switching models**: Stick to one model per story
- **Character limit**: Keep segments under 1000 characters

#### Stability Settings:
- **Increase stability**: 0.8-0.9 for very consistent voice
- **Reduce style**: 0.0-0.1 to minimize variation
- **Enable speaker boost**: Always use for better quality

---

### 3. API Errors

**Symptoms:**
- 401 Unauthorized
- 429 Rate Limit Exceeded
- 422 Unprocessable Entity
- 500 Internal Server Error

**Solutions:**

#### Authentication Issues (401):
```bash
# Check API key format
VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef...

# Verify key is active in ElevenLabs dashboard
# Regenerate key if necessary
```

#### Rate Limiting (429):
```javascript
// Implement retry logic with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
        continue;
      }
      throw error;
    }
  }
}
```

#### Validation Errors (422):
- **Check text length**: Maximum 5000 characters per request
- **Validate voice ID**: Ensure voice exists and is accessible
- **Review settings**: All values must be between 0.0 and 1.0

#### Server Errors (500):
- **Retry after delay**: Wait 5-10 seconds before retrying
- **Check ElevenLabs status**: Visit status.elevenlabs.io
- **Use fallback**: Implement graceful degradation

---

### 4. Playback Issues

**Symptoms:**
- Audio doesn't start
- Playback stops unexpectedly
- Multiple audio streams playing

**Solutions:**

#### Browser Audio Context:
```javascript
// Resume audio context (required for some browsers)
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}

// Handle user interaction requirement
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}, { once: true });
```

#### Audio Element Management:
```javascript
// Proper cleanup to prevent overlapping audio
function stopAllAudio() {
  // Stop current audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentAudio.src.startsWith('blob:')) {
      URL.revokeObjectURL(currentAudio.src);
    }
  }
  
  // Clear any queued audio
  audioQueue.forEach(audio => {
    audio.pause();
    if (audio.src.startsWith('blob:')) {
      URL.revokeObjectURL(audio.src);
    }
  });
  audioQueue = [];
}
```

#### Memory Management:
```javascript
// Revoke blob URLs to prevent memory leaks
audio.addEventListener('ended', () => {
  if (audio.src.startsWith('blob:')) {
    URL.revokeObjectURL(audio.src);
  }
});
```

---

## ⚙️ Optimal Settings Guide

### Voice Settings by Content Type

#### Children's Stories:
```javascript
{
  stability: 0.8,
  similarity_boost: 0.7,
  style: 0.1,
  use_speaker_boost: true
}
```

#### Dialogue-Heavy Content:
```javascript
{
  stability: 0.6,
  similarity_boost: 0.65,
  style: 0.25,
  use_speaker_boost: true
}
```

#### Long Narratives:
```javascript
{
  stability: 0.85,
  similarity_boost: 0.65,
  style: 0.05,
  use_speaker_boost: true
}
```

### Model Selection:
- **Turbo v2.5**: Best for real-time applications (recommended)
- **Multilingual v2**: For non-English content
- **Eleven English v1**: Legacy model (not recommended)

### Text Optimization:
```javascript
// Optimal text formatting
function optimizeForTTS(text) {
  return text
    // Add natural pauses
    .replace(/\. /g, '. <break time="0.5s"/> ')
    .replace(/! /g, '! <break time="0.3s"/> ')
    .replace(/\? /g, '? <break time="0.4s"/> ')
    
    // Normalize punctuation
    .replace(/…/g, '...')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    
    // Remove problematic characters
    .replace(/[^\w\s.,!?;:'"()-]/g, '')
    
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
```

---

## 🚨 Emergency Procedures

### Complete Audio Reset:
```javascript
function emergencyAudioReset() {
  // Stop all audio elements
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
    if (audio.src.startsWith('blob:')) {
      URL.revokeObjectURL(audio.src);
      audio.src = '';
    }
  });
  
  // Clear service states
  voiceService.emergencyStop();
  audioService.emergencyStop();
  
  // Reset UI states
  setIsReading(false);
  setCurrentWordIndex(0);
  setReadingProgress(0);
}
```

### API Connection Test:
```javascript
async function testElevenLabsConnection() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': API_KEY }
    });
    
    return {
      success: response.ok,
      status: response.status,
      latency: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## 🔍 Diagnostic Tools

### Built-in Diagnostics:
1. **Audio Service Status**: Check `audioService.getDiagnostics()`
2. **Connection Test**: Run `audioService.testApiConnection()`
3. **Voice Service Ready**: Check `voiceService.isReady()`

### Browser Console Commands:
```javascript
// Test API connection
await window.testAudioConnection()

// Emergency stop all audio
window.emergencyStopAudio()

// Get current diagnostics
window.audioService.getDiagnostics()

// Test voice synthesis
await window.voiceService.testVoice('wiseStoryteller')
```

### Performance Monitoring:
```javascript
// Monitor audio buffer health
setInterval(() => {
  const diagnostics = audioService.getDiagnostics();
  if (diagnostics.bufferHealth < 50) {
    console.warn('Poor buffer health:', diagnostics.bufferHealth);
  }
}, 1000);
```

---

## 📊 Performance Optimization

### Reduce Latency:
1. **Use shorter text segments** (< 500 characters)
2. **Pre-generate common phrases**
3. **Implement audio caching**
4. **Use CDN for static audio**

### Improve Quality:
1. **Use Turbo v2.5 model**
2. **Optimize voice settings per content**
3. **Preprocess text properly**
4. **Monitor buffer health**

### Handle Errors Gracefully:
```javascript
async function robustTTS(text, voiceId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await voiceService.speak(text, voiceId);
    } catch (error) {
      console.warn(`TTS attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        // Final fallback
        throw new Error(`TTS failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

---

## 🛠️ Preventive Measures

### Regular Maintenance:
1. **Monitor API usage** and credit balance
2. **Update voice models** when new versions available
3. **Test audio functionality** after updates
4. **Clear browser cache** periodically

### Code Best Practices:
1. **Always cleanup audio resources**
2. **Implement proper error handling**
3. **Use appropriate voice settings**
4. **Monitor performance metrics**

### User Experience:
1. **Provide clear error messages**
2. **Offer alternative voices**
3. **Include manual retry options**
4. **Show loading states**

---

## 📞 Getting Help

### ElevenLabs Support:
- **Documentation**: docs.elevenlabs.io
- **Status Page**: status.elevenlabs.io
- **Discord**: ElevenLabs community
- **Email**: support@elevenlabs.io

### Application Support:
- **Diagnostics Panel**: Built-in troubleshooting tool
- **Browser Console**: Check for error messages
- **Network Tab**: Monitor API requests
- **Audio Tab**: Check audio element states

Remember: Most audio issues are resolved by checking the API key, internet connection, and using optimal voice settings. The built-in diagnostics panel can help identify and resolve most common problems automatically.
// Voice Recognition Service
// Using Web Speech API (free and built into modern browsers)

class VoiceRecognitionService {
  constructor() {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      
      // Support multiple languages
      this.recognition.lang = 'en-IN'; // Default to Indian English
      
      this.isListening = false;
      this.onResultCallback = null;
      this.onErrorCallback = null;
      this.onEndCallback = null;
      
      this.setupEventListeners();
    } else {
      this.recognition = null;
      console.warn('Speech Recognition not supported in this browser');
    }
  }
  
  setupEventListeners() {
    if (!this.recognition) return;
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      if (this.onResultCallback) {
        this.onResultCallback({
          transcript,
          confidence,
          isFinal: event.results[0].isFinal
        });
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }
  
  // Start listening
  start(language = 'en-IN') {
    if (!this.recognition) {
      throw new Error('Speech Recognition not supported');
    }
    
    if (this.isListening) {
      return;
    }
    
    this.recognition.lang = language;
    this.recognition.start();
    this.isListening = true;
  }
  
  // Stop listening
  stop() {
    if (!this.recognition || !this.isListening) {
      return;
    }
    
    this.recognition.stop();
    this.isListening = false;
  }
  
  // Set callbacks
  onResult(callback) {
    this.onResultCallback = callback;
  }
  
  onError(callback) {
    this.onErrorCallback = callback;
  }
  
  onEnd(callback) {
    this.onEndCallback = callback;
  }
  
  // Check if supported
  isSupported() {
    return this.recognition !== null;
  }
}

// Text-to-Speech Service
class TextToSpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.loadVoices();
  }
  
  loadVoices() {
    this.voices = this.synth.getVoices();
    
    // Chrome loads voices asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }
  
  // Speak text
  speak(text, language = 'en-IN', rate = 1, pitch = 1) {
    if (!this.synth) {
      console.warn('Text-to-Speech not supported');
      return;
    }
    
    // Cancel any ongoing speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Try to find a voice for the language
    const voice = this.voices.find(v => v.lang.startsWith(language.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }
    
    this.synth.speak(utterance);
    
    return utterance;
  }
  
  // Stop speaking
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  // Check if supported
  isSupported() {
    return this.synth !== null;
  }
  
  // Get available voices
  getVoices() {
    return this.voices;
  }
}

// Language configurations
export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' }
];

// Create singleton instances
export const voiceRecognition = new VoiceRecognitionService();
export const textToSpeech = new TextToSpeechService();

export { VoiceRecognitionService, TextToSpeechService };

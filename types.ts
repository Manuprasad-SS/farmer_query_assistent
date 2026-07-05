
export type Language = 'en' | 'hi' | 'ta' | 'te';

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  source?: string;
}

// Fix: Corrected typo in interface name from 'UIT Mappings' to 'UIMappings'. This resolves multiple 'Cannot find name' and import errors.
export interface UIMappings {
  title: string;
  subtitle: string;
  input: string;
  askVoice: string;
  analyzeImage: string;
  demoQuery: string;
  language: string;
  dialect: string;
  uploader: string;
  tip: string;
  imgAnalysis: string;
  weather: string;
  weatherNote: string;
  conv: string;
  placeholder: string;
  send: string;
  play: string;
  initMsg: string;
}

// Fix: Moved MobileNetModel interface out of `declare global` and exported it to allow for type imports in other files.
export interface MobileNetModel {
    classify: (img: HTMLImageElement) => Promise<Array<{ className: string; probability: number }>>;
}

declare global {
    // Fix: Augmented the Window interface to provide types for `window.mobilenet`, resolving property access errors.
    interface Window {
        // Global declaration for the mobilenet library from the script tag
        mobilenet: {
            load: () => Promise<MobileNetModel>;
        };
        // Fix: Added SpeechRecognition and webkitSpeechRecognition to the Window interface to resolve property access errors.
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    // Fix: Added type definitions for the Web Speech API to resolve 'Cannot find name' errors.
    interface SpeechRecognitionEvent extends Event {
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }
    
    interface SpeechRecognitionResult {
        readonly length: number;
        readonly isFinal: boolean;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }
    
    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }
    
    interface SpeechRecognitionErrorEvent extends Event {
        readonly error: string;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: (() => void) | null;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
        onend: (() => void) | null;
        start(): void;
        stop(): void;
    }

    declare var SpeechRecognition: {
        new (): SpeechRecognition;
    };
}

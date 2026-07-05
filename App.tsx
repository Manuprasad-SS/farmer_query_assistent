import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ChatPanel } from './components/ChatPanel';
import { callGeminiApi } from './services/geminiService';
import { uiText, DEMO_QUERIES } from './constants';
import type { Language, ChatMessage } from './types';
import { useTensorFlow } from './hooks/useTensorFlow';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');

  // Load conversation from localStorage on initial render, or set a default.
  const [conversation, setConversation] = useState<ChatMessage[]>(() => {
    try {
      const savedHistory = localStorage.getItem('farmer-chat-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load/parse chat history from localStorage:", e);
    }
    // Fallback to initial message for the default language if nothing is loaded.
    return [{ text: uiText['en'].initMsg, from: 'bot' }];
  });
  
  const [status, setStatus] = useState<string>('Loading Model...');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Fix: Added mimeType to the image state for robust MIME type handling.
  const [image, setImage] = useState<{ file: File | null; previewUrl: string | null; base64: string | null; mimeType: string | null; }>({ file: null, previewUrl: null, base64: null, mimeType: null });
  const [tfAnalysisResult, setTfAnalysisResult] = useState<string>('No image analyzed yet.');

  const T = uiText[language];
  const { model, modelStatus } = useTensorFlow();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const chatHistoryRef = useRef(conversation);

  useEffect(() => {
    chatHistoryRef.current = conversation;
  }, [conversation]);

  // Save conversation to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem('farmer-chat-history', JSON.stringify(conversation));
    } catch (e) {
      console.error("Failed to save chat history to localStorage:", e);
    }
  }, [conversation]);

  useEffect(() => {
    setStatus(modelStatus);
  }, [modelStatus]);

  // Fix: Updated handleQuery to accept imageMimeType for robust API calls.
  const handleQuery = useCallback(async (query: string, imageBase64: string | null = null, imageMimeType: string | null = null) => {
    if (!query.trim() && !imageBase64) return;
    setIsLoading(true);
    setStatus('Connecting to Gemini...');

    const userMessage: ChatMessage = { from: 'user', text: query };
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      // Fix: Pass imageMimeType to the Gemini API service.
      const responseText = await callGeminiApi(chatHistoryRef.current, query, language, imageBase64, imageMimeType);
      const source = imageBase64 ? 'Gemini (Vision)' : 'Gemini (Text)';
      const botMessage: ChatMessage = { from: 'bot', text: responseText, source };
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const botMessage: ChatMessage = { from: 'bot', text: `🚨 System Error: I failed to connect to the AI. Check your API key, network connection, or console for details. (Error: ${errorMessage})`, source: 'System Failure' };
      setConversation(prev => [...prev, botMessage]);
    }

    setIsLoading(false);
    setStatus('Ready');
    if (imageBase64) {
      // Fix: Clear mimeType along with other image data after use.
      setImage({ file: null, previewUrl: null, base64: null, mimeType: null }); // Clear image after use
    }
  }, [language]);

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
    }

    if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            setIsListening(true);
            setStatus('Listening...');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(transcript); 
            handleQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setStatus(`Error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setStatus('Ready');
        };
        
        recognitionRef.current = recognition;
    }
    
    recognitionRef.current.lang = language;

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
    }
  }, [isListening, language, handleQuery]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !model) return;

    const previewUrl = URL.createObjectURL(file);
    const base64Data = await fileToBase64(file);
    // Fix: Store the file's MIME type in the state.
    setImage({ file, previewUrl, base64: base64Data, mimeType: file.type });

    setTfAnalysisResult('Loading image...');
    setStatus('Analyzing with TensorFlow.js...');
    
    const img = document.createElement('img');
    img.src = previewUrl;
    img.onload = async () => {
        try {
            const preds = await model.classify(img);
            const topPrediction = preds[0];
            const resultText = `Detected (Local): ${topPrediction.className} (${(topPrediction.probability * 100).toFixed(1)}%)`;
            setTfAnalysisResult(resultText);
            setStatus('Ready');
            
            const query = `Analyze this image. The local model detected it as: ${topPrediction.className}. What is the best course of action for a farmer?`;
            // Fix: Pass the file's MIME type when calling handleQuery.
            await handleQuery(query, base64Data, file.type);
        } catch (error) {
            console.error("TF.js Error:", error);
            setTfAnalysisResult('Error analyzing image with local model.');
            setStatus('Ready');
        } finally {
            URL.revokeObjectURL(previewUrl); // Clean up object URL
        }
    };
    img.onerror = () => {
        setTfAnalysisResult('Error loading image for analysis.');
        setStatus('Ready');
        URL.revokeObjectURL(previewUrl);
    };

  }, [model, handleQuery]);
  
  const handleDemoQuery = () => {
    const choice = DEMO_QUERIES[Math.floor(Math.random() * DEMO_QUERIES.length)];
    setUserInput(choice);
    handleQuery(choice);
  };

  const handleSpeakLast = () => {
    if (!('speechSynthesis' in window)) {
        alert('Text-to-speech not supported in this browser.');
        return;
    }
    const lastBotMessage = [...conversation].reverse().find(m => m.from === 'bot');
    if (lastBotMessage) {
        const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
        utterance.lang = language; // Helps select the right voice
        speechSynthesis.speak(utterance);
    } else {
        alert('No reply to play yet.');
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <Header T={T} />
      <main className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 p-4">
        <ControlPanel
          T={T}
          language={language}
          onLanguageChange={(e) => setLanguage(e.target.value as Language)}
          onFileChange={handleFileChange}
          onDemoQuery={handleDemoQuery}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          imagePreviewUrl={image.previewUrl}
          tfAnalysisResult={tfAnalysisResult}
          isLoading={isLoading}
        />
        <ChatPanel
          T={T}
          status={status}
          conversation={conversation}
          userInput={userInput}
          onUserInput={setUserInput}
          // Fix: Pass image MIME type along with base64 data on send.
          onSend={() => handleQuery(userInput, image.base64, image.mimeType)}
          onSpeakLast={handleSpeakLast}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
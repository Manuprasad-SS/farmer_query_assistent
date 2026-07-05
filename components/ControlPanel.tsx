import React from 'react';
import type { Language, UIMappings } from '../types';

interface ControlPanelProps {
    T: UIMappings;
    language: Language;
    onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDemoQuery: () => void;
    onVoiceInput: () => void;
    isListening: boolean;
    imagePreviewUrl: string | null;
    tfAnalysisResult: string;
    isLoading: boolean;
}

const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; secondary?: boolean; disabled?: boolean }> = ({ onClick, children, secondary, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${secondary
                ? 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
                : 'bg-green-700 text-white hover:bg-green-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);


const PwaInstructionsPanel: React.FC = () => (
    <details className="mt-4 text-sm">
        <summary className="font-semibold cursor-pointer text-gray-700">Files to save (for PWA)</summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-3">
            <p className="text-gray-600">Save these two files in your project's public folder.</p>
            <div>
                <h4 className="font-bold text-gray-800">manifest.json</h4>
                <pre className="p-3 mt-1 bg-green-900 text-white rounded-md overflow-x-auto text-xs whitespace-pre-wrap">{`{
  "name": "Farmer Query Assistant",
  "short_name": "AgriBot",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#2b8a3e",
  "theme_color": "#2b8a3e",
  "icons": [
    { "src": "icon192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`}</pre>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">service-worker.js</h4>
                <pre className="p-3 mt-1 bg-green-900 text-white rounded-md overflow-x-auto text-xs whitespace-pre-wrap">{`const CACHE_NAME = 'agribot-cache-v1';
const ASSETS = ['./', './index.html'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((resp) => resp || fetch(event.request)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))));
});`}</pre>
            </div>
        </div>
    </details>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ T, language, onLanguageChange, onFileChange, onDemoQuery, onVoiceInput, isListening, imagePreviewUrl, tfAnalysisResult, isLoading }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white/50 p-4 rounded-xl shadow-sm space-y-4">
            <div>
                <h3 className="font-bold text-lg text-gray-800">{T.input}</h3>
                <div className="flex gap-2 flex-wrap mt-2">
                    <Button disabled={isLoading} onClick={onVoiceInput}>
                        {isListening ? '🛑 Stop Listening' : T.askVoice}
                    </Button>
                    <Button secondary disabled={isLoading} onClick={() => fileInputRef.current?.click()}>{T.analyzeImage}</Button>
                    <Button secondary disabled={isLoading} onClick={onDemoQuery}>{T.demoQuery}</Button>
                </div>
            </div>

            <div className="flex gap-2 items-center mt-2">
                <label htmlFor="lang" className="text-sm font-medium text-gray-700">{T.language}</label>
                <select id="lang" value={language} onChange={onLanguageChange} className="p-2 border border-gray-300 rounded-md text-sm">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                </select>
                <div className="ml-auto px-2.5 py-1.5 bg-gray-100 rounded-md font-semibold text-gray-700 text-xs">{T.dialect}</div>
            </div>

            <div onClick={() => fileInputRef.current?.click()} className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-600 hover:bg-green-50/50 transition-colors">
                <div className="text-sm text-gray-600">{T.uploader}</div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                {imagePreviewUrl && (
                    <div className="mt-2">
                        <img src={imagePreviewUrl} alt="Image preview" className="max-w-full max-h-56 mx-auto rounded-md" />
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500">{T.tip}</p>

            <div className="flex gap-2 mt-2">
                <div className="flex-1 p-3 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-800">{T.imgAnalysis}</h4>
                    <small className="text-xs text-gray-500">Uses TensorFlow.js (local inference)</small>
                    <div className="text-xs text-gray-600 mt-1">{tfAnalysisResult}</div>
                </div>
                <div className="w-40 p-3 bg-white rounded-lg border border-gray-200">
                     <h4 className="font-semibold text-sm text-gray-800">{T.weather}</h4>
                     <div className="text-xs text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: T.weatherNote }}></div>
                </div>
            </div>

            <PwaInstructionsPanel />
        </div>
    );
};

import type { Language, UIMappings } from './types';

export const SYSTEM_INSTRUCTION_TEMPLATE = `You are a helpful, expert agricultural assistant (AgriBot). 
Your primary goal is to provide clear, actionable, and safe advice to farmers. 
Your tone must be empathetic and trustworthy. 
Always reply clearly and concisely in the language code specified: '{lang}'.
Do not invent non-existent products or chemicals.`;

export const DEMO_QUERIES: string[] = [
  'My tomato leaves have brown spots',
  'There are small holes on maize leaves',
  'Soil looks dusty',
  'What pesticide for caterpillars?'
];

export const uiText: Record<Language, UIMappings> = {
  en: { title: "Farmer Query Assistant — Prototype (Integrated)", subtitle: "Now with real Translate, TensorFlow.js image analysis, and PWA instructions.", input: "Input", askVoice: "🎤 Ask by Voice", analyzeImage: "🔍 Analyze Image", demoQuery: "✨ Demo Query", language: "Language", dialect: "Dialect: Default", uploader: "📸 Click or drop an image (leaf, pest, soil)", tip: "Tips: Use clear close-up photos of the affected leaf or soil. Try short voice queries like 'My tomato leaves have spots'.", imgAnalysis: "Image analysis", weather: "Weather (demo)", weatherNote: "Sunny, 29°C<br/>Rain chance: 10%", conv: "Conversation", placeholder: "Type a question (or press Enter)", send: "Send", play: "🔊 Play", initMsg: "Hello! I am AgriBot — upload a photo or ask a short question. I will reply in your selected language. (Powered by Gemini AI and TensorFlow.js)" },
  hi: { title: "किसान सहायता सहायक — प्रोटोटाइप", subtitle: "अब वास्तविक अनुवाद, TensorFlow.js छवि विश्लेषण और PWA समर्थन के साथ।", input: "इनपुट", askVoice: "🎤 आवाज से पूछें", analyzeImage: "🔍 छवि विश्लेषण करें", demoQuery: "✨ डेमो प्रश्न", language: "भाषा", dialect: "बोली: डिफ़ॉल्ट", uploader: "📸 छवि क्लिक करें या छोड़ें (पत्ता, कीट, मिट्टी)", tip: "सुझाव: प्रभावित पत्तियों या मिट्टी की साफ़ तस्वीरें लें। छोटे प्रश्न आज़माएँ जैसे 'मेरे टमाटर के पत्तों पर धब्बे हैं'।", imgAnalysis: "छवि विश्लेषण", weather: "मौसम (डेमो)", weatherNote: "धूप, 29°C<br/>बारिश की संभावना: 10%", conv: "वार्तालाप", placeholder: "एक प्रश्न लिखें (या Enter दबाएं)", send: "भेजें", play: "🔊 चलाएं", initMsg: "नमस्ते! मैं एग्रीबॉट हूं — एक फोटो अपलोड करें या एक छोटा प्रश्न पूछें। मैं आपके चुनी हुई भाषा में उत्तर दूंगा। (जेमिनी AI और TensorFlow.js द्वारा संचालित।)" },
  ta: { title: "விவசாயி உதவி உதவியாளர் — மாதிரி", subtitle: "இப்போது உண்மையான மொழிபெயர்ப்பு, TensorFlow.js படம் பகுப்பாய்வு மற்றும் PWA ஆதரவுடன்.", input: "உள்ளீடு", askVoice: "🎤 குரலில் கேளுங்கள்", analyzeImage: "🔍 படத்தை பகுப்பாய்வு செய்யுங்கள்", demoQuery: "✨ டெமோ கேள்வி", language: "மொழி", dialect: "பேச்சு வழக்கு: இயல்பு", uploader: "📸 படம் எடுக்கவும் அல்லது இழுக்கவும் (இலை, பூச்சி, மண்)", tip: "உதவிக்குறிப்புகள்: பாதிக்கப்பட்ட இலைகள் அல்லது மண்ணின் தெளிவான நெருக்கமான படங்களைப் பயன்படுத்துங்கள்.", imgAnalysis: "பட பகுப்பாய்வு", weather: "வானிலை (டெமோ)", weatherNote: "வெயில், 29°C<br/>மழை வாய்ப்பு: 10%", conv: "உரையாடல்", placeholder: "ஒரு கேள்வியை எழுதுங்கள் (அல்லது Enter அழுத்தவும்)", send: "அனுப்பு", play: "🔊 இயக்கு", initMsg: "வணக்கம்! நான் எக்ரிபாட் — படம் பதிவேற்றவும் அல்லது ஒரு குறுகிய கேள்வி கேளுங்கள். உங்கள் மொழியில் பதிலளிக்கிறேன்। (ஜெமினி AI மற்றும் TensorFlow.js ஆல் இயக்கப்படுகிறது।)" },
  te: { title: "రైతు సహాయకుడు — ప్రోటోటైప్", subtitle: "ఇప్పుడు నిజమైన అనువాదం, TensorFlow.js చిత్రం విశ్లేషణ మరియు PWA మద్దతుతో.", input: "ఇన్‌పుట్", askVoice: "🎤 వాయిస్ ద్వారా అడగండి", analyzeImage: "🔍 చిత్రాన్ని విశ్లేషించండి", demoQuery: "✨ డెమో ప్రశ్న", language: "భాష", dialect: "ఉపభాష: డిఫాల్ట్", uploader: "📸 చిత్రం క్లిక్ చేయండి లేదా డ్రాప్ చేయండి (ఆకు, పురుగు, నేల)", tip: "సూచనలు: ప్రభావిత ఆకు లేదా నేల యొక్క స్పష్టమైన ఫోటోలు ఉపయోగించండి。", imgAnalysis: "చిత్ర విశ్లేషణ", weather: "వాతావరణం (డెమో)", weatherNote: "ఎండగా, 29°C<br/>వర్షం అవకాశం: 10%", conv: "సంభాషణ", placeholder: "ప్రశ్న టైప్ చేయండి (లేదా Enter నొక్కండి)", send: "పంపండి", play: "🔊 ప్లే చేయండి", initMsg: "నమస్తే! నేను అగ్రిబాట్ — ఒక ఫోటోను అప్లోడ్ చేయండి లేదా ఒక చిన్న ప్రశ్న అడగండి। మీ భాషలో సమాధానం ఇస్తాను। (జెమిని AI మరియు TensorFlow.js ద్వారా ఆధారితం।)" }
};

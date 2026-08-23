/**
 * Multilingual Translations for KrishiSetu AI (English, Hindi, Marathi)
 */

export type AppLanguage = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  askKrishiSetu: string;
  listening: string;
  processing: string;
  speakPrompt: string;
  typePrompt: string;
  sendQuery: string;
  clear: string;
  close: string;
  optimalSellingWindow: string;
  estNetRealization: string;
  recommendedBuyer: string;
  currentPrice: string;
  forecastPrice: string;
  confidenceScore: string;
  viewDetails: string;
  createLot: string;
  voiceUnavailable: string;
  exampleQueriesTitle: string;
  examples: string[];
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'KrishiSetu AI',
    tagline: 'Smart Market Linkage & Net Realization Platform',
    askKrishiSetu: 'Ask KrishiSetu (Voice)',
    listening: 'Listening to your voice...',
    processing: 'Consulting Django Market Intelligence Engine...',
    speakPrompt: 'Speak in Hindi, Marathi, or English (e.g. "Where should I sell 500kg tomatoes?")',
    typePrompt: 'Or type your question here...',
    sendQuery: 'Ask Engine',
    clear: 'Clear',
    close: 'Close',
    optimalSellingWindow: 'Optimal Selling Window',
    estNetRealization: 'Estimated Net Realization',
    recommendedBuyer: 'Recommended Buyer / Market',
    currentPrice: 'Current Modal Price',
    forecastPrice: 'Expected Forecast Price',
    confidenceScore: 'Algorithm Confidence',
    viewDetails: 'View Full Intelligence',
    createLot: 'Create Digital Lot',
    voiceUnavailable: 'Voice speech recognition is unavailable on this browser. You can type your question.',
    exampleQueriesTitle: 'Try asking:',
    examples: [
      'Where should I sell 500 kg tomatoes?',
      'What is today\'s tomato market price?',
      'Who is the best verified buyer?',
      'How much net profit will I make on 500 kg?',
      'Will prices rise in 3 days?',
    ],
  },
  hi: {
    appName: 'कृषिसेतु AI',
    tagline: 'स्मार्ट बाजार लिंकेज और शुद्ध लाभ अनुकूलन मंच',
    askKrishiSetu: 'कृषिसेतु से बोलकर पूछें',
    listening: 'आपकी आवाज सुन रहे हैं...',
    processing: 'कृषिसेतु मार्केट इंटेलिजेंस इंजन से जानकारी ले रहे हैं...',
    speakPrompt: 'हिंदी, मराठी या अंग्रेजी में बोलें (उदा. "मेरे पास 500 किलो टमाटर हैं, मुझे कहां बेचना चाहिए?")',
    typePrompt: 'या अपना प्रश्न यहां लिखें...',
    sendQuery: 'पूछें',
    clear: 'साफ़ करें',
    close: 'बंद करें',
    optimalSellingWindow: 'सर्वोत्तम बिक्री समय',
    estNetRealization: 'अनुमानित शुद्ध प्राप्ति (Net Realization)',
    recommendedBuyer: 'अनुशंसित खरीदार / मंडी',
    currentPrice: 'वर्तमान मंडी भाव',
    forecastPrice: 'अपेक्षित पूर्वानुमानित भाव',
    confidenceScore: 'एल्गोरिदम विश्वास स्कोर',
    viewDetails: 'विस्तृत विश्लेषण देखें',
    createLot: 'डिजिटल लॉट बनाएं',
    voiceUnavailable: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। आप प्रश्न टाइप कर सकते हैं।',
    exampleQueriesTitle: 'यह पूछकर देखें:',
    examples: [
      'मेरे 500 किलो टमाटर कहां बेचूं?',
      'आज टमाटर का मंडी भाव क्या है?',
      'सबसे अच्छा भरोसेमंद खरीदार कौन है?',
      '500 किलो बेचने पर मुझे कितना शुद्ध लाभ मिलेगा?',
      'क्या 3 दिन बाद टमाटर का भाव बढ़ेगा?',
    ],
  },
  mr: {
    appName: 'कृषीसेतू AI',
    tagline: 'स्मार्ट कृषी बाजार जोडणी आणि निव्वळ नफा प्लॅटफॉर्म',
    askKrishiSetu: 'कृषीसेतूला बोलून विचारा',
    listening: 'तुमचा आवाज ऐकत आहोत...',
    processing: 'कृषीसेतू मार्केट इंटेलिजन्स इंजिनकडून माहिती मिळवत आहोत...',
    speakPrompt: 'मराठी, हिंदी किंवा इंग्रजीत बोला (उदा. "माझ्याकडे ५०० किलो टोमॅटो आहेत, कुठे विकू?")',
    typePrompt: 'किंवा तुमचा प्रश्न येथे टाईप करा...',
    sendQuery: 'विचारा',
    clear: 'पुसा',
    close: 'बंद करा',
    optimalSellingWindow: 'उत्कृष्ट विक्री कालावधी',
    estNetRealization: 'अंदाजे निव्वळ मिळकत (Net Realization)',
    recommendedBuyer: 'शिफारस केलेला खरेदीदार / बाजार',
    currentPrice: 'आजचा बाजारभाव',
    forecastPrice: 'अपेक्षित अंदाज भाव',
    confidenceScore: 'अचूकता विश्वास स्कोर',
    viewDetails: 'सविस्तर विश्लेषण पहा',
    createLot: 'डिजिटल लॉट तयार करा',
    voiceUnavailable: 'या ब्राउझरवर व्हॉइस इनपुट उपलब्ध नाही. आपण प्रश्न टाईप करू शकता.',
    exampleQueriesTitle: 'हे विचारून पहा:',
    examples: [
      'माझे ५०० किलो टोमॅटो कुठे विकू?',
      'आज टोमॅटोचा बाजारभाव काय आहे?',
      'सर्वात चांगला खरेदीदार कोण आहे?',
      '५०० किलो टोमॅटो विकल्यावर मला किती निव्वळ पैसे मिळतील?',
      '३ दिवसांनंतर टोमॅटोचे भाव वाढतील का?',
    ],
  },
};

import { LanguageCode } from '../types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  getAiRec: string;
  tagline: string;
  // Nav
  navDashboard: string;
  navMarkets: string;
  navBuyers: string;
  navStorage: string;
  navTransport: string;
  navCalculator: string;
  navAiAdvice: string;
  navStewardHub: string;
  // Dashboard
  farmerDashboardTitle: string;
  currentCrop: string;
  harvestQuantity: string;
  currentMarketPrice: string;
  nearbyBuyers: string;
  marketDemand: string;
  availableStorage: string;
  transportAvailability: string;
  estimatedProfit: string;
  aiSellingRecommendation: string;
  decisionTrafficLight: string;
  confidence: string;
  assumptionsNote: string;
  decisionSupportDisclaimer: string;
  // Actions
  sellToday: string;
  storeDays: string;
  sellNearby: string;
  sendAnotherMarket: string;
  contactBuyer: string;
  reserveStorage: string;
  bookTransport: string;
  joinPool: string;
  viewAll: string;
  verifiedData: string;
  recentlyUpdated: string;
  listenAudio: string;
  stopAudio: string;
  // Profit Calc
  calcTitle: string;
  calcSubtitle: string;
  sellingPrice: string;
  transportCost: string;
  storageCost: string;
  otherExpenses: string;
  expectedRevenue: string;
  expectedNetProfit: string;
  compareOptions: string;
  // Steward
  stewardTitle: string;
  stewardSubtitle: string;
  verifyAction: string;
  flagInvalid: string;
  broadcastMessage: string;
  addOrder: string;
  addStorage: string;
  addTransport: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appTitle: "AgriSignal",
    appSubtitle: "Smart Decisions After Harvest",
    tagline: "Know when to sell, where to sell, and how much you can earn.",
    getAiRec: "Get AI Recommendation",
    navDashboard: "Dashboard",
    navMarkets: "Markets",
    navBuyers: "Buyers",
    navStorage: "Storage",
    navTransport: "Transport",
    navCalculator: "Profit Calculator",
    navAiAdvice: "AI Advice",
    navStewardHub: "FPO Steward Hub",
    farmerDashboardTitle: "Farmer Harvest Dashboard",
    currentCrop: "Selected Crop",
    harvestQuantity: "Harvested Quantity",
    currentMarketPrice: "Current Mandi Price",
    nearbyBuyers: "Nearby Buyers",
    marketDemand: "Market Demand",
    availableStorage: "Available Storage",
    transportAvailability: "Transport Ready",
    estimatedProfit: "Estimated Net Profit",
    aiSellingRecommendation: "AI Post-Harvest Recommendation",
    decisionTrafficLight: "Optimal Action",
    confidence: "Confidence",
    assumptionsNote: "Based on real-time market arrivals, transit rates & verified buyer bids.",
    decisionSupportDisclaimer: "AgriSignal provides advisory decision support based on verified data, not guaranteed future price quotes.",
    sellToday: "Sell Today",
    storeDays: "Store for 2–3 Days",
    sellNearby: "Sell in Nearby Market",
    sendAnotherMarket: "Send to Another Market",
    contactBuyer: "Contact Buyer",
    reserveStorage: "Reserve Space",
    bookTransport: "Book Vehicle",
    joinPool: "Join Shared Pool",
    viewAll: "View All",
    verifiedData: "Verified Data",
    recentlyUpdated: "Recently Updated",
    listenAudio: "Listen to Voice Advice",
    stopAudio: "Stop Voice",
    calcTitle: "Expected Profit Calculator",
    calcSubtitle: "Calculate accurate net take-home earnings across multiple selling routes",
    sellingPrice: "Selling Price (₹/Quintal)",
    transportCost: "Transportation Cost (₹)",
    storageCost: "Storage Cost (₹)",
    otherExpenses: "Packaging & Mandi Cess (₹)",
    expectedRevenue: "Expected Revenue",
    expectedNetProfit: "Expected Net Profit",
    compareOptions: "Compare 3 Selling Strategies",
    stewardTitle: "FPO & Local Steward Control Center",
    stewardSubtitle: "Collect, verify market signals and broadcast trusted recommendations to farmers",
    verifyAction: "Verify Signal",
    flagInvalid: "Flag Invalid",
    broadcastMessage: "Broadcast to Farmers",
    addOrder: "Add Buyer Order",
    addStorage: "Add Storage",
    addTransport: "Add Vehicle",
  },
  hi: {
    appTitle: "एग्री-सिग्नल (AgriSignal)",
    appSubtitle: "फसल कटाई के बाद सही और समझदार फैसला",
    tagline: "जानिए कब बेचें, कहां बेचें और कितना शुद्ध मुनाफा कमाएं।",
    getAiRec: "AI सलाह प्राप्त करें",
    navDashboard: "डैशबोर्ड",
    navMarkets: "मंडी भाव",
    navBuyers: "खरीदार",
    navStorage: "गोदाम/कोल्ड स्टोरेज",
    navTransport: "वाहन/ट्रांसपोर्ट",
    navCalculator: "मुनाफा कैलकुलेटर",
    navAiAdvice: "AI सलाह",
    navStewardHub: "FPO प्रबंधक केंद्र",
    farmerDashboardTitle: "किसान डैशबोर्ड",
    currentCrop: "चुनी गई फसल",
    harvestQuantity: "कुल कटी फसल मात्रा",
    currentMarketPrice: "वर्तमान मंडी भाव",
    nearbyBuyers: "नजदीकी खरीदार",
    marketDemand: "मंडी मांग",
    availableStorage: "उपलब्ध कोल्ड स्टोरेज",
    transportAvailability: "उपलब्ध वाहन",
    estimatedProfit: "अनुमानित शुद्ध मुनाफा",
    aiSellingRecommendation: "AI फसल बिक्री सलाह",
    decisionTrafficLight: "सर्वश्रेष्ठ निर्णय",
    confidence: "सटीकता विश्वास",
    assumptionsNote: "सत्यापित मंडी आवक, खरीदार बोली और वाहन भाड़े पर आधारित।",
    decisionSupportDisclaimer: "एग्री-सिग्नल सत्यापित आंकड़ों पर आधारित निर्णय सहायता है, कोई भविष्य की कीमत गारंटी नहीं।",
    sellToday: "आज ही बेचें",
    storeDays: "2-3 दिन रोकें / स्टोर करें",
    sellNearby: "पास की मंडी में बेचें",
    sendAnotherMarket: "बड़ी मंडी में भेजें",
    contactBuyer: "खरीदार से संपर्क करें",
    reserveStorage: "जगह बुक करें",
    bookTransport: "वाहन बुक करें",
    joinPool: "साझा गाड़ी (पूल) में जुड़ें",
    viewAll: "सभी देखें",
    verifiedData: "सत्यापित जानकारी",
    recentlyUpdated: "हाल ही में अपडेटेड",
    listenAudio: "आवाज में सलाह सुनें",
    stopAudio: "आवाज बंद करें",
    calcTitle: "शुद्ध मुनाफा कैलकुलेटर",
    calcSubtitle: "भाड़ा, गोदाम और पैकिंग खर्च घटाकर असली कमाई की तुलना करें",
    sellingPrice: "बिक्री भाव (₹/क्विंटल)",
    transportCost: "वाहन भाड़ा (₹)",
    storageCost: "गोदाम खर्च (₹)",
    otherExpenses: "पैकिंग व मंडी शुल्क (₹)",
    expectedRevenue: "कुल अनुमानित आय",
    expectedNetProfit: "शुद्ध बचत/मुनाफा",
    compareOptions: "3 विकल्पों की तुलना करें",
    stewardTitle: "FPO एवं स्थानीय डाटा प्रबंधक केंद्र",
    stewardSubtitle: "बाजार जानकारी एकत्र करें, सत्यापित करें और किसानों को संदेश भेजें",
    verifyAction: "सत्यापित करें",
    flagInvalid: "अमान्य घोषित करें",
    broadcastMessage: "किसानों को संदेश भेजें",
    addOrder: "नया खरीदार जोड़ें",
    addStorage: "नया गोदाम जोड़ें",
    addTransport: "नया वाहन जोड़ें",
  },
  mr: {
    appTitle: "अॅग्रीसिग्नल (AgriSignal)",
    appSubtitle: "कापणीनंतर योग्य आणि फायदेशीर निर्णय",
    tagline: "कधी विकावे, कुठे विकावे आणि किती नफा मिळेल ते जाणून घ्या.",
    getAiRec: "AI शिफारस मिळवा",
    navDashboard: "डॅशबोर्ड",
    navMarkets: "बाजारभाव",
    navBuyers: "खरेदीदार",
    navStorage: "गोदाम/शीतगृह",
    navTransport: "वाहतूक",
    navCalculator: "नफा गणक",
    navAiAdvice: "AI सल्ला",
    navStewardHub: "FPO व्यवस्थापक",
    farmerDashboardTitle: "शेतकरी डॅशबोर्ड",
    currentCrop: "निवडलेले पीक",
    harvestQuantity: "एकूण काढणी प्रमाण",
    currentMarketPrice: "सध्याचा बाजारभाव",
    nearbyBuyers: "जवळचे खरेदीदार",
    marketDemand: "बाजारातील मागणी",
    availableStorage: "उपलब्ध शीतगृह",
    transportAvailability: "उपलब्ध वाहने",
    estimatedProfit: "अपेक्षित निव्वळ नफा",
    aiSellingRecommendation: "AI विक्री सल्ला",
    decisionTrafficLight: "योग्य निर्णय",
    confidence: "विश्वसनीयता",
    assumptionsNote: "सत्यापित बाजार आवक व वाहतूक शुल्कावर आधारित.",
    decisionSupportDisclaimer: "अॅग्रीसिग्नल ही उपलब्ध माहितीवर आधारित मार्गदर्शक प्रणाली आहे.",
    sellToday: "आजच विका",
    storeDays: "२-३ दिवस साठवा",
    sellNearby: "जवळच्या बाजारात विका",
    sendAnotherMarket: "दुसऱ्या मोठ्या बाजारात पाठवा",
    contactBuyer: "खरेदीदाराशी संपर्क साधा",
    reserveStorage: "जागा आरक्षित करा",
    bookTransport: "वाहन बुक करा",
    joinPool: "सामायिक वाहनात सामील व्हा",
    viewAll: "सर्व पहा",
    verifiedData: "सत्यापित माहिती",
    recentlyUpdated: "नुकतेच अद्यतनित",
    listenAudio: "आवाजात सल्ला ऐका",
    stopAudio: "आवाज थांबवा",
    calcTitle: "निव्वळ नफा गणक",
    calcSubtitle: "वाहतूक व साठवणूक खर्च वजा करून खऱ्या नफ्याची गणना करा",
    sellingPrice: "विक्री दर (₹/क्विंटल)",
    transportCost: "वाहतूक खर्च (₹)",
    storageCost: "साठवणूक खर्च (₹)",
    otherExpenses: "पॅकिंग व बाजार सेस (₹)",
    expectedRevenue: "अपेक्षित एकूण महसूल",
    expectedNetProfit: "अपेक्षित निव्वळ नफा",
    compareOptions: "३ पर्यायांची तुलना करा",
    stewardTitle: "FPO व स्थानिक केंद्र व्यवस्थापक",
    stewardSubtitle: "माहिती गोळा करा, तपासा आणि शेतकऱ्यांना थेट संदेश पाठवा",
    verifyAction: "माहिती तपासा",
    flagInvalid: "अवैध ठरवा",
    broadcastMessage: "शेतकऱ्यांना संदेश पाठवा",
    addOrder: "खरेदीदार जोडा",
    addStorage: "शीतगृह जोडा",
    addTransport: "वाहन जोडा",
  },
  te: {
    appTitle: "అగ్రిసిగ్నల్ (AgriSignal)",
    appSubtitle: "పంట కోత తర్వాత తెలివైన నిర్ణయాలు",
    tagline: "ఎప్పుడు అమ్మాలి, ఎక్కడ అమ్మాలి, ఎంత లాభం వస్తుందో తెలుసుకోండి.",
    getAiRec: "AI సలహా పొందండి",
    navDashboard: "డాష్‌బోర్డ్",
    navMarkets: "మార్కెట్ ధరలు",
    navBuyers: "కొనుగోలుదారులు",
    navStorage: "కోల్డ్ స్టోరేజ్",
    navTransport: "రవాణా సౌకర్యం",
    navCalculator: "లాభాల లెక్కింపు",
    navAiAdvice: "AI సలహా",
    navStewardHub: "FPO కేంద్రం",
    farmerDashboardTitle: "రైతు డాష్‌బోర్డ్",
    currentCrop: "ఎంచుకున్న పంట",
    harvestQuantity: "పంట దిగుబడి పరిమాణం",
    currentMarketPrice: "ప్రస్తుత మార్కెట్ ధర",
    nearbyBuyers: "సమీప కొనుగోలుదారులు",
    marketDemand: "మార్కెట్ డిమాండ్",
    availableStorage: "స్టోరేజ్ లభ్యత",
    transportAvailability: "రవాణా లభ్యత",
    estimatedProfit: "అంచనా నికర లాభం",
    aiSellingRecommendation: "AI పంట అమ్మకపు సలహా",
    decisionTrafficLight: "సరైన నిర్ణయం",
    confidence: "విశ్వసనీయత",
    assumptionsNote: "ధృవీకరించబడిన మార్కెట్ సమాచారంపై ఆధారపడి ఉంటుంది.",
    decisionSupportDisclaimer: "ఇది మార్కెట్ డేటా ఆధారంగా అందించబడే నిర్ణయ సహాయం మాత్రమే.",
    sellToday: "ఈరోజే అమ్మండి",
    storeDays: "2-3 రోజులు నిల్వ ఉంచండి",
    sellNearby: "సమీప మార్కెట్‌లో అమ్మండి",
    sendAnotherMarket: "వేరే పెద్ద మార్కెట్‌కు పంపండి",
    contactBuyer: "కొనుగోలుదారుని సంప్రదించండి",
    reserveStorage: "స్థలాన్ని బుక్ చేయండి",
    bookTransport: "వాహనాన్ని బుక్ చేయండి",
    joinPool: "షేర్డ్ వెహికల్‌లో చేరండి",
    viewAll: "అన్నీ చూడండి",
    verifiedData: "ధృవీకరించబడిన డేటా",
    recentlyUpdated: "ఇప్పుడే అప్‌డేట్ చేయబడింది",
    listenAudio: "వాయిస్ సలహా వినండి",
    stopAudio: "ఆడియో ఆపండి",
    calcTitle: "నికర లాభం కాలిక్యులేటర్",
    calcSubtitle: "ఖర్చులు తీసివేసి అసలైన లాభాన్ని లెక్కించండి",
    sellingPrice: "అమ్మకపు ధర (₹/క్వింటాల్)",
    transportCost: "రవాణా ఖర్చు (₹)",
    storageCost: "నిల్వ ఖర్చు (₹)",
    otherExpenses: "ఇతర ఖర్చులు (₹)",
    expectedRevenue: "అంచనా మొత్తం ఆదాయం",
    expectedNetProfit: "అంచనా నికర లాభం",
    compareOptions: "3 వ్యూహాలను సరిపోల్చండి",
    stewardTitle: "FPO డేటా నిర్వాహక కేంద్రం",
    stewardSubtitle: "మార్కెట్ సమాచారాన్ని సేకరించి రైతులకు ప్రసారం చేయండి",
    verifyAction: "ధృవీకరించండి",
    flagInvalid: "చెల్లనిదిగా గుర్తించండి",
    broadcastMessage: "రైతులకు సందేశం పంపండి",
    addOrder: "కొనుగోలుదారుని జోడించండి",
    addStorage: "స్టోరేజ్ జోడించండి",
    addTransport: "వాహనాన్ని జోడించండి",
  },
  pa: {
    appTitle: "ਐਗਰੀਸਿਗਨਲ (AgriSignal)",
    appSubtitle: "ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਸਹੀ ਅਤੇ ਸਮਝਦਾਰ ਫੈਸਲੇ",
    tagline: "ਜਾਣੋ ਕਦੋਂ ਵੇਚਣਾ ਹੈ, ਕਿੱਥੇ ਵੇਚਣਾ ਹੈ ਅਤੇ ਕਿੰਨਾ ਮੁਨਾਫਾ ਮਿਲੇਗਾ।",
    getAiRec: "AI ਸਲਾਹ ਲਵੋ",
    navDashboard: "ਡੈਸ਼ਬੋਰਡ",
    navMarkets: "ਮੰਡੀ ਭਾਅ",
    navBuyers: "ਖਰੀਦਦਾਰ",
    navStorage: "ਕੋਲਡ ਸਟੋਰੇਜ",
    navTransport: "ਟ੍ਰਾਂਸਪੋਰਟ",
    navCalculator: "ਮੁਨਾਫਾ ਕੈਲਕੁਲੇਟਰ",
    navAiAdvice: "AI ਸਲਾਹ",
    navStewardHub: "FPO ਕੇਂਦਰ",
    farmerDashboardTitle: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ",
    currentCrop: "ਚੁਣੀ ਗਈ ਫਸਲ",
    harvestQuantity: "ਕੁੱਲ ਵਾਢੀ ਮਾਤਰਾ",
    currentMarketPrice: "ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ",
    nearbyBuyers: "ਨੇੜਲੇ ਖਰੀਦਦਾਰ",
    marketDemand: "ਮੰਡੀ ਮੰਗ",
    availableStorage: "ਉਪਲਬਧ ਸਟੋਰੇਜ",
    transportAvailability: "ਉਪਲਬਧ ਵਾਹਨ",
    estimatedProfit: "ਅਨੁਮਾਨਿਤ ਸ਼ੁੱਧ ਮੁਨਾਫਾ",
    aiSellingRecommendation: "AI ਵਿਕਰੀ ਸਲਾਹ",
    decisionTrafficLight: "ਸਭ ਤੋਂ ਵਧੀਆ ਫੈਸਲਾ",
    confidence: "ਵਿਸ਼ਵਾਸ ਦਰ",
    assumptionsNote: "ਪ੍ਰਮਾਣਿਤ ਮੰਡੀ ਆਮਦ ਅਤੇ ਭਾੜੇ 'ਤੇ ਅਧਾਰਤ।",
    decisionSupportDisclaimer: "ਐਗਰੀਸਿਗਨਲ ਮਾਰਕੀਟ ਡੇਟਾ 'ਤੇ ਅਧਾਰਤ ਸਲਾਹਕਾਰੀ ਸਹਾਇਤਾ ਹੈ।",
    sellToday: "ਅੱਜ ਹੀ ਵੇਚੋ",
    storeDays: "2-3 ਦਿਨ ਸਟੋਰ ਕਰੋ",
    sellNearby: "ਨੇੜਲੀ ਮੰਡੀ ਵਿੱਚ ਵੇਚੋ",
    sendAnotherMarket: "ਦੂਜੀ ਵੱਡੀ ਮੰਡੀ ਭੇਜੋ",
    contactBuyer: "ਖਰੀਦਦਾਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    reserveStorage: "ਥਾਂ ਬੁੱਕ ਕਰੋ",
    bookTransport: "ਗੱਡੀ ਬੁੱਕ ਕਰੋ",
    joinPool: "ਸਾਂਝੀ ਗੱਡੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
    viewAll: "ਸਾਰੇ ਦੇਖੋ",
    verifiedData: "ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ",
    recentlyUpdated: "ਤਾਜ਼ਾ ਅਪਡੇਟ",
    listenAudio: "ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ",
    stopAudio: "ਆਵਾਜ਼ ਬੰਦ ਕਰੋ",
    calcTitle: "ਸ਼ੁੱਧ ਮੁਨਾਫਾ ਕੈਲਕੁਲੇਟਰ",
    calcSubtitle: "ਖਰਚੇ ਘਟਾ ਕੇ ਅਸਲ ਕਮਾਈ ਦੀ ਤੁਲਨਾ ਕਰੋ",
    sellingPrice: "ਵੇਚ ਮੁੱਲ (₹/ਕਵਿੰਟਲ)",
    transportCost: "ਟ੍ਰਾਂਸਪੋਰਟ ਖਰਚਾ (₹)",
    storageCost: "ਸਟੋਰੇਜ ਖਰਚਾ (₹)",
    otherExpenses: "ਹੋਰ ਖਰਚੇ (₹)",
    expectedRevenue: "ਕੁੱਲ ਆਮਦਨ",
    expectedNetProfit: "ਸ਼ੁੱਧ ਮੁਨਾਫਾ",
    compareOptions: "3 ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ",
    stewardTitle: "FPO ਅਤੇ ਸਥਾਨਕ ਕੇਂਦਰ ਪ੍ਰਬੰਧਕ",
    stewardSubtitle: "ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰੋ ਅਤੇ ਕਿਸਾਨਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ",
    verifyAction: "ਤਸਦੀਕ ਕਰੋ",
    flagInvalid: "ਅਵੈਧ ਘੋਸ਼ਿਤ ਕਰੋ",
    broadcastMessage: "ਕਿਸਾਨਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ",
    addOrder: "ਖਰੀਦਦਾਰ ਸ਼ਾਮਲ ਕਰੋ",
    addStorage: "ਸਟੋਰੇਜ ਸ਼ਾਮਲ ਕਰੋ",
    addTransport: "ਵਾਹਨ ਸ਼ਾਮਲ ਕਰੋ",
  },
};

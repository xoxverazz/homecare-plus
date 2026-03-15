import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useThemeStore } from './store/themeStore'

const resources = {
  en: {
    translation: {
      nav: {
        overview: 'Overview', dashboard: 'Dashboard', vitals: 'Vitals',
        aiTools: 'AI Tools', symptomChecker: 'Symptom Checker', aiAssistant: 'AI Assistant',
        imageAnalysis: 'Image Analysis', reportSummarizer: 'Report Summarizer', healthCoach: 'Health Coach',
        medicalLibrary: 'Medical Library', diseases: 'Diseases', organBrowser: 'Organ Browser',
        recordsAndCare: 'Records & Care', records: 'Health Records', telemedicine: 'Telemedicine',
        insurance: 'Insurance', findAndOrder: 'Find & Order', hospitals: 'Nearby Hospitals',
        medicines: 'Medicines', emergency: 'Emergency', settings: 'Settings', logout: 'Logout',
      },
      common: {
        loading: 'Loading...', save: 'Save', cancel: 'Cancel', submit: 'Submit',
        search: 'Search', viewAll: 'View All', back: 'Back', next: 'Next',
        analyze: 'Analyze', upload: 'Upload', delete: 'Delete', edit: 'Edit',
        close: 'Close', confirm: 'Confirm', download: 'Download',
        disclaimer: 'This AI tool does not replace professional medical advice. Always consult a qualified healthcare provider.',
        noData: 'No data available', error: 'An error occurred', retry: 'Retry',
      },
      dashboard: {
        title: 'Dashboard', greeting: 'Welcome back', todayVitals: "Today's Vitals",
        quickActions: 'Quick Actions', checkSymptoms: 'Check Symptoms', logVitals: 'Log Vitals',
        aiAssistant: 'AI Assistant', findHospital: 'Find Hospital', healthStatus: 'Health Status',
        allNormal: 'All vitals are within normal range.',
      },
      symptomChecker: {
        title: 'Symptom Checker', subtitle: 'Describe your symptoms for AI-powered analysis',
        selectSymptoms: 'Select Symptoms', followUp: 'Follow-up Questions', results: 'Analysis Results',
        addSymptom: 'Add symptom', analyze: 'Analyze Symptoms', possibleConditions: 'Possible Conditions',
        mostLikely: 'Most Likely', specialist: 'Consult Specialist', precautions: 'Precautions',
        homeRemedies: 'Home Remedies', medications: 'Suggested Medications', reset: 'Start Over',
        severity: 'Severity', probability: 'Probability',
      },
      vitals: {
        title: 'Health Vitals', logToday: "Log Today's Vitals", weeklyTrends: 'Weekly Trends',
        heartRate: 'Heart Rate', bloodPressure: 'Blood Pressure', oxygenLevel: 'Oxygen Level',
        bloodSugar: 'Blood Sugar', bmi: 'BMI', weight: 'Weight', steps: 'Steps',
        temperature: 'Temperature', saveVitals: 'Save Vitals', normalRanges: 'Normal Reference Ranges',
      },
      records: {
        title: 'Health Records', subtitle: 'Securely store and manage your medical documents',
        upload: 'Upload Record', labReport: 'Lab Report', prescription: 'Prescription',
        scan: 'Medical Scan', document: 'Document', analyzed: 'Analyzed',
      },
      settings: {
        title: 'Settings', subtitle: 'Manage your account and preferences',
        profile: 'Profile', notifications: 'Notifications', appearance: 'Appearance',
        language: 'Language', security: 'Security', saveChanges: 'Save Changes',
        firstName: 'First Name', lastName: 'Last Name', email: 'Email',
        phone: 'Phone', darkMode: 'Dark Mode', languageSettings: 'Language Settings',
      },
      hospitals: {
        title: 'Nearby Healthcare Facilities',
        subtitle: 'Find hospitals, clinics, pharmacies, and dental clinics near you',
        search: 'Search hospitals, specialties...', allFacilities: 'All Facilities',
        hospitals: 'Hospitals', clinics: 'Clinics', pharmacies: 'Pharmacies', dental: 'Dental Clinics',
        findingNearby: 'Finding nearby facilities...', allowLocation: 'Allow location access or search by name.',
        directions: 'Directions', distance: 'Distance', rating: 'Rating',
      },
      telemedicine: {
        title: 'Telemedicine', subtitle: 'Consult qualified doctors online',
        videoConsultation: 'Video Consultation', chatDoctor: 'Chat with Doctor',
        secondOpinion: 'Second Opinion', bookConsultation: 'Book Consultation',
        available: 'Available', unavailable: 'Unavailable', busy: 'Busy',
        experience: 'Experience', fee: 'Consultation Fee', languages: 'Languages',
        rating: 'Rating', specialization: 'Specialization',
        allDoctors: 'All Doctors', selectSpecialty: 'Select Specialty',
      },
    },
  },
  hi: {
    translation: {
      nav: {
        overview: 'अवलोकन', dashboard: 'डैशबोर्ड', vitals: 'महत्वपूर्ण संकेत',
        aiTools: 'AI उपकरण', symptomChecker: 'लक्षण जांच', aiAssistant: 'AI सहायक',
        imageAnalysis: 'छवि विश्लेषण', reportSummarizer: 'रिपोर्ट सारांश', healthCoach: 'स्वास्थ्य कोच',
        medicalLibrary: 'चिकित्सा पुस्तकालय', diseases: 'बीमारियाँ', organBrowser: 'अंग ब्राउज़र',
        recordsAndCare: 'रिकॉर्ड और देखभाल', records: 'स्वास्थ्य रिकॉर्ड', telemedicine: 'टेलीमेडिसिन',
        insurance: 'बीमा', findAndOrder: 'खोजें और ऑर्डर करें', hospitals: 'नजदीकी अस्पताल',
        medicines: 'दवाइयाँ', emergency: 'आपातकाल', settings: 'सेटिंग्स', logout: 'लॉग आउट',
      },
      common: {
        loading: 'लोड हो रहा है...', save: 'सहेजें', cancel: 'रद्द करें', submit: 'जमा करें',
        search: 'खोजें', viewAll: 'सब देखें', back: 'वापस', next: 'आगे',
        analyze: 'विश्लेषण करें', upload: 'अपलोड करें', delete: 'हटाएं', edit: 'संपादित करें',
        close: 'बंद करें', confirm: 'पुष्टि करें', download: 'डाउनलोड',
        disclaimer: 'यह AI टूल पेशेवर चिकित्सा सलाह की जगह नहीं लेता। कृपया किसी योग्य चिकित्सक से परामर्श लें।',
        noData: 'कोई डेटा उपलब्ध नहीं', error: 'कोई त्रुटि हुई', retry: 'पुनः प्रयास',
      },
      dashboard: {
        title: 'डैशबोर्ड', greeting: 'वापस आपका स्वागत है', todayVitals: 'आज के महत्वपूर्ण संकेत',
        quickActions: 'त्वरित क्रियाएं', checkSymptoms: 'लक्षण जांचें', logVitals: 'संकेत दर्ज करें',
        aiAssistant: 'AI सहायक', findHospital: 'अस्पताल खोजें', healthStatus: 'स्वास्थ्य स्थिति',
        allNormal: 'सभी संकेत सामान्य सीमा में हैं।',
      },
      symptomChecker: {
        title: 'लक्षण जांच', subtitle: 'AI-संचालित विश्लेषण के लिए अपने लक्षण बताएं',
        selectSymptoms: 'लक्षण चुनें', followUp: 'अनुवर्ती प्रश्न', results: 'विश्लेषण परिणाम',
        addSymptom: 'लक्षण जोड़ें', analyze: 'लक्षणों का विश्लेषण', possibleConditions: 'संभावित स्थितियां',
        mostLikely: 'सबसे संभावित', specialist: 'विशेषज्ञ से परामर्श', precautions: 'सावधानियां',
        homeRemedies: 'घरेलू उपाय', medications: 'सुझाई दवाएं', reset: 'फिर से शुरू करें',
        severity: 'गंभीरता', probability: 'संभावना',
      },
      vitals: {
        title: 'स्वास्थ्य संकेत', logToday: 'आज के संकेत दर्ज करें', weeklyTrends: 'साप्ताहिक रुझान',
        heartRate: 'हृदय गति', bloodPressure: 'रक्तचाप', oxygenLevel: 'ऑक्सीजन स्तर',
        bloodSugar: 'रक्त शर्करा', bmi: 'बीएमआई', weight: 'वजन', steps: 'कदम',
        temperature: 'तापमान', saveVitals: 'संकेत सहेजें', normalRanges: 'सामान्य संदर्भ सीमाएं',
      },
      records: {
        title: 'स्वास्थ्य रिकॉर्ड', subtitle: 'अपने चिकित्सा दस्तावेज़ सुरक्षित रखें',
        upload: 'रिकॉर्ड अपलोड करें', labReport: 'लैब रिपोर्ट', prescription: 'प्रिस्क्रिप्शन',
        scan: 'मेडिकल स्कैन', document: 'दस्तावेज़', analyzed: 'विश्लेषित',
      },
      settings: {
        title: 'सेटिंग्स', subtitle: 'अपना खाता और प्राथमिकताएं प्रबंधित करें',
        profile: 'प्रोफाइल', notifications: 'सूचनाएं', appearance: 'उपस्थिति',
        language: 'भाषा', security: 'सुरक्षा', saveChanges: 'परिवर्तन सहेजें',
        firstName: 'पहला नाम', lastName: 'अंतिम नाम', email: 'ईमेल',
        phone: 'फोन', darkMode: 'डार्क मोड', languageSettings: 'भाषा सेटिंग्स',
      },
      hospitals: {
        title: 'नजदीकी स्वास्थ्य सुविधाएं',
        subtitle: 'अपने नजदीक अस्पताल, क्लिनिक, फार्मेसी खोजें',
        search: 'अस्पताल, विशेषज्ञता खोजें...', allFacilities: 'सभी सुविधाएं',
        hospitals: 'अस्पताल', clinics: 'क्लिनिक', pharmacies: 'फार्मेसी', dental: 'डेंटल क्लिनिक',
        findingNearby: 'नजदीकी सुविधाएं खोज रहे हैं...', allowLocation: 'स्थान की अनुमति दें।',
        directions: 'दिशाएं', distance: 'दूरी', rating: 'रेटिंग',
      },
      telemedicine: {
        title: 'टेलीमेडिसिन', subtitle: 'ऑनलाइन योग्य डॉक्टरों से परामर्श करें',
        videoConsultation: 'वीडियो परामर्श', chatDoctor: 'डॉक्टर से चैट',
        secondOpinion: 'दूसरी राय', bookConsultation: 'परामर्श बुक करें',
        available: 'उपलब्ध', unavailable: 'अनुपलब्ध', busy: 'व्यस्त',
        experience: 'अनुभव', fee: 'परामर्श शुल्क', languages: 'भाषाएं',
        rating: 'रेटिंग', specialization: 'विशेषज्ञता',
        allDoctors: 'सभी डॉक्टर', selectSpecialty: 'विशेषज्ञता चुनें',
      },
    },
  },
  mr: {
    translation: {
      nav: {
        overview: 'विहंगावलोकन', dashboard: 'डॅशबोर्ड', vitals: 'महत्त्वाचे संकेत',
        aiTools: 'AI साधने', symptomChecker: 'लक्षण तपासणी', aiAssistant: 'AI सहाय्यक',
        imageAnalysis: 'प्रतिमा विश्लेषण', reportSummarizer: 'अहवाल सारांश', healthCoach: 'आरोग्य प्रशिक्षक',
        medicalLibrary: 'वैद्यकीय ग्रंथालय', diseases: 'आजार', organBrowser: 'अवयव ब्राउझर',
        recordsAndCare: 'नोंदी आणि काळजी', records: 'आरोग्य नोंदी', telemedicine: 'दूरवैद्यक',
        insurance: 'विमा', findAndOrder: 'शोधा आणि ऑर्डर करा', hospitals: 'जवळचे रुग्णालय',
        medicines: 'औषधे', emergency: 'आणीबाणी', settings: 'सेटिंग्ज', logout: 'बाहेर पडा',
      },
      common: {
        loading: 'लोड होत आहे...', save: 'जतन करा', cancel: 'रद्द करा', submit: 'सबमिट करा',
        search: 'शोधा', viewAll: 'सर्व पहा', back: 'मागे', next: 'पुढे',
        analyze: 'विश्लेषण करा', upload: 'अपलोड करा', delete: 'हटवा', edit: 'संपादित करा',
        close: 'बंद करा', confirm: 'पुष्टी करा', download: 'डाउनलोड',
        disclaimer: 'हे AI साधन व्यावसायिक वैद्यकीय सल्ल्याची जागा घेत नाही. कृपया पात्र डॉक्टरांचा सल्ला घ्या.',
        noData: 'कोणताही डेटा उपलब्ध नाही', error: 'त्रुटी आली', retry: 'पुन्हा प्रयत्न करा',
      },
      dashboard: {
        title: 'डॅशबोर्ड', greeting: 'परत आपले स्वागत आहे', todayVitals: 'आजचे महत्त्वाचे संकेत',
        quickActions: 'जलद क्रिया', checkSymptoms: 'लक्षणे तपासा', logVitals: 'संकेत नोंदवा',
        aiAssistant: 'AI सहाय्यक', findHospital: 'रुग्णालय शोधा', healthStatus: 'आरोग्य स्थिती',
        allNormal: 'सर्व संकेत सामान्य मर्यादेत आहेत.',
      },
      symptomChecker: {
        title: 'लक्षण तपासणी', subtitle: 'AI-चालित विश्लेषणासाठी आपली लक्षणे सांगा',
        selectSymptoms: 'लक्षणे निवडा', followUp: 'पाठपुरावा प्रश्न', results: 'विश्लेषण निकाल',
        addSymptom: 'लक्षण जोडा', analyze: 'लक्षणांचे विश्लेषण', possibleConditions: 'संभाव्य स्थिती',
        mostLikely: 'सर्वात संभाव्य', specialist: 'तज्ञांचा सल्ला', precautions: 'खबरदारी',
        homeRemedies: 'घरगुती उपाय', medications: 'सुचवलेली औषधे', reset: 'पुन्हा सुरू करा',
        severity: 'तीव्रता', probability: 'संभाव्यता',
      },
      settings: {
        title: 'सेटिंग्ज', subtitle: 'आपले खाते आणि प्राधान्ये व्यवस्थापित करा',
        profile: 'प्रोफाइल', notifications: 'सूचना', appearance: 'देखावा',
        language: 'भाषा', security: 'सुरक्षा', saveChanges: 'बदल जतन करा',
        languageSettings: 'भाषा सेटिंग्ज',
      },
      hospitals: {
        title: 'जवळच्या आरोग्य सुविधा', subtitle: 'तुमच्या जवळचे रुग्णालय, क्लिनिक शोधा',
        search: 'रुग्णालय, विशेषज्ञता शोधा...', allFacilities: 'सर्व सुविधा',
        hospitals: 'रुग्णालये', clinics: 'क्लिनिक', pharmacies: 'फार्मसी', dental: 'दंत क्लिनिक',
        findingNearby: 'जवळच्या सुविधा शोधत आहोत...', allowLocation: 'स्थान परवानगी द्या.',
      },
      telemedicine: {
        title: 'दूरवैद्यक', subtitle: 'ऑनलाइन पात्र डॉक्टरांचा सल्ला घ्या',
        videoConsultation: 'व्हिडिओ सल्ला', chatDoctor: 'डॉक्टरशी चॅट',
        secondOpinion: 'दुसरे मत', bookConsultation: 'सल्ला बुक करा',
        available: 'उपलब्ध', unavailable: 'अनुपलब्ध', busy: 'व्यस्त',
        experience: 'अनुभव', fee: 'सल्ला शुल्क',
      },
    },
  },
  kn: {
    translation: {
      nav: {
        overview: 'ಅವಲೋಕನ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', vitals: 'ಪ್ರಮುಖ ಸಂಕೇತಗಳು',
        aiTools: 'AI ಸಾಧನಗಳು', symptomChecker: 'ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲಕ', aiAssistant: 'AI ಸಹಾಯಕ',
        imageAnalysis: 'ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ', reportSummarizer: 'ವರದಿ ಸಾರಾಂಶ', healthCoach: 'ಆರೋಗ್ಯ ತರಬೇತಿದಾರ',
        medicalLibrary: 'ವೈದ್ಯಕೀಯ ಗ್ರಂಥಾಲಯ', diseases: 'ರೋಗಗಳು', organBrowser: 'ಅಂಗ ಬ್ರೌಸರ್',
        records: 'ಆರೋಗ್ಯ ದಾಖಲೆಗಳು', telemedicine: 'ಟೆಲಿಮೆಡಿಸಿನ್',
        hospitals: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು', medicines: 'ಔಷಧಗಳು',
        emergency: 'ತುರ್ತು', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', logout: 'ಲಾಗ್ ಔಟ್',
      },
      common: {
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', save: 'ಉಳಿಸಿ', cancel: 'ರದ್ದು', submit: 'ಸಲ್ಲಿಸಿ',
        search: 'ಹುಡುಕಿ', back: 'ಹಿಂದೆ', next: 'ಮುಂದೆ', analyze: 'ವಿಶ್ಲೇಷಿಸಿ',
        disclaimer: 'ಈ AI ಸಾಧನವು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ.',
      },
      dashboard: {
        title: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', greeting: 'ಮತ್ತೆ ಸ್ವಾಗತ', quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
        checkSymptoms: 'ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ', logVitals: 'ಸಂಕೇತಗಳನ್ನು ದಾಖಲಿಸಿ',
      },
      symptomChecker: {
        title: 'ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲಕ', analyze: 'ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        possibleConditions: 'ಸಾಧ್ಯ ರೋಗಗಳು', precautions: 'ಮುಂಜಾಗ್ರತೆಗಳು',
        homeRemedies: 'ಮನೆ ಪರಿಹಾರಗಳು', medications: 'ಸೂಚಿಸಲಾದ ಔಷಧಗಳು',
      },
      settings: {
        title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', profile: 'ಪ್ರೊಫೈಲ್', language: 'ಭಾಷೆ',
        languageSettings: 'ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', saveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
      },
      telemedicine: {
        title: 'ಟೆಲಿಮೆಡಿಸಿನ್', bookConsultation: 'ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ',
        available: 'ಲಭ್ಯ', experience: 'ಅನುಭವ', fee: 'ಸಮಾಲೋಚನಾ ಶುಲ್ಕ',
      },
    },
  },
  ml: {
    translation: {
      nav: {
        overview: 'അവലോകനം', dashboard: 'ഡാഷ്‌ബോർഡ്', vitals: 'ജീവൻ നിർണായകങ്ങൾ',
        aiTools: 'AI ഉപകരണങ്ങൾ', symptomChecker: 'ലക്ഷണ പരിശോധന', aiAssistant: 'AI സഹായി',
        records: 'ആരോഗ്യ രേഖകൾ', telemedicine: 'ടെലിമെഡിസിൻ',
        hospitals: 'അടുത്തുള്ള ആശുപത്രികൾ', medicines: 'മരുന്നുകൾ',
        emergency: 'അടിയന്തിരം', settings: 'ക്രമീകരണങ്ങൾ', logout: 'ലോഗ് ഔട്ട്',
      },
      common: {
        loading: 'ലോഡ് ചെയ്യുന്നു...', save: 'സേവ് ചെയ്യുക', cancel: 'റദ്ദാക്കുക',
        search: 'തിരയുക', back: 'തിരികെ', next: 'അടുത്തത്', analyze: 'വിശകലനം ചെയ്യുക',
        disclaimer: 'ഈ AI ഉപകരണം പ്രൊഫഷണൽ വൈദ്യ ഉപദേശം മാറ്റിവെക്കുന്നില്ല.',
      },
      dashboard: {
        title: 'ഡാഷ്‌ബോർഡ്', greeting: 'തിരിച്ചു സ്വാഗതം', quickActions: 'ദ്രുത പ്രവർത്തനങ്ങൾ',
      },
      symptomChecker: {
        title: 'ലക്ഷണ പരിശോധന', analyze: 'ലക്ഷണങ്ങൾ വിശകലനം ചെയ്യുക',
        possibleConditions: 'സാധ്യ അവസ്ഥകൾ', precautions: 'മുൻകരുതലുകൾ',
        homeRemedies: 'വീട്ടിൽ ഉള്ള ഉപചാരങ്ങൾ',
      },
      settings: {
        title: 'ക്രമീകരണങ്ങൾ', profile: 'പ്രൊഫൈൽ', language: 'ഭാഷ',
        languageSettings: 'ഭാഷ ക്രമീകരണങ്ങൾ', saveChanges: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക',
      },
      telemedicine: {
        title: 'ടെലിമെഡിസിൻ', bookConsultation: 'കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക',
        available: 'ലഭ്യം', experience: 'അനുഭവം',
      },
    },
  },
  ur: {
    translation: {
      nav: {
        overview: 'جائزہ', dashboard: 'ڈیش بورڈ', vitals: 'اہم علامات',
        aiTools: 'AI آلات', symptomChecker: 'علامات جانچ', aiAssistant: 'AI مددگار',
        records: 'صحت کے ریکارڈ', telemedicine: 'ٹیلی میڈیسن',
        hospitals: 'قریبی اسپتال', medicines: 'دوائیں',
        emergency: 'ہنگامی', settings: 'ترتیبات', logout: 'لاگ آؤٹ',
      },
      common: {
        loading: 'لوڈ ہو رہا ہے...', save: 'محفوظ کریں', cancel: 'منسوخ',
        search: 'تلاش کریں', back: 'واپس', next: 'آگے', analyze: 'تجزیہ کریں',
        disclaimer: 'یہ AI آلہ پیشہ ور طبی مشورے کی جگہ نہیں لیتا۔',
      },
      dashboard: {
        title: 'ڈیش بورڈ', greeting: 'واپس خوش آمدید', quickActions: 'فوری اقدامات',
        checkSymptoms: 'علامات جانچیں',
      },
      symptomChecker: {
        title: 'علامات جانچ', analyze: 'علامات کا تجزیہ',
        possibleConditions: 'ممکنہ بیماریاں', precautions: 'احتیاطی تدابیر',
        homeRemedies: 'گھریلو علاج', medications: 'تجویز کردہ دوائیں',
      },
      settings: {
        title: 'ترتیبات', profile: 'پروفائل', language: 'زبان',
        languageSettings: 'زبان کی ترتیبات', saveChanges: 'تبدیلیاں محفوظ کریں',
      },
      telemedicine: {
        title: 'ٹیلی میڈیسن', bookConsultation: 'مشاورت بک کریں',
        available: 'دستیاب', experience: 'تجربہ', fee: 'مشاورت فیس',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('homecare-lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n

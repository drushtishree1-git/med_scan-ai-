import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 
  | 'en' // English
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'hi' // Hindi (हिन्दी)
  | 'es' // Spanish (Español)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'fr' // French (Français)
  | 'de' // German (Deutsch)
  | 'ar'; // Arabic (العربية)

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', speechCode: 'en-US' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', direction: 'ltr', speechCode: 'kn-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr', speechCode: 'hi-IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', speechCode: 'es-ES' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', direction: 'ltr', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', direction: 'ltr', speechCode: 'te-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', direction: 'ltr', speechCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', direction: 'ltr', speechCode: 'mr-IN' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', speechCode: 'de-DE' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', speechCode: 'ar-SA' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav & Common
    app_title: 'MediScan AI',
    app_subtitle: 'Clinical Diagnostic Intelligence & RAG Consensus Platform',
    dashboard: 'Dashboard',
    scan_intake: 'New Scan Intake',
    analysis_archive: 'Analysis Archive',
    reports: 'Medical Reports',
    hospitals_near_me: 'Hospitals Near Me',
    emergency_precautions: 'Emergency Precautions AI',
    precautions_chatbot: 'Precautions Chatbot',
    database_store: 'SQLite Database',
    anatomy_viewer: '3D Anatomy Viewer',
    sound_therapy: 'Sound & Music Therapy',
    clinical_research: 'Clinical Research AI',
    user_management: 'User Directory',
    medical_profile: 'Medical Profile',
    logout: 'Sign Out',
    switch_role: 'Switch Clinical Role',

    // Stay Healthy Home
    stay_healthy: 'Stay Healthy',
    preventive_portal: 'Preventive Healthcare & Diagnostic AI Engine',
    hero_headline: 'Accurate Medical Imaging & Instant Care Triage',
    hero_desc: 'Upload X-Rays, MRIs, and CT scans for multi-model consensus verified with PubMed Central research guidelines.',
    start_new_scan: 'Start New Scan Analysis',
    emergency_hotline: '24/7 Emergency Precautions AI',
    locate_hospitals: 'Locate Nearby Hospitals',
    recent_studies: 'Recent Diagnostic Studies',
    view_all_history: 'View Complete Archive',
    quick_intake_card_title: 'Diagnostic Intake',
    quick_intake_card_desc: 'Upload DICOM, X-Ray, CT, MRI or Dermatology scans for analysis.',
    precautions_card_title: 'Instant First-Aid AI',
    precautions_card_desc: 'Live RAG-grounded triage instructions for chest pain, stroke, asthma, & trauma.',
    hospitals_card_title: 'Government & ER Radar',
    hospitals_card_desc: 'Find ₹0 free government hospitals and trauma emergency care centers.',

    // Actions & Status
    upload_scan: 'Upload Image / DICOM',
    select_modality: 'Select Modality',
    analyze_scan: 'Analyze with AI Consensus',
    analyzing: 'Analyzing Scan with PubMed RAG...',
    download_report: 'Download PDF Report',
    listen_audio: 'Listen Clinical Audio',
    stop_audio: 'Stop Audio',
    speak_findings: 'Read Aloud in Current Language',
    search: 'Search...',
    all_categories: 'All Categories',
    urgent: 'Urgent',
    critical: 'Critical',
    routine: 'Routine',
    moderate: 'Moderate',
    board_certified: 'Board Certified ACR Standards',
    rag_verified: 'PubMed RAG Grounded',
    hipaa_ready: 'Secure HIPAA Ready',
    translate_button: 'Translate to',
    language_switcher: 'Change Language',
    active_language: 'Active Language',
    karnataka_ramanagara: 'Ramanagara 562159 (Karnataka)',
  },

  kn: {
    // Nav & Common
    app_title: 'ಮೆಡಿಸ್ಕ್ಯಾನ್ AI (MediScan AI)',
    app_subtitle: 'ಕ್ಲಿನಿಕಲ್ ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮತ್ತು ಪಬ್ಮೆಡ್ RAG ವೇದಿಕೆ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    scan_intake: 'ಹೊಸ ಸ್ಕ್ಯಾನ್ ತಪಾಸಣೆ',
    analysis_archive: 'ವಿಶ್ಲೇಷಣೆ ಇತಿಹಾಸ',
    reports: 'ವೈದ್ಯಕೀಯ ವರದಿಗಳು',
    hospitals_near_me: 'ನನ್ನ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    emergency_precautions: 'ತುರ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆ AI',
    precautions_chatbot: 'ಮುನ್ನೆಚ್ಚರಿಕೆ ಚಾಟ್‌ಬಾಟ್',
    database_store: 'ಮಾಹಿತಿ ಕೋಶ (SQLite)',
    anatomy_viewer: '3D ಅಂಗರಚನಾ ವೀಕ್ಷಕ',
    sound_therapy: 'ಧ್ವನಿ ಮತ್ತು ಸಂಗೀತ ಥೆರಪಿ',
    clinical_research: 'ಕ್ಲಿನಿಕಲ್ ಸಂಶೋಧನೆ AI',
    user_management: 'ಬಳಕೆದಾರರ ಪಟ್ಟಿ',
    medical_profile: 'ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    switch_role: 'ಪಾತ್ರವನ್ನು ಬದಲಾಯಿಸಿ',

    // Stay Healthy Home
    stay_healthy: 'ಆರೋಗ್ಯವಾಗಿರಿ (Stay Healthy)',
    preventive_portal: 'ತಡೆಗಟ್ಟುವ ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು AI ರೋಗನಿರ್ಣಯ ಎಂಜಿನ್',
    hero_headline: 'ನಿಖರ ವೈದ್ಯಕೀಯ ಚಿತ್ರಣ ಮತ್ತು ತ್ವರಿತ ಚಿಕಿತ್ಸಾ ಮಾರ್ಗದರ್ಶನ',
    hero_desc: 'PubMed ಸಂಶೋಧನಾ ಮಾರ್ಗಸೂಚಿಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲಾದ ಎಕ್ಸ್-ರೇ, ಎಂಆರ್‌ಐ ಮತ್ತು ಸಿಟಿ ಸ್ಕ್ಯಾನ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    start_new_scan: 'ಹೊಸ ಸ್ಕ್ಯಾನ್ ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
    emergency_hotline: '24/7 ತುರ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆ AI',
    locate_hospitals: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ',
    recent_studies: 'ಇತ್ತೀಚಿನ ರೋಗನಿರ್ಣಯ ಅಧ್ಯಯನಗಳು',
    view_all_history: 'ಸಂಪೂರ್ಣ ಆರ್ಕೈವ್ ವೀಕ್ಷಿಸಿ',
    quick_intake_card_title: 'ರೋಗನಿರ್ಣಯ ತಪಾಸಣೆ',
    quick_intake_card_desc: 'ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಎಕ್ಸ್-ರೇ, ಸಿಟಿ, ಎಂಆರ್‌ಐ ಅಥವಾ ಚರ್ಮದ ಸ್ಕ್ಯಾನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    precautions_card_title: 'ತ್ವರಿತ ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ AI',
    precautions_card_desc: 'ಎದೆನೋವು, ಪಾರ್ಶ್ವವಾಯು, ಉಬ್ಬಸ ಮತ್ತು ಗಾಯಗಳಿಗೆ ತ್ವರಿತ ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳು.',
    hospitals_card_title: 'ಸರ್ಕಾರಿ ಮತ್ತು ತುರ್ತು ಆಸ್ಪತ್ರೆಗಳು',
    hospitals_card_desc: '₹0 ಉಚಿತ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ತುರ್ತು ಚಿಕಿತ್ಸಾ ಕೇಂದ್ರಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ.',

    // Actions & Status
    upload_scan: 'ಚಿತ್ರ / DICOM ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    select_modality: 'ಸ್ಕ್ಯಾನ್ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ',
    analyze_scan: 'AI ಮೂಲಕ ವಿಶ್ಲೇಷಿಸಿ',
    analyzing: 'ಸ್ಕ್ಯಾನ್ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    download_report: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (PDF)',
    listen_audio: 'ಆಡಿಯೋ ಸಾರಾಂಶವನ್ನು ಆಲಿಸಿ',
    stop_audio: 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ',
    speak_findings: 'ಕನ್ನಡದಲ್ಲಿ ಓದಿ ಕೇಳಿಸಿ',
    search: 'ಹುಡುಕಿ...',
    all_categories: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
    urgent: 'ತುರ್ತು',
    critical: 'ಅತ್ಯಂತ ಗಂಭೀರ',
    routine: 'ಸಾಮಾನ್ಯ',
    moderate: 'ಮಧ್ಯಮ',
    board_certified: 'ACR ಮಾನದಂಡಗಳಿಂದ ಪ್ರಮಾಣೀಕೃತ',
    rag_verified: 'PubMed ದೃಢೀಕೃತ',
    hipaa_ready: 'ಸುರಕ್ಷಿತ ಮತ್ತು ಗೌಪ್ಯ',
    translate_button: 'ಭಾಷಾಂತರಿಸಿ',
    language_switcher: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    active_language: 'ಸಕ್ರಿಯ ಭಾಷೆ',
    karnataka_ramanagara: 'ರಾಮನಗರ 562159 (ಕರ್ನಾಟಕ)',
  },

  hi: {
    // Nav & Common
    app_title: 'मेडिस्कैन AI (MediScan AI)',
    app_subtitle: 'क्लिनिकल डायग्नोस्टिक इंटेलिजेंस और पबमेड RAG प्लेटफॉर्म',
    dashboard: 'डैशबोर्ड',
    scan_intake: 'नया स्कैन अपलोड',
    analysis_archive: 'जांच इतिहास',
    reports: 'मेडिकल रिपोर्ट्स',
    hospitals_near_me: 'नजदीकी अस्पताल',
    emergency_precautions: 'आपातकालीन सावधानियां AI',
    precautions_chatbot: 'सावधानी चैटबॉट',
    database_store: 'डेटाबेस (SQLite)',
    anatomy_viewer: '3D शरीर रचना दर्शक',
    sound_therapy: 'ध्वनि एवं संगीत थेरेपी',
    clinical_research: 'क्लिनिकल रिसर्च AI',
    user_management: 'उपयोगकर्ता सूची',
    medical_profile: 'मेडिकल प्रोफाइल',
    logout: 'लॉग आउट',
    switch_role: 'भूमिका बदलें',

    // Stay Healthy Home
    stay_healthy: 'स्वस्थ रहें (Stay Healthy)',
    preventive_portal: 'निवारक स्वास्थ्य सेवा एवं AI निदान इंजन',
    hero_headline: 'सटीक मेडिकल इमेजिंग और त्वरित देखभाल सलाह',
    hero_desc: 'PubMed शोध दिशानिर्देशों द्वारा सत्यापित एक्स-रे, एमआरआई और सीटी स्कैन अपलोड करें।',
    start_new_scan: 'नया स्कैन विश्लेषण शुरू करें',
    emergency_hotline: '24/7 आपातकालीन प्राथमिक चिकित्सा AI',
    locate_hospitals: 'नजदीकी अस्पताल खोजें',
    recent_studies: 'हाल की जांच रिपोर्ट',
    view_all_history: 'पूरा इतिहास देखें',
    quick_intake_card_title: 'निदान इनटेक',
    quick_intake_card_desc: 'एक्स-रे, सीटी, एमआरआई या त्वचा स्कैन तुरंत अपलोड करें।',
    precautions_card_title: 'तुरंत प्राथमिक उपचार AI',
    precautions_card_desc: 'सीने में दर्द, स्ट्रोक, सांस फूलने और चोट के लिए तुरंत निर्देश।',
    hospitals_card_title: 'सरकारी एवं आपातकालीन अस्पताल',
    hospitals_card_desc: '₹0 मुफ्त सरकारी अस्पताल और ट्रॉमा केयर सेंटर खोजें।',

    // Actions & Status
    upload_scan: 'इमेज / DICOM अपलोड करें',
    select_modality: 'स्कैन प्रकार चुनें',
    analyze_scan: 'AI से जांच करें',
    analyzing: 'स्कैन का विश्लेषण हो रहा है...',
    download_report: 'पीडीएफ रिपोर्ट डाउनलोड करें',
    listen_audio: 'ऑडियो सारांश सुनें',
    stop_audio: 'ऑडियो रोकें',
    speak_findings: 'हिंदी में बोलकर सुनाएं',
    search: 'खोजें...',
    all_categories: 'सभी श्रेणियां',
    urgent: 'अत्यावश्यक',
    critical: 'गंभीर',
    routine: 'सामान्य',
    moderate: 'मध्यम',
    board_certified: 'ACR प्रमाणित',
    rag_verified: 'PubMed सत्यापित',
    hipaa_ready: 'सुरक्षित एवं गोपनीय',
    translate_button: 'अनुवाद करें',
    language_switcher: 'भाषा बदलें',
    active_language: 'सक्रिय भाषा',
    karnataka_ramanagara: 'रामनगर 562159 (कर्नाटक)',
  },

  es: {
    app_title: 'MediScan AI',
    app_subtitle: 'Inteligencia de Diagnóstico Clínico y RAG PubMed',
    dashboard: 'Panel Principal',
    scan_intake: 'Nueva Tomografía / Escaneo',
    analysis_archive: 'Archivo de Análisis',
    reports: 'Informes Médicos',
    hospitals_near_me: 'Hospitales Cercanos',
    emergency_precautions: 'Precauciones de Emergencia AI',
    precautions_chatbot: 'Chatbot de Precauciones',
    database_store: 'Base de Datos SQLite',
    anatomy_viewer: 'Visor Anatómico 3D',
    sound_therapy: 'Terapia de Sonido y Música',
    clinical_research: 'Investigación Clínica AI',
    user_management: 'Directorio de Usuarios',
    medical_profile: 'Perfil Médico',
    logout: 'Cerrar Sesión',
    switch_role: 'Cambiar Rol',

    stay_healthy: 'Manténgase Saludable (Stay Healthy)',
    preventive_portal: 'Atención Médica Preventiva y Diagnóstico por IA',
    hero_headline: 'Imágenes Médicas Precisas y Triaje Instantáneo',
    hero_desc: 'Suba radiografías, resonancias magnéticas y tomografías con validación médica PubMed.',
    start_new_scan: 'Iniciar Nuevo Análisis',
    emergency_hotline: 'Primeros Auxilios IA 24/7',
    locate_hospitals: 'Ubicar Hospitales Cercanos',
    recent_studies: 'Estudios Diagnósticos Recientes',
    view_all_history: 'Ver Archivo Completo',
    quick_intake_card_title: 'Ingreso Diagnóstico',
    quick_intake_card_desc: 'Suba archivos DICOM, Rayos X, TC o RMN para análisis.',
    precautions_card_title: 'Primeros Auxilios IA',
    precautions_card_desc: 'Instrucciones inmediatas para dolor en el pecho, ictus, asma y traumatismos.',
    hospitals_card_title: 'Radar de Emergencias',
    hospitals_card_desc: 'Encuentre hospitales públicos gratuitos y salas de urgencias.',

    upload_scan: 'Subir Imagen / DICOM',
    select_modality: 'Seleccionar Modalidad',
    analyze_scan: 'Analizar con IA',
    analyzing: 'Analizando imagen...',
    download_report: 'Descargar Informe PDF',
    listen_audio: 'Escuchar Resumen de Audio',
    stop_audio: 'Detener Audio',
    speak_findings: 'Leer en Español',
    search: 'Buscar...',
    all_categories: 'Todas las Categorías',
    urgent: 'Urgente',
    critical: 'Crítico',
    routine: 'Rutina',
    moderate: 'Moderado',
    board_certified: 'Normas Certificadas ACR',
    rag_verified: 'Verificado por PubMed',
    hipaa_ready: 'Seguro y Confidencial',
    translate_button: 'Traducir',
    language_switcher: 'Cambiar Idioma',
    active_language: 'Idioma Activo',
    karnataka_ramanagara: 'Ramanagara 562159 (Karnataka)',
  },

  ta: {
    app_title: 'மெடிஸ்கேன் AI',
    app_subtitle: 'மருத்துவ நோயறிதல் நுண்ணறிவு தளம்',
    dashboard: 'டாஷ்போர்டு',
    scan_intake: 'புதிய ஸ்கேன் ஆய்வு',
    analysis_archive: 'முந்தைய ஆய்வுகள்',
    reports: 'மருத்துவ அறிக்கைகள்',
    hospitals_near_me: 'அருகிலுள்ள மருத்துவமனைகள்',
    emergency_precautions: 'அவசர முன்னெச்சரிக்கை AI',
    precautions_chatbot: 'முன்னெச்சரிக்கை சாட்பாட்',
    database_store: 'தரவுத்தளம் (SQLite)',
    anatomy_viewer: '3D உடற்கூறியல் பார்வையாளர்',
    sound_therapy: 'ஒலி மற்றும் இசை சிகிச்சை',
    clinical_research: 'மருத்துவ ஆராய்ச்சி AI',
    user_management: 'பயனாளர் பட்டியல்',
    medical_profile: 'மருத்துவ விவரங்கள்',
    logout: 'வெளியேறு',
    switch_role: 'பணியை மாற்றுக',

    stay_healthy: 'ஆரோக்கியமாக இருங்கள் (Stay Healthy)',
    preventive_portal: 'தடுப்பு சுகாதாரம் மற்றும் AI நோயறிதல் அமைப்பு',
    hero_headline: 'துல்லியமான மருத்துவப் படங்கள் & உடனடி வழிகாட்டல்',
    hero_desc: 'எக்ஸ்-ரே, எம்ஆர்ஐ மற்றும் சிடி ஸ்கேன்களை பதிவேற்றி உடனடி மருத்துவ வழிகாட்டல் பெறுங்கள்.',
    start_new_scan: 'புதிய ஸ்கேன் தொடங்குக',
    emergency_hotline: '24/7 அவசர முன்னெச்சரிக்கை AI',
    locate_hospitals: 'மருத்துவமனைகளை கண்டறியவும்',
    recent_studies: 'சமீபத்திய ஆய்வுகள்',
    view_all_history: 'முழுமையான வரலாறு',
    quick_intake_card_title: 'நோயறிதல் பதிவேற்றம்',
    quick_intake_card_desc: 'எக்ஸ்-ரே அல்லது எம்ஆர்ஐ ஸ்கேன்களை விரைவாக பதிவேற்றுங்கள்.',
    precautions_card_title: 'உடனடி முதலுதவி AI',
    precautions_card_desc: 'நெஞ்சு வலி, பக்கவாதம் மற்றும் அவசர நிலைகளுக்கான முதலுதவி.',
    hospitals_card_title: 'அரசு மற்றும் அவசர மருத்துவமனைகள்',
    hospitals_card_desc: '₹0 இலவச அரசு மருத்துவமனைகள் மற்றும் அவசர சிகிச்சை பிரிவுகள்.',

    upload_scan: 'படத்தை பதிவேற்றவும்',
    select_modality: 'வகையை தேர்ந்தெடுக்கவும்',
    analyze_scan: 'AI மூலம் ஆய்வு செய்க',
    analyzing: 'ஆய்வு செய்யப்படுகிறது...',
    download_report: 'PDF அறிக்கை பதிவிறக்குக',
    listen_audio: 'ஆடியோ சுருக்கத்தை கேட்கவும்',
    stop_audio: 'ஆடியோவை நிறுத்து',
    speak_findings: 'தமிழில் கேட்கவும்',
    search: 'தேடுக...',
    all_categories: 'அனைத்து பிரிவுகளும்',
    urgent: 'அவசரம்',
    critical: 'மிகவும் தீவிரமானது',
    routine: 'வழக்கமானது',
    moderate: 'நடுத்தரம்',
    board_certified: 'ACR சான்றளிக்கப்பட்டது',
    rag_verified: 'PubMed உறுதிப்படுத்தப்பட்டது',
    hipaa_ready: 'பாதுகாப்பானது',
    translate_button: 'மொழிபெயர்',
    language_switcher: 'மொழியை மாற்றவும்',
    active_language: 'செயலில் உள்ள மொழி',
    karnataka_ramanagara: 'ராமனகரா 562159 (கர்நாடகா)',
  },

  te: {
    app_title: 'మెడిస్కాన్ AI',
    app_subtitle: 'క్లినికల్ డయాగ్నస్టిక్ ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్',
    dashboard: 'డాష్‌బోర్డ్',
    scan_intake: 'కొత్త స్కాన్ తనిఖీ',
    analysis_archive: 'విశ్లేషణ చరిత్ర',
    reports: 'వైద్య నివేదికలు',
    hospitals_near_me: 'సమీప ఆసుపత్రులు',
    emergency_precautions: 'అత్యవసర జాగ్రత్తలు AI',
    precautions_chatbot: 'జాగ్రత్తల చాట్‌బాట్',
    database_store: 'డేటాబేస్ (SQLite)',
    anatomy_viewer: '3D శరీర నిర్మాణ వీక్షకుడు',
    sound_therapy: 'ధ్వని మరియు సంగీత చికిత్స',
    clinical_research: 'క్లినికల్ రీసెర్చ్ AI',
    user_management: 'వినియోగదారుల జాబితా',
    medical_profile: 'వైద్య ప్రొఫైల్',
    logout: 'లాగ్ అవుట్',
    switch_role: 'పాత్రను మార్చండి',

    stay_healthy: 'ఆరోగ్యంగా ఉండండి (Stay Healthy)',
    preventive_portal: 'నివారణ ఆరోగ్య సంరక్షణ & AI డయాగ్నస్టిక్స్',
    hero_headline: 'ఖచ్చితమైన మెడికల్ ఇమేజింగ్ & తక్షణ చికిత్స సలహా',
    hero_desc: 'PubMed పరిశోధన ఆధారంగా ఎక్స్-రే, ఎంఆర్ఐ మరియు సిటీ స్కాన్‌లను విశ్లేషించండి.',
    start_new_scan: 'కొత్త స్కాన్ విశ్లేషణ ప్రారంభించండి',
    emergency_hotline: '24/7 అత్యవసర ప్రథమ చికిత్స AI',
    locate_hospitals: 'ఆసుపత్రులను కనుగొనండి',
    recent_studies: 'ఇటీవలి నివేదికలు',
    view_all_history: 'పూర్తి రికార్డులు',
    quick_intake_card_title: 'స్కాన్ అప్‌లోడ్',
    quick_intake_card_desc: 'ఎక్స్-రే లేదా ఎంఆర్ఐ చిత్రాలను వేగంగా అప్‌లోడ్ చేయండి.',
    precautions_card_title: 'తక్షణ ప్రథమ చికిత్స AI',
    precautions_card_desc: 'ఛాతీ నొప్పి, పక్షవాతం మరియు అత్యవసర పరిస్థితులకు మార్గదర్శకాలు.',
    hospitals_card_title: 'ప్రభుత్వ & ఎమర్జెన్సీ ఆసుపత్రులు',
    hospitals_card_desc: '₹0 ఉచిత ప్రభుత్వ ఆసుపత్రులు మరియు ట్రామా కేర్ సెంటర్లు.',

    upload_scan: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    select_modality: 'రకాన్ని ఎంచుకోండి',
    analyze_scan: 'AI తో విశ్లేషించండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    download_report: 'PDF నివేదికను డౌన్‌లోడ్ చేయండి',
    listen_audio: 'ఆడియో వినండి',
    stop_audio: 'ఆడియో ఆపండి',
    speak_findings: 'తెలుగులో చదవండి',
    search: 'వెతకండి...',
    all_categories: 'అన్ని విభాగాలు',
    urgent: 'అత్యవసరం',
    critical: 'క్లిష్టమైనది',
    routine: 'సాధారణం',
    moderate: 'మధ్యస్థం',
    board_certified: 'ACR సర్టిఫైడ్',
    rag_verified: 'PubMed ధృవీకరించబడింది',
    hipaa_ready: 'సురక్షితమైనది',
    translate_button: 'అనువదించండి',
    language_switcher: 'భాష మార్చండి',
    active_language: 'ప్రస్తుత భాష',
    karnataka_ramanagara: 'రామనగర 562159 (కర్ణాటక)',
  },

  bn: {
    app_title: 'মেডিস্ক্যান AI',
    app_subtitle: 'ক্লিনিকাল ডায়াগনস্টিক ইন্টেলিজেন্স প্ল্যাটফর্ম',
    dashboard: 'ড্যাশবোর্ড',
    scan_intake: 'নতুন স্ক্যান আপলোড',
    analysis_archive: 'বিশ্লেষণ আর্কাইভ',
    reports: 'মেডিকেল রিপোর্ট',
    hospitals_near_me: 'নিকটবর্তী হাসপাতাল',
    emergency_precautions: 'জরুরি সতর্কতা AI',
    precautions_chatbot: 'সতর্কতা চ্যাটবট',
    database_store: 'ডাটাবেস (SQLite)',
    anatomy_viewer: '3D অ্যানাটমি ভিউয়ার',
    sound_therapy: 'সাউন্ড এবং মিউজিক থেরাপি',
    clinical_research: 'ক্লিনিকাল রিসার্চ AI',
    user_management: 'ব্যবহারকারী তালিকা',
    medical_profile: 'মেডিকেল প্রোফাইল',
    logout: 'লগআউট',
    switch_role: 'ভূমিকা পরিবর্তন',

    stay_healthy: 'সুস্থ থাকুন (Stay Healthy)',
    preventive_portal: 'প্রতিরোধমূলক স্বাস্থ্যসেবা এবং AI রোগ নির্ণয়',
    hero_headline: 'সঠিক মেডিকেল ইমেজিং এবং তাত্ক্ষণিক পরামর্শ',
    hero_desc: 'PubMed গবেষণার সাথে যাচাইকৃত এক্স-রে, এমআরআই এবং সিটি স্ক্যান বিশ্লেষণ করুন।',
    start_new_scan: 'নতুন স্ক্যান শুরু করুন',
    emergency_hotline: '২৪/৭ জরুরি প্রাথমিক চিকিৎসা AI',
    locate_hospitals: 'হাসপাতাল খুঁজুন',
    recent_studies: 'সাম্প্রতিক রিপোর্ট',
    view_all_history: 'সম্পূর্ণ ইতিহাস দেখুন',
    quick_intake_card_title: 'ডায়াগনস্টিক আপলোড',
    quick_intake_card_desc: 'এক্স-রে বা এমআরআই ইমেজ আপলোড করুন।',
    precautions_card_title: 'তাত্ক্ষণিক প্রাথমিক চিকিৎসা AI',
    precautions_card_desc: 'বুকে ব্যথা, স্ট্রোক এবং আঘাতের জন্য দ্রুত নির্দেশিকা।',
    hospitals_card_title: 'সরকারি ও জরুরি হাসপাতাল',
    hospitals_card_desc: '₹০ বিনামূল্যের সরকারি হাসপাতাল ও জরুরি কেন্দ্র খুঁজুন।',

    upload_scan: 'ইমেজ আপলোড করুন',
    select_modality: 'স্ক্যানের ধরন নির্বাচন করুন',
    analyze_scan: 'AI দ্বারা বিশ্লেষণ করুন',
    analyzing: 'বিশ্লেষণ করা হচ্ছে...',
    download_report: 'PDF ডাউনলোড করুন',
    listen_audio: 'অডিও শুনুন',
    stop_audio: 'অডিও বন্ধ করুন',
    speak_findings: 'বাংলায় শুনুন',
    search: 'অনুসন্ধান...',
    all_categories: 'সব বিভাগ',
    urgent: 'জরুরি',
    critical: 'মারাত্মক',
    routine: 'স্বাভাবিক',
    moderate: 'মাঝারি',
    board_certified: 'ACR প্রত্যয়িত',
    rag_verified: 'PubMed যাচাইকৃত',
    hipaa_ready: 'নিরাপদ ও সুরক্ষিত',
    translate_button: 'অনুবাদ করুন',
    language_switcher: 'ভাষা পরিবর্তন করুন',
    active_language: 'বর্তমান ভাষা',
    karnataka_ramanagara: 'রামনগর ৫৬২১৫৯ (কর্ণাটক)',
  },

  mr: {
    app_title: 'मेडिस्कॅन AI',
    app_subtitle: 'क्लिनिकल डायग्नोस्टिक इंटेलिजेंस प्लॅटफॉर्म',
    dashboard: 'डॅशबोर्ड',
    scan_intake: 'नवीन स्कॅन तपासणी',
    analysis_archive: 'तपासणी इतिहास',
    reports: 'वैद्यकीय अहवाल',
    hospitals_near_me: 'जवळपासची रुग्णालये',
    emergency_precautions: 'तातडीची खबरदारी AI',
    precautions_chatbot: 'खबरदारी चॅटबॉट',
    database_store: 'डेटाबेस (SQLite)',
    anatomy_viewer: '3D शरीररचना दर्शक',
    sound_therapy: 'ध्वनी व संगीत थेरपी',
    clinical_research: 'क्लिनिकल रिसर्च AI',
    user_management: 'वापरकर्ते यादी',
    medical_profile: 'वैद्यकीय प्रोफाइल',
    logout: 'लॉग आउट',
    switch_role: 'भूमिका बदला',

    stay_healthy: 'निरोगी राहा (Stay Healthy)',
    preventive_portal: 'प्रतिबंधात्मक आरोग्यसेवा व AI निदान',
    hero_headline: 'अचूक वैद्यकीय इमेजिंग आणि त्वरित मार्गदर्शन',
    hero_desc: 'PubMed मार्गदर्शक तत्त्वांनुसार तपासलेले एक्स-रे आणि एमआरआय अपलोड करा.',
    start_new_scan: 'नवीन स्कॅन सुरू करा',
    emergency_hotline: '24/7 प्रथमोपचार AI',
    locate_hospitals: 'रुग्णालये शोधा',
    recent_studies: 'अलीकडील अहवाल',
    view_all_history: 'संपूर्ण इतिहास पहा',
    quick_intake_card_title: 'स्कॅन अपलोड',
    quick_intake_card_desc: 'एक्स-रे किंवा सीटी स्कॅन त्वरित अपलोड करा.',
    precautions_card_title: 'त्वरित प्रथमोपचार AI',
    precautions_card_desc: 'छातीत दुखणे, पक्षाघात आणि आपत्कालीन परिस्थितीसाठी सूचना.',
    hospitals_card_title: 'शासकीय व आपत्कालीन रुग्णालये',
    hospitals_card_desc: '₹0 मोफत शासकीय रुग्णालये व ट्रॉमा सेंटर शोधा.',

    upload_scan: 'इमेज अपलोड करा',
    select_modality: 'प्रकार निवडा',
    analyze_scan: 'AI द्वारे तपासा',
    analyzing: 'तपासणी सुरू आहे...',
    download_report: 'PDF अहवाल डाउनलोड करा',
    listen_audio: 'ऑडिओ ऐका',
    stop_audio: 'ऑडिओ थांबवा',
    speak_findings: 'मराठीत ऐका',
    search: 'शोधा...',
    all_categories: 'सर्व वर्ग',
    urgent: 'तातडीचे',
    critical: 'अतिगंभीर',
    routine: 'सामान्य',
    moderate: 'मध्यम',
    board_certified: 'ACR प्रमाणित',
    rag_verified: 'PubMed प्रमाणित',
    hipaa_ready: 'सुरक्षित',
    translate_button: 'भाषांतर करा',
    language_switcher: 'भाषा बदला',
    active_language: 'सक्रिय भाषा',
    karnataka_ramanagara: 'रामनगर 562159 (कर्नाटक)',
  },

  fr: {
    app_title: 'MediScan AI',
    app_subtitle: 'Intelligence de Diagnostic Clinique et RAG PubMed',
    dashboard: 'Tableau de Bord',
    scan_intake: 'Nouvelle Analyse',
    analysis_archive: 'Archive des Analyses',
    reports: 'Rapports Médicaux',
    hospitals_near_me: 'Hôpitaux à Proximité',
    emergency_precautions: 'Précautions d\'Urgence AI',
    precautions_chatbot: 'Chatbot de Précautions',
    database_store: 'Base de Données SQLite',
    anatomy_viewer: 'Visualiseur Anatomique 3D',
    sound_therapy: 'Thérapie Sonore et Musicale',
    clinical_research: 'Recherche Clinique AI',
    user_management: 'Répertoire Utilisateurs',
    medical_profile: 'Profil Médical',
    logout: 'Déconnexion',
    switch_role: 'Changer de Rôle',

    stay_healthy: 'Restez en Bonne Santé (Stay Healthy)',
    preventive_portal: 'Santé Préventive et Moteur de Diagnostic IA',
    hero_headline: 'Imagerie Médicale Précise et Triage Immédiat',
    hero_desc: 'Téléchargez des radiographies, IRM et scanners validés par les directives PubMed.',
    start_new_scan: 'Commencer une Nouvelle Analyse',
    emergency_hotline: 'Premiers Secours IA 24/7',
    locate_hospitals: 'Trouver un Hôpital',
    recent_studies: 'Études Diagnostiques Récentes',
    view_all_history: 'Voir Toutes les Archives',
    quick_intake_card_title: 'Admission Diagnostique',
    quick_intake_card_desc: 'Téléversez des images DICOM, Rayons X ou IRM.',
    precautions_card_title: 'Premiers Secours IA',
    precautions_card_desc: 'Directives d\'urgence pour douleurs thoraciques, AVC, et traumatismes.',
    hospitals_card_title: 'Hôpitaux Publics et Urgences',
    hospitals_card_desc: 'Trouvez des hôpitaux publics gratuits et des centres d\'urgence 24/7.',

    upload_scan: 'Téléverser Image / DICOM',
    select_modality: 'Sélectionner la Modalité',
    analyze_scan: 'Analyser avec l\'IA',
    analyzing: 'Analyse en cours...',
    download_report: 'Télécharger le Rapport PDF',
    listen_audio: 'Écouter le Résumé Audio',
    stop_audio: 'Arrêter l\'Audio',
    speak_findings: 'Lire en Français',
    search: 'Rechercher...',
    all_categories: 'Toutes Catégories',
    urgent: 'Urgent',
    critical: 'Critique',
    routine: 'Routine',
    moderate: 'Modéré',
    board_certified: 'Certifié ACR',
    rag_verified: 'Vérifié PubMed',
    hipaa_ready: 'Sécurisé et Conforme',
    translate_button: 'Traduire',
    language_switcher: 'Changer de Langue',
    active_language: 'Langue Active',
    karnataka_ramanagara: 'Ramanagara 562159 (Karnataka)',
  },

  de: {
    app_title: 'MediScan AI',
    app_subtitle: 'Klinische Diagnostische Intelligenz & PubMed RAG',
    dashboard: 'Übersicht',
    scan_intake: 'Neuer Scan',
    analysis_archive: 'Analyse-Archiv',
    reports: 'Medizinische Berichte',
    hospitals_near_me: 'Krankenhäuser in der Nähe',
    emergency_precautions: 'Notfall-Vorsichtsmaßnahmen KI',
    precautions_chatbot: 'Vorsichtsmaßnahmen-Chatbot',
    database_store: 'SQLite Datenbank',
    anatomy_viewer: '3D Anatomie-Betrachter',
    sound_therapy: 'Klang- und Musiktherapie',
    clinical_research: 'Klinische Forschung KI',
    user_management: 'Benutzerverzeichnis',
    medical_profile: 'Medizinisches Profil',
    logout: 'Abmelden',
    switch_role: 'Rolle wechseln',

    stay_healthy: 'Bleiben Sie Gesund (Stay Healthy)',
    preventive_portal: 'Präventive Gesundheitsversorgung & KI-Diagnostik',
    hero_headline: 'Präzise Medizinische Bildgebung & Sofortige Triage',
    hero_desc: 'Laden Sie Röntgen-, MRT- und CT-Bilder hoch, verifiziert mit PubMed-Richtlinien.',
    start_new_scan: 'Neue Analyse Starten',
    emergency_hotline: '24/7 Notfall-Erste-Hilfe KI',
    locate_hospitals: 'Kliniken Finden',
    recent_studies: 'Aktuelle Diagnosen',
    view_all_history: 'Vollständiges Archiv',
    quick_intake_card_title: 'Diagnostische Aufnahme',
    quick_intake_card_desc: 'Laden Sie DICOM-, Röntgen- oder MRT-Scans hoch.',
    precautions_card_title: 'Sofortige Erste Hilfe KI',
    precautions_card_desc: 'Maßnahmen bei Brustschmerz, Schlaganfall, Atemnot und Trauma.',
    hospitals_card_title: 'Öffentliche Kliniken & Notaufnahme',
    hospitals_card_desc: 'Finden Sie kostenlose Krankenhäuser und 24/7 Notaufnahmen.',

    upload_scan: 'Bild / DICOM Hochladen',
    select_modality: 'Modalität Wählen',
    analyze_scan: 'Mit KI Analysieren',
    analyzing: 'Wird analysiert...',
    download_report: 'PDF-Bericht Herunterladen',
    listen_audio: 'Audio-Zusammenfassung Hören',
    stop_audio: 'Audio Stoppen',
    speak_findings: 'Auf Deutsch Vorlesen',
    search: 'Suchen...',
    all_categories: 'Alle Kategorien',
    urgent: 'Dringend',
    critical: 'Kritisch',
    routine: 'Routine',
    moderate: 'Moderat',
    board_certified: 'ACR Zertifiziert',
    rag_verified: 'PubMed Verifiziert',
    hipaa_ready: 'Sicher & Konform',
    translate_button: 'Übersetzen',
    language_switcher: 'Sprache Ändern',
    active_language: 'Aktive Sprache',
    karnataka_ramanagara: 'Ramanagara 562159 (Karnataka)',
  },

  ar: {
    app_title: 'ميديسكان AI (MediScan AI)',
    app_subtitle: 'منصة الذكاء الاصطناعي للتشخيص السريري وإرشادات PubMed',
    dashboard: 'لوحة التحكم',
    scan_intake: 'فحص طبي جديد',
    analysis_archive: 'أرشيف التحليلات',
    reports: 'التقارير الطبية',
    hospitals_near_me: 'المستشفيات القريبة',
    emergency_precautions: 'إرشادات الطوارئ بالذكاء الاصطناعي',
    precautions_chatbot: 'مساعد الإسعافات والطوارئ',
    database_store: 'قاعدة البيانات (SQLite)',
    anatomy_viewer: 'عارض التشريح ثلاثي الأبعاد 3D',
    sound_therapy: 'العلاج بالصوت والموسيقى',
    clinical_research: 'الأبحاث السريرية AI',
    user_management: 'دليل المستخدمين',
    medical_profile: 'الملف الطبي',
    logout: 'تسجيل الخروج',
    switch_role: 'تبديل الدور السريري',

    stay_healthy: 'حافظ على صحتك (Stay Healthy)',
    preventive_portal: 'الرعاية الصحية الوقائية ومحرك التشخيص الذكي',
    hero_headline: 'تصوير طبي دقيق وفرز سريري فوري',
    hero_desc: 'قم برفع الأشعة السينية والرنين المغناطيسي والأشعة المقطعية المعتمدة بأبحاث PubMed.',
    start_new_scan: 'بدء تحليل فحص جديد',
    emergency_hotline: 'إسعافات أولية ذكية 24/7',
    locate_hospitals: 'العثور على المستشفيات القريبة',
    recent_studies: 'أحدث الدراسات التشخيصية',
    view_all_history: 'عرض الأرشيف الكامل',
    quick_intake_card_title: 'تسجيل الفحص',
    quick_intake_card_desc: 'رفع صور الأشعة السينية أو الرنين المغناطيسي للتحليل.',
    precautions_card_title: 'إسعافات أولية فورية',
    precautions_card_desc: 'إرشادات عاجلة لألم الصدر، السكتة الدماغية، وضيق التنفس.',
    hospitals_card_title: 'المستشفيات العامة والطوارئ',
    hospitals_card_desc: 'ابحث عن المستشفيات الحكومية المجانية ومراكز الطوارئ 24/7.',

    upload_scan: 'رفع صورة / ملف DICOM',
    select_modality: 'اختيار نوع الفحص',
    analyze_scan: 'التحليل بالذكاء الاصطناعي',
    analyzing: 'جارٍ التحليل السريري...',
    download_report: 'تحميل التقرير PDF',
    listen_audio: 'الاستماع للملخص الصوتي',
    stop_audio: 'إيقاف الصوت',
    speak_findings: 'قراءة باللغة العربية',
    search: 'بحث...',
    all_categories: 'جميع الفئات',
    urgent: 'عاجل',
    critical: 'حرج للغاية',
    routine: 'روتيني',
    moderate: 'متوسط',
    board_certified: 'معتمد وفق معايير ACR',
    rag_verified: 'موثق عبر PubMed',
    hipaa_ready: 'آمن ومحمي',
    translate_button: 'ترجمة',
    language_switcher: 'تغيير اللغة',
    active_language: 'اللغة الحالية',
    karnataka_ramanagara: 'راماناغارا 562159 (كارناتاكا)',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageInfo: LanguageInfo;
  languages: LanguageInfo[];
  t: (key: string, fallback?: string) => string;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  translateClinicalText: (text: string, targetLang?: LanguageCode) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'mediscan_preferred_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
    // Update HTML dir attribute for RTL languages (like Arabic)
    document.documentElement.dir = currentLanguageInfo.direction;
    document.documentElement.lang = language;
  }, [language, currentLanguageInfo]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // fallback to english
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_~[\]()]/g, ' ').slice(0, 800);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLanguageInfo.speechCode;
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Dynamic clinical text translator querying the backend AI translation service
  const translateClinicalText = async (text: string, targetLang?: LanguageCode): Promise<string> => {
    const target = targetLang || language;
    if (target === 'en' || !text.trim()) {
      return text;
    }

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang: target,
          sourceLang: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('Translation API response not OK');
      }

      const data = await response.json();
      if (data.success && data.translatedText) {
        return data.translatedText;
      }
    } catch (err) {
      console.warn('Live translation fallback error:', err);
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageInfo,
        languages: SUPPORTED_LANGUAGES,
        t,
        speakText,
        stopSpeaking,
        isSpeaking,
        translateClinicalText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

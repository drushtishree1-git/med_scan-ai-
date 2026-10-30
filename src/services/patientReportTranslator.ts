import { PatientFriendlySummary } from '../types';

export type SupportedReportLanguage = 
  | 'en' // English
  | 'es' // Spanish
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'fr' // French
  | 'de' // German
  | 'ar'; // Arabic

/**
 * Common medical jargon dictionary with patient-friendly plain-English translations
 */
export const MEDICAL_JARGON_DICTIONARY: Record<string, { en: string; es?: string; hi?: string }> = {
  'consolidation': {
    en: 'An area of lung tissue that has filled with liquid or mucus instead of air, commonly caused by pneumonia.',
    es: 'Área del tejido pulmonar que se ha llenado de líquido o moco en lugar de aire, comúnmente por neumonía.',
    hi: 'फेफड़े के ऊतकों का वह हिस्सा जो हवा के बजाय तरल या बलगम से भर गया है, जो आमतौर पर निमोनिया के कारण होता है।'
  },
  'infiltrate': {
    en: 'A substance such as fluid or inflammatory cells that has gathered in lung tissues.',
    es: 'Sustancia como líquido o células inflamatorias acumuladas en los tejidos pulmonares.',
    hi: 'फेफड़ों के ऊतकों में जमा हुआ तरल या सूजन पैदा करने वाली कोशिकाएं।'
  },
  'effusion': {
    en: 'An abnormal buildup of fluid in a body space, such as around the lungs (pleural effusion).',
    es: 'Acumulación anormal de líquido en un espacio del cuerpo, como alrededor de los pulmones.',
    hi: 'शरीर के किसी हिस्से में असामान्य तरल का जमाव, जैसे फेफड़ों के चारों ओर पानी भरना।'
  },
  'pleural effusion': {
    en: 'Fluid pooling between the thin layers of tissue lining your lungs and chest wall.',
    es: 'Líquido acumulado entre las capas que recubren los pulmones y la pared torácica.',
    hi: 'फेफड़ों और छाती की दीवार के बीच तरल का एकत्रित होना।'
  },
  'atelectasis': {
    en: 'A partial collapse or deflation of small air sacs in the lung, often temporary.',
    es: 'Colapso parcial de los alvéolos en el pulmón, con frecuencia reversible.',
    hi: 'फेफड़ों की छोटी वायु थैलियों का अस्थायी रूप से सिकुड़ जाना।'
  },
  'cardiomegaly': {
    en: 'An enlarged heart, which can happen from high blood pressure or heart workload.',
    es: 'Corazón agrandado, a menudo debido a presión arterial alta o sobreesfuerzo.',
    hi: 'दिल का आकार सामान्य से बड़ा होना, जो उच्च रक्तचाप के कारण हो सकता है।'
  },
  'microcytic': {
    en: 'Red blood cells that are smaller than normal, frequently seen with iron deficiency.',
    es: 'Glóbulos rojos más pequeños de lo normal, a menudo por falta de hierro.',
    hi: 'लाल रक्त कोशिकाओं का सामान्य से छोटा होना, जो अक्सर आयरन की कमी में होता है।'
  },
  'hypochromic': {
    en: 'Red blood cells that are paler than usual because they carry less iron-rich hemoglobin.',
    es: 'Glóbulos rojos más pálidos de lo habitual por contener menos hemoglobina.',
    hi: 'कम हीमोग्लोबिन के कारण लाल रक्त कोशिकाओं का हल्का दिखना।'
  },
  'rdw': {
    en: 'Red Cell Distribution Width — a measure of how varied your red blood cells are in size.',
    es: 'Variación en el tamaño de los glóbulos rojos en sangre.',
    hi: 'लाल रक्त कोशिकाओं के आकार में विभिन्नता का सूचकांक।'
  },
  'creatinine': {
    en: 'A normal waste product from muscles that healthy kidneys filter out through urine.',
    es: 'Producto de desecho muscular que los riñones sanos eliminan en la orina.',
    hi: 'मांसपेशियों का अपशिष्ट उत्पाद जिसे स्वस्थ गुर्दे मूत्र द्वारा बाहर निकालते हैं।'
  },
  'egfr': {
    en: 'Estimated Glomerular Filtration Rate — a score indicating how effectively your kidneys filter blood.',
    es: 'Tasa que indica con qué eficiencia los riñones filtran la sangre.',
    hi: 'गुर्दों द्वारा रक्त को छानने की गति और क्षमता का माप।'
  },
  'hematocrit': {
    en: 'The percentage of your blood that is made up of red blood cells.',
    es: 'Porcentaje de la sangre compuesto por glóbulos rojos.',
    hi: 'रक्त में लाल रक्त कोशिकाओं का प्रतिशत।'
  },
  'hemoglobin': {
    en: 'The protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
    es: 'Proteína de los glóbulos rojos que transporta oxígeno a todo el cuerpo.',
    hi: 'लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो फेफड़ों से पूरे शरीर में ऑक्सीजन पहुंचाता है।'
  },
  'flair': {
    en: 'A specialized MRI view that dims normal brain fluid so swelling or inflammation shows up bright.',
    es: 'Secuencia de resonancia que atenúa el líquido normal para resaltar la inflamación.',
    hi: 'एमआरआई का विशेष दृश्य जो सूजन या बदलाव को स्पष्ट रूप से उभारता है।'
  },
  'hyperintensity': {
    en: 'A bright white spot on an MRI scan that indicates swelling, inflammation, or tissue changes.',
    es: 'Zona brillante en la resonancia que indica inflamación o cambios en el tejido.',
    hi: 'एमआरआई पर चमकने वाला सफेद धब्बा जो सूजन या ऊतक में बदलाव दर्शाता है।'
  },
  'glioma': {
    en: 'A type of growth or tumor originating from the supportive glial cells of the brain.',
    es: 'Tipo de tumor que se origina en las células gliales del cerebro.',
    hi: 'मस्तिष्क की सहायक कोशिकाओं से उत्पन्न होने वाला ट्यूमर या गांठ।'
  },
  'meningioma': {
    en: 'A tumor growing from the protective membranes (meninges) surrounding the brain and spinal cord.',
    es: 'Tumor que crece en las meninges que protegen el cerebro y la médula espinal.',
    hi: 'मस्तिष्क और रीढ़ की हड्डी को ढकने वाली झिल्ली में विकसित होने वाली गांठ।'
  },
  'pituitary': {
    en: 'The pea-sized "master gland" at the base of the brain that controls hormone balances in the body.',
    es: 'Glándula maestra en la base del cerebro que regula las hormonas corporales.',
    hi: 'मस्तिष्क के निचले हिस्से में स्थित मुख्य ग्रंथि जो शरीर के हार्मोन को नियंत्रित करती है।'
  },
  'edema': {
    en: 'Swelling caused by excess fluid trapped in the body tissues.',
    es: 'Hinchazón causada por exceso de líquido atrapado en los tejidos.',
    hi: 'शरीर के ऊतकों में अतिरिक्त तरल इकट्ठा होने से उत्पन्न सूजन।'
  }
};

interface LocalizedReportContent {
  statusHeading: string;
  plainEnglishExplanation: string;
  keyTakeaways: string[];
  actionSteps: string[];
  questionsForDoctor: string[];
}

const LOCALIZED_TEMPLATES: Record<string, Record<SupportedReportLanguage, LocalizedReportContent>> = {
  normal: {
    en: {
      statusHeading: 'Good News: No Concerning Abnormalities Detected',
      plainEnglishExplanation: 'Your examination was reviewed thoroughly. The evaluated tissues and markers show no signs of active infection, swelling, or structural damage. Everything looks within healthy reference boundaries for someone in your age group.',
      keyTakeaways: [
        'Your scan/report shows normal, healthy organ structure and balanced vital levels.',
        'No signs of active bacterial infection, fluid buildup, or abnormal tissue growth.',
        'No emergency medical intervention is needed based on these findings.'
      ],
      actionSteps: [
        'Maintain your standard daily health routine, balanced nutrition, and hydration.',
        'Keep your upcoming routine follow-up or annual physical checkup as scheduled.',
        'Let your doctor know if you develop new or unexpected symptoms in the future.'
      ],
      questionsForDoctor: [
        'Do I need any routine follow-up tests next year or should I stick to my regular schedule?',
        'Are there any lifestyle or dietary habits I should keep doing to maintain these healthy results?',
        'Can I get a copy of this normal baseline report for my personal health records?'
      ]
    },
    es: {
      statusHeading: 'Buenas noticias: No se detectaron anomalías preocupantes',
      plainEnglishExplanation: 'Su estudio fue revisado detalladamente. Los tejidos y marcadores evaluados no muestran signos de infección activa, inflamación ni daño estructural. Todo se encuentra dentro de los límites saludables esperados.',
      keyTakeaways: [
        'Su estudio muestra órganos sanos y niveles equilibrados.',
        'Sin signos de infección bacteriana, acumulación de líquido o crecimiento anormal.',
        'No se requiere ninguna intervención médica de urgencia según estos resultados.'
      ],
      actionSteps: [
        'Mantenga su rutina diaria de salud, alimentación equilibrada e hidratación.',
        'Continúe con sus chequeos preventivos anuales programados.',
        'Avise a su médico si presenta algún síntoma nuevo en el futuro.'
      ],
      questionsForDoctor: [
        '¿Debo programar algún examen de control el próximo año o sigo mi calendario habitual?',
        '¿Qué hábitos de vida me recomienda mantener para preservar estos buenos resultados?',
        '¿Puedo conservar una copia de este reporte normal para mi historial médico?'
      ]
    },
    hi: {
      statusHeading: 'शुभ समाचार: कोई चिंताजनक असामान्यता नहीं पाई गई',
      plainEnglishExplanation: 'आपकी जांच का संपूर्ण विश्लेषण किया गया है। जांचे गए अंगों और रक्त मापदंडों में सक्रिय संक्रमण, सूजन या क्षति का कोई संकेत नहीं मिला है। सभी परिणाम स्वस्थ सीमा के भीतर हैं।',
      keyTakeaways: [
        'आपकी रिपोर्ट सामान्य, स्वस्थ अंग संरचना और संतुलित स्तर दर्शाती है।',
        'संक्रमण, तरल संचय या असामान्य गांठ का कोई लक्षण नहीं है।',
        'इन परिणामों के आधार पर किसी आपातकालीन उपचार की आवश्यकता नहीं है।'
      ],
      actionSteps: [
        'अपनी नियमित दिनचर्या, पौष्टिक आहार और पर्याप्त पानी का सेवन जारी रखें।',
        'अपने नियमित वार्षिक स्वास्थ्य परीक्षण को समय पर कराएं।',
        'यदि भविष्य में कोई नया लक्षण महसूस हो तो अपने चिकित्सक को सूचित करें।'
      ],
      questionsForDoctor: [
        'क्या मुझे अगले साल कोई नियमित जांच करानी होगी या मेरा वर्तमान कार्यक्रम ठीक है?',
        'इन स्वस्थ परिणामों को बनाए रखने के लिए मुझे क्या आहार या आदतें जारी रखनी चाहिए?',
        'क्या मुझे भविष्य के संदर्भ के लिए इस सामान्य रिपोर्ट की एक प्रति रखनी चाहिए?'
      ]
    },
    kn: {
      statusHeading: 'ಶುಭ ಸುದ್ದಿ: ಯಾವುದೇ ಆತಂಕಕಾರಿ ಅಸಹಜತೆ ಕಂಡುಬಂದಿಲ್ಲ',
      plainEnglishExplanation: 'ನಿಮ್ಮ ಪರೀಕ್ಷೆಯನ್ನು ಕೂಲಂಕಷವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಪರಿಶೀಲಿಸಿದ ಅಂಗಾಂಶಗಳು ಮತ್ತು ರಕ್ತದ ಮಟ್ಟಗಳು ಆರೋಗ್ಯಕರ ಮಿತಿಯಲ್ಲಿದ್ದು, ಯಾವುದೇ ಸೋಂಕು ಅಥವಾ ಊತದ ಲಕ್ಷಣಗಳಿಲ್ಲ.',
      keyTakeaways: [
        'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಸಾಮಾನ್ಯ ಮತ್ತು ಆರೋಗ್ಯಕರ ಅಂಗ ರಚನೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
        'ಯಾವುದೇ ಸಕ್ರಿಯ ಸೋಂಕು ಅಥವಾ ದ್ರವ ಸಂಗ್ರಹ ಕಂಡುಬಂದಿಲ್ಲ.',
        'ತುರ್ತು ಚಿಕಿತ್ಸೆಯ ಅಗತ್ಯವಿಲ್ಲ.'
      ],
      actionSteps: [
        'ದೈನಂದಿನ ಸಮತೋಲಿತ ಆಹಾರ ಮತ್ತು ನೀರಿನ ಸೇವನೆಯನ್ನು ಮುಂದುವರಿಸಿ.',
        'ವಾರ್ಷಿಕ ತಪಾಸಣೆಯನ್ನು ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಮಾಡಿಸಿಕೊಳ್ಳಿ.',
        'ಹೊಸ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದರೆ ತಕ್ಷಣ ವೈದ್ಯರಿಗೆ ತಿಳಿಸಿ.'
      ],
      questionsForDoctor: [
        'ಮುಂದಿನ ವರ್ಷ ನನಗೆ ಯಾವುದೇ ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆಯೇ?',
        'ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ನಾನು ಯಾವ ಕ್ರಮಗಳನ್ನು ಮುಂದುವರಿಸಬೇಕು?'
      ]
    },
    ta: {
      statusHeading: 'நல்ல செய்தி: கவலைப்படக்கூடிய குறைபாடுகள் எதுவும் இல்லை',
      plainEnglishExplanation: 'உங்கள் மருத்துவ பரிசோதனை முழுமையாக மதிப்பாய்வு செய்யப்பட்டது. பரிசோதிக்கப்பட்ட திசுக்கள் மற்றும் இரத்த அளவுகள் ஆரோக்கியமான வரம்பிற்குள் உள்ளன.',
      keyTakeaways: [
        'உங்கள் அறிக்கை இயல்பான ஆரோக்கியமான உறுப்பு அமைப்பைக் காட்டுகிறது.',
        'தீவிர தொற்று அல்லது திரவக் குவிப்புக்கான அறிகுறிகள் இல்லை.',
        'அவசர சிகிச்சை தேவையில்லை.'
      ],
      actionSteps: [
        'சீரான உணவு மற்றும் நீர் அருந்துவதை பராமரிக்கவும்.',
        'வழக்கமான பரிசோதனைகளை திட்டமிட்டபடி தொடரவும்.'
      ],
      questionsForDoctor: [
        'அடுத்த ஆண்டு நான் ஏதேனும் பரிசோதனை செய்ய வேண்டுமா?'
      ]
    },
    te: {
      statusHeading: 'మంచి వార్త: ఎటువంటి ఆందోళనకరమైన సమస్యలు లేవు',
      plainEnglishExplanation: 'మీ వైద్య నివేదిక పరిశీలించబడింది. శరీర భాగాలు మరియు రక్త సూచికలు సాధారణ మరియు ఆరోగ్యకరమైన పరిమితుల్లో ఉన్నాయి.',
      keyTakeaways: [
        'మీ నివేదిక సాధారణ ఆరోగ్యకరమైన స్థితిని చూపుతోంది.',
        'ఎటువంటి తీవ్రమైన ఇన్ఫెక్షన్ సంకేతాలు లేవు.'
      ],
      actionSteps: [
        'మంచి ఆహారం మరియు పుష్కలంగా నీరు త్రాగడం కొనసాగించండి.'
      ],
      questionsForDoctor: [
        'నేను సాధారణ ఆరోగ్య నియమాలను ఎలా కొనసాగించాలి?'
      ]
    },
    fr: {
      statusHeading: 'Bonne nouvelle : Aucune anomalie préoccupante détectée',
      plainEnglishExplanation: 'Votre examen a été analysé en détail. Les tissus et paramètres évalués ne montrent aucun signe d’infection active, d’inflammation ou de dommage structurel. Tout se situe dans les limites normales.',
      keyTakeaways: [
        'Votre examen confirme des organes sains et des constantes équilibrées.',
        'Aucun signe d’infection bactérienne ou d’accumulation liquidienne.',
        'Aucune intervention médicale urgente n’est requise.'
      ],
      actionSteps: [
        'Conservez une alimentation saine, une bonne hydratation et votre rythme de vie.',
        'Poursuivez vos consultations de routine planifiées.'
      ],
      questionsForDoctor: [
        'Dois-je prévoir un bilan de contrôle l’année prochaine ?'
      ]
    },
    de: {
      statusHeading: 'Gute Nachrichten: Keine besorgniserregenden Auffälligkeiten',
      plainEnglishExplanation: 'Ihre Untersuchung wurde sorgfältig ausgewertet. Das untersuchte Gewebe und die Werte zeigen keinerlei Anzeichen einer aktiven Infektion, Schwellung oder strukturellen Schädigung.',
      keyTakeaways: [
        'Ihre Untersuchung zeigt gesunde Organstrukturen im Normbereich.',
        'Keine Hinweise auf Infektionen oder pathologische Flüssigkeitsansammlungen.',
        'Keine Akutbehandlung erforderlich.'
      ],
      actionSteps: [
        'Behalten Sie Ihre gewohnte gesunde Ernährung und Lebensweise bei.',
        'Nehmen Sie Ihre regulären Vorsorgeuntersuchungen wahr.'
      ],
      questionsForDoctor: [
        'Wann empfehlen Sie den nächsten Routine-Checkup?'
      ]
    },
    ar: {
      statusHeading: 'أخبار سارة: لم يتم رصد أي مؤشرات مقلقة',
      plainEnglishExplanation: 'تمت مراجعة نتائج الفحص بدقة. الأنسجة والمؤشرات الحيوية طبيعية تماماً ولا توجد علامات على وجود عدوى نشطة أو التهاب أو تلف.',
      keyTakeaways: [
        'الفحص يؤكد سلامة الأعضاء والمؤشرات الحيوية.',
        'لا توجد علامات لعدوى أو تراكم للسوائل.',
        'لا توجد حاجة لأي تدخل علاجي طارئ.'
      ],
      actionSteps: [
        'الحفاظ على التغذية المتوازنة وشرب كميات كافية من الماء.',
        'متابعة الفحوصات الدورية في موعدها المعتاد.'
      ],
      questionsForDoctor: [
        'هل أحتاج إلى فحوصات متابعة روتينية في المستقبل؟'
      ]
    }
  },
  pneumonia: {
    en: {
      statusHeading: 'Attention: Signs of a Lung Infection (Pneumonia) Found',
      plainEnglishExplanation: 'Your chest X-ray shows cloudy patches (called consolidation) in your lung. This means part of your lung has filled with fluid or mucus instead of clear air, which is a classic sign of pneumonia (a chest infection). This explains symptoms like coughing, fever, or shortness of breath.',
      keyTakeaways: [
        'An infection is causing localized fluid buildup in your lung airspace.',
        'This is a treatable condition that usually responds well to prescription medications.',
        'It is important to rest and follow your doctor’s prescribed treatment plan completely.'
      ],
      actionSteps: [
        'Start your prescribed medication (such as antibiotics) promptly and finish the entire course.',
        'Rest comfortably and drink plenty of warm liquids (water, broth, herbal tea).',
        'Seek emergency medical care immediately if you have severe trouble breathing, blue lips, or sudden confusion.'
      ],
      questionsForDoctor: [
        'What type of pneumonia do you suspect (bacterial or viral), and what medicine will help most?',
        'How many days before I should expect my fever or cough to start improving?',
        'When should I schedule a follow-up chest X-ray to make sure my lungs have completely cleared?'
      ]
    },
    es: {
      statusHeading: 'Atención: Signos de infección pulmonar (Neumonía) detectados',
      plainEnglishExplanation: 'Su radiografía de tórax muestra manchas nubosas (llamadas consolidación) en el pulmón. Esto significa que una parte del pulmón se ha llenado de líquido o mucosidad en lugar de aire limpio, lo cual es característico de una neumonía. Esto explica síntomas como tos, fiebre o dificultad para respirar.',
      keyTakeaways: [
        'Una infección ha causado acumulación de líquido en los espacios aéreos del pulmón.',
        'Es una afección tratable que responde adecuadamente a medicamentos recetados.',
        'Es esencial descansar y completar todo el tratamiento indicado por su médico.'
      ],
      actionSteps: [
        'Inicie los medicamentos recetados (como antibióticos) y complete el ciclo entero.',
        'Descanse y beba abundantes líquidos tibios (agua, caldos, infusiones).',
        'Acuda a urgencias si experimenta dificultad respiratoria grave, labios azulados o confusión.'
      ],
      questionsForDoctor: [
        '¿Qué tipo de neumonía sospecha (bacteriana o viral) y qué medicamento es el más indicado?',
        '¿En cuántos días debería comenzar a bajar la fiebre o disminuir la tos?',
        '¿Cuándo debo programar una radiografía de control para verificar que el pulmón haya sanado?'
      ]
    },
    hi: {
      statusHeading: 'ध्यान दें: फेफड़ों में संक्रमण (निमोनिया) के लक्षण पाए गए',
      plainEnglishExplanation: 'आपके सीने के एक्स-रे में फेफड़े में सफेद घने धब्बे (कंसॉलिडेशन) दिखाई दे रहे हैं। इसका अर्थ है कि फेफड़े के एक हिस्से में हवा के स्थान पर बलगम या तरल जमा हो गया है, जो निमोनिया (छाती के संक्रमण) का मुख्य संकेत है। इसी कारण खांसी, बुखार या सांस लेने में परेशानी हो सकती है।',
      keyTakeaways: [
        'संक्रमण के कारण फेफड़ों में तरल जमा हो गया है।',
        'यह एक उपचार योग्य स्थिति है जो निर्धारित दवाओं से ठीक हो जाती है।',
        'पूरा आराम करना और चिकित्सक द्वारा दी गई दवा का कोर्स पूरा करना अत्यंत आवश्यक है।'
      ],
      actionSteps: [
        'डॉक्टर द्वारा दी गई दवाएं (जैसे एंटीबायोटिक्स) तुरंत शुरू करें और पूरा कोर्स लें।',
        'पर्याप्त आराम करें और गर्म तरल पदार्थ (पानी, सूप, काढ़ा) अधिक मात्रा में पिएं।',
        'यदि सांस लेने में बहुत कठिनाई हो, होंठ नीले पड़ने लगें तो तुरंत आपातकालीन चिकित्सा सहायता लें।'
      ],
      questionsForDoctor: [
        'यह किस प्रकार का निमोनिया है (बैक्टीरियल या वायरल) और कौन सी दवा सबसे प्रभावी होगी?',
        'कितने दिनों में बुखार और खांसी में सुधार होने लगेगा?',
        'फेफड़ों के पूरी तरह ठीक होने की पुष्टि के लिए दोबारा एक्स-रे कब कराना होगा?'
      ]
    },
    kn: {
      statusHeading: 'ಗಮನಿಸಿ: ಶ್ವಾಸಕೋಶದ ಸೋಂಕು (ನ್ಯುಮೋನಿಯಾ) ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ',
      plainEnglishExplanation: 'ನಿಮ್ಮ ಎದೆಯ ಎಕ್ಸ್-ರೇಯಲ್ಲಿ ಶ್ವಾಸಕೋಶದಲ್ಲಿ ದ್ರವ ಸಂಗ್ರಹವಾಗಿರುವುದು ಕಂಡುಬಂದಿದೆ. ಇದು ನ್ಯುಮೋನಿಯಾ ಸೋಂಕಿನ ಸಾಮಾನ್ಯ ಲಕ್ಷಣವಾಗಿದ್ದು, ಕೆಮ್ಮು, ಜ್ವರ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.',
      keyTakeaways: [
        'ಶ್ವಾಸಕೋಶದಲ್ಲಿ ಸೋಂಕಿನಿಂದ ದ್ರವ ಸಂಗ್ರಹವಾಗಿದೆ.',
        'ಔಷಧಿಗಳ ಮೂಲಕ ಇದನ್ನು ಗುಣಪಡಿಸಬಹುದು.',
        'ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಔಷಧಿಗಳ ಕೋರ್ಸ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.'
      ],
      actionSteps: [
        'ಸೂಚಿಸಿದ ಪ್ರತಿಜೀವಕ (ಆಂಟಿಬಯೋಟಿಕ್) ಔಷಧಿಗಳನ್ನು ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಸೇವಿಸಿ.',
        'ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ಸಾಕಷ್ಟು ಬಿಸಿ ನೀರು ಕುಡಿಯಿರಿ.'
      ],
      questionsForDoctor: [
        'ಜ್ವರ ಮತ್ತು ಕೆಮ್ಮು ಎಷ್ಟು ದಿನಗಳಲ್ಲಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ?',
        'ಮತ್ತೆ ಎಕ್ಸ್-ರೇ ಪರೀಕ್ಷೆಯನ್ನು ಯಾವಾಗ ಮಾಡಿಸಬೇಕು?'
      ]
    },
    ta: {
      statusHeading: 'கவனம்: நுரையீரல் தொற்று (நிமோனியா) அறிகுறிகள் கண்டறியப்பட்டன',
      plainEnglishExplanation: 'உங்கள் மார்பு எக்ஸ்-ரேயில் நுரையீரலில் நீர் அல்லது சளி சேர்ந்திருப்பது தெரிகிறது. இது நிமோனியா தொற்றின் அறிகுறியாகும், இதனால் இருமல் மற்றும் காய்ச்சல் ஏற்படலாம்.',
      keyTakeaways: [
        'தொற்று காரணமாக நுரையீரலில் நீர் கோர்த்துள்ளது.',
        'சரியான மருந்துகளால் இதை முற்றிலும் குணப்படுத்த முடியும்.'
      ],
      actionSteps: [
        'மருத்துவர் பரிந்துரைத்த மருந்துகளை முழுமையாக உட்கொள்ளவும்.',
        'நன்கு ஓய்வெடுத்து வெதுவெதுப்பான நீர் அருந்தவும்.'
      ],
      questionsForDoctor: [
        'எத்தனை நாட்களில் இந்த காய்ச்சல் குறையும்?'
      ]
    },
    te: {
      statusHeading: 'శ్రద్ధ వహించండి: ఊపిరితిత్తుల ఇన్ఫెక్షన్ (న్యుమోనియా) సంకేతాలు',
      plainEnglishExplanation: 'మీ ఛాతీ ఎక్స్-రేలో ఊపిరితిత్తులలో ద్రవం చేరినట్లు కనిపిస్తోంది. ఇది న్యుమోనియా లక్షణం, దీని వల్ల దగ్గు మరియు జ్వరం రావచ్చు.',
      keyTakeaways: [
        'ఇన్ఫెక్షన్ వల్ల ఊపిరితిత్తులలో సమస్య ఏర్పడింది.',
        'మందులతో ఇది నయమవుతుంది.'
      ],
      actionSteps: [
        'డాక్టర్ సూచించిన మందుల కోర్సును పూర్తిగా వాడండి.'
      ],
      questionsForDoctor: [
        'ఎన్ని రోజుల్లో కోలుకోవచ్చు?'
      ]
    },
    fr: {
      statusHeading: 'Attention : Signes d’infection pulmonaire (Pneumonie) détectés',
      plainEnglishExplanation: 'Votre radiographie pulmonaire montre une opacité (consolidation). Une zone de vos poumons s’est remplie de liquide au lieu d’air, ce qui est caractéristique d’une pneumonie et explique la toux ou la fièvre.',
      keyTakeaways: [
        'Une infection a provoqué une accumulation de liquide dans les alvéoles.',
        'C’est une affection traitable qui réagit bien aux antibiotiques appropriés.',
        'Le repos et le respect de la prescription complète sont indispensables.'
      ],
      actionSteps: [
        'Débutez les antibiotiques prescrits sans attendre et suivez le traitement jusqu’au bout.',
        'Hydratez-vous avec des boissons chaudes et reposez-vous.'
      ],
      questionsForDoctor: [
        'En combien de temps la fièvre devrait-elle baisser ?',
        'Quand prévoir une radiographie de contrôle ?'
      ]
    },
    de: {
      statusHeading: 'Achtung: Anzeichen einer Lungenentzündung (Pneumonie)',
      plainEnglishExplanation: 'Ihr Röntgenbild zeigt Verschattungen im Lungenbereich. Ein Teil des Lungengewebes hat sich mit Sekret gefüllt, was typisch für eine Lungenentzündung ist und Husten sowie Fieber erklärt.',
      keyTakeaways: [
        'Eine Infektion führt zu Flüssigkeitsansammlungen in den Lungenbläschen.',
        'Gut behandelbare Erkrankung bei konsequenter Medikamenteneinnahme.',
        'Ruhe und die vollständige Einnahme der verordneten Antibiotika sind essenziell.'
      ],
      actionSteps: [
        'Nehmen Sie das verschriebene Antibiotikum lückenlos zu Ende.',
        'Schonen Sie sich und trinken Sie ausreichend warme Flüssigkeiten.'
      ],
      questionsForDoctor: [
        'Wann sollte eine Nachkontrolle mittels Röntgen erfolgen?'
      ]
    },
    ar: {
      statusHeading: 'تنبيه: علامات التهاب رئوي (النيومونيا)',
      plainEnglishExplanation: 'أظهرت الأشعة السينية وجود عتامة في الرئة تدل على تجمع إفرازات وسوائل، وهي علامة شائعة للالتهاب الرئوي وتفسر السعال وارتفاع الحرارة.',
      keyTakeaways: [
        'عدوى تسببت في تجمع السوائل داخل أنسجة الرئة.',
        'حالة قابلة للعلاج وتستجيب للمضادات الحيوية المناسبة.',
        'الراحة والالتزام التام بكورس العلاج أمر أساسي.'
      ],
      actionSteps: [
        'البدء فوراً بالعلاج الموصوف وإكماله للنهاية.',
        'الراحة التامة والإكثار من السوائل الدافئة.'
      ],
      questionsForDoctor: [
        'كم يوماً يحتاج التحسن الملحوظ في الحرارة والسعال؟'
      ]
    }
  },
  brain_tumor: {
    en: {
      statusHeading: 'Specialist Review Needed: Focal Brain Tissue Change Identified',
      plainEnglishExplanation: 'Your brain MRI shows an area of localized tissue change with swelling. This requires a dedicated consultation with a neurologist or neurosurgeon to determine the exact nature of the tissue and discuss the best management options.',
      keyTakeaways: [
        'A specific area of your brain scan shows tissue density differences that need expert attention.',
        'Modern imaging provides precise details that help doctors create a targeted, personalized care plan.',
        'A timely consultation with a neurology specialist is strongly recommended.'
      ],
      actionSteps: [
        'Schedule a formal review with a neurologist or neurosurgeon as soon as possible.',
        'Bring a digital copy (CD/USB or portal access) of your MRI scan to your specialist appointment.',
        'Keep a daily symptom diary noting any headaches, vision shifts, or balance changes.'
      ],
      questionsForDoctor: [
        'What type of tissue growth does this MRI appear most consistent with?',
        'Do you recommend further imaging, like a contrast-enhanced MRI or functional scan?',
        'What are our next steps for treatment, observation, or symptom relief?'
      ]
    },
    es: {
      statusHeading: 'Consulta con especialista requerida: Cambio focal en tejido cerebral',
      plainEnglishExplanation: 'Su resonancia magnética cerebral muestra una zona de alteración de tejido con inflamación localizada. Esto requiere una consulta con neurología o neurocirugía para determinar la naturaleza del tejido y establecer el mejor plan de manejo.',
      keyTakeaways: [
        'Una zona del cerebro muestra diferencias de densidad que requieren atención especializada.',
        'Las imágenes modernas permiten planificar un cuidado altamente personalizado.',
        'Se recomienda una consulta pronta con el especialista en neurología.'
      ],
      actionSteps: [
        'Coordine una cita con el neurólogo o neurocirujano lo antes posible.',
        'Lleve consigo el archivo digital del estudio a su consulta médica.',
        'Lleve un registro diario de dolores de cabeza, visión o equilibrio.'
      ],
      questionsForDoctor: [
        '¿Con qué tipo de tejido u origen es más compatible este hallazgo?',
        '¿Recomienda algún estudio adicional con contraste?',
        '¿Cuáles son las opciones de tratamiento o seguimiento recomendadas?'
      ]
    },
    hi: {
      statusHeading: 'विशेषज्ञ परामर्श आवश्यक: मस्तिष्क में ऊतक परिवर्तन देखा गया',
      plainEnglishExplanation: 'आपकी मस्तिष्क एमआरआई में एक विशेष स्थान पर ऊतक में बदलाव और सूजन दिखाई दे रही है। इसकी सटीक प्रकृति और उचित उपचार योजना तय करने के लिए न्यूरोलॉजिस्ट या न्यूरोसर्जन से परामर्श लेना आवश्यक है।',
      keyTakeaways: [
        'मस्तिष्क के एक हिस्से में बदलाव दिखा है जिस पर विशेषज्ञ डॉक्टर का ध्यान जरूरी है।',
        'आधुनिक इमेजिंग से डॉक्टर आपके लिए सटीक और व्यक्तिगत उपचार योजना बना सकते हैं।',
        'न्यूरोलॉजी विशेषज्ञ से समय पर परामर्श लेने की प्रबल अनुशंसा की जाती है।'
      ],
      actionSteps: [
        'जितनी जल्दी हो सके किसी अनुभवी न्यूरोलॉजिस्ट या न्यूरोसर्जन से समय लें।',
        'परामर्श के समय अपनी एमआरआई स्कैन की सीडी या डिजिटल फाइल साथ लेकर जाएं।',
        'सिरदर्द, दृष्टि में बदलाव या चक्कर आने से संबंधित लक्षणों की डायरी रखें।'
      ],
      questionsForDoctor: [
        'यह बदलाव किस प्रकार की गांठ या समस्या से सबसे अधिक मेल खाता है?',
        'क्या किसी अन्य कंट्रास्ट एमआरआई या विशेष जांच की आवश्यकता होगी?',
        'उपचार या निगरानी के लिए हमारे अगले कदम क्या होने चाहिए?'
      ]
    },
    kn: {
      statusHeading: 'ತಜ್ಞರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ: ಮೆದುಳಿನ ಅಂಗಾಂಶದಲ್ಲಿ ಬದಲಾವಣೆ',
      plainEnglishExplanation: 'ನಿಮ್ಮ ಮೆದುಳಿನ ಎಂಆರ್‌ಐ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ಜಾಗದಲ್ಲಿ ಊತ ಅಥವಾ ಬದಲಾವಣೆ ಕಂಡುಬಂದಿದೆ. ನ್ಯೂರೋ ಸರ್ಜನ್ ಅಥವಾ ನರರೋಗ ತಜ್ಞರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸುವುದು ಅಗತ್ಯವಾಗಿದೆ.',
      keyTakeaways: [
        'ಮೆದುಳಿನ ಭಾಗದಲ್ಲಿ ತಜ್ಞರ ಗಮನ ಅಗತ್ಯವಿರುವ ಬದಲಾವಣೆ ಕಂಡುಬಂದಿದೆ.',
        'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ತಜ್ಞರನ್ನು ಭೇಟಿ ಮಾಡುವುದು ಮುಖ್ಯ.'
      ],
      actionSteps: [
        'ಸಾಧ್ಯವಾದಷ್ಟು ಬೇಗ ನರರೋಗ ತಜ್ಞರನ್ನು (ನ್ಯೂರಾಲಜಿಸ್ಟ್) ಭೇಟಿ ಮಾಡಿ.',
        'ಎಂಆರ್‌ಐ ಸ್ಕ್ಯಾನ್ ಪ್ರತಿಯನ್ನು ವೈದ್ಯರ ಬಳಿಗೆ ಕೊಂಡೊಯ್ಯಿರಿ.'
      ],
      questionsForDoctor: [
        'ಮುಂದಿನ ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳೇನು?'
      ]
    },
    ta: {
      statusHeading: 'நரம்பியல் நிபுணர் ஆலோசனை தேவை: மூளை திசுக்களில் மாற்றம்',
      plainEnglishExplanation: 'உங்கள் மூளை எம்.ஆர்.ஐ பரிசோதனையில் ஒரு குறிப்பிட்ட பகுதியில் மாற்றம் மற்றும் வீக்கம் காணப்படுகிறது. நரம்பியல் நிபுணரை உடனடியாக அணுகுவது நல்லது.',
      keyTakeaways: [
        'சிறப்பு மருத்துவர் பரிசோதனை அவசியம்.',
        'விரைவான ஆலோசனை துல்லியமான சிகிச்சைக்கு உதவும்.'
      ],
      actionSteps: [
        'நரம்பியல் மருத்துவரிடம் ஆலோசனை பெறவும்.',
        'எம்.ஆர்.ஐ ஸ்கேன் நகலை மருத்துவரிடம் எடுத்துச் செல்லவும்.'
      ],
      questionsForDoctor: [
        'அடுத்த கட்ட சிகிச்சை என்ன?'
      ]
    },
    te: {
      statusHeading: 'నిపుణుడి సంప్రదింపు అవసరం: మెదడు భాగంలో మార్పు',
      plainEnglishExplanation: 'మీ బ్రెయిన్ ఎంఆర్ఐలో ఒక ప్రాంతంలో మార్పులు గమనించబడ్డాయి. న్యూరాలజిస్ట్‌ను సంప్రదించి తదుపరి చికిత్స నిర్ణయించాలి.',
      keyTakeaways: [
        'నిపుణుల పరిశీలన అవసరం.'
      ],
      actionSteps: [
        'న్యూరాలజిస్ట్‌తో అపాయింట్‌మెంట్ తీసుకోండి.'
      ],
      questionsForDoctor: [
        'తదుపరి చర్యలు ఏమిటి?'
      ]
    },
    fr: {
      statusHeading: 'Avis spécialisé requis : Modification tissulaire cérébrale focale',
      plainEnglishExplanation: 'Votre IRM cérébrale montre une zone d’altération tissulaire avec œdème localisé. Une consultation approfondie avec un neurologue ou neurochirurgien est recommandée afin de préciser la prise en charge.',
      keyTakeaways: [
        'Une région cérébrale requiert l’évaluation d’un spécialiste.',
        'L’imagerie moderne permet une approche thérapeutique ciblée et personnalisée.'
      ],
      actionSteps: [
        'Prenez rendez-vous rapidement avec un neurologue ou neurochirurgien.',
        'Munissez-vous du CD ou des clichés de l’IRM lors de la consultation.'
      ],
      questionsForDoctor: [
        'Quelles sont les options de suivi ou d’intervention envisageables ?'
      ]
    },
    de: {
      statusHeading: 'Facharztkonsultation erforderlich: Fokale zerebrale Gewebeveränderung',
      plainEnglishExplanation: 'Ihr MRT zeigt eine umschriebene Gewebeveränderung im Gehirn mit Begleitödem. Zur genauen Einordnung ist eine zeitnahe Vorstellung beim Neurologen oder Neurochirurgen angeraten.',
      keyTakeaways: [
        'Befund bedarf der gezielten neurologischen Begutachtung.',
        'Präzise Bildgebung bildet die Grundlage für eine maßgeschneiderte Therapie.'
      ],
      actionSteps: [
        'Vereinbaren Sie zeitnah einen Termin beim Facharzt.',
        'Bringen Sie die MRT-Aufnahmen auf Datenträger zum Termin mit.'
      ],
      questionsForDoctor: [
        'Welche therapeutischen oder diagnostischen Schritte folgen nun?'
      ]
    },
    ar: {
      statusHeading: 'استشارة أخصائي مطلوبة: تغير موضعي في أنسجة الدماغ',
      plainEnglishExplanation: 'أظهرت أشعة الرنين المغناطيسي وجود تغير موضعي وتورم في نسيج الدماغ، مما يتطلب استشارة طبيب أعصاب أو جراح أعصاب لتحديد الإجراء الأنسب.',
      keyTakeaways: [
        'النتائج تتطلب مراجعة فورية من أخصائي المخ والأعصاب.',
        'التشخيص الدقيق يساعد في وضع خطة علاجية مخصصة ومبكرة.'
      ],
      actionSteps: [
        'حجز موعد عاجل مع استشاري المخ والأعصاب.',
        'إحضار صور وتقارير الرنين المغناطيسي معك للموعد.'
      ],
      questionsForDoctor: [
        'ما هي الخيارات العلاجية أو المتابعة الموصى بها؟'
      ]
    }
  }
};

/**
 * Generate a comprehensive patient-friendly explanation from clinical text, category, and modality,
 * with full multi-language localization.
 */
export function generatePatientFriendlySummary(
  clinicalSummary: string,
  categoryOrModality: string = 'Radiology',
  title: string = 'Medical Report',
  targetLanguage: SupportedReportLanguage = 'en'
): PatientFriendlySummary {
  const text = (clinicalSummary + ' ' + title).toLowerCase();

  const isPneumonia = /pneu|consol|infiltr|broncho|lobar/i.test(text);
  const isBrainTumor = /glioma|meningioma|pituitary|mass effect|edema|intra-axial/i.test(text);
  const isNormal = /normal|clear|unremarkable|intact|aerated|no acute|within normal limits|healthy/i.test(text) && !isPneumonia && !isBrainTumor;

  // Determine key
  const templateKey = isNormal ? 'normal' : isPneumonia ? 'pneumonia' : isBrainTumor ? 'brain_tumor' : 'normal';
  const trafficLightStatus: 'green' | 'yellow' | 'red' = isNormal ? 'green' : (isPneumonia || isBrainTumor ? 'red' : 'yellow');

  const chosenPack = LOCALIZED_TEMPLATES[templateKey]?.[targetLanguage] || LOCALIZED_TEMPLATES[templateKey]['en'];

  // Jargon terms
  const jargonGlossary: { term: string; explanation: string }[] = [];
  Object.keys(MEDICAL_JARGON_DICTIONARY).forEach((term) => {
    if (text.includes(term.toLowerCase()) && jargonGlossary.length < 5) {
      const capTerm = term.charAt(0).toUpperCase() + term.slice(1);
      const dictItem = MEDICAL_JARGON_DICTIONARY[term];
      const localizedExp = (targetLanguage === 'es' && dictItem.es)
        ? dictItem.es
        : (targetLanguage === 'hi' && dictItem.hi)
        ? dictItem.hi
        : dictItem.en;

      jargonGlossary.push({
        term: capTerm,
        explanation: localizedExp
      });
    }
  });

  if (jargonGlossary.length === 0) {
    if (targetLanguage === 'es') {
      jargonGlossary.push(
        { term: 'Rango de Referencia', explanation: 'Valores esperados en el 95% de las personas sanas.' },
        { term: 'Diagnóstico Diferencial', explanation: 'Lista de posibles causas que explican los síntomas.' }
      );
    } else if (targetLanguage === 'hi') {
      jargonGlossary.push(
        { term: 'रेफरेंस रेंज (संदर्भ सीमा)', explanation: 'स्वस्थ व्यक्तियों में सामान्य रूप से पाए जाने वाले स्तर।' },
        { term: 'डिफरेंशियल डायग्नोसिस', explanation: 'संभावित कारणों की सूची जो लक्षणों की व्याख्या करती है।' }
      );
    } else {
      jargonGlossary.push(
        { term: 'Reference Range', explanation: 'The set of normal numbers expected in 95% of healthy individuals.' },
        { term: 'Differential Diagnosis', explanation: 'A list of possible conditions that could explain your symptoms.' }
      );
    }
  }

  return {
    trafficLightStatus,
    statusHeading: chosenPack.statusHeading,
    plainEnglishExplanation: chosenPack.plainEnglishExplanation,
    keyTakeaways: chosenPack.keyTakeaways,
    actionSteps: chosenPack.actionSteps,
    questionsForDoctor: chosenPack.questionsForDoctor,
    jargonGlossary
  };
}

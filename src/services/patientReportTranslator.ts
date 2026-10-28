import { PatientFriendlySummary } from '../types';

/**
 * Common medical jargon dictionary with patient-friendly plain-English translations
 */
export const MEDICAL_JARGON_DICTIONARY: Record<string, string> = {
  'consolidation': 'An area of lung tissue that has filled with liquid or mucus instead of air, commonly caused by pneumonia.',
  'infiltrate': 'A substance such as fluid or inflammatory cells that has gathered in lung tissues.',
  'effusion': 'An abnormal buildup of fluid in a body space, such as around the lungs (pleural effusion).',
  'pleural effusion': 'Fluid pooling between the thin layers of tissue lining your lungs and chest wall.',
  'atelectasis': 'A partial collapse or deflation of small air sacs in the lung, often temporary.',
  'cardiomegaly': 'An enlarged heart, which can happen from high blood pressure or heart workload.',
  'microcytic': 'Red blood cells that are smaller than normal, frequently seen with iron deficiency.',
  'hypochromic': 'Red blood cells that are paler than usual because they carry less iron-rich hemoglobin.',
  'rdw': 'Red Cell Distribution Width — a measure of how varied your red blood cells are in size.',
  'creatinine': 'A normal waste product from muscles that healthy kidneys filter out through urine.',
  'egfr': 'Estimated Glomerular Filtration Rate — a score indicating how effectively your kidneys filter blood.',
  'hematocrit': 'The percentage of your blood that is made up of red blood cells.',
  'hemoglobin': 'The protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
  'flair': 'A specialized MRI view that dims normal brain fluid so swelling or inflammation shows up bright.',
  'hyperintensity': 'A bright white spot on an MRI scan that indicates swelling, inflammation, or tissue changes.',
  'glioma': 'A type of growth or tumor originating from the supportive glial cells of the brain.',
  'meningioma': 'A tumor growing from the protective membranes (meninges) surrounding the brain and spinal cord.',
  'pituitary': 'The pea-sized "master gland" at the base of the brain that controls hormone balances in the body.',
  'adenoma': 'A non-cancerous (benign) growth of glandular tissue.',
  'edema': 'Swelling caused by excess fluid trapped in the body tissues.',
  'parenchyma': 'The main functional tissue of an organ (such as the brain or lungs) as opposed to the blood vessels.',
  'vasogenic': 'Related to fluid leaking from blood vessels into surrounding tissues, causing localized swelling.',
  'leukocytosis': 'A higher-than-normal count of white blood cells, typically a sign the immune system is fighting an infection.',
  'thrombocytopenia': 'A lower-than-normal number of platelets, the blood cells responsible for clotting.'
};

/**
 * Generate a comprehensive patient-friendly explanation from clinical text, category, and modality
 */
export function generatePatientFriendlySummary(
  clinicalSummary: string,
  categoryOrModality: string = 'Radiology',
  title: string = 'Medical Report'
): PatientFriendlySummary {
  const text = (clinicalSummary + ' ' + title).toLowerCase();

  // Detect condition and severity
  const isPneumonia = /pneu|consol|infiltr|broncho|lobar/i.test(text);
  const isBrainTumor = /glioma|meningioma|pituitary|mass effect|edema|intra-axial/i.test(text);
  const isAnemia = /anemia|microcytic|hypochromic|iron deficiency|low hemoglobin/i.test(text);
  const isKidneyIssue = /creatinine|egfr|renal|kidney|nephro/i.test(text);
  const isHeartIssue = /cardiomegaly|cardiac|heart failure|troponin|ef /i.test(text);
  const isNormal = /normal|clear|unremarkable|intact|aerated|no acute|within normal limits|healthy/i.test(text) && !isPneumonia && !isBrainTumor;

  // Determine traffic light status
  let trafficLightStatus: 'green' | 'yellow' | 'red' = 'green';
  let statusHeading = 'All Clear: Your Results Look Healthy and Normal';
  let plainEnglishExplanation = '';
  let keyTakeaways: string[] = [];
  let actionSteps: string[] = [];
  let questionsForDoctor: string[] = [];

  if (isNormal) {
    trafficLightStatus = 'green';
    statusHeading = 'Good News: No Concerning Abnormalities Detected';
    plainEnglishExplanation = 
      'Your examination was reviewed thoroughly. The evaluated tissues and markers show no signs of active infection, swelling, or structural damage. Everything looks within healthy reference boundaries for someone in your age group.';
    keyTakeaways = [
      'Your scan/report shows normal, healthy organ structure and balanced vital levels.',
      'No signs of active bacterial infection, fluid buildup, or abnormal tissue growth.',
      'No emergency medical intervention is needed based on these findings.'
    ];
    actionSteps = [
      'Maintain your standard daily health routine, balanced nutrition, and hydration.',
      'Keep your upcoming routine follow-up or annual physical checkup as scheduled.',
      'Let your doctor know if you develop new or unexpected symptoms in the future.'
    ];
    questionsForDoctor = [
      'Do I need any routine follow-up tests next year or should I stick to my regular schedule?',
      'Are there any lifestyle or dietary habits I should keep doing to maintain these healthy results?',
      'Can I get a copy of this normal baseline report for my personal health records?'
    ];
  } else if (isPneumonia) {
    trafficLightStatus = 'red';
    statusHeading = 'Attention: Signs of a Lung Infection (Pneumonia) Found';
    plainEnglishExplanation = 
      'Your chest X-ray shows cloudy patches (called consolidation) in your lung. This means part of your lung has filled with fluid or mucus instead of clear air, which is a classic sign of pneumonia (a chest infection). This explains symptoms like coughing, fever, or shortness of breath.';
    keyTakeaways = [
      'An infection is causing localized fluid buildup in your lung airspace.',
      'This is a treatable condition that usually responds well to prescription medications.',
      'It is important to rest and follow your doctor’s prescribed treatment plan completely.'
    ];
    actionSteps = [
      'Start your prescribed medication (such as antibiotics) promptly and finish the entire course.',
      'Rest comfortably and drink plenty of warm liquids (water, broth, herbal tea).',
      'Seek emergency medical care immediately if you have severe trouble breathing, blue lips, or sudden confusion.'
    ];
    questionsForDoctor = [
      'What type of pneumonia do you suspect (bacterial or viral), and what medicine will help most?',
      'How many days before I should expect my fever or cough to start improving?',
      'When should I schedule a follow-up chest X-ray to make sure my lungs have completely cleared?'
    ];
  } else if (isBrainTumor) {
    trafficLightStatus = 'red';
    statusHeading = 'Specialist Review Needed: Focal Brain Tissue Change Identified';
    plainEnglishExplanation = 
      'Your brain MRI shows an area of localized tissue change with swelling. This requires a dedicated consultation with a neurologist or neurosurgeon to determine the exact nature of the tissue and discuss the best management options.';
    keyTakeaways = [
      'A specific area of your brain scan shows tissue density differences that need expert attention.',
      'Modern imaging provides precise details that help doctors create a targeted, personalized care plan.',
      'A timely consultation with a neurology specialist is strongly recommended.'
    ];
    actionSteps = [
      'Schedule a formal review with a neurologist or neurosurgeon as soon as possible.',
      'Bring a digital copy (CD/USB or portal access) of your MRI scan to your specialist appointment.',
      'Keep a daily symptom diary noting any headaches, vision shifts, or balance changes.'
    ];
    questionsForDoctor = [
      'What type of tissue growth does this MRI appear most consistent with?',
      'Do you recommend further imaging, like a contrast-enhanced MRI or functional scan?',
      'What are our next steps for treatment, observation, or symptom relief?'
    ];
  } else if (isAnemia) {
    trafficLightStatus = 'yellow';
    statusHeading = 'Moderate Notice: Red Blood Cell Levels Are Lower Than Expected';
    plainEnglishExplanation = 
      'Your blood test shows that your red blood cells are smaller or fewer in number than normal (mild anemia). Because red blood cells carry oxygen throughout your body, lower levels can cause you to feel tired, cold, or easily fatigued.';
    keyTakeaways = [
      'Your red blood cell count or iron indicators are slightly below optimal levels.',
      'This is very common and typically treatable through diet adjustments or iron supplements.',
      'Finding the underlying cause (like nutrition or iron absorption) will help prevent it from returning.'
    ];
    actionSteps = [
      'Discuss taking an iron supplement or vitamin B12 with your doctor before starting.',
      'Incorporate iron-rich foods (spinach, beans, lentils, lean meats) and vitamin C into your meals.',
      'Re-check your blood count (CBC) in 6 to 8 weeks to track your improvement.'
    ];
    questionsForDoctor = [
      'Is my low red blood cell level related to iron deficiency, and what supplement dose do you recommend?',
      'Could any of my current medications or diet habits be contributing to this?',
      'When would you like me to repeat this blood test to check my progress?'
    ];
  } else if (isKidneyIssue) {
    trafficLightStatus = 'yellow';
    statusHeading = 'Moderate Notice: Kidney Filtration Markers Need Monitoring';
    plainEnglishExplanation = 
      'Your kidney blood markers show a slight elevation in creatinine or a change in filtration rate. The kidneys are your body’s natural filters, and these levels can fluctuate based on hydration, exercise, or certain pain relievers.';
    keyTakeaways = [
      'Kidney filtration markers are slightly outside the standard range and should be monitored.',
      'Temporary dehydration or common medications (like NSAIDs/ibuprofen) can temporarily elevate these markers.',
      'Simple lifestyle adjustments and staying well-hydrated often help normalize these levels.'
    ];
    actionSteps = [
      'Drink 6 to 8 glasses of water daily unless your physician has placed you on a fluid restriction.',
      'Avoid overusing over-the-counter NSAID pain medications (such as ibuprofen or naproxen).',
      'Have your doctor review any daily medications that may interact with kidney function.'
    ];
    questionsForDoctor = [
      'Could dehydration or recent physical activity have caused these kidney numbers?',
      'Do I need to adjust any of my daily blood pressure or pain medications?',
      'When should we repeat this lab panel to make sure my levels are steady?'
    ];
  } else if (isHeartIssue) {
    trafficLightStatus = 'yellow';
    statusHeading = 'Notice: Cardiovascular Indicators Need Review';
    plainEnglishExplanation = 
      'Your study notes some changes in heart size or cardiovascular markers. Your heart muscle may be working harder than usual, which is commonly seen with high blood pressure or valve conditions.';
    keyTakeaways = [
      'Cardiovascular markers suggest your heart has been working under extra workload.',
      'Managing blood pressure, salt intake, and physical activity plays a major role in heart wellness.',
      'A cardiologist review or echocardiogram ultrasound can give a clearer picture of your heart function.'
    ];
    actionSteps = [
      'Monitor your blood pressure daily at home and record the numbers.',
      'Limit high-sodium processed foods and stay active with gentle daily walks.',
      'Contact your physician right away if you experience sudden chest tightness or breathlessness.'
    ];
    questionsForDoctor = [
      'Would an echocardiogram (heart ultrasound) give us more detailed information?',
      'What is my target blood pressure number to keep my heart protected?',
      'Are there specific exercises or physical activities that are safest for me right now?'
    ];
  } else {
    trafficLightStatus = 'yellow';
    statusHeading = 'Medical Report Summary: Review Findings with Your Doctor';
    plainEnglishExplanation = 
      'Your medical report contains clinical notes that summarize observations from your recent test. Some markers or findings differ slightly from standard baseline averages and should be reviewed together with your primary physician.';
    keyTakeaways = [
      'Your test provides helpful diagnostic clues for your healthcare team.',
      'A full clinical diagnosis is made by combining this report with your physical exam and symptoms.',
      'Reviewing these findings with your doctor will ensure you have the best care plan.'
    ];
    actionSteps = [
      'Bring this summary to your next doctor appointment or telehealth consult.',
      'Write down any questions or symptoms you’ve noticed over the past week.',
      'Follow your physician’s instructions regarding any follow-up tests.'
    ];
    questionsForDoctor = [
      'What do these specific findings mean for my day-to-day health and activities?',
      'Do I need any follow-up tests or treatments based on this report?',
      'Are there any warning signs I should watch out for at home?'
    ];
  }

  // Find relevant jargon terms mentioned in the text
  const jargonGlossary: { term: string; explanation: string }[] = [];
  Object.keys(MEDICAL_JARGON_DICTIONARY).forEach((term) => {
    if (text.includes(term.toLowerCase()) && jargonGlossary.length < 5) {
      const capTerm = term.charAt(0).toUpperCase() + term.slice(1);
      jargonGlossary.push({
        term: capTerm,
        explanation: MEDICAL_JARGON_DICTIONARY[term]
      });
    }
  });

  // Always include at least 2 general terms if none matched
  if (jargonGlossary.length === 0) {
    jargonGlossary.push(
      { term: 'Reference Range', explanation: 'The set of normal numbers expected in 95% of healthy individuals.' },
      { term: 'Differential Diagnosis', explanation: 'A list of possible conditions that could explain your symptoms.' }
    );
  }

  return {
    trafficLightStatus,
    statusHeading,
    plainEnglishExplanation,
    keyTakeaways,
    actionSteps,
    questionsForDoctor,
    jargonGlossary
  };
}

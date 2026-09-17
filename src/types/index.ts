export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  specialization?: string;
  department?: string;
  licenseNumber?: string;
  patientId?: string;
  phone?: string;
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  hospitalAffiliation?: string;
  createdAt: string;
}

export type AnalysisModality = 
  | 'xray' 
  | 'mri' 
  | 'ct' 
  | 'ultrasound'
  | 'derm' 
  | 'retinal' 
  | 'lab_report' 
  | 'pathology';

export type AnalysisStatus = 
  | 'queued' 
  | 'processing' 
  | 'completed' 
  | 'flagged' 
  | 'reviewed';

export type AnalysisUrgency = 'routine' | 'moderate' | 'urgent' | 'critical';

export interface PubMedCitation {
  pmid: string;
  title: string;
  journal: string;
  year: string;
  doi?: string;
  url: string;
  evidenceLevel: string;
  keyEvidence: string;
  crossValidationMatch: string;
}

export interface RAGDoubleVerification {
  verified: boolean;
  consensusScore: number;
  evidenceSummary: string;
  ragKnowledgeBase: string;
  pubMedCitations: PubMedCitation[];
  peerReviewConsensus: string;
}

export interface ClinicalPrescriptionItem {
  medication: string;
  genericName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  indication: string;
  contraindications: string[];
  pharmacistNotes: string;
  rxType: 'Primary Rx' | 'Supportive Rx' | 'Symptomatic Relief';
}

export interface ClinicalPrecautions {
  immediateDirectives: string[];
  lifestyleAndActivity: string[];
  dietaryAndHydration: string[];
  criticalContraindications: string[];
  redFlagEmergencySymptoms: string[];
  postScanMonitoring?: string[];
}

export interface TreatmentAndManagementOptions {
  conservativeTherapy: string[];
  interventionalOrSurgical: string[];
  adjunctRehabilitation: string[];
  followUpImagingTimeline: string[];
}

export interface TrainedModelResult {
  modelName: string;
  classification: string;
  confidenceScore: number;
  confidencePercentage: string;
  probabilities: {
    NORMAL: number;
    PNEUMONIA: number;
    [key: string]: number;
  };
  status?: string;
}

export interface LabTestItem {
  testName: string;
  observedValue: string;
  units: string;
  referenceInterval: string;
  flag: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  clinicalSignificance: string;
}

export interface LabPanel {
  panelName: string;
  results: LabTestItem[];
}

export interface LabReportAnalysis {
  reportMetadata?: {
    laboratoryName?: string;
    reportDate?: string;
    patientDetails?: {
      patientName?: string;
      age?: string;
      gender?: string;
      specimenType?: string;
    };
  };
  overallSummary?: string;
  labPanels?: LabPanel[];
  criticalOrAbnormalFindings?: string[];
  differentialInterpretations?: string[];
  physicianRecommendations?: string[];
  patientFriendlyGuidance?: {
    keyTakeaways?: string[];
    questionsToAskDoctor?: string[];
  };
}

export interface AnalysisRecord {
  id: string;
  title: string;
  modality: AnalysisModality;
  status: AnalysisStatus;
  urgency: AnalysisUrgency;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  submittedAt: string;
  completedAt?: string;
  symptoms?: string[];
  clinicalNotes?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  primaryFindingSummary?: string;
  confidenceScore?: number;
  tags: string[];
  trainedModelInference?: TrainedModelResult;
  ragVerification?: RAGDoubleVerification;
  prescriptions?: ClinicalPrescriptionItem[];
  precautions?: ClinicalPrecautions;
  treatmentOptions?: TreatmentAndManagementOptions;
  labReportData?: LabReportAnalysis;
}

export interface MedicalReport {
  id: string;
  reportNumber: string;
  title: string;
  category: 'Radiology' | 'Pathology' | 'Laboratory' | 'Cardiology' | 'Discharge Summary';
  patientId: string;
  patientName: string;
  physicianName: string;
  date: string;
  status: 'Final' | 'Preliminary' | 'Addendum';
  fileFormat: 'PDF' | 'DICOM' | 'DOCX';
  fileSize: string;
  department: string;
  summary: string;
  ragVerification?: RAGDoubleVerification;
  prescriptions?: ClinicalPrescriptionItem[];
  precautions?: ClinicalPrecautions;
  treatmentOptions?: TreatmentAndManagementOptions;
}

export interface ClinicalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
  linkTo?: string;
}

export interface LoginSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  timestamp: string;
  device: string;
  ipAddress: string;
  status: 'Active' | 'Closed' | 'Revoked';
  location: string;
}

export interface MedicalFacility {
  id: string;
  name: string;
  category: 'Hospital' | 'Imaging Center' | 'Diagnostic Lab' | 'Urgent Care' | 'Radiology Specialty';
  address: string;
  lat: number;
  lng: number;
  phone: string;
  emergencyPhone?: string;
  rating: number;
  reviewCount: number;
  openHours: string;
  services: string[];
  distanceKm?: number;
  estimatedDriveTimeMin?: number;
  traumaLevel?: string;
  hasEmergencyRoom?: boolean;
  isOpenNow?: boolean;
  waitTimesMin?: number;
  consultationFee?: string;
  isGovtFreeCare?: boolean;
  feeTier?: 'Free / Govt (₹0)' | 'Affordable (₹100-₹250)' | 'Private Care';
  schemeAccepted?: string[];
  bedChargesPerDay?: string;
}

export interface SoundTherapyTrack {
  id: string;
  title: string;
  userEmail?: string;
  category: 'Anxiety Relief' | 'Deep Focus' | 'Thoracic Respiration' | 'Neural Reset' | 'Custom Generated';
  baseFrequency: number;
  binauralBeatHz: number;
  durationSeconds: number;
  description: string;
  waveformType: 'sine' | 'triangle' | 'ambient';
  createdAt: string;
}

export interface Anatomy3DMarker {
  id: string;
  name: string;
  organ: 'Lungs' | 'Brain' | 'Heart' | 'Spine' | 'Liver' | 'Kidneys';
  position: [number, number, number];
  condition: 'Normal' | 'Observation' | 'Critical Finding';
  notes: string;
  modality: AnalysisModality;
}

export interface AdminSystemStats {
  activeUsers: number | string;
  totalDoctors: number;
  totalPatients: number;
  totalAnalysesToday: number;
  systemUptime: string;
  averageInferenceTime: string;
  storageUsed: string;
  apiHealthStatus: string;
}

export interface PrecautionChatRecord {
  id: string;
  _id?: string;
  userEmail: string;
  userRole: UserRole;
  category: string;
  question: string;
  answer: string;
  precautions?: string[];
  triageLevel?: 'critical' | 'urgent' | 'routine';
  timestamp: string;
}

export interface EmergencyTriageResponse {
  triageLevel: 'critical' | 'urgent' | 'routine';
  category: string;
  summary: string;
  immediateSteps: string[];
  avoidActions: string[];
  fullDetailedAnswer: string;
  redFlagWarnings: string[];
  recommendedEmergencyContacts: string[];
}

export interface SQLColumnInfo {
  cid?: number;
  name: string;
  type: string;
  notnull: boolean | number;
  dflt_value: any;
  pk: boolean | number;
}

export interface SQLTableInfo {
  name: string;
  columns: SQLColumnInfo[];
  rowCount: number;
  primaryKey: string;
}

export interface SQLStatus {
  status: string;
  engine: string;
  databaseName: string;
  driver: string;
  filePath: string;
  tables: Record<string, number>;
  totalTables: number;
  totalRows: number;
  storageSizeBytes: number;
  storageFormatted: string;
  lastSyncedAt: string;
  uptimeSeconds: number;
  syncedWithStore: boolean;
}

export interface SQLQueryResult {
  success: boolean;
  sql: string;
  commandType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'DDL' | 'OTHER';
  columns: string[];
  rows: any[];
  rowCount: number;
  affectedRows?: number;
  executionTimeMs: number;
  error?: string;
}



export interface PatientDemographics {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  education: 'None' | 'Primary' | 'Secondary' | 'Tertiary';
  employment: 'Employed' | 'Unemployed' | 'Student';
  zvi?: number;
}

export interface IoTTelemetry {
  spo2: number;
  heartRate: number;
  temp: number;
  syncStatus: 'Success' | 'Connecting' | 'Idle' | 'Error';
  timestamp: string;
  nodeId: string;
  protocol: string;
}

export interface ClinicalData {
  symptoms: {
    fever: boolean;
    fatigue: boolean;
    weightLoss: boolean;
    cough: boolean;
  };
  symptomsCount: number;
  cd4: number;
  wbc: number;
  hemoglobin: number;
}

export interface InferenceResults {
  classicalScore: number;
  quantumScore: number;
  finalScore: number;
  riskCategory: 'HIGH' | 'MODERATE' | 'LOW';
  recommendation: string;
  calculatedAt: string;
  pcaValues?: [number, number, number, number];
  qubitStates?: {
    q0: number;
    q1: number;
    q2: number;
    q3: number;
  };
}

export interface ZonalData {
  state: string;
  zviScore: number;
  activeCases: number;
  testingCoverage: number;
  riskTier: 'High' | 'Moderate' | 'Low';
}

export interface ShapFeature {
  feature: string;
  importance: number;
  description: string;
}

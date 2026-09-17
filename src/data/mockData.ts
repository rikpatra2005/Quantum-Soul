import { ZonalData, ShapFeature } from '../types';

export const STATES_LIST = [
  'Maharashtra',
  'Karnataka',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Telangana',
  'Other'
];

export const EDUCATION_LEVELS = ['None', 'Primary', 'Secondary', 'Tertiary'] as const;
export const EMPLOYMENT_STATUSES = ['Employed', 'Unemployed', 'Student'] as const;

export const BASE_STATE_RISK: Record<string, number> = {
  Maharashtra: 0.25,
  Karnataka: 0.20,
  'Andhra Pradesh': 0.20,
  'Tamil Nadu': 0.20,
  Telangana: 0.15,
  Other: 0.10
};

export const ZONAL_DATASET: ZonalData[] = [
  { state: 'Maharashtra', zviScore: 0.85, activeCases: 12000, testingCoverage: 76, riskTier: 'High' },
  { state: 'Karnataka', zviScore: 0.72, activeCases: 8500, testingCoverage: 81, riskTier: 'High' },
  { state: 'Andhra Pradesh', zviScore: 0.68, activeCases: 7200, testingCoverage: 69, riskTier: 'Moderate' },
  { state: 'Tamil Nadu', zviScore: 0.65, activeCases: 6800, testingCoverage: 88, riskTier: 'Moderate' },
  { state: 'Telangana', zviScore: 0.60, activeCases: 5400, testingCoverage: 74, riskTier: 'Moderate' },
  { state: 'Other States', zviScore: 0.42, activeCases: 3800, testingCoverage: 65, riskTier: 'Low' },
];

export const SHAP_EXPLANATIONS: ShapFeature[] = [
  {
    feature: 'CD4 Count',
    importance: 0.35,
    description: 'Immune system strength indicator; counts below 350-500 cells/mm³ significantly increase susceptibility score.'
  },
  {
    feature: 'ZVI (Zonal Risk)',
    importance: 0.25,
    description: 'Regional socio-epidemiological vulnerability index aggregated from state prevalence and social determinants.'
  },
  {
    feature: 'WBC Count',
    importance: 0.15,
    description: 'White blood cell count indicating baseline immunologic activity and co-infection signals.'
  },
  {
    feature: 'Age',
    importance: 0.10,
    description: 'Demographic factor correlated with differential disease progression dynamics in mathematical models.'
  },
  {
    feature: 'Hemoglobin',
    importance: 0.08,
    description: 'Systemic indicator of nutritional status and chronic immune activation anemia.'
  },
  {
    feature: 'Symptoms',
    importance: 0.07,
    description: 'Cumulative constitutional symptoms (fever, chronic cough, fatigue, unintended weight loss).'
  }
];

export const PRESET_PATIENTS = [
  {
    id: 'P_ID_8842',
    name: 'Patient 8842 (High Risk Case)',
    age: 38,
    gender: 'Male' as const,
    state: 'Maharashtra',
    education: 'Primary' as const,
    employment: 'Unemployed' as const,
    cd4: 280,
    wbc: 4200,
    hemoglobin: 11.2,
    symptoms: { fever: true, fatigue: true, weightLoss: true, cough: false }
  },
  {
    id: 'P_ID_5129',
    name: 'Patient 5129 (Moderate Risk Case)',
    age: 32,
    gender: 'Female' as const,
    state: 'Karnataka',
    education: 'Secondary' as const,
    employment: 'Employed' as const,
    cd4: 520,
    wbc: 5800,
    hemoglobin: 12.8,
    symptoms: { fever: true, fatigue: false, weightLoss: false, cough: false }
  },
  {
    id: 'P_ID_1044',
    name: 'Patient 1044 (Low Risk Baseline)',
    age: 26,
    gender: 'Female' as const,
    state: 'Other',
    education: 'Tertiary' as const,
    employment: 'Employed' as const,
    cd4: 850,
    wbc: 7200,
    hemoglobin: 14.2,
    symptoms: { fever: false, fatigue: false, weightLoss: false, cough: false }
  }
];

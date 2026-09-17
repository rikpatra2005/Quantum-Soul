import { BASE_STATE_RISK } from '../data/mockData';
import { InferenceResults, PatientDemographics, ClinicalData, IoTTelemetry } from '../types';

// Normal distribution approximation for realistic perturbation
function normalRandom(mean = 0, std = 0.02): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + num * std;
}

export function calculateZVI(state: string, education: string, employment: string): number {
  const base = BASE_STATE_RISK[state] ?? 0.10;
  let zvi = base;
  if (education === 'Primary' || education === 'None') {
    zvi += 0.15;
  }
  if (employment === 'Unemployed') {
    zvi += 0.10;
  }
  return Math.min(Math.max(zvi, 0), 1.0);
}

export function classicalInference(cd4: number, wbc: number, zvi: number, symptomsCount: number): number {
  // Simulating XGBoost / CatBoost / ANN Ensemble
  const risk = 0.2 + (1 - (cd4 / 1000)) * 0.4 + (1 - (wbc / 10000)) * 0.1 + (zvi * 0.2) + (symptomsCount * 0.05);
  const perturbed = risk + normalRandom(0, 0.02);
  return Math.min(Math.max(perturbed, 0.01), 0.99);
}

export function quantumInference(cd4: number, zvi: number, age: number): number {
  // Simulating 4-Qubit Variational Quantum Circuit (VQC) with Angle Encoding & Entanglement
  const qRisk = 0.25 + (1 - (cd4 / 1000)) * 0.35 + (zvi * 0.25) + ((age - 30) / 100) * 0.1;
  const perturbed = qRisk + normalRandom(0, 0.015);
  return Math.min(Math.max(perturbed, 0.01), 0.99);
}

export function computeHybridAssessment(
  demographics: PatientDemographics,
  clinical: ClinicalData
): InferenceResults {
  const zvi = demographics.zvi ?? calculateZVI(demographics.state, demographics.education, demographics.employment);
  const classicalScore = classicalInference(clinical.cd4, clinical.wbc, zvi, clinical.symptomsCount);
  const quantumScore = quantumInference(clinical.cd4, zvi, demographics.age);
  const finalScore = classicalScore * 0.6 + quantumScore * 0.4;

  let riskCategory: 'HIGH' | 'MODERATE' | 'LOW';
  let recommendation: string;

  if (finalScore > 0.7) {
    riskCategory = 'HIGH';
    recommendation = '🚨 HIGH RISK: Immediate ICTC Referral & Confirmatory Testing Recommended (NACO Protocol Stage 1)';
  } else if (finalScore > 0.4) {
    riskCategory = 'MODERATE';
    recommendation = '⚠️ MODERATE RISK: Recommend Follow-up Biomarker Screening & Window Period Retesting (30 Days)';
  } else {
    riskCategory = 'LOW';
    recommendation = '✅ LOW RISK: Routine Annual Health Screening & Preventative Counseling Advised';
  }

  // Derived quantum state vector amplitudes for 4 qubits (normalized)
  const normCD4 = Math.max(0, Math.min(1, clinical.cd4 / 1200));
  const q0 = Math.sin((1 - normCD4) * Math.PI * 0.5);
  const q1 = Math.sin(zvi * Math.PI * 0.5);
  const q2 = Math.sin(Math.min(1, demographics.age / 80) * Math.PI * 0.5);
  const q3 = Math.sin((clinical.symptomsCount / 4) * Math.PI * 0.5);

  return {
    classicalScore,
    quantumScore,
    finalScore,
    riskCategory,
    recommendation,
    calculatedAt: new Date().toISOString(),
    pcaValues: [
      Number(((1 - normCD4) * 1.42 - 0.2).toFixed(3)),
      Number((zvi * 1.15 - 0.1).toFixed(3)),
      Number(((demographics.age / 100) * 0.88).toFixed(3)),
      Number(((clinical.symptomsCount * 0.45)).toFixed(3))
    ],
    qubitStates: {
      q0: Number(q0.toFixed(3)),
      q1: Number(q1.toFixed(3)),
      q2: Number(q2.toFixed(3)),
      q3: Number(q3.toFixed(3))
    }
  };
}

export function generateCSVReport(
  demographics: PatientDemographics,
  clinical: ClinicalData,
  iot?: IoTTelemetry,
  results?: InferenceResults
): string {
  const headers = [
    'Patient_ID',
    'Age',
    'Gender',
    'State',
    'Education',
    'Employment',
    'ZVI_Score',
    'CD4_Count',
    'WBC_Count',
    'Hemoglobin',
    'Symptoms_Count',
    'Fever',
    'Fatigue',
    'Weight_Loss',
    'Cough',
    'IoT_SpO2',
    'IoT_HeartRate',
    'IoT_Temp_F',
    'Classical_ML_Score',
    'Quantum_VQC_Score',
    'Hybrid_Score',
    'Risk_Tier',
    'Recommendation',
    'Generated_At'
  ];

  const row = [
    demographics.name || 'P_ID_8842',
    demographics.age,
    demographics.gender,
    demographics.state,
    demographics.education,
    demographics.employment,
    demographics.zvi?.toFixed(3) ?? '0.00',
    clinical.cd4,
    clinical.wbc,
    clinical.hemoglobin,
    clinical.symptomsCount,
    clinical.symptoms.fever ? 'YES' : 'NO',
    clinical.symptoms.fatigue ? 'YES' : 'NO',
    clinical.symptoms.weightLoss ? 'YES' : 'NO',
    clinical.symptoms.cough ? 'YES' : 'NO',
    iot?.spo2 ? `${iot.spo2}%` : 'N/A',
    iot?.heartRate ?? 'N/A',
    iot?.temp ?? 'N/A',
    results ? (results.classicalScore * 100).toFixed(2) + '%' : 'N/A',
    results ? (results.quantumScore * 100).toFixed(2) + '%' : 'N/A',
    results ? (results.finalScore * 100).toFixed(2) + '%' : 'N/A',
    results ? results.riskCategory : 'PENDING',
    results ? `"${results.recommendation.replace(/"/g, '""')}"` : 'N/A',
    new Date().toISOString()
  ];

  return `${headers.join(',')}\n${row.join(',')}`;
}

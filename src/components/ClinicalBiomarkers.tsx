import React, { useState } from 'react';
import {
  ShieldAlert,
  Dna,
  CheckCircle2,
  AlertCircle,
  ThermometerSnowflake,
  BatteryWarning,
  Scale,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { ClinicalData } from '../types';

interface ClinicalBiomarkersProps {
  clinicalData: ClinicalData;
  setClinicalData: React.Dispatch<React.SetStateAction<ClinicalData>>;
  onNext: () => void;
}

export const ClinicalBiomarkers: React.FC<ClinicalBiomarkersProps> = ({
  clinicalData,
  setClinicalData,
  onNext,
}) => {
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSymptomToggle = (symptomKey: keyof ClinicalData['symptoms']) => {
    setClinicalData((prev) => {
      const updatedSymptoms = {
        ...prev.symptoms,
        [symptomKey]: !prev.symptoms[symptomKey],
      };
      const count = Object.values(updatedSymptoms).filter(Boolean).length;
      return {
        ...prev,
        symptoms: updatedSymptoms,
        symptomsCount: count,
      };
    });
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onNext();
    }, 1200);
  };

  // Reference ranges helper
  const getCD4Status = (val: number) => {
    if (val < 200) return { label: 'Severely Depleted (High Vulnerability)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (val < 350) return { label: 'Moderately Depleted', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (val < 500) return { label: 'Mild Depletion', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    return { label: 'Normal Immunologic Range', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  };

  const cd4Status = getCD4Status(clinicalData.cd4);

  return (
    <div className="space-y-6">
      {/* Header & Leakage-Proof Callout */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              🧬 Symptom & Biomarker Analysis
            </h1>
            <p className="text-xs text-slate-500">
              Captures generalized systemic biomarkers without circular target contamination.
            </p>
          </div>
        </div>

        {/* Leakage-Proof Callout Banner (Prompt Specification) */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-indigo-950">ℹ️ Leakage-Proof Design:</span> HIV RNA / Viral Load is
            strictly excluded from model inference inputs to prevent target leakage. It is restricted solely to
            independent ground-truth verification, forcing the classical and quantum models to predict
            susceptibility from generalized immunological and demographic markers.
          </div>
        </div>
      </div>

      {/* Main Clinical Form */}
      <form onSubmit={handleAnalyze} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Symptoms Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>🤒 Symptom Check</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Active: {clinicalData.symptomsCount}/4
                  </span>
                </h2>
                <span className="text-xs text-slate-400">NACO Stage 1 Indicators</span>
              </div>

              <div className="space-y-3">
                {/* Fever */}
                <label
                  htmlFor="check-symptom-fever"
                  onClick={() => handleSymptomToggle('fever')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    clinicalData.symptoms.fever
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    id="check-symptom-fever"
                    type="checkbox"
                    checked={clinicalData.symptoms.fever}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ThermometerSnowflake className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-semibold text-slate-800">Fever / Night Sweats</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recurrent persistent fevers or severe nocturnal diaphoresis without acute infection.
                    </p>
                  </div>
                </label>

                {/* Fatigue */}
                <label
                  htmlFor="check-symptom-fatigue"
                  onClick={() => handleSymptomToggle('fatigue')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    clinicalData.symptoms.fatigue
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    id="check-symptom-fatigue"
                    type="checkbox"
                    checked={clinicalData.symptoms.fatigue}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <BatteryWarning className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-slate-800">Severe Fatigue</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unexplained debilitating lethargy lasting &gt; 1 month interfering with daily activity.
                    </p>
                  </div>
                </label>

                {/* Weight Loss */}
                <label
                  htmlFor="check-symptom-weight-loss"
                  onClick={() => handleSymptomToggle('weightLoss')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    clinicalData.symptoms.weightLoss
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    id="check-symptom-weight-loss"
                    type="checkbox"
                    checked={clinicalData.symptoms.weightLoss}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-slate-800">Unexplained Weight Loss</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Involuntary loss &gt; 10% baseline body weight without caloric restriction.
                    </p>
                  </div>
                </label>

                {/* Cough */}
                <label
                  htmlFor="check-symptom-cough"
                  onClick={() => handleSymptomToggle('cough')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    clinicalData.symptoms.cough
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    id="check-symptom-cough"
                    type="checkbox"
                    checked={clinicalData.symptoms.cough}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-semibold text-slate-800">Chronic Cough (TB Risk)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subacute cough persisting &gt; 2 weeks; sentinel opportunistic TB co-infection symptom.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Symptom Impact Score: +{(clinicalData.symptomsCount * 0.05).toFixed(2)}</span>
              <span>Weight in Ensemble: 7%</span>
            </div>
          </div>

          {/* Column 2: General Biomarkers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800">🩸 General Biomarkers</h2>
                <span className="text-xs text-slate-400">Automated Analyzer Input</span>
              </div>

              {/* CD4 Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-cd4-count" className="text-xs font-semibold text-slate-700">
                    CD4+ T-Cell Count (cells/mm³)
                  </label>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${cd4Status.color}`}>
                    {cd4Status.label}
                  </span>
                </div>
                <input
                  id="input-cd4-count"
                  type="number"
                  min={0}
                  max={2000}
                  step={10}
                  value={clinicalData.cd4}
                  onChange={(e) =>
                    setClinicalData((prev) => ({
                      ...prev,
                      cd4: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono"
                  required
                />
                <input
                  type="range"
                  min={0}
                  max={1500}
                  step={20}
                  value={clinicalData.cd4}
                  onChange={(e) =>
                    setClinicalData((prev) => ({
                      ...prev,
                      cd4: Number(e.target.value),
                    }))
                  }
                  className="w-full mt-2 accent-blue-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>0 (Critical)</span>
                  <span>350 (Moderate)</span>
                  <span>500 (Baseline)</span>
                  <span>1500 (Optimal)</span>
                </div>
              </div>

              {/* WBC Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-wbc-count" className="text-xs font-semibold text-slate-700">
                    White Blood Cell (WBC) Count (cells/mcL)
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Ref: 4,000 - 11,000</span>
                </div>
                <input
                  id="input-wbc-count"
                  type="number"
                  min={0}
                  max={20000}
                  step={100}
                  value={clinicalData.wbc}
                  onChange={(e) =>
                    setClinicalData((prev) => ({
                      ...prev,
                      wbc: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono"
                  required
                />
              </div>

              {/* Hemoglobin */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-hemoglobin-count" className="text-xs font-semibold text-slate-700">
                    Hemoglobin (g/dL)
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Ref: 12.0 - 17.5 g/dL</span>
                </div>
                <input
                  id="input-hemoglobin-count"
                  type="number"
                  min={0.0}
                  max={20.0}
                  step={0.1}
                  value={clinicalData.hemoglobin}
                  onChange={(e) =>
                    setClinicalData((prev) => ({
                      ...prev,
                      hemoglobin: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono"
                  required
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>Features feed directly to 4-Qubit VQC Angle Encoders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Clicking analyze compiles the clinical tensor for the hybrid classical + quantum inference pipeline.
          </div>

          <button
            id="btn-analyze-clinical-data"
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {successNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span>Clinical Data Recorded! Switching...</span>
              </>
            ) : (
              <>
                <span>Analyze Clinical Data & Proceed to Quantum Engine</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { PatientIntake } from './components/PatientIntake';
import { ClinicalBiomarkers } from './components/ClinicalBiomarkers';
import { QuantumEngine } from './components/QuantumEngine';
import { ZonalInsights } from './components/ZonalInsights';
import { DeployGuideModal } from './components/DeployGuideModal';
import { PitchScriptModal } from './components/PitchScriptModal';
import { PatientDemographics, ClinicalData, IoTTelemetry, InferenceResults } from './types';
import { calculateZVI, computeHybridAssessment } from './utils/mlEngine';
import { ShieldCheck, Heart, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Sushovan Das (DOC_001)');
  const [activeTab, setActiveTab] = useState<string>('intake');

  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [showPitchScript, setShowPitchScript] = useState(false);

  // Initial Patient Demographics (P_ID_8842 from prompt)
  const initialZvi = calculateZVI('Maharashtra', 'Primary', 'Unemployed');
  const [demographics, setDemographics] = useState<PatientDemographics>({
    name: 'P_ID_8842',
    age: 35,
    gender: 'Male',
    state: 'Maharashtra',
    education: 'Primary',
    employment: 'Unemployed',
    zvi: initialZvi,
  });

  // Initial IoT Telemetry
  const [iotData, setIotData] = useState<IoTTelemetry | null>({
    spo2: 96,
    heartRate: 78,
    temp: 98.6,
    syncStatus: 'Success',
    timestamp: new Date().toLocaleTimeString(),
    nodeId: 'ESP32-PICO2W-NODE-08',
    protocol: 'MQTT / TLS 1.3'
  });

  // Initial Clinical Biomarkers
  const [clinicalData, setClinicalData] = useState<ClinicalData>({
    symptoms: {
      fever: true,
      fatigue: true,
      weightLoss: false,
      cough: false,
    },
    symptomsCount: 2,
    cd4: 450,
    wbc: 6000,
    hemoglobin: 13.5,
  });

  // Initial Inference Results (precomputed so all tabs are instantly interactive)
  const [results, setResults] = useState<InferenceResults | null>(() =>
    computeHybridAssessment(
      {
        name: 'P_ID_8842',
        age: 35,
        gender: 'Male',
        state: 'Maharashtra',
        education: 'Primary',
        employment: 'Unemployed',
        zvi: initialZvi,
      },
      {
        symptoms: { fever: true, fatigue: true, weightLoss: false, cough: false },
        symptomsCount: 2,
        cd4: 450,
        wbc: 6000,
        hemoglobin: 13.5,
      }
    )
  );

  const handleLogin = (name: string) => {
    setDoctorName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <Navbar
        doctorName={doctorName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenDeployGuide={() => setShowDeployGuide(true)}
        onOpenPitchScript={() => setShowPitchScript(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intake' && (
          <PatientIntake
            demographics={demographics}
            setDemographics={setDemographics}
            iotData={iotData}
            setIotData={setIotData}
            onNext={() => setActiveTab('biomarkers')}
          />
        )}

        {activeTab === 'biomarkers' && (
          <ClinicalBiomarkers
            clinicalData={clinicalData}
            setClinicalData={setClinicalData}
            onNext={() => setActiveTab('quantum')}
          />
        )}

        {activeTab === 'quantum' && (
          <QuantumEngine
            demographics={demographics}
            clinicalData={clinicalData}
            results={results}
            setResults={setResults}
            onNext={() => setActiveTab('zonal')}
          />
        )}

        {activeTab === 'zonal' && (
          <ZonalInsights
            demographics={demographics}
            clinicalData={clinicalData}
            iotData={iotData}
            results={results}
            onGoBackToQuantum={() => setActiveTab('quantum')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">QuantumAI-HIV</span>
            <span>— Smart India Hackathon (SIH 2026)</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-emerald-700 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 &amp; CITI Certified
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rikpatra2005"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>rikpatra2005</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowDeployGuide(true)}
              className="text-blue-700 hover:underline font-medium cursor-pointer"
            >
              Deploy Guide
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowPitchScript(true)}
              className="text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Pitch Script
            </button>
          </div>
        </div>
      </footer>

      {/* Deployment and Hackathon Modals */}
      <DeployGuideModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />

      <PitchScriptModal
        isOpen={showPitchScript}
        onClose={() => setShowPitchScript(false)}
      />
    </div>
  );
}

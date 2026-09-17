import React, { useState } from 'react';
import {
  User,
  Activity,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Thermometer,
  Wind,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PatientDemographics, IoTTelemetry } from '../types';
import { calculateZVI } from '../utils/mlEngine';
import { STATES_LIST, EDUCATION_LEVELS, EMPLOYMENT_STATUSES, PRESET_PATIENTS } from '../data/mockData';

interface PatientIntakeProps {
  demographics: PatientDemographics;
  setDemographics: React.Dispatch<React.SetStateAction<PatientDemographics>>;
  iotData: IoTTelemetry | null;
  setIotData: React.Dispatch<React.SetStateAction<IoTTelemetry | null>>;
  onNext: () => void;
}

export const PatientIntake: React.FC<PatientIntakeProps> = ({
  demographics,
  setDemographics,
  iotData,
  setIotData,
  onNext,
}) => {
  const [isFetchingIoT, setIsFetchingIoT] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedZvi = calculateZVI(
      demographics.state,
      demographics.education,
      demographics.employment
    );
    setDemographics((prev) => ({
      ...prev,
      zvi: calculatedZvi,
    }));
    setSaveFeedback(`Profile Saved! Zonal Vulnerability Index (ZVI) Calculated: ${calculatedZvi.toFixed(2)}`);
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleFetchTelemetry = () => {
    setIsFetchingIoT(true);
    setTimeout(() => {
      // Generate realistic biosensor telemetry
      const spo2 = Math.floor(Math.random() * (99 - 88 + 1)) + 88;
      const heartRate = Math.floor(Math.random() * (110 - 65 + 1)) + 65;
      const temp = Number((Math.random() * (101.2 - 97.5) + 97.5).toFixed(1));

      const telemetry: IoTTelemetry = {
        spo2,
        heartRate,
        temp,
        syncStatus: 'Success',
        timestamp: new Date().toLocaleTimeString(),
        nodeId: 'ESP32-PICO2W-NODE-08',
        protocol: 'MQTT / TLS 1.3 (Port 8883)'
      };

      setIotData(telemetry);
      setIsFetchingIoT(false);
    }, 1400);
  };

  const loadPreset = (preset: typeof PRESET_PATIENTS[0]) => {
    const zvi = calculateZVI(preset.state, preset.education, preset.employment);
    setDemographics({
      name: preset.id,
      age: preset.age,
      gender: preset.gender,
      state: preset.state,
      education: preset.education,
      employment: preset.employment,
      zvi
    });
    setSaveFeedback(`Preset loaded for ${preset.name}! ZVI: ${zvi.toFixed(2)}`);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const currentZvi = demographics.zvi ?? calculateZVI(
    demographics.state,
    demographics.education,
    demographics.employment
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              📋 Patient Demographics & Edge-IoT Telemetry
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Capture socio-demographic determinants to calculate the ZVI score and stream live vital signs from the edge node.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Hackathon Cases:
          </span>
          {PRESET_PATIENTS.map((p) => (
            <button
              key={p.id}
              id={`btn-preset-${p.id}`}
              onClick={() => loadPreset(p)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              {p.id} ({p.gender[0]}, {p.age})
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Demographics Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-800">👤 Demographics & Social Determinants</h2>
            </div>
            {demographics.zvi !== undefined && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Current ZVI: {demographics.zvi.toFixed(2)}
              </span>
            )}
          </div>

          <form onSubmit={handleDemographicsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="input-patient-name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Patient Name / ID
                </label>
                <input
                  id="input-patient-name"
                  type="text"
                  value={demographics.name}
                  onChange={(e) =>
                    setDemographics((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="input-patient-age"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Age (Years)
                </label>
                <input
                  id="input-patient-age"
                  type="number"
                  min={10}
                  max={100}
                  value={demographics.age}
                  onChange={(e) =>
                    setDemographics((prev) => ({
                      ...prev,
                      age: Number(e.target.value) || 10,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="select-gender"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="select-gender"
                  value={demographics.gender}
                  onChange={(e) =>
                    setDemographics((prev) => ({
                      ...prev,
                      gender: e.target.value as 'Male' | 'Female' | 'Other',
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-state"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  State / Region
                </label>
                <select
                  id="select-state"
                  value={demographics.state}
                  onChange={(e) =>
                    setDemographics((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 cursor-pointer"
                >
                  {STATES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="select-education"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Education Level
                </label>
                <select
                  id="select-education"
                  value={demographics.education}
                  onChange={(e) =>
                    setDemographics((prev) => ({
                      ...prev,
                      education: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 cursor-pointer"
                >
                  {EDUCATION_LEVELS.map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-employment"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Employment Status
                </label>
                <select
                  id="select-employment"
                  value={demographics.employment}
                  onChange={(e) =>
                    setDemographics((prev) => ({
                      ...prev,
                      employment: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 cursor-pointer"
                >
                  {EMPLOYMENT_STATUSES.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Formula Preview Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-slate-700 flex items-center justify-between">
                <span>ZVI Determinants Weighting:</span>
                <span className="font-mono text-blue-700 font-bold">{currentZvi.toFixed(2)}</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Base ({demographics.state}) +{' '}
                {['Primary', 'None'].includes(demographics.education) ? '+0.15 (Education factor)' : '+0.00'}{' '}
                + {demographics.employment === 'Unemployed' ? '+0.10 (Employment factor)' : '+0.00'}
              </p>
            </div>

            <button
              id="btn-calculate-zvi-save"
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Calculate ZVI & Save</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {saveFeedback && (
              <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveFeedback}</span>
              </div>
            )}
          </form>
        </div>

        {/* Column 2: Edge-IoT Biosensors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">📡 Edge-IoT Biosensors (TinyML Node)</h2>
                  <p className="text-xs text-slate-500">Raspberry Pi Pico 2 W & ESP32 Telemetry via MQTT</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                MQTT / TLS
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Simulating edge biosensor packet intake for offline or remote field clinics. Captures SpO2, heart rate, and body temperature via secure MQTT payload.
            </p>

            <button
              id="btn-fetch-live-telemetry"
              type="button"
              onClick={handleFetchTelemetry}
              disabled={isFetchingIoT}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mb-6"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingIoT ? 'animate-spin' : ''}`} />
              <span>{isFetchingIoT ? 'Connecting to ESP32 via MQTT...' : '🔄 Fetch Live Telemetry'}</span>
            </button>

            {/* Biosensor Readout Cards */}
            {iotData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {/* SpO2 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-medium mb-1">
                      <Wind className="w-3.5 h-3.5 text-cyan-600" />
                      <span>SpO2 Level</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">{iotData.spo2}%</div>
                    {iotData.spo2 < 95 ? (
                      <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        -2% (Hypoxia)
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Normal
                      </span>
                    )}
                  </div>

                  {/* Heart Rate */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-medium mb-1">
                      <Heart className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      <span>Heart Rate</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">{iotData.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span></div>
                    <span className="inline-block mt-1 text-[10px] font-medium text-slate-500">
                      Resting Pulse
                    </span>
                  </div>

                  {/* Body Temp */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-medium mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                      <span>Body Temp</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">{iotData.temp} <span className="text-xs font-normal text-slate-500">°F</span></div>
                    <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${iotData.temp > 99.5 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-slate-500'}`}>
                      {iotData.temp > 99.5 ? 'Elevated' : 'Afebrile'}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-semibold">Sync Status: {iotData.syncStatus}</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-[11px]">
                    Protocol: {iotData.protocol}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-medium text-slate-600">No telemetry packet received yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Fetch Live Telemetry&quot; to query edge node sensors</p>
              </div>
            )}
          </div>

          {/* Action button to proceed */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              id="btn-intake-proceed"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <span>Proceed to Clinical Biomarkers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

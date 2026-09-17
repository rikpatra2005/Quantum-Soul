import React, { useState } from 'react';
import {
  BarChart3,
  MapPin,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { PatientDemographics, ClinicalData, IoTTelemetry, InferenceResults } from '../types';
import { ZONAL_DATASET, SHAP_EXPLANATIONS } from '../data/mockData';
import { generateCSVReport } from '../utils/mlEngine';

interface ZonalInsightsProps {
  demographics: PatientDemographics;
  clinicalData: ClinicalData;
  iotData: IoTTelemetry | null;
  results: InferenceResults | null;
  onGoBackToQuantum: () => void;
}

export const ZonalInsights: React.FC<ZonalInsightsProps> = ({
  demographics,
  clinicalData,
  iotData,
  results,
  onGoBackToQuantum,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');

  const shapData = SHAP_EXPLANATIONS.map((item) => ({
    feature: item.feature,
    impact: item.importance,
    description: item.description,
  }));

  const handleDownloadCSV = () => {
    const csvContent = generateCSVReport(demographics, clinicalData, iotData ?? undefined, results ?? undefined);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `patient_report_${demographics.name || 'P_8842'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStateData = ZONAL_DATASET.find((s) => s.state === selectedState) || ZONAL_DATASET[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            📊 Explainable AI &amp; Zonal Heatmap
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent SHAP feature attribution &amp; regional vulnerability metrics for NACO resource planning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-download-csv-top"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>⬇️ Download Patient CSV Report</span>
          </button>
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors cursor-pointer"
            title="Print Clinical Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!results && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>AI &amp; Quantum inference has not been executed yet for this patient profile.</span>
          </div>
          <button
            onClick={onGoBackToQuantum}
            className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
          >
            Run Engine First →
          </button>
        </div>
      )}

      {/* 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Values Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-700" />
                  <span>🔍 Model Explainability (SHAP Values)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Doctor-friendly mathematical feature impact contributions to risk score.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                TreeSHAP + Q-Kernel
              </span>
            </div>

            {/* Recharts SHAP Bar Visualization */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shapData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 0.4]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
                    width={90}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl max-w-xs border border-slate-700">
                            <div className="font-bold text-cyan-300 mb-1">{data.feature}</div>
                            <div className="text-white font-mono mb-1">
                              Impact Weight: <span className="font-bold text-amber-300">{(data.impact * 100).toFixed(1)}%</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{data.description}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                    {shapData.map((_, index) => {
                      const colors = ['#004d99', '#0066cc', '#1a8cff', '#4da6ff', '#80bfff', '#b3d9ff'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Driver: CD4 Count (35% impact)</span>
            <span>Secondary: Zonal Risk ZVI (25% impact)</span>
          </div>
        </div>

        {/* Zonal Vulnerability Index Heatmap & NACO Planning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>🗺️ ZVI Regional Vulnerability Heatmap</span>
                </h2>
                <p className="text-xs text-slate-500">
                  NACO surveillance data &amp; regional burden metrics for targeted mobile testing.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                High Priority Zones
              </span>
            </div>

            {/* Zonal Bar / Heatmap representation */}
            <div className="space-y-3">
              {ZONAL_DATASET.slice(0, 5).map((item) => {
                const isCurrent = demographics.state === item.state;
                const isSelected = selectedState === item.state;
                const zviPercent = Math.round(item.zviScore * 100);

                return (
                  <div
                    key={item.state}
                    onClick={() => setSelectedState(item.state)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : isCurrent
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{item.state}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                            Patient&apos;s State
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-slate-500">
                          {item.activeCases.toLocaleString()} Cases
                        </span>
                        <span className="font-bold text-blue-900">
                          ZVI: {item.zviScore.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar for visual heat */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${zviPercent}%`,
                          backgroundColor:
                            item.zviScore >= 0.8
                              ? '#d9534f'
                              : item.zviScore >= 0.65
                              ? '#f0ad4e'
                              : '#5cb85c',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected State Resource Brief */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="font-semibold text-slate-800 flex items-center justify-between mb-1">
                <span>NACO Allocation Brief for {currentStateData.state}:</span>
                <span className="text-rose-700 font-bold">{currentStateData.riskTier} Risk Tier</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Estimated Active Prevalence: <strong>{currentStateData.activeCases.toLocaleString()}</strong> | Testing Coverage: <strong>{currentStateData.testingCoverage}%</strong>. Recommendation: Deploy {currentStateData.zviScore > 0.7 ? '2 Mobile ICTC diagnostic vans + rapid oral screening camp' : 'Standard quarterly community health worker outreach'}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Report Summary & Download Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <span>📄 Generate &amp; Download Clinical Summary Report</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified clinical report ready for export and transmission to NACO ICTC network.
            </p>
          </div>

          <button
            id="btn-download-csv-bottom"
            onClick={handleDownloadCSV}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>⬇️ Download Patient CSV Report (patient_report.csv)</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>patient_report.csv</strong> downloaded successfully! Includes demographics, IoT telemetry, classical ML scores, and 4-qubit VQC values.
            </span>
          </div>
        )}

        {/* Quick Report Table Preview */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Demographics</th>
                <th className="p-3">State / ZVI</th>
                <th className="p-3">Biomarkers (CD4 / WBC / Hb)</th>
                <th className="p-3">IoT Vitals (SpO2 / HR)</th>
                <th className="p-3">Classical ML</th>
                <th className="p-3">Quantum VQC</th>
                <th className="p-3">Hybrid Consensus</th>
                <th className="p-3">Protocol Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr className="bg-white hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-slate-900 font-sans">{demographics.name || 'P_ID_8842'}</td>
                <td className="p-3 font-sans">{demographics.gender}, {demographics.age}y</td>
                <td className="p-3 font-sans">
                  {demographics.state} ({demographics.zvi?.toFixed(2) ?? '0.25'})
                </td>
                <td className="p-3">
                  {clinicalData.cd4} / {clinicalData.wbc} / {clinicalData.hemoglobin}
                </td>
                <td className="p-3">
                  {iotData ? `${iotData.spo2}% / ${iotData.heartRate}bpm` : 'Pending'}
                </td>
                <td className="p-3 font-semibold text-slate-800">
                  {results ? `${(results.classicalScore * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="p-3 font-semibold text-purple-700">
                  {results ? `${(results.quantumScore * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="p-3 font-bold text-blue-900">
                  {results ? `${(results.finalScore * 100).toFixed(1)}% (${results.riskCategory})` : '—'}
                </td>
                <td className="p-3 font-sans text-[11px] text-slate-700">
                  {results ? (
                    <span className={results.riskCategory === 'HIGH' ? 'text-rose-700 font-bold' : results.riskCategory === 'MODERATE' ? 'text-amber-700 font-medium' : 'text-emerald-700'}>
                      {results.riskCategory === 'HIGH' ? 'ICTC Referral' : results.riskCategory === 'MODERATE' ? 'Biomarker Screening' : 'Annual Routine'}
                    </span>
                  ) : (
                    'Run inference'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

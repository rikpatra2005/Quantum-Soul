import React, { useState } from 'react';
import { X, Mic, Copy, Check, Sparkles, Volume2 } from 'lucide-react';

interface PitchScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchScriptModal: React.FC<PitchScriptModalProps> = ({ isOpen, onClose }) => {
  const [copiedSlide, setCopiedSlide] = useState<number | null>(null);

  if (!isOpen) return null;

  const slides = [
    {
      slideNum: 1,
      title: 'Slide 1: Login & Compliance',
      uiAction: 'Show Login Screen & Compliance Badges',
      speech:
        'Judges, this is our secure portal, compliant with the DPDP Act 2023 and CITI certified for MIMIC-III benchmark integrity.',
      tip: 'Highlight doctor role authentication and privacy compliance right at the start.'
    },
    {
      slideNum: 2,
      title: 'Slide 2: Patient Demographics & Edge-IoT Telemetry',
      uiAction: 'Click "Calculate ZVI" then click "Fetch Live Telemetry"',
      speech:
        'We enter demographic data. Notice the "Fetch Live Telemetry" button—this simulates our ESP32 IoT node sending SpO2 and temperature data via MQTT for rural offline screening.',
      tip: 'Emphasize offline rural screening capability and TinyML edge compatibility.'
    },
    {
      slideNum: 3,
      title: 'Slide 3: Symptom & Clinical Biomarkers',
      uiAction: 'Show checkboxes & CD4 gauge, explain leakage proof design',
      speech:
        'We input general biomarkers. Crucially, we do NOT input HIV RNA here. This prevents target leakage, ensuring the model actually predicts risk rather than just reading the answer.',
      tip: 'Judges love anti-leakage methodology—emphasize this protects real-world clinical validity.'
    },
    {
      slideNum: 4,
      title: 'Slide 4: AI & Quantum Engine',
      uiAction: 'Click "Run Quantum-Classical Inference" & watch 5-stage progress',
      speech:
        'Watch the pipeline. The classical XGBoost model runs, but then the data is compressed via PCA and fed into our 4-Qubit Variational Quantum Circuit. The purple card shows the Quantum inference, which is then stacked into a final hybrid score.',
      tip: 'Point to the purple quantum card and highlight the Angle Encoding + StronglyEntanglingLayers.'
    },
    {
      slideNum: 5,
      title: 'Slide 5: Explainable AI (SHAP) & ZVI Heatmap',
      uiAction: 'Show SHAP impact bar chart & regional risk distribution',
      speech:
        'Finally, the SHAP chart tells the doctor exactly WHY the risk is high, and the ZVI heatmap helps NACO allocate resources to the most vulnerable zones.',
      tip: 'Conclude by pointing out the downloadable CSV clinical report ready for NACO transmission.'
    }
  ];

  const handleCopy = (text: string, slideNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSlide(slideNum);
    setTimeout(() => setCopiedSlide(null), 2000);
  };

  const fullScript = slides.map((s) => `[${s.title}]\n"${s.speech}"`).join('\n\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>The Hackathon Demo Script (SIH 2026)</span>
                <span className="text-[10px] font-mono font-normal bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                  What to say while clicking
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Word-for-word pitch guide matched to each screen transition.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Cards */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">5-Slide Pitch Timeline (Approx. 2:30 mins):</span>
            <button
              onClick={() => handleCopy(fullScript, 0)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {copiedSlide === 0 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSlide === 0 ? 'Copied Full Script!' : 'Copy Entire Script'}</span>
            </button>
          </div>

          {slides.map((item) => (
            <div
              key={item.slideNum}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center">
                    {item.slideNum}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                </div>

                <button
                  onClick={() => handleCopy(item.speech, item.slideNum)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  {copiedSlide === item.slideNum ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Quote</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Hint */}
              <div className="text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 font-medium">
                👉 <strong>Live Action:</strong> {item.uiAction}
              </div>

              {/* Spoken Words */}
              <blockquote className="p-3 bg-white rounded-lg border border-slate-200 font-medium text-slate-900 text-xs italic leading-relaxed">
                &ldquo;{item.speech}&rdquo;
              </blockquote>

              <p className="text-[11px] text-slate-500">
                💡 <strong>Judge Impact Note:</strong> {item.tip}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Put the live URL on SIH PPT Slide 6!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Ready to Demo
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Dna, Atom, ShieldCheck, LogOut, Rocket, Mic, Github } from 'lucide-react';

interface NavbarProps {
  doctorName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenDeployGuide: () => void;
  onOpenPitchScript: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  doctorName,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenDeployGuide,
  onOpenPitchScript,
}) => {
  const tabs = [
    { id: 'intake', label: '📋 1. Patient & IoT Intake' },
    { id: 'biomarkers', label: '🧬 2. Clinical Biomarkers' },
    { id: 'quantum', label: '⚛️ 3. AI & Quantum Engine' },
    { id: 'zonal', label: '📊 4. Zonal Insights & Report' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act 2023 Compliant
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">
            CITI Certified (MIMIC-III Ready)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-indigo-300 font-mono">
            Target Leakage Proof Engine
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            id="btn-nav-pitch-script"
            onClick={onOpenPitchScript}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer font-medium"
          >
            <Mic className="w-3.5 h-3.5" />
            Hackathon Script (SIH)
          </button>
          <span className="text-slate-600">|</span>
          <button
            id="btn-nav-github-deploy"
            onClick={onOpenDeployGuide}
            className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer font-medium"
          >
            <Github className="w-3.5 h-3.5" />
            Deploy (rikpatra2005)
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-500/20">
              <div className="relative">
                <Atom className="w-6 h-6 text-cyan-300 animate-spin-slow" />
                <Dna className="w-3.5 h-3.5 text-white absolute -bottom-1 -right-1" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-display">
                  QuantumAI-HIV
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-indigo-200/80">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Secure Edge-Cloud Portal for Healthcare Professionals
              </p>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <span className="text-slate-500">Logged in: </span>
                <span className="font-semibold text-slate-800">{doctorName}</span>
              </div>
            </div>

            <button
              id="btn-header-deploy-guide"
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch / Deploy Guide</span>
              <span className="sm:hidden">Deploy</span>
            </button>

            <button
              id="btn-header-logout"
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

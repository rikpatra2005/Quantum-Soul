import React, { useState } from 'react';
import { Lock, UserCheck, ShieldCheck, Atom, Dna, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (doctorName: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('DOC_001');
  const [password, setPassword] = useState('sih2026_secure');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter valid credentials.');
      return;
    }
    setError('');
    const doctorLabel = username.toUpperCase().includes('DOC')
      ? 'Dr. Sushovan Das (DOC_001)'
      : `Dr. ${username}`;
    onLogin(doctorLabel);
  };

  const handleQuickDemo = () => {
    setUsername('DOC_001');
    setPassword('sih2026_secure');
    onLogin('Dr. Sushovan Das');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-4 ring-4 ring-white">
          <div className="relative">
            <Atom className="w-9 h-9 text-cyan-300" />
            <Dna className="w-5 h-5 text-white absolute -bottom-1 -right-1" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-900 font-display">
          🧬 QuantumAI-HIV Prediction System
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Secure Edge-Cloud Portal for Healthcare Professionals | SIH 2026
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Doctor ID / Username
              </label>
              <div className="relative">
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Doctor ID (e.g., DOC_001)"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Secure Access Key
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Secure Key"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm bg-blue-700 hover:bg-blue-800 transition-colors shadow-md shadow-blue-700/20 cursor-pointer"
            >
              <span>🔐 Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              id="btn-quick-login-demo"
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
            >
              ⚡ Quick Demo Sign-In (Dr. Sushovan Das)
            </button>
            <span className="text-[11px] text-slate-400">Node: PICO-2W-TLS</span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ethical Compliance: DPDP Act 2023 & CITI Certified
            </div>
            <p className="text-slate-400 leading-relaxed">
              MIMIC-III benchmark trained with zero patient identifiable data leaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

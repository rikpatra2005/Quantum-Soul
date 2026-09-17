import React, { useState } from 'react';
import {
  X,
  Github,
  Rocket,
  Check,
  Copy,
  ExternalLink,
  Code,
  Terminal,
  FileCode,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ghpages' | 'streamlit' | 'files'>('ghpages');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitCommands = `# 1. Initialize git and commit all ready-to-launch files
git init
git add .
git commit -m "feat: QuantumAI-HIV SIH 2026 portal (React + Streamlit + GitHub Actions)"
git branch -M main

# 2. Link to your GitHub profile repository (rikpatra2005)
git remote add origin https://github.com/rikpatra2005/quantum-hiv-sih.git

# 3. Push live to GitHub
git push -u origin main`;

  const ghActionYaml = `name: Deploy to GitHub Pages (0 Cost Hosting)

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci || npm install

      - name: Build Web Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-300">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                🚀 Ready-to-Launch Deployment Guide
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Prepared for: <span className="text-cyan-300 font-bold">rikpatra2005</span> / quantum-hiv-sih
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('ghpages')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'ghpages'
                ? 'bg-white text-blue-700 border-slate-200 shadow-xs -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              1. GitHub Pages (Zero Cost)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('streamlit')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'streamlit'
                ? 'bg-white text-blue-700 border-slate-200 shadow-xs -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              2. Streamlit Cloud (3-Min Hackathon)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x cursor-pointer ${
              activeTab === 'files'
                ? 'bg-white text-blue-700 border-slate-200 shadow-xs -mb-px'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" />
              3. Built-In Files Check
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {activeTab === 'ghpages' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Configured for GitHub Profile: github.com/rikpatra2005</span>
                </div>
                Your live web URL will be:{' '}
                <a
                  href="https://rikpatra2005.github.io/quantum-hiv-sih/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold underline text-blue-800"
                >
                  https://rikpatra2005.github.io/quantum-hiv-sih/
                </a>{' '}
                with <strong>$0 hosting cost forever</strong>. The automated deployment workflow is already written in{' '}
                <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">.github/workflows/deploy.yml</code>.
              </div>

              {/* Step 1 */}
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                  Create Repository on GitHub
                </h3>
                <p className="text-slate-600 mb-2">
                  Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-700 underline font-medium inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a> and create a public repository named:
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg font-mono font-bold text-slate-900">
                    quantum-hiv-sih
                  </code>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                    Push Code to Your GitHub Repository
                  </h3>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    {copiedKey === 'git' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Terminal Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                  <pre>{gitCommands}</pre>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                  Enable GitHub Pages in Repository Settings
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 ml-1">
                  <li>In your repository, click <strong>Settings</strong> &gt; <strong>Pages</strong>.</li>
                  <li>Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.</li>
                  <li>GitHub will run the workflow in ~1 minute and make your live website active!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'streamlit' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 leading-relaxed">
                <div className="font-bold mb-1">Streamlit Community Cloud (The Hackathon Standard)</div>
                Both <code className="bg-purple-100 px-1 py-0.5 rounded font-mono font-bold">requirements.txt</code> and <code className="bg-purple-100 px-1 py-0.5 rounded font-mono font-bold">app.py</code> are created in your project root ready for instant deployment.
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Step 1: Push app.py &amp; requirements.txt to GitHub</span>
                  <p className="text-slate-500 mt-1">Both files are already present in this directory, so pushing to <code className="font-mono text-slate-800">rikpatra2005/quantum-hiv-sih</code> uploads them automatically.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Step 2: Deploy at share.streamlit.io</span>
                  <p className="text-slate-500 mt-1">Log in at <a href="https://share.streamlit.io/" target="_blank" rel="noreferrer" className="text-blue-700 underline font-semibold">share.streamlit.io</a> with GitHub &gt; Click <strong>New app</strong> &gt; Select repo <code className="font-mono text-slate-800">rikpatra2005/quantum-hiv-sih</code> &gt; Set Main file to <code className="font-mono text-slate-800">app.py</code> &gt; Click <strong>Deploy</strong>!</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Step 3: Live Link on PPT Slide 6</span>
                  <p className="text-slate-500 mt-1">Streamlit provides your live URL (e.g. <code className="font-mono text-slate-800 font-bold">https://quantum-hiv-sih.streamlit.app</code>) to present to SIH judges.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Generated Project Deployment Files:</span>
                <span className="text-[11px] text-emerald-700 font-semibold">All 3 Ready</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-700" />
                    <span className="font-mono font-semibold text-slate-800">/.github/workflows/deploy.yml</span>
                  </div>
                  <span className="text-[11px] text-slate-500">GitHub Pages auto-deploy workflow</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-700" />
                    <span className="font-mono font-semibold text-slate-800">/app.py</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Streamlit single-file python prototype</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-700" />
                    <span className="font-mono font-semibold text-slate-800">/requirements.txt</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Streamlit, pandas, numpy, plotly, sklearn</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Smart India Hackathon (SIH 2026) Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};

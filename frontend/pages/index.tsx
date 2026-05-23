import React from 'react';
import Head from 'next/head';
import { EditorPanel } from '../components/editor/EditorPanel';
import { A4Preview } from '../components/resume/A4Preview';
import { AIAssistant } from '../components/ai/AIAssistant';
import { VersionSidebar } from '../components/version/VersionSidebar';
import { useResumeStore } from '../store/useResumeStore';
import {
  Sparkles, Download, RotateCcw, Monitor,
  Save, CheckCircle2, Loader2
} from 'lucide-react';


export default function Home() {
  const {
    loadDemoData, resetData, atsAnalysis, loadAllResumes,
    saveResumeToServer, isScanning, title, personalInfo,
  } = useResumeStore();

  const [isSaving, setIsSaving] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState(false);

  React.useEffect(() => {
    loadAllResumes();
  }, []);

  const handlePrint = () => window.print();

  const handleManualSave = async () => {
    setIsSaving(true);
    await saveResumeToServer();
    setIsSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const scoreColor = atsAnalysis.score >= 80
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : atsAnalysis.score >= 65
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <>
      <Head>
        <title>ResumeOS — AI Resume Operating System</title>
        <meta name="description" content="Build, optimize and export ATS-friendly resumes powered by AI. ResumeOS is the all-in-one AI Resume Operating System." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Main App — hidden on print */}
      <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden font-sans print:hidden">

        {/* ── TOP BAR ── */}
        <header className="border-b border-slate-200 bg-white px-5 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-outfit leading-tight">
                ResumeOS
                <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">v1.0</span>
              </h1>
              <p className="text-[9.5px] text-slate-400 font-medium leading-none">
                {personalInfo.name ? `Editing: ${personalInfo.name}` : 'AI Resume Operating System'}
              </p>
            </div>
          </div>

          {/* Center — ATS Badge */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-bold ${scoreColor}`}>
              {isScanning
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning...</>
                : <><span className="text-[9px] font-bold uppercase tracking-widest opacity-70">ATS</span>{atsAnalysis.score}%</>
              }
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadDemoData}
              className="px-3 py-1.5 border border-slate-200 text-[10.5px] font-semibold rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Load Demo
            </button>
            <button
              onClick={resetData}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
              title="Clear All"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className={`px-3 py-1.5 border rounded-lg text-[10.5px] font-semibold transition flex items-center gap-1.5 ${
                savedMsg
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {savedMsg
                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
                : isSaving
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                  : <><Save className="w-3.5 h-3.5" /> Save</>
              }
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-[10.5px] font-bold text-white shadow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </header>

        {/* ── MAIN SPLIT PANELS ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Panel 1 — Resume Versions Sidebar (16%) */}
          <aside className="w-[16%] border-r border-slate-200 bg-slate-50/30 p-3 flex flex-col h-full overflow-hidden shrink-0">
            <VersionSidebar />
          </aside>

          {/* Panel 2 — Structured Editor (27%) */}
          <aside className="w-[27%] border-r border-slate-200 bg-slate-50/10 p-3.5 flex flex-col h-full overflow-hidden shrink-0">
            <EditorPanel />
          </aside>

          {/* Panel 3 — Live A4 Preview (30%) */}
          <main className="w-[30%] bg-slate-100/60 border-r border-slate-200 flex flex-col items-center py-5 px-4 overflow-y-auto h-full">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Monitor className="w-3.5 h-3.5" /> Live A4 Preview
            </div>
            <div className="shadow-2xl border border-slate-200 rounded-sm w-full max-w-[560px]">
              <A4Preview />
            </div>
          </main>

          {/* Panel 4 — AI Assistant (27%) */}
          <aside className="w-[27%] bg-slate-50/30 p-3.5 flex flex-col h-full overflow-hidden shrink-0">
            <AIAssistant />
          </aside>
        </div>
      </div>

      {/* Print-only A4 output */}
      <div className="hidden print:block bg-white text-slate-900 p-0 m-0">
        <A4Preview />
      </div>
    </>
  );
}

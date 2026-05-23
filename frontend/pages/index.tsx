import React from 'react';
import Head from 'next/head';
import { EditorPanel } from '../components/editor/EditorPanel';
import { A4Preview } from '../components/resume/A4Preview';
import { AIAssistant } from '../components/ai/AIAssistant';
import { VersionSidebar } from '../components/version/VersionSidebar';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, FileText, Download, RotateCcw, Monitor } from 'lucide-react';

export default function Home() {
  const { loadDemoData, resetData, atsAnalysis, loadAllResumes } = useResumeStore();

  React.useEffect(() => {
    loadAllResumes();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Head>
        <title>ResumeOS - Minimal AI Resume Operating System</title>
        <meta name="description" content="Build and optimize standard ATS-friendly resumes in real-time." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Main dashboard wrapper (hidden during standard A4 printing) */}
      <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden font-sans print:hidden">
        
        {/* TOP BAR / HEADER */}
        <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 font-outfit">
                ResumeOS <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">v1.0</span>
              </h1>
              <p className="text-[10.5px] text-slate-450">Production-grade AI Resume Operating System</p>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex items-center gap-4">
            {/* ATS Metric */}
            <div className="flex items-center gap-2 border border-slate-200/80 px-3 py-1.5 rounded-xl bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">ATS score:</span>
              <span className={`text-xs font-bold ${atsAnalysis.score >= 80 ? 'text-emerald-650' : 'text-amber-650'}`}>
                {atsAnalysis.score}%
              </span>
            </div>

            {/* Print actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadDemoData}
                className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              >
                Load Sample
              </button>
              <button
                onClick={resetData}
                className="px-3 py-1.5 border border-transparent text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                title="Reset Data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 active:scale-95 text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER SPLIT PANELS */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Version Switcher Sidebar (Width 18%) */}
          <aside className="w-[18%] border-r border-slate-200 bg-slate-50/30 p-3 flex flex-col h-full overflow-hidden shrink-0">
            <VersionSidebar />
          </aside>

          {/* Left Pane: Structured Form Editor (Width 27%) */}
          <aside className="w-[27%] border-r border-slate-200 bg-slate-50/30 p-4 flex flex-col h-full overflow-hidden shrink-0">
            <EditorPanel />
          </aside>

          {/* Center Pane: Real-time Live A4 Document Preview (Width 35%) */}
          <main className="w-[35%] bg-slate-100/50 border-r border-slate-200 flex flex-col items-center p-6 overflow-y-auto h-full scrollbar-thin">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Monitor className="w-3.5 h-3.5" /> Live A4 Sheet Preview
            </div>

            <div className="shadow-2xl border border-slate-200 rounded-sm">
              <A4Preview />
            </div>
          </main>

          {/* Right Pane: AI Assistant & ATS Scanner Engine (Width 20%) */}
          <aside className="w-[20%] bg-slate-50/30 p-4 flex flex-col h-full overflow-hidden shrink-0">
            <AIAssistant />
          </aside>

        </div>
      </div>

      {/* Standard CSS Printable frame for window.print() mapping */}
      <div className="hidden print:block bg-white text-slate-850 p-0 m-0">
        <A4Preview />
      </div>
    </>
  );
}


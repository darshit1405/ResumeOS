import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  Sparkles, CheckCircle2, AlertTriangle, ChevronRight,
  Target, Loader2, Building2, Brain
} from 'lucide-react';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { InterviewPrep } from './InterviewPrep';
import { CompanySuggestions } from './CompanySuggestions';

type Tab = 'score' | 'optimize' | 'fresher' | 'cover-letter' | 'interview' | 'companies';

export const AIAssistant: React.FC = () => {
  const {
    atsAnalysis, isScanning,
    jobDescription, companyName, targetRole,
    setJobDescription, setCompanyDetails,
    triggerAtsScan, optimizeResume,
    experience, updateExperience,
    generateFromTemplate, isGeneratingQuestions,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<Tab>('score');
  const [improvingId, setImprovingId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleEnhanceBullet = async (expId: string) => {
    setImprovingId(expId);
    setTimeout(() => {
      const exp = experience.find(e => e.id === expId);
      if (exp) {
        let enhancedText = exp.description;
        if (exp.company.toLowerCase().includes('technovation')) {
          enhancedText = `- Spearheaded Next.js adoption, reducing page load times by 35% and boosting engagement by 18%.\n- Coordinated development of WebSocket modules, decreasing latency by 200ms.\n- Mentored 3 junior developers and established standardized code compliance protocols.`;
        } else {
          enhancedText = `- Engineered secure internal API endpoints using Node.js, achieving 99.9% uptime and handling 10k daily users.\n- Formulated comprehensive testing workflows, boosting code coverage to 88% and eliminating 15+ production bugs.`;
        }
        updateExperience(expId, { description: enhancedText });
      }
      setImprovingId(null);
    }, 800);
  };

  const handleOptimize = async () => {
    if (!jobDescription.trim()) return;
    setIsOptimizing(true);
    try {
      await optimizeResume(jobDescription, companyName, targetRole);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'score', label: 'ATS Score' },
    { id: 'optimize', label: 'Optimizer' },
    { id: 'fresher', label: 'AI Enhance' },
    { id: 'cover-letter', label: 'Cover Letter' },
    { id: 'interview', label: 'Interview' },
    { id: 'companies', label: 'Companies' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full select-none text-slate-800">
      {/* Tab Nav — scrollable */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto scrollbar-none shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3 py-2.5 text-[10px] font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── ATS SCORE TAB ── */}
        {activeTab === 'score' && (
          <div className="space-y-4">
            {/* Score Ring */}
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50/30">
              <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 font-bold text-lg shrink-0 ${getScoreColor(atsAnalysis.score)}`}>
                <span>{isScanning ? '—' : atsAnalysis.score}</span>
                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">ATS</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {atsAnalysis.score >= 85 ? '🎉 Excellent ATS Compatibility' : atsAnalysis.score >= 70 ? '⚡ Good — Needs Minor Fixes' : '⚠️ ATS Compatibility Needs Work'}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                  Target 80–95 for best recruiter visibility.
                </p>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="space-y-2.5">
              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Parser Breakdown</h5>
              {[
                { label: 'Formatting & Contacts', val: atsAnalysis.breakdown.formatting },
                { label: 'Section Completeness', val: atsAnalysis.breakdown.completeness },
                { label: 'Action Verb Density', val: atsAnalysis.breakdown.actionVerbs },
                { label: 'Keywords & Skills Match', val: atsAnalysis.breakdown.skillsMatch },
                { label: 'Job Relevance', val: atsAnalysis.breakdown.jobRelevance },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="text-slate-800">{m.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 rounded-full ${getBarColor(m.val)}`} style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Actions */}
            {atsAnalysis.suggestions.critical.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> Action Items
                </h5>
                <div className="space-y-1.5">
                  {atsAnalysis.suggestions.critical.map((s, idx) => (
                    <div key={idx} className="flex gap-2 text-[10px] text-slate-600 leading-relaxed items-start bg-amber-50/50 border border-amber-100 rounded-lg p-2">
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {atsAnalysis.suggestions.skills.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Missing Keywords</h5>
                <div className="flex flex-wrap gap-1.5">
                  {atsAnalysis.suggestions.skills.map((skill, idx) => (
                    <span key={idx} className="text-[9.5px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Re-scan Button */}
            <button
              onClick={triggerAtsScan}
              disabled={isScanning}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {isScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isScanning ? 'Scanning...' : 'Re-scan ATS'}
            </button>
          </div>
        )}

        {/* ── JOB OPTIMIZER TAB ── */}
        {activeTab === 'optimize' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Recruiter Alignment Engine</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyDetails(e.target.value, targetRole)}
                    placeholder="e.g. Google"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setCompanyDetails(companyName, e.target.value)}
                    placeholder="e.g. SDE II"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Description</label>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here. AI will extract ATS keywords and rewrite your resume to match..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={triggerAtsScan}
                  disabled={isScanning}
                  className="py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  Analyze Gaps
                </button>
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing || !jobDescription.trim()}
                  className="py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
                </button>
              </div>
            </div>

            {atsAnalysis.suggestions.skills.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Suggested Missing Keywords</h5>
                <div className="flex flex-wrap gap-1.5">
                  {atsAnalysis.suggestions.skills.map((skill, idx) => (
                    <span key={idx} className="text-[9.5px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI ENHANCE (FRESHER) TAB ── */}
        {activeTab === 'fresher' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-900">AI Bullet Enhancer</h4>
              </div>
              <p className="text-[10px] text-indigo-700 leading-relaxed">
                Select any experience role to rewrite bullet points with strong action verbs, quantified metrics, and ATS-optimized phrasing.
              </p>
            </div>

            {experience.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No experiences added yet. Go to the Work tab to add them.</p>
            ) : (
              <div className="space-y-2.5">
                {experience.map((exp) => (
                  <div key={exp.id} className="border border-slate-200 rounded-xl p-3.5 flex justify-between items-center bg-slate-50/30">
                    <div className="truncate pr-3">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{exp.role || 'Role Name'}</h5>
                      <span className="text-[10px] text-slate-400 truncate block">{exp.company || 'Company'}</span>
                    </div>
                    <button
                      onClick={() => handleEnhanceBullet(exp.id)}
                      disabled={improvingId === exp.id}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold shrink-0 transition flex items-center gap-1 disabled:opacity-60"
                    >
                      {improvingId === exp.id
                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Enhancing...</>
                        : <><Sparkles className="w-3 h-3" /> Enhance</>
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COVER LETTER TAB ── */}
        {activeTab === 'cover-letter' && <CoverLetterGenerator />}

        {/* ── INTERVIEW TAB ── */}
        {activeTab === 'interview' && <InterviewPrep />}

        {/* ── COMPANIES TAB ── */}
        {activeTab === 'companies' && <CompanySuggestions />}
      </div>
    </div>
  );
};

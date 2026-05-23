import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Sparkles, CheckCircle2, AlertTriangle, ChevronRight, Zap, Target } from 'lucide-react';
import { CoverLetterGenerator } from './CoverLetterGenerator';

export const AIAssistant: React.FC = () => {
  const {
    atsAnalysis,
    isScanning,
    jobDescription,
    companyName,
    targetRole,
    setJobDescription,
    setCompanyDetails,
    triggerAtsScan,
    experience,
    updateExperience,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<'score' | 'optimize' | 'fresher' | 'cover-letter'>('score');
  const [improvingId, setImprovingId] = useState<string | null>(null);

  // Programmatic mock improvement helper
  const handleEnhanceBullet = async (expId: string) => {
    setImprovingId(expId);
    
    // Simulate real backend AI rewrite latency
    setTimeout(() => {
      const exp = experience.find(e => e.id === expId);
      if (exp) {
        let enhancedText = exp.description;
        // Mocking high-quality ATS friendly bullet points
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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full select-none text-slate-800">
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
        <button
          onClick={() => setActiveTab('score')}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition ${
            activeTab === 'score'
              ? 'border-indigo-650 text-indigo-650 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          ATS Scoring Engine
        </button>
        <button
          onClick={() => setActiveTab('optimize')}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition ${
            activeTab === 'optimize'
              ? 'border-indigo-650 text-indigo-650 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Job Optimizer
        </button>
        <button
          onClick={() => setActiveTab('fresher')}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition ${
            activeTab === 'fresher'
              ? 'border-indigo-650 text-indigo-650 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Fresher Helper
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`flex-1 py-3 text-xs font-semibold border-b-2 text-center transition ${
            activeTab === 'cover-letter'
              ? 'border-indigo-650 text-indigo-650 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Cover Letter
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* ATS SCORING ENGINE TAB */}
        {activeTab === 'score' && (
          <div className="space-y-4">
            {/* Score Ring / Block */}
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50/30">
              <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border font-bold text-lg shrink-0 ${getScoreColor(atsAnalysis.score)}`}>
                <span>{isScanning ? '...' : atsAnalysis.score}</span>
                <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">ATS</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {atsAnalysis.score >= 80 ? 'ATS Compatibility is Excellent' : 'ATS Compatibility Needs Work'}
                </h4>
                <p className="text-[10.5px] text-slate-550 leading-normal mt-0.5">
                  Aim for a target compatibility index of 80–95. Adjust keywords and bullet formatting to pass parsers.
                </p>
              </div>
            </div>

            {/* Breakdown metrics */}
            <div className="space-y-2.5">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parser Dimensions</h5>
              
              {/* Metric Row */}
              {[
                { label: 'Formatting & Contacts', val: atsAnalysis.breakdown.formatting },
                { label: 'Completeness Checklist', val: atsAnalysis.breakdown.completeness },
                { label: 'Action Verb Density', val: atsAnalysis.breakdown.actionVerbs },
                { label: 'Keywords & Skills Match', val: atsAnalysis.breakdown.skillsMatch },
                { label: 'Target Job Relevance', val: atsAnalysis.breakdown.jobRelevance },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="text-slate-800">{m.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${getBarColor(m.val)}`} style={{ width: `${m.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Improvements */}
            {atsAnalysis.suggestions.critical.length > 0 && (
              <div className="space-y-2 pt-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Action Items to Improve Score
                </h5>
                <div className="space-y-1.5">
                  {atsAnalysis.suggestions.critical.map((s, idx) => (
                    <div key={idx} className="flex gap-2 text-[10.5px] text-slate-650 leading-relaxed items-start">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOB OPTIMIZER TAB */}
        {activeTab === 'optimize' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Recruiter Alignment</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyDetails(e.target.value, targetRole)}
                    placeholder="e.g. Google"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setCompanyDetails(companyName, e.target.value)}
                    placeholder="e.g. Senior Frontend Dev"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paste Job Description</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description keywords to analyze skills gaps and run optimization..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <button
                onClick={triggerAtsScan}
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" /> Analyze Keyword Gaps
              </button>
            </div>

            {/* Keyword / Skill Suggestions */}
            {atsAnalysis.suggestions.skills.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Missing Keywords</h5>
                <div className="flex flex-wrap gap-1.5">
                  {atsAnalysis.suggestions.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] bg-slate-50 border border-slate-200 text-indigo-700 px-2 py-0.5 rounded font-semibold"
                    >
                      +{skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FRESHER AI HELPER TAB */}
        {activeTab === 'fresher' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Professional Enhancer
              </h4>
              <p className="text-[10.5px] text-slate-550 leading-normal">
                No corporate experience? Select active experiences and let AI rewrite achievements with metrics, strong action verbs, and impact targets.
              </p>
            </div>

            {experience.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No experiences added. Add experience items under the Work tab first.</p>
            ) : (
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="border border-slate-150 rounded-xl p-3 flex justify-between items-center bg-slate-50/30">
                    <div className="truncate pr-3">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{exp.role || 'Role Name'}</h5>
                      <span className="text-[10px] text-slate-450 truncate block">{exp.company || 'Company'}</span>
                    </div>
                    <button
                      onClick={() => handleEnhanceBullet(exp.id)}
                      disabled={improvingId === exp.id}
                      className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10.5px] font-bold shrink-0 transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {improvingId === exp.id ? (
                        <>...</>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" /> Enhance
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COVER LETTER TAB */}
        {activeTab === 'cover-letter' && (
          <CoverLetterGenerator />
        )}
      </div>
    </div>
  );
};

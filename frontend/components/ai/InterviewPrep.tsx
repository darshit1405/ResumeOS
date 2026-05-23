import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Loader2, ChevronDown, ChevronRight, User, Code2, Brain, MessageSquare, Sparkles } from 'lucide-react';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  hr: { label: 'HR', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-100', icon: <User className="w-3 h-3" /> },
  technical: { label: 'Technical', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', icon: <Code2 className="w-3 h-3" /> },
  behavioral: { label: 'Behavioral', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', icon: <Brain className="w-3 h-3" /> },
  coding: { label: 'Coding', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', icon: <Code2 className="w-3 h-3" /> },
};

export const InterviewPrep: React.FC = () => {
  const { interviewQuestions, isGeneratingQuestions, generateInterviewQuestions, personalInfo } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleGenerate = async () => {
    await generateInterviewQuestions(customRole || personalInfo.title);
  };

  const filtered = activeFilter === 'all'
    ? interviewQuestions
    : interviewQuestions.filter((q: any) => q.type === activeFilter);

  return (
    <div className="space-y-4">
      {/* Generator Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Interview Coach</h4>
        </div>
        <p className="text-[10.5px] text-indigo-700 mb-3 leading-relaxed">
          Get personalized interview questions based on your resume + target role. Includes HR, Technical, Behavioral & Coding rounds.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder={personalInfo.title || 'e.g. Senior Frontend Engineer'}
            className="flex-1 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white"
          />
          <button
            onClick={handleGenerate}
            disabled={isGeneratingQuestions}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            {isGeneratingQuestions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isGeneratingQuestions ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {interviewQuestions.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {['all', 'hr', 'technical', 'behavioral', 'coding'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition capitalize ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'all' ? `All (${interviewQuestions.length})` : filter}
            </button>
          ))}
        </div>
      )}

      {/* Questions List */}
      {isGeneratingQuestions ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-500">Generating personalized questions...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((q: any, idx: number) => {
            const cfg = TYPE_CONFIG[q.type] || TYPE_CONFIG.hr;
            const isOpen = expandedId === q.id;
            return (
              <div key={q.id || idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setExpandedId(isOpen ? null : q.id)}
                  className="w-full flex items-start gap-3 p-3.5 text-left hover:bg-slate-50 transition"
                >
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold shrink-0 mt-0.5 ${cfg.color} ${cfg.bg}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className="text-[11px] text-slate-800 font-medium flex-1 leading-relaxed">{q.question}</span>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />}
                </button>
                {isOpen && q.suggestedAnswer && (
                  <div className="px-3.5 pb-3.5 border-t border-slate-100">
                    <div className="mt-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MessageSquare className="w-3 h-3 text-indigo-600" />
                        <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider">Suggested Answer Guide</span>
                      </div>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed">{q.suggestedAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400 italic">Click Generate to get personalized interview questions based on your resume.</p>
        </div>
      )}
    </div>
  );
};

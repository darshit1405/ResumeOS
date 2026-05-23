import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Loader2, Building2, TrendingUp, AlertCircle, Sparkles, DollarSign, ExternalLink } from 'lucide-react';

export const CompanySuggestions: React.FC = () => {
  const { companySuggestions, isGeneratingSuggestions, suggestCompanies } = useResumeStore();

  const getMatchColor = (pct: number) => {
    if (pct >= 85) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' };
    if (pct >= 70) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' };
    return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' };
  };

  return (
    <div className="space-y-4">
      {/* CTA Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Career Match Engine</h4>
        </div>
        <p className="text-[10.5px] text-emerald-700 mb-3 leading-relaxed">
          AI analyzes your skills, experience, and projects to suggest the best-matching companies, roles, salary estimates, and skill gaps.
        </p>
        <button
          onClick={suggestCompanies}
          disabled={isGeneratingSuggestions}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          {isGeneratingSuggestions
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing your profile...</>
            : <><Sparkles className="w-3.5 h-3.5" /> Find Matching Companies</>
          }
        </button>
      </div>

      {/* Results */}
      {isGeneratingSuggestions ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs text-slate-500">Analyzing your resume profile...</p>
        </div>
      ) : companySuggestions.length > 0 ? (
        <div className="space-y-3">
          {companySuggestions.map((company: any, idx: number) => {
            const colors = getMatchColor(company.matchPercentage);
            return (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-4.5 h-4.5 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{company.companyName}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{company.roleTitle}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold shrink-0 ${colors.bg} ${colors.text}`}>
                    <TrendingUp className="w-3 h-3" />
                    {company.matchPercentage}%
                  </div>
                </div>

                {/* Match Bar */}
                <div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                    <span>Match Score</span>
                    <span>{company.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${colors.bar}`}
                      style={{ width: `${company.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Salary */}
                {company.salaryRange && (
                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-700 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {company.salaryRange}
                  </div>
                )}

                {/* Reason */}
                {company.reason && (
                  <p className="text-[10.5px] text-slate-600 leading-relaxed border-l-2 pl-2.5" style={{ borderColor: '#10b981' }}>
                    {company.reason}
                  </p>
                )}

                {/* Missing Skills */}
                {company.missingSkills?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Skills to Add</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {company.missingSkills.map((skill: string, i: number) => (
                        <span key={i} className="text-[9.5px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-semibold">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400 italic">Click above to find companies that match your resume profile.</p>
        </div>
      )}
    </div>
  );
};

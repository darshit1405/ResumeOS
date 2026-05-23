import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Sparkles, Copy, Download, Save, RefreshCw } from 'lucide-react';

export const CoverLetterGenerator: React.FC = () => {
  const {
    jobDescription,
    companyName,
    targetRole,
    setCompanyDetails,
    setJobDescription,
    generateCoverLetter,
    isGeneratingLetter,
    activeCoverLetter,
    saveCoverLetter,
    coverLetters,
    loadCoverLetters,
  } = useResumeStore();

  const [company, setCompany] = useState(companyName || '');
  const [role, setRole] = useState(targetRole || '');
  const [jd, setJd] = useState(jobDescription || '');
  const [isCopied, setIsCopied] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Sync from store when loaded
  React.useEffect(() => {
    if (activeCoverLetter) {
      setEditingContent(activeCoverLetter.content);
    }
  }, [activeCoverLetter]);

  const handleGenerate = async () => {
    if (!company || !role || !jd) {
      alert('Please fill in the Company Name, Target Role, and Job Description first.');
      return;
    }
    setCompanyDetails(company, role);
    setJobDescription(jd);
    await generateCoverLetter(jd, company, role);
  };

  const handleCopy = () => {
    const text = isEditing ? editingContent : activeCoverLetter?.content || '';
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = isEditing ? editingContent : activeCoverLetter?.content || '';
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${company.replace(/\s+/g, '_')}_${role.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    const contentToSave = isEditing ? editingContent : activeCoverLetter?.content || '';
    if (!contentToSave) return;
    await saveCoverLetter(
      `Cover Letter - ${company} (${role})`,
      company,
      role,
      contentToSave
    );
    setIsEditing(false);
    alert('Cover letter saved to database!');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Letter Builder
        </h4>
        <p className="text-[10.5px] text-slate-550 leading-normal">
          Generate an AI-tailored cover letter mapping your resume against details of the target job post.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Role Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Dev"
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Job Description</label>
          <textarea
            rows={3}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job details or requirements here..."
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingLetter}
          className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          {isGeneratingLetter ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Generate Tailored Letter
            </>
          )}
        </button>
      </div>

      {activeCoverLetter && (
        <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              Generated Result
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
                title="Copy to Clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
                title="Download .txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
                title="Save Cover Letter"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              rows={8}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
            />
          ) : (
            <div
              onClick={() => {
                setEditingContent(activeCoverLetter.content);
                setIsEditing(true);
              }}
              className="text-[11.5px] text-slate-650 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans cursor-pointer hover:bg-slate-105/20 p-1 rounded transition"
              title="Click to edit content"
            >
              {activeCoverLetter.content}
            </div>
          )}

          {isCopied && (
            <div className="text-[9.5px] text-emerald-600 font-semibold text-right">
              Copied successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

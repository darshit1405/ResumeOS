import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Sparkles, Printer, ArrowLeft } from 'lucide-react';

export default function PublicPortfolio() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    fetch(`${API_BASE}/portfolios/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Portfolio or Resume not found');
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-550">Fetching portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="max-w-md w-full p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Portfolio Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The requested url does not exist or has been unpublished.</p>
          <a href="/" className="text-xs font-bold text-indigo-600 hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const resume = data.resume;
  const personalInfo = resume.personalInfo || {};
  const skills = resume.skills || [];
  const experience = resume.experience || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const designConfig = resume.designConfig || { font: 'Inter', spacing: 'comfortable', primaryColor: '#4f46e5' };
  const activeTemplate = resume.designConfig?.template || 'minimal';

  const parseBullets = (desc: string) => {
    if (!desc) return [];
    return desc
      .split('\n')
      .map(b => b.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  };

  const getFontClass = () => {
    switch (designConfig.font) {
      case 'Outfit': return 'font-sans tracking-tight';
      case 'Playfair': return 'font-serif';
      case 'Inter':
      default: return 'font-sans';
    }
  };

  const getSpacingClass = () => {
    switch (designConfig.spacing) {
      case 'compact': return 'space-y-3 gap-y-3 text-[10.5px]';
      case 'spacious': return 'space-y-6 gap-y-6 text-[12px]';
      case 'comfortable':
      default: return 'space-y-4.5 gap-y-4.5 text-[11px]';
    }
  };

  // --- Templates ---
  const renderMinimal = () => (
    <div className="flex-1 flex flex-col justify-between h-full bg-white text-slate-800 p-10">
      <div>
        <div className="text-center pb-5 border-b border-slate-200">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            {personalInfo.name || 'Your Full Name'}
          </h1>
          <p className="text-xs font-semibold tracking-wider text-indigo-600 mt-1.5 uppercase">
            {personalInfo.title || 'Target Job Title'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-3 font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <><span className="text-slate-300">•</span><span>{personalInfo.phone}</span></>}
            {personalInfo.location && <><span className="text-slate-300">•</span><span>{personalInfo.location}</span></>}
            {personalInfo.website && <><span className="text-slate-300">•</span><span className="text-indigo-650 font-semibold">{personalInfo.website}</span></>}
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
              Professional Summary
            </h3>
            <p className="text-justify leading-relaxed text-slate-650">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-[12px] font-bold text-slate-900">{exp.role}</h4>
                    <span className="text-[10px] font-semibold text-slate-500">{exp.dates}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide mb-1.5">
                    {exp.company}
                  </div>
                  <ul className="list-disc pl-4 space-y-1 leading-relaxed text-slate-600">
                    {parseBullets(exp.description).map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
              Key Projects
            </h3>
            <div className="space-y-4">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[12px] font-bold text-slate-900">
                      {proj.name} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}
                    </h4>
                    {proj.link && <span className="text-[10px] text-indigo-500 font-semibold">{proj.link}</span>}
                  </div>
                  <p className="text-slate-650 mt-1 leading-relaxed">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] font-semibold text-slate-500 mt-1">
                      Tech Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
              Education
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[11.5px] font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-[9.5px] text-slate-400 font-semibold">{edu.dates}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 font-medium mt-0.5">
                    {edu.school} {edu.gpa && <span className="text-slate-450">(GPA: {edu.gpa})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-5 pt-3 border-t border-slate-100">
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
            Skills & Core Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill: string, idx: number) => (
              <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200/60 text-slate-650 px-2 py-0.5 rounded-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSidebar = () => (
    <div className="flex-1 flex min-h-full bg-white">
      <div className="w-[33%] bg-slate-900 text-white p-6 flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="pb-5 border-b border-slate-800">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">{personalInfo.name}</h1>
            <p className="text-[10px] font-semibold text-indigo-400 tracking-wider mt-1 uppercase">{personalInfo.title}</p>
          </div>
          <div className="mt-5 space-y-3.5">
            <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">Contact</h3>
            <div className="space-y-2 text-[10px] text-slate-300">
              {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div className="text-slate-400">{personalInfo.location}</div>}
              {personalInfo.website && <div className="text-indigo-300 truncate">{personalInfo.website}</div>}
            </div>
          </div>
          {skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Expertise</h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill: string, idx: number) => (
                  <span key={idx} className="text-[9px] bg-slate-800 border border-slate-700/60 text-slate-200 px-1.5 py-0.5 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {education.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h3 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Credentials</h3>
            <div className="space-y-3.5">
              {education.map((edu: any, idx: number) => (
                <div key={idx} className="text-[9.5px]">
                  <h4 className="font-bold text-white leading-tight">{edu.degree}</h4>
                  <p className="text-slate-400 font-medium leading-tight mt-0.5">{edu.school}</p>
                  <span className="text-[8.5px] text-slate-500 font-semibold">{edu.dates}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-[67%] p-7 flex flex-col justify-between text-slate-800 bg-white">
        <div>
          {personalInfo.summary && (
            <div>
              <h3 className="text-[11.5px] font-bold text-indigo-650 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-2 font-medium">
                Profile Summary
              </h3>
              <p className="leading-relaxed text-slate-650 text-justify">{personalInfo.summary}</p>
            </div>
          )}
          {experience.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11.5px] font-bold text-indigo-650 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-3">
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative pl-3 border-l border-indigo-100">
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500 -left-[3.5px] top-1"></div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[11.5px] font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-[9px] font-semibold text-slate-400">{exp.dates}</span>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-650 uppercase tracking-wide mb-1">
                      {exp.company}
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-600">
                      {parseBullets(exp.description).map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{personalInfo.name || 'Resume'} - Professional Profile</title>
        <meta name="description" content={`Resume of ${personalInfo.name}.`} />
      </Head>

      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
        {/* Public Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-xs tracking-wider uppercase text-slate-700">Public Portfolio Profile</span>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </header>

        {/* Dynamic A4 Preview Container */}
        <main className="flex-1 flex justify-center py-8 px-4 overflow-y-auto">
          <div className={`aspect-[1/1.4] w-full max-w-[794px] bg-white shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between ${getFontClass()} ${getSpacingClass()}`}>
            {activeTemplate === 'sidebar' ? renderSidebar() : renderMinimal()}
          </div>
        </main>
      </div>
    </>
  );
}

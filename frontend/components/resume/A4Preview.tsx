import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';

export const A4Preview: React.FC = () => {
  const { personalInfo, skills, experience, projects, education, activeTemplate, designConfig } = useResumeStore();

  const parseBullets = (desc: string) => {
    if (!desc) return [];
    return desc
      .split('\n')
      .map(b => b.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  };

  const getFontClass = () => {
    switch (designConfig.font) {
      case 'Outfit':
        return 'font-sans tracking-tight';
      case 'Playfair':
        return 'font-serif';
      case 'Inter':
      default:
        return 'font-sans';
    }
  };

  const getSpacingClass = () => {
    switch (designConfig.spacing) {
      case 'compact':
        return 'space-y-3 gap-y-3 text-[10.5px]';
      case 'spacious':
        return 'space-y-6 gap-y-6 text-[12px]';
      case 'comfortable':
      default:
        return 'space-y-4.5 gap-y-4.5 text-[11px]';
    }
  };

  // ==========================================
  // TEMPLATE A: SLATE MINIMAL
  // ==========================================
  const renderMinimal = () => (
    <div className="flex-1 flex flex-col justify-between h-full bg-white text-slate-800 p-10 select-none">
      <div>
        {/* Header Block */}
        <div className="text-center pb-5 border-b border-slate-200">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            {personalInfo.name || 'Your Full Name'}
          </h1>
          <p className="text-xs font-semibold tracking-wider text-indigo-600 mt-1.5 uppercase">
            {personalInfo.title || 'Target Job Title'}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-3 font-medium">
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.website && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-650 font-semibold">{personalInfo.website}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary Block */}
        {personalInfo.summary && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2 font-medium">
              Professional Summary
            </h3>
            <p className="text-justify leading-relaxed text-slate-600">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-[12px] font-bold text-slate-900">{exp.role || 'Job Role'}</h4>
                    <span className="text-[10px] font-semibold text-slate-500">{exp.dates || 'Date Range'}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide mb-1.5">
                    {exp.company || 'Company Name'}
                  </div>
                  <ul className="list-disc pl-4 space-y-1 leading-relaxed text-slate-600">
                    {parseBullets(exp.description).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
              Key Projects
            </h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[12px] font-bold text-slate-900">
                      {proj.name || 'Project Name'}{' '}
                      {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}
                    </h4>
                    {proj.link && <span className="text-[10px] text-indigo-500 font-semibold">{proj.link}</span>}
                  </div>
                  <p className="text-slate-650 mt-1 leading-relaxed">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] font-semibold text-slate-500 mt-1">
                      Tech Stack: {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
              Education
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[11.5px] font-bold text-slate-900">{edu.degree || 'Degree'}</h4>
                    <span className="text-[9.5px] text-slate-400 font-semibold">{edu.dates || 'Dates'}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 font-medium mt-0.5">
                    {edu.school || 'University'} {edu.gpa && <span className="text-slate-450">(GPA: {edu.gpa})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Footer */}
      {skills.length > 0 && (
        <div className="mt-5 pt-3 border-t border-slate-100">
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
            Skills & Core Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-50 border border-slate-200/60 text-slate-650 px-2 py-0.5 rounded-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // TEMPLATE B: INDIGO CREATIVE
  // ==========================================
  const renderSidebar = () => (
    <div className="flex-1 flex min-h-full bg-white select-none">
      {/* Sidebar Column */}
      <div className="w-[33%] bg-slate-900 text-white p-6 flex flex-col justify-between border-r border-slate-800">
        <div>
          <div className="pb-5 border-b border-slate-800">
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">{personalInfo.name || 'Your Name'}</h1>
            <p className="text-[10px] font-semibold text-indigo-400 tracking-wider mt-1 uppercase">
              {personalInfo.title || 'Professional Title'}
            </p>
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
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-slate-800 border border-slate-700/60 text-slate-200 px-1.5 py-0.5 rounded-sm"
                  >
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
              {education.map((edu) => (
                <div key={edu.id} className="text-[9.5px]">
                  <h4 className="font-bold text-white leading-tight">{edu.degree || 'Degree'}</h4>
                  <p className="text-slate-400 font-medium leading-tight mt-0.5">{edu.school || 'School'}</p>
                  <span className="text-[8.5px] text-slate-500 font-semibold">{edu.dates}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Column */}
      <div className="w-[67%] p-7 flex flex-col justify-between text-slate-800 bg-white">
        <div>
          {personalInfo.summary && (
            <div>
              <h3 className="text-[11.5px] font-bold text-indigo-650 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-2 font-medium">
                Executive Profile
              </h3>
              <p className="leading-relaxed text-slate-600 text-justify">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11.5px] font-bold text-indigo-650 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-3">
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l border-indigo-100">
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-500 -left-[3.5px] top-1"></div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[11.5px] font-bold text-slate-900">{exp.role || 'Job Role'}</h4>
                      <span className="text-[9px] font-semibold text-slate-400">{exp.dates}</span>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-650 uppercase tracking-wide mb-1">
                      {exp.company || 'Company'}
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-600">
                      {parseBullets(exp.description).map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11.5px] font-bold text-indigo-650 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-3">
                Select Projects
              </h3>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[11.5px] font-bold text-slate-900">{proj.name}</h4>
                      {proj.link && <span className="text-[9.5px] text-indigo-500">{proj.link}</span>}
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // TEMPLATE C: EMERALD EXECUTIVE
  // ==========================================
  const renderExecutive = () => (
    <div className="flex-1 flex flex-col justify-between h-full bg-stone-50/20 text-slate-900 p-9 select-none border-t-[6px] border-emerald-800">
      <div>
        {/* Center Header */}
        <div className="text-center pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
            {personalInfo.name || 'Your Full Name'}
          </h1>
          <p className="text-[10.5px] font-bold text-emerald-850 tracking-wider mt-1 uppercase font-sans">
            {personalInfo.title || 'Professional Title'}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-slate-600 mt-2.5 font-serif italic">
            <span>{personalInfo.email}</span>
            {personalInfo.phone && (
              <>
                <span>•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span>•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.website && (
              <>
                <span>•</span>
                <span className="not-italic font-sans text-emerald-800 font-semibold">{personalInfo.website}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mt-4">
            <h3 className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider border-b-2 border-emerald-800 pb-0.5 mb-2 font-sans">
              Executive Profile
            </h3>
            <p className="text-justify leading-relaxed text-slate-800 font-serif">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider border-b-2 border-emerald-800 pb-0.5 mb-3.5 font-sans">
              Professional Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[12px] font-bold text-slate-900 font-serif">{exp.role}</h4>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-sans">{exp.dates}</span>
                  </div>
                  <div className="text-[10.5px] font-semibold text-emerald-800 italic font-serif mb-1.5">
                    {exp.company}
                  </div>
                  <ul className="list-disc pl-4 space-y-1 leading-relaxed text-slate-800 font-serif">
                    {parseBullets(exp.description).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider border-b-2 border-emerald-800 pb-0.5 mb-3 font-sans">
              Key Contributions & Projects
            </h3>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[11.5px] font-bold text-slate-900 font-serif">{proj.name}</h4>
                    {proj.link && <span className="text-[9.5px] text-emerald-800 font-semibold font-sans">{proj.link}</span>}
                  </div>
                  <p className="text-slate-850 mt-1 leading-relaxed font-serif">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-emerald-850 uppercase tracking-wider border-b-2 border-emerald-800 pb-0.5 mb-2.5 font-sans">
              Academic Credentials
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="font-serif">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[11.5px] font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-[9px] text-slate-500 font-sans">{edu.dates}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 italic mt-0.5">
                    {edu.school} {edu.gpa && <span className="font-sans text-[9px] not-italic text-slate-500">(GPA: {edu.gpa})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-5 pt-3.5 border-t border-slate-200">
          <h3 className="text-[10.5px] font-bold text-slate-900 uppercase tracking-wider mb-2 font-sans">
            Technical Matrix
          </h3>
          <div className="flex flex-wrap gap-1 font-sans">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[9.5px] bg-stone-100 border border-stone-250 text-slate-800 px-2 py-0.5 rounded-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`aspect-[1/1.4] w-full max-w-[720px] bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between ${getFontClass()} ${getSpacingClass()}`}>
      {activeTemplate === 'minimal' && renderMinimal()}
      {activeTemplate === 'sidebar' && renderSidebar()}
      {activeTemplate === 'executive' && renderExecutive()}
    </div>
  );
};

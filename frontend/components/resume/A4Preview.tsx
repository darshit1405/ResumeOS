import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';

export const A4Preview: React.FC = () => {
  const {
    personalInfo, skills, experience, projects, education,
    certifications, achievements, languages,
    activeTemplate, designConfig
  } = useResumeStore();

  const primary = designConfig.primaryColor || '#4f46e5';
  const fontSize = designConfig.fontSizePt || 11;
  const margin = designConfig.marginMm || 15;
  const lineH = designConfig.lineHeight || 1.5;

  const parseBullets = (desc: string) => {
    if (!desc) return [];
    return desc.split('\n').map(b => b.replace(/^-\s*/, '').trim()).filter(Boolean);
  };

  const getFontFamily = () => {
    switch (designConfig.font) {
      case 'Outfit': return "'Outfit', sans-serif";
      case 'Playfair': return "'Playfair Display', Georgia, serif";
      default: return "'Inter', sans-serif";
    }
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: getFontFamily(),
    fontSize: `${fontSize}px`,
    lineHeight: lineH,
    padding: `${margin}mm`,
  };

  // ==========================================
  // TEMPLATE A: SLATE MINIMAL
  // ==========================================
  const renderMinimal = () => (
    <div className="flex-1 flex flex-col bg-white text-slate-800 select-none" style={baseStyle}>
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200" style={{ borderColor: primary + '33' }}>
        <h1 className="font-extrabold text-slate-900 tracking-tight uppercase" style={{ fontSize: `${fontSize * 2.5}px` }}>
          {personalInfo.name || 'Your Full Name'}
        </h1>
        <p className="font-bold tracking-wider mt-1 uppercase" style={{ fontSize: `${fontSize * 0.9}px`, color: primary }}>
          {personalInfo.title || 'Target Job Title'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 mt-2" style={{ fontSize: `${fontSize * 0.85}px`, color: '#64748b' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span style={{ color: '#cbd5e1' }}>•</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span style={{ color: '#cbd5e1' }}>•</span><span>{personalInfo.location}</span></>}
          {personalInfo.website && <><span style={{ color: '#cbd5e1' }}>•</span><span style={{ color: primary, fontWeight: 600 }}>{personalInfo.website}</span></>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Professional Summary
          </h3>
          <p className="text-justify leading-relaxed text-slate-600" style={{ lineHeight: lineH }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2.5" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Work Experience
          </h3>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 1.05}px` }}>{exp.role || 'Job Role'}</h4>
                  <span className="text-slate-500 font-semibold" style={{ fontSize: `${fontSize * 0.8}px` }}>{exp.dates || 'Date Range'}</span>
                </div>
                <div className="font-bold uppercase tracking-wide mb-1" style={{ fontSize: `${fontSize * 0.85}px`, color: primary }}>
                  {exp.company || 'Company Name'}
                </div>
                <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-600">
                  {parseBullets(exp.description).map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2.5" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Key Projects
          </h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 1.05}px` }}>
                    {proj.name || 'Project Name'}{' '}
                    {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}
                  </h4>
                  {proj.link && <span className="font-semibold" style={{ fontSize: `${fontSize * 0.8}px`, color: primary }}>{proj.link}</span>}
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="font-semibold text-slate-500 mt-0.5" style={{ fontSize: `${fontSize * 0.8}px` }}>
                    Stack: {proj.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Education
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 0.95}px` }}>{edu.degree || 'Degree'}</h4>
                  <span className="text-slate-400 font-semibold" style={{ fontSize: `${fontSize * 0.8}px` }}>{edu.dates}</span>
                </div>
                <div className="text-slate-600 font-medium mt-0.5" style={{ fontSize: `${fontSize * 0.85}px` }}>
                  {edu.school || 'University'}{edu.gpa && <span className="text-slate-400"> (GPA: {edu.gpa})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Certifications
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {certifications.map((cert, idx) => (
              <span key={idx} className="text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-sm" style={{ fontSize: `${fontSize * 0.8}px` }}>
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, borderColor: primary + '55' }}>
            Achievements
          </h3>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-600" style={{ fontSize: `${fontSize * 0.9}px` }}>
            {achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest mb-2" style={{ fontSize: `${fontSize * 0.85}px` }}>
            Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-sm font-medium" style={{ fontSize: `${fontSize * 0.8}px` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <div className="mt-3">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest mb-1.5" style={{ fontSize: `${fontSize * 0.85}px` }}>
            Languages
          </h3>
          <div className="flex flex-wrap gap-x-4 text-slate-600" style={{ fontSize: `${fontSize * 0.85}px` }}>
            {languages.map((lang, idx) => <span key={idx}>{lang}</span>)}
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // TEMPLATE B: INDIGO CREATIVE SIDEBAR
  // ==========================================
  const renderSidebar = () => (
    <div className="flex-1 flex min-h-full bg-white select-none">
      {/* Dark Sidebar */}
      <div className="w-[32%] text-white flex flex-col" style={{ backgroundColor: '#0f172a', padding: `${margin}mm ${margin * 0.8}mm` }}>
        <div>
          <div className="pb-4 border-b border-slate-700">
            <h1 className="font-bold tracking-tight text-white uppercase" style={{ fontFamily: getFontFamily(), fontSize: `${fontSize * 1.8}px` }}>
              {personalInfo.name || 'Your Name'}
            </h1>
            <p className="font-semibold tracking-wider mt-1 uppercase" style={{ fontSize: `${fontSize * 0.8}px`, color: primary }}>
              {personalInfo.title || 'Professional Title'}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest" style={{ fontSize: `${fontSize * 0.75}px` }}>Contact</h3>
            <div className="space-y-1.5 text-slate-300" style={{ fontSize: `${fontSize * 0.8}px` }}>
              {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div className="text-slate-400">{personalInfo.location}</div>}
              {personalInfo.website && <div className="truncate font-semibold" style={{ color: primary }}>{personalInfo.website}</div>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontSize: `${fontSize * 0.75}px` }}>Expertise</h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-slate-200 px-1.5 py-0.5 rounded-sm" style={{ fontSize: `${fontSize * 0.75}px`, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontSize: `${fontSize * 0.75}px` }}>Certifications</h3>
              <div className="space-y-1 text-slate-300" style={{ fontSize: `${fontSize * 0.78}px` }}>
                {certifications.map((c, i) => <div key={i}>• {c}</div>)}
              </div>
            </div>
          )}

          {languages?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontSize: `${fontSize * 0.75}px` }}>Languages</h3>
              <div className="space-y-1 text-slate-300" style={{ fontSize: `${fontSize * 0.78}px` }}>
                {languages.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>
          )}
        </div>

        {education.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-700">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontSize: `${fontSize * 0.75}px` }}>Education</h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} style={{ fontSize: `${fontSize * 0.8}px` }}>
                  <h4 className="font-bold text-white leading-tight">{edu.degree || 'Degree'}</h4>
                  <p className="text-slate-400 font-medium leading-tight mt-0.5">{edu.school || 'School'}</p>
                  <span className="text-slate-500 font-semibold" style={{ fontSize: `${fontSize * 0.72}px` }}>{edu.dates}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[68%] text-slate-800 flex flex-col" style={{ padding: `${margin}mm ${margin * 0.9}mm` }}>
        {personalInfo.summary && (
          <div>
            <h3 className="font-bold uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary + '33' }}>
              Executive Profile
            </h3>
            <p className="leading-relaxed text-slate-600 text-justify" style={{ lineHeight: lineH }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="mt-5">
            <h3 className="font-bold uppercase tracking-widest border-b pb-0.5 mb-3" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary + '33' }}>
              Experience
            </h3>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3" style={{ borderLeft: `2px solid ${primary}33` }}>
                  <div className="absolute w-1.5 h-1.5 rounded-full -left-[3.5px] top-1" style={{ backgroundColor: primary }}></div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 1.0}px` }}>{exp.role || 'Job Role'}</h4>
                    <span className="text-slate-400 font-semibold" style={{ fontSize: `${fontSize * 0.78}px` }}>{exp.dates}</span>
                  </div>
                  <div className="font-bold uppercase tracking-wide mb-1" style={{ fontSize: `${fontSize * 0.82}px`, color: primary }}>
                    {exp.company || 'Company'}
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-600" style={{ fontSize: `${fontSize * 0.9}px` }}>
                    {parseBullets(exp.description).map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-5">
            <h3 className="font-bold uppercase tracking-widest border-b pb-0.5 mb-3" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary + '33' }}>
              Projects
            </h3>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 1.0}px` }}>{proj.name}</h4>
                    {proj.link && <span className="font-semibold" style={{ fontSize: `${fontSize * 0.78}px`, color: primary }}>{proj.link}</span>}
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{proj.description}</p>
                  {proj.technologies?.length > 0 && (
                    <div className="text-slate-500 mt-0.5 font-semibold" style={{ fontSize: `${fontSize * 0.78}px` }}>
                      {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements?.length > 0 && (
          <div className="mt-5">
            <h3 className="font-bold uppercase tracking-widest border-b pb-0.5 mb-2" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary + '33' }}>
              Achievements
            </h3>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600" style={{ fontSize: `${fontSize * 0.9}px` }}>
              {achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // TEMPLATE C: EMERALD EXECUTIVE
  // ==========================================
  const renderExecutive = () => (
    <div className="flex-1 flex flex-col bg-stone-50 text-slate-900 select-none" style={{ ...baseStyle, borderTop: `6px solid ${primary}` }}>
      {/* Center Header */}
      <div className="text-center pb-4">
        <h1 className="font-bold tracking-tight text-slate-900 font-serif" style={{ fontSize: `${fontSize * 2.4}px` }}>
          {personalInfo.name || 'Your Full Name'}
        </h1>
        <p className="font-bold tracking-wider mt-1 uppercase font-sans" style={{ fontSize: `${fontSize * 0.9}px`, color: primary }}>
          {personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-0.5 mt-2 text-slate-600 font-serif italic" style={{ fontSize: `${fontSize * 0.85}px` }}>
          <span>{personalInfo.email}</span>
          {personalInfo.phone && <><span>•</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>•</span><span>{personalInfo.location}</span></>}
          {personalInfo.website && <><span>•</span><span className="not-italic font-sans font-semibold" style={{ color: primary }}>{personalInfo.website}</span></>}
        </div>
        <div className="mt-3 border-t border-b py-1.5" style={{ borderColor: primary + '44' }}>
          {/* Decorative rule */}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mt-3">
          <h3 className="font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-2 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary }}>
            Executive Profile
          </h3>
          <p className="text-justify leading-relaxed text-slate-800 font-serif" style={{ lineHeight: lineH }}>
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-3 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary }}>
            Professional Experience
          </h3>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-900 font-serif" style={{ fontSize: `${fontSize * 1.05}px` }}>{exp.role}</h4>
                  <span className="font-bold text-slate-500 uppercase tracking-wider font-sans" style={{ fontSize: `${fontSize * 0.78}px` }}>{exp.dates}</span>
                </div>
                <div className="font-semibold italic font-serif mb-1" style={{ fontSize: `${fontSize * 0.88}px`, color: primary }}>
                  {exp.company}
                </div>
                <ul className="list-disc pl-4 space-y-0.5 leading-relaxed text-slate-800 font-serif" style={{ fontSize: `${fontSize * 0.9}px` }}>
                  {parseBullets(exp.description).map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-2.5 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary }}>
            Key Projects
          </h3>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 font-serif" style={{ fontSize: `${fontSize * 1.0}px` }}>{proj.name}</h4>
                  {proj.link && <span className="font-semibold font-sans" style={{ fontSize: `${fontSize * 0.78}px`, color: primary }}>{proj.link}</span>}
                </div>
                <p className="text-slate-800 mt-0.5 leading-relaxed font-serif">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <div className="font-sans font-semibold text-slate-500 mt-0.5" style={{ fontSize: `${fontSize * 0.8}px` }}>
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-2 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary }}>
            Academic Credentials
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="font-serif">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900" style={{ fontSize: `${fontSize * 0.95}px` }}>{edu.degree}</h4>
                  <span className="text-slate-500 font-sans" style={{ fontSize: `${fontSize * 0.78}px` }}>{edu.dates}</span>
                </div>
                <div className="text-slate-700 italic mt-0.5" style={{ fontSize: `${fontSize * 0.85}px` }}>
                  {edu.school}{edu.gpa && <span className="font-sans not-italic text-slate-500" style={{ fontSize: `${fontSize * 0.78}px` }}> (GPA: {edu.gpa})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-2 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary, borderColor: primary }}>
            Certifications
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {certifications.map((cert, idx) => (
              <span key={idx} className="font-sans text-slate-700 px-2 py-0.5 rounded-sm border" style={{ fontSize: `${fontSize * 0.8}px`, borderColor: primary + '44', backgroundColor: primary + '0a' }}>
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-1.5 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary }}>
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="font-sans text-slate-800 px-1.5 py-0.5 rounded-sm" style={{ fontSize: `${fontSize * 0.78}px`, backgroundColor: '#f5f5f4', border: '1px solid #d6d3d1' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements + Languages */}
        <div className="space-y-3">
          {achievements?.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider mb-1 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary }}>
                Achievements
              </h3>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700 font-serif" style={{ fontSize: `${fontSize * 0.82}px` }}>
                {achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
              </ul>
            </div>
          )}
          {languages?.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider mb-1 font-sans" style={{ fontSize: `${fontSize * 0.85}px`, color: primary }}>
                Languages
              </h3>
              <div className="text-slate-600 font-sans" style={{ fontSize: `${fontSize * 0.82}px` }}>
                {languages.join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="aspect-[1/1.414] w-full max-w-[720px] bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col">
      {activeTemplate === 'minimal' && renderMinimal()}
      {activeTemplate === 'sidebar' && renderSidebar()}
      {activeTemplate === 'executive' && renderExecutive()}
    </div>
  );
};

import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { 
  User, Briefcase, FolderGit, GraduationCap, Award, Settings, 
  Plus, Trash2, Check, Sparkles, Globe, Loader2 
} from 'lucide-react';

export const EditorPanel: React.FC = () => {
  const {
    personalInfo,
    skills,
    experience,
    projects,
    education,
    certifications,
    achievements,
    languages,
    activeTab,
    designConfig,
    activeTemplate,
    updatePersonalInfo,
    addSkill,
    removeSkill,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addEducation,
    updateEducation,
    removeEducation,
    addCertification,
    removeCertification,
    addAchievement,
    removeAchievement,
    addLanguage,
    removeLanguage,
    updateDesign,
    setTab,
    setTemplate,
    correctGrammar,
    translateResume,
  } = useResumeStore();

  const [newSkillText, setNewSkillText] = useState('');
  const [newCertText, setNewCertText] = useState('');
  const [newAchText, setNewAchText] = useState('');
  const [newLangText, setNewLangText] = useState('');
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [correctingExpId, setCorrectingExpId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillText.trim()) {
      addSkill(newSkillText.trim());
      setNewSkillText('');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'experience', label: 'Work', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'styling', label: 'Design', icon: Settings },
    { id: 'more', label: 'More', icon: Plus },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm select-none">
      {/* Scrollable Tab bar */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto shrink-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition shrink-0 ${
                isActive
                  ? 'border-indigo-650 text-indigo-650 bg-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB: GENERAL INFO */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              Personal Information
            </h3>
            <div className="space-y-3.5 text-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Title</label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Portfolio / Link</label>
                  <input
                    type="text"
                    value={personalInfo.website}
                    onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="github.com/johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Professional Summary</label>
                <textarea
                  rows={4}
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Detail your core highlights and industry experience..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                Work Experience
              </h3>
              <button
                onClick={addExperience}
                className="px-2 py-1 rounded bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add Role
              </button>
            </div>

            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="border border-slate-150 rounded-xl p-4 relative space-y-3 shadow-sm">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-3 right-3 text-slate-450 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-slate-700 space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dates</label>
                      <input
                        type="text"
                        value={exp.dates}
                        onChange={(e) => updateExperience(exp.id, { dates: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 2022 - Present"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Responsibilities (Start each with a -)
                        </label>
                        <button
                          type="button"
                          disabled={correctingExpId === exp.id || !exp.description.trim()}
                          onClick={async () => {
                            setCorrectingExpId(exp.id);
                            try {
                              const corrected = await correctGrammar(exp.description);
                              updateExperience(exp.id, { description: corrected });
                            } catch (err) {
                              console.error('Failed to correct experience description', err);
                            } finally {
                              setCorrectingExpId(null);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-650 hover:text-indigo-800 disabled:opacity-50 transition"
                        >
                          {correctingExpId === exp.id ? (
                            <>
                              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Improving...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> AI Improve Bullets
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="- Spearheaded building features..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                Key Projects
              </h3>
              <button
                onClick={addProject}
                className="px-2 py-1 rounded bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border border-slate-150 rounded-xl p-4 relative space-y-3 shadow-sm">
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-450 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-slate-700 space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Role</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          value={proj.technologies.join(', ')}
                          onChange={(e) =>
                            updateProject(proj.id, {
                              technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                Education
              </h3>
              <button
                onClick={addEducation}
                className="px-2 py-1 rounded bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Inst.
              </button>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border border-slate-150 rounded-xl p-4 relative space-y-3 shadow-sm">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-3 right-3 text-slate-450 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-slate-700 space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">School Name</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dates</label>
                        <input
                          type="text"
                          value={edu.dates}
                          onChange={(e) => updateEducation(edu.id, { dates: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. 2017 - 2021"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">GPA</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. 3.8/4.0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
              Technical Matrix
            </h3>
            
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                placeholder="e.g. React.js, Docker, Python"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                Add Tag
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  onClick={() => removeSkill(idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200/60 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-600 rounded-md text-[11px] font-medium transition cursor-pointer select-none"
                >
                  {skill}
                  <span className="text-[9px] text-slate-400 font-bold">×</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STYLING & DESIGN */}
        {activeTab === 'styling' && (
          <div className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                Design & Typography
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Font Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Inter', 'Outfit', 'Playfair'] as const).map((font) => (
                    <button
                      key={font}
                      onClick={() => updateDesign({ font })}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold text-center transition ${
                        designConfig.font === font
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {font === 'Playfair' ? 'Serif Classic' : font}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Font Spacing</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => updateDesign({ spacing })}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold text-center capitalize transition ${
                        designConfig.spacing === spacing
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accent Theme Color</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { hex: '#4f46e5', name: 'Indigo' },
                    { hex: '#059669', name: 'Emerald' },
                    { hex: '#7c3aed', name: 'Violet' },
                    { hex: '#db2777', name: 'Pink' },
                    { hex: '#e11d48', name: 'Rose' },
                    { hex: '#0f172a', name: 'Slate' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => updateDesign({ primaryColor: color.hex })}
                      className={`w-6 h-6 rounded-full border transition flex items-center justify-center relative ${
                        designConfig.primaryColor === color.hex
                          ? 'border-slate-900 ring-2 ring-indigo-200 scale-110'
                          : 'border-slate-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {designConfig.primaryColor === color.hex && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50/50">
                    <input
                      type="color"
                      value={designConfig.primaryColor || '#4f46e5'}
                      onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                      className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{designConfig.primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Typography Sliders */}
              <div className="grid grid-cols-1 gap-3.5 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Font Size</label>
                    <span className="text-[10px] font-bold text-indigo-650">{designConfig.fontSizePt || 11}pt</span>
                  </div>
                  <input
                    type="range"
                    min="9"
                    max="14"
                    step="0.5"
                    value={designConfig.fontSizePt || 11}
                    onChange={(e) => updateDesign({ fontSizePt: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Margin</label>
                    <span className="text-[10px] font-bold text-indigo-650">{designConfig.marginMm || 15}mm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={designConfig.marginMm || 15}
                    onChange={(e) => updateDesign({ marginMm: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Height</label>
                    <span className="text-[10px] font-bold text-indigo-650">{designConfig.lineHeight || 1.5}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.1"
                    value={designConfig.lineHeight || 1.5}
                    onChange={(e) => updateDesign({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pb-1 flex items-center gap-1.5">
                Layout Template
              </h3>
              
              <div className="space-y-2.5">
                {/* Minimal */}
                <div
                  onClick={() => setTemplate('minimal')}
                  className={`border p-3.5 rounded-xl cursor-pointer transition flex items-center gap-3.5 ${
                    activeTemplate === 'minimal'
                      ? 'border-indigo-650 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-600">MIN</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      Slate Minimal {activeTemplate === 'minimal' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Classic clean centered header with thin elegant dividers.</p>
                  </div>
                </div>

                {/* Sidebar */}
                <div
                  onClick={() => setTemplate('sidebar')}
                  className={`border p-3.5 rounded-xl cursor-pointer transition flex items-center gap-3.5 ${
                    activeTemplate === 'sidebar'
                      ? 'border-indigo-650 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-600">SIDE</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      Indigo Creative {activeTemplate === 'sidebar' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Modern asymmetrical structure with full dark left sidebar details.</p>
                  </div>
                </div>

                {/* Executive */}
                <div
                  onClick={() => setTemplate('executive')}
                  className={`border p-3.5 rounded-xl cursor-pointer transition flex items-center gap-3.5 ${
                    activeTemplate === 'executive'
                      ? 'border-indigo-650 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-600">EXEC</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      Emerald Executive {activeTemplate === 'executive' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Warm paper format, custom serif typography, emerald borders.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MORE SECTIONS & TRANSLATION */}
        {activeTab === 'more' && (
          <div className="space-y-6">
            {/* Certifications Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                Certifications
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newCertText.trim()) {
                    addCertification(newCertText.trim());
                    setNewCertText('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newCertText}
                  onChange={(e) => setNewCertText(e.target.value)}
                  placeholder="e.g. AWS Certified Developer"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                {certifications?.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200/60 rounded-md text-[11px] font-medium text-slate-700"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(idx)}
                      className="text-slate-400 hover:text-red-500 font-bold ml-0.5 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(!certifications || certifications.length === 0) && (
                  <p className="text-[10px] text-slate-450 italic py-1">No certifications added yet.</p>
                )}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                Achievements
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newAchText.trim()) {
                    addAchievement(newAchText.trim());
                    setNewAchText('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newAchText}
                  onChange={(e) => setNewAchText(e.target.value)}
                  placeholder="e.g. Won 1st place in regional Hackathon"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                >
                  Add
                </button>
              </form>
              <div className="space-y-1.5">
                {achievements?.map((ach, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                  >
                    <span className="text-slate-700 flex-1 leading-normal">{ach}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(idx)}
                      className="text-slate-400 hover:text-red-500 font-medium px-1 focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(!achievements || achievements.length === 0) && (
                  <p className="text-[10px] text-slate-450 italic">No achievements added yet.</p>
                )}
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                Languages
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newLangText.trim()) {
                    addLanguage(newLangText.trim());
                    setNewLangText('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newLangText}
                  onChange={(e) => setNewLangText(e.target.value)}
                  placeholder="e.g. English (Native), Spanish (Fluent)"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5">
                {languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200/60 rounded-md text-[11px] font-medium text-slate-700"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="text-slate-400 hover:text-red-500 font-bold ml-0.5 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(!languages || languages.length === 0) && (
                  <p className="text-[10px] text-slate-450 italic py-1">No languages added yet.</p>
                )}
              </div>
            </div>

            {/* AI Translation Section */}
            <div className="space-y-3 border-t border-slate-100 pt-4 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" /> AI Translate Resume
              </h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Translate all content in your resume into a target language instantly. The AI will preserve all formatting and layouts.
              </p>
              <div className="flex gap-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-500"
                >
                  {['Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian', 'English', 'Arabic', 'Hindi'].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={isTranslating}
                  onClick={async () => {
                    setIsTranslating(true);
                    try {
                      await translateResume(selectedLang);
                    } catch (err) {
                      console.error('Translation error', err);
                    } finally {
                      setIsTranslating(false);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Translating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-indigo-200" /> Translate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

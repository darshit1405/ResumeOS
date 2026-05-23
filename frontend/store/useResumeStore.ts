import { create } from 'zustand';

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  dates: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  link: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  dates: string;
  gpa: string;
}

export interface DesignConfig {
  font: 'Inter' | 'Outfit' | 'Playfair';
  primaryColor: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
  layoutOrder: string[];
  fontSizePt?: number;
  marginMm?: number;
  lineHeight?: number;
}

export interface AtsAnalysis {
  score: number;
  breakdown: {
    formatting: number;
    completeness: number;
    actionVerbs: number;
    skillsMatch: number;
    jobRelevance: number;
  };
  suggestions: {
    critical: string[];
    skills: string[];
    bullets: string[];
  };
}

export interface ResumeListItem {
  id: string;
  title: string;
  updatedAt: string;
  atsScore: number;
  isPublished: boolean;
  slug: string | null;
}

export interface CoverLetterItem {
  id: string;
  title: string;
  company: string;
  role: string;
  content: string;
  updatedAt: string;
}

export interface ResumeState {
  // Current active resume state
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: string[];
  achievements: string[];
  languages: string[];
  designConfig: DesignConfig;
  isPublished: boolean;
  slug: string | null;
  
  // App metadata & active flags
  activeTab: 'general' | 'experience' | 'projects' | 'education' | 'skills' | 'styling' | 'more';
  activeTemplate: 'minimal' | 'sidebar' | 'executive';
  
  // List of user's resumes
  resumesList: ResumeListItem[];
  isLoadingList: boolean;
  
  // Job specific optimization
  jobDescription: string;
  companyName: string;
  targetRole: string;
  
  // ATS Scanning details
  atsAnalysis: AtsAnalysis;
  isScanning: boolean;

  // Cover Letter details
  coverLetters: CoverLetterItem[];
  activeCoverLetter: CoverLetterItem | null;
  isGeneratingLetter: boolean;

  // Interview & Suggestion details
  interviewQuestions: any[];
  companySuggestions: any[];
  isGeneratingQuestions: boolean;
  isGeneratingSuggestions: boolean;

  // Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (idx: number) => void;
  addExperience: () => void;
  updateExperience: (id: string, updated: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updated: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Certifications, Achievements & Languages actions
  addCertification: (cert: string) => void;
  removeCertification: (idx: number) => void;
  addAchievement: (ach: string) => void;
  removeAchievement: (idx: number) => void;
  addLanguage: (lang: string) => void;
  removeLanguage: (idx: number) => void;

  updateDesign: (design: Partial<DesignConfig>) => void;
  setTab: (tab: ResumeState['activeTab']) => void;
  setTemplate: (template: ResumeState['activeTemplate']) => void;
  setJobDescription: (desc: string) => void;
  setCompanyDetails: (company: string, role: string) => void;
  
  // Backend interactions
  loadAllResumes: () => Promise<void>;
  selectResume: (id: string) => Promise<void>;
  createNewResume: (title?: string) => Promise<void>;
  duplicateResume: (id: string, title?: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  publishResume: (id: string, slug: string) => Promise<void>;
  saveResumeToServer: () => Promise<void>;
  
  // Cover Letter actions
  loadCoverLetters: () => Promise<void>;
  generateCoverLetter: (jd: string, company: string, role: string) => Promise<void>;
  saveCoverLetter: (title: string, company: string, role: string, content: string) => Promise<void>;
  deleteCoverLetter: (id: string) => Promise<void>;

  // OCR Upload Action
  uploadResumeOcr: (file: File) => Promise<void>;

  // New AI actions
  generateInterviewQuestions: (role?: string) => Promise<void>;
  suggestCompanies: () => Promise<void>;
  generateFromTemplate: (role: string, expLevel: string, lang?: string) => Promise<void>;
  correctGrammar: (text: string) => Promise<string>;
  translateResume: (lang: string) => Promise<void>;
  optimizeResume: (jd: string, company: string, role: string) => Promise<void>;

  // Real-time ATS computation trigger
  triggerAtsScan: () => Promise<void>;
  loadDemoData: () => void;
  resetData: () => void;
}

const defaultPersonalInfo: PersonalInfo = {
  name: 'Alex Mercer',
  title: 'Full Stack Engineer',
  email: 'alex.mercer@dev.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  website: 'github.com/alexmercer',
  summary: 'Detail-oriented and impact-driven engineer with 3+ years of experience designing, building, and optimizing responsive full-stack applications. Proven record of improving system latency and architecting scalable backend APIs.',
};

const defaultDesign: DesignConfig = {
  font: 'Inter',
  primaryColor: '#4f46e5',
  spacing: 'comfortable',
  layoutOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'achievements', 'languages'],
  fontSizePt: 11,
  marginMm: 15,
  lineHeight: 1.5,
};

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') : 'http://localhost:5000';
const DEFAULT_USER_ID = 'demo-user-123';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-user-id': DEFAULT_USER_ID,
});

let saveTimeout: NodeJS.Timeout | null = null;

const debouncedSave = (get: () => ResumeState) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    get().saveResumeToServer();
  }, 1000); // 1 second debounce
};

export const useResumeStore = create<ResumeState>((set, get) => ({
  id: 'resume-1',
  title: 'Default Resume',
  personalInfo: defaultPersonalInfo,
  skills: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'REST APIs'],
  experience: [
    {
      id: 'exp-1',
      company: 'TechNovation Labs',
      role: 'Software Engineer II',
      dates: '2023 - Present',
      description: '- Spearheaded the migration of core dashboard applications to Next.js, reducing average page load times by 35%.\n- Coordinated development of real-time collaboration engines using WebSockets and Redis.\n- Mentored 3 junior developers and established code styling standards.',
    },
    {
      id: 'exp-2',
      company: 'Sync Systems',
      role: 'Associate Developer',
      dates: '2021 - 2023',
      description: '- Programmed clean internal API endpoints using Node.js and Express, serving over 10,000 active daily users.\n- Formulated regression test strategies, achieving 88% overall code coverage.',
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'ResumeOS Platform',
      role: 'Lead Architect',
      description: 'Built a lightweight client-side application that serves structured resumes and evaluates ATS readiness indicators.',
      technologies: ['Next.js', 'Zustand', 'Tailwind CSS'],
      link: 'github.com/alexmercer/resume-os',
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      dates: '2017 - 2021',
      gpa: '3.8/4.0',
    }
  ],
  certifications: [],
  achievements: [],
  languages: [],
  designConfig: defaultDesign,
  isPublished: false,
  slug: null,
  activeTab: 'general',
  activeTemplate: 'minimal',
  resumesList: [],
  isLoadingList: false,
  jobDescription: '',
  companyName: '',
  targetRole: '',
  coverLetters: [],
  activeCoverLetter: null,
  isGeneratingLetter: false,
  interviewQuestions: [],
  companySuggestions: [],
  isGeneratingQuestions: false,
  isGeneratingSuggestions: false,
  atsAnalysis: {
    score: 82,
    breakdown: {
      formatting: 95,
      completeness: 90,
      actionVerbs: 85,
      skillsMatch: 75,
      jobRelevance: 70
    },
    suggestions: {
      critical: ['Add more metrics in TechNovation Labs experiences (e.g. exact dollars saved or percentage metrics).'],
      skills: ['AWS S3', 'Redis Cache', 'Jest testing'],
      bullets: ['Ensure experiences highlight the outcome, e.g. "achieving 88% code coverage" is great, apply similar logic to migration bullets.']
    }
  },
  isScanning: false,

  updatePersonalInfo: (info) => {
    set((state) => ({ personalInfo: { ...state.personalInfo, ...info } }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addSkill: (skill) => {
    if (!skill || get().skills.includes(skill)) return;
    set((state) => ({ skills: [...state.skills, skill] }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeSkill: (idx) => {
    set((state) => ({ skills: state.skills.filter((_, i) => i !== idx) }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addExperience: () => {
    set((state) => ({
      experience: [
        ...state.experience,
        {
          id: `exp-${Date.now()}`,
          company: '',
          role: '',
          dates: '',
          description: '',
        }
      ]
    }));
    debouncedSave(get);
  },

  updateExperience: (id, updated) => {
    set((state) => ({
      experience: state.experience.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp))
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeExperience: (id) => {
    set((state) => ({
      experience: state.experience.filter((exp) => exp.id !== id),
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addProject: () => {
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: `proj-${Date.now()}`,
          name: '',
          description: '',
          role: '',
          technologies: [],
          link: '',
        }
      ]
    }));
    debouncedSave(get);
  },

  updateProject: (id, updated) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addEducation: () => {
    set((state) => ({
      education: [
        ...state.education,
        {
          id: `edu-${Date.now()}`,
          school: '',
          degree: '',
          dates: '',
          gpa: '',
        }
      ]
    }));
    debouncedSave(get);
  },

  updateEducation: (id, updated) => {
    set((state) => ({
      education: state.education.map((e) => (e.id === id ? { ...e, ...updated } : e))
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeEducation: (id) => {
    set((state) => ({
      education: state.education.filter((e) => e.id !== id),
    }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  updateDesign: (design) => {
    set((state) => ({
      designConfig: { ...state.designConfig, ...design },
    }));
    debouncedSave(get);
  },

  setTab: (tab) => set({ activeTab: tab }),
  
  setTemplate: (template) => set({ activeTemplate: template }),

  setJobDescription: (desc) => set({ jobDescription: desc }),

  setCompanyDetails: (company, role) => set({ companyName: company, targetRole: role }),

  // --- Backend Sync actions ---
  loadAllResumes: async () => {
    set({ isLoadingList: true });
    try {
      const res = await fetch(`${API_BASE}/resumes`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const list = await res.json();
        set({ resumesList: list });
      }
    } catch (err) {
      console.error('Failed to load resumes list from server', err);
    } finally {
      set({ isLoadingList: false });
    }
  },

  selectResume: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const resume = await res.json();
        set({
          id: resume.id,
          title: resume.title,
          personalInfo: resume.personalInfo as PersonalInfo,
          skills: resume.skills as string[],
          experience: resume.experience as Experience[],
          projects: resume.projects as Project[],
          education: resume.education as Education[],
          certifications: (resume.certifications || []) as string[],
          achievements: (resume.achievements || []) as string[],
          languages: (resume.languages || []) as string[],
          designConfig: { ...defaultDesign, ...(resume.designConfig as DesignConfig) },
          isPublished: resume.isPublished,
          slug: resume.slug,
          atsAnalysis: resume.atsAnalysis ? (resume.atsAnalysis as AtsAnalysis) : get().atsAnalysis,
        });
      }
    } catch (err) {
      console.error('Failed to fetch resume details', err);
    }
  },

  createNewResume: async (title) => {
    try {
      const res = await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title: title || 'Untitled Resume' }),
      });
      if (res.ok) {
        const newRes = await res.json();
        await get().loadAllResumes();
        await get().selectResume(newRes.id);
      }
    } catch (err) {
      console.error('Failed to create new resume', err);
    }
  },

  duplicateResume: async (id, title) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const dup = await res.json();
        await get().loadAllResumes();
        await get().selectResume(dup.id);
      }
    } catch (err) {
      console.error('Failed to duplicate resume', err);
    }
  },

  deleteResume: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await get().loadAllResumes();
        // Switch to another resume if list is not empty
        const list = get().resumesList;
        if (list.length > 0) {
          await get().selectResume(list[0].id);
        } else {
          get().resetData();
        }
      }
    } catch (err) {
      console.error('Failed to delete resume', err);
    }
  },

  publishResume: async (id, slug) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/${id}/publish`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        set({ isPublished: true, slug });
        await get().loadAllResumes();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Slug collision');
      }
    } catch (err) {
      console.error('Failed to publish resume', err);
      throw err;
    }
  },

  saveResumeToServer: async () => {
    const { id, title, personalInfo, skills, experience, projects, education, certifications, achievements, languages, designConfig, atsAnalysis } = get();
    // Don't save default fallback ID to server unless created
    if (id === 'resume-1') return;
    try {
      await fetch(`${API_BASE}/resumes/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          personalInfo,
          skills,
          experience,
          projects,
          education,
          certifications,
          achievements,
          languages,
          designConfig,
          atsScore: atsAnalysis.score,
          atsAnalysis,
        }),
      });
    } catch (err) {
      console.error('Autosave to server failed', err);
    }
  },

  // --- Cover Letter Actions ---
  loadCoverLetters: async () => {
    try {
      const res = await fetch(`${API_BASE}/cover-letters`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const letters = await res.json();
        set({ coverLetters: letters });
      }
    } catch (err) {
      console.error('Failed to fetch cover letters', err);
    }
  },

  generateCoverLetter: async (jd, company, role) => {
    set({ isGeneratingLetter: true });
    const { personalInfo, skills, experience, projects, education } = get();
    const resumeData = { personalInfo, skills, experience, projects, education };
    try {
      const res = await fetch(`${API_BASE}/cover-letters/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData,
          jobDescription: jd,
          company,
          role,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Create an active local cover letter object
        set({
          activeCoverLetter: {
            id: 'temp-letter',
            title: `Letter for ${company}`,
            company,
            role,
            content: data.content,
            updatedAt: new Date().toISOString(),
          }
        });
      }
    } catch (err) {
      console.error('Failed to generate cover letter', err);
    } finally {
      set({ isGeneratingLetter: false });
    }
  },

  saveCoverLetter: async (title, company, role, content) => {
    try {
      const res = await fetch(`${API_BASE}/cover-letters`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, company, role, content }),
      });
      if (res.ok) {
        const newLetter = await res.json();
        await get().loadCoverLetters();
        set({ activeCoverLetter: newLetter });
      }
    } catch (err) {
      console.error('Failed to save cover letter', err);
    }
  },

  deleteCoverLetter: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cover-letters/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await get().loadCoverLetters();
        set({ activeCoverLetter: null });
      }
    } catch (err) {
      console.error('Failed to delete cover letter', err);
    }
  },

  // --- OCR Resume Upload Action ---
  uploadResumeOcr: async (file) => {
    set({ isScanning: true });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/clone/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const parsed = await res.json();
        set({
          personalInfo: parsed.personalInfo || defaultPersonalInfo,
          skills: parsed.skills || [],
          experience: parsed.experience || [],
          projects: parsed.projects || [],
          education: parsed.education || [],
          designConfig: defaultDesign,
        });
        debouncedSave(get);
        setTimeout(() => get().triggerAtsScan(), 200);
      } else {
        const data = await res.json();
        alert(`OCR Parsing error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('OCR Resume upload failed', err);
      alert('OCR Resume upload failed. Please ensure the backend is running.');
    } finally {
      set({ isScanning: false });
    }
  },

  // --- Real-time ATS computation trigger ---
  triggerAtsScan: async () => {
    const { personalInfo, skills, experience, projects, education, certifications, achievements, languages, jobDescription } = get();
    set({ isScanning: true });
    
    try {
      const res = await fetch(`${API_BASE}/ai-engine/ats-score`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData: { personalInfo, skills, experience, projects, education, certifications, achievements, languages },
          jobDescription,
        }),
      });

      if (res.ok) {
        const analysis = await res.json();
        set({ atsAnalysis: analysis });
      }
    } catch (err) {
      console.error('ATS scan server call failed. Falling back to programmatic calculations.', err);
      // Programmatic fallback
      let formatting = 100;
      if (!personalInfo.name) formatting -= 10;
      if (!personalInfo.email || !personalInfo.email.includes('@')) formatting -= 20;
      if (!personalInfo.phone || personalInfo.phone.length < 7) formatting -= 20;
      if (!personalInfo.location) formatting -= 15;
      if (!personalInfo.website) formatting -= 5;

      let completeness = 100;
      if (!personalInfo.summary) completeness -= 15;
      if (experience.length === 0) completeness -= 25;
      if (projects.length === 0) completeness -= 20;
      if (education.length === 0) completeness -= 20;
      if (skills.length === 0) completeness -= 20;

      let actionVerbs = 70;
      const combinedDescriptions = experience.map(e => e.description.toLowerCase()).join(' ');
      const verbs = ['spearheaded', 'migration', 'mentored', 'developed', 'achieved', 'optimized', 'programmed', 'formulated'];
      let matchCount = 0;
      verbs.forEach(v => {
        if (combinedDescriptions.includes(v)) matchCount++;
      });
      actionVerbs = Math.min(60 + (matchCount * 8), 100);

      let skillsMatch = 75;
      let jobRelevance = 70;
      let missingSkills: string[] = [];
      let critical: string[] = [];

      if (jobDescription) {
        const jdLower = jobDescription.toLowerCase();
        const techSkills = ['docker', 'kubernetes', 'aws', 'graphql', 'jest', 'ci/cd', 'python'];
        techSkills.forEach(skill => {
          if (jdLower.includes(skill) && !skills.map(s => s.toLowerCase()).includes(skill)) {
            missingSkills.push(skill);
            critical.push(`Optimize keyword density: incorporate the target framework '${skill.toUpperCase()}' naturally.`);
          }
        });
        skillsMatch = Math.max(50, 100 - (missingSkills.length * 8));
        jobRelevance = Math.max(55, 90 - (missingSkills.length * 6));
      }

      const overall = Math.round(
        formatting * 0.15 +
        completeness * 0.15 +
        actionVerbs * 0.10 +
        skillsMatch * 0.35 +
        jobRelevance * 0.25
      );

      if (formatting < 90) critical.push('Review formatting: complete phone, location, and valid email attributes.');
      if (actionVerbs < 75) critical.push('Boost action verb frequency: begin job descriptions with execution-focused active words.');

      set({
        atsAnalysis: {
          score: overall,
          breakdown: { formatting, completeness, actionVerbs, skillsMatch, jobRelevance },
          suggestions: {
            critical,
            skills: missingSkills.length > 0 ? missingSkills : ['Testing APIs', 'Continuous Delivery'],
            bullets: ['Aim to express impact: e.g. "Spearheaded Next.js adoption, achieving a 35% performance enhancement."']
          }
        }
      });
    } finally {
      set({ isScanning: false });
    }
  },

  addCertification: (cert) => {
    if (!cert || get().certifications.includes(cert)) return;
    set((state) => ({ certifications: [...state.certifications, cert] }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeCertification: (idx) => {
    set((state) => ({ certifications: state.certifications.filter((_, i) => i !== idx) }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addAchievement: (ach) => {
    if (!ach || get().achievements.includes(ach)) return;
    set((state) => ({ achievements: [...state.achievements, ach] }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeAchievement: (idx) => {
    set((state) => ({ achievements: state.achievements.filter((_, i) => i !== idx) }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  addLanguage: (lang) => {
    if (!lang || get().languages.includes(lang)) return;
    set((state) => ({ languages: [...state.languages, lang] }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  removeLanguage: (idx) => {
    set((state) => ({ languages: state.languages.filter((_, i) => i !== idx) }));
    debouncedSave(get);
    setTimeout(() => get().triggerAtsScan(), 200);
  },

  generateInterviewQuestions: async (role) => {
    set({ isGeneratingQuestions: true });
    const { personalInfo, skills, experience, projects, education, certifications, achievements, languages } = get();
    try {
      const res = await fetch(`${API_BASE}/ai-engine/interview-questions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData: { personalInfo, skills, experience, projects, education, certifications, achievements, languages },
          role: role || personalInfo.title,
        }),
      });
      if (res.ok) {
        const questions = await res.json();
        set({ interviewQuestions: questions });
      }
    } catch (err) {
      console.error('Failed to generate interview questions', err);
    } finally {
      set({ isGeneratingQuestions: false });
    }
  },

  suggestCompanies: async () => {
    set({ isGeneratingSuggestions: true });
    const { personalInfo, skills, experience, projects, education, certifications, achievements, languages } = get();
    try {
      const res = await fetch(`${API_BASE}/ai-engine/suggest-companies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData: { personalInfo, skills, experience, projects, education, certifications, achievements, languages },
        }),
      });
      if (res.ok) {
        const suggestions = await res.json();
        set({ companySuggestions: suggestions });
      }
    } catch (err) {
      console.error('Failed to suggest companies', err);
    } finally {
      set({ isGeneratingSuggestions: false });
    }
  },

  generateFromTemplate: async (role, expLevel, lang) => {
    set({ isScanning: true });
    try {
      const res = await fetch(`${API_BASE}/ai-engine/generate-template`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ role, experienceLevel: expLevel, language: lang }),
      });
      if (res.ok) {
        const template = await res.json();
        set({
          title: template.title || `${role} - ${expLevel}`,
          personalInfo: template.personalInfo || {
            name: 'Template Name',
            title: role,
            email: '',
            phone: '',
            location: '',
            website: '',
            summary: ''
          },
          skills: template.skills || [],
          experience: template.experience || [],
          projects: template.projects || [],
          education: template.education || [],
          certifications: template.certifications || [],
          achievements: template.achievements || [],
          languages: template.languages || [],
        });
        debouncedSave(get);
        setTimeout(() => get().triggerAtsScan(), 200);
      }
    } catch (err) {
      console.error('Failed to generate template', err);
    } finally {
      set({ isScanning: false });
    }
  },

  correctGrammar: async (text) => {
    try {
      const res = await fetch(`${API_BASE}/ai-engine/grammar-correct`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.corrected;
      }
    } catch (err) {
      console.error('Failed to correct grammar', err);
    }
    return text;
  },

  translateResume: async (lang) => {
    set({ isScanning: true });
    const { personalInfo, skills, experience, projects, education, certifications, achievements, languages } = get();
    try {
      const res = await fetch(`${API_BASE}/ai-engine/translate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData: { personalInfo, skills, experience, projects, education, certifications, achievements, languages },
          language: lang,
        }),
      });
      if (res.ok) {
        const translated = await res.json();
        set({
          personalInfo: translated.personalInfo || personalInfo,
          skills: translated.skills || skills,
          experience: translated.experience || experience,
          projects: translated.projects || projects,
          education: translated.education || education,
          certifications: translated.certifications || certifications,
          achievements: translated.achievements || achievements,
          languages: translated.languages || languages,
        });
        debouncedSave(get);
        setTimeout(() => get().triggerAtsScan(), 200);
      }
    } catch (err) {
      console.error('Failed to translate resume', err);
    } finally {
      set({ isScanning: false });
    }
  },

  optimizeResume: async (jd, company, role) => {
    set({ isScanning: true });
    const { personalInfo, skills, experience, projects, education, certifications, achievements, languages } = get();
    try {
      const res = await fetch(`${API_BASE}/ai-engine/optimize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          resumeData: { personalInfo, skills, experience, projects, education, certifications, achievements, languages },
          jobDescription: jd,
          companyName: company,
          roleTitle: role,
        }),
      });
      if (res.ok) {
        const optimized = await res.json();
        set({
          personalInfo: optimized.personalInfo || personalInfo,
          skills: optimized.skills || skills,
          experience: optimized.experience || experience,
          projects: optimized.projects || projects,
          education: optimized.education || education,
          certifications: optimized.certifications || certifications,
          achievements: optimized.achievements || achievements,
          languages: optimized.languages || languages,
        });
        debouncedSave(get);
        setTimeout(() => get().triggerAtsScan(), 200);
      }
    } catch (err) {
      console.error('Failed to optimize resume', err);
    } finally {
      set({ isScanning: false });
    }
  },

  loadDemoData: () => set({
    personalInfo: defaultPersonalInfo,
    skills: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'REST APIs'],
    experience: [
      {
        id: 'exp-1',
        company: 'TechNovation Labs',
        role: 'Software Engineer II',
        dates: '2023 - Present',
        description: '- Spearheaded the migration of core dashboard applications to Next.js, reducing average page load times by 35%.\n- Coordinated development of real-time collaboration engines using WebSockets and Redis.\n- Mentored 3 junior developers and established code styling standards.',
      },
      {
        id: 'exp-2',
        company: 'Sync Systems',
        role: 'Associate Developer',
        dates: '2021 - 2023',
        description: '- Programmed clean internal API endpoints using Node.js and Express, serving over 10,000 active daily users.\n- Formulated regression test strategies, achieving 88% overall code coverage.',
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'ResumeOS Platform',
        role: 'Lead Architect',
        description: 'Built a lightweight client-side application that serves structured resumes and evaluates ATS readiness indicators.',
        technologies: ['Next.js', 'Zustand', 'Tailwind CSS'],
        link: 'github.com/alexmercer/resume-os',
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'University of California, Berkeley',
        degree: 'B.S. Computer Science',
        dates: '2017 - 2021',
        gpa: '3.8/4.0',
      }
    ],
    certifications: ['AWS Certified Solutions Architect', 'Certified Scrum Developer'],
    achievements: ['Won 1st place in regional hackathon (200+ participants)', 'Published technical paper on distributed databases'],
    languages: ['English (Native)', 'Spanish (Conversational)']
  }),

  resetData: () => set({
    id: 'resume-1',
    title: 'Default Resume',
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    atsAnalysis: {
      score: 0,
      breakdown: { formatting: 0, completeness: 0, actionVerbs: 0, skillsMatch: 0, jobRelevance: 0 },
      suggestions: { critical: [], skills: [], bullets: [] }
    }
  })
}));

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIEngineService {
  private openai: OpenAI;

  // A comprehensive list of standard action verbs for structural ATS analysis
  private standardActionVerbs = new Set([
    'accelerated', 'achieved', 'acquired', 'adapted', 'addressed', 'administered', 'advised',
    'allocated', 'analyzed', 'approved', 'architected', 'assembled', 'assessed', 'authored',
    'budgeted', 'built', 'calculated', 'centralized', 'championed', 'collaborated', 'compiled',
    'composed', 'conducted', 'configured', 'constructed', 'contracted', 'controlled', 'coordinated',
    'created', 'cultivated', 'decreased', 'delivered', 'designed', 'detected', 'determined',
    'developed', 'devised', 'directed', 'distributed', 'documented', 'doubled', 'drafted',
    'edited', 'eliminated', 'engineered', 'enhanced', 'established', 'evaluated', 'executed',
    'expanded', 'expedited', 'facilitated', 'forecasted', 'formulated', 'founded', 'generated',
    'governed', 'guided', 'handled', 'headed', 'identified', 'implemented', 'improved',
    'increased', 'initiated', 'inspected', 'installed', 'instituted', 'integrated', 'introduced',
    'invented', 'investigated', 'launched', 'led', 'managed', 'maximized', 'mediated',
    'mentored', 'merged', 'minimized', 'moderated', 'monitored', 'negotiated', 'obtained',
    'operated', 'optimized', 'orchestrated', 'organized', 'originated', 'overhauled', 'oversaw',
    'performed', 'pioneered', 'planned', 'prepared', 'presented', 'prioritized', 'produced',
    'programmed', 'projected', 'promoted', 'redesigned', 'reduced', 'reorganized', 'resolved',
    'restructured', 'retrieved', 'revamped', 'saved', 'scheduled', 'screened', 'secured',
    'selected', 'simplified', 'solved', 'spearheaded', 'standardized', 'steered', 'streamlined',
    'strengthened', 'supervised', 'surpassed', 'synthesized', 'systematized', 'targeted',
    'trained', 'transformed', 'translated', 'upgraded', 'validated', 'verified', 'wrote'
  ]);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || 'mock-key';
    this.openai = new OpenAI({ apiKey });
  }

  private hasOpenAIKey(): boolean {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    return !!apiKey && apiKey !== 'mock-key' && apiKey !== '';
  }

  /**
   * Performs an authentic, realistic hybrid ATS evaluation:
   * 1. Rules-based programmatic scan for formatting, contact info, structure, action verbs, and readability (40% weight)
   * 2. Semantic LLM scan (GPT-4o) evaluating keyword relevance, experience quality, and job description alignment (60% weight)
   */
  async calculateAtsScore(resumeData: any, jobDescription?: string): Promise<{
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
  }> {
    const formattingScore = this.evaluateFormatting(resumeData);
    const completenessScore = this.evaluateCompleteness(resumeData);
    const actionVerbScore = this.evaluateActionVerbs(resumeData);

    let skillsMatchScore = 70; // Baseline
    let jobRelevanceScore = 70; // Baseline
    let missingKeywords: string[] = [];
    let bulletSuggestions: string[] = [];
    let missingSkills: string[] = [];

    // If job description is present, trigger semantic AI analysis
    if (jobDescription && this.hasOpenAIKey()) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an enterprise applicant tracking system (ATS) parser. Evaluate the provided resume against the job description.
              Return your analysis strictly in JSON format with the following fields:
              {
                "skillsMatchScore": number (0-100),
                "jobRelevanceScore": number (0-100),
                "missingKeywords": string[],
                "missingSkills": string[],
                "bulletSuggestions": string[] (specific action points to rewrite weak bullet points)
              }`
            },
            {
              role: 'user',
              content: `Job Description:\n${jobDescription}\n\nResume Data:\n${JSON.stringify(resumeData)}`
            }
          ]
        });

        const result = JSON.parse(response.choices[0].message.content);
        skillsMatchScore = result.skillsMatchScore || 70;
        jobRelevanceScore = result.jobRelevanceScore || 70;
        missingKeywords = result.missingKeywords || [];
        missingSkills = result.missingSkills || [];
        bulletSuggestions = result.bulletSuggestions || [];
      } catch (err) {
        console.error('AI ATS Analysis Failed, falling back to heuristic parsing', err);
      }
    } else {
      // Heuristic fallback if no Job Description or no API key
      missingSkills = ['Continuous Integration', 'Testing/QA', 'Performance Tuning'];
      bulletSuggestions = ['Ensure experiences have quantifiable results (e.g. increased speed by X%, saved Y hours).'];
    }

    // Weighted overall score calculation
    const overallScore = Math.round(
      formattingScore * 0.15 +
      completenessScore * 0.15 +
      actionVerbScore * 0.10 +
      skillsMatchScore * 0.35 +
      jobRelevanceScore * 0.25
    );

    const criticalSuggestions: string[] = [];
    if (completenessScore < 80) criticalSuggestions.push('Add missing vital sections (projects, links, or contact summaries)');
    if (actionVerbScore < 70) criticalSuggestions.push('Start bullet points with strong action verbs (e.g., spearheaded, engineered) rather than passive words');
    if (formattingScore < 80) criticalSuggestions.push('Ensure email, phone number, and location are completely filled in for parser indexing');
    missingKeywords.forEach(kw => criticalSuggestions.push(`Missing important keyword: ${kw}`));

    return {
      score: overallScore,
      breakdown: {
        formatting: formattingScore,
        completeness: completenessScore,
        actionVerbs: actionVerbScore,
        skillsMatch: skillsMatchScore,
        jobRelevance: jobRelevanceScore
      },
      suggestions: {
        critical: criticalSuggestions,
        skills: missingSkills,
        bullets: bulletSuggestions
      }
    };
  }

  /**
   * AI-optimizes the entire resume for a specific target company and role.
   * Naturally integrates keywords into skills and refines experience descriptions.
   */
  async optimizeResumeForJob(
    resumeData: any,
    jobDescription: string,
    companyName: string,
    roleTitle: string
  ): Promise<any> {
    if (!this.hasOpenAIKey()) {
      return {
        ...resumeData,
        title: `${resumeData.title} (${companyName} - Optimized)`,
        skills: Array.from(new Set([...(resumeData.skills || []), 'React Testing Library', 'CI/CD Pipelines']))
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an expert executive resume writer. Your job is to optimize a candidate's resume for a specific role at a company.
            You must preserve the candidate's core background, but:
            1. Integrate key keywords from the job description naturally (no stuffing).
            2. Rewrite weak, passive bullet points to start with active verbs and quantify impact.
            3. Prioritize technologies they are likely to know based on context.
            Return the response in the exact same JSON format as the input resume.`
          },
          {
            role: 'user',
            content: `Target Role: ${roleTitle} at ${companyName}\n\nJob Description:\n${jobDescription}\n\nCandidate Resume JSON:\n${JSON.stringify(resumeData)}`
          }
        ]
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (err) {
      throw new InternalServerErrorException('AI optimization service failed: ' + err.message);
    }
  }

  /**
   * Professional bullet point enhancer. Rewrites bullet points to integrate metrics/action verbs.
   */
  async improveBulletPoint(bullet: string, focusArea: string = 'general'): Promise<string> {
    if (!this.hasOpenAIKey()) {
      return `Spearheaded execution of technical deliverables, enhancing process efficiency by 22% and securing stable production-grade operations.`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume writer specializing in engineering and high-impact bullets.
            Rewrite the user's bullet point to make it strong, active, and outcome-oriented.
            Guidelines:
            - Start with a powerful action verb.
            - Quantify impact with a realistic, placeholder metric (e.g. 'improved page load times by 40%', 'reduced error rates by 15%') if none exists.
            - Keep it to a single, high-impact sentence.
            - Focus on: ${focusArea}.
            Only return the enhanced string.`
          },
          {
            role: 'user',
            content: `Bullet point: "${bullet}"`
          }
        ]
      });

      return response.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } catch (err) {
      return bullet;
    }
  }

  /**
   * AI-generated interview questions and guides based on resume and target role.
   */
  async generateInterviewQuestions(resumeData: any, role?: string, type?: string): Promise<any[]> {
    if (this.hasOpenAIKey()) {
      try {
        const targetRole = role || resumeData.personalInfo?.title || 'Software Engineer';
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert technical recruiter and interviewer. Generate a list of realistic interview questions for a candidate with the provided resume, targeting the specified role.
              Generate a mix of HR, Technical, Behavioral, and Coding questions.
              Return your response strictly in JSON format with a "questions" key containing an array of objects:
              {
                "questions": [
                  {
                    "id": "unique-id-1",
                    "type": "hr" | "technical" | "behavioral" | "coding",
                    "question": "The interview question text...",
                    "suggestedAnswer": "A short, bulleted guide or suggested outline on how the candidate should answer this question successfully."
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Target Role: ${targetRole}\n\nCandidate Resume JSON:\n${JSON.stringify(resumeData)}`
            }
          ]
        });
        const result = JSON.parse(response.choices[0].message.content);
        return result.questions || [];
      } catch (err) {
        console.error('AI Interview Question Generation Failed, falling back to heuristics', err);
      }
    }

    // Heuristic fallback
    const targetRole = role || resumeData.personalInfo?.title || 'Software Engineer';
    const skills = resumeData.skills || [];
    const mainSkill = skills.length > 0 ? skills[0] : 'React/Node.js';
    
    return [
      {
        id: 'q-hr-1',
        type: 'hr',
        question: `Why are you interested in a ${targetRole} role, and what makes you a strong fit based on your background?`,
        suggestedAnswer: 'Walk through your relevant experiences, highlighting major achievements and how they align with this role\'s requirements.'
      },
      {
        id: 'q-tech-1',
        type: 'technical',
        question: `Can you explain the architecture of a project you built using ${mainSkill}? What were the main bottlenecks?`,
        suggestedAnswer: 'Describe the high-level architecture, discuss trade-offs made (e.g. database choice, state management), and explain how you optimized performance.'
      },
      {
        id: 'q-beh-1',
        type: 'behavioral',
        question: 'Tell me about a time you had to deal with an ambiguous requirement. How did you resolve it?',
        suggestedAnswer: 'Use the STAR method. Describe the situation, your task to clarify requirements, the actions you took (communicating with stakeholders, making assumptions), and the successful result.'
      },
      {
        id: 'q-cod-1',
        type: 'coding',
        question: 'Given an array of integers, write a function to find the maximum subarray sum (Kadane\'s Algorithm).',
        suggestedAnswer: 'Initialize max_so_far and max_ending_here to the first element. Loop through the array, update max_ending_here as max(x, max_ending_here + x), and max_so_far as max(max_so_far, max_ending_here). Time complexity: O(N), Space complexity: O(1).'
      }
    ];
  }

  /**
   * Suggests matching companies and roles based on the resume.
   */
  async suggestCompanies(resumeData: any): Promise<any[]> {
    if (this.hasOpenAIKey()) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are a career advisor. Suggest 3-4 realistic matching companies and specific roles for a candidate with the provided resume.
              For each company, evaluate a match percentage, identify key missing skills they should learn, and estimate a realistic salary range.
              Return your response strictly in JSON format with a "companies" key containing an array of objects:
              {
                "companies": [
                  {
                    "companyName": "Company Name",
                    "roleTitle": "Role Title",
                    "matchPercentage": number (e.g. 85),
                    "missingSkills": string[],
                    "salaryRange": "e.g. $120,000 - $140,000",
                    "reason": "Brief explanation of why this is a good fit."
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Candidate Resume JSON:\n${JSON.stringify(resumeData)}`
            }
          ]
        });
        const result = JSON.parse(response.choices[0].message.content);
        return result.companies || [];
      } catch (err) {
        console.error('AI Company Suggestions Failed, falling back to heuristics', err);
      }
    }

    // Heuristic fallback
    const skills = resumeData.skills || [];
    const isFrontend = skills.some(s => /react|angular|vue|frontend|css|html|typescript/i.test(s));
    
    if (isFrontend) {
      return [
        {
          companyName: 'Stripe',
          roleTitle: 'Frontend Engineer - Dashboard',
          matchPercentage: 88,
          missingSkills: ['TailwindCSS', 'Playwright', 'Web Accessibility (a11y)'],
          salaryRange: '$140,000 - $180,000',
          reason: 'Strong React and TypeScript skills align well with Stripe\'s frontend ecosystem.'
        },
        {
          companyName: 'Canva',
          roleTitle: 'Software Engineer (Product)',
          matchPercentage: 82,
          missingSkills: ['GraphQL', 'WebGL', 'Canvas API'],
          salaryRange: '$120,000 - $150,000',
          reason: 'Your experience building rich user interfaces matches Canva\'s design tools team.'
        }
      ];
    } else {
      return [
        {
          companyName: 'Vercel',
          roleTitle: 'Full Stack Engineer - Next.js',
          matchPercentage: 85,
          missingSkills: ['Next.js App Router', 'Redis', 'Serverless Functions'],
          salaryRange: '$130,000 - $170,000',
          reason: 'Strong JavaScript and API development matches Vercel\'s developer experience workflows.'
        },
        {
          companyName: 'Datadog',
          roleTitle: 'Software Engineer - Backend/APIs',
          matchPercentage: 80,
          missingSkills: ['Go/Golang', 'Kubernetes', 'gRPC'],
          salaryRange: '$140,000 - $180,000',
          reason: 'Backend integration and API optimization work aligns with high-scale infrastructure.'
        }
      ];
    }
  }

  /**
   * Generates a complete resume JSON template for a role and experience level.
   */
  async generateFromTemplate(role: string, experienceLevel: string, language: string = 'en'): Promise<any> {
    if (this.hasOpenAIKey()) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert resume builder. Generate a complete, high-quality resume JSON for a given role and experience level.
              The resume should be in the target language: "${language}".
              Ensure it contains realistic, high-impact descriptions, skills, educational history, projects, and certifications.
              Return your response strictly in JSON format matching the schema:
              {
                "title": "Resume Title",
                "personalInfo": {
                  "fullName": "Name",
                  "email": "email@example.com",
                  "phone": "+1-123-456-7890",
                  "location": "City, Country",
                  "website": "https://example.com",
                  "summary": "Professional summary statement..."
                },
                "experience": [
                  {
                    "company": "Company Name",
                    "position": "Job Title",
                    "startDate": "YYYY-MM",
                    "endDate": "YYYY-MM or Present",
                    "description": "High-impact achievements starting with action verbs..."
                  }
                ],
                "projects": [
                  {
                    "name": "Project Name",
                    "description": "What the project does and technologies used...",
                    "url": "https://github.com/..."
                  }
                ],
                "education": [
                  {
                    "school": "University Name",
                    "degree": "Degree",
                    "fieldOfStudy": "Field",
                    "startDate": "YYYY-MM",
                    "endDate": "YYYY-MM",
                    "gpa": "GPA (optional)"
                  }
                ],
                "skills": ["Skill 1", "Skill 2"],
                "certifications": ["Certification 1"],
                "achievements": ["Achievement 1"],
                "languages": ["Language 1"]
              }`
            },
            {
              role: 'user',
              content: `Generate a resume for Role: ${role}, Experience Level: ${experienceLevel}`
            }
          ]
        });
        return JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.error('AI Resume Generation from template failed, falling back to heuristics', err);
      }
    }

    // Heuristic fallback
    return {
      title: `${role} - ${experienceLevel} Template`,
      personalInfo: {
        name: 'John Doe',
        title: role,
        email: 'john.doe@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        summary: `Highly motivated and results-driven ${role} with experience building scalable systems and working in collaborative teams.`
      },
      experience: [
        {
          id: 'exp-temp-1',
          company: 'Acme Tech Solutions',
          role: `Senior ${role}`,
          dates: '2023-01 - Present',
          description: `Led development of core features, improving system throughput by 35%. Mentored 4 junior engineers and optimized API latency by 150ms.`
        },
        {
          id: 'exp-temp-2',
          company: 'Initech Systems',
          role: role,
          dates: '2020-06 - 2022-12',
          description: `Collaborated on a high-traffic microservices application. Engineered database migrations and reduced code build failures by 20%.`
        }
      ],
      projects: [
        {
          id: 'proj-temp-1',
          name: 'CloudScale Engine',
          description: 'A serverless deployment orchestrator built with Node.js and AWS.',
          role: 'Lead Developer',
          technologies: ['Node.js', 'AWS', 'Docker'],
          link: 'https://github.com/johndoe/cloudscale'
        }
      ],
      education: [
        {
          id: 'edu-temp-1',
          school: 'State University',
          degree: 'Bachelor of Science',
          dates: '2016-09 - 2020-05',
          gpa: '3.8'
        }
      ],
      skills: ['TypeScript', 'Node.js', 'React', 'Docker', 'AWS', 'System Design'],
      certifications: ['AWS Certified Solutions Architect', 'Certified Scrum Developer'],
      achievements: ['Won 1st place in regional hackathon (200+ participants)', 'Published technical paper on distributed databases'],
      languages: ['English (Native)', 'Spanish (Conversational)']
    };
  }

  /**
   * Corrects grammar and spelling, optimizing for resumes.
   */
  async correctGrammar(text: string): Promise<string> {
    if (this.hasOpenAIKey()) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert editor and resume writer. Rewrite the input text to fix any spelling or grammar mistakes, enhance clarity, and maximize professionalism.
              Keep the meaning and original context identical, but elevate the vocabulary and phrasing. Do not wrap in quotes or add comments. Just return the corrected string.`
            },
            {
              role: 'user',
              content: text
            }
          ]
        });
        return response.choices[0].message.content.trim();
      } catch (err) {
        console.error('AI Grammar correction failed, returning original text', err);
      }
    }

    // Heuristic fallback: simple cleanups
    if (!text) return '';
    let cleaned = text.trim();
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    // Add period if it doesn't end with punctuation
    if (!/[.!?]$/.test(cleaned)) {
      cleaned += '.';
    }
    return cleaned;
  }

  /**
   * Translates the entire resume data JSON while preserving the structure.
   */
  async translateResume(resumeData: any, language: string): Promise<any> {
    if (this.hasOpenAIKey()) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert translator. Translate the values (but NOT keys) of the following resume JSON to the target language: "${language}".
              Ensure the translated JSON matches the exact structural schema of the input JSON.`
            },
            {
              role: 'user',
              content: JSON.stringify(resumeData)
            }
          ]
        });
        return JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.error('AI translation failed, returning original resume', err);
      }
    }

    // Heuristic fallback
    const translated = JSON.parse(JSON.stringify(resumeData));
    if (translated.personalInfo?.summary) {
      translated.personalInfo.summary = `[Translated to ${language}] ${translated.personalInfo.summary}`;
    }
    if (Array.isArray(translated.experience)) {
      translated.experience = translated.experience.map((exp: any) => ({
        ...exp,
        role: `[${language}] ${exp.role || ''}`,
        description: `[${language}] ${exp.description || ''}`
      }));
    }
    return translated;
  }

  // --- Programmatic Subscore Heuristics ---

  private evaluateFormatting(resumeData: any): number {
    let score = 100;
    const info = resumeData.personalInfo || {};

    if (!info.email || !info.email.includes('@')) score -= 20;
    if (!info.phone || info.phone.length < 7) score -= 20;
    if (!info.location) score -= 15;
    if (!info.website) score -= 5; // Good to have portfolio links

    return Math.max(score, 30);
  }

  private evaluateCompleteness(resumeData: any): number {
    let score = 100;

    if (!resumeData.personalInfo?.summary) score -= 15;
    if (!resumeData.experience || resumeData.experience.length === 0) score -= 25;
    if (!resumeData.projects || resumeData.projects.length === 0) score -= 20;
    if (!resumeData.education || resumeData.education.length === 0) score -= 20;
    if (!resumeData.skills || resumeData.skills.length === 0) score -= 20;

    return Math.max(score, 20);
  }

  private evaluateActionVerbs(resumeData: any): number {
    let matchCount = 0;
    let totalWordCount = 0;

    const experiences = resumeData.experience || [];
    experiences.forEach((exp: any) => {
      if (exp.description) {
        const words = exp.description.toLowerCase().split(/\W+/);
        words.forEach((word: string) => {
          if (word.length > 2) {
            totalWordCount++;
            if (this.standardActionVerbs.has(word)) {
              matchCount++;
            }
          }
        });
      }
    });

    if (totalWordCount === 0) return 50;

    // Density calculation: aiming for about 4-8% action verb density in good resumes
    const density = (matchCount / totalWordCount) * 100;
    if (density >= 6) return 100;
    if (density >= 4) return 85;
    if (density >= 2) return 65;
    return 45;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AIEngineService } from '../ai-engine/ai-engine.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoverLetterService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || 'mock-key';
    this.openai = new OpenAI({ apiKey });
  }

  async create(userId: string, title: string, company: string, role: string, content: string) {
    // Ensure user exists
    await this.prisma.user.upsert({
      where: { email: `${userId}@demo.com` },
      create: { id: userId, email: `${userId}@demo.com`, name: 'Demo User' },
      update: {},
    });

    return this.prisma.coverLetter.create({
      data: {
        userId,
        title,
        company,
        role,
        content,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const letter = await this.prisma.coverLetter.findUnique({ where: { id } });
    if (!letter) {
      throw new NotFoundException(`Cover letter with ID ${id} not found`);
    }
    return letter;
  }

  async update(id: string, updateData: { title?: string; company?: string; role?: string; content?: string }) {
    await this.findOne(id);
    return this.prisma.coverLetter.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coverLetter.delete({ where: { id } });
  }

  async generate(
    userId: string,
    resumeData: any,
    jobDescription: string,
    company: string,
    role: string,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (apiKey) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert executive cover letter writer. Create a professional, clean, compelling cover letter based on the candidate's resume and target job description. Do not use placeholders. Tailor the tone to be professional, confident, and direct.`,
            },
            {
              role: 'user',
              content: `Target Role: ${role} at ${company}\n\nJob Description:\n${jobDescription}\n\nCandidate Resume JSON:\n${JSON.stringify(resumeData)}`,
            },
          ],
        });
        return response.choices[0].message.content.trim();
      } catch (err) {
        console.error('AI Cover Letter generation failed, falling back', err);
      }
    }

    // Heuristic Fallback cover letter
    const name = resumeData?.personalInfo?.name || 'Candidate';
    const email = resumeData?.personalInfo?.email || 'email@example.com';
    const phone = resumeData?.personalInfo?.phone || '';
    const location = resumeData?.personalInfo?.location || '';
    const skillsList = (resumeData?.skills || []).slice(0, 5).join(', ');

    return `Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${role} position at ${company}. With a solid foundation in engineering, design, and development, alongside practical experience in technologies like ${skillsList || 'full stack development'}, I am confident in my ability to contribute effectively to your engineering organization.

Throughout my career, I have focused on building clean, high-performance, and scalable solutions that address complex problems. My technical skillset combined with my commitment to writing stable, production-grade applications aligns perfectly with the requirements of the ${role} role.

I am enthusiastic about the opportunity to bring my experience and dedication to your team. Thank you for your time and consideration. I look forward to discussing how my background and skills can meet the needs of ${company}.

Sincerely,
${name}
${email} | ${phone}
${location}`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  private getBlankResumeTemplate(title: string) {
    return {
      title,
      version: 1,
      personalInfo: {
        name: '',
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
      designConfig: {
        font: 'Inter',
        primaryColor: '#4f46e5', // Indigo
        spacing: 'comfortable',
        layoutOrder: ['summary', 'experience', 'projects', 'education', 'skills'],
      },
      atsScore: 0,
      atsAnalysis: {},
    };
  }

  async create(userId: string, title: string) {
    const template = this.getBlankResumeTemplate(title);
    return this.prisma.resume.create({
      data: {
        userId,
        title: template.title,
        version: template.version,
        personalInfo: template.personalInfo as Prisma.InputJsonValue,
        skills: template.skills as Prisma.InputJsonValue,
        experience: template.experience as Prisma.InputJsonValue,
        projects: template.projects as Prisma.InputJsonValue,
        education: template.education as Prisma.InputJsonValue,
        certifications: template.certifications as Prisma.InputJsonValue,
        achievements: template.achievements as Prisma.InputJsonValue,
        languages: template.languages as Prisma.InputJsonValue,
        designConfig: template.designConfig as Prisma.InputJsonValue,
        atsScore: 0,
        atsAnalysis: {} as Prisma.InputJsonValue,
      },
    });
  }

  async findOne(id: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) {
      throw new NotFoundException(`Resume with ID ${id} not found`);
    }
    return resume;
  }

  async findByUser(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: string, updateData: Partial<Prisma.ResumeUpdateInput>) {
    await this.findOne(id); // Ensure exists
    return this.prisma.resume.update({
      where: { id },
      data: updateData,
    });
  }

  async duplicate(id: string, newTitle: string) {
    const origin = await this.findOne(id);
    return this.prisma.resume.create({
      data: {
        userId: origin.userId,
        title: newTitle,
        version: origin.version + 1,
        personalInfo: origin.personalInfo as Prisma.InputJsonValue,
        skills: origin.skills as Prisma.InputJsonValue,
        experience: origin.experience as Prisma.InputJsonValue,
        projects: origin.projects as Prisma.InputJsonValue,
        education: origin.education as Prisma.InputJsonValue,
        certifications: origin.certifications as Prisma.InputJsonValue,
        achievements: origin.achievements as Prisma.InputJsonValue,
        languages: origin.languages as Prisma.InputJsonValue,
        designConfig: origin.designConfig as Prisma.InputJsonValue,
        atsScore: origin.atsScore,
        atsAnalysis: origin.atsAnalysis as Prisma.InputJsonValue,
      },
    });
  }

  async publish(id: string, slug: string) {
    const existing = await this.prisma.resume.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      throw new Error('Slug is already in use by another resume');
    }
    return this.prisma.resume.update({
      where: { id },
      data: {
        isPublished: true,
        slug,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.resume.delete({ where: { id } });
  }
}

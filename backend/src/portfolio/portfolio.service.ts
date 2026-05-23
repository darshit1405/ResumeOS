import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(userId: string) {
    let portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      // Ensure user exists first
      await this.prisma.user.upsert({
        where: { email: `${userId}@demo.com` },
        create: { id: userId, email: `${userId}@demo.com`, name: 'Demo User' },
        update: {},
      });

      portfolio = await this.prisma.portfolio.create({
        data: {
          userId,
          slug: `portfolio-${userId.toLowerCase()}`,
          theme: 'minimal',
          sections: { showProjects: true, showExperience: true, customHeroText: '' } as Prisma.InputJsonValue,
        },
      });
    }

    return portfolio;
  }

  async updatePortfolio(userId: string, data: { slug?: string; theme?: string; sections?: any }) {
    const portfolio = await this.getPortfolio(userId);

    if (data.slug && data.slug !== portfolio.slug) {
      // Verify slug is unique
      const existing = await this.prisma.portfolio.findUnique({ where: { slug: data.slug } });
      if (existing) {
        throw new BadRequestException('This slug is already taken by another user.');
      }
    }

    return this.prisma.portfolio.update({
      where: { userId },
      data: {
        slug: data.slug,
        theme: data.theme,
        sections: data.sections as Prisma.InputJsonValue,
      },
    });
  }

  async findBySlug(slug: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            resumes: {
              orderBy: { updatedAt: 'desc' },
              take: 1, // Get the latest updated resume as the portfolio base
            },
          },
        },
      },
    });

    if (!portfolio) {
      // Check if there is a resume with this published slug
      const resume = await this.prisma.resume.findUnique({
        where: { slug },
        include: { user: true }
      });

      if (!resume) {
        throw new NotFoundException(`Portfolio or published resume for slug '${slug}' not found`);
      }

      return {
        type: 'resume',
        resume,
        user: resume.user,
      };
    }

    return {
      type: 'portfolio',
      portfolio,
      user: portfolio.user,
      resume: portfolio.user.resumes[0] || null,
    };
  }
}

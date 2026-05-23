import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AIEngineService } from './ai-engine.service';

@Controller('ai-engine')
export class AIEngineController {
  constructor(private readonly aiEngineService: AIEngineService) {}

  @Post('ats-score')
  async getAtsScore(
    @Body('resumeData') resumeData: any,
    @Body('jobDescription') jobDescription?: string
  ) {
    if (!resumeData) {
      throw new BadRequestException('resumeData is required for ATS scoring');
    }
    return this.aiEngineService.calculateAtsScore(resumeData, jobDescription);
  }

  @Post('optimize')
  async optimize(
    @Body('resumeData') resumeData: any,
    @Body('jobDescription') jobDescription: string,
    @Body('companyName') companyName: string,
    @Body('roleTitle') roleTitle: string
  ) {
    if (!resumeData || !jobDescription || !companyName || !roleTitle) {
      throw new BadRequestException('resumeData, jobDescription, companyName, and roleTitle are all required');
    }
    return this.aiEngineService.optimizeResumeForJob(resumeData, jobDescription, companyName, roleTitle);
  }

  @Post('improve-bullet')
  async improveBullet(
    @Body('bullet') bullet: string,
    @Body('focusArea') focusArea?: string
  ) {
    if (!bullet) {
      throw new BadRequestException('bullet text is required');
    }
    const enhanced = await this.aiEngineService.improveBulletPoint(bullet, focusArea);
    return { enhanced };
  }

  @Post('interview-questions')
  async getInterviewQuestions(
    @Body('resumeData') resumeData: any,
    @Body('role') role?: string,
    @Body('type') type?: string
  ) {
    if (!resumeData) {
      throw new BadRequestException('resumeData is required');
    }
    return this.aiEngineService.generateInterviewQuestions(resumeData, role, type);
  }

  @Post('suggest-companies')
  async getCompanySuggestions(
    @Body('resumeData') resumeData: any
  ) {
    if (!resumeData) {
      throw new BadRequestException('resumeData is required');
    }
    return this.aiEngineService.suggestCompanies(resumeData);
  }

  @Post('generate-template')
  async generateFromTemplate(
    @Body('role') role: string,
    @Body('experienceLevel') experienceLevel: string,
    @Body('language') language?: string
  ) {
    if (!role || !experienceLevel) {
      throw new BadRequestException('role and experienceLevel are required');
    }
    return this.aiEngineService.generateFromTemplate(role, experienceLevel, language || 'en');
  }

  @Post('grammar-correct')
  async grammarCorrect(
    @Body('text') text: string
  ) {
    if (!text) {
      throw new BadRequestException('text is required');
    }
    const corrected = await this.aiEngineService.correctGrammar(text);
    return { corrected };
  }

  @Post('translate')
  async translateResume(
    @Body('resumeData') resumeData: any,
    @Body('language') language: string
  ) {
    if (!resumeData || !language) {
      throw new BadRequestException('resumeData and language are required');
    }
    return this.aiEngineService.translateResume(resumeData, language);
  }
}

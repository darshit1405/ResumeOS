import { Controller, Get, Post, Body, Put, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';

@Controller('cover-letters')
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  private getUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'] || 'demo-user-123';
    return userId;
  }

  @Post()
  async create(
    @Headers() headers: Record<string, string>,
    @Body('title') title: string,
    @Body('company') company: string,
    @Body('role') role: string,
    @Body('content') content: string,
  ) {
    const userId = this.getUserId(headers);
    if (!company || !role || !content) {
      throw new BadRequestException('Company, role, and content are required');
    }
    return this.coverLetterService.create(userId, title || 'Untitled Cover Letter', company, role, content);
  }

  @Get()
  async findAll(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return this.coverLetterService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coverLetterService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: { title?: string; company?: string; role?: string; content?: string },
  ) {
    return this.coverLetterService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coverLetterService.remove(id);
  }

  @Post('generate')
  async generate(
    @Headers() headers: Record<string, string>,
    @Body('resumeData') resumeData: any,
    @Body('jobDescription') jobDescription: string,
    @Body('company') company: string,
    @Body('role') role: string,
  ) {
    const userId = this.getUserId(headers);
    if (!resumeData || !jobDescription || !company || !role) {
      throw new BadRequestException('resumeData, jobDescription, company, and role are required');
    }
    const content = await this.coverLetterService.generate(userId, resumeData, jobDescription, company, role);
    return { content };
  }
}

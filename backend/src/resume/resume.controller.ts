import { Controller, Get, Post, Body, Put, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { ResumeService } from './resume.service';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // Middleware / Decorator simulation for userId headers
  private getUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'];
    if (!userId) {
      throw new BadRequestException('User identification header (x-user-id) missing');
    }
    return userId;
  }

  @Post()
  async create(
    @Headers() headers: Record<string, string>,
    @Body('title') title: string
  ) {
    const userId = this.getUserId(headers);
    return this.resumeService.create(userId, title || 'Untitled Resume');
  }

  @Get()
  async findAll(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return this.resumeService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resumeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.resumeService.update(id, updateData);
  }

  @Post(':id/duplicate')
  async duplicate(
    @Param('id') id: string,
    @Body('title') title: string
  ) {
    return this.resumeService.duplicate(id, title || 'Resume Copy');
  }

  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    @Body('slug') slug: string
  ) {
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      throw new BadRequestException('Invalid slug format. Must be alphanumeric and hyphens only.');
    }
    return this.resumeService.publish(id, slug);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}

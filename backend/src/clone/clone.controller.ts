import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloneService } from './clone.service';

@Controller('clone')
export class CloneController {
  constructor(private readonly cloneService: CloneService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No resume file was uploaded.');
    }
    
    // Check mime type (PDF or Image files only)
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF, PNG, and JPG/JPEG files are accepted.');
    }

    try {
      const parsedData = await this.cloneService.parseResumeFile(file.buffer, file.mimetype);
      return parsedData;
    } catch (error) {
      throw new BadRequestException(error.message || 'An error occurred while parsing the resume.');
    }
  }
}

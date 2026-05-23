import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ResumeController } from './resume/resume.controller';
import { ResumeService } from './resume/resume.service';
import { AIEngineController } from './ai-engine/ai-engine.controller';
import { AIEngineService } from './ai-engine/ai-engine.service';
import { CoverLetterController } from './cover-letter/cover-letter.controller';
import { CoverLetterService } from './cover-letter/cover-letter.service';
import { CloneController } from './clone/clone.controller';
import { CloneService } from './clone/clone.service';
import { PortfolioController } from './portfolio/portfolio.controller';
import { PortfolioService } from './portfolio/portfolio.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    ResumeController,
    AIEngineController,
    CoverLetterController,
    CloneController,
    PortfolioController,
  ],
  providers: [
    PrismaService,
    ResumeService,
    AIEngineService,
    CoverLetterService,
    CloneService,
    PortfolioService,
  ],
})
export class AppModule {}


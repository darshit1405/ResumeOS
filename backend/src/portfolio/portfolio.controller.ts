import { Controller, Get, Put, Body, Param, Headers, BadRequestException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  private getUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'] || 'demo-user-123';
    return userId;
  }

  @Get('me')
  async getMe(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return this.portfolioService.getPortfolio(userId);
  }

  @Put('me')
  async updateMe(
    @Headers() headers: Record<string, string>,
    @Body() updateData: { slug?: string; theme?: string; sections?: any },
  ) {
    const userId = this.getUserId(headers);
    if (updateData.slug && !/^[a-z0-9-]+$/.test(updateData.slug)) {
      throw new BadRequestException('Invalid slug format. Must be alphanumeric and hyphens only.');
    }
    return this.portfolioService.updatePortfolio(userId, updateData);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    if (!slug) {
      throw new BadRequestException('Slug is required');
    }
    return this.portfolioService.findBySlug(slug);
  }
}

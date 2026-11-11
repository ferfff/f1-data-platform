import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { CreateIngestionJobDto } from './dto/create-ingestion-job.dto';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Get('jobs/:id')
  getJob(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.getJob(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('seasons')
  createSeasonJob(@Body() body: CreateIngestionJobDto) {
    if (body.lastYear != null && body.lastYear < body.initYear) {
      throw new BadRequestException(
        'lastYear must be greater than or equal to initYear',
      );
    }
    return this.ingestionService.createJob(
      body.initYear,
      body.lastYear ?? null,
    );
  }
}
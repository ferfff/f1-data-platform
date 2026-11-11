import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngestionService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(initYear: number, lastYear: number | null) {
    const effectiveLastYear = lastYear ?? initYear;
    const totalSeasons = effectiveLastYear - initYear + 1;

    return this.prisma.ingestionJob.create({
      data: {
        initYear,
        lastYear,
        totalSeasons,
      },
    });
  }

  async getJob(id: number) {
    const job = await this.prisma.ingestionJob.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Ingestion job not found');
    }

    return job;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindSeasonsDto } from './dto/find-seasons.dto';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindSeasonsDto) {
    const { search, page, limit } = query;

    const where = search
      ? { year: /^\d{4}$/.test(search) ? Number(search) : -1 }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.season.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.season.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const season = await this.prisma.season.findUnique({
      where: { id },
    });

    if (!season) {
      throw new NotFoundException(`Season with ID ${id} not found`);
    }

    return season;
  }
}
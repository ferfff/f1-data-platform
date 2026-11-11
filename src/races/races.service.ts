import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindRacesDto } from './dto/find-races.dto';

@Injectable()
export class RacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindRacesDto) {
    const { search, season, circuitId, page, limit } = query;

    const where = {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
      ...(season && {
        season: {
          year: season,
        },
      }),
      ...(circuitId && {
        circuitId,
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.race.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: 'desc' }, { round: 'desc' }],
      }),
      this.prisma.race.count({ where }),
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
    const race = await this.prisma.race.findUnique({
      where: { id },
    });

    if (!race) {
      throw new NotFoundException(`Race with ID ${id} not found`);
    }

    return race;
  }
}
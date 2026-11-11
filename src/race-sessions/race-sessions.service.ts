
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindRaceSessionsDto } from './dto/find-race-sessions.dto';

@Injectable()
export class RaceSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindRaceSessionsDto) {
    const { raceId, season, type, page, limit } = query;

    const where = {
      ...(raceId && { raceId }),
      ...(type && { type }),
      ...(season && {
        race: {
          season: {
            year: season,
          },
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.raceSession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { date: 'desc' },
          { sessionNumber: 'asc' },
        ],
        include: {
          race: {
            include: {
              season: true,
              circuit: true,
            },
          },
        },
      }),
      this.prisma.raceSession.count({ where }),
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
    const session = await this.prisma.raceSession.findUnique({
      where: { id },
      include: {
        race: {
          include: {
            season: true,
            circuit: true,
          },
        },
        results: {
          include: {
            driver: true,
            constructor: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(
        `Race session with ID ${id} not found`,
      );
    }

    return session;
  }
}

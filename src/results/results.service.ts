
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindResultsDto } from './dto/find-results.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindResultsDto) {
    const {
      season,
      raceId,
      sessionType,
      driverId,
      constructorId,
      search,
      page,
      limit,
    } = query;

    const conditions = [
      ...(season
        ? [{ raceSession: { race: { season: { year: season } } } }]
        : []),
      ...(raceId ? [{ raceSession: { raceId } }] : []),
      ...(sessionType ? [{ raceSession: { type: sessionType } }] : []),
      ...(driverId ? [{ driverId }] : []),
      ...(constructorId ? [{ constructorId }] : []),
      ...(search
        ? [
            {
              driver: {
                OR: [
                  {
                    firstName: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                  {
                    lastName: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                  {
                    driverRef: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ];

    const where = {
      AND: conditions,
    };

    const [data, total] = await Promise.all([
      this.prisma.sessionResult.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { raceSession: { race: { date: 'desc' } } },
          { position: 'asc' },
        ],
        include: {
          driver: true,
          constructor: true,
          raceSession: {
            include: {
              race: {
                include: {
                  season: true,
                  circuit: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.sessionResult.count({ where }),
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
    const result = await this.prisma.sessionResult.findUnique({
      where: { id },
      include: {
        driver: true,
        constructor: true,
        raceSession: {
          include: {
            race: {
              include: {
                season: true,
                circuit: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    return result;
  }
}

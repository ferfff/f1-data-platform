
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindDriverTeamSeasonsDto } from './dto/find-driver-team-seasons.dto';

@Injectable()
export class DriverTeamSeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindDriverTeamSeasonsDto) {
    const {
      season,
      driverId,
      constructorId,
      number,
      page,
      limit,
    } = query;

    const where = {
      ...(driverId && { driverId }),
      ...(constructorId && { constructorId }),
      ...(number !== undefined && { number }),
      ...(season && {
        season: {
          year: season,
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.driverTeamSeason.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { season: { year: 'desc' } },
          { driver: { lastName: 'asc' } },
        ],
        include: {
          driver: true,
          constructor: true,
          season: true,
        },
      }),
      this.prisma.driverTeamSeason.count({ where }),
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
    const driverTeamSeason =
      await this.prisma.driverTeamSeason.findUnique({
        where: { id },
        include: {
          driver: true,
          constructor: true,
          season: true,
        },
      });

    if (!driverTeamSeason) {
      throw new NotFoundException(
        `Driver team season with ID ${id} not found`,
      );
    }

    return driverTeamSeason;
  }
}

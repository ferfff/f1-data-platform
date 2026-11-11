
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindCircuitsDto } from './dto/find-circuits.dto';

@Injectable()
export class CircuitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindCircuitsDto) {
    const { search, page, limit } = query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { circuitRef: { contains: search, mode: 'insensitive' as const } },
            { location: { contains: search, mode: 'insensitive' as const } },
            { country: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.circuit.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ name: 'asc' }],
      }),
      this.prisma.circuit.count({ where }),
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
    const circuit = await this.prisma.circuit.findUnique({
      where: { id },
    });

    if (!circuit) {
      throw new NotFoundException(`Circuit with ID ${id} not found`);
    }

    return circuit;
  }
}

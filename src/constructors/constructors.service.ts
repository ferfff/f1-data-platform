import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindConstructorsDto } from './dto/find-constructors.dto';

@Injectable()
export class ConstructorsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(query: FindConstructorsDto) {
      const { search, page, limit } = query;

      const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { nationality: { contains: search, mode: 'insensitive' as const } },
                    { constructorRef: { contains: search, mode: 'insensitive' as const } },
                ]
            }
            : {};

        const [data, total] = await Promise.all([
            this.prisma.f1Constructor.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [
                    { name: 'asc' }
                ]
            }),
            this.prisma.f1Constructor.count({ where })
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };

    }

    async findOne(id: number) {
        const constructor = await this.prisma.f1Constructor.findUnique({
            where: { id },
        });

        if (!constructor) {
            throw new NotFoundException(`Constructor with ID ${id} not found`);
        }

        return constructor;
    }
}

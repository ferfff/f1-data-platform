import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JolpicaClient } from './jolpica.client';

@Injectable()
export class IngestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jolpicaClient: JolpicaClient
  ) {}

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

  async importSeasonCircuits(year: number) {
  const races = await this.jolpicaClient.getSeasonRaces(year);

  const circuits = new Map(
    races.map(({ Circuit }) => [Circuit.circuitId, Circuit]),
  );

  for (const circuit of circuits.values()) {
    const latitude = Number(circuit.Location.lat);
    const longitude = Number(circuit.Location.long);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error(
        `Invalid coordinates for circuit: ${circuit.circuitId}`,
      );
    }
    await this.prisma.circuit.upsert({
      where: {
        circuitRef: circuit.circuitId,
      },
      create: {
        circuitRef: circuit.circuitId,
        name: circuit.circuitName,
        location: circuit.Location.locality,
        country: circuit.Location.country,
        latitude: latitude,
        longitude: longitude,
        altitude: null,
        url: circuit.url,
      },
      update: {
        name: circuit.circuitName,
        location: circuit.Location.locality,
        country: circuit.Location.country,
        latitude: latitude,
        longitude: longitude,
        url: circuit.url,
      },
    });
  }

  return {
    year,
    totalCircuits: circuits.size,
  };
}
}

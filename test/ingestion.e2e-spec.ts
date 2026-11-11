import { jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { IngestionService } from '../src/ingestion/ingestion.service';
import { JolpicaClient } from '../src/ingestion/jolpica.client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Ingestion (e2e)', () => {
  let app: INestApplication;
  let ingestionService: IngestionService;
  let prisma: PrismaService;

  const circuitRef = 'ingestion-e2e-test-circuit';
  const getSeasonRaces = jest.fn<() => Promise<unknown[]>>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JolpicaClient)
      .useValue({ getSeasonRaces })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    ingestionService = app.get(IngestionService);
    prisma = app.get(PrismaService);

    await prisma.circuit.deleteMany({
      where: { circuitRef },
    });
  });

  it('should import circuits and update existing records without duplicates', async () => {
    getSeasonRaces.mockResolvedValueOnce([
      {
        Circuit: {
          circuitId: circuitRef,
          circuitName: 'Test Circuit',
          Location: {
            country: 'Mexico',
            lat: '19.4326',
            locality: 'Mexico City',
            long: '-99.1332',
          },
          url: 'https://example.com/circuit',
        },
      },
      {
        Circuit: {
          circuitId: circuitRef,
          circuitName: 'Test Circuit',
          Location: {
            country: 'Mexico',
            lat: '19.4326',
            locality: 'Mexico City',
            long: '-99.1332',
          },
          url: 'https://example.com/circuit',
        },
      },
    ]);

    const firstImport = await ingestionService.importSeasonCircuits(2024);

    expect(firstImport.totalCircuits).toBe(1);

    let circuit = await prisma.circuit.findUnique({
      where: { circuitRef },
    });

    expect(circuit?.name).toBe('Test Circuit');

    getSeasonRaces.mockResolvedValueOnce([
      {
        Circuit: {
          circuitId: circuitRef,
          circuitName: 'Updated Test Circuit',
          Location: {
            country: 'Mexico',
            lat: '19.4326',
            locality: 'Mexico City',
            long: '-99.1332',
          },
          url: 'https://example.com/updated-circuit',
        },
      },
    ]);

    const secondImport = await ingestionService.importSeasonCircuits(2024);

    expect(secondImport.totalCircuits).toBe(1);

    circuit = await prisma.circuit.findUnique({
      where: { circuitRef },
    });

    expect(circuit?.name).toBe('Updated Test Circuit');
    expect(circuit?.url).toBe('https://example.com/updated-circuit');

    const count = await prisma.circuit.count({
      where: { circuitRef },
    });

    expect(count).toBe(1);
  });

  afterAll(async () => {
    await prisma.circuit.deleteMany({
      where: { circuitRef },
    });

    await app.close();
  });
});

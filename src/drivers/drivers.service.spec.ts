import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriversService } from './drivers.service';
import { FindDriversDto } from './dto/find-drivers.dto';

describe('DriversService', () => {
  let service: DriversService;

  const findManyMock = jest.fn();
  const findUniqueMock = jest.fn();
  const countMock = jest.fn();

  const prismaMock = {
    driver: {
      findMany: findManyMock,
      findUnique: findUniqueMock,
      count: countMock,
    },
  } as unknown as PrismaService;

  const driver = {
    id: 1,
    driverRef: 'max_verstappen',
    code: 'VER',
    firstName: 'Max',
    lastName: 'Verstappen',
    nationality: 'Dutch',
    dateOfBirth: new Date('1997-09-30T00:00:00.000Z'),
    url: null,
  }

  beforeEach(() => {
    findManyMock.mockReset();
    findUniqueMock.mockReset();
    countMock.mockReset();
    service = new DriversService(prismaMock);
  });

  describe('findAll', () => {
    it('should return paginated drivers', async () => {
      const query: FindDriversDto = {
        page: 1,
        limit: 20,
      };

      findManyMock.mockImplementation(async () => [driver]);
      countMock.mockImplementation(async () => 1);

      await expect(service.findAll(query)).resolves.toEqual({
        data: [driver],
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      });

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a driver by ID', async () => {
      findUniqueMock.mockImplementation(async () => driver);

      await expect(service.findOne(1)).resolves.toEqual(driver);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });


    it('should throw NotFoundException when the driver does not exist', async () => {
      findUniqueMock.mockImplementation(async () => null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

    });
  });

});

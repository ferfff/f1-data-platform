import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriversService } from './drivers.service';

describe('DriversService', () => {
  let service: DriversService;

  const findManyMock = jest.fn();
  const findUniqueMock = jest.fn();

  const prismaMock = {
    driver: {
      findMany: findManyMock,
      findUnique: findUniqueMock,
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
    service = new DriversService(prismaMock);
  });

  describe('findAll', () => {
    it('should return all drivers ordered by last name and first name', async () => {
      findManyMock.mockImplementation(async () => [driver]);

      await expect(service.findAll()).resolves.toEqual([driver]);

      expect(findManyMock).toHaveBeenCalledWith({
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ]
      });
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

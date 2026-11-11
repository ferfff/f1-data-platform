import { jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { ConstructorsService } from './constructors.service';
import { NotFoundException } from '@nestjs/common';

describe('ConstructorsService', () => {
  let service: ConstructorsService;

  const findManyMock = jest.fn();
  const findUniqueMock = jest.fn();
  const countMock = jest.fn();
  
  const prismaMock = {
      f1Constructor: {
        findMany: findManyMock,
        findUnique: findUniqueMock,
        count: countMock,
      },
  } as unknown as PrismaService;

  const constructorData = {
    id: 1,
    constructorRef: 'red_bull',
    name: 'Red Bull',
    nationality: 'Austrian',
    url: null,
  };

  beforeEach(async () => {
    findManyMock.mockReset();
    findUniqueMock.mockReset();
    countMock.mockReset();

    service = new ConstructorsService(prismaMock);
  });

  it('findAll should return paginated constructors', async () => {
    findManyMock.mockResolvedValue([constructorData]);
    countMock.mockResolvedValue(1);

    const query = { search: '', page: 1, limit: 10 };
    const result = await service.findAll(query);
    expect(result).toEqual([constructorData]);
    expect(result).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('findOne should return a constructor by ID', async () => {
    findUniqueMock.mockResolvedValue(constructorData);
    const result = await service.findOne(1);
    expect(result).toEqual(constructorData);
  }); 

  it('findOne should throw NotFoundException for non-existing ID', async () => {
    findUniqueMock.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

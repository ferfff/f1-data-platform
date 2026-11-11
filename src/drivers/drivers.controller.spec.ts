import { jest } from '@jest/globals';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { FindDriversDto } from './dto/find-drivers.dto';

describe('DriversController', () => {
  let controller: DriversController;

  const findAllMock = jest.fn();
  const findOneMock = jest.fn();

  const driversServiceMock = {
    findAll: findAllMock,
    findOne: findOneMock,
  } as unknown as DriversService;

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
    findAllMock.mockReset();
    findOneMock.mockReset();
    controller = new DriversController(driversServiceMock);
  });

   describe('findAll', () => {
    it('should return paginated drivers from the service', async () => {
      const query: FindDriversDto = {
        page: 1,
        limit: 20,
      };

      const response = {
        data: [driver],
        meta: {
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };

      findAllMock.mockImplementation(async () => response);

      await expect(controller.findAll(query)).resolves.toEqual(response);

      expect(findAllMock).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return the requested driver from the service', async () => {
      findOneMock.mockImplementation(async () => driver);

      await expect(controller.findOne(1)).resolves.toEqual(driver);

      expect(findOneMock).toHaveBeenCalledWith(1);
    });
  });
});

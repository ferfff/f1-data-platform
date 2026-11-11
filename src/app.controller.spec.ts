import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const appServiceMock = {
    getHealth: jest.fn().mockImplementation(async () => ({
      status: 'OK',
      database: 'CONNECTED',
      service: 'f1-data-platform',
      timestamp: '2026-11-11T00:00:00.000Z',
    })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return the health status', async () => {
    await expect(appController.checkHealth()).resolves.toEqual({
      status: 'OK',
      database: 'CONNECTED',
      service: 'f1-data-platform',
      timestamp: '2026-11-11T00:00:00.000Z',
    });
  });
});
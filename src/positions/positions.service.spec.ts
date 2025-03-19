import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('PositionsService', () => {
  let service: PositionsService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('debería lanzar un error si la respuesta no contiene posiciones', async () => {
    mockHttpService.get.mockReturnValue(of({ data: {} }));

    await expect(service.getPositions()).rejects.toThrow(
      new HttpException('Invalid positions response', HttpStatus.BAD_GATEWAY),
    );
  });

  it('debería lanzar un error si hay un problema de red', async () => {
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error('Network Error')),
    );

    await expect(service.getPositions()).rejects.toThrow(
      new HttpException('Failed to fetch positions', HttpStatus.BAD_GATEWAY),
    );
  });
});

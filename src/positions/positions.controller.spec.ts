import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

const mockPositionsService = {
  getPositions: jest.fn(() => Promise.resolve([{ id: 1, name: 'Manager' }]))
};

describe('PositionsController', () => {
  let controller: PositionsController;
  let service: PositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [{ provide: PositionsService, useValue: mockPositionsService }],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    service = module.get<PositionsService>(PositionsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería llamar a getPositions y retornar la lista de posiciones', async () => {
    const result = await controller.getPositions();
    expect(service.getPositions).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, name: 'Manager' }]);
  });
});
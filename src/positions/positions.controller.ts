import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('positions')
@ApiTags('Positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las posiciones' })
  @ApiResponse({ status: 200, description: 'Lista de posiciones obtenida con éxito' })
  async getPositions() {
    return this.positionsService.getPositions();
  }
}
  
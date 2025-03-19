import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PositionsService {
  private readonly apiUrl: string;
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl = this.configService.get<string>('API_URL_POSITIONS') || '';
  }

  async getPositions(): Promise<string[]> {
    try {
      const response = await firstValueFrom(this.httpService.get(this.apiUrl));
  
      if (!response.data || !Array.isArray(response.data.positions)) {
        this.logger.error('Invalid positions response', {
          data: response.data,
        });
        throw new HttpException('Invalid positions response', HttpStatus.BAD_GATEWAY);
      }
  
      return response.data.positions;
    } catch (error) {
      this.logger.error('Failed to fetch positions', error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
  
      throw new HttpException('Failed to fetch positions', HttpStatus.BAD_GATEWAY);
    }
  }
}

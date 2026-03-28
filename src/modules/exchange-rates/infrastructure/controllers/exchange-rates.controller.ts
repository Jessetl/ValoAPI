import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../../../shared-kernel/infrastructure/decorators/public.decorator';
import { GetCurrentExchangeRateUseCase } from '../../application/use-cases/get-current-exchange-rate.use-case';
import { ExchangeRateResponseDto } from '../../application/dtos/exchange-rate-response.dto';

@ApiTags('Exchange Rates')
@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(
    private readonly getCurrentExchangeRate: GetCurrentExchangeRateUseCase,
  ) {}

  @Public()
  @Get('current')
  @ApiOperation({ summary: 'Obtener tasa de cambio VES/USD vigente' })
  @ApiResponse({
    status: 200,
    description: 'Tasa de cambio actual',
    type: ExchangeRateResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio de tasa de cambio no disponible',
  })
  async getCurrent() {
    return this.getCurrentExchangeRate.execute();
  }
}

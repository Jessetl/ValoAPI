import { Controller, Get } from '@nestjs/common';
import { Public } from './shared-kernel/infrastructure/decorators/public.decorator';

@Controller('health')
export class AppController {
  @Get()
  @Public()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

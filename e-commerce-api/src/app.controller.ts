import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators';

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOkResponse({ description: 'Liveness check.' })
  getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }
}

import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  // SetMetadata,
  // UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
// import { PermissionsGuard } from 'src/auth/permissions.guard';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:events'])
  @Get('/:game_id')
  async getEventsByGame(@Param('game_id') game_id: string) {
    try {
      const events = await this.eventService.getEventsByGame(Number(game_id));

      if (!events) {
        throw new NotFoundException(`Events not found`);
      }

      return JSON.stringify({
        message: `${events.length} events founded`,
        events,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}

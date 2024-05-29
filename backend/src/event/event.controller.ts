import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Param,
  // SetMetadata,
  // UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { RegisterPlayerDto } from './dto/register-player.dto';
// import { PermissionsGuard } from 'src/auth/permissions.guard';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:events'])
  @Get('')
  async getEvents() {
    try {
      const events = await this.eventService.getEvents();

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

  @Patch('/events_closing')
  async eventsClosing(): Promise<string> {
    try {
      const events = await this.eventService.closeEvents();

      if (!events) {
        throw new NotFoundException(`Events not found`);
      }

      return JSON.stringify({
        message: `Events closed`,
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

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:events'])
  @Get('/details/:event_id')
  async getEventById(@Param('event_id') event_id: string) {
    try {
      const event = await this.eventService.getEventById(Number(event_id));

      if (!event) {
        throw new NotFoundException(`Events not found`);
      }

      return JSON.stringify({
        message: `Event ${event_id} founded`,
        event,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:events'])
  @Post()
  async createEvent(@Body() newEvent: CreateEventDto): Promise<string> {
    try {
      if (newEvent.end_date < newEvent.start_date) {
        throw new BadRequestException(
          'The start date of the event must be prior to or equal to the end date',
        );
      }

      if (new Date(newEvent.start_date) < new Date()) {
        throw new BadRequestException(
          'The start date of the event must be in the future.',
        );
      }

      const event = await this.eventService.createEvent(newEvent);

      if (!event) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Event ${event.id} created`,
        event,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:events'])
  @Post('register')
  async registerPlayer(
    @Body() event_player: RegisterPlayerDto,
  ): Promise<string> {
    try {
      const player_event = await this.eventService.registerPlayer(event_player);

      if (player_event && typeof player_event == 'string') {
        throw new BadRequestException(player_event);
      }

      return JSON.stringify({
        message: `Player ${event_player.player_id} registered for the event ${event_player.event_id}`,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:events'])
  @Patch('/:event_id')
  async upgradeEvent(
    @Param('event_id') event_id: string,
    @Body() upgradeEvent: EditEventDto,
  ): Promise<string> {
    try {
      const event = await this.eventService.getEventById(Number(event_id));

      if (!event) {
        throw new NotFoundException(`Event ${event_id} not found`);
      }

      if (upgradeEvent.start_date > upgradeEvent.end_date) {
        throw new BadRequestException(
          `The start date can only be earlier than the end date`,
        );
      }

      const currentEvent = await this.eventService.upgradeEvent(
        upgradeEvent,
        event,
      );

      return JSON.stringify({
        message: `Event ${event_id} upgraded`,
        upgradeEvent: currentEvent,
        event,
      });
    } catch (exception) {}
    return null;
  }
}

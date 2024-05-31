import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FundraisingService } from '../fundraising/fundraising.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { Event } from './event.entity';
// import { Fundraising } from 'src/fundraising/fundraising.entity';
import { Cron } from '@nestjs/schedule';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { SetFinalPositionDto } from './dto/set-final-position.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private fundraisingService: FundraisingService) {}

  async getEvents() {
    return await this.prisma.event.findMany({
      where: {},
      include: { game: true },
    });
  }
  async getEventsByGame(game_id: number) {
    return await this.prisma.event.findMany({
      where: {
        game_id,
      },
    });
  }

  async getEventById(event_id: number) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: event_id,
      },
      include: {
        game: true,
        player_event: {
          include: { player: { include: { user: true, rank: true } } },
        },
      },
    });

    return event ? Event.fromObject(event) : null;
  }

  async registerPlayer(event_player: RegisterPlayerDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    const currentPlayers = await this.prisma.player_event.count({
      where: { event_id: event.id },
    });

    if (currentPlayers >= event.max_players) {
      return `The event has reached the limit of registered players`;
    }

    const isAlreadyRegistered = await this.prisma.player_event.count({
      where: { event_id: event.id, player_id: event_player.player_id },
    });

    if (isAlreadyRegistered > 0) {
      return `The player is already registered on this event`;
    }

    const player_event = await this.prisma.player_event.create({
      data: {
        event_id: event_player.event_id,
        player_id: event_player.player_id,
      },
    });

    return player_event ? player_event : null;
  }

  async unregisterPlayer(event_player: RegisterPlayerDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    if (new Date() >= event.start_date) {
      return `A player cannot be removed from an event that has already started.`;
    }

    const player_event = await this.prisma.player_event.delete({
      where: {
        player_id_event_id: {
          player_id: event_player.player_id,
          event_id: event_player.event_id,
        },
      },
    });

    return player_event ? player_event : null;
  }

  async setFinalPosition(event_player: SetFinalPositionDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    if (event_player.position > event.max_players) {
      return `Position between 1 and ${event.max_players} expected`;
    }

    const already_used = await this.prisma.player_event.count({
      where: {
        event_id: event_player.event_id,
        position: event_player.position,
      },
    });

    if (already_used > 0) {
      return `Position ${event_player.position} is already used on other player`;
    }

    const player_event = await this.prisma.player_event.update({
      where: {
        player_id_event_id: {
          player_id: event_player.player_id,
          event_id: event_player.event_id,
        },
      },
      data: { position: event_player.position },
    });

    return player_event ? player_event : null;
  }

  async closeEvents() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const events = await this.prisma.event.findMany({
      where: {
        start_date: {
          gte: date,
        },
      },
    });

    if (!events) {
      return null;
    }

    events.map(async (event) => {
      Event.fromObject(event);
      await this.prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          active: false,
        },
      });


      await this.fundraisingService.closeFundraisings(event.id)
    });

    return events.map((event) => Event.fromObject(event));
  }

  // Se ejecuta todos los días a las 00:00
  @Cron('0 0 * * *')
  async handleCron() {
    await this.closeEvents();
  }

  // @Cron('*/20 * * * * *')
  // async handleCron() {
  //   await this.closeEvents();
  // }

  /*
  async closeExpiredEvents(): Promise<void> {
    const now = new Date();
    const expiredEvents = await this.eventRepository.find({
      where: { endDate: LessThan(now), isClosed: false },
    });

    for (const event of expiredEvents) {
      event.isClosed = true;
      await this.eventRepository.save(event);
    }
  }
  */

  async createEvent(newEvent: CreateEventDto) {
    const { name, prize, game_id, max_players, start_date, end_date } =
      newEvent;

    const event = await this.prisma.event.create({
      data: {
        name,
        prize,
        game_id,
        max_players,
        start_date,
        end_date,
      },
    });

    return event ? Event.fromObject(event) : null;
  }

  async upgradeEvent(editEvent: EditEventDto, currentEvent?: Event) {
    const event = await this.prisma.event.update({
      where: { id: currentEvent.id },
      data: {
        end_date: editEvent.end_date,
        start_date: editEvent.start_date,
      },
    });

    return event ? Event.fromObject(event) : null;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

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
    });

    return event ? Event.fromObject(event) : null;
  }

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

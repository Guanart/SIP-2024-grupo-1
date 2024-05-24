import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { Event } from './event.entity';
import { Fundraising } from 'src/fundraising/fundraising.entity';
import { Cron } from '@nestjs/schedule';

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

  

  async closeEvents(){
    const date0= new Date();
    const date1= new Date();
    date0.setHours(0, 0, 0, 0);
    date1.setHours(23, 59, 59, 999);
    const events = await this.prisma.event.findMany({
      where: {
        start_date: {
          gte: date0,
          lt: date1,
        }
      }
    });
    events.map(async (event) => {
      Event.fromObject(event);
      await this.prisma.event.update({
        where: {
          id: event.id
        },
        data: {
          active: false
        }
      });
    } 
    );
    if (events && events.length > 0) {
      return events.map(event => Event.fromObject(event));
    } else {
      return null;
    }
  }

  async crearEventoPrueba() {
    const event = await this.prisma.event.create({
      data: {
        start_date: new Date(),
        end_date: new Date(),
        max_players: 4,
        prize: 999999,
        name: 'EventoPrueba1',
        game_id: 1,
      },
    });
  }

  // Se ejecuta todos los días a las 00:00
  @Cron('0 0 * * *')
  async handleCron() {
    await this.closeEvents();
  }

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

  async createEvent(newEvent: CreateEventDto){
    const {
      name,
      prize,
      game_id,
      max_players,
      start_date,
      end_date
    } = newEvent;

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


import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getEventsByGame(game_id: number) {
    return await this.prisma.event.findMany({
      where: {
        game_id,
      },
    });
  }
}

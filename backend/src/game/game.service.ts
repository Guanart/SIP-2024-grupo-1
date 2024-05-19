import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, icon: string) {
    const game = await this.prisma.game.create({
      data: {
        name,
        icon,
      },
    });

    return game ? Game.fromObject(game) : null;
  }

  async delete(game_id: number) {
    const game = await this.prisma.game.delete({
      where: { id: game_id },
    });

    return game ? Game.fromObject(game) : null;
  }

  async findOne(game_id: number): Promise<Game> {
    const game = await this.prisma.game.findUnique({
      where: {
        id: game_id,
      },
    });
    return game ? Game.fromObject(game) : null;
  }

  async getAllGames(): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      where: {},
    });
    return games.map((game) => Game.fromObject(game));
  }
}

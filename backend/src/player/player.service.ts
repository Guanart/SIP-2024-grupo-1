import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async update({ player_id, biography }: UpdatePlayerDto): Promise<Player> {
    const updatedUser = await this.prisma.player.update({
      where: {
        id: player_id,
      },
      data: { biography },
    });

    return updatedUser ? Player.fromObject(updatedUser) : null;
  }
}

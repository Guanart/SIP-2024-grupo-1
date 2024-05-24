import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async update({ player_id, biography }: UpdatePlayerDto): Promise<Player> {
    const updatedPlayer = await this.prisma.player.update({
      where: {
        id: player_id,
      },
      data: { biography },
    });

    console.log('update: ' + JSON.stringify(updatedPlayer));
    return updatedPlayer ? Player.fromObject(updatedPlayer) : null;
  }
}

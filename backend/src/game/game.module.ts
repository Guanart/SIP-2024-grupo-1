import { Module } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from '../database/prisma.service';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameService, PrismaService, TokenService],
})
export class GameModule {}

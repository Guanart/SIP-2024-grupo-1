import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GameService } from 'src/game/game.service';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, PrismaService],
})
export class GameModule {}

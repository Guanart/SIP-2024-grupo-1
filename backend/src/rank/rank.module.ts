import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RankService } from 'src/rank/rank.service';
import { RankController } from './rank.controller';

@Module({
  imports: [],
  controllers: [RankController],
  providers: [RankService, PrismaService],
})
export class RankModule {}

import { Module } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from '../database/prisma.service';
import { RankService } from 'src/rank/rank.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RankService, PrismaService, TokenService],
})
export class RankModule {}

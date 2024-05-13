import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/database/prisma.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [PlayerController],
  providers: [PrismaService, PlayerService],
})
export class PlayerModule {}

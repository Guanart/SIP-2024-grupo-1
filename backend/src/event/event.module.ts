import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [EventController],
  providers: [EventService, PrismaService],
})
export class EventModule {}

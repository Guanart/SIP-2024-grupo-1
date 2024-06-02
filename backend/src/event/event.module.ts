import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FundraisingService } from 'src/fundraising/fundraising.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { CollectionService } from 'src/collection/collection.service';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [EventController],
  providers: [
    EventService,
    PrismaService,
    FundraisingService,
    MercadoPagoService,
    CollectionService,
    TokenService,
  ],
})
export class EventModule {}

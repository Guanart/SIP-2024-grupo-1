import { Module } from '@nestjs/common';
import { FundraisingService } from './fundraising.service';
import { FundraisingController } from './fundraising.controller';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
  controllers: [FundraisingController],
  providers: [FundraisingService, MercadoPagoService, PrismaService],
})
export class FundraisingModule {}

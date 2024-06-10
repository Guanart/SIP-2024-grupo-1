import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mercado-pago.controller';
import { MercadoPagoService } from './mercado-pago.service';
import { PrismaService } from 'src/database/prisma.service';
import { FundraisingModule } from 'src/fundraising/fundraising.module';

@Module({
  imports: [FundraisingModule],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService, PrismaService],
  exports: [MercadoPagoService]
})

export class MercadoPagoModule {}
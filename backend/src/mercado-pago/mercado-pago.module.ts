import { Module } from '@nestjs/common';
import { MercadoPagoController } from './mercado-pago.controller';
import { MercadoPagoService } from './mercado-pago.service';

@Module({
  imports: [],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService]
})

export class MercadoPagoModule {}
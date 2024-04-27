import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreference } from './create-preference.dto';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  // Esto no se usará, se definirán rutas en Fundrising y Marketplace
  @Post('create-preference')
  async createPreference(@Body() items: CreatePreference) {
    return this.mercadoPagoService.createPreference(items);
  }
}

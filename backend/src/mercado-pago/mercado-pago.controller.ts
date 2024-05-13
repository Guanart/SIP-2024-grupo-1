import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreference } from './create-preference.dto';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) { }

  // Esto no se usará, se definirán rutas en Fundrising y Marketplace
  @Post('create-preference')
  async createPreference(@Body() body: CreatePreference) {
    return this.mercadoPagoService.createPreference(body);
  }

  @Post('webhook')
  async handleWebhook(@Body() notification: any) {
    return this.mercadoPagoService.handleWebhook(notification);
  }

  @Get('oauth')
  async authorizeSeller(@Query('code') code: string) {
    return this.mercadoPagoService.authorizeSeller(code);
  }

  @Get('feedback')
  async returnFeedback(@Query() params: any) {
    return this.mercadoPagoService.returnFeedback(params);
  }
}

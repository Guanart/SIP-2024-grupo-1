import { Controller, Post, Body, Get, Query, Param, Res } from '@nestjs/common';
import { PermissionsGuard } from '../auth/permissions.guard';
import { AuthGuard } from '../auth/auth.guard';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreference } from './create-preference.dto';
import { Redirect } from '@nestjs/common';

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

  // Cuando el usuario no autorizar y selecciona "por ahora no", es redireccionado a /mercado-pago/oauth?error=access_denied
  @Redirect()
  @Get('oauth')
  async authorizeSeller(@Query('code') code: string, @Query('error') error: string, @Query('state') state: string) {
    const [type, id] = state.split('-');
    
    if (error) {
      return { url: `${process.env.REACT_APP_URL}/${type}`, statusCode: 302, status: 'error'};
    }

    this.mercadoPagoService.authorizeSeller(code, type, id);
    return { url: `${process.env.REACT_APP_URL}/${type}`, statusCode: 302, status: 'ok' };
  }

  @Get('feedback')
  async returnFeedback(@Query() params: any) {
    return this.mercadoPagoService.returnFeedback(params);
  }
}

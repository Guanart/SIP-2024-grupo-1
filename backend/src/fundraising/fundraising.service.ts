import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';

@Injectable()
export class FundraisingService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  async getAllFundraisings() {
    return await this.prisma.fundraising.findMany({
      where: {
        active: true,
      },
      include: {
        collection: true,
        event: true,
        player: true,
      },
    });
  }

  async getFundraisingById(id: number) {
    return await this.prisma.fundraising.findUnique({
      where: { id, active: true },
      include: {
        collection: true,
        event: true,
        player: true,
      },
    });
  }

  // async generateMercadoPagoPreference(collectionId: number, amount: number) {
  //     const preferenceId = await this.mercadoPagoService.createPreference(collectionId, amount);
  //     return 'PREFERENCE_ID';
  // }
}

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
    return this.prisma.fundraising.findMany({
      include: {
        Collection: true,
      },
    });
  }

  async getFundraisingById(id: number) {
    return this.prisma.fundraising.findUnique({
      where: { id },
      include: {
        Collection: true,
      },
    });
  }

  // async generateMercadoPagoPreference(collectionId: number, amount: number) {
  //     const preferenceId = await this.mercadoPagoService.createPreference(collectionId, amount);
  //     return 'PREFERENCE_ID';
  // }
}

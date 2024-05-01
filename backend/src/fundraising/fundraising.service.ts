import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { CreateFundraisingDto } from './dto/create-fundraising.dto';
import { Fundraising } from './fundraising.entity';

@Injectable()
export class FundraisingService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  async createFundraising(newFundraising: CreateFundraisingDto) {
    const { goal_amount, prize_percentage, player_id, event_id } =
      newFundraising;

    const fundraising = await this.prisma.fundraising.create({
      data: {
        goal_amount,
        prize_percentage,
        player_id,
        event_id,
      },
    });

    return fundraising ? Fundraising.fromObject(fundraising) : null;
  }

  async getAllFundraisings() {
    return await this.prisma.fundraising.findMany({
      where: {
        active: true,
      },
      include: {
        collection: true,
        event: true,
        player: {
          include: { user: true, game: true },
        },
      },
    });
  }

  async getFundraisingById(id: number) {
    return await this.prisma.fundraising.findUnique({
      where: { id, active: true },
      include: {
        collection: true,
        event: true,
        player: {
          include: { user: true, game: true },
        },
      },
    });
  }

  // async generateMercadoPagoPreference(collectionId: number, amount: number) {
  //     const preferenceId = await this.mercadoPagoService.createPreference(collectionId, amount);
  //     return 'PREFERENCE_ID';
  // }
}

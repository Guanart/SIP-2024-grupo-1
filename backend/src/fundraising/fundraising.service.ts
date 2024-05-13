import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import { CreateFundraisingDto } from './dto/create-fundraising.dto';
import { Fundraising } from './fundraising.entity';
import { CollectionService } from '../collection/collection.service';
import { UpdateFundraisingDto } from './dto/update-fundraising.dto';

@Injectable()
export class FundraisingService {
  constructor(
    private prisma: PrismaService,
    private mercadoPagoService: MercadoPagoService,
    private collectionService: CollectionService,
  ) {}

  async createFundraising(newFundraising: CreateFundraisingDto) {
    const {
      goal_amount,
      prize_percentage,
      player_id,
      event_id,
      initial_price,
    } = newFundraising;

    // No permite crear una colecta si el jugador ya tiene una colecta activa en este momento
    // const activeFundraising = await this.prisma.fundraising.findMany({
    //   where: {
    //     player_id,
    //     active: true,
    //   },
    // });

    // if (activeFundraising.length > 0) {
    //   return null;
    // }

    const fundraising = await this.prisma.fundraising.create({
      data: {
        goal_amount,
        prize_percentage,
        player_id,
        event_id,
      },
    });

    await this.collectionService.create(
      goal_amount,
      prize_percentage,
      initial_price,
      fundraising.id,
    );

    return fundraising ? Fundraising.fromObject(fundraising) : null;
  }

  async getAllFundraisings() {
    const fundraisings = await this.prisma.fundraising.findMany({
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

    return fundraisings
      ? fundraisings.map((fundraising) => Fundraising.fromObject(fundraising))
      : null;
  }

  async getFundraisingById(id: number) {
    const fundraising = await this.prisma.fundraising.findUnique({
      where: { id, active: true },
      include: {
        collection: true,
        event: true,
        player: {
          include: { user: true, game: true },
        },
      },
    });

    return fundraising ? Fundraising.fromObject(fundraising) : null;
  }

  async updateFundraising(
    updatedFundraising: UpdateFundraisingDto,
    currentFundraising?: Fundraising,
  ) {
    const fundraising = await this.prisma.fundraising.update({
      where: { id: currentFundraising.id },
      data: {
        goal_amount: updatedFundraising.goal_amount,
      },
    });

    const collection = await this.collectionService.update(
      updatedFundraising.goal_amount,
      updatedFundraising.initial_price,
      fundraising,
    );

    if (!collection) return null;

    return fundraising ? Fundraising.fromObject(fundraising) : null;
  }

  // async generateMercadoPagoPreference(collectionId: number, amount: number) {
  //     const preferenceId = await this.mercadoPagoService.createPreference(collectionId, amount);
  //     return 'PREFERENCE_ID';
  // }
}

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

    // No permite crear una colecta si el jugador ya tiene una colecta activa para el mismo evento
    const activeFundraising = await this.prisma.fundraising.findMany({
      where: {
        player_id,
        active: true,
        event_id: newFundraising.event_id,
      },
    });

    if (activeFundraising.length > 0) {
      return 'A player can only have one collection active for an event.';
    }

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
          include: { user: true, game: true, rank: true },
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
          // PROBLEMA DE SEGURIDAD: se envía el access_token del player al frontend (excluirlo con select: {})
          include: { user: true, game: true, rank: true },
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

  async getWinnerFundraising(player_id: number, event_id: number) {
    const fundraising = await this.prisma.fundraising.findMany({
      where: {
        player_id: player_id,
        event_id: event_id,
      },
      include: { collection: true, event: true },
    });

    return fundraising;
  }

  async closeFundraisings(event_id: number) {
    // Obtiene las fundraisings que pueden requerir revalorización de su token
    const fundraisings = await this.prisma.fundraising.findMany({
      where: { event_id: event_id, active: true },
      include: { collection: true, event: { include: { player_event: true } } },
    });

    fundraisings.map(async (fundraising) => {
      const player = fundraising.player_id;
      const registeredPlayers = fundraising.event.player_event.filter(
        ({ player_id }) => player_id === player,
      );
      const isRegistered = registeredPlayers.length === 1;

      if (!isRegistered) {
        fundraising.prize_percentage = 0.0;
        await this.prisma.fundraising.update({
          where: {
            id: fundraising.id,
          },
          data: {
            prize_percentage: 0.0,
          },
        });
      }

      await this.collectionService.destroySurplusTokens(fundraising);
    });

    await this.prisma.fundraising.updateMany({
      where: { event_id: event_id },
      data: {
        active: false,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import { CreateFundraisingDto } from './dto/create-fundraising.dto';
import { Fundraising } from './fundraising.entity';
import { CollectionService } from '../collection/collection.service';
import { UpdateFundraisingDto } from './dto/update-fundraising.dto';
import { Cron } from '@nestjs/schedule';

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
    const activeFundraising = await this.prisma.fundraising.findMany({
      where: {
        player_id,
        active: true,
      },
    });

    if (activeFundraising.length > 0) {
      return null;
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
          // PROBLEMA DE SEGURIDAD: se envía el access_token del player al frontend (excluirlo con select: {})
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

  async checkFinishedEvents() {
    const date = new Date();
    date.setHours(23, 59, 59, 999);

    // Obtengo eventos finalizados (fecha fin <= fecha actual)
    const events = await this.prisma.event.findMany({
      where: {
        end_date: {
          lte: date,
        },
      },
    });

    events.map(async (event) => {
      // Descarto aquellos eventos que ya hayan pasado por este proceso (checked === true)
      if (event.checked) return;

      // Verifico que administrador/a haya cargado las posiciones finales (todos los jugadores inscriptos position != 0)
      const registeredPlayers = await this.prisma.player_event.findMany({
        where: {
          event_id: event.id,
        },
      });

      const positionsUpdated = registeredPlayers.every(
        (player) => player.position !== 0,
      );

      // Si no se actualizaron las posiciones finales en el evento, no se puede repartir premios
      if (!positionsUpdated) return;

      // Obtengo datos del ganador del evento
      const winner = await this.prisma.player_event.findMany({
        where: { position: 1 },
      });

      // Verifico si el ganador había iniciado una colecta para el evento
      const fundraising = await this.prisma.fundraising.findMany({
        where: {
          player_id: winner[0].player_id,
          event_id: winner[0].event_id,
        },
        include: { collection: true, event: true },
      });

      // Si no inició colecta, no hay que repartir premios
      if (!fundraising) return;

      // Busco los datos de los usuarios que poseen tokens de la colecta iniciada por el ganador
      const usersWithTokens = await this.prisma.token.findMany({
        where: {
          collection_id: fundraising[0].collection.id,
          token_wallet: {
            some: {},
          },
        },
        include: { token_wallet: true },
      });

      const tokenCountByWallet = {};

      // Itera sobre el array original y actualiza los conteos en el objeto
      usersWithTokens.forEach(({ token_wallet }) => {
        if (token_wallet.length > 0) {
          const { wallet_id } = token_wallet[0];
          if (!tokenCountByWallet[wallet_id]) {
            tokenCountByWallet[wallet_id] = 1;
          } else {
            tokenCountByWallet[wallet_id]++;
          }
        }
      });

      // Calculo el premio $ por token
      const token_reward =
        fundraising[0].collection.token_prize_percentage *
        fundraising[0].event.prize;

      //? Este array contiene un objeto por cada wallet que compro tokens en la colecta
      const amountOfMoneyPerWallet = Object.keys(tokenCountByWallet).map(
        (wallet_id) => ({
          wallet_id: Number(wallet_id),
          total: tokenCountByWallet[wallet_id] * token_reward, // Calculo el total de $ que hay que entregar a cada usuario comprador
        }),
      );

      console.log(amountOfMoneyPerWallet);
      // TODO: Implementar entrega de premios con MP?
      //? Usando los datos de "amountOfMoneyPerWallet" se puede saber cuanto $ (total) se tiene que dar a cada wallet (wallet_id)
    });
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

  // Se ejecuta todos los días a las 00:00
  @Cron('0 0 * * *')
  async handleCron() {
    await this.checkFinishedEvents();
  }
}

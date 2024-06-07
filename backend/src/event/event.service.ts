import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FundraisingService } from '../fundraising/fundraising.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EditEventDto } from './dto/edit-event.dto';
import { Event } from './event.entity';
import { Cron } from '@nestjs/schedule';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { SetFinalPositionDto } from './dto/set-final-position.dto';
import { CollectionService } from 'src/collection/collection.service';

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private fundraisingService: FundraisingService,
    private collectionService: CollectionService,
  ) {}

  async getEvents() {
    return await this.prisma.event.findMany({
      where: {},
      include: { game: true },
    });
  }
  async getEventsByGame(game_id: number) {
    return await this.prisma.event.findMany({
      where: {
        game_id,
        active: true,
      },
    });
  }

  async getEventById(event_id: number) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: event_id,
      },
      include: {
        game: true,
        player_event: {
          include: { player: { include: { user: true, rank: true } } },
        },
      },
    });

    return event ? Event.fromObject(event) : null;
  }

  async registerPlayer(event_player: RegisterPlayerDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    const currentPlayers = await this.prisma.player_event.count({
      where: { event_id: event.id },
    });

    if (currentPlayers >= event.max_players) {
      return `The event has reached the limit of registered players`;
    }

    const isAlreadyRegistered = await this.prisma.player_event.count({
      where: { event_id: event.id, player_id: event_player.player_id },
    });

    if (isAlreadyRegistered > 0) {
      return `The player is already registered on this event`;
    }

    const player_event = await this.prisma.player_event.create({
      data: {
        event_id: event_player.event_id,
        player_id: event_player.player_id,
      },
    });

    return player_event ? player_event : null;
  }

  async unregisterPlayer(event_player: RegisterPlayerDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    if (new Date() >= event.start_date) {
      return `A player cannot be removed from an event that has already started.`;
    }

    const player_event = await this.prisma.player_event.delete({
      where: {
        player_id_event_id: {
          player_id: event_player.player_id,
          event_id: event_player.event_id,
        },
      },
    });

    return player_event ? player_event : null;
  }

  async setFinalPosition(event_player: SetFinalPositionDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: event_player.event_id },
    });

    if (event_player.position > event.max_players) {
      return `Position between 1 and ${event.max_players} expected`;
    }

    const already_used = await this.prisma.player_event.count({
      where: {
        event_id: event_player.event_id,
        position: event_player.position,
      },
    });

    if (already_used > 0) {
      return `Position ${event_player.position} is already used on other player`;
    }

    const player_event = await this.prisma.player_event.update({
      where: {
        player_id_event_id: {
          player_id: event_player.player_id,
          event_id: event_player.event_id,
        },
      },
      data: { position: event_player.position },
    });

    return player_event ? player_event : null;
  }

  async closeEvents() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const events = await this.prisma.event.findMany({
      where: {
        start_date: {
          gte: date,
        },
      },
    });

    if (!events) {
      return null;
    }

    events.map(async (event) => {
      Event.fromObject(event);
      await this.prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          active: false,
        },
      });

      await this.fundraisingService.closeFundraisings(event.id);
    });

    return events.map((event) => Event.fromObject(event));
  }

  async checkFinishedEvents() {
    const date = new Date();
    date.setHours(23, 59, 59, 999);

    // Obtengo eventos finalizados (fecha fin <= fecha actual)
    const events = await this.prisma.event.findMany({
      where: {
        end_date: {
          lte: date,
        },
        checked: false,
      },
    });

    events.map(async (event) => {
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
        where: { position: 1, event_id: event.id },
      });

      // Verifico si el ganador había iniciado una colecta para el evento

      const fundraising = await this.fundraisingService.getWinnerFundraising(
        winner[0].player_id,
        winner[0].event_id,
      );

      // Si no inició colecta, no hay que repartir premios
      if (!fundraising) return;

      // Busco los datos de los usuarios que poseen tokens de la colecta iniciada por el ganador
      const usersWithTokens = await this.collectionService.getUsersWithTokens(
        fundraising[0].collection.id,
      );

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

      console.log('Token_reward: ' + token_reward);
      //? Este array contiene un objeto por cada wallet que compro tokens en la colecta
      const amountOfMoneyPerWallet = Object.keys(tokenCountByWallet).map(
        (wallet_id) => ({
          wallet_id: Number(wallet_id),
          total: tokenCountByWallet[wallet_id] * token_reward, // Calculo el total de $ que hay que entregar a cada usuario comprador
        }),
      );

      await this.prisma.event.update({
        where: { id: event.id },
        data: {
          checked: true,
        },
      });

      console.log(amountOfMoneyPerWallet);
      //? Usando los datos de "amountOfMoneyPerWallet" se puede saber cuanto $ (total) se tiene que dar a cada wallet (wallet_id)
    });
  }

  // Se ejecuta todos los días a las 00:00
  @Cron('* * * * *') //* '0 0 * * *'
  async handleCron() {
    await this.closeEvents(); //? Cierra inscripciones de evento cuando fecha_inicio >= fecha_actual
    await this.checkFinishedEvents(); //? Checkea eventos finalizados para calcular los premios x token
  }

  async createEvent(newEvent: CreateEventDto) {
    const { name, prize, game_id, max_players, start_date, end_date } =
      newEvent;

    const event = await this.prisma.event.create({
      data: {
        name,
        prize,
        game_id,
        max_players,
        start_date,
        end_date,
      },
    });

    return event ? Event.fromObject(event) : null;
  }

  async upgradeEvent(editEvent: EditEventDto, currentEvent?: Event) {
    const event = await this.prisma.event.update({
      where: { id: currentEvent.id },
      data: {
        end_date: editEvent.end_date,
        start_date: editEvent.start_date,
      },
    });

    return event ? Event.fromObject(event) : null;
  }
}

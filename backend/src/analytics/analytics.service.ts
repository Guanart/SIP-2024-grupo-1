import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getRegisteredUsers() {
    const players = await this.prisma.player.count({ where: { active: true } });
    const users = await this.prisma.user.count({});

    return {
      players: players,
      users: users,
    };
  }

  async getPlayerWithMoreWins() {
    const player_event: {
      player_id: number;
      event_id: number;
      position: number;
    }[] = await this.prisma.player_event.findMany({
      where: { position: 1 },
    });

    if (!player_event) return null;

    const playerCount: { [key: number]: number } = {};

    player_event.forEach((event) => {
      const playerId = event.player_id;

      // Si el player_id ya existe en el contador, incrementamos su valor
      if (playerCount[playerId]) {
        playerCount[playerId]++;
      } else {
        // Si el player_id no existe en el contador, lo inicializamos a 1
        playerCount[playerId] = 1;
      }
    });

    // Encontrar el player_id con más victorias
    let maxPlayerId = null;
    let maxCount = 0;

    for (const [playerId, count] of Object.entries(playerCount)) {
      if (count > maxCount) {
        maxCount = count;
        maxPlayerId = playerId;
      }
    }

    const player = await this.prisma.player.findUnique({
      where: { id: Number(maxPlayerId) },
      include: { user: true },
    });

    return {
      player,
      wins: maxCount,
    };
  }

  async getPlayerWithMoreTokensSold() {
    const collections = await this.prisma.collection.findMany({
      where: {},
      include: { fundraising: { include: { player: true } } },
    });

    const tokensCount: { [key: number]: number } = {};

    collections.forEach((collection) => {
      const playerId = collection.fundraising.player.id;

      const soldedTokens = collection.initial_amount - collection.amount_left;
      // Si el player_id ya existe en el contador, incrementamos su valor
      if (tokensCount[playerId]) {
        tokensCount[playerId] += soldedTokens;
      } else {
        // Si el player_id no existe en el contador, lo inicializamos a 1
        tokensCount[playerId] = soldedTokens;
      }
    });

    // Encontrar el player_id con más victorias
    let maxPlayerId = null;
    let maxTokens = 0;

    for (const [playerId, count] of Object.entries(tokensCount)) {
      if (count > maxTokens) {
        maxTokens = count;
        maxPlayerId = playerId;
      }
    }

    const player = await this.prisma.player.findUnique({
      where: { id: Number(maxPlayerId) },
      include: { user: true },
    });

    return {
      player,
      tokens: maxTokens,
    };
  }

  async getPlayerWithMoreMoneyCollected() {
    const fundraisings = await this.prisma.fundraising.findMany({
      where: {},
      include: { player: true },
    });

    const moneyCount: { [key: number]: number } = {};

    fundraisings.forEach((fundraising) => {
      const playerId = fundraising.player.id;

      const currentAmount = fundraising.current_amount;
      // Si el player_id ya existe en el contador, incrementamos su valor
      if (moneyCount[playerId]) {
        moneyCount[playerId] += currentAmount;
      } else {
        // Si el player_id no existe en el contador, lo inicializamos a 1
        moneyCount[playerId] = currentAmount;
      }
    });

    // Encontrar el player_id con más victorias
    let maxPlayerId = null;
    let maxMoney = 0;

    for (const [playerId, count] of Object.entries(moneyCount)) {
      if (count > maxMoney) {
        maxMoney = count;
        maxPlayerId = playerId;
      }
    }

    const player = await this.prisma.player.findUnique({
      where: { id: Number(maxPlayerId) },
      include: { user: true },
    });

    return {
      player,
      amount: maxMoney,
    };
  }

  async getTransactions(endDate: Date = new Date(), startDate?: Date) {
    const buyTransactions = await this.prisma.transaction.count({
      where: {
        type: 'BUY',
        timestamp: startDate
          ? {
              gte: startDate,
              lte: endDate,
            }
          : {
              lte: endDate,
            },
      },
    });

    const sellTransactions = await this.prisma.transaction.count({
      where: {
        type: 'SELL',
        timestamp: startDate
          ? {
              gte: startDate,
              lte: endDate,
            }
          : {
              lte: endDate,
            },
      },
    });
    return {
      sellTransactions: sellTransactions,
      buyTransactions: buyTransactions,
    };
  }

  async getAllPublications() {
    const activePublications = await this.prisma.marketplace_publication.count({
      where: { active: true },
    });

    const publications = await this.prisma.marketplace_publication.count({
      where: {},
    });

    const successPublications = await this.prisma.in_wallet.count({
      where: {},
    });

    return {
      publications: publications,
      activePublications: activePublications,
      successPublications: successPublications,
    };
  }

  async getFundraisingsActive() {
    const activeFundraisings = await this.prisma.fundraising.count({
      where: { active: true },
    });

    const inactiveFundraisings = await this.prisma.fundraising.count({
      where: { active: false },
    });

    const fundraisings = await this.prisma.fundraising.count({
      where: {},
    });

    const tokensSold = await this.prisma.token_wallet.count({ where: {} });

    return {
      fundraisings: fundraisings,
      inactiveFundraisings: inactiveFundraisings,
      activeFundraisings: activeFundraisings,
      tokensSold: tokensSold,
    };
  }

  async getFundraisingsByGame() {
    const games = await this.prisma.game.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const countFundraisings: { [name: string]: number } = {};
    for (const game of games) {
      const gameName = game.name;
      const count = await this.prisma.fundraising.count({
        where: {
          event: {
            game: {
              id: game.id,
            },
          },
        },
      });

      countFundraisings[gameName] = count;
    }

    return countFundraisings;
  }
}

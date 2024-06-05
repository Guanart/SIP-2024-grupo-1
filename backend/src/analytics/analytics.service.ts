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

    // Convertir el objeto playerCount a un array de pares [playerId, count]
    const playerCountArray = Object.entries(playerCount);

    // Ordenar el array en orden descendente por el número de victorias
    playerCountArray.sort((a, b) => b[1] - a[1]);

    const topPlayers = playerCountArray.slice(0, 3);

    const player1 = await this.prisma.player.findUnique({
      where: { id: Number(topPlayers[0][0]) },
      include: { user: true },
    });

    const player2 = await this.prisma.player.findUnique({
      where: { id: Number(topPlayers[1][0]) },
      include: { user: true },
    });

    const player3 = await this.prisma.player.findUnique({
      where: { id: Number(topPlayers[2][0]) },
      include: { user: true },
    });

    return [
      {
        player: player1,
        wins: playerCountArray[0][1],
      },
      {
        player: player2,
        wins: playerCountArray[1][1],
      },
      {
        player: player3,
        wins: playerCountArray[2][1],
      },
    ];
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

  async getTokensAveragePrice() {
    const collections = await this.prisma.collection.findMany({ where: {} });

    let price = 0;

    collections.forEach((collection) => {
      price += collection.current_price;
    });

    const average = price / collections.length;

    return average;
  }

  async getMorePopularEvents(game_id: number) {
    const events = await this.prisma.event.findMany({
      where: {
        game_id: game_id,
      },
      include: {
        fundraisings: true,
        game: true,
      },
    });

    // Calcular la recaudación total para cada evento
    const eventsWithTotalFundraising = events.map((event) => {
      const totalFundraising = event.fundraisings.reduce(
        (sum, fundraising) => sum + fundraising.current_amount,
        0,
      );
      return {
        ...event,
        totalFundraising,
      };
    });

    // Ordenar los eventos por la recaudación total y tomar los 3 primeros
    const topEvents = eventsWithTotalFundraising
      .sort((a, b) => b.totalFundraising - a.totalFundraising)
      .slice(0, 3);

    if (topEvents) {
      const data = topEvents.map(({ name, totalFundraising, game }) => {
        console.log(name, totalFundraising, game.name);
        return {
          event_name: name,
          total: totalFundraising,
        };
      });

      return {
        description: `${topEvents[0].game.name} most popular events`,
        events: data,
      };
    } else {
      return [];
    }
  }
}

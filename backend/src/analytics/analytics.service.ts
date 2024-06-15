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

      if (playerCount[playerId]) {
        playerCount[playerId]++;
      } else {
        playerCount[playerId] = 1;
      }
    });

    const playerCountArray = Object.entries(playerCount);
    playerCountArray.sort((a, b) => b[1] - a[1]);

    const topPlayers = playerCountArray.slice(0, 3);

    const playersWithWins = await Promise.all(
      topPlayers.map(async ([playerId, wins]) => {
        const player = await this.prisma.player.findUnique({
          where: { id: Number(playerId) },
          include: { user: true },
        });

        return {
          player,
          wins,
        };
      }),
    );

    return playersWithWins;
  }

  // Misma funcion que la de arriba, solo que parametrizada para poder filtrar la cantidad de jugadores del top
  async getNPlayersWithMoreWins(count: number, from: Date, to: Date) {
    const player_event: {
      player_id: number;
      event_id: number;
      position: number;
    }[] = await this.prisma.player_event.findMany({
      where: {
        position: 1,
        event: {
          end_date: {
            gte: from,
            lte: to,
          },
        },
      },
      include: { event: true },
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

    const topPlayers =
      playerCountArray.length > count
        ? playerCountArray.slice(0, count)
        : playerCountArray;

    const results = [];

    for (let i = 0; i < topPlayers.length; i++) {
      // playerID del jugador nro i de la lista
      const playerId = Number(topPlayers[i][0]);
      const wins = topPlayers[i][1];

      const player = await this.prisma.player.findUnique({
        where: { id: playerId },
        include: { user: true },
      });

      if (player) {
        results.push({
          player,
          wins,
        });
      }
    }

    return results;
  }

  async getEarningsFromTransactions(from: Date, to: Date) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
      },
    });

    if (!transactions) return null;

    return {
      transactions: 1000,
      buy: 500,
      sell: 500,
      earnings: 7000,
      transactionsByDay: [
        {
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 200,
        },
        {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 1500,
        },
        {
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 500,
        },
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 1800,
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 300,
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          amount: 100,
          earnings: 1700,
        },
        {
          date: new Date(Date.now()),
          amount: 100,
          earnings: 1000,
        },
      ],
    };
  }

  async getFundraisingsByPlayer(id: number, dateFrom?: Date, dateTo?: Date) {
    const fundraisings = await this.prisma.fundraising.findMany({
      where: {
        player_id: id,
        active: false,
        AND: [
          dateFrom ? { createdAt: { gte: dateFrom } } : {},
          dateTo ? { createdAt: { lte: dateTo } } : {},
        ],
      },
      include: {
        collection: true,
        event: {
          include: {
            player_event: {
              where: {
                player_id: id,
              },
            },
          },
        },
      },
    });
    return fundraisings;
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

  async getTokensAveragePrice(event_name?: string) {
    const collections = await this.prisma.collection.findMany({ where: {} });
    let total = 0;
    let totalOfEvent = 0;
    const eventEditions = {};

    collections.forEach((collection) => {
      total += collection.current_price;
    });

    if (event_name) {
      const collectionsByEvent = await this.prisma.collection.findMany({
        where: { fundraising: { event: { name: event_name } } },
        include: { fundraising: { include: { event: true } } },
      });
      console.log(collectionsByEvent);

      collectionsByEvent.forEach((collection) => {
        const id = collection.fundraising.event_id;
        const date = collection.fundraising.event.start_date;
        const price = collection.current_price;

        if (eventEditions[id]) {
          eventEditions[id]['total'] += price;
          eventEditions[id]['collections']++;
          eventEditions[id]['average'] = Math.round(
            eventEditions[id]['total'] / eventEditions[id]['collections'],
          );
          if (collection.current_price > eventEditions[id]['max'])
            eventEditions[id]['max'] = price;
          if (collection.current_price < eventEditions[id]['min'])
            eventEditions[id]['min'] = price;
        } else {
          eventEditions[id] = {
            date,
            average: price,
            total: price,
            collections: 1,
            min: price,
            max: price,
          };
        }
        totalOfEvent += collection.current_price;
      });

      const averagePrice = Math.round(total / collections.length);
      const eventAveragePrice = Math.round(
        totalOfEvent / collectionsByEvent.length,
      );

      if (!collectionsByEvent.length) {
        return {
          averagePrice,
          eventAveragePrice: null,
          averagePriceByEdition: null,
        };
      }

      return {
        averagePrice,
        eventAveragePrice,
        averagePriceByEdition: eventEditions,
      };
    }

    const averagePrice = Math.round(total / collections.length);

    return averagePrice;
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

  async getUnsuccessfullFundraisings() {
    const fundraisings = await this.prisma.fundraising.findMany({
      where: {},
    });

    let count = 0;
    const limit = 0.3;

    fundraisings.forEach((fundraisings) => {
      if (fundraisings.current_amount / fundraisings.goal_amount <= limit) {
        count++;
      }
    });

    return count;
  }

  async getFundraisingsByAmountCollected(min_limit: number, max_limit: number) {
    const fundraisings = await this.prisma.fundraising.findMany({
      where: {},
    });

    let count = 0;

    fundraisings.forEach((fundraising) => {
      const percentage =
        (fundraising.current_amount / fundraising.goal_amount) * 100;
      if (percentage >= min_limit && percentage <= max_limit) {
        count++;
      }
    });

    return count;
  }

  async getMorePopularGames() {
    const games = await this.prisma.game.findMany({
      where: {},
      include: {
        event: { include: { fundraisings: true } },
        player: true,
      },
    });

    const gamesWithTotalEventsAndFundraisings = games.map((game) => {
      const eventsWithTotalFundraising = game.event.map((event) => {
        const totalFundraising = event.fundraisings.reduce(
          (sum, fundraising) => sum + fundraising.current_amount,
          0,
        );

        return {
          ...event,
          totalFundraising,
        };
      });

      return {
        ...game,
        events: game.event.length,
        eventsWithTotalFundraising,
      };
    });

    console.log(gamesWithTotalEventsAndFundraisings);

    const topGames = gamesWithTotalEventsAndFundraisings.map((game) => {
      let total = 0;
      game.eventsWithTotalFundraising.forEach((event) => {
        total += event.totalFundraising;
      });
      return {
        ...game,
        total,
      };
    });

    if (topGames) {
      const data = topGames.map(({ name, total, events }) => {
        return {
          game: name,
          total,
          events,
        };
      });

      return {
        description: `Most popular games`,
        game: data.slice(0, 5),
      };
    } else {
      return [];
    }
  }
}

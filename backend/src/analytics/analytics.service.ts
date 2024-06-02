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
      users: users
    }
  }

  async getTransactions(startDate: Date, endDate: Date) {
    const buyTransactions = await this.prisma.transaction.count({
      where: { type: 'BUY',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
    });
    const sellTransactions = await this.prisma.transaction.count({
      where: { type: 'SELL',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
    });
    return {
      sellTransactions: sellTransactions,
      buyTransactions: buyTransactions
    }
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
    }
  }

  async getFundraisingsActive(){
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
    const games = await this.prisma.game.findMany({select: {
      id: true,
      name: true
    }});



    const countFundraisings : { [name: string]: number } = {};
    for (const game of games) {
      const gameName = game.name;
      const count = await this.prisma.fundraisings.count({
        where: {
          event: {
            game: {
              id: game.id
            }
          }
        }
      });

      countFundraisings[gameName] = count;
    };

    return countFundraisings;
  }
}

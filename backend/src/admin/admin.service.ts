import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AnalyticsService } from 'src/analytics/analytics.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private analyticService: AnalyticsService,
  ) {}

  async getData() {
    const { buyTransactions, sellTransactions } =
      await this.analyticService.getTransactions();

    const transactions = buyTransactions + sellTransactions;

    const { players, users } = await this.analyticService.getRegisteredUsers();

    const playerWithMostWins =
      await this.analyticService.getPlayerWithMoreWins();

    const playerWithMostTokensSold =
      await this.analyticService.getPlayerWithMoreTokensSold();

    const playerWithMostMoneyCollected =
      await this.analyticService.getPlayerWithMoreMoneyCollected();

    const playersAnalytics = [
      {
        description: 'Player with the most events won',
        player: playerWithMostWins[0].player,
        data: `${playerWithMostWins[0].wins} events`,
      },
      {
        description: 'Player who sold the most tokens',
        player: playerWithMostTokensSold.player,
        data: `${playerWithMostTokensSold.tokens} tokens`,
      },
      {
        description: 'Player who collected the most money',
        player: playerWithMostMoneyCollected.player,
        data: `U$D ${playerWithMostMoneyCollected.amount}`,
      },
    ];

    console.log(playersAnalytics);

    const { publications, activePublications, successPublications } =
      await this.analyticService.getAllPublications();

    const {
      fundraisings,
      activeFundraisings,
      inactiveFundraisings,
      tokensSold,
    } = await this.analyticService.getFundraisingsActive();

    return {
      transactions,
      sellTransactions,
      buyTransactions,
      players,
      playersAnalytics,
      users,
      publications,
      activePublications,
      fundraisings,
      inactiveFundraisings,
      activeFundraisings,
      tokensSold,
      successPublications,
    };
  }
}

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
      await this.analyticService.getPlayerWithMoreWins() || [];

    const playerWithMostTokensSold =
      await this.analyticService.getPlayerWithMoreTokensSold() || { player: null, tokens: 0 };

    const playerWithMostMoneyCollected =
      await this.analyticService.getPlayerWithMoreMoneyCollected() || { player: null, amount: 0 };

    const playersAnalytics = [
      playerWithMostWins[0]
        ? {
            description: 'Player with the most events won',
            player: playerWithMostWins[0].player,
            data: `${playerWithMostWins[0].wins} events`,
          }
        : null,
      playerWithMostTokensSold.player
        ? {
            description: 'Player who sold the most tokens',
            player: playerWithMostTokensSold.player,
            data: `${playerWithMostTokensSold.tokens} tokens`,
          }
        : null,
      playerWithMostMoneyCollected.player
        ? {
            description: 'Player who collected the most money',
            player: playerWithMostMoneyCollected.player,
            data: `U$D ${playerWithMostMoneyCollected.amount}`,
          }
        : null,
    ].filter(Boolean); // Remove null values

    const { publications, activePublications, successPublications } =
      await this.analyticService.getAllPublications();

    const {
      fundraisings,
      activeFundraisings,
      inactiveFundraisings,
      tokensSold,
    } = await this.analyticService.getFundraisingsActive();

    const averageTokenPrice =
      await this.analyticService.getTokensAveragePrice();

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
      averageTokenPrice,
      inactiveFundraisings,
      activeFundraisings,
      tokensSold,
      successPublications,
    };
  }
}
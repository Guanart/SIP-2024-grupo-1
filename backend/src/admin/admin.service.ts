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

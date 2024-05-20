import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getData() {
    const transactions = await this.prisma.transaction.count({
      where: {},
    });
    const buyTransactions = await this.prisma.transaction.count({
      where: { type: 'BUY' },
    });
    const sellTransactions = await this.prisma.transaction.count({
      where: { type: 'SELL' },
    });

    const players = await this.prisma.player.count({ where: { active: true } });
    const users = await this.prisma.user.count({});

    const activePublications = await this.prisma.marketplace_publication.count({
      where: { active: true },
    });

    const publications = await this.prisma.marketplace_publication.count({
      where: {},
    });

    const successPublications = await this.prisma.in_wallet.count({
      where: {},
    });

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

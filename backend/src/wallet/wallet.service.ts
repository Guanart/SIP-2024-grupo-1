import { Injectable } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(user_id: number): Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: { user_id },
    });

    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async findOne(wallet_id: number): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: wallet_id,
      },
      include: {
        user: true,
        transactions: true,
        token_wallet: {
          include: {
            token: {
              include: { collection: { include: { fundraising: true } } },
            },
          },
        },
      },
    });
    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async findOneByUserId(auth0_id: string): Promise<Wallet> {
    const user = await this.prisma.user.findUnique({ where: { auth0_id } });

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        user_id: user.id,
      },
      include: {
        user: true,
        transactions: true,
        token_wallet: {
          include: {
            token: {
              include: { collection: { include: { fundraising: true } } },
            },
          },
        },
      },
    });
    return wallet ? Wallet.fromObject(wallet) : null;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async emitInitialTokens(
    amount: number,
    price: number,
    collection_id: number,
  ): Promise<number> {
    const data = [];
    console.log(amount);

    for (let i = 0; i < amount; i++) {
      data.push({ price, collection_id });
    }

    const { count } = await this.prisma.token.createMany({
      data,
    });

    return count;
  }

  async getMostValuableTokens(wallet_id: number) {
    const tokens = await this.prisma.token_wallet.findMany({
      where: {
        wallet_id,
      },
      include: {
        token: {
          include: {
            collection: {
              include: {
                fundraising: {
                  include: {
                    event: true,
                    player: { include: { user: true, game: true } },
                  },
                },
              },
            },
          },
        },
      },
      take: 5,
      orderBy: {
        token: {
          price: 'desc',
        },
      },
    });

    return tokens;
  }
}

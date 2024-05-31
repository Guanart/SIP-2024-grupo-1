import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Token } from '@prisma/client';

type emitNewTokensOptions = {
  amount: number;
  price: number;
  collection_id: number;
  compensation_ratio: number;
};

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async emitInitialTokens(
    amount: number,
    price: number,
    collection_id: number,
  ): Promise<number> {
    const data = Array.from({ length: amount }, () => ({
      price,
      collection_id,
    }));

    const { count } = await this.prisma.token.createMany({
      data,
    });

    return count;
  }

  async emitNewTokens(options: emitNewTokensOptions): Promise<number> {
    const { price, amount, compensation_ratio, collection_id } = options;

    const data = Array.from({ length: amount }, () => ({
      price: price,
      collection_id: collection_id,
    }));

    const { count } = await this.prisma.token.createMany({ data });

    // Entrega tokens para llegar a su monto invertido inicial.
    // Si tiene 10 tokens comprados a U$D 25 y el nuevo precio del token es U$D 12.5, ahora deberá poseer 20 tokens. Se le entregan 10.
    const owners = await this.prisma.token_wallet.findMany({
      include: { token: true },
      where: { token: { collection_id } },
    });

    const tokenCountByWallet = [];

    owners.forEach((owner) => {
      const { wallet_id } = owner;
      if (!tokenCountByWallet[wallet_id]) {
        tokenCountByWallet[wallet_id] = 1;
      } else {
        tokenCountByWallet[wallet_id]++;
      }
    });

    for (const [walletId, tokenCount] of Object.entries(tokenCountByWallet)) {
      console.log(`Wallet ID: ${walletId}, Token Count: ${tokenCount}`);
      const compensationTokensCount =
        tokenCount * compensation_ratio - tokenCount;

      for (let i = 0; i < compensationTokensCount; i++) {
        // En cada iteración, obtengo el primer token de la colleción que no tiene owner
        const token = await this.prisma.token.findFirst({
          where: {
            collection_id,
            token_wallet: {
              none: {},
            },
          },
        });

        await this.prisma.token_wallet.create({
          data: { wallet_id: Number(walletId), token_id: token.id },
        });
      }
    }

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

  async destroyToken(token_id: number) {
    await this.prisma.token.delete({
      where: {
        id: token_id,
      }
    })
  }

  async destroyMany(tokensNotSold: Token[]) {
    tokensNotSold.map(({id}) => this.destroyToken(id))
  }
}

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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Collection } from './collection.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class CollectionService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async create(
    goal_amount: number,
    prize_percentage: number,
    initial_price: number,
    fundraising_id: number,
  ) {
    const initial_amount = Math.floor(goal_amount / initial_price);
    const token_price_percentage = prize_percentage / initial_amount;

    const collection = await this.prisma.collection.create({
      data: {
        initial_amount,
        amount_left: initial_amount,
        token_price_percentage,
        initial_price,
        current_price: initial_price,
        fundraising_id,
      },
    });

    if (!collection) {
      return null;
    }

    const count = await this.tokenService.emitInitialTokens(
      initial_amount,
      initial_price,
      collection.id,
    );

    if (count !== initial_amount) {
      return null;
    }

    return collection ? Collection.fromObject(collection) : null;
  }
}

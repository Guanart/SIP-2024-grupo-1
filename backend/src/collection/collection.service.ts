import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Collection } from './collection.entity';
import { TokenService } from '../token/token.service';
import { Fundraising } from '@prisma/client';

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
    const initial_amount = Math.ceil(goal_amount / initial_price);
    const token_prize_percentage = prize_percentage / initial_amount;

    const collection = await this.prisma.collection.create({
      data: {
        initial_amount,
        amount_left: initial_amount,
        token_prize_percentage,
        previous_token_prize_percentage: token_prize_percentage,
        previous_price: initial_price,
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

  async update(
    new_goal_amount: number,
    new_initial_price: number,
    fundraising: Fundraising,
  ) {
    let collection = await this.prisma.collection.findUnique({
      where: { fundraising_id: fundraising.id },
    });

    const ownedTokens = collection.initial_amount - collection.amount_left;

    const recalculated_amount = Math.ceil(new_goal_amount / new_initial_price);
    const recalculated_amount_left = recalculated_amount - ownedTokens;

    const recalculated_token_prize_percentage =
      fundraising.prize_percentage / recalculated_amount;

    collection = await this.prisma.collection.update({
      where: {
        id: collection.id,
      },
      data: {
        initial_amount: recalculated_amount,
        amount_left: recalculated_amount_left,
        previous_token_prize_percentage: collection.token_prize_percentage,
        token_prize_percentage: recalculated_token_prize_percentage,
        current_price: new_initial_price,
        previous_price: collection.current_price,
      },
    });

    await this.prisma.token.updateMany({
      where: { collection_id: collection.id },
      data: { price: new_initial_price },
    });

    const amountOfTokensToBeEmited =
      recalculated_amount - collection.initial_amount;

    // TODO: Implementar emisión de nuevos tokens
    console.log(amountOfTokensToBeEmited);

    // const data = Array.from({ length: 10 }, () => ({
    //   price: new_initial_price,
    //   collection_id: collection.id,
    // }));

    // await this.prisma.token.createMany({ data });

    // TODO: Implementar compensación a compradores de tokens previo a la actualización

    return collection ? Collection.fromObject(collection) : null;
  }
}

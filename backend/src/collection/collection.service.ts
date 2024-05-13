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
    const token_prize_percentage = prize_percentage / 100 / initial_amount;

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

    // TODO: Recalcular un proporcional para determinar que cantidad de tokens representa el monto objetivo alcanzado al momento. En caso de cambio de precio
    // Es decir, si se vendieron 10 tokens a U$D 25, luego de la actualización (nuevo precio = U$D 12.5) esos U$D 250 representan 20 tokens.
    const compensationRatio = collection.current_price / new_initial_price; // la proporción en este caso es (25 / 12.5) = 2

    const ownedTokens = collection.initial_amount - collection.amount_left;
    const recalculatedOwnedTokens = ownedTokens * compensationRatio;

    const recalculatedAmount = Math.ceil(new_goal_amount / new_initial_price);

    const recalculatedAmountLeft = recalculatedAmount - recalculatedOwnedTokens;

    const amountOfTokensToBeEmited =
      recalculatedAmount - collection.initial_amount;

    console.log('amount should be 1000:', amountOfTokensToBeEmited);
    console.log('recalculated amount should be 2000: ', recalculatedAmount);
    console.log(
      'recalculated amount left should be 1980: ',
      recalculatedAmountLeft,
    );

    const recalculated_token_prize_percentage =
      fundraising.prize_percentage / 100 / recalculatedAmount;

    console.log(
      'recalculated token prize percentage should be 0.0002: ',
      recalculated_token_prize_percentage,
    );

    collection = await this.prisma.collection.update({
      where: {
        id: collection.id,
      },
      data: {
        initial_amount: recalculatedAmount,
        amount_left: recalculatedAmountLeft,
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

    const options = {
      amount: amountOfTokensToBeEmited,
      price: new_initial_price,
      collection_id: collection.id,
      compensation_ratio: compensationRatio,
    };

    const amountEmitted = await this.tokenService.emitNewTokens(options);

    if (amountEmitted !== amountOfTokensToBeEmited) return null;

    return collection ? Collection.fromObject(collection) : null;
  }
}

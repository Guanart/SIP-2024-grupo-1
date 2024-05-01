import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Collection } from './collection.entity';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

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

    // id                     Int         @id @default(autoincrement())
    // token_price_percentage Float
    // amount_left            Int
    // fundraising_id         Int         @unique
    // fundraising            Fundraising @relation(fields: [fundraising_id], references: [id])

    return collection ? Collection.fromObject(collection) : null;
  }
}

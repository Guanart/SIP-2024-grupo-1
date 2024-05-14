import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Rank } from './rank.entity';

@Injectable()
export class RankService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    description: string
  ) {
    const rank = await this.prisma.rank.create({
      data: {
        description
      },
    });

    if (!rank) {
      return null;
    }

    return rank ? Rank.fromObject(rank) : null;
  }

  async update(
    description: string
  ) {
    let rank = await this.prisma.rank.findUnique({
      where: { description: description},
    });
    return rank ? Rank.fromObject(rank) : null;
  }

  async findOne(rank_id: number): Promise<Rank> {
    const rank = await this.prisma.rank.findUnique({
      where: {
        id: rank_id,
      },
    });
    return rank ? Rank.fromObject(rank) : null;
  }

  async getAllRanks(): Promise<Rank[]> {
    const ranks = await this.prisma.rank.findMany({
        where: {
        },
    });
    return ranks.map(rank => Rank.fromObject(rank));
}

}

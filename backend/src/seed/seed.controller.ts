import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('seed')
export class SeedController {
  constructor(private prisma: PrismaService) {}

  @Get('/')
  async findOne(): Promise<string> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: 'johndoe@lot.com',
          auth0_id: 'auth0|6630e72f316573cb65b38115',
          username: 'John Doe',
          avatar:
            'https://files.bo3.gg/uploads/image/23965/image/webp-655c64b3d990b1f8755b29bf331d8eee.webp',
        },
      });

      const user2 = await this.prisma.user.create({
        data: {
          email: 'ricardomilos@lot.com',
          auth0_id: 'auth0|6638d9bf4c8fdfcd1554b151',
          username: 'Ricardo Milos',
          avatar:
            'https://image.lexica.art/full_jpg/49883613-3c07-4ef9-b6be-15347ae09ec8',
        },
      });

      await this.prisma.wallet.create({
        data: {
          user_id: user.id,
        },
      });

      const wallet2 = await this.prisma.wallet.create({
        data: {
          user_id: user2.id,
        },
      });

      const game = await this.prisma.game.create({
        data: {
          name: 'Valorant',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1280px-Valorant_logo_-_pink_color_version.svg.png',
        },
      });

      const player = await this.prisma.player.create({
        data: {
          user_id: user.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          ranking: 10,
          game_id: game.id,
          public_key: '',
          access_token: '',
        },
      });

      const event = await this.prisma.event.create({
        data: {
          start_date: new Date('05/07/2024'),
          end_date: new Date('05/08/2024'),
          max_players: 12,
          prize: 1000000,
          name: 'Supermagic',
          game_id: game.id,
        },
      });

      await this.prisma.event.create({
        data: {
          start_date: new Date('04/07/2024'),
          end_date: new Date('06/08/2024'),
          max_players: 10,
          prize: 2000000,
          name: 'Pro League V',
          game_id: game.id,
        },
      });

      const fundraising = await this.prisma.fundraising.create({
        data: {
          goal_amount: 25000,
          current_amount: 125,
          prize_percentage: 40,
          player_id: player.id,
          event_id: event.id,
          risk_level: 'LOW',
        },
      });

      const collection = await this.prisma.collection.create({
        data: {
          previous_price: 25.0,
          current_price: 25.0,
          initial_amount: 1000,
          token_prize_percentage: 0.0004,
          previous_token_prize_percentage: 0.0004,
          fundraising_id: fundraising.id,
          amount_left: 995,
        },
      });

      const data = Array.from({ length: 1000 }, () => ({
        price: collection.current_price,
        collection_id: collection.id,
      }));

      await this.prisma.token.createMany({ data });

      const tokens = await this.prisma.token.findMany({
        where: {
          collection_id: collection.id,
        },
        take: 5,
      });

      tokens.forEach(async (token) => {
        await this.prisma.token_wallet.create({
          data: {
            token_id: token.id,
            wallet_id: wallet2.id,
          },
        });
      });

      tokens.forEach(async (token) => {
        await this.prisma.transaction.createMany({
          data: {
            wallet_id: wallet2.id,
            token_id: token.id,
            type_id: 1,
          },
        });
      });

      return 'Database loaded successfully with test data';
    } catch (exception) {
      return 'Failed to seed database with test data. Please try again later';
    }
  }
}

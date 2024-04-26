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
          auth0_id: 'auth0|1a2b3c4d5e6f7g8h9',
          username: 'John Doe',
          avatar:
            'https://files.bo3.gg/uploads/image/23965/image/webp-655c64b3d990b1f8755b29bf331d8eee.webp',
        },
      });

      const wallet = await this.prisma.wallet.create({
        data: {
          user_id: user.id,
          cbu: '2655926629852484698',
          paypal_id: 'paypal_id578721',
        },
      });

      const game = await this.prisma.game.create({
        data: {
          name: 'Valorant',
        },
      });

      const player = await this.prisma.player.create({
        data: {
          user_id: user.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          ranking: 10,
          game_id: game.id,
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

      const fundraising = await this.prisma.fundraising.create({
        data: {
          goal_amount: 50000,
          prize_percentage: 20,
          player_id: player.id,
          event_id: event.id,
          risk_level: 'LOW',
        },
      });

      const collection = await this.prisma.collection.create({
        data: {
          initial_price: 50.0,
          current_price: 50.0,
          initial_amount: 1000,
          token_price_percentage: 0.02,
          fundraising_id: fundraising.id,
          amount_left: 1000,
        },
      });

      return 'Database loaded successfully with test data';
    } catch (exception) {
      return 'Failed to seed database with test data. Please try again later';
    }
  }
}

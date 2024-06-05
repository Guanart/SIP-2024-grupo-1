import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TransactionType } from '@prisma/client';

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

      const user3 = await this.prisma.user.create({
        data: {
          email: 'juanperez@lot.com',
          auth0_id: 'auth0|66436a7b4d1c357206d6c3c4',
          username: 'Juan Perez',
          avatar:
            'https://fgcu360.com/wp-content/uploads/sites/1/2022/05/Esports-Zevari-Norman-552x394-1.jpg',
        },
      });

      const user4 = await this.prisma.user.create({
        data: {
          email: 'marianorapa@lot.com',
          auth0_id: 'auth0|665f4486abc968d72e004c04',
          username: 'Mariano Rapa',
          avatar:
            'https://i.blogs.es/juegos/6683/dota_2/fotos/noticias/dota_2-5313356.jpg',
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

      const wallet3 = await this.prisma.wallet.create({
        data: {
          user_id: user3.id,
        },
      });

      await this.prisma.wallet.create({
        data: {
          user_id: user4.id,
        },
      });

      const game = await this.prisma.game.create({
        data: {
          name: 'Valorant',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1280px-Valorant_logo_-_pink_color_version.svg.png',
        },
      });

      await this.prisma.game.create({
        data: {
          name: 'Among us',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Among_Us.png/375px-Among_Us.png',
        },
      });

      await this.prisma.game.create({
        data: {
          name: 'League of Legends',
          icon: 'https://cdn.icon-icons.com/icons2/3053/PNG/512/league_of_legends_macos_bigsur_icon_190030.png',
        },
      });

      await this.prisma.game.create({
        data: {
          name: 'Counter Strike',
          icon: 'https://cdn2.steamgriddb.com/icon/f3d801966e7e0d77863c9f8b31d02529/32/256x256.png',
        },
      });

      const rank1 = await this.prisma.rank.create({
        data: {
          description: 'Iron',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Silver',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Gold',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Platinum',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Diamond',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Master',
        },
      });

      await this.prisma.rank.create({
        data: {
          description: 'Challenguer',
        },
      });

      const player = await this.prisma.player.create({
        data: {
          user_id: user.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: rank1.id,
          game_id: game.id,
          public_key: '',
          access_token: '',
        },
      });

      const player2 = await this.prisma.player.create({
        data: {
          user_id: user3.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: rank1.id,
          game_id: game.id,
          public_key: '',
          access_token: '',
        },
      });

      const player3 = await this.prisma.player.create({
        data: {
          user_id: user4.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: rank1.id,
          game_id: game.id,
          public_key: '',
          access_token: '',
        },
      });

      const event = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 12,
          prize: 1000000,
          name: 'Supermagic',
          game_id: game.id,
        },
      });

      await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Pro League V',
          game_id: game.id,
        },
      });

      const oldEvent = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'SuperEvent',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      const oldEvent2 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Magic V',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      const oldEvent3 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Superleague X',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      const oldEvent4 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Gameland',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      const oldEvent5 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Rapid',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      const oldEvent6 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Energy',
          game_id: game.id,
          checked: true,
          active: false,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent.id,
          player_id: player.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent3.id,
          player_id: player.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent4.id,
          player_id: player.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent2.id,
          player_id: player2.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent5.id,
          player_id: player2.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: oldEvent6.id,
          player_id: player3.id,
          position: 1,
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

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 25000,
          current_amount: 25000,
          prize_percentage: 40,
          player_id: player3.id,
          event_id: oldEvent.id,
          risk_level: 'LOW',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 50000,
          current_amount: 25000,
          prize_percentage: 40,
          player_id: player2.id,
          event_id: oldEvent2.id,
          risk_level: 'LOW',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 150000,
          current_amount: 50000,
          prize_percentage: 40,
          player_id: player.id,
          event_id: oldEvent3.id,
          risk_level: 'LOW',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 75000,
          current_amount: 70000,
          prize_percentage: 20,
          player_id: player2.id,
          event_id: oldEvent3.id,
          risk_level: 'LOW',
          active: false,
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

      // tokens.forEach(async (token) => {
      //   await this.prisma.token_wallet.create({
      //     data: {
      //       token_id: token.id,
      //       wallet_id: wallet2.id,
      //     },
      //   });
      // });

      for (let i = 0; i < 4; i++) {
        const token = tokens[i];
        await this.prisma.token_wallet.create({
          data: {
            token_id: token.id,
            wallet_id: wallet2.id,
          },
        });

        await this.prisma.transaction.create({
          data: {
            wallet_id: wallet2.id,
            token_id: token.id,
            type: TransactionType.BUY,
          },
        });
      }

      await this.prisma.token_wallet.create({
        data: {
          token_id: tokens[4].id,
          wallet_id: wallet3.id,
        },
      });

      await this.prisma.transaction.create({
        data: {
          token_id: tokens[4].id,
          wallet_id: wallet3.id,
          type: TransactionType.BUY,
        },
      });

      await this.prisma.marketplace_publication.create({
        data: {
          token_id: tokens[0].id,
          price: 25.0,
          out_wallet_id: wallet2.id,
        },
      });

      await this.prisma.marketplace_publication.create({
        data: {
          token_id: tokens[4].id,
          price: 50.0,
          out_wallet_id: wallet3.id,
        },
      });
      return 'Database loaded successfully with test data';
    } catch (exception) {
      console.log(exception);
      return 'Failed to seed database with test data. Please try again later';
    }
  }
}

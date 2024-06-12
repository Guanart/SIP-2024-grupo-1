import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RiskLevel, TransactionType } from '@prisma/client';

@Controller('seed')
export class SeedController {
  constructor(private prisma: PrismaService) {}

  @Get('/1')
  async Step1(): Promise<string> {
    try {
      // Create 150 Users (100 players and 50 non-players)
      const userPromises = Array.from({ length: 150 }, (_, i) => {
        return this.prisma.user.create({
          data: {
            email: `user${i}@lot.com`,
            auth0_id: `auth0|${Math.random().toString(36).substring(7)}`,
            username: `User ${i}`,
            avatar: `https://picsum.photos/seed/${i}/1920/1080`,
          },
        });
      });
      const users = await Promise.all(userPromises);

      // Create Wallets
      const walletPromises = users.map((user) => {
        return this.prisma.wallet.create({
          data: { user_id: user.id },
        });
      });
      await Promise.all(walletPromises);

      const rankDescriptions = [
        'Iron',
        'Silver',
        'Gold',
        'Platinum',
        'Diamond',
        'Master',
        'Challenger',
      ];

      const rankPromises = rankDescriptions.map((description) => {
        return this.prisma.rank.create({
          data: { description },
        });
      });

      await Promise.all(rankPromises);

      const gameData = [
        {
          name: 'Valorant',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1280px-Valorant_logo_-_pink_color_version.svg.png',
        },
        {
          name: 'FIFA 24',
          icon: 'https://cdn.worldvectorlogo.com/logos/ea-sports-3.svg',
        },
        {
          name: 'Fortnite',
          icon: 'https://i.pinimg.com/474x/b3/56/f7/b356f7a11762c2ae5d92798ecf7cc6ee.jpg',
        },
        {
          name: 'Counter Strike',
          icon: 'https://cdn2.steamgriddb.com/icon/f3d801966e7e0d77863c9f8b31d02529/32/256x256.png',
        },
        {
          name: 'League of Legends',
          icon: 'https://cdn.icon-icons.com/icons2/3053/PNG/512/league_of_legends_macos_bigsur_icon_190030.png',
        },
      ];

      const gamePromises = gameData.map((game) => {
        return this.prisma.game.create({
          data: game,
        });
      });

      await Promise.all(gamePromises);

      return 'Step 1: Users, Wallets, Games and Ranks created successfully';
    } catch (exception) {
      console.log(exception);
      return 'Failed to execute step 1. Please try again later';
    }
  }

  @Get('/2')
  async Step2(): Promise<string> {
    try {
      // Fetch existing users, games, and ranks
      const users = await this.prisma.user.findMany({
        include: { wallet: true },
      });
      const games = await this.prisma.game.findMany();
      const ranks = await this.prisma.rank.findMany();
      const wallets = await this.prisma.wallet.findMany({
        include: { token_wallet: true },
      });

      // Separate players and non-players
      const players = users.slice(0, 100);
      const nonPlayers = users.slice(100);

      // Create Players
      const playerPromises = players.map((user) => {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
        return this.prisma.player.create({
          data: {
            user_id: user.id,
            biography: `Biography of User ${user.id}`,
            rank_id: randomRank.id,
            game_id: randomGame.id,
            public_key: '',
            access_token: '',
          },
        });
      });
      const createdPlayers = await Promise.all(playerPromises);

      // Create Events
      const eventPromises = Array.from({ length: 50 }, (_, i) => {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        const minPrize = 200000;
        const maxPrize = 1000000;
        const prize = Math.round(
          Math.random() * (maxPrize - minPrize) + minPrize,
        );
        return this.prisma.event.create({
          data: {
            start_date: new Date(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            max_players: Math.floor(Math.random() * 50) + 10,
            prize: prize,
            name: `Event ${i}`,
            game_id: randomGame.id,
          },
        });
      });
      const events = await Promise.all(eventPromises);

      // Create Player Events
      const playerEventPromises = createdPlayers.map((player) => {
        const randomEvent = events[Math.floor(Math.random() * events.length)];

        // Obtener el número máximo de jugadores permitidos en el evento
        const maxPlayers = randomEvent.max_players;

        // Calcular una posición aleatoria dentro del rango adecuado
        const position = Math.floor(Math.random() * maxPlayers) + 1;

        return this.prisma.player_event.create({
          data: {
            event_id: randomEvent.id,
            player_id: player.id,
            position: position,
          },
        });
      });
      await Promise.all(playerEventPromises);

      // Create Fundraisings
      const fundraisingPromises = Array.from({ length: 300 }, () => {
        const randomPlayer =
          createdPlayers[Math.floor(Math.random() * createdPlayers.length)];
        const randomEvent = events[Math.floor(Math.random() * events.length)];

        // Generar valores aleatorios para current_amount y goal_amount
        const goalAmount = Math.random() * 100000;
        const currentAmount = Math.random() * goalAmount; // Asegurar que current_amount no sea mayor que goal_amount
        const minPrizePercentage = 20;
        const maxPrizePercentage = 100;
        const prizePercentage = Math.round(
          Math.random() * (maxPrizePercentage - minPrizePercentage) +
            minPrizePercentage,
        );

        return this.prisma.fundraising.create({
          data: {
            goal_amount: goalAmount,
            current_amount: currentAmount,
            prize_percentage: prizePercentage,
            player_id: randomPlayer.id,
            event_id: randomEvent.id,
            risk_level: ['LOW', 'MEDIUM', 'HIGH'][
              Math.floor(Math.random() * 3)
            ] as RiskLevel,
          },
        });
      });
      const fundraisings = await Promise.all(fundraisingPromises);

      // Create Collections
      const collectionPromises = fundraisings.map((fundraising) => {
        const price = Math.round(Math.random() * 100);
        return this.prisma.collection.create({
          data: {
            previous_price: price,
            current_price: price,
            initial_amount: fundraising.goal_amount / price,
            token_prize_percentage:
              fundraising.prize_percentage /
              100 /
              (fundraising.goal_amount / price),
            previous_token_prize_percentage: Math.random(),
            fundraising_id: fundraising.id,
            amount_left: Math.floor(Math.random() * 1000),
          },
          include: { token: true },
        });
      });
      const collections = await Promise.all(collectionPromises);

      // Create Tokens in batches to avoid exhausting the connection pool
      const createTokensInBatches = async (batchSize: number) => {
        for (let i = 0; i < collections.length; i += batchSize) {
          const batch = collections.slice(i, i + batchSize);
          const tokenPromises = batch.flatMap((collection) => {
            return Array.from({ length: collection.initial_amount }, () => {
              return this.prisma.token.create({
                data: {
                  price: collection.current_price,
                  collection_id: collection.id,
                },
              });
            });
          });
          return await Promise.all(tokenPromises);
        }
      };
      const tokens = await createTokensInBatches(10);

      // Create Transactions and Token Wallets for non-players
      const createTransactionsInBatches = async (batchSize: number) => {
        for (let i = 0; i < nonPlayers.length; i += batchSize) {
          const batch = nonPlayers.slice(i, i + batchSize);
          const transactionPromises = batch.flatMap((user) => {
            const randomTokens = tokens
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            return randomTokens.flatMap((token) => [
              this.prisma.token_wallet.create({
                data: {
                  token_id: token.id,
                  wallet_id: user.wallet.id,
                },
              }),
              this.prisma.transaction.create({
                data: {
                  wallet_id: user.wallet.id,
                  token_id: token.id,
                  type: 'BUY' as TransactionType,
                },
              }),
            ]);
          });
          await Promise.all(transactionPromises);
        }
      };
      await createTransactionsInBatches(10);

      // Create Marketplace Publications in batches
      const createMarketplaceInBatches = async (batchSize: number) => {
        for (let i = 0; i < 100; i += batchSize) {
          const batch = tokens.slice(i, i + batchSize);
          const marketplacePromises = batch.map((token) => {
            const wallet = wallets[Math.floor(Math.random() * wallets.length)];
            return this.prisma.marketplace_publication.create({
              data: {
                token_id: token.id,
                price: Math.round(Math.random() * 100),
                out_wallet_id: wallet.id,
              },
            });
          });
          await Promise.all(marketplacePromises);
        }
      };
      await createMarketplaceInBatches(10); // Adjust the batch size as needed

      return 'Step 2: Players, Events, Fundraisings, Collections, Tokens, Transactions, and Marketplace Publications created successfully';
    } catch (exception) {
      console.log(exception);
      return 'Failed to execute step 2. Please try again later';
    }
  }

  @Get('/3')
  async Step3(): Promise<string> {
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

      const ranks = await this.prisma.rank.findMany();
      const games = await this.prisma.game.findMany();

      const player = await this.prisma.player.create({
        data: {
          user_id: user.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[0].id,
          game_id: games[0].id,
          public_key: '',
          access_token: '',
        },
      });

      const player2 = await this.prisma.player.create({
        data: {
          user_id: user3.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[1].id,
          game_id: games[0].id,
          public_key: '',
          access_token: '',
        },
      });

      const player3 = await this.prisma.player.create({
        data: {
          user_id: user4.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[2].id,
          game_id: games[0].id,
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
          game_id: games[0].id,
        },
      });

      await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'Pro League V',
          game_id: games[0].id,
        },
      });

      const oldEvent = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 2000000,
          name: 'SuperEvent',
          game_id: games[0].id,
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
          game_id: games[0].id,
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
          game_id: games[0].id,
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
          game_id: games[0].id,
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
          game_id: games[0].id,
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
          game_id: games[0].id,
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
          name: 'FIFA 24',
          icon: 'https://cdn.worldvectorlogo.com/logos/ea-sports-3.svg',
        },
      });

      await this.prisma.game.create({
        data: {
          name: 'Fortnite',
          icon: 'https://static.wikia.nocookie.net/logopedia/images/d/db/Fortnite_S1.svg/revision/latest/scale-to-width-down/250?cb=20210330161743',
        },
      });

      await this.prisma.game.create({
        data: {
          name: 'Counter Strike',
          icon: 'https://cdn2.steamgriddb.com/icon/f3d801966e7e0d77863c9f8b31d02529/32/256x256.png',
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
          name: 'Among us',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Among_Us.png/375px-Among_Us.png',
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

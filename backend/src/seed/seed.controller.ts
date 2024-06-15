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
      // Crear usuarios
      const users = await Promise.all([
        this.prisma.user.create({
          data: {
            email: 'johndoe@lot.com',
            auth0_id: 'auth0|6630e72f316573cb65b38115',
            username: 'John Doe',
            avatar:
              'https://files.bo3.gg/uploads/image/23965/image/webp-655c64b3d990b1f8755b29bf331d8eee.webp',
          },
        }),
        this.prisma.user.create({
          data: {
            email: 'ricardomilos@lot.com',
            auth0_id: 'auth0|6638d9bf4c8fdfcd1554b151',
            username: 'Ricardo Milos',
            avatar:
              'https://image.lexica.art/full_jpg/49883613-3c07-4ef9-b6be-15347ae09ec8',
          },
        }),
        this.prisma.user.create({
          data: {
            email: 'juanperez@lot.com',
            auth0_id: 'auth0|66436a7b4d1c357206d6c3c4',
            username: 'Juan Perez',
            avatar:
              'https://fgcu360.com/wp-content/uploads/sites/1/2022/05/Esports-Zevari-Norman-552x394-1.jpg',
          },
        }),
        this.prisma.user.create({
          data: {
            email: 'marianorapa@lot.com',
            auth0_id: 'auth0|665f4486abc968d72e004c04',
            username: 'Mariano Rapa',
            avatar:
              'https://i.blogs.es/juegos/6683/dota_2/fotos/noticias/dota_2-5313356.jpg',
          },
        }),
      ]);

      // Crear wallets para cada usuario
      const wallets = await Promise.all(
        users.map((user) =>
          this.prisma.wallet.create({ data: { user_id: user.id } }),
        ),
      );

      // Crear ranks
      const rankDescriptions = [
        'Iron',
        'Silver',
        'Gold',
        'Platinum',
        'Diamond',
        'Master',
        'Challenger',
      ];
      const ranks = await Promise.all(
        rankDescriptions.map((description) =>
          this.prisma.rank.create({ data: { description } }),
        ),
      );

      // Crear juegos
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
      const games = await Promise.all(
        gameData.map((game) => this.prisma.game.create({ data: game })),
      );

      // Crear jugadores
      const players = await Promise.all([
        this.prisma.player.create({
          data: {
            user_id: users[0].id,
            biography: 'Lorem ipsum dolor sit amet...',
            rank_id: ranks[0].id,
            game_id: games[0].id,
            public_key: '',
            access_token: '',
          },
        }),
        this.prisma.player.create({
          data: {
            user_id: users[2].id,
            biography: 'Lorem ipsum dolor sit amet...',
            rank_id: ranks[0].id,
            game_id: games[0].id,
            public_key: '',
            access_token: '',
          },
        }),
        this.prisma.player.create({
          data: {
            user_id: users[3].id,
            biography: 'Lorem ipsum dolor sit amet...',
            rank_id: ranks[0].id,
            game_id: games[0].id,
            public_key: '',
            access_token: '',
          },
        }),
      ]);

      // Crear eventos
      const events = await Promise.all([
        this.prisma.event.create({
          data: {
            start_date: new Date(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            max_players: 12,
            prize: 1000000,
            name: 'Supermagic',
            game_id: games[0].id,
          },
        }),
        this.prisma.event.create({
          data: {
            start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            end_date: new Date(Date.now() - 335 * 24 * 60 * 60 * 1000),
            max_players: 10,
            prize: 2000000,
            name: 'Supermagic',
            game_id: games[0].id,
            active: false,
          },
        }),
        this.prisma.event.create({
          data: {
            start_date: new Date(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            max_players: 10,
            prize: 2000000,
            name: 'Pro League V',
            game_id: games[0].id,
          },
        }),
        ...Array.from({ length: 6 }).map((_, i) =>
          this.prisma.event.create({
            data: {
              start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              max_players: 10,
              prize: 2000000,
              name: `Old Event ${i + 1}`,
              game_id: games[0].id,
              checked: true,
              active: false,
            },
          }),
        ),
      ]);

      // Asignar eventos a jugadores
      await Promise.all([
        this.prisma.player_event.create({
          data: {
            event_id: events[3].id,
            player_id: players[0].id,
            position: 1,
          },
        }),
        this.prisma.player_event.create({
          data: {
            event_id: events[4].id,
            player_id: players[0].id,
            position: 1,
          },
        }),
        this.prisma.player_event.create({
          data: {
            event_id: events[5].id,
            player_id: players[0].id,
            position: 1,
          },
        }),
        this.prisma.player_event.create({
          data: {
            event_id: events[3].id,
            player_id: players[1].id,
            position: 1,
          },
        }),
        this.prisma.player_event.create({
          data: {
            event_id: events[4].id,
            player_id: players[1].id,
            position: 1,
          },
        }),
        this.prisma.player_event.create({
          data: {
            event_id: events[5].id,
            player_id: players[2].id,
            position: 1,
          },
        }),
      ]);

      // Crear fundraisings
      const fundraisings = await Promise.all([
        this.prisma.fundraising.create({
          data: {
            goal_amount: 25000,
            current_amount: 125,
            prize_percentage: 40,
            player_id: players[0].id,
            event_id: events[0].id,
            risk_level: 'LOW',
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 25000,
            current_amount: 125,
            prize_percentage: 40,
            player_id: players[0].id,
            event_id: events[1].id,
            risk_level: 'LOW',
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 50000,
            current_amount: 50000,
            prize_percentage: 40,
            player_id: players[0].id,
            event_id: events[1].id,
            risk_level: 'LOW',
            active: false,
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 20000,
            current_amount: 15000,
            prize_percentage: 40,
            player_id: players[1].id,
            event_id: events[1].id,
            risk_level: 'LOW',
            active: false,
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 50000,
            current_amount: 25000,
            prize_percentage: 60,
            player_id: players[1].id,
            event_id: events[1].id,
            risk_level: 'LOW',
            active: false,
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 150000,
            current_amount: 50000,
            prize_percentage: 40,
            player_id: players[0].id,
            event_id: events[4].id,
            risk_level: 'LOW',
            active: false,
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 75000,
            current_amount: 70000,
            prize_percentage: 20,
            player_id: players[1].id,
            event_id: events[4].id,
            risk_level: 'LOW',
            active: false,
          },
        }),
        this.prisma.fundraising.create({
          data: {
            goal_amount: 30000,
            current_amount: 0,
            prize_percentage: 25,
            player_id: players[1].id,
            event_id: events[2].id,
            risk_level: 'LOW',
            active: true,
          },
        }),
      ]);

      // Crear colecciones
      const collections = await Promise.all([
        this.prisma.collection.create({
          data: {
            previous_price: 25.0,
            current_price: 25.0,
            initial_amount: 1000,
            token_prize_percentage: 0.0004,
            previous_token_prize_percentage: 0.0004,
            fundraising_id: fundraisings[0].id,
            amount_left: 995,
          },
        }),
        this.prisma.collection.create({
          data: {
            previous_price: 50.0,
            current_price: 50.0,
            initial_amount: 1000,
            token_prize_percentage: 0.0006,
            previous_token_prize_percentage: 0.0006,
            fundraising_id: fundraisings[4].id,
            amount_left: 0,
          },
        }),
        this.prisma.collection.create({
          data: {
            previous_price: 32.0,
            current_price: 32.0,
            initial_amount: 625,
            token_prize_percentage: 0.00064,
            previous_token_prize_percentage: 0.00064,
            fundraising_id: fundraisings[3].id,
            amount_left: 0,
          },
        }),
        this.prisma.collection.create({
          data: {
            previous_price: 3,
            current_price: 3,
            initial_amount: 10000,
            token_prize_percentage: 0.000025,
            previous_token_prize_percentage: 0.000025,
            fundraising_id: fundraisings[7].id,
            amount_left: 0,
          },
        }),
      ]);

      // Crear tokens
      await this.prisma.token.createMany({
        data: Array.from({ length: 1000 }, () => ({
          price: collections[0].current_price,
          collection_id: collections[0].id,
        })),
      });

      // Asignar tokens a wallets
      const assignedTokens = await this.prisma.token.findMany({
        where: { collection_id: collections[0].id },
        take: 5,
      });

      await Promise.all([
        ...Array.from({ length: 4 }).map((_, i) =>
          this.prisma.token_wallet
            .create({
              data: {
                token_id: assignedTokens[i].id,
                wallet_id: wallets[1].id,
              },
            })
            .then(() =>
              this.prisma.transaction.create({
                data: {
                  token_id: assignedTokens[i].id,
                  wallet_id: wallets[1].id,
                  type: 'BUY',
                },
              }),
            ),
        ),
        this.prisma.token_wallet
          .create({
            data: { token_id: assignedTokens[4].id, wallet_id: wallets[2].id },
          })
          .then(() =>
            this.prisma.transaction.create({
              data: {
                token_id: assignedTokens[4].id,
                wallet_id: wallets[2].id,
                type: 'BUY',
              },
            }),
          ),
      ]);

      // Crear publicaciones en el marketplace
      await Promise.all([
        this.prisma.marketplace_publication.create({
          data: {
            token_id: assignedTokens[0].id,
            price: 25.0,
            out_wallet_id: wallets[1].id,
          },
        }),
        this.prisma.marketplace_publication.create({
          data: {
            token_id: assignedTokens[4].id,
            price: 50.0,
            out_wallet_id: wallets[2].id,
          },
        }),
      ]);

      return 'Database loaded successfully with test data';
    } catch (exception) {
      console.log(exception);
      return 'Failed to seed database with test data. Please try again later';
    }
  }






  //https://thispersondoesnotexist.com/
  @Get('/seeder2')
  async seeder(): Promise<string> {
    try {

      const user1 = await this.prisma.user.create({
        data: {
          email: 'bobsmith@lot.com',
          auth0_id: 'auth0|667b2c4e5d2c9a8745a1d8e2',
          username: 'Bob Smith',
          avatar:
            'https://randomuser.me/api/portraits/men/45.jpg',
        },
      });
      
      const user2 = await this.prisma.user.create({
        data: {
          email: 'charliedavis@lot.com',
          auth0_id: 'auth0|668c3d4f6e3c8b9756a2e9f3',
          username: 'Charlie Davis',
          avatar:
            'https://randomuser.me/api/portraits/men/46.jpg',
        },
      });
      
      const user3 = await this.prisma.user.create({
        data: {
          email: 'dianaross@lot.com',
          auth0_id: 'auth0|669d4e5f7f4c9c0767a3f0a4',
          username: 'Diana Ross',
          avatar:
            'https://randomuser.me/api/portraits/women/47.jpg',
        },
      });
      
      const user4 = await this.prisma.user.create({
        data: {
          email: 'edwardjones@lot.com',
          auth0_id: 'auth0|670e5f6f8f5c9d1878a4f1b5',
          username: 'Edward Jones',
          avatar:
            'https://randomuser.me/api/portraits/men/48.jpg',
        },
      });
      
      const user5 = await this.prisma.user.create({
        data: {
          email: 'fionagreen@lot.com',
          auth0_id: 'auth0|671f6a7f9f6c9e2989b5f2c6',
          username: 'Fiona Green',
          avatar:
            'https://randomuser.me/api/portraits/women/49.jpg',
        },
      });
      
      const user6 = await this.prisma.user.create({
        data: {
          email: 'georgewhite@lot.com',
          auth0_id: 'auth0|672g7b8f0g7c9f3a9b6f3d7e',
          username: 'George White',
          avatar:
            'https://randomuser.me/api/portraits/men/50.jpg',
        },
      });
      
      const user7 = await this.prisma.user.create({
        data: {
          email: 'hannahblack@lot.com',
          auth0_id: 'auth0|673h8c9f1h8c0a4b9c7f4e8f',
          username: 'Hannah Black',
          avatar:
            'https://randomuser.me/api/portraits/women/51.jpg',
        },
      });
      
      const user8 = await this.prisma.user.create({
        data: {
          email: 'ianbrown@lot.com',
          auth0_id: 'auth0|674i9d0f2i9c1b5c9d8f5f9g',
          username: 'Ian Brown',
          avatar:
            'https://randomuser.me/api/portraits/men/52.jpg',
        },
      });
      
      const user9 = await this.prisma.user.create({
        data: {
          email: 'julieclark@lot.com',
          auth0_id: 'auth0|675j0e1f3j0c2c6d9e9f6g0h',
          username: 'Julie Clark',
          avatar:
            'https://randomuser.me/api/portraits/women/53.jpg',
        },
      });
      
      const user10 = await this.prisma.user.create({
        data: {
          email: 'karladavis@lot.com',
          auth0_id: 'auth0|676k1f2f4k1c3d7e0f0f7h1i',
          username: 'Karla Davis',
          avatar:
            'https://randomuser.me/api/portraits/women/54.jpg',
        },
      });
      

      const wallet1 = await this.prisma.wallet.create({
        data: {
          user_id: user1.id,
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

      const wallet4 = await this.prisma.wallet.create({
        data: {
          user_id: user4.id,
        },
      });
      
      const wallet5 = await this.prisma.wallet.create({
        data: {
          user_id: user5.id,
        },
      });

      const wallet6 = await this.prisma.wallet.create({
        data: {
          user_id: user6.id,
        },
      });

      const wallet7 = await this.prisma.wallet.create({
        data: {
          user_id: user7.id,
        },
      });

      const wallet8 = await this.prisma.wallet.create({
        data: {
          user_id: user8.id,
        },
      });

      const wallet9 = await this.prisma.wallet.create({
        data: {
          user_id: user9.id,
        },
      });
      
      const wallet10 = await this.prisma.wallet.create({
        data: {
          user_id: user10.id,
        },
      });

      
      const user11 = await this.prisma.user.create({
        data: {
          email: 'elitegamer@lot.com',
          auth0_id: 'auth0|677j1k2l3m4n5o6p7q8r9s0t',
          username: 'EliteGamer',
          avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
        },
      });
      
      const user12 = await this.prisma.user.create({
        data: {
          email: 'shadowmaster@lot.com',
          auth0_id: 'auth0|677k1l2m3n4o5p6q7r8s9t0u',
          username: 'ShadowMaster',
          avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
        },
      });
      
      const user13 = await this.prisma.user.create({
        data: {
          email: 'dragonslayer@lot.com',
          auth0_id: 'auth0|677l1m2n3o4p5q6r7s8t9u0v',
          username: 'DragonSlayer',
          avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
        },
      });
      
      const user14 = await this.prisma.user.create({
        data: {
          email: 'nightstalker@lot.com',
          auth0_id: 'auth0|677m1n2o3p4q5r6s7t8u9v0w',
          username: 'NightStalker',
          avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        },
      });
      
      const user15 = await this.prisma.user.create({
        data: {
          email: 'phantomknight@lot.com',
          auth0_id: 'auth0|677n1o2p3q4r5s6t7u8v9w0x',
          username: 'PhantomKnight',
          avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
        },
      });
      
      const user16 = await this.prisma.user.create({
        data: {
          email: 'stormbringer@lot.com',
          auth0_id: 'auth0|677o1p2q3r4s5t6u7v8w9x0y',
          username: 'StormBringer',
          avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
        },
      });
      
      const user17 = await this.prisma.user.create({
        data: {
          email: 'blazehunter@lot.com',
          auth0_id: 'auth0|677p1q2r3s4t5u6v7w8x9y0z',
          username: 'BlazeHunter',
          avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
        },
      });
      
      const user18 = await this.prisma.user.create({
        data: {
          email: 'ironfist@lot.com',
          auth0_id: 'auth0|677q1r2s3t4u5v6w7x8y9z0a',
          username: 'IronFist',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        },
      });
      
      const user19 = await this.prisma.user.create({
        data: {
          email: 'venomstrike@lot.com',
          auth0_id: 'auth0|677r1s2t3u4v5w6x7y8z9a0b',
          username: 'VenomStrike',
          avatar: 'https://randomuser.me/api/portraits/women/59.jpg',
        },
      });
      
      const user20 = await this.prisma.user.create({
        data: {
          email: 'cyberwarrior@lot.com',
          auth0_id: 'auth0|677s1t2u3v4w5x6y7z8a9b0c',
          username: 'CyberWarrior',
          avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
        },
      });
  

      const wallet11 = await this.prisma.wallet.create({
        data: {
          user_id: user11.id,
        },
      });
      
      const wallet12 = await this.prisma.wallet.create({
        data: {
          user_id: user12.id,
        },
      });
      
      const wallet13 = await this.prisma.wallet.create({
        data: {
          user_id: user13.id,
        },
      });
      
      const wallet14 = await this.prisma.wallet.create({
        data: {
          user_id: user14.id,
        },
      });
      
      const wallet15 = await this.prisma.wallet.create({
        data: {
          user_id: user15.id,
        },
      });
      
      const wallet16 = await this.prisma.wallet.create({
        data: {
          user_id: user16.id,
        },
      });
      
      const wallet17 = await this.prisma.wallet.create({
        data: {
          user_id: user17.id,
        },
      });
      
      const wallet18 = await this.prisma.wallet.create({
        data: {
          user_id: user18.id,
        },
      });
      
      const wallet19 = await this.prisma.wallet.create({
        data: {
          user_id: user19.id,
        },
      });
      
      const wallet20 = await this.prisma.wallet.create({
        data: {
          user_id: user20.id,
        },
      });
      

      const games = await this.prisma.game.findMany({where:{}});
      const ranks = await this.prisma.rank.findMany({where:{}});
      function getRandomIntegerInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const player1 = await this.prisma.player.create({
        data: {
          user_id: user11.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[0].id,
          public_key: '',
          access_token: '',
        },
      });

      const player2 = await this.prisma.player.create({
        data: {
          user_id: user12.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[0].id,
          public_key: '',
          access_token: '',
        },
      });

      const player3 = await this.prisma.player.create({
        data: {
          user_id: user13.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[1].id,
          public_key: '',
          access_token: '',
        },
      });

      const player4 = await this.prisma.player.create({
        data: {
          user_id: user14.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[1].id,
          public_key: '',
          access_token: '',
        },
      });

      const player5 = await this.prisma.player.create({
        data: {
          user_id: user15.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[2].id,
          public_key: '',
          access_token: '',
        },
      });

      const player6 = await this.prisma.player.create({
        data: {
          user_id: user16.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[2].id,
          public_key: '',
          access_token: '',
        },
      });

      const player7 = await this.prisma.player.create({
        data: {
          user_id: user17.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[3].id,
          public_key: '',
          access_token: '',
        },
      });

      const player8 = await this.prisma.player.create({
        data: {
          user_id: user18.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[3].id,
          public_key: '',
          access_token: '',
        },
      });

      const player9 = await this.prisma.player.create({
        data: {
          user_id: user19.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[4].id,
          public_key: '',
          access_token: '',
        },
      });

      const player10 = await this.prisma.player.create({
        data: {
          user_id: user20.id,
          biography:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed consectetur arcu non libero',
          rank_id: ranks[getRandomIntegerInRange(0,(ranks.length - 1))].id,
          game_id: games[5].id,
          public_key: '',
          access_token: '',
        },
      });


      const oldEvent1 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 8,
          prize: 1500000,
          name: 'Golden Championship',
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
          prize: 1800000,
          name: 'Diamond Clash',
          game_id: games[1].id,
          checked: true,
          active: false,
        },
      });

      // Repite este patrón para los otros juegos
      const oldEvent3 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 12,
          prize: 2000000,
          name: 'Epic Showdown',
          game_id: games[2].id,
          checked: true,
          active: false,
        },
      });

      const oldEvent4 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 8,
          prize: 1600000,
          name: 'Legendary Quest',
          game_id: games[3].id,
          checked: true,
          active: false,
        },
      });

      const oldEvent5 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 1900000,
          name: 'Mystic Rumble',
          game_id: games[4].id,
          checked: true,
          active: false,
        },
      });

      const oldEvent6 = await this.prisma.event.create({
        data: {
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          max_players: 12,
          prize: 2100000,
          name: 'Royal Arena',
          game_id: games[5].id,
          checked: true,
          active: false,
        },
      });



      const event1 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 8,
          prize: 1600000,
          name: 'Magic Mayhem',
          game_id: games[0].id,
        },
      });

      const event2 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 1900000,
          name: 'Legend League',
          game_id: games[1].id,
        },
      });

      const event3 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 12,
          prize: 2100000,
          name: 'Eternal Tournament',
          game_id: games[2].id,
        },
      });

      const event4 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 8,
          prize: 1500000,
          name: 'Galactic Showdown',
          game_id: games[3].id,
        },
      });

      const event5 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 10,
          prize: 1800000,
          name: 'Heroic Clash',
          game_id: games[4].id,
        },
      });

      const event6 = await this.prisma.event.create({
        data: {
          start_date: new Date(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          max_players: 12,
          prize: 2000000,
          name: 'Divine Duel',
          game_id: games[5].id,
        },
      });


      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player1.game_id}})[0],
          player_id: player1.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player2.game_id}})[0],
          player_id: player2.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player3.game_id}})[0],
          player_id: player3.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player4.game_id}})[0],
          player_id: player4.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player5.game_id}})[0],
          player_id: player5.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player6.game_id}})[0],
          player_id: player6.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player7.game_id}})[0],
          player_id: player7.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player8.game_id}})[0],
          player_id: player8.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player9.game_id}})[0],
          player_id: player9.id,
          position: 1,
        },
      });

      await this.prisma.player_event.create({
        data: {
          event_id: this.prisma.event.findMany({where:{game_id:player10.game_id}})[0],
          player_id: player10.id,
          position: 1,
        },
      });
      


      
      const fundraising = await this.prisma.fundraising.create({
        data: {
          goal_amount: 25000,
          current_amount: 125,
          prize_percentage: 40,
          player_id: player1.id,
          event_id: this.prisma.event.findMany({where:{game_id:player1.game_id}})[0],
          risk_level: 'LOW',
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 25000,
          current_amount: 25000,
          prize_percentage: 40,
          player_id: player2.id,
          event_id: this.prisma.event.findMany({where:{game_id:player2.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 50000,
          current_amount: 25000,
          prize_percentage: 40,
          player_id: player3.id,
          event_id: this.prisma.event.findMany({where:{game_id:player3.game_id}})[0],
          risk_level: 'HIGH',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 150000,
          current_amount: 50000,
          prize_percentage: 40,
          player_id: player4.id,
          event_id: this.prisma.event.findMany({where:{game_id:player4.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });

      await this.prisma.fundraising.create({
        data: {
          goal_amount: 1000,
          current_amount: 50000,
          prize_percentage: 30,
          player_id: player5.id,
          event_id: this.prisma.event.findMany({where:{game_id:player5.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });
      
      await this.prisma.fundraising.create({
        data: {
          goal_amount: 75000,
          current_amount: 70000,
          prize_percentage: 10,
          player_id: player6.id,
          event_id: this.prisma.event.findMany({where:{game_id:player6.game_id}})[0],
          risk_level: 'HIGH',
          active: false,
        },
      });


      await this.prisma.fundraising.create({
        data: {
          goal_amount: 75000,
          current_amount: 70000,
          prize_percentage: 20,
          player_id: player7.id,
          event_id: this.prisma.event.findMany({where:{game_id:player7.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });


      await this.prisma.fundraising.create({
        data: {
          goal_amount: 60000,
          current_amount: 60000,
          prize_percentage: 25,
          player_id: player8.id,
          event_id: this.prisma.event.findMany({where:{game_id:player8.game_id}})[0],
          risk_level: 'HIGH',
          active: false,
        },
      });


      await this.prisma.fundraising.create({
        data: {
          goal_amount: 80000,
          current_amount: 70000,
          prize_percentage: 15,
          player_id: player9.id,
          event_id: this.prisma.event.findMany({where:{game_id:player9.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });


      await this.prisma.fundraising.create({
        data: {
          goal_amount: 75000,
          current_amount: 70000,
          prize_percentage: 30,
          player_id: player10.id,
          event_id: this.prisma.event.findMany({where:{game_id:player10.game_id}})[0],
          risk_level: 'LOW',
          active: false,
        },
      });


      // FALTA DE ACÁ PARA ABAJO:

      const events = await this.prisma.event.findMany({where:{}});
      const collection = await this.prisma.collection.create({
        data: {
          previous_price: 25.0,
          current_price: 25.0,
          initial_amount: 1000,
          token_prize_percentage: 0.0004,
          previous_token_prize_percentage: 0.0004,
          fundraising_id: events[getRandomIntegerInRange(0,(events.length - 1))].id,
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
}

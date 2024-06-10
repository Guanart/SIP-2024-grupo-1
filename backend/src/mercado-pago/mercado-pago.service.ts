import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, OAuth, Preference, Payment } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';
import { PrismaService } from '../database/prisma.service';
import { log } from 'console';
import { TransactionType } from '@prisma/client';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { FundraisingService } from 'src/fundraising/fundraising.service';

@Injectable()
export class MercadoPagoService {
  private readonly client: MercadoPagoConfig;
  private prisma: PrismaService;
  private fundraisingService: FundraisingService;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
      options: { timeout: 1500000000 },
    });
    this.prisma = new PrismaService();
  }

  // CREAR PREFERENCIA PARA MARKETPLACE Y FUNDRAISING
  async createPreference(items: CreatePreference) {
    // Buscar el access_token del player o wallet
    const typeToQueryMap = {
      fundraising: async (id: number) => {
        const player = await this.prisma.player.findFirst({
          where: {
            fundraisings: {
              some: {
                id,
              },
            },
          },
          select: {
            access_token: true,
          },
        });
        return player?.access_token || null;
      },
      marketplace: async (id: number) => {
        const wallet = await this.prisma.wallet.findFirst({
          where: {
            marketplace_publication: {
              some: {
                publication_id: id,
              },
            },
          },
          select: {
            access_token: true,
          },
        });
        console.log(wallet)
        return wallet?.access_token || null;
      },
    };

    const queryFunction = typeToQueryMap[items.type];
    if (!queryFunction) {
      throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST);
    }
    console.log(items)
    const access_token = await queryFunction(Number(items.id));
    if (!access_token) {
      throw new HttpException('access_token not found', HttpStatus.NOT_FOUND);
    }

    // Creación de la Preference
    const config = new MercadoPagoConfig({ accessToken: access_token });
    const preference = new Preference(config);

    try {
      const body = {
        expires: false,
        items: [
          {
            id: `${items.buyer_wallet_id}-${items.id}`,
            title: items.title,
            quantity: items.quantity,
            unit_price: items.unit_price,
            currency_id: 'ARS',
            category_id: items.type,
          },
        ],
        back_urls: {
          // success: process.env.APP_URL + '/' + items.type + '/',
          // pending: process.env.APP_URL + '/' + items.type,
          // failure: process.env.APP_URL + '/' + items.type,
          success: 'http://localhost:5173/' + items.type + '/',
          pending: 'http://localhost:5173/' + items.type + '/',
          failure: 'http://localhost:5173/' + items.type + '/',
        },
        auto_return: 'approved',
        marketplace: process.env.MP_APP_ID,
        marketplace_fee: 10, // TODO: Cambiar por el porcentaje que se quiera cobrar
        // notification_url: process.env.APP_URL + `/mercado-pago/webhook?type=${items.type}&comprador=${}`,
      };

      const result = await preference.create({ body });

      console.log('\nPreference created:\n', result);
      return { id: result.id }; // Le retorna al front el id de la preference, para mostrar el botón de MP
    } catch (error) {
      console.error('Error creating preference:', error);
      throw new HttpException(
        'Ha ocurrido un error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // AUTORIZAR CUENTA DE MERCADOPAGO DE VENDEDOR (PLAYER O WALLET)
  async authorizeSeller(code: string, type: string, id: string) {
    const oauth = new OAuth(this.client);
    try {
      const body = {
        client_id: process.env.MP_APP_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.MP_REDIRECT_URI,
        // test_token: true     // no usarlo
      };
      const result = await oauth.create({ body: body });
      console.log(`\nOAuth result:\n`, result);
      const { access_token, public_key, refresh_token } = result;

      // Guardar tokens
      const queryMap = {
        where: {
          id: Number(id),
        },
        data: {
          access_token,
          public_key,
          // refresh_token,
        },
      };
      let data;
      if (type == 'player') {
        data = await this.prisma.player.update(queryMap);
      } else if (type == 'wallet') {
        data = await this.prisma.wallet.update(queryMap);
      }
      console.log(`\nTokens guardados. Vendedor autorizado`, data);
    } catch (error) {
      console.error('Error creating preference:', error);
      throw new HttpException(
        'Ha ocurrido un error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handlePayment(notification: any) {
    // Obtener el payment
    const payment = new Payment(this.client);
    const paymentId = notification.data.id;
    const data = await payment.get({ id: paymentId });
    console.log('\nPayment received:\n', data);

    // Obtener el item de la transacción, y verificar si es una fundraising o un marketplace
    const item = data.additional_info.items[0];
    if (item.category_id === 'fundraising') {
      this.persistFundraisingTransaction(data, item);
    } else if (item.category_id === 'marketplace') {
      this.persistMarketplaceTransaction(data, item);
    }
    return true;
  }

async persistFundraisingTransaction(
  data: PaymentResponse,
  item: Items,
) {
  const [buyer_wallet_id, fundraisingId] = item.id.split('-');
  console.log(item)
  console.log(buyer_wallet_id)
  // Buscar primero la fundraising
  const fundraising = await this.prisma.fundraising.findFirst({
    where: {
      id: Number(fundraisingId),
    },
    select: {
      collection: true,
      player: {
        select: {
          user: {
            select: {
              wallet: true,
            },
          },
        },
      },
    },
  });

  if (!fundraising || !fundraising.collection || !fundraising.player || !fundraising.player.user.wallet) {
    throw new Error(`Fundraising with id ${fundraisingId} not found or incomplete`);
  }

  // Ahora necesito un id de un token disponible para esa fundraising. Un token esta asociado a una collection, que a su vez esta asociada a una fundraising
  // Necesito un token que no tenga token_wallet ni Marketplace_publication asociados
  const token = await this.prisma.token.findFirst({
    where: {
      collection_id: fundraising.collection.id, // Buscar tokens asociados a la colección específica
      token_wallet: {
        none: {}, // Asegura que no haya ninguna asociación en token_wallet
      },
      Marketplace_publication: {
        none: {}, // Asegura que no haya ninguna asociación en Marketplace_publication
      },
    },
  });

  console.log("Token encontrado: ", token)
  // Si ya no hay más tokens disponibles, se cancela la transacción
  if (!token) {
    console.log(
      `\nFundraising with id ${fundraisingId} doesn't have any token\n`,
    );
    return `\nFundraising with id ${fundraisingId} doesn't have any token\n`;
  }
  // Persist transaction in buyer's wallet and associate the token with the wallet using token_wallet
  const transaction = await this.prisma.transaction.create({
    data: {
      wallet_id: Number(buyer_wallet_id),
      token_id: token.id,
      type: TransactionType.BUY,
    },
  });

  const player_transaction = await this.prisma.transaction.create({
    data: {
      wallet_id: fundraising.player.user.wallet.id,
      token_id: token.id,
      type: TransactionType.SELL,
    },
  });
  
  // Create a new token_wallet entry to associate the token with the wallet
  await this.prisma.token_wallet.create({
    data: {
      token_id: token.id,
      wallet_id: Number(buyer_wallet_id),
    },
  });
  console.log(
    `\nFundraising transaction with id ${transaction.id} processed successfully\n`,
    transaction,
  );

  this.fundraisingService.updateAmount(Number(fundraisingId));

}

async persistMarketplaceTransaction(
  data: PaymentResponse,
  item: Items,
) {
  // Obtener las wallets involucradas en la transacción
  const [buyer_wallet_id, publicationId] = item.id
    .split('-');

  const typeToWhereMap = {
    fundraising: {
      player: {
        fundraising: {
          some: {
            id: Number(publicationId),
          }
        },
      },
    },
    marketplace: {
      marketplace_publication: {
        some: {
          publication_id: Number(publicationId),
        }
      },
    },
  };


  const seller_wallet = await this.prisma.wallet.findFirst({
    where: typeToWhereMap[item.category_id],
    select: {
      id: true,
    },
  });

  const seller_wallet_id = seller_wallet?.id;
  
  // Buscar las wallets  
  const [wallet1, wallet2] = await Promise.all([
    this.prisma.wallet.findUnique({ where: { id: Number(buyer_wallet_id) } }),
    this.prisma.wallet.findUnique({ where: { id: Number(seller_wallet_id) } }),
  ]);

  // Verificar si las wallets existen
  if (!wallet1 || !wallet2) {
    console.log(`\nOne or both wallets not found\n`);
    return `\nOne or both wallets not found\n`;
  }

  // Obtener el token asociado a la primera wallet
  const token = await this.prisma.token.findFirst({
    where: {
      AND: [
        {
          token_wallet: {
            some: {
              wallet_id: Number(seller_wallet_id),
            },
          },
        },
        {
          Marketplace_publication: {
            some: {
              publication_id: Number(publicationId),
            },
          },
        },
      ],
    },
  });

  // Verificar si hay un token disponible
  if (!token) {
    console.log(
      `\nWallet with id ${seller_wallet_id} or marketplace publication with id ${publicationId} doesn't have any token\n`,
    );
    return `\nWallet with id ${seller_wallet_id} or marketplace publication with id ${publicationId} doesn't have any token\n`;
  }

  // Mover el token de la primera wallet a la segunda wallet
  await Promise.all([
    this.prisma.token_wallet.delete({
      where: {
        wallet_id_token_id: {
          wallet_id: Number(seller_wallet_id),
          token_id: token.id,
        },
      },
    }),
    this.prisma.token_wallet.create({
      data: {
        token_id: token.id,
        wallet_id: Number(buyer_wallet_id),
      },
    }),
  ]);

  // Persistir la transacción en ambas wallets
  const transaction1 = await this.prisma.transaction.create({
    data: {
      wallet_id: Number(buyer_wallet_id),
      token_id: token.id,
      type: TransactionType.BUY,
    },
  });

  const transaction2 = await this.prisma.transaction.create({
    data: {
      wallet_id: Number(seller_wallet_id),
      token_id: token.id,
      type: TransactionType.SELL,
    },
  });

  console.log(
    `\nMarketplace transaction with id ${transaction1.id} processed successfully\n`,
    transaction1,
    transaction2,
  );
}

}
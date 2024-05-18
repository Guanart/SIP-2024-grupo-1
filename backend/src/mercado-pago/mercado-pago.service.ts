import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, OAuth, Preference, Payment } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';
import { PrismaService } from '../database/prisma.service';
import { log } from 'console';
import { TransactionType } from '@prisma/client';

@Injectable()
export class MercadoPagoService {
  private readonly client: MercadoPagoConfig;
  private prisma: PrismaService;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
      options: { timeout: 1500000000 },
    });
    this.prisma = new PrismaService();
  }

  // async handleWebhook(notification: any) {
  //   console.log('Processing notification:', notification);

  //   const { id, status } = notification;

  //   if (status === 'approved') {
  //     // await this.prisma.fundraising.update({
  //     //   where: { },
  //     //   data: { }, 
  //     // });
  //   }

  //   return notification;
  // }


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
        return wallet?.access_token || null;
      },
    };

    const queryFunction = typeToQueryMap[items.type];
    if (!queryFunction) {
      throw new HttpException('Invalid type', HttpStatus.BAD_REQUEST);
    }

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
            id: items.type + '-' + items.id,
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
        },
        auto_return: 'approved',
        marketplace: process.env.MP_APP_ID,
        marketplace_fee: 10,    // TODO: Cambiar por el porcentaje que se quiera cobrar
        // notification_url: process.env.APP_URL + `/mercado-pago/webhook?type=${items.type}&comprador=${}`,
      };

      const result = await preference.create({ body });
      console.log(result);
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
      console.log(result);
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
      console.log('Tokens guardados');
      console.log(data);
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
    console.log('Payment received:', data);

    /*
      token: {
        "category_id": "fundraising",
        "description": null,
        "id": "fundraising-1",
        "picture_url": null,
        "quantity": "1",
        "title": "John Doe | Supermagic (1)",
        "unit_price": "25"
      }
    */
    
    // Actualizar balance del player
      // const player = await this.prisma.player.findFirst({
      //   where: {
      //     fundraisings: {
      //       some: {
      //         id: fundraisingId,
      //       },
      //     },
      //   },
      //   select: {
      //     id: true,
      //   },
      // });

      // if (!player) {
      //   return false;
      // }
      // const amount = data.transaction_amount;
      // const newBalance = player.balance + amount;

      // await this.prisma.player.update({
      //   where: { id: player.id },
      //   data: { balance: newBalance },
      // });

    const item = data.additional_info.items[0];
    if (item.category_id === 'fundraising') {
      const fundraisingId = item.id.split('-')[1];

      // Necesito buscar primero la fundraising
      const fundraising = await this.prisma.fundraising.findFirst({
        where: {
          id: Number(fundraisingId),
        },
        select: {
          collection: true,
        }
      });
      
      // Ahora necesito un id de un token disponible para esa fundraising. Un token esta asociado a una collection, que a su vez esta asociada a una fundraising
      const token = await this.prisma.token.findFirst({
        where: {
          collection_id: fundraising.collection.id,
        },
      });

      // Persistir transacción en Wallet comprador
      await this.prisma.transaction.create({
        data: {
          wallet_id: 1,
          token_id: token.id,
          type: TransactionType.BUY,
        },
      });

    } else if (item.category_id === 'marketplace') {

    }
    return true;
  }
}

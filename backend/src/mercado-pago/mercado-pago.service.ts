import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, OAuth, Preference } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';
import { PrismaService } from '../database/prisma.service';
import { log } from 'console';

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
          success: process.env.APP_URL + '/' + items.type + '/',
          pending: process.env.APP_URL + '/' + items.type,
          failure: process.env.APP_URL + '/' + items.type,
        },
        auto_return: 'approved',
        marketplace: process.env.MP_APP_ID,
        marketplace_fee: 10,
        notification_url: process.env.APP_URL + '/mercado-pago/webhook',
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

  handlePayment(notification: any, type: string) {
    if (type === 'fundraising') {

      // 
    } else if (type === 'marketplace') {
      // Manejar el pago de una reventa
    }
    return true;
  }
}

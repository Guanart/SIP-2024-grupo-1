import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, OAuth, Preference } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';
import { PrismaService } from 'src/database/prisma.service';
// import axios from 'axios';

@Injectable()
export class MercadoPagoService {
    private readonly client: MercadoPagoConfig;
    private prisma: PrismaService;

    constructor() {
        this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN, options: { timeout: 1500000000 } });
        this.prisma = new PrismaService();
    }

    async handleWebhook(notification: any) {
        // return {
        //     payment: notification.payment_id,
        //     status: notification.status,
        //     merchantOrder: notification.merchant_order_id
        // };
    }

    returnFeedback(params: any) {
        throw new Error('Method not implemented.');
    }

    async createPreference(items: CreatePreference) {
        const access_token = 'TEST-1000000000000000-000000000000000-000000000000000000-';
        // const {access_token} = items.type == 'fundraising' ?
        //     await this.prisma.player.findFirst({
        //     where: {
        //         fundraisings: {
        //             some: {
        //                 id: items.id,
        //             },
        //         },
        //     },
        //     select: {
        //         access_token: true,
        //     },
        // }) : await this.prisma.wallet.findFirst({
        //     where: {
        //         marketplace_publication: {
        //             some: {
        //                 id: items.id,
        //             },
        //         },
        //     },
        //     select: {
        //         access_token: true,
        //     },
        // });

        if (!access_token) {
            throw new HttpException('access_token not found', HttpStatus.NOT_FOUND);
        }

        const config = new MercadoPagoConfig({ accessToken: access_token }); // obtenido de app sandbox
        const preference = new Preference(config);

        try {
            const body = {
                expires: false,
                items: [
                    {
                        id: items.type+"-"+items.id,
                        title: items.title,
                        quantity: items.quantity,
                        unit_price: items.unit_price,
                        currency_id: "ARS",
                        category_id: items.type,
                    }
                ],
                back_urls: {
                    success: process.env.APP_URL + "/" + items.type,
                    pending: process.env.APP_URL + "/" + items.type,
                    failure: process.env.APP_URL + "/" + items.type,
                },
                auto_return: 'approved',
                marketplace: process.env.MP_APP_ID,
                marketplace_fee: 10
            };

            const result = await preference.create({ body });
            console.log(result);
            return { id: result.id };   // Le retorna al front el id de la preference, para mostrar el botón de MP
        } catch (error) {
            console.error('Error creating preference:', error);
            throw new HttpException('Ha ocurrido un error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async authorizeSeller(code: string) {
        // Probar este objeto
        console.log(code);
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
            // player.access_token = access_token;
            // player.public_key = public_key;
            // await player.save();
            // Persist access_token and public_key in the Player model
            // player.access_token = access_token;
            // player.public_key = public_key;
            // await player.save();
            return null;
        } catch (error) {
            console.error('Error creating preference:', error);
            throw new HttpException('Ha ocurrido un error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
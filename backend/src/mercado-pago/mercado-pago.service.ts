import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, OAuth, Preference } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';
// import axios from 'axios';

@Injectable()
export class MercadoPagoService {
    private readonly client: MercadoPagoConfig;

    constructor() {
        this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN, options: { timeout: 1500000000 } });
    }

    async createPreference(items: CreatePreference) {
        const preference = new Preference(this.client);

        try {
            console.log(items);
            console.log(this.client);

            const body = {
                expires: false,
                items: [
                    {
                        id: "Prueba",
                        title: items.title,
                        quantity: items.quantity,
                        unit_price: items.unit_price,
                        currency_id: "ARS",
                        category_id: "prueba",
                    }
                ],
                // Las back_urls tienen que ser públicas
                // back_urls: {
                //     success: "https://github.com/Guanart/SIP-2024-grupo-1",
                //     failure: "https://github.com/Guanart/SIP-2024-grupo-1",
                //     pending: "https://github.com/Guanart/SIP-2024-grupo-1",
                // },
                // auto_return: 'approved'
            };

            const result = await preference.create({ body });
            console.log(result);
            return { id: result.id };
        } catch (error) {
            console.error('Error creating preference:', error);
            throw new HttpException('Ha ocurrido un error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async authorizeSeller(code: string) {
        // Probar este objeto
        const oauth = new OAuth(this.client);
        try {
            const body = {
                client_id: process.env.MP_APP_ID,
                client_secret: process.env.MP_ACCESS_TOKEN,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.MP_REDIRECT_URI
            };

            const result = await oauth.create({ body: body });
            console.log(result);
            return null;
        } catch (error) {
            console.error('Error creating preference:', error);
            throw new HttpException('Ha ocurrido un error interno en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // const url = 'https://api.mercadopago.com/oauth/token';
        // const authorizationCode = code;   // AUTHORIZATION_CODE expira en 10 minutos
        // const clientId = process.env.MP_PUBLIC_KEY;
        // const clientSecret = process.env.MP_ACCESS_TOKEN;
        // const redirectUri = process.env.MP_REDIRECT_URI;
        // const grant_type = 'authorization_code';
        // const requestBody = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grant_type}&code=${authorizationCode}&redirect_uri=${redirectUri}`;//&state=<RANDOM_ID>`;

        // try {
        //     const response = await axios.post(url, requestBody, {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //             'Accept': 'application/json'
        //         }
        //     });

        //     console.log(response.data);
        //     const { access_token, public_key, refresh_token, live_mode, user_id, token_type, expires_in, scope } = response.data;
        // } catch (error) {
        //     // Handle the error
        // }
    }
}
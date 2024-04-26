import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CreatePreference } from './create-preference.dto';

@Injectable()
export class MercadoPagoService {
    private readonly client: MercadoPagoConfig;

    constructor() {
        this.client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN, options: { timeout: 1500000000 } });
    }

    async createPreference(items: CreatePreference) {        // TODO: REEMPLAZAR items POR UN DTO PARA AÑADIR VALIDACION
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
}

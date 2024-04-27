import { Controller, Get, Param, Post } from '@nestjs/common';
import { FundraisingService } from './fundraising.service';

@Controller('fundraising')
export class FundraisingController {
    constructor(private readonly fundraisingService: FundraisingService) { }

    @Get()
    async getAllTokensForSale() {
        return this.fundraisingService.getAllFundraisings();
    }

    @Get(':id')
    async getTokenById(@Param('id') id: string) {
        return this.fundraisingService.getFundraisingById(Number(id));
    }

    // @Post(':collectionId/buy')
    // async buyToken(@Param('collectionId') collectionId: string) {
    //     const amount = 2000; // Get the token amount through your application's logic
    //     const preferenceId = await this.fundraisingService.generateMercadoPagoPreference(Number(collectionId), amount);
    //     return { preferenceId };
    // }
}

import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FundraisingService } from './fundraising.service';

@Controller('fundraising')
export class FundraisingController {
  constructor(private readonly fundraisingService: FundraisingService) {}

  @Get()
  async getAllFundraisings() {
    const fundraisings = await this.fundraisingService.getAllFundraisings();
    return JSON.stringify({
      fundraisings,
    });
  }

  @Get('/:id')
  async getFundraisingById(@Param('id') id: string) {
    try {
      const fundraising = await this.fundraisingService.getFundraisingById(
        Number(id),
      );

      if (!fundraising) {
        throw new NotFoundException(`Fundraising ${id} not found`);
      }

      return JSON.stringify({
        message: `Fundraising ${id} found`,
        fundraising,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // @Post(':collectionId/buy')
  // async buyToken(@Param('collectionId') collectionId: string) {
  //     const amount = 2000; // Get the token amount through your application's logic
  //     const preferenceId = await this.fundraisingService.generateMercadoPagoPreference(Number(collectionId), amount);
  //     return { preferenceId };
  // }
}

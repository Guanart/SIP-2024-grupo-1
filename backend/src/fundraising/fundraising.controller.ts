import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,

  // SetMetadata,
  // UseGuards,
} from '@nestjs/common';
import { FundraisingService } from './fundraising.service';
import { CreateFundraisingDto } from './dto/create-fundraising.dto';
import { UpdateFundraisingDto } from './dto/update-fundraising.dto';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
// import { PermissionsGuard } from 'src/auth/permissions.guard';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('fundraising')
export class FundraisingController {
  constructor(
    private readonly fundraisingService: FundraisingService,
    private mercadoPagoService: MercadoPagoService,
  ) {}

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:fundraisings'])
  @Post()
  async startFundraising(
    @Body() newFundraising: CreateFundraisingDto,
  ): Promise<string> {
    try {
      if (newFundraising.initial_price > newFundraising.goal_amount) {
        throw new BadRequestException(
          'Initial price cannot be greater than the goal amount.',
        );
      }

      const fundraising =
        await this.fundraisingService.createFundraising(newFundraising);

      if (typeof fundraising == 'string') {
        throw new BadRequestException(fundraising);
      } else if (!fundraising) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Fundraising ${fundraising.id} created`,
        fundraising,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:fundraisings'])
  @Put('/:fundraising_id')
  async updateFundraising(
    @Param('fundraising_id') fundraising_id: string,
    @Body() updatedFundraising: UpdateFundraisingDto,
  ): Promise<string> {
    try {
      const fundraising = await this.fundraisingService.getFundraisingById(
        Number(fundraising_id),
      );

      if (!fundraising) {
        throw new NotFoundException(`Fundraising ${fundraising_id} not found`);
      }

      if (
        fundraising.collection.current_price < updatedFundraising.initial_price
      ) {
        throw new BadRequestException(
          'The price of the token can only be decreased',
        );
      }

      const currentFundraising =
        await this.fundraisingService.updateFundraising(
          updatedFundraising,
          fundraising,
        );

      return JSON.stringify({
        message: `Fundraising ${fundraising_id} updated`,
        updatedFundraising: currentFundraising,
        fundraising,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      }
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        console.log(exception);
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:fundraisings'])
  @Get()
  async getAllFundraisings() {
    const fundraisings = await this.fundraisingService.getAllFundraisings();
    return JSON.stringify({
      fundraisings,
    });
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:fundraisings'])
  @Get('/:fundraising_id')
  async getFundraisingById(@Param('fundraising_id') fundraising_id: string) {
    try {
      const fundraising = await this.fundraisingService.getFundraisingById(
        Number(fundraising_id),
      );

      if (!fundraising) {
        throw new NotFoundException(`Fundraising ${fundraising_id} not found`);
      }

      return JSON.stringify({
        message: `Fundraising ${fundraising_id} found`,
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

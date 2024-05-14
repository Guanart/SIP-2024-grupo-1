import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  // SetMetadata,
  // UseGuards,
} from '@nestjs/common';
import { MarketplacePublicationService } from './marketplace-publication.service';
import { CreateMarketplacePublicationDto } from './dto/create-marketplace-publication.dto';

// import { PermissionsGuard } from 'src/auth/permissions.guard';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('marketplace')
export class MarketplacePublicationController {
  constructor(
    private readonly marketplacePublicationService: MarketplacePublicationService,
  ) {}

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:publications'])
  // @Post()
  // async createMarketplacePublication(
  //   @Body() newPublication: CreateMarketplacePublicationDto,
  // ): Promise<string> {
  // TODO: Implementar
  //   try {
  //   const publication =
  //     await this.marketplacePublicationService.createMarketplacePublication(
  //       newPublication,
  //     );
  //   if (!publication) {
  //     throw new BadRequestException();
  //   }
  //   return JSON.stringify({
  //     message: `Fundraising ${fundraising.id} created`,
  //     fundraising,
  //   });
  //   } catch (exception) {
  //     if (exception instanceof BadRequestException) {
  //       throw exception;
  //     } else {
  //       throw new InternalServerErrorException('Internal Server Error');
  //     }
  //   }
  // }
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['delete:publications'])
  // @Delete('/:publication_id')
  // async deleteMarketplacePublication(
  //   @Param('publication_id') publication_id: string,
  // ): Promise<string> {
  // TODO: Implementar
  // try {
  // } catch (exception) {
  //   if (exception instanceof BadRequestException) {
  //     throw exception;
  //   }
  //   if (exception instanceof NotFoundException) {
  //     throw exception;
  //   } else {
  //     console.log(exception);
  //     throw new InternalServerErrorException('Internal Server Error');
  //   }
  // }
  // }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:publications'])
  @Get()
  async getAllMarketplacePublications() {
    const publications =
      await this.marketplacePublicationService.getAllMarketplacePublications();

    return JSON.stringify({
      publications,
    });
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:publications'])
  @Get('/:publication_id')
  async getMarkplacePublicationById(
    @Param('publication_id') publication_id: string,
  ) {
    try {
      const publication =
        await this.marketplacePublicationService.getMarkplacePublicationById(
          Number(publication_id),
        );

      if (!publication) {
        throw new NotFoundException(
          `Marketplace publication ${publication_id} not found`,
        );
      }

      return JSON.stringify({
        message: `Marketplace publication ${publication_id} found`,
        publication,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}

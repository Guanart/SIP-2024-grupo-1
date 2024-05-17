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
  @Get('/user/:wallet_id')
  async getUserActiveMarketplacePublications(
    @Param('wallet_id') wallet_id: string,
  ) {
    try {
      const publications =
        await this.marketplacePublicationService.getUserActiveMarketplacePublications(
          Number(wallet_id),
        );

      return JSON.stringify({
        message: `Marketplace publications found`,
        publications,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
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
        return JSON.stringify({
          message: `Marketplace publication not ${publication_id} found`,
          publication: null,
        });
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

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:publications'])
  @Get('/token/:token_id')
  async getMarkplacePublicationByTokenId(@Param('token_id') token_id: string) {
    try {
      const publication =
        await this.marketplacePublicationService.getMarketplacePublicationByTokenId(
          Number(token_id),
        );

      if (!publication) {
        throw new NotFoundException(
          `Marketplace publication for token ${token_id} not found`,
        );
      }

      return JSON.stringify({
        message: `Marketplace publication for token ${token_id} found`,
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

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['delete:publications'])
  @Delete('/:publication_id')
  async deleteMarkplacePublicationById(
    @Param('publication_id') publication_id: string,
  ): Promise<string> {
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

      await this.marketplacePublicationService.deleteMarketplacePublication(
        Number(publication_id),
      );

      return JSON.stringify({
        message: `Marketplace publication ${publication_id} deleted`,
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
  // @SetMetadata('permissions', ['create:publications'])
  @Post()
  async createMarketplacePublication(
    @Body() newPublication: CreateMarketplacePublicationDto,
  ): Promise<string> {
    try {
      const publication =
        await this.marketplacePublicationService.createMarketplacePublication(
          newPublication,
        );
      if (!publication) {
        throw new BadRequestException();
      }
      return JSON.stringify({
        message: `Publication ${publication.publication_id} created`,
        publication,
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
  // @SetMetadata('permissions', ['buy:tokens'])
  @Post('buy/:publication_id/:wallet_id')
  async buyMarketplacePublication(
    @Param('publication_id') publication_id: string,
    @Param('wallet_id') wallet_id: string, //wallet_id es wallet de comprador
  ): Promise<string> {
    try {
      const publication =
        await this.marketplacePublicationService.buyMarketplacePublication(
          Number(publication_id),
          Number(wallet_id),
        );

      if (!publication) {
        throw new NotFoundException(
          `Marketplace publication ${publication_id} not found`,
        );
      }

      return JSON.stringify({
        message: `Publication ${publication.publication_id} bought`,
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

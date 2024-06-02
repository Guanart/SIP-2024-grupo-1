import {
    Controller,
    NotFoundException,
    // UseGuards,
    // SetMetadata,
    BadRequestException,
    InternalServerErrorException,
    Get,
    Param,
  } from '@nestjs/common';
  import { AnalyticsService } from './analytics.service';
  // import { PermissionsGuard } from '../auth/permissions.guard';
  // import { AuthGuard } from '../auth/auth.guard';
  
  @Controller('analytics')
  export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}
  
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:players'])
    @Get("/users/registered")
    async getRegisteredUsers(): Promise<string> {
      try {
        const data = await this.analyticsService.getRegisteredUsers();
  
        return JSON.stringify({
          message: `Users registered data`,
          data,
        });
      } catch (exception) {
        if (
          exception instanceof NotFoundException ||
          exception instanceof BadRequestException
        ) {
          throw exception;
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }

    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:players'])
    @Get("/marketplace/transactions/:start_date/:end_date")
    async getTransactions(
      @Param("start_date") startDateString: string = '',
      @Param("end_date") endDateString: string = ''
    ): Promise<string> {
      try{
        if (!startDateString || !endDateString){
          throw new BadRequestException();
        }
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        
        const data = await this.analyticsService.getTransactions(startDate, endDate);

        return JSON.stringify({
          message: 'Transactions data',
          data
        });
      } catch (exception){
        if (
          exception instanceof NotFoundException ||
          exception instanceof BadRequestException
        ) {
          throw exception;
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }

    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:players'])
    @Get("/marketplace/publications")
    async getAllPublications(): Promise<string> {
      try {
        const data = await this.analyticsService.getAllPublications();
  
        return JSON.stringify({
          message: `Publications data`,
          data,
        });
      } catch (exception) {
        if (
          exception instanceof NotFoundException ||
          exception instanceof BadRequestException
        ) {
          throw exception;
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }

    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:players'])
    @Get("fundraisings/active")
    async getFundraisingsActive(): Promise<string>{
      try {
        const data = await this.analyticsService.getFundraisingsActive();
  
        return JSON.stringify({
          message: `Fundraisiongs actives data`,
          data,
        });
      } catch (exception) {
        if (
          exception instanceof NotFoundException ||
          exception instanceof BadRequestException
        ) {
          throw exception;
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }

    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:players'])
    @Get("fundraisings/by_games")
    async getFundraisingsByGame (): Promise<string>{
      try {
        const data = await this.analyticsService.getFundraisingsByGame();
  
        return JSON.stringify({
          message: `Fundraisings by game data`,
          data,
        });
      } catch (exception) {
        if (
          exception instanceof NotFoundException ||
          exception instanceof BadRequestException
        ) {
          throw exception;
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }
  }
  
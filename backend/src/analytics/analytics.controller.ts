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
  @Get('/users/registered')
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
  @Get('/marketplace/transactions/:start_date/:end_date')
  async getTransactions(
    @Param('start_date') startDateString: string = '',
    @Param('end_date') endDateString: string = '',
  ): Promise<string> {
    try {
      if (!startDateString || !endDateString) {
        throw new BadRequestException();
      }
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      const data = await this.analyticsService.getTransactions(
        startDate,
        endDate,
      );

      return JSON.stringify({
        message: 'Transactions data',
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
  @Get('/marketplace/publications')
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
  @Get('fundraisings/active')
  async getFundraisingsActive(): Promise<string> {
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
  @Get('fundraisings/by_games')
  async getFundraisingsByGame(): Promise<string> {
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

  @Get('/player/wins')
  async getPlayerWithMoreWins(): Promise<string> {
    try {
      const data = await this.analyticsService.getPlayerWithMoreWins();

      return JSON.stringify({
        description: 'Player with the most events won',
        players: [data[0], data[1], data[2]],
        data: [
          `${data[0].wins} events`,
          `${data[1].wins} events`,
          `${data[2].wins} events`,
        ],
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

  @Get('/token/average')
  async getTokensAveragePrice(): Promise<string> {
    try {
      const price = await this.analyticsService.getTokensAveragePrice();

      return JSON.stringify({
        description: 'Average token price',
        average: price,
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

  @Get('events/popular/:game_id')
  async getPopularEventsByGame(
    @Param('game_id') game_id: number,
  ): Promise<string> {
    try {
      const events = await this.analyticsService.getMorePopularEvents(game_id);

      return JSON.stringify({ events });
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

  @Get('games/popular/')
  async getPopularGames(): Promise<string> {
    try {
      const games = await this.analyticsService.getMorePopularGames();

      return JSON.stringify({ games });
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

  @Get('/fundraisings/percentage/:min_limit/:max_limit')
  async getFundraisingsByAmountCollected(
    @Param('min_limit') min_limit: number,
    @Param('max_limit') max_limit: number,
  ): Promise<string> {
    try {
      const fundraisingsCount =
        await this.analyticsService.getFundraisingsByAmountCollected(
          min_limit,
          max_limit,
        );

      return JSON.stringify({ count: fundraisingsCount });
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

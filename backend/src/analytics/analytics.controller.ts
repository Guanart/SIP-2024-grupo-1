import {
  Controller,
  NotFoundException,
  // UseGuards,
  // SetMetadata,
  Query,
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

  /*
  {
   "description":"Fundraisings by player",
   "fundraisings":[
      {
         "id":4,
         "goal_amount":150000,
         "current_amount":50000,
         "prize_percentage":40,
         "risk_level":"LOW",
         "active":false,
         "player_id":1,
         "event_id":5,
         "createdAt":"2024-06-11T14:19:36.608Z",
         "updatedAt":"2024-06-11T14:19:36.608Z",
         "collection":null,
         "event":{
            "id":5,
            "start_date":"2024-05-28T14:19:36.562Z",
            "end_date":"2024-06-04T14:19:36.562Z",
            "max_players":10,
            "prize":2000000,
            "name":"Superleague X",
            "game_id":1,
            "createdAt":"2024-06-11T14:19:36.563Z",
            "updatedAt":"2024-06-11T14:19:36.563Z",
            "active":false,
            "checked":true,
            "player_event":[
               {
                  "player_id":1,
                  "event_id":5,
                  "position":1
               }
            ]
         }
      }
   ]
}
   */

  @Get('/player/fundraisings/:id_player')
  async getFundraisingsByPlayer(
    @Param("id_player") idPlayer: number,
    @Query('dateFrom') dateFrom?: Date,
    @Query('dateTo') dateTo?: Date,
  ): Promise<string> {
    try {
      const data = await this.analyticsService.getFundraisingsByPlayer(idPlayer, dateFrom, dateTo);
      if (!data){
        throw new BadRequestException();
      }
      const cantFundraisings = data.length;
      let cantWon = 0;
      data.forEach(fundraising => {
        if (fundraising.event.player_event[0].position === 1) {
          cantWon++;
        }
      });
      
      let summaryTokenPrize = 0;
      let winnedFundraisings = 0;
      data.forEach(fundraising => {
        if (fundraising.collection) {
          summaryTokenPrize = summaryTokenPrize + fundraising.collection.token_prize_percentage;
        }
        if (fundraising.event.player_event[0].position == 1) {
          winnedFundraisings++
        }
      });
      
      return JSON.stringify({
        description: 'Fundraisings by player',
        fundraisings: data,
        summary: {
          cantFundraisings: cantFundraisings,
          cantWon: cantWon,
          winPercentage: cantWon / cantFundraisings,
          averageTokenPrizePercentage: summaryTokenPrize / cantFundraisings
        }
      });
    } catch (exception){
      console.log(exception);
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

  /*
  @Get('/event/summary/:event_name')
  async getEventSummary(
    @Query('event_name') eventName: string,
  ): Promise<string> {
    try {
      const data = await this.analyticsService.getEventsByName(eventName);
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
    */

  @Get('/player/wins')
  async getPlayerWithMoreWins(
    @Query('nPlayers') nPlayers?: number,
  ): Promise<string> {
    try {
      if (nPlayers == null || isNaN(nPlayers) ) {
        nPlayers = 3;
      }
      
      const data = await this.analyticsService.getNPlayersWithMoreWins(nPlayers);

      const resultPlayers = [];
      const resultWins = [];

      for (let i = 0; i < nPlayers; i++) {
        // playerID del jugador nro i de la lista
        const player = data[i];
        const wins = data[i].wins;
        if (player){
          resultPlayers.push(player);
          resultWins.push(`${wins} events`);
        }
      }
      

      return JSON.stringify({
        description: 'Player with the most events won',
        players: resultPlayers,
        data: resultWins,
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

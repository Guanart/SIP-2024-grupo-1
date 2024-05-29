import {
  Controller,
  NotFoundException,
  Body,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  Put,
  InternalServerErrorException,
  Get,
  Param,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { UpdatePlayerDto } from './dto/update-player.dto';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:players'])
  @Put('/')
  async update(@Body() updatedPlayer: UpdatePlayerDto): Promise<string> {
    try {
      const player = await this.playerService.update(updatedPlayer);

      if (!player) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Player ${updatedPlayer.player_id} updated`,
        player,
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

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:players'])

  @Get('/game/:game_id')
  async getPlayersByGame(@Param('game_id') game_id: string): Promise<string> {
    try {
      const players = await this.playerService.getPlayersByGame(
        Number(game_id),
      );

      if (!players || players.length === 0) {
        return JSON.stringify({
          message: `There is no players for game ${game_id}`,
          players: [],
        });
      }

      return JSON.stringify({
        message: `Players for game ${game_id} founded`,
        players,
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

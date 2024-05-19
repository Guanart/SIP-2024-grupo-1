import {
  Controller,
  Get,
  Post,
  Body,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { DeleteGameDto } from './dto/delete-game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:games'])
  @Get()
  async getAllGames() {
    const games = await this.gameService.getAllGames();
    return JSON.stringify({
      games,
    });
  }

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:games'])
  @Post()
  async create(@Body() newGame: CreateGameDto): Promise<string> {
    try {
      const game = await this.gameService.create(newGame.name, newGame.icon);

      if (!game) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Game ${game.id} created`,
        game,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['delete:games'])
  @Delete()
  async delete(@Body() deletedGame: DeleteGameDto): Promise<string> {
    try {
      const { id } = deletedGame;
      const game = await this.gameService.delete(Number(id));

      if (!game) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Game ${game.id} deleted`,
        game,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}

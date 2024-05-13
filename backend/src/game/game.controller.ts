import {
  Controller,
  Get,
  NotFoundException,
  Param,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  // Delete,
  InternalServerErrorException,
} from '@nestjs/common';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(
    private gameService: GameService,
  ) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:tokens'])
  @Get()
  async getAllGames() {
    const games = await this.gameService.getAllGames();
    return JSON.stringify({
      games,
    });
  }
}

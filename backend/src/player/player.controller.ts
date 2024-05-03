import {
  Controller,
  NotFoundException,
  Body,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  Put,
  InternalServerErrorException,
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
  // @SetMetadata('permissions', ['update:player'])
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
}

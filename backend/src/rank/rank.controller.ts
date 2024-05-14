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
import { RankService} from './rank.service';

@Controller('rank')
export class RankController {
  constructor(
    private rankService: RankService,
  ) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:tokens'])
  @Get()
  async getAllRanks() {
    const ranks = await this.rankService.getAllRanks();
    return JSON.stringify({
      ranks,
    });
  }
}

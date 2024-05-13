import {
  Controller,
  Get,
  NotFoundException,
  Param,
  // UseGuards,
  // SetMetadata,
  InternalServerErrorException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/wallet.entity';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { TokenService } from './token.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';

@Controller('token')
export class TokenController {
  constructor(
    private walletService: WalletService,
    private tokenService: TokenService,
  ) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:tokens'])
  @Get('/valuable/:auth0_id')
  async getMostValuableTokens(
    @Param('auth0_id') auth0_id: string,
  ): Promise<string> {
    try {
      const wallet: Wallet = await this.walletService.findOneByUserId(auth0_id);

      if (!wallet) {
        throw new NotFoundException(`Wallet not found`);
      }

      const mostValuableTokens = await this.tokenService.getMostValuableTokens(
        wallet.id,
      );

      return JSON.stringify({
        message: `Wallet ${wallet.id} tokens found`,
        tokens: mostValuableTokens,
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

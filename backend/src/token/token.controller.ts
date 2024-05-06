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
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/wallet.entity';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(
    private walletService: WalletService,
    private tokenService: TokenService,
  ) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:tokens'])
  @Get('/valuable/:wallet_id')
  async getMostValuableTokens(
    @Param('wallet_id') wallet_id: string,
  ): Promise<string> {
    try {
      if (isNaN(parseInt(wallet_id))) {
        throw new BadRequestException('Invalid wallet ID');
      }

      const wallet: Wallet = await this.walletService.findOne(
        parseInt(wallet_id),
      );

      if (!wallet) {
        throw new NotFoundException(`Wallet not found`);
      }

      const mostValuableTokens = await this.tokenService.getMostValuableTokens(
        parseInt(wallet_id),
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

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:wallets'])
  @Get('/:wallet_id')
  async findOne(@Param('wallet_id') wallet_id: string): Promise<string> {
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

      return JSON.stringify({
        message: `Wallet ${wallet.id} found`,
        wallet,
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

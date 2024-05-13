import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  Put,
  // Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { CreateWalletDto } from './dto';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { UpdateWalletDto } from './dto/update-wallet.dto';
// import { DeleteWalletDto } from './dto/delete-wallet-dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:wallets'])
  @Post()
  async create(@Body() newWallet: CreateWalletDto): Promise<string> {
    try {
      const wallet: Wallet = await this.walletService.create(newWallet);

      if (!wallet) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Wallet created for the user ${newWallet.user_id}`,
        wallet,
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

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:wallets'])
  @Put('/')
  async update(@Body() updatedWallet: UpdateWalletDto): Promise<string> {
    try {
      const { wallet_id } = updatedWallet;

      let wallet: Wallet = await this.walletService.findOne(wallet_id);

      if (!wallet) {
        throw new NotFoundException(`Wallet not found`);
      }

      wallet = await this.walletService.update(updatedWallet);

      if (!wallet) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Wallet ${wallet.id} updated`,
        wallet,
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

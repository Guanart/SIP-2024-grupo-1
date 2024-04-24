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
    Delete,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { WalletService } from './wallet.service';
  import { Wallet } from './wallet.entity';
  import { CreateWalletDto } from './dto';
  // import { PermissionsGuard } from '../auth/permissions.guard';
  // import { AuthGuard } from '../auth/auth.guard';
  import { UpdateWalletDto } from './dto/update-wallet.dto';
  import { DeleteWalletDto } from './dto/delete-wallet-dto';
  
  @Controller('user')
  export class WalletController {
    constructor(private walletService: WalletService) {}
  
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['create:Users'])
    @Post()
    async create(@Body() newWallet: CreateWalletDto): Promise<string> {
      try {
        const wallet: Wallet = await this.walletService.create(newWallet);
  
        if (!wallet) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `User ${newWallet.user_id} created`,
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
    // @SetMetadata('permissions', ['read:users'])
    @Get('/:auth0_id')
    async findOne(@Param('user_id') user_id: number): Promise<string> {
      try {
        const wallet: Wallet = await this.walletService.findOne(user_id);
  
        if (!wallet) {
          throw new NotFoundException(`User ${user_id} not found`);
        }
  
        return JSON.stringify({
          message: `User ${user_id} found`,
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
    // @SetMetadata('permissions', ['update:users'])
    @Put('/')
    async update(@Body() updatedWallet: UpdateWalletDto): Promise<string> {
      try {
        let wallet: Wallet = await this.walletService.findOne(updatedWallet.user_id);
  
        if (!wallet) {
          throw new NotFoundException(`Wallet ${updatedWallet.user_id} not found`);
        }
  
        wallet = await this.walletService.update(updatedWallet);
  
        if (!wallet) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `Wallet ${updatedWallet.user_id} updated`,
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
    // @SetMetadata('permissions', ['delete:users'])
    @Delete('/')
    async delete(@Body() deletedWallet: DeleteWalletDto): Promise<string> {
      try {
        let wallet: Wallet = await this.walletService.findOne(deletedWallet.id);
  
        if (!wallet) {
          throw new NotFoundException();
        }
  
        wallet = await this.walletService.delete(deletedWallet);
  
        if (!wallet) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `Wallet ${deletedWallet.id} deleted`,
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
  
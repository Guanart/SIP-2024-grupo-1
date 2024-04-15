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
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DeleteAccountDto } from './dto/delete-account-dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:accounts'])
  @Post()
  async create(@Body() newAccount: CreateAccountDto): Promise<string> {
    try {
      const account: Account = await this.accountService.create(newAccount);

      if (!account) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Account ${newAccount.auth0_id} created`,
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
  // @SetMetadata('permissions', ['read:accounts'])
  @Get('/:auth0_id')
  async findOne(@Param('auth0_id') auth0_id: string): Promise<string> {
    try {
      const account: Account = await this.accountService.findOne(auth0_id);

      if (!account) {
        throw new NotFoundException(`Account ${auth0_id} not found`);
      }

      return JSON.stringify({
        message: 'Account found',
        account,
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
  // @SetMetadata('permissions', ['update:accounts'])
  @Put('/')
  async update(@Body() updatedAccount: UpdateAccountDto): Promise<string> {
    try {
      let account: Account = await this.accountService.findOne(
        updatedAccount.auth0_id,
      );

      if (!account) {
        throw new NotFoundException(
          `Account ${updatedAccount.auth0_id} not found`,
        );
      }

      account = await this.accountService.update(updatedAccount);

      if (!account) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Account ${updatedAccount.auth0_id} updated`,
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
  // @SetMetadata('permissions', ['delete:accounts'])
  @Delete('/')
  async delete(@Body() deletedAccount: DeleteAccountDto): Promise<string> {
    try {
      let account: Account = await this.accountService.findOne(
        deletedAccount.auth0_id,
      );

      if (!account) {
        throw new NotFoundException();
      }

      account = await this.accountService.delete(deletedAccount);

      if (!account) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `Account ${deletedAccount.auth0_id} deleted`,
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

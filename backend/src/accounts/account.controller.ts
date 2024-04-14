import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  // UseGuards,
  // SetMetadata,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:accounts'])
  @Post()
  async create(@Body() newAccount: CreateAccountDto): Promise<void> {
    this.accountService.create(newAccount);
  }

  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:accounts'])
  @Get('/:auth0_id')
  async findOne(@Param('auth0_id') auth0_id: string): Promise<Account> {
    const account: Account = await this.accountService.findOne(auth0_id);

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }
}

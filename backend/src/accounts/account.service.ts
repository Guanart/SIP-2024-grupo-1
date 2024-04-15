import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateAccountDto } from './dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DeleteAccountDto } from './dto/delete-account-dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateAccountDto): Promise<Account> {
    const createdAccount = await this.prisma.account.create({
      data: userData,
    });

    // Luego de crear la account, crea también el usuario asociado a esa account
    await this.prisma.user.create({
      data: {
        account_id: createdAccount.account_id,
        biography: '',
      },
    });

    return createdAccount;
  }

  async findOne(auth0_id: string): Promise<Account> {
    const account: Account = await this.prisma.account.findUnique({
      where: {
        auth0_id,
      },
    });

    return account;
  }

  async update({
    biography,
    username,
    country,
    avatar,
    auth0_id,
  }: UpdateAccountDto): Promise<Account> {
    const updatedAccount = await this.prisma.account.update({
      where: {
        auth0_id,
      },
      data: { username, avatar },
    });

    await this.prisma.user.update({
      where: { account_id: updatedAccount.account_id },
      data: {
        biography,
      },
    });

    // TODO: actualizar relación USER_COUNTRY
    console.log(country);

    return updatedAccount;
  }

  async delete({ auth0_id }: DeleteAccountDto): Promise<Account> {
    const deletedAccount = await this.prisma.account.delete({
      where: {
        auth0_id,
      },
    });

    return deletedAccount;
  }
}

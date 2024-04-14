import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create({ auth0_id, email, username }): Promise<Account | null> {
    const createdAccount = await this.prisma.account.create({
      data: {
        auth0_id,
        email,
        username,
      },
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

  async findOne(auth0_id: string): Promise<Account | null> {
    const account: Account = await this.prisma.account.findUnique({
      where: {
        auth0_id,
      },
    });

    return account;
  }
}

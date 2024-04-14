import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create({ auth0_id, email, username }) {
    const createdAccount = await this.prisma.account.create({
      data: {
        auth0_id,
        email,
        username,
      },
    });

    const createdUser = await this.prisma.user.create({
      data: {
        account_id: createdAccount.account_id,
        biography: '',
      },
    });

    console.log(createdUser);

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

import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  private accounts: Account[] = [
    {
      account_id: 1,
      email: 'testing@home.com',
      auth0_id: 'auth0|123456',
      username: 'test-user',
    },
  ];

  create({ auth0_id, email, username }) {
    const account: Account = {
      auth0_id,
      email,
      username,
    };

    this.accounts.push(account);
  }

  findOne(id: string): Account | null {
    const account = this.accounts.filter((account) => {
      return account.auth0_id === id;
    });

    if (account.length === 0) {
      return null;
    }

    return account[0];
  }

  // update() {}

  // delete() {}
}

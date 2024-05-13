import { User } from '../user/user.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Token } from 'src/token/token.entity';

type Token_wallet = {
  token_id: number;
  wallet_id: number;
  Token: Token;
  Wallet: Wallet;
};

export class Wallet {
  id: number;
  user_id: number;
  cbu: string;
  paypal_id: string;
  user: User;
  transactions: Transaction[];
  token_wallet: Token_wallet[];

  public constructor(
    id: number,
    user_id: number,
    cbu: string,
    paypal_id: string,
    user: User,
    transactions: Transaction[],
    token_wallet: Token_wallet[],
  ) {
    this.id = id;
    this.user_id = user_id;
    this.cbu = cbu;
    this.paypal_id = paypal_id;
    this.user = user;
    this.transactions = transactions;
    this.token_wallet = token_wallet;
  }

  public static fromObject(object: { [key: string]: unknown }): Wallet {
    const { id, cbu, user_id, paypal_id, user, transactions, token_wallet } =
      object;

    if (!id) throw 'ID property is required';
    if (!user_id) throw 'User ID property is required';
    if (!cbu) throw 'CBU property is required';
    if (!paypal_id) throw 'PayPal ID property is required';

    const wallet = new Wallet(
      id as number,
      user_id as number,
      cbu as string,
      paypal_id as string,
      user as User,
      transactions as Transaction[],
      token_wallet as Token_wallet[],
    );
    return wallet;
  }
}

import { User } from '../user/user.entity';
export class Wallet {
  id: number;
  user_id: number;
  cbu: string;
  paypal_id: string;
  user: User;

  public constructor(
    id: number,
    user_id: number,
    cbu: string,
    paypal_id: string,
    user: User,
  ) {
    this.id = id;
    this.user_id = user_id;
    this.cbu = cbu;
    this.paypal_id = paypal_id;
    this.user = user;
  }

  public static fromObject(object: { [key: string]: unknown }): Wallet {
    const { id, cbu, user_id, paypal_id, user } = object;

    if (!id) throw 'ID property is required';
    if (!user_id) throw 'User ID property is required';
    if (!cbu) throw 'CBU property is required';
    if (!paypal_id) throw 'PayPal ID property is required';

    const todo = new Wallet(
      id as number,
      user_id as number,
      cbu as string,
      paypal_id as string,
      user as User,
    );
    return todo;
  }
}

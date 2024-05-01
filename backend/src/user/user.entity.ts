import { Wallet } from 'src/wallet/wallet.entity';

export class User {
  id: number;
  auth0_id: string;
  email: string;
  username: string;
  avatar?: string;
  wallet: Wallet;

  public constructor(
    id: number,
    auth0_id: string,
    email: string,
    username: string,
    avatar: string,
    wallet: Wallet,
  ) {
    this.id = id;
    this.auth0_id = auth0_id;
    this.email = email;
    this.username = username;
    this.avatar = avatar;
    this.wallet = wallet;
  }

  public static fromObject(object: { [key: string]: unknown }): User {
    const { id, auth0_id, email, username, avatar, wallet } = object;

    if (!id) throw 'ID property is required';
    if (!username) throw 'Username property is required';
    if (!auth0_id) throw 'Auth0 ID property is required';
    if (!email) throw 'Email property is required';
    if (!avatar) throw 'Avatar property is required';

    const user = new User(
      id as number,
      auth0_id as string,
      email as string,
      username as string,
      avatar as string,
      wallet as Wallet,
    );

    return user;
  }
}

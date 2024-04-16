export class Account {
  account_id?: number;
  email: string;
  avatar: string;
  auth0_id: string;
  username: string;
}

export class User {
  account_id: number;
  biography: string;
  user_id?: number;
}

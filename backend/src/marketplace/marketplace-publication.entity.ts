import { Wallet } from 'src/wallet/wallet.entity';
import { Token } from 'src/token/token.entity';

export class MarketplacePublication {
  id: number;
  price: number;
  active: boolean;
  date: Date;
  token_id: number;
  out_wallet_id: number;
  out_wallet?: Wallet;
  in_wallet?: Wallet;
  token?: Token;

  public constructor(
    id: number,
    price: number,
    active: boolean,
    token_id: number,
    out_wallet_id: number,
    out_wallet?: Wallet,
    in_wallet?: Wallet,
    token?: Token,
  ) {
    this.id = id;
    this.price = price;
    this.active = active;
    this.token_id = token_id;
    this.out_wallet_id = out_wallet_id;
    this.out_wallet = out_wallet;
    this.in_wallet = in_wallet;
    this.token = token;
  }

  public static fromObject(object: {
    [key: string]: unknown;
  }): MarketplacePublication {
    const {
      id,
      price,
      active,
      token_id,
      out_wallet_id,
      out_wallet,
      in_wallet,
      token,
    } = object;

    if (!id) throw 'ID property is required';
    if (!price) throw 'Price property is required';
    if (!token_id) throw 'Token ID property is required';
    if (!out_wallet_id) throw 'Out wallet ID  property is required';

    const marketplacePublication = new MarketplacePublication(
      id as number,
      price as number,
      active as boolean,
      token_id as number,
      out_wallet_id as number,
      out_wallet as Wallet,
      in_wallet as Wallet,
      token as Token,
    );

    return marketplacePublication;
  }
}

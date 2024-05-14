import { Wallet } from 'src/wallet/wallet.entity';
import { Token } from 'src/token/token.entity';

export class MarketplacePublication {
  publication_id: number;
  price: number;
  active: boolean;
  date: Date;
  token_id: number;
  out_wallet_id: number;
  out_wallet?: Wallet;
  in_wallet?: Wallet;
  token?: Token;

  public constructor(
    publication_id: number,
    price: number,
    date: Date,
    active: boolean,
    token_id: number,
    out_wallet_id: number,
    out_wallet?: Wallet,
    in_wallet?: Wallet,
    token?: Token,
  ) {
    this.publication_id = publication_id;
    this.price = price;
    this.active = active;
    this.date = date;
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
      publication_id,
      price,
      date,
      active,
      token_id,
      out_wallet_id,
      out_wallet,
      in_wallet,
      token,
    } = object;

    if (!publication_id) throw 'Publication ID property is required';
    if (!price) throw 'Price property is required';
    if (!token_id) throw 'Token ID property is required';
    if (!out_wallet_id) throw 'Out wallet ID  property is required';

    const marketplacePublication = new MarketplacePublication(
      publication_id as number,
      price as number,
      date as Date,
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

import { Fundraising } from 'src/fundraising/fundraising.entity';

export class Collection {
  id: number;
  token_price_percentage: number;
  amount_left: number;
  current_price: number;
  initial_amount: number;
  initial_price: number;
  fundraising: Fundraising;

  public constructor(
    id: number,
    token_price_percentage: number,
    amount_left: number,
    current_price: number,
    initial_amount: number,
    initial_price: number,
    fundraising: Fundraising,
  ) {
    this.id = id;
    this.token_price_percentage = token_price_percentage;
    this.amount_left = amount_left;
    this.current_price = current_price;
    this.initial_amount = initial_amount;
    this.initial_price = initial_price;
    this.fundraising = fundraising;
  }

  public static fromObject(object: { [key: string]: unknown }): Collection {
    const {
      id,
      token_price_percentage,
      amount_left,
      current_price,
      initial_amount,
      initial_price,
      fundraising,
    } = object;

    if (!id) throw 'ID property is required';
    if (!token_price_percentage)
      throw 'Token price percentage property is required';
    if (!amount_left) throw 'Amount left property is required';
    if (!current_price) throw 'Current price property is required';
    if (!initial_amount) throw 'Initial amount property is required';
    if (!initial_price) throw 'Initial price property is required';

    const collection = new Collection(
      id as number,
      token_price_percentage as number,
      amount_left as number,
      current_price as number,
      initial_amount as number,
      initial_price as number,
      fundraising as Fundraising,
    );

    return collection;
  }
}

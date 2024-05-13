import { Fundraising } from 'src/fundraising/fundraising.entity';

export class Collection {
  id: number;
  token_prize_percentage: number;
  amount_left: number;
  current_price: number;
  initial_amount: number;
  previous_price: number;
  fundraising: Fundraising;

  public constructor(
    id: number,
    token_prize_percentage: number,
    amount_left: number,
    current_price: number,
    initial_amount: number,
    previous_price: number,
    fundraising: Fundraising,
  ) {
    this.id = id;
    this.token_prize_percentage = token_prize_percentage;
    this.amount_left = amount_left;
    this.current_price = current_price;
    this.initial_amount = initial_amount;
    this.previous_price = previous_price;
    this.fundraising = fundraising;
  }

  public static fromObject(object: { [key: string]: unknown }): Collection {
    const {
      id,
      token_prize_percentage,
      amount_left,
      current_price,
      initial_amount,
      previous_price,
      fundraising,
    } = object;

    if (!id) throw 'ID property is required';
    if (!token_prize_percentage)
      throw 'Token price percentage property is required';
    if (!amount_left) throw 'Amount left property is required';
    if (!current_price) throw 'Current price property is required';
    if (!initial_amount) throw 'Initial amount property is required';
    if (!previous_price) throw 'Initial price property is required';

    const collection = new Collection(
      id as number,
      token_prize_percentage as number,
      amount_left as number,
      current_price as number,
      initial_amount as number,
      previous_price as number,
      fundraising as Fundraising,
    );

    return collection;
  }
}

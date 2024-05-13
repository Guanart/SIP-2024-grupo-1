import { Wallet } from "@prisma/client";

export class Transaction {
    id: number;
    wallet_id: number;
    token_id: number;
    type_id: number;
    timestamp: Date;
    wallet: Wallet;

    public constructor(
      id: number,
      wallet_id: number,
      token_id: number,
      type_id: number,
      timestamp: Date,
      wallet: Wallet,
    ) {
      this.id = id;
      this.wallet_id = wallet_id;
      this.token_id = token_id;
      this.type_id = type_id;
      this.timestamp = timestamp;
      this.wallet = wallet;
    }

    public static fromObject(object: { [key: string]: unknown }): Transaction {
      const {  id, wallet_id, token_id, type_id, timestamp, wallet} = object;
  
      if (!id) throw 'ID property is required';
      if (!wallet_id) throw 'Wallet ID property is required';
      if (!token_id) throw 'Token ID property is required';
      if (!type_id) throw 'Type ID property is required';
      if (!timestamp) throw 'Timestamp ID property is required';
      if (!wallet) throw 'Wallet property is required';
  
      const todo = new Transaction(
        id as number,
        wallet_id as number,
        token_id as number,
        type_id as number,
        timestamp as Date,
        wallet as Wallet,
      );
      return todo;
    }
  }
  
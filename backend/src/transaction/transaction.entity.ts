import { TransactionType, Wallet } from "@prisma/client";

export class Transaction {
    id: number;
    wallet_id: number;
    token_id: number;
    type: TransactionType;
    timestamp: Date;
    wallet: Wallet;

    public constructor(
      id: number,
      wallet_id: number,
      token_id: number,
      type: TransactionType,
      timestamp: Date,
      wallet: Wallet,
    ) {
      this.id = id;
      this.wallet_id = wallet_id;
      this.token_id = token_id;
      this.type = type;
      this.timestamp = timestamp;
      this.wallet = wallet;
    }

    public static fromObject(object: { [key: string]: unknown }): Transaction {
      const {  id, wallet_id, token_id, type, timestamp, wallet} = object;
  
      if (!id) throw 'ID property is required';
      if (!wallet_id) throw 'Wallet ID property is required';
      if (!token_id) throw 'Token ID property is required';
      if (!type) throw 'Type property is required';
      if (!timestamp) throw 'Timestamp ID property is required';
      if (!wallet) throw 'Wallet property is required';
  
      const todo = new Transaction(
        id as number,
        wallet_id as number,
        token_id as number,
        type as TransactionType,
        timestamp as Date,
        wallet as Wallet,
      );
      return todo;
    }
  }
  
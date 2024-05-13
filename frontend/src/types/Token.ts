import { Collection } from './Collection';

export interface Token {
	collection: Collection;
	id: number;
	price: number;
}

export interface Token_wallet {
	token_id: number;
	wallet_id: number;
	token: Token;
}

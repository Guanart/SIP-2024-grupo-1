import { Wallet } from './Wallet';
import { Token } from './Token';

export interface MarketplacePublication {
	publication_id: number;
	price: number;
	active: boolean;
	date: Date;
	token_id: number;
	out_wallet_id: number;
	out_wallet: Wallet;
	in_wallet?: Wallet;
	token: Token;
}

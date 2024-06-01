import { User } from './User';

export interface Wallet {
	id: number;
	user_id: string;
	user?: User;
	public_key: string;
}

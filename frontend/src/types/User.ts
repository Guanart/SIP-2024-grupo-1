import { Wallet } from '.';
import { Player } from './Player';
export interface User {
	auth0_id: string;
	id: number;
	avatar: string;
	username: string;
	email: string;
	biography?: string;
	createdAt: Date;
	updatedAt: Date;
	player?: Player;
	wallet?: Wallet;
}

export interface UpdatedUser {
	auth0_id?: string;
	username?: string;
	avatar?: string;
}

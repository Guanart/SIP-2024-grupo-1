import { User } from './User';
import { Game } from './Game';
import { Rank } from './Rank';

export interface Player {
	id: number;
	user_id: number;
	game_id: number;
	game: Game;
	ranking: {
		id: number;
		description: string;
	};
	rank: Rank;
	biography: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
	public_key: string;
	user: User;
}

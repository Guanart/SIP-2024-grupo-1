import { User } from './User';
import { Game } from './Game';

export interface Player {
	id: number;
	user_id: number;
	game_id: number;
	game: Game;
	ranking: number;
	biography: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
	user: User;
}

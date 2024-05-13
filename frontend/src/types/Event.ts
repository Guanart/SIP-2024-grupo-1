import { Game } from './Game';

export interface Event {
	id: number;
	start_date: Date;
	end_date: Date;
	max_players: number;
	prize: number;
	game_id: number;
	game: Game;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	active: boolean;
}

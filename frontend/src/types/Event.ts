import { Game } from './Game';
import { Player } from './Player';

export interface PlayerEvent {
	player_id: number;
	event_id: number;
	position: number;
	player: Player;
}

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
	player_event: PlayerEvent[];
}

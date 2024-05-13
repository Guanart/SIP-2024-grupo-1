import { Collection } from './Collection';
import { Event } from './Event';
import { Player } from './Player';

export interface Fundraising {
	id: number;
	player_id: number;
	event_id: number;
	goal_amount: number;
	current_amount: number;
	prize_percentage: number;
	risk_level: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
	collection: Collection;
	event: Event;
	player: Player;
}

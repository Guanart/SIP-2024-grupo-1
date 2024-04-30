export interface Player {
	id: number;
	user_id: number;
	game_id: number;
	// game: Game;
	// user: User;
	ranking: number;
	biography: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

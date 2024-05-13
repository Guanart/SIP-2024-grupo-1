import { Game } from "./Game";
import { Rank } from "./Rank";
import { User } from "./User";

export interface VerificationRequest {
	user: User;
    game: Game;
    rank: Rank;
    filepath: string;
}

/*
      this.id = id;
      this.user = user;
      this.game = game;
      this.status = status;
      this.rank = rank;
      this.filepath = filepath;
      this.createdAt = createdAt;
*/
import { Game } from "./Game";
import { Rank } from "./Rank";
import { User } from "./User";

export interface VerificationRequest {
    id?: number;
	user: User;
    game: Game;
    rank: Rank;
    createdAt?: Date;
    //status?: string;
    
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
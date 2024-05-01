// model Player {
//     ranking      Int
//     game_id      Int
//     game         Game          @relation(fields: [game_id], references: [id])
//     active       Boolean       @default(true)
//     createdAt    DateTime      @default(now())
//     updatedAt    DateTime      @updatedAt
//   }

import { Fundraising } from 'src/fundraising/fundraising.entity';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';

export class Player {
  id: number;
  biography: string;
  ranking: number;
  user: User;
  game: Game;
  fundraisings: Fundraising[];

  public constructor(
    id: number,
    biography: string,
    ranking: number,
    game: Game,
    user: User,
    fundraisings: Fundraising[],
  ) {
    this.id = id;
    this.biography = biography;
    this.ranking = ranking;
    this.game = game;
    this.user = user;
    this.fundraisings = fundraisings;
  }

  public static fromObject(object: { [key: string]: unknown }): Player {
    const { id, biography, ranking, game, user, fundraisings } = object;

    if (!id) throw 'ID property is required';
    if (!biography) throw 'Biography property is required';
    if (!ranking) throw 'Ranking property is required';

    const player = new Player(
      id as number,
      biography as string,
      ranking as number,
      game as Game,
      user as User,
      fundraisings as Fundraising[],
    );

    return player;
  }
}

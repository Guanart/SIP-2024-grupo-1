import { Fundraising } from 'src/fundraising/fundraising.entity';
import { Game } from 'src/game/game.entity';

export class Event {
  id: number;
  start_date: Date;
  end_date: Date;
  max_players: number;
  prize: number;
  name: string;
  game: Game;
  fundraisings: Fundraising[];

  public constructor(
    id: number,
    start_date: Date,
    end_date: Date,
    max_players: number,
    prize: number,
    name: string,
    game: Game,
    fundraisings: Fundraising[],
  ) {
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.prize = prize;
    this.max_players = max_players;
    this.name = name;
    this.game = game;
    this.fundraisings = fundraisings;
  }

  public static fromObject(object: { [key: string]: unknown }): Event {
    const {
      id,
      start_date,
      end_date,
      max_players,
      prize,
      name,
      game,
      fundraisings,
    } = object;

    if (!id) throw 'ID property is required';
    if (!start_date) throw 'Start date property is required';
    if (!end_date) throw 'End date property is required';
    if (!max_players) throw 'Max player property is required';
    if (!prize) throw 'Prize property is required';
    if (!name) throw 'Name property is required';

    const event = new Event(
      id as number,
      start_date as Date,
      end_date as Date,
      max_players as number,
      prize as number,
      name as string,
      game as Game,
      fundraisings as Fundraising[],
    );

    return event;
  }
}

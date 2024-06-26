import { Fundraising } from 'src/fundraising/fundraising.entity';
import { Game } from 'src/game/game.entity';
import { Player } from '../player/player.entity';

type PlayerEvent = {
  player_id: number;
  event_id: number;
  position: number;
  player: Player;
  event: Event;
};

export class Event {
  id: number;
  start_date: Date;
  end_date: Date;
  max_players: number;
  prize: number;
  name: string;
  game: Game;
  fundraisings: Fundraising[];
  player_event: PlayerEvent[];
  active?: boolean;

  public constructor(
    id: number,
    start_date: Date,
    end_date: Date,
    max_players: number,
    prize: number,
    name: string,
    game: Game,
    fundraisings: Fundraising[],
    player_event: PlayerEvent[],
    active: boolean,
  ) {
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.prize = prize;
    this.max_players = max_players;
    this.name = name;
    this.game = game;
    this.fundraisings = fundraisings;
    this.player_event = player_event;
    this.active = active;
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
      player_event,
      active,
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
      player_event as PlayerEvent[],
      active as boolean,
    );

    return event;
  }
}

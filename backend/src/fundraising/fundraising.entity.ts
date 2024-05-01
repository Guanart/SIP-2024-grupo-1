import { Player } from '../player/player.entity';
import { Event } from '../event/event.entity';
import { Collection } from '../collection/collection.entity';

export class Fundraising {
  id: number;
  goal_amount: number;
  current_amount: number;
  prize_percentage: number;
  risk_level: string;
  player: Player;
  event: Event;
  collection: Collection;

  public constructor(
    id: number,
    goal_amount: number,
    current_amount: number,
    prize_percentage: number,
    risk_level: string,
    player: Player,
    event: Event,
    collection: Collection,
  ) {
    this.id = id;
    this.goal_amount = goal_amount;
    this.current_amount = current_amount;
    this.prize_percentage = prize_percentage;
    this.risk_level = risk_level;
    this.player = player;
    this.collection = collection;
    this.event = event;
  }

  public static fromObject(object: { [key: string]: unknown }): Fundraising {
    const {
      id,
      goal_amount,
      current_amount,
      prize_percentage,
      risk_level,
      player,
      collection,
      event,
    } = object;

    if (!id) throw 'ID property is required';
    if (!goal_amount) throw 'Goal amount property is required';
    if (!prize_percentage) throw 'Prize percentage property is required';
    if (!event) throw 'Event property is required';

    const fundraising = new Fundraising(
      id as number,
      goal_amount as number,
      current_amount as number,
      prize_percentage as number,
      risk_level as string,
      player as Player,
      event as Event,
      collection as Collection,
    );

    return fundraising;
  }
}

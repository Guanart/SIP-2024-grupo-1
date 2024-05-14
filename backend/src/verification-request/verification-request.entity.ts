import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { RequestStatus } from '@prisma/client';
export class VerificationRequest {

  id: number;
  user?: User;
  game?: Game;
  status: RequestStatus;
  rank?: string;
  filepath: string;
  createdAt: Date;

  public constructor(  
    id: number,
    user: User,
    game: Game,
    status: RequestStatus,
    rank: string,
    filepath: string,
    createdAt: Date) {
      this.id = id;
      this.user = user;
      this.game = game;
      this.status = status;
      this.rank = rank;
      this.filepath = filepath;
      this.createdAt = createdAt;
  }

  public static fromObject(object: { [key: string]: unknown }): VerificationRequest {
    const {id,user,game,status,rank,filepath,createdAt} = object;

    if (!id) throw 'ID property is required';
    if (!status) throw 'Status property is required';
    if (!filepath) throw 'status property is required';
    if (!createdAt) throw 'status property is required';

    const verificationRequest = new VerificationRequest(id as number, user as User, game as Game, status as RequestStatus, rank as string, filepath as string, createdAt as Date);

    return verificationRequest;
  }
}
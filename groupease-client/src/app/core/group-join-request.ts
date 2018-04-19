import { Group } from './group';
import { User } from './user';

export class GroupJoinRequest {

  id: number;

  group: Group;

  sender: User;

  comments: string;

  lastUpdate: number;

}

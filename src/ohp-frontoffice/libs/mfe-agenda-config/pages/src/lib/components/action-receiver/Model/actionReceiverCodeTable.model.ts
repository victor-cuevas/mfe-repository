import { MasterAgenda } from "../../master-agenda/Model/masterAgenda.model";
import { User } from "../../master-agenda/Model/user.model";
import { ActionReceiverType } from "./actionReceiverType.model";



export class ActionReceiverCodeTable {
  state!: number;
  actionReceiverTypeList!: ActionReceiverType[];
  agendaMasterList!: MasterAgenda[];
  userList!: User[];
 }

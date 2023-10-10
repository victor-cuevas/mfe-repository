import { MasterAgenda } from "../../master-agenda/Model/masterAgenda.model";
import { ActionReceiver2User } from "./actionReceiver2User.model";
import { ActionReceiverType } from "./actionReceiverType.model";
import { BaseModel } from "./baseModel";



export class ActionReceiver extends BaseModel {
  actionReceiverType?: ActionReceiverType | null;
  agendaMaster?: MasterAgenda | null;
  users: string[] = [];
  isEntered!: boolean;
  actionReceiver2user: ActionReceiver2User[] = [];
 }


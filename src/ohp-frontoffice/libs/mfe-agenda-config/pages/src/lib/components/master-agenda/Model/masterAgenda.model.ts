import { BaseModel } from "../../action-receiver/Model/baseModel";
import { AgendaType } from "./agendaType.model";
import { ServicingCustomer } from "./servicingCustomer.model";
import { User } from "./user.model";



export class MasterAgenda extends BaseModel{
  masterUser?: User| null;
  name?: string|null
  servicingCustomer?: ServicingCustomer | null;
  agendaTypeName?: AgendaType | null;
  isEntered?:boolean
}

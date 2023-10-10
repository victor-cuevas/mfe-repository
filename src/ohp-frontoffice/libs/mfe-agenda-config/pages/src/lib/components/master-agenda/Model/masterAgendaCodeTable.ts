
import { ActionReceiverType } from "../../action-receiver/Model/actionReceiverType.model";
import { State } from "../../action-receiver/Model/modelState";
import { AgendaType } from "./agendaType.model";
import { ServicingCustomer } from "./servicingCustomer.model";
import { User } from "./user.model";

export class MasterAgendaCodeTable {
  state!:State
  usersList: User[] = new Array<User>();
  actionReceiverTypeList: ActionReceiverType[] = new Array<ActionReceiverType>();
  servicingCustomersList: ServicingCustomer[] = new Array<ServicingCustomer>();
  agendaTypeList: AgendaType[] = new Array<AgendaType>();       
}

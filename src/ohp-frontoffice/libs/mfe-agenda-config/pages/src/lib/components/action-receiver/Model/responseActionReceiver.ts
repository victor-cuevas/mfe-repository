import { ActionReceiver } from "./actionReceiver.model";
import { ActionReceiverCodeTable } from "./actionReceiverCodeTable.model";
import { State } from "./modelState";


export class ResponseActionReceiver {
  state!:State
  actionReceivers: ActionReceiver[] = new Array<ActionReceiver>();
  actionReceiversCodeTablesList: ActionReceiverCodeTable = new ActionReceiverCodeTable();
}

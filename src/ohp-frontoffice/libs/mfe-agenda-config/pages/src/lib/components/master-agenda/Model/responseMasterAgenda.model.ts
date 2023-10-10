import { State } from "../../action-receiver/Model/modelState";
import { MasterAgenda } from "./masterAgenda.model";
import { MasterAgendaCodeTable } from "./masterAgendaCodeTable";


export class ResponseMasterAgenda {
  state!: State;
  agendaMasterList: MasterAgenda[] = new Array<MasterAgenda>();
  agendaMasterCodeTables: MasterAgendaCodeTable = new MasterAgendaCodeTable();
}


import { action } from "./action.model";
import { codeTable } from "./codeTable.model";

export class closeAction extends action {
  defaultHandleTimeValue!: number;
  actionFunctionality!: codeTable;
  defaultHandleTime!: number | null;
}

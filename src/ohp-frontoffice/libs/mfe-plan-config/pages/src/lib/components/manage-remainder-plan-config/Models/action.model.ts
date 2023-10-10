import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";

export class action extends baseModel {
  nameEN!: string;
  nameFR!: string;
  nameNL!: string;
  actionReceiverTypeName!: codeTable;
  actionMessage!: string;
  actionType!: codeTable;
  defaultHandleMargin!: number;
  descriptionEN!: string;
  descriptionFR!: string;
  descriptionNL!: string;
  defaultHandleTimeDays!: number;
  defaultHandleTimeHours!: number;
  defaultHandleTimeMinutes!: number;
  defaultName!: string;
  defaultHandlePeriod!: string;
  actionCode!: string;
  priority!: codeTable;
  name!: string;
}

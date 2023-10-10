import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";


export class postageCost extends baseModel {
  country!: codeTable;
  registered!: boolean;
  amount!: number;
  startDate!: Date;
  modifiedRegistered!: string
  isEntered!: boolean
  modifiedDate!: string|null
  modifiedAmount!: string

}

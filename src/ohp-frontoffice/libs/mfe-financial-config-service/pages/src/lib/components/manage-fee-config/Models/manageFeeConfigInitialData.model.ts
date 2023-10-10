import { codeTable } from "./codeTable.model";
import { txElType } from "./txElType.model";

export class manageFeeConfigInitialData{
  feeTypeList: codeTable[]=[];
  feeCalculationTypeList: codeTable[]=[];
  txElTypeList: txElType[]=[];
  state!: number;
}

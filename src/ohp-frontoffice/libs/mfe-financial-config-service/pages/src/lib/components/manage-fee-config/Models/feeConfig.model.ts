import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { txElTypeConversionConfig } from "./txELTypeConversionConfig.model";

export class feeConfig extends baseModel {
  feeType!: codeTable;
  txElTypeConversionConfig!: txElTypeConversionConfig;
  isLinkedToProduct!: boolean;
  feeTypeList: codeTable[]=[];
  isDelete!: boolean;
  isRead!: boolean;
  isEntered!:boolean
  feeConfigListDropdownDisable!: boolean;

}

import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";


export class cmRoleType2PartyQuality extends baseModel {
  partyQualityName!: codeTable;
  roleTypeList: codeTable[]=[];
  isEntered!: boolean;
}

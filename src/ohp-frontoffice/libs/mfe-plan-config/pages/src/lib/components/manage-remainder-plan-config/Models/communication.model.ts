import { attachment } from "./attachment.model";
import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { documentTemplateRef } from "./documentTemplateRef.model";
import { fallbackMechanism } from "./fallbackMechanism.model";
import { referenceType } from "./referenceType.model";

export class communication extends baseModel {
  isMerchant!: boolean;
  documentTemplateList: documentTemplateRef[]=[];
  attachmentList: attachment[]=[];
  communicationMedium!: codeTable;
  registeredLetter!: boolean;
  documentTemplate!: documentTemplateRef;
  communicationReceiver!: codeTable;
  receiverType!: codeTable;
  addressType!: codeTable;
  fallbackMechanism!: fallbackMechanism;
  referenceType!: referenceType;
  dossierRolePKey!: number | null;
}

import { baseModel } from "./baseModel.model"
import { codeTable } from "./codeTable.model"
import { revisionPeriodDef } from "./revisionPeriodDef.model"

export class revisionPeriodDefList extends baseModel {
 revisionPeriodTypeList:codeTable[] = [] 
 revisionPeriodList: codeTable[] = []
 revisionPeriodDefinitionList: revisionPeriodDef[]=[]
}

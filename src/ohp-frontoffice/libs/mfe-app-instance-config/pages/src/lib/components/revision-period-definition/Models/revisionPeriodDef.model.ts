import { baseModel } from "./baseModel.model"
import { codeTable } from "./codeTable.model"

export class revisionPeriodDef extends baseModel{
  revisionPeriod !: codeTable
  periodInYears !:number
  revisionPeriodType!: codeTable
  isAllowedForRateRevision!:boolean
  periodInMonths !: number
  modifiedPeriodInMonths!: string
  modifiedPeriodInYears!: string
  revisionPeriodStartsOnNextQuarter!: boolean
  isRevisionPeriodTypeRateRevision !: boolean
  isRevisionPeriodTypeVariable !: boolean
  isRevisionPeriodEditable !: boolean
  isStartsOnNextQuarterVisible !: boolean
  isEntered!: boolean;
}

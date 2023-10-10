import { baseModel } from "./baseModel.model"
import { codeTable } from "./codeTable.model"


export class prepaymentReasonDef extends baseModel {
  PrepaymentReason!: codeTable
  CalculatePrepaymentPenalty!: boolean
  MaximumPenaltyPercentage!: number
  isPenaltyReadOnly!: boolean
}

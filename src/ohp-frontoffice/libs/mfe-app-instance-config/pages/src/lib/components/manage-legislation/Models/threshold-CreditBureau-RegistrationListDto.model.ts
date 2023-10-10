import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class thresholdForCreditBureauRegistrationListDto  extends DtoBase {
      retailLendingSubType !: codeTable | null
      thresholdAmount !: number
      isDeleted!: boolean
      rowSelected!: boolean
      randomNumber!: number
}
import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class revolvingDetailsWithRepayDto  extends DtoBase {
  maxCalibrationDuration!: number;
  isInterestOnly!: boolean;
  revPrincipalRepayAbsMin!: number;
  revPrincipalRepayRelMin!: number;
  aprMax!: number;
  consumerProductType!: codeTable;
  financeAmountMax!: number;
  financeAmountMin!: number;
  isDeleted!: boolean;
  rowSelected!:boolean;
  disableTextbox!:boolean;
  randomNumber!: number;
}

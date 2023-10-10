import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class preComputedDetailDto extends DtoBase {
  creditDurationMaxInMonths!: number|null;
  creditDurationMinInMonths!: number|null;
  aprMax!: number|null;
  consumerProductType!: codeTable;
  financeAmountMax!: number;
  financeAmountMin!: number;
  isDeleted!: boolean
  rowSelected!:boolean
  disableTextbox!:boolean
  randomNumber!: number
}

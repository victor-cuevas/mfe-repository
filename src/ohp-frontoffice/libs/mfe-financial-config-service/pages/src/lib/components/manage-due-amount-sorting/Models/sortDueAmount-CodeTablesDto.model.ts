import { codeTable } from './codeTable.model';
import { TxElTypeDto } from './txElType.model';

export class SortDueAmountCodeTablesDto {
  creditStatus: codeTable[]=[];
  paymentAllocationTypes: codeTable[]=[];
  timingSortings: codeTable[]=[];
  txElTypes: TxElTypeDto[]=[];
  state!: number;
}

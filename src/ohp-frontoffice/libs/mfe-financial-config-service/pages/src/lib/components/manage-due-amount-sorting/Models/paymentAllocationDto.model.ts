import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';
import { PaymentAllocationBlockDto } from './paymentAllocationBlock.model';

export class PaymentAllocationDto extends DtoBase {
  paymentAllocationType!: codeTable | null;
  products!: string;
  canDeleteEnable!: boolean;
  creditStatus!: object;
  paymentAllocationBlocks!: PaymentAllocationBlockDto[];
  sortNoDueAmounts!: boolean;
  rowSelected!:boolean;
  randomNumber!: number;
}

import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';
import { PaymentAllocationItemDto } from './paymentAllocationItem.model';

export class PaymentAllocationBlockDto extends DtoBase {
  sortingSeqNr!: number;
  timingSorting!: codeTable| null;
  paymentAllocationItems!: PaymentAllocationItemDto[];
}

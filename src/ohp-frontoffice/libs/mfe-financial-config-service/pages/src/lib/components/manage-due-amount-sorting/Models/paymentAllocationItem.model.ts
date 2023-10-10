import { DtoBase } from './dtoBase.model';
import { TxElTypeDto } from './txElType.model';

export class PaymentAllocationItemDto extends DtoBase {
  equalDateSortingNr!: number;
  txElType!: TxElTypeDto | null;
}

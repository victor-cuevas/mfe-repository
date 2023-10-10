import { PaymentAllocationDto } from './paymentAllocationDto.model';
import { SortDueAmountCodeTablesDto } from './sortDueAmount-CodeTablesDto.model';

export class GetPaymentAllocationsResponseDto {
  paymentAllocations!: PaymentAllocationDto[];
  sortDueAmountCodeTables!: SortDueAmountCodeTablesDto;
  state!: number;
}

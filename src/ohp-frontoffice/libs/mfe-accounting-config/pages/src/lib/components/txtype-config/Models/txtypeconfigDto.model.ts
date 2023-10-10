import { EntityDtoBase } from './entityDtoBase.model';
import { TxTypeDto } from './txtypeDto.model';
export class TxTypeConfigDto extends EntityDtoBase {
  txType!: TxTypeDto | null;
  isAccountingTx!: boolean
  modifiedisAccountingTx!: string
  isEntered!: boolean;
}

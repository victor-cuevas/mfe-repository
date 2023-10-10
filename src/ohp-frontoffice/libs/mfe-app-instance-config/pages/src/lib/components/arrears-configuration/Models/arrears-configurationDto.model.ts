import { ArrearsConfiguration2TxElTypeDto } from './arrears-configuration2TxElTypeDto.model';
import { DtoBase } from './dtoBase.model';

export class ArrearsConfigurationDto extends DtoBase {
  name!: string | null;
  arrearsConfiguration2TxElTypeList!: ArrearsConfiguration2TxElTypeDto[];
  randomNumber !: number;
  rowSelected !: boolean;
  isLinkedwithCreditProviderSettings!: boolean
  hasNoProductCopy!: boolean;
}

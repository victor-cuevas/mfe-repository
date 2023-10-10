import { codeTable } from './codeTable.model';
import { CreditProviderNameDto } from './creditProviderNameDto.model';
import { DtoBase } from './dtoBase.model';

export class CreditProviderRefDto extends DtoBase {
  name!: CreditProviderNameDto;
}

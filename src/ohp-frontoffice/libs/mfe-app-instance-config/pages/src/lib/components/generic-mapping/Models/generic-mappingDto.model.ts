import { codeTable } from './codeTable.model';
import { CreditProviderRefDto } from './credit-providerRedDto.model';
import { DtoBase } from './dtoBase.model';
import { mappingContextDto } from './mapping-contextDto.model';
import { mappingDirectionDto } from './mapping-directionDto.model';

export class GenericMappingDto extends DtoBase {
  externalValue!: string | null;
  internalValue!: number| null;
  internalType!: string | null;
  mappingContext!: mappingContextDto | null;
  mappingDirection!: mappingDirectionDto | null;
  creditProviderId!: number | null;
  creditProviderRef!: CreditProviderRefDto | null;
  randomNumber!:number;
  rowSelected!: boolean
}

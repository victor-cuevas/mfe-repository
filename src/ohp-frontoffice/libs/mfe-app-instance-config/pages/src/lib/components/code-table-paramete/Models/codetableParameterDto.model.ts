import { codeTable } from './codeTable.model';
import { CodetableParameterItemDto } from './codetableParameterItemDto.model';
import { DtoBase } from './dtoBase.model';

export class CodetableParameterDto extends DtoBase {
  codetableName!: string | null;
  parameterName!: string | null;
  isSingleValue!: boolean;
  codetableParameterItemList!: CodetableParameterItemDto[];
  rowSelected !: boolean;
  randomNumber !: number;
  modifiedisSingleValue !: string;
  codetableNameObj !: codeTable | null;
}

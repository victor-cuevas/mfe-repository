import { codeTable } from "./codeTable.model";
import { DtoBase } from "./dtoBase.model";

export class CmGenericMappingDto extends DtoBase
  {
  externalValue!: string | null
  internalValue!: number | null
  internalType!: string | null
  mappingContext!: codeTable | null
  mappingDirection!: codeTable | null
  creditProviderId!: number | null;
  randomNumber!: number;
  rowSelected !: boolean;
  }

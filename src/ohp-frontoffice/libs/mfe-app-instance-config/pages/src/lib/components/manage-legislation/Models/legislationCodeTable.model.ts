import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class legislationCodeTableDto extends DtoBase{
   countryList !: codeTable[]
   retailLendingSubTypeList !: codeTable[]
}
import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class PrintDocumentCreditSubStatusFilterDto extends DtoBase
    {

          isSelected !: boolean
          creditSubStatus !: codeTable
    }
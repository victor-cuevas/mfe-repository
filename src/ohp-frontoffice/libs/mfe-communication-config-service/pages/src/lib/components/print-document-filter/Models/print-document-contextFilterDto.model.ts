import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class PrintDocumentContextFilterDto extends DtoBase
{
      isSelected !: boolean
      printDocumentContext !: codeTable
}
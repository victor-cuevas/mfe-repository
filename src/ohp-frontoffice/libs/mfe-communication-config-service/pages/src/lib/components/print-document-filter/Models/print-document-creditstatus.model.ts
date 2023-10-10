import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class PrintDocumentCreditStatusFilterDto extends DtoBase {
  isSelected!: boolean;
  creditStatus!: codeTable;
}

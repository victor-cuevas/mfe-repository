import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class PrintDocumentUserProfileNameFilterDto extends DtoBase {
  isSelected!: boolean;
  userProfileName!: codeTable;
}

import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';

export class NotificationConfig2ProductDto extends DtoBase {
  productNameList!: CodeTable[];
  productName!: CodeTable;
  isReadOnly!: boolean;
  isDeleted!: boolean;
}

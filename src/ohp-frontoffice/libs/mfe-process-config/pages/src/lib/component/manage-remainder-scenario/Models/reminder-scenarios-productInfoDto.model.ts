import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { ProductRef } from './productRef.model';

export class ReminderScenariosForProductInfoDto extends DtoBase{
      creditStatus !: CodeTable
      product !: ProductRef
}
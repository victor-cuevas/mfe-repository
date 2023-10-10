import { ActionDto } from './action.model';
import { CodeTable } from './code-table.model';

export class CloseActionDto extends ActionDto {
  actionFunctionality!: CodeTable;
  actionType!: CodeTable;
  defaultHandleTime!: number;
  priority!: CodeTable;
}

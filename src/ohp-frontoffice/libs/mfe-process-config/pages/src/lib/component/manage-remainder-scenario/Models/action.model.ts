import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';

export class  ActionDto extends DtoBase{
  nameEN!: string;
  nameFR!: string;
  nameNL!: string;
  actionReceiverTypeName!: CodeTable | null;
  actionMessage!: string;
  defaultHandleMargin!: number;
  descriptionEN!: string;
  descriptionFR!: string;
  descriptionNL!: string;
  defaultHandleTimeDays!: number;
  defaultHandleTimeHours!: number;
  defaultHandleTimeMinutes!: number;
  defaultName!: string;
  defaultHandlePeriod!: string;
  actionCode!: string;
  name!: string;
  calculatedDeadlineDate!: Date;
}

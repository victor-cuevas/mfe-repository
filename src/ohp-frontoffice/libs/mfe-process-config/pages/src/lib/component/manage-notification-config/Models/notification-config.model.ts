import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { NotificationConfig2ProductDto } from './notification-config2ProductDto.model';
import { NotificationConfig2ServicingCustomerDto } from './notification-config2ServicingCustomerDto.model';

export class NotificationConfigDto extends DtoBase{
  referenceDateType!: CodeTable | null;
  timing!: CodeTable | null;
  followUpEventName!: CodeTable | null;
  eventContextType!: CodeTable | null;
  intervalMeasure!: CodeTable | null;
  nrOfIntervals!: number;
  notificationConfig2ProductList!:NotificationConfig2ProductDto[];
  notificationConfig2ServicingCustomerList!:NotificationConfig2ServicingCustomerDto[];
  randomnumber!:number
  selectedRow!: boolean
}

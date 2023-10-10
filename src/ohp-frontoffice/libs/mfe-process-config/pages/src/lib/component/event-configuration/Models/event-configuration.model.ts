import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { FollowUpEventNameDto } from './followUp-eventNameDto.model';
import { ServiceActionNameDto } from './service-actionNameDto.model';

export class EventConfigurationDto extends DtoBase {
  eventHandler!: string | null;
  followUpEvent!: FollowUpEventNameDto | null;
  serviceActionName!: ServiceActionNameDto | null;
  integrationQueueConfigurationName!: string;
  isSelected!: boolean
  randomNumber!: number
  modifiedEventHandler!: CodeTable
  isEnableServiceAction!: boolean
}

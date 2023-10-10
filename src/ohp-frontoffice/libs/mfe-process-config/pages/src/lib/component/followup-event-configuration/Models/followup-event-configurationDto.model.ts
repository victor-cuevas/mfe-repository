import { DtoBase } from './dtobase.model';
import { EventDateTypeDto } from './event-dateTypeDto.model';
import { FollowUpEventNameDto } from './followup-event-nameDto.model';

export class FollowUpEventConfigurationDto extends DtoBase {
  followUpEventName!: FollowUpEventNameDto |  null;
  eventCreationDateType!: EventDateTypeDto |  null;
  eventHandlingDateType!: EventDateTypeDto |  null;
  canBeTriggeredManually!: boolean;
  isSelected !: boolean;
  randomNumber !: number;
}

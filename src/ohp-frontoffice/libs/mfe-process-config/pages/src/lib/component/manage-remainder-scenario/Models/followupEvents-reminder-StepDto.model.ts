
import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';

export class FollowupEventsForReminderStepDto extends DtoBase{
      eventName !: CodeTable | null
      isDeleted !: boolean
}
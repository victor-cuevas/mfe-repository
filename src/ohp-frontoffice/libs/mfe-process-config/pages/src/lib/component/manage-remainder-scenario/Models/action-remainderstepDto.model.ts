import { CloseActionDto } from './close-action.model';
import { DtoBase } from './dtobase.model';

export class ActionsForReminderStepDto extends DtoBase{
    action !: CloseActionDto | null
    isDeleted!: boolean

}
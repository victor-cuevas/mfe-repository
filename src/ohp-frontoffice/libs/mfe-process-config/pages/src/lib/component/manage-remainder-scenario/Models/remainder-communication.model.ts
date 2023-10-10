import { CommunicationsDto } from './communication.model';
import { DtoBase } from './dtobase.model';

export class ReminderCommunicationsDto extends DtoBase {
      communication !: CommunicationsDto 
      isDeleted !: boolean;
}   
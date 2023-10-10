import { EntityDtoBase } from './entityDtoBase.model';
import { CommunicationReceiverDto } from './communicationReceiverDto.model';
import { RoleTypeDto } from './roleTypeDto.model';
export class CommunicationReceiver2RoleTypeDto extends EntityDtoBase {
  communicationReceiver!: CommunicationReceiverDto | null;
  roleType!: RoleTypeDto | null;
  isEntered!: boolean;
}

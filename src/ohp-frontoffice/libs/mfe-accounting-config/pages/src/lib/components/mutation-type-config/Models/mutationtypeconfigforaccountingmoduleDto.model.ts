import { EntityDtoBase } from './entityDtoBase.model';
import { MutationTypeDto } from './mutationtypeDto.model';
export class MutationTypeConfigForAccountingModuleDto extends EntityDtoBase {
    mutationTypeList!: MutationTypeDto | null;
  isEntered!: boolean;
}

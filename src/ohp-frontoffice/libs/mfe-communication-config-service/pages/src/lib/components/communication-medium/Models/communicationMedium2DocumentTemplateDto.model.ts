import { EntityDtoBase } from './entityDtoBase.model';
import { CommunicationMediumNameDto } from './communicationMediumNameDto.model';
import { DocumentTemplateTypeDto } from './documentTemplateTypeDto.model';
export class CommunicationMedium2DocumentTemplateDto extends EntityDtoBase {
communicationMedium!: CommunicationMediumNameDto | null;
documentTemplate!: DocumentTemplateTypeDto | null;
isEntered!: boolean;
}

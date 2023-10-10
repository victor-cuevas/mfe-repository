import { CodeTableDto } from './code-table.modle';
import { DtoBase } from './dto-base.model';
import { MissingDocumentDto } from './missing-document.model';
import { RequiredActionDto } from './required-action.model';

export class MutationReasonConfigDto extends DtoBase{
     mutationReasonName !: CodeTableDto | null
     mutationReasonNameList !: CodeTableDto[]
     missingDocumentConfigList !: MissingDocumentDto[] 
     requiredActionConfigList !: RequiredActionDto[] 
     isReadOnly!: boolean
     SelectedRow !: boolean
     randomNumber!: number
     disableReason!: boolean
}
import { CodeTableDto } from './code-table.modle';
import { DtoBase } from './dto-base.model';

export class RequiredActionDto extends DtoBase{
      requiredAction !: CodeTableDto | null
    requiredActionList!: CodeTableDto[]
    isReadOnly!: boolean
    SelectedRow!: boolean
    disableRequiredAction !: boolean
    isDeleted!: boolean
}
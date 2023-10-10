import { CodeTableDto } from './code-table.modle';
import { DtoBase } from './dto-base.model';

export class MissingDocumentDto extends DtoBase {
    blockingType !: CodeTableDto | null
    missingDocName !:CodeTableDto | null
    blockingTypeList !: CodeTableDto[]
    missingDocNameList !: CodeTableDto[]
    isReadOnly!: boolean
    SelectedRow !: boolean
    disableMissingDoc!: boolean
    isDeleted !: boolean
}
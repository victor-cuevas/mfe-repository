import { CodeTable } from './code-table.model'
import { DtoBase } from './dtobase.model'

export class NotificationConfig2ServicingCustomerDto extends DtoBase{
    creditProviderNameList !: CodeTable[]
    creditProviderName !: CodeTable;
    isReadOnly!: boolean;
    isDeleted!: boolean;
}
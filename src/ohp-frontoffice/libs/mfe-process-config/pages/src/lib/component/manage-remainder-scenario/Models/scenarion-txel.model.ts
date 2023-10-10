import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';

export class ScenarioTxelTypeDto extends DtoBase{
    txElType !: CodeTable | null
    isDeleted !: boolean
}
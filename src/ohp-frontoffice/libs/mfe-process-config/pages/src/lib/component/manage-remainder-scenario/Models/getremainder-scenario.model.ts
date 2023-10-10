import { DtoBase } from './dtobase.model'
import { RemainderScenarios } from './remainder-scenariodto.model'
import { ReminderScenariosCodeTablesDto } from './reminder-scenarios-codeTablesDto.model'

export class GetRemainderScenarioDto extends DtoBase{

   reminderScenarioList !: RemainderScenarios[]
   reminderScenarioCodeTables !: ReminderScenariosCodeTablesDto[]
}
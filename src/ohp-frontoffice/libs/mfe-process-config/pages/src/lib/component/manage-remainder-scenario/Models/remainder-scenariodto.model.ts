import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { RemainderScenarioSteps } from './remainder-scenario-steps.model';
import { ReminderScenariosForProductInfoDto } from './reminder-scenarios-productInfoDto.model';
import { ScenarioTxelTypeDto } from './scenarion-txel.model';

export class RemainderScenarios extends DtoBase{
      txElTypes !: ScenarioTxelTypeDto[]
      startDate !: Date
      modifiedStartDate!: string | null
      endDate!: Date | null
      modifiedEndDate!: string| null
      scenarioName !: string | null
      minPeriodBetweenSteps !: number
      reminderDaysPostDueDate !: number
      isSelectedElapsedPeriod !: boolean
      isSelectedNumberOfDueDays !: boolean
      scenarioType !: CodeTable | null
       reminderScenarioSteps !: RemainderScenarioSteps[]
      products !: ReminderScenariosForProductInfoDto[]
      canDeleteEnable !: boolean
      reminderScenarioPeriodBase  !: CodeTable | null
      setCreditStatusBackToNormal !: boolean
      unblockOutgoingPayments !: boolean
      resumeCommissionPayments!: boolean
      randomNumber!:number
      isRowSelected!:boolean
}

import { ActionsForReminderStepDto } from './action-remainderstepDto.model';
import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { FollowupEventsForReminderStepDto } from './followupEvents-reminder-StepDto.model';
import { ReminderCommunicationsDto } from './remainder-communication.model';

export class RemainderScenarioSteps extends DtoBase{

     elapsedPeriod !: number
      scenarioType !: CodeTable | null
      isNumberOfDueDates !: boolean
      isElapsedPeriod !: boolean
      cbActionCode !:CodeTable | null
      notes !:string
      notifyCreditBureau !: boolean
      name!:string | null
      seqNr !: number
      minDueAmount !: number
      chargeIOA !: boolean
      isReminder !: boolean
      isFormalNotice !: boolean
      stopCommission !: boolean
      numberOfDueDates !: number
      eventReminder !: CodeTable
      communicationList !: ReminderCommunicationsDto[]
      actionsForReminderStep !: ActionsForReminderStepDto[]
      followupEventsForReminderStep !: FollowupEventsForReminderStepDto[]
      txElTypes !: string
      stepOverViewDay !: number
      changeCreditStatus !: boolean
      targetCreditStatus !: CodeTable | null
      notifyCreditInsurer !: boolean
      suspendDirectDebit !: boolean
      blockOutgoingPayments!: boolean
      setServicingNoticeUponDebtorDate !: boolean
      randomNumber!: number;
      isRowSelected!: boolean

}
import { ArrearsTriggerStepConfig2StartEventDto } from './arrearsTrigger-stepConfig2-startEventDto.model';
import { CodeTable } from './code-tableDto.model';
import { DtoBase } from './dtoBase.model';

export class ArrearsTriggerStepConfigDto extends DtoBase {
  numberOfDaysDueConfig!: number | null;
  numberOfDueDatesConfig!: number | null ;
  startEvent!: CodeTable | null;
  arrearsTriggerStepConfig2StartEventList!: ArrearsTriggerStepConfig2StartEventDto[];
  steprowSelected !: boolean;
  steprandomNumber !: number;
  isDeleted !: boolean;
}

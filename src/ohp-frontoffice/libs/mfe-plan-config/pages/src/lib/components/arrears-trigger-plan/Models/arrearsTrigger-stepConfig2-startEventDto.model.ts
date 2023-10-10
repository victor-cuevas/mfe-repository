import { CodeTable } from './code-tableDto.model';
import { DtoBase } from './dtoBase.model';

export class ArrearsTriggerStepConfig2StartEventDto extends DtoBase {
  startEvent!: CodeTable | null;
  numberOfDaysDueConfig!: number | null;
  numberOfDueDatesConfig!: number | null;
}

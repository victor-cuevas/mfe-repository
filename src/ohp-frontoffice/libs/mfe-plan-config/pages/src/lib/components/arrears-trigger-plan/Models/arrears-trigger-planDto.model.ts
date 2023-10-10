import { ArrearsTriggerStepConfigDto } from './arrearsTrigger-stepConfigDto.model';
import { ArrearsTriggerPlan2DebtSourceStatusDto } from './arrearsTriggerPlan2-debtSourceStatusDto.model';
import { ArrearsTriggerPlan2ExternalProductReferenceDto } from './arrearsTriggerPlan2-externalProductReferenceDto.model';
import { CodeTable } from './code-tableDto.model';
import { DtoBase } from './dtoBase.model';

export class ArrearsTriggerPlanDto extends DtoBase {
  arrearsTriggerCalculationType!: CodeTable | null;
  arrearsTriggerContext!: CodeTable | null;
  arrearsTriggerPlan2DebtSourceStatusList!: ArrearsTriggerPlan2DebtSourceStatusDto[];
  arrearsTriggerPlan2ExternalProductReferenceList!: ArrearsTriggerPlan2ExternalProductReferenceDto[];
  arrearsTriggerStepConfigList!: ArrearsTriggerStepConfigDto[];
  rowSelected !: boolean;
  randomNumber !: number
}

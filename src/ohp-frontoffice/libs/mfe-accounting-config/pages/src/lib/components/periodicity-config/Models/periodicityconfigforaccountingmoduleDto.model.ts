import { PeriodicityDto } from './periodicityDto.model';
import { EntityDtoBase } from './entityDtoBase.model';
import { FinancialAmortizationTypeDto } from './financialamortizationtypeDto.model';
export class PeriodicityConfigForAccountingModuleDto extends EntityDtoBase {
  periodicityCd!: PeriodicityDto | null;
  financialAmortizationTypeList: FinancialAmortizationTypeDto[] = [];
  isEntered!: boolean;
}

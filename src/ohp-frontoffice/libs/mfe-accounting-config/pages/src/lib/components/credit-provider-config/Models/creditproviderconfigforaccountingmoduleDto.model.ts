import { codeTable } from './codeTable.model';
import { CreditProviderNameDto } from './creditprovidernameDto.model';
import { EntityDtoBase } from './entityDtoBase.model';
import { FinancialAmortizationTypeDto } from './financialamortizationtypeDto.model';

export class CreditProviderConfigForAccountingModuleDto extends EntityDtoBase {
  creditProviderName!: CreditProviderNameDto | null;
  financialAmortizationTypeList: FinancialAmortizationTypeDto[]=[];
    isEntered!:boolean;
}

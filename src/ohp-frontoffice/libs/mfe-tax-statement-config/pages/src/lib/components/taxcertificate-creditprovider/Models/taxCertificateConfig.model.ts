import { TaxCertificateCategoryDto } from '../../taxcertificate-typemapping/Models/taxCertificateCategoryDto.model'
import { TaxCertificateConfigTypeDto } from '../../taxcertificate-typemapping/Models/taxCertificateConfigTypeDto.model'
import { BalanceMovementTypeDto } from './balance-movementTypeDto.model'
import { ConvertedTxTypeDto } from './converted-txTypeDto.model'
import { DtoBase } from './dtoBase.model'
import { TaxCertificateConfig2CreditProviderDto } from './taxCertificate-Config-CreditProvider.model'
import { TaxCertificateTypeDto } from './taxCertificateTypeDto.model'
import { TxElTypeDto } from './txElTypeDto.model'

export class TaxCertificateConfigType extends DtoBase{
      decrease !: boolean;
      modifieddecrease!: string;
      className !: string;
      taxCertificateConfigType !: TaxCertificateConfigTypeDto | null;
      taxCertificateType !: TaxCertificateTypeDto| null;
      taxCertificateCategory !: TaxCertificateCategoryDto | null;
      balanceMovementType !: BalanceMovementTypeDto | null;
      convertedTxType !: ConvertedTxTypeDto| null;
      txElType !: TxElTypeDto | null;
      taxCertificateConfig2CreditProviderList !:TaxCertificateConfig2CreditProviderDto[];
      randomNumber!: number;
      rowSelected!: boolean;
}
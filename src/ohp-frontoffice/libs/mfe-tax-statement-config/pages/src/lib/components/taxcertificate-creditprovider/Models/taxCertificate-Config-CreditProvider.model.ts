import { CreditProviderRefDto } from './creditProviderRef.model';
import { DtoBase } from './dtoBase.model';

export class TaxCertificateConfig2CreditProviderDto extends DtoBase {
  creditProvider!: CreditProviderRefDto;
}

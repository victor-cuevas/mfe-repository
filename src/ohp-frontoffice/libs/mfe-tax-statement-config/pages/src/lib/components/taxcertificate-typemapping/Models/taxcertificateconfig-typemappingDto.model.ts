import { DtoBase } from './dtoBase.model';
import { TaxCertificateCategoryDto } from './taxCertificateCategoryDto.model';
import { TaxCertificateConfigTypeDto } from './taxCertificateConfigTypeDto.model';

export class TaxCertificateConfigTypeMappingDto extends DtoBase{
  taxCertificateConfigType!: TaxCertificateConfigTypeDto | null;
  taxCertificateCategory!: TaxCertificateCategoryDto | null;
  taxCertificateReference!: string | null;
  direction!: boolean| null;
  modifieddirection!: string| null
  randomNumber!: number;
  rowSelected!:boolean
}

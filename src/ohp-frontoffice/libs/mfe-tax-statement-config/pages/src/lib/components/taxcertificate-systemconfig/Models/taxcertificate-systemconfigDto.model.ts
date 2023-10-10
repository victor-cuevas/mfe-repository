import { CommunicationMediumNameDto } from './communication-mediumNameDto.model';
import { DtoBase } from './dtoBase.model';

export class TaxCertificateSystemConfigDto extends DtoBase {
  cutOffDays!: number | null;
  reporterName!: string|null;
  reporterCompanyNumber!: string| null;
  relationNumber!: string| null;
  nameLabelForRunningAccount!: string| null;
  useFirstDayOfYearForTaxCertificate!: boolean | null;
  maxNumberOfRootObjectsForAnnualOverviewBatch!: number|null;
  communicationMediumForAnnualOverview!: CommunicationMediumNameDto | null;
  cutOffDaysPreviousYear!: number | null;
}

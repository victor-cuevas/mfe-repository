import { DossierStatusDto } from './dossier-status.model';
import { DtoBase } from './dtobase.model';
import { FollowUpCaseStatusDto } from './followUp-caseStatusDto.model';

export class FollowUpCaseStatus2DunningDossierStatusConfigDto extends DtoBase {
  followUpCaseStatus!: FollowUpCaseStatusDto | null;
  dossierStatus!: DossierStatusDto | null;
  isSelected!: boolean;
  randomNumber!: number;
}

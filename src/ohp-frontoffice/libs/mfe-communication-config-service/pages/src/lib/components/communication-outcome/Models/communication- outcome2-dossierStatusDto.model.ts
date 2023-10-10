import { CommunicationOutcomeDto } from './communication-outcomeDto.model';
import { DossierStatusDto } from './dossierStatusDto.model';
import { DtoBase } from './dtoBase.model';
import { SubStatusDto } from './sub-statusDto.model';

export class CommunicationOutcome2DossierStatusDto extends DtoBase {
  outcome!: CommunicationOutcomeDto | null;
  dossierStatus!: DossierStatusDto | null;
  subStatus!: SubStatusDto| null;
  randomNumber !: number;
  rowSelected !: boolean;
}

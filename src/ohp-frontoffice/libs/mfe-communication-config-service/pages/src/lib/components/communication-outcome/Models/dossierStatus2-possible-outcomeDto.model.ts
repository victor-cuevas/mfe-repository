import { CommunicationOutcomeDto } from './communication-outcomeDto.model';
import { DossierStatusDto } from './dossierStatusDto.model';
import { DtoBase } from './dtoBase.model';

export class DossierStatus2PossibleOutcomeDto extends DtoBase {
  dossierStatus!: DossierStatusDto | null;
  outcomeList!: CommunicationOutcomeDto[];
  rowSelected !: boolean;
  randomNumber !: number;
}

import { CommunicationOutcome2DossierStatusDto } from './communication- outcome2-dossierStatusDto.model';
import { DossierStatus2DossierPhaseDto } from './dossierStatus2-dossierPhaseDto.model';
import { DossierStatus2PossibleOutcomeDto } from './dossierStatus2-possible-outcomeDto.model';

export class CommunicationOutcome2DossierStatusListDto {
  communicationOutcome2DossierStatusList!: CommunicationOutcome2DossierStatusDto[];
  DossierStatus2DossierPhaseList!: DossierStatus2DossierPhaseDto[];
  DossierStatus2PossibleOutcomeList!: DossierStatus2PossibleOutcomeDto[];
}

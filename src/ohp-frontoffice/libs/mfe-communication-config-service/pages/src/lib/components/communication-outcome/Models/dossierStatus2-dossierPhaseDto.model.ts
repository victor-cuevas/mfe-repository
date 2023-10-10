import { DossierPhaseDto } from './dossier-phaseDto.model';
import { DossierStatusDto } from './dossierStatusDto.model';
import { DtoBase } from './dtoBase.model';

export class DossierStatus2DossierPhaseDto extends DtoBase {
  dossierStatus!: DossierStatusDto | null;
  dossierPhase!: DossierPhaseDto| null;
  randomNumber !: number;
  rowSelected !: boolean;
}

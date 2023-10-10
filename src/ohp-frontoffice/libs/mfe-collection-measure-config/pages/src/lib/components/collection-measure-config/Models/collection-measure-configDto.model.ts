import { CollectionMeasureType2DossierStatusDto } from './collection-measure-dossier-statusDto.model';
import { CollectionMeasureTypeDto } from './collection-measure-type.model';
import { DtoBase } from './dtoBase.model';
import { FollowUpEventNameDto } from './followUp-event-nameDto.model';
import { IntervalMeasureDto } from './interval-measureDto.model';

export class CollectionMeasuresConfigDto extends DtoBase {
  startEvent!: FollowUpEventNameDto | null;
  showSimulation!: boolean;
  stopEvent!: FollowUpEventNameDto | null;
  type!: CollectionMeasureTypeDto | null;
  isRoleLinkingApplicable!: boolean;
  creationEvent!: FollowUpEventNameDto | null;
  collectionMeasureType2DossierStatusList!: CollectionMeasureType2DossierStatusDto[];
  isSelected!: boolean;
  randomNumber!: number;
  closeMeasureIntervalType!: IntervalMeasureDto | null;
  elapsedPeriodToCloseMeasure!: number | null;
  isPartyMeasure!: boolean;
}

import { CollectionMeasureTypeDto } from './collection-measure-type.model';
import { DossierStatusDto } from './dossier-statusDto.model';
import { DtoBase } from './dtoBase.model';

export class CollectionMeasureType2DossierStatusDto extends DtoBase {
  type!: CollectionMeasureTypeDto;
  dossierStatus!: DossierStatusDto;
}

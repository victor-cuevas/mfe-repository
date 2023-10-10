import { DecimalPipe } from '@angular/common';
import { EntityDtoBase } from './entityDtoBase.model';

export class DivergentEffectiveRateSheetDto extends EntityDtoBase {
  effectiveRate!: number | null;
  modifiedEffectiveRate!: string;
  nrOfYears!: number | null;
  isEntered!: boolean;
  randomNumber!: number;
  rowSelected!: boolean
}

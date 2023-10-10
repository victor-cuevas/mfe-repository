import { DtoBase } from './dtoBase.model';
import { FallbackCommunicationDto } from './fallback-communicationDto.model';

export class FallbackMechanismDto extends DtoBase {
  name!: string | null;
  fallbackCommunicationList!: FallbackCommunicationDto[];
  randomNumber!: number;
  rowSelected!: boolean;
}

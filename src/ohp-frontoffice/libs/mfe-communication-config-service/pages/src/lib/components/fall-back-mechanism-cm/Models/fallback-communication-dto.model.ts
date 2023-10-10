import { codeTable } from './codeTable.model';
import { DtoBase } from './dtoBase.model';

export class FallbackCommunicationDto extends DtoBase {
  communicationMedium!: codeTable | null;
  followUpEventName!: codeTable | null;
  seqNr!: number | null;
  commrandomNumber!: number;
  commrowSelected!: boolean
  isDeleted!: boolean
}

import { legislationDto } from './legislation.model';
import { legislationCodeTableDto } from './legislationCodeTable.model';

export class getLegislationResponseDto {
  legislationDto!: legislationDto;
  legislationCodeTables!: legislationCodeTableDto;
}

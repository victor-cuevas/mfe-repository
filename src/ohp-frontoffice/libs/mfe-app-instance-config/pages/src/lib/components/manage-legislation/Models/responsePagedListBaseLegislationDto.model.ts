import { legislationDto } from './legislation.model';

export class responsePagedListBaseOfLegislationDto {
  totalItemCount!: number;
  pageIndex!: number;
  items!: legislationDto[];
}

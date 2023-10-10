import { codeTable } from './codeTable.model';

export class SearchLegislationCriteriaDto {
  pageIndex!: number;
  pageSize!: number;
  sortMode!: string;
  sortColumn!: string;
  enableSearch!: boolean;
  country!: codeTable | null;
  activeDate!: Date | null;
  dateFromAndIncl!: Date | null;
  youngestAPRChangeEndate!: Date | null;
}

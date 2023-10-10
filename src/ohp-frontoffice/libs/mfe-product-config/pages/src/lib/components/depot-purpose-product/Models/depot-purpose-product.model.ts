import { DtoBase } from '../../search-product/Models/dtobase.model';
import { CodeTable } from './code-table.model';

export class DepotPurposeProductsDto extends DtoBase {
  constructionDepotPurposeType!: CodeTable[];
  isPurposeBlockedForAutoDeduction!: boolean;
  rowSelected!: boolean;
}

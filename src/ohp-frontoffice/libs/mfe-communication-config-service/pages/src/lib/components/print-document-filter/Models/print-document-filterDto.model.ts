import { DocumentTemplateDto } from './document-template.model';
import { DtoBase } from './dtoBase.model';
import { PrintDocumentContextFilterDto } from './print-document-contextFilterDto.model';
import { PrintDocumentCreditStatusFilterDto } from './print-document-creditstatus.model';
import { PrintDocumentCreditSubStatusFilterDto } from './print-document-CreditSubStatusFilterDto.models';
import { PrintDocumentMaximumDueFilterDto } from './print-document-maximumDueFilterDto.model';
import { PrintDocumentUserProfileNameFilterDto } from './print-document-userProfileName-filterDto.model';

export class PrintDocumentFilterDto extends DtoBase {
  printDocumentCreditStatusFilters!: PrintDocumentCreditStatusFilterDto[]
  printDocumentCreditSubStatusFilters!: PrintDocumentCreditSubStatusFilterDto[];
  printDocumentUserProfileNameFilters!: PrintDocumentUserProfileNameFilterDto[];
  printDocumentMaximumDueFilters!: PrintDocumentMaximumDueFilterDto[];
  maximumDue!: number | null ;
  documentTemplate!: DocumentTemplateDto;
  printDocumentContextFilters: PrintDocumentContextFilterDto[]=[];
  randomNumber!: number;
  rowSelected!:boolean;
}

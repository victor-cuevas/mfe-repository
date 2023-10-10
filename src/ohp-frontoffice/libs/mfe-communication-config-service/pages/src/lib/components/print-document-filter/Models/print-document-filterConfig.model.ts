import { DocumentTemplateDto } from './document-template.model';
import { PrintDocumentCreditStatusFilterDto } from './print-document-creditstatus.model';
import { PrintDocumentCreditSubStatusFilterDto } from './print-document-CreditSubStatusFilterDto.models';
import { PrintDocumentFilterDto } from './print-document-filterDto.model';
import { PrintDocumentUserProfileNameFilterDto } from './print-document-userProfileName-filterDto.model';

export class PrintDocumentFilterConfigScreenDto {
  documentTemplates!: DocumentTemplateDto[];
  printDocumentFilters!: PrintDocumentFilterDto[];
  creditStatusList!: PrintDocumentCreditStatusFilterDto;
  creditSubStatusList!: PrintDocumentCreditSubStatusFilterDto;
  userProfileNameList!: PrintDocumentUserProfileNameFilterDto;
  lsUserProfileNameList!: PrintDocumentUserProfileNameFilterDto;
  state!: number;
}

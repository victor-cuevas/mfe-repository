import { CodeTable } from './code-table.model';
import { DocumentTemplateDto } from './document-templatesDto.model';
import { DtoBase } from './dtobase.model';
import { FallbackMechanismDto } from './fallback-mechanismDto.model';

export class CommunicationsDto extends DtoBase {
  communicationMedium!: CodeTable | null;
  registeredLetter!: boolean;
  onlySendAfterPeriod!: boolean;
  periodToVerify!: number;
  hasCost!: boolean;
  hasPageCost!: boolean;
  documentTemplate!: DocumentTemplateDto | null;
  fallbackMechanism!: FallbackMechanismDto;
  roleType!: CodeTable | null;
  adminRoleType!: CodeTable | null;
  collectionsRoleType!: CodeTable  | null;
  constructionDepotRoleType!: CodeTable;
}

import { CloseActionDto } from './close-action.model';
import { CodeTable } from './code-table.model';
import { CreditProviderDto } from './creditproviderDto.model';
import { DocumentTemplateDto } from './document-templatesDto.model';

export class ReminderScenariosCodeTablesDto {
  creditStatusList!: CodeTable[];
  creditProviderList!: CreditProviderDto[];
  cbActionCodeList!: CodeTable[];
  txElTypeList!: CodeTable[];
  templateNameList!: DocumentTemplateDto[];
  roleTypeList!: CodeTable[];
  adminRoleTypeList!: CodeTable[];
  collectionsRoleTypeList!: CodeTable[];
  followUpEventList!: CodeTable[];
  contactMediumList!: CodeTable[];
  eventReminderList!: CodeTable[];
  costTypeList!: CodeTable[];
  actionReceiverTypeList!: CodeTable[];
  actionTypeList!: CodeTable[];
  scenarioTypeList!: CodeTable[];
  reminderScenarioPeriodBaseList!: CodeTable[];
  addresseeTypeList!: CodeTable[];
  actionList!: CloseActionDto[];
}

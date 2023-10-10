import { CodeTable } from './code-table.model';
import { DtoBase } from './dtobase.model';
import { ServicingOrganizationDto } from './servicingOrganizationDto.model';

export class CreditProviderDto extends DtoBase {
  name!: CodeTable;
  servicingOrganization!: ServicingOrganizationDto;
}

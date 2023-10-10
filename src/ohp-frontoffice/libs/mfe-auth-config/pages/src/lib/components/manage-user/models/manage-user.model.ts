export class BaseDto {
  pKey!: number;
  rowVersion?: number;
  state?: DtoState;
  names?: string;
  options?: any;
  value?: string;
}

export enum DtoState {
  unknown,
  created,
  unmodified,
  dirty,
  deleted
}

export class CodeTableDto {
  codeId!: number;
  enumCaption!: string | null;
  caption?: string;
  names?: string ;
  options?: any;
  value?: string;
}

export class SearchUserRequestDto {
  userName="";
  lastName="";
  employeeNr="";
}

export class UserDto extends BaseDto
{
  userName!: string;
  password!: string;
  employeeNr!:number;
  name!: string;
  firstName!: string;
  initials!: string;
  email!: string;
  telNr!: string;
  personalTelNr!: string | null;
  faxNr!: string;
  access2config!: boolean;
  isIntegrationUser!: boolean;
  language!: CodeTableDto | null;
  displayName!: string;
  userProfile2CreditProvider: UserProfile2CreditProviderDto[] = [];
  isSelected!: boolean;
}

export class ProductFamilyModuleCombinationDto extends BaseDto {
  module: CodeTableDto = new CodeTableDto;
  productFamily: CodeTableDto = new CodeTableDto;
  productFamilyModuleCombinationCaption!: string;
}

export class UserProfile2CreditProviderDto extends BaseDto
{
  userProfile: CodeTableDto = new CodeTableDto;
  creditProvider: CreditProviderDto = new CreditProviderDto;
  productFamilyModuleCombination: ProductFamilyModuleCombinationDto = new ProductFamilyModuleCombinationDto;
  priority!: number;
}

export class CreditProviderDto extends BaseDto {
  name: CodeTableDto = new CodeTableDto;
  servicingOrganization!: ServicingOrganizationDto | null;
}

export class ServicingOrganizationDto extends BaseDto{
  name!: CodeTableDto;
}

export class GetManageUserAssociationsResponseDto {
  creditProviderList!: CreditProviderDto[];
  languageList!: CodeTableDto[];
  userProfileNameList!: CodeTableDto[];
  productFamilyModuleCombinationList!: ProductFamilyModuleCombinationDto[];
}

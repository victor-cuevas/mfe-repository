
export class BaseDto
{
  pKey!: number;
  rowVersion?: number;
  state?: DtoState;
  names?: string;
  options?: any;
  value?: string;
}

export enum DtoState
{
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
  names?: string;
  options?: any;
  value?: string;
}

export class ManageUserProfileScreenDto
{
  userProfileDetail: UserProfileDetailDto[]=[];
  userProfileNameList!: string[]
  functionalityInfoList!: FunctionalityInfoDto[];
}

export class UserProfileDetailDto extends BaseDto
{
  name!: string;
  isReadOnly!: boolean;
  defaultFunctionality!: CodeTableDto | null;
  defaultWebFunctionality!: CodeTableDto | null;
  rights!: RightDto[];
  functionalityInfo: FunctionalityInfoDto[] = [];
  isSelected!: boolean;
}

export class RightDto extends BaseDto
{
  name!: string;
  functionality!: FunctionalityDto;
  userProfiles!: UserProfileDetailDto[];
}

export class FunctionalityDto extends BaseDto
{
  name!: CodeTableDto;
  authenticationType!: CodeTableDto;
  isReadOnly!: boolean;
}

export class FunctionalityInfoDto extends BaseDto
{
  functionalityName!: CodeTableDto;
  sessionType!: CodeTableDto;
  functionalityId!: number;
  functionalityCaption!: string;
  isAccessible!: boolean;
}


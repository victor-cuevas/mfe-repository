
export class CodeTable {
  codeId!: number
  enumCaption!: string
  caption!: string
}

export class BaseDto {
  pKey!: number
  rowVersion!: number
  state!:DtoState
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class GetRecoveryUserProfileScreenDto {
  userProfileDetail!: RecoveryUserProfileDto[]
  functionalityInfoList!: FunctionalityInfoDto[]
  menuItemFunctionalityInfoList!: FunctionalityInfoDto[]
  applicationRelatedActionFunctionalityInfoList!: FunctionalityInfoDto[]
  portalFunctionalityInfoList!: FunctionalityInfoDto[]
  portalMenuItemInfoList!: FunctionalityInfoDto[]
  webMenuItemList!: FunctionalityInfoDto[]
  webFunctionalityList!: FunctionalityInfoDto[]
}

export class RecoveryUserProfileDto extends BaseDto{
  name!: string
  rights!: RightDto[]
  functionalityInfo!: FunctionalityInfoDto[]
  functionalityMenuItemInfo: FunctionalityInfoDto[]=[]
  functionalityApplicationRelatedActionInfo: FunctionalityInfoDto[] = []
  isReadOnly!: boolean
  portalMenuItemInfo: FunctionalityInfoDto[] = []
  portalFunctionalityInfo: FunctionalityInfoDto[] = []
  isDefaultDebtorProfileForPortal!: boolean
  webMenuItemList: FunctionalityInfoDto[] = []
  webFunctionalityList: FunctionalityInfoDto[] = []
  defaultFunctionality!: FunctionalityInfoDto
  defaultWebFunctionality!: FunctionalityInfoDto
  isSelected!: boolean
}

export class FunctionalityInfoDto extends BaseDto{
  name!: CodeTable
  sessionType!: CodeTable
  functionalityId!: number
  functionalityCaption!: string
  isAccessible!: boolean
  isDefault!: boolean
  seq!: number
}

export class RightDto extends BaseDto {
  name!: string
  functionality!: FunctionalityDto
  userProfiles!: UserProfileDetailDto
}

export class RecoveryUserProfileScreenDto extends BaseDto {
  userProfileDetail: RecoveryUserProfileDto[]=[]
}

export class UserProfileDetailDto extends BaseDto {
  name!: string;
  isReadOnly!: boolean;
  defaultFunctionality!: CodeTable | null;
  defaultWebFunctionality!: CodeTable | null;
  rights!: RightDto[];
  functionalityInfo: FunctionalityInfoDto[] = [];
  isSelected!: boolean;
}

export class FunctionalityDto extends BaseDto {
  name!: CodeTable;
  authenticationType!: CodeTable;
  isReadOnly!: boolean;
}

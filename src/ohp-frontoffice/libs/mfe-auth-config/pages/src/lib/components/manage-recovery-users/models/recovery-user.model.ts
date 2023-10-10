import { RecoveryUserProfileDto } from "../../manage-recovery-user-profile/models/recovery-user-profile.model";

export class BaseRefDto {
  pKey!: number;
  rowVersion?: number;
}

export class BaseDto {
  pKey!: number
  rowVersion!: number
  state!: DtoState
}

export enum DtoState {
  unknown,
  created,
  unmodified,
  dirty,
  deleted
}

export class CodeTable {
  codeId!: number;
  enumCaption!: string | null;
  caption?: string;
  names?: string;
  options?: any;
  value?: string;
}

export class GetRecoveryUserAssociationsResponseDto {
  languageList!: CodeTable[]
  userProfileList!: RecoveryUserProfileDto[]
  initiatorRefList!: InitiatorRefDto[]
  legalEntityRefList!: LegalEntityRefDto[]
  customerRefList!: CustomerRefDto[]
  servicingLabelRefList!: ServicingLabelRefDto[]
  user2UserProfileLimitationTypeList!: CodeTable[]
  actionReceiverList!: ActionReceiverDto[]
}

export class InitiatorRefDto extends BaseRefDto {
  name!: string
  legalEntityFK!: number
}

export class LegalEntityRefDto extends BaseRefDto {
  name!: string
  hostedOrganizationName!: string
}

export class CustomerRefDto extends BaseRefDto {
  name!: string
  LegalEntityFK!: number
}

export class ServicingLabelRefDto extends BaseRefDto {
  name!: string
}

export class ActionReceiverDto extends BaseDto {
  actionReceiverType!: CodeTable
}

export class RecoveryUserDto extends BaseDto {
  userName!: string | null;
  password!: string;
  employeeNr!: number;
  name!: string;
  firstName!: string;
  initials!: string;
  email!: string;
  telNr!: string;
  personalTelNr!: string | null;
  faxNr!: string;
  access2config!: boolean;
  isIntegrationUser!: boolean;
  language!: CodeTable ;
  displayName!: string;
  userProfiles: UserProfileInfoDto[]=[]
  actionReceiver2UserList: ActionReceiver2UserDto[]=[]
  userType!:string;
  isSelected!: boolean
}

export class UserProfileInfoDto extends BaseDto {
  userProfileName!: string
  priority!: number | null
  limitations: LimitationInfoDto[]=[]
  isUserProfileSelected!: boolean
}

export class LimitationInfoDto extends BaseDto {
  name!: string
  limitationType: CodeTable = new CodeTable
}

export class ActionReceiver2UserDto extends BaseDto {
  userName!: string
  isSelected!: boolean
  isOnlyForTaskCreation!: boolean
  actionReceiver!: ActionReceiverDto
}

export class SearchUsersRequestDto {
  userName=null
  lastName=null
  employeeNr=null
}

export class LanguageDto extends CodeTable
{
}


export class CodeTable {
  codeId!: number
  enumCaption!: string
  caption!: string
}

export class EntityDtoBase {
  pKey!: number
  rowVersion!: number
  state!: DtoState
  canValidate!: boolean
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class GetCodeTablesOfRunAccBookingPlanDto {
  runnAccAccountStatusList!:CodeTable[]
  runnAccAmortizationScheduleList!: CodeTable[]
  consumerProductTypeList!: CodeTable[]
  countryList!: CodeTable[]
  runningAccountTypeList!: CodeTable[]
  runningAccountOwnerTypeList!: CodeTable[]
  balanceMovementTypeList!: CodeTable[]
  postingKeyList!: CodeTable[]
  currencyList!: CodeTable[]
  productNameList!: CodeTable[]
  creditProviderList!:CreditProviderDto[]
  ownerTypeList!: CodeTable[]
}

export class RunnAccBookingPlanDto extends EntityDtoBase {
  runnAccAccountStatus!: CodeTable
  runnAccAmortizationSchedule!: CodeTable
  consumerProductType!: CodeTable
  country!: CodeTable
  endDate!: Date
  minDuration!: number
  name!: string
  owner!: number
  ownerType!: CodeTable
  runnAccAccountType!: CodeTable
  productNbr!: number
  seqNt!: number
  startDate!: Date
  runnAccBookingList: RunnAccBookingDto[]=[]
  modifiedStartDate!: string | null
  modifiedEndDate!: string | null
  modifiedProductNbr!: CodeTable
  modifiedowner!: CreditProviderDto
  isSelected!: boolean
  isNameReadOnly!: boolean 
}

export class RunnAccBookingDto extends EntityDtoBase{
  aggregate!: boolean
  modifiedAggregate!: string
  balanceMovementType!: CodeTable
  journalNr!: number
  runnAccGLList: RunnAccGLDto[] =[]
  isBookingSelected!: boolean;
  balanceMovementTypeList: CodeTable[] = []
  isExcludedFromGL!: boolean
  modifiedGL!: string
}

export class RunnAccGLDto extends EntityDtoBase {
  accountNr!: number
  currency!: CodeTable
  postingKey!: CodeTable
  isGLSelected!: boolean
}

export class CreditProviderDto extends EntityDtoBase{
  name!: CodeTable
  servicingOrganization!: ServicingOrganizationDto
}

export class ServicingOrganizationDto extends EntityDtoBase{
  name!: CodeTable
}

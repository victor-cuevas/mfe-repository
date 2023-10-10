import { codeTable } from "../../revision-period-definition/Models/codeTable.model";

export class DtoBase {
  pKey!: number;
  rowVersion!: number
  canValidate!: boolean
  state!:DtoState
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class CodeTable {
  codeId!: number
  caption!: string
  extRefCode!: string
  seqNo!: number
  defaultCaption!: string
  enumCaption!: string
}

export class RefClassBaseDto {
  pKey!:number
  rowVersion!: number
}

export class GetCreditProviderSettingsDto extends DtoBase{
  creditProviderList!: CreditProviderRefDto[]
  creditDossierStructureList!: CodeTable[]
  userList!: UserDto[]
  reasonCodeList!: CodeTable[]
  periodicityList!: CodeTable[]
  followUpEventNameList!: CodeTable[]
  defaultingMutationCostsList!: CodeTable[]
  bonusRefundReceiverTypeList!: CodeTable[]
  dueInInstallmentCalculationMethodList!: CodeTable[]
  bonusInInstallmentCalculationMethodList!: CodeTable[]
  expectedMarginCalculationMethodList!: CodeTable[]
  theoreticalEndDateDeterminationTypeList!: CodeTable[]
  directDebitEventsList!: DirectDebitEventDto[]
  directDebitConfigList!: DirectDebitConfigDto[]
  creditProviderSettingList!: CreditProviderSettingsDto[]
  arrearsConfigurationList!: ArrearsConfigurationDto[]
  isCRMCountryViewGB!: boolean
  creditStatusList!: CodeTable[]
}

export class CreditProviderRefDto extends RefClassBaseDto{
  name!: CodeTable
}

export class UserDto extends DtoBase {
  userName!: string;
  password!: string;
  employeeNr!: number;
  name!: string;
  firstName!: string;
  initials!: string;
  email!: string;
  telNr!: string;
  personalTelNr!: string ;
  faxNr!: string;
  access2config!: boolean;
  isIntegrationUser!: boolean;
  language!: CodeTable;
  displayName!: string;
}

export class DirectDebitEventDto extends DtoBase {
  reasonCode!: CodeTable
  sendEvent!: CodeTable
  resendEvent!: CodeTable
}

export class DirectDebitConfigDto extends DtoBase {
  daysBeforeDueDate!: number | null
  isIOA!: boolean
  stopAllocationReversalsUponStornoWithCoveringBonus!: boolean
  creditProvider: CreditProviderRefDto = new CreditProviderRefDto
  creditorSchemeID!:string
  daysLimitOnResend!: number | null
  daysOnResend!: number | null
  aggregateDirectDebitCollection!: boolean
  maxAmtPrecomputed!: number
  isMaxAmtPrecomputed!: boolean
  maxAmtPrecomputedPercentage!: number | null
  maxAmtRevolving!: number
  isSplitEqualPrecomputed!: boolean
  isSplitEqualRevolving!: boolean
  directDebitConfigResendList!: DirectDebitConfigResendDto[]
  isAssumedPaid!: boolean
  includeArrearsInInstallmentCalculationMaxAmount!: number | null
  includeBonusInInstallmentCalculationMaxAmount!: number | null
  claimDateDeviationFromDueDate!: number | null
  useBusinessDaysForClaimDateCalculation!: boolean
  dueInInstallmentCalculationMethod!: CodeTable
  bonusInInstallmentCalculationMethod!: CodeTable
  sendDirectDebitInstruction!: boolean
  daysToProcessDDInstruction!: number | null
  isDebitSelected!: boolean
  useNextBusinessDayIfReferenceDateIsNotABusinessDay!: boolean
}

export class DirectDebitConfigResendDto extends DtoBase {
  reasonCode!: CodeTable
  isSelected!: boolean
  directDebitEvents: DirectDebitEventDto = new DirectDebitEventDto
  isEventSelected!: boolean
}

export class CreditProviderSettingsDto extends DtoBase {
  servicingAccount!:string
  minBonusThresholdforRefund!:number
  disbursementAccount!: string
  collectionsAccount!: string
  financialInstitutionPrefix!: string
  identificationNr!: string
  creditProvider!: CreditProviderRefDto
  minDueDatesForTask!: number | null
  minDueDatesForUrgentTask!: number | null
  minDueThresholdforRemise!: number
  maxDueThresholdforRemise!: number
  minDueElapsedPeriodforRemise!: number | null
  maxDueElapsedPeriodForRemise!: number | null
  collectionsConfiguration!: CollectionsConfigurationDto
  creditProvider2ArrearConfiguration!: CreditProviderSettings2ArrearsConfigurationDto[]
  prepaymentSettings: PrepaymentSettingsDto = new PrepaymentSettingsDto
  enableCommissionPayments!: boolean
  disbursementBIC!: string
  paymentValidationSettings: PaymentValidationSettingsDto[]=[]
  trustedIBANAccounts!: TrustedIBANAccountDto[]
  bannedAccountNumbers!: BannedAccountNumberDto[]
  isServiced!: boolean
  nrOfDaysForIsRegularCalculationBase!: number | null
  defaultingMutationCosts!: CodeTable
  minAmountForBonusTaskForRevolving!: number
  checkOnServicingNoticeUponDebtorDate!: boolean
  isIntermediateWriteOffAllowed!: boolean
  isCreditReferenceFormattingRequired!: boolean
  servicingNoticeUponDebtorNumberOfDays!: number | null
  commissionNotePeriodicity!: CodeTable
  creditDossierStructure!: CodeTable
  commissionNoteCalendarDay!: number
  modifiedCommissionNoteCalendarDay!: CodeTable
  maxTotalMutationCostPerCredit!: number
  chargeMutationCostOncePerMutationType!: boolean
  maxTotalMutationCostPerDossierMutation!: number
  useDossierLTV!: boolean
  calculateFirstInterestFromPaymentOutDate!: boolean
  thirdPartyWarrantyPercentage!: number
  nrOfDaysDeviationForFirstInterestCalculation!: number | null
  dueDateCalendarDay!: number
  modifiedDueDateCalendarDay!: CodeTable
  bonusRefundReceiverType!: CodeTable
  chargeFirstInterestAtFirstDueDateCalendarDay!: boolean
  applyInterestCapitalizationForRevolvingCredits!: boolean
  applyMinMaxNetRate!: boolean
  no4EyeValidationForCollateralMutation!: boolean
  no4EyeValidationForRoleMutation!: boolean
  transferRemainingGracePeriod!: boolean
  removeRateRevisionProposalsUnderMinRate!: boolean
  actualizationConfigs: ActualizationConfigDto[]=[]
  actualizationThresholdForOutstanding!: number
  actualizationFrequencyForOutstanding!: number | null
  actualizationThresholdForRemainingDuration!: number | null
  actualizationFrequencyForRemainingDuration!: number | null
  validateSourceEconomicalOwnerForDossierLevelTransfer!: boolean
  extendRevisionPeriodsWithinLimit!: boolean
  numberOfMonthsToExtendRevisionPeriod!: number | null
  numberOfDaysToExtendVariableRevisionPeriod!: number | null
  expectedMarginCalculationMethod!: CodeTable
  no4EyeValidationForRealEstateValue!: boolean
  arrearsConfigurations!: ArrearsConfigurationDto[]
  theoreticalEndDateDeterminationType!: CodeTable
  trustedDomesticAccounts!: TrustedDomesticAccountDto[]
  disbursementDomesticAccount!: string
  disbursementSortCode!: string
  collectionsDomesticAccount!: string
  collectionsSortCode!: string
  isCreditSelected!: boolean
  suspendDirectDebitByDefault!: boolean
  suspendRemindersByDefault!: boolean
}

export class CollectionsConfigurationDto extends DtoBase {
  nrOfDaysBeforeEnfTitleExpiration!: number | null
  paymentPromiseGraceDays!: number | null
  aoERenewalPeriod!: number | null
}

export class CreditProviderSettings2ArrearsConfigurationDto extends DtoBase {
  arrearsConfiguration!: ArrearsConfigurationDto 
  creditStatus!: CodeTable
  arrearConfigList!: ArrearsConfigurationDto[]
  enableArrearConfig!: boolean
}

export class ArrearsConfigurationDto extends DtoBase {
  name!:string
  arrearsConfiguration2TxElTypeList!: ArrearsConfiguration2TxElTypeDto[]
}

export class ArrearsConfiguration2TxElTypeDto extends DtoBase {
  TxElType!: TxElTypeDto
}

export class TxElTypeDto extends CodeTable {

}

export class PrepaymentSettingsDto extends DtoBase {
  minRemainingValueAfterPrepayment!: number
  maxDueAfterPrepaymentForMortgage!: number
  nrOfDaysAdvancedNotice!: number | null
  automaticPartialPrepaymentForPaymentIn!: boolean
}

export class PaymentValidationSettingsDto extends DtoBase {
  paymentValidatorGroups: PaymentValidatorGroupDto[]=[]
  maxAmountForConstructionDepotPayment!: number
  maxAmountForSubsidyPayment!: number
  maxAmountForBonusPayment!: number
  maxAmountForCostPayment!: number
  maxAmountForPaymentOut!: number
  maxAmountForIntermediaryPayment!: number
  maxAmountForMortgageDossierPayment!: number
  maxAmountForRunningAccountPayment!: number
}

export class PaymentValidatorGroupDto extends DtoBase {
  name!:string
  paymentValidators: PaymentValidatorDto[]=[]
  isForConstructionDepotPayment!: boolean
  isForMortgageDossierPayment!: boolean
  isForBonusRefund!: boolean
  isForCostPayment!: boolean
  isForPaymentOut!: boolean
  isForIntermediaryPayment!: boolean
  isForSubsidyPayment!: boolean
  isForRunningAccountPayment!: boolean
  isPaymentValidatorGroupSelected!: boolean;
}

export class PaymentValidatorDto extends DtoBase {
  name!: UserDto | null 
  email!: string
  isPaymentValidatorIsSelected!: boolean;
}

export class TrustedIBANAccountDto extends DtoBase {
  bicCode!:string | null
  payeeReference!: string | null
  city!: string | null
  houseNr!: string | null
  houseNumberSuffix!: string
  ibanAccount!: string | null
  name!: string | null
  postalCode!: string | null
  street!: string | null
  box!: string
  country!: CodeTable | null
  isTrustedIBANAccountSelected!: boolean
  isEnablePostalCodeAutoComplete!: boolean;
  isEnableStreetAutoComplete!: boolean;
  isEnableCity!: boolean
  isEnableStreet!: boolean
  modifiedIbanAccount!: string | null
  isFilterData!: boolean
}

export class BannedAccountNumberDto extends DtoBase {
  bicCode!: string
  city!: string
  houseNr!: number
  ibanAccount!: string | null
  name!: string | null
  postalCode!: string
  street!: string
  isBannedAccountSelected!: boolean;
  modifiedIban!: string | null
  isFilterData!: boolean
}

export class ActualizationConfigDto extends DtoBase {
  minDurationInMonths!: number | null
  maxDurationInMonths!: number | null
  percentageOfLimitThreshold!: number
  isActualizationSelected!: boolean
}

export class TrustedDomesticAccountDto extends DtoBase {
  domesticAccount!: string | null
  sortCode!: string | null
  name!: string | null
  payeeReference!: string | null
  isTrustedDomesticAccountSelected!: boolean
  isFilterData!: boolean
}

export class SaveCreditProviderSettingDto {
  directDebitConfigList!: DirectDebitConfigDto[]
  creditProviderSettingList!: CreditProviderSettingsDto[]
}

export class FilterBannedACCriteriaDto extends DtoBase {
  ibanAccount!:string
  name!: string
  creditProviderSettingsFKey!: string
}

export class FilterTrustedDomesticAccountCriteriaDto extends DtoBase {
  domesticAccount!:string
  sortCode!: string
  name!: string
  creditProviderSettingsPKey!: number
  creditProviderPKey!: number
}

export class FilterTrustedIBANCriteriaDto extends DtoBase {
  ibanAccount!: string
  name!: string
  creditProviderSettingsFKey!: number
  creditProviderPKey!: number
}

export class CountryDto extends codeTable {

}

export class GetPostalCodeCityRequest extends DtoBase {
  postalCode!: string
  streetName!: string
  cityName!: string
  houseNumber!:string
  country!: CountryDto
}

export class GetCreditProviderRefCodeData {
  postalCodeCityList!: PostalCodeCityDto[]
  bICCodes!:string[]
}

export class PostalCodeCityDto extends DtoBase {
  city!:string
  postalCode!: string
  caption!:string
}

export class SearchPostalCodeCityRequest {
  postalCode!: string
  country!: CountryDto
}

export class SearchPostalCodeCityDto extends DtoBase {
  cityNameList!:string[]
  streetNameList!: string[]
  postalCodeList!: string[]
}


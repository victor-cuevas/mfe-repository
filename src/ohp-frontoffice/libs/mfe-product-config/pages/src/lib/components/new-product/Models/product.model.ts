import { baseModel } from "./baseModel.model";
import { commercialNameList } from "./commercialNameList.model";
import { commissionCalculationMethodList } from "./commissionCalculationMethodList.model";
import { consumerProductType } from "./consumerProductType.model";
import { costTypeList } from "./costTypeList.model";
import { countryList } from "./countryList.model";
import { creditInsurerList } from "./creditInsurerList.model";
import { defaultRevisionPeriodForRateRevision } from "./defaultRevisionPeriodForRateRevision.model";
import { depotAllocationMethodList } from "./depotAllocationMethodList.model";
import { dueTransferMethod } from "./dueTransferMethod.model";
import { economicalOwner } from "./economicalOwner.model";
import { extensionProcessRestartEvent } from "./extensionProcessRestartEvent.model";
import { extensionProcessStartEvent } from "./extensionProcessStartEvent.model";
import { interestCalculationList } from "./interestCalculationList.model";
import { ioaCalculationBaseList } from "./ioaCalculationBaseList.model";
import { ioaCalculationList } from "./ioaCalculationList.model";
import { ioaPercentageDefinition } from "./ioaPercentageDefinition.model";
import { judicialOwner } from "./judicialOwner.model";
import { loanPurposeList } from "./loanPurposeList.model";
import { newProductNameAtRateRevision } from "./newProductNameAtRateRevision.model";
import { paymentAllocation } from "./paymentAllocation.model";
import { paymentAllocationType } from "./paymentAllocationType.model";
import { periodicityList } from "./periodicityList.model";
import { product2AmortizationScheduleList } from "./product2AmortizationScheduleList.model";
import { product2FeeConfigList } from "./product2FeeConfigList";
import { product2ProductNameList } from "./product2ProductNameList.model";
import { productFamilyList } from "./productFamilyList.model";
import { productName } from "./productName.model";
import { rateRevisionReevaluationMethodList } from "./rateRevisionReevaluationMethodList.model";
import { reminderScenario } from "./reminderScenario.model";
import { retailLendingSubTypeList } from "./retailLendingSubTypeList.model";
import { revisionPeriodSelectionMethodForPenaltyList } from "./revisionPeriodSelectionMethodForPenaltyList.model";
import { revisionProcessRestartEvent } from "./revisionProcessRestartEvent.model";
import { revisionProcessStartEvent } from "./revisionProcessStartEvent.model";
import { servicingCustomer } from "./servicingCustomer.model";
import { valueReductionPrinciple } from "./valueReductionPrinciple.model";
import { writeOffInterestPercentageDefinitionList } from "./writeOffInterestPercentageDefinitionList.model";
import { writeOffPenaltyMethodList } from "./writeOffPenaltyMethodList.model";

export class product extends baseModel{
  
  product2FeeConfigList: product2FeeConfigList[]=[]
  product2AmortizationScheduleList: product2AmortizationScheduleList[]=[]
  extensionProcessStartEvent!: extensionProcessStartEvent
  extensionProcessRestartEvent!: extensionProcessRestartEvent
  isConstructionDepotAllowed!: boolean
  commercialName!: commercialNameList
  consumerProductType!: consumerProductType
  country!: countryList
  creationDate!: string
  creationUser!: string
  endDate!: Date|null
  modifiedStartDate!: string | null
  modifiedEndDate!:string|null
  externalProductNr!: string
  interestCalculation?: interestCalculationList|null
  ioaCalculationBase?: ioaCalculationBaseList|null
  ioaCalculation?: ioaCalculationList|null
  ioaPercentageDefinition?: ioaPercentageDefinition|null
  paymentAllocationType!: paymentAllocationType
  periodicity!: periodicityList
  productName!: productName
  productNr!: number |null
  ioaMinimumAmount!: number|null
  loanPurposeList: loanPurposeList[]=[]
  servicingCustomer!: servicingCustomer
  economicalOwner!: economicalOwner
  judicialOwner!: judicialOwner
  ioaGracePeriod!: number|null
  startDate!: Date
  reminderScenarios: reminderScenario[]=[]
  paymentAllocations: paymentAllocation[]=[]
  isDuplicateReminderScenario!: boolean
  isDuplicatePaymentAllocation!: boolean
  maxCalibrationMonths!: number|null
  creditInsurer!: creditInsurerList
  valueReductionPrinciples: valueReductionPrinciple[]=[]
  ioaApplicable!: boolean
  productFamily!: productFamilyList
  retailLendingSubType!: retailLendingSubTypeList
  noSepaCTOut!: boolean
  costTypeList: costTypeList[]=[]
  revisionProcessStartEvent!: revisionProcessStartEvent
  revisionProcessRestartEvent!: revisionProcessRestartEvent
  revisionProcessReferenceDateOffset!: number
  revisionPeriodSelectionMethodForPenalty!: revisionPeriodSelectionMethodForPenaltyList
  writeOffPenaltyMethod!: writeOffPenaltyMethodList
  commissionCalculationMethod!: commissionCalculationMethodList
  depotAllocationMethod!: depotAllocationMethodList
  isAutomaticRateAdaptationReevaluationApplicable!: boolean
  writeOffInterestApplicable!: boolean
  writeOffInterestPercentage!: number|null
  writeOffInterestPercentageDefinition?: writeOffInterestPercentageDefinitionList|null
  ioaResetGracePeriodAfterDueDate!: boolean
  writeOffInterestCalculationDay!: number|null
  isMortgageForTaxCertificate!: boolean
  productConversionNecessaryAtRateRevision!: boolean
  newProductNameAtRateRevision!: newProductNameAtRateRevision
  product2ProductNameList: product2ProductNameList[]=[]
  useAPC!: boolean
  rateRevisionReevaluationMethod!: rateRevisionReevaluationMethodList
  defaultRevisionPeriodForRateRevision!: defaultRevisionPeriodForRateRevision
}

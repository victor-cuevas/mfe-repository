import { actualizationTypeList } from "./actualizationTypeList.model"
import { amortizationRecalculationTypeList } from "./amortizationRecalculationTypeList.model"
import { amortizationSheduleList } from "./amortizationSheduleList.model"
import { baseModel } from "./baseModel.model"
import { commercialNameList } from "./commercialNameList.model"
import { commissionCalculationMethodList } from "./commissionCalculationMethodList.model"
import { costTypeList } from "./costTypeList.model"
import { countryList } from "./countryList.model"
import { creditInsurerList } from "./creditInsurerList.model"
import { creditProviderList } from "./creditProviderList.model"
import { creditStatusList } from "./creditStatusList.model"
import { depotAllocationMethodList } from "./depotAllocationMethodList.model"
import { dueTransferMethod } from "./dueTransferMethod.model"
import { feeCalculationTypeList } from "./feeCalculationTypeList.model"
import { feeConfig } from "./feeConfig.model"
import { feeTypeList } from "./feeTypeList.model"
import { followUpEventNameList } from "./followUpEventNameList.model"
import { highestRevisionPeriodMethod } from "./highestRevisionPeriodMethod.model"
import { interestCalculationList } from "./interestCalculationList.model"
import { ioaCalculationBaseList } from "./ioaCalculationBaseList.model"
import { ioaCalculationList } from "./ioaCalculationList.model"
import { ioaPercentageDefinition } from "./ioaPercentageDefinition.model"
import { loanPurposeList } from "./loanPurposeList.model"
import { mutationTypeList } from "./mutationTypeList.model"
import { paymentAllocationRefList } from "./paymentAllocationRefList.model"
import { periodicityList } from "./periodicityList.model"
import { prePaymentCalculation } from "./prePaymentCalculation.model"
import { prepaymentPenaltyMethodList } from "./prepaymentPenaltyMethodList.model"
import { productFamilyList } from "./productFamilyList.model"
import { productName } from "./productName.model"
import { productTypeList } from "./productTypeList.model"
import { rateRevisionReevaluationMethodList } from "./rateRevisionReevaluationMethodList.model"
import { reductionOfLimitBorrowerTypeList } from "./reductionOfLimitBorrowerTypeList.model"
import { reminderScenarioRefList } from "./reminderScenarioRefList.model"
import { retailLendingSubTypeList } from "./retailLendingSubTypeList.model"
import { revisionPeriodList } from "./revisionPeriodList.model"
import { revisionPeriodSelectionMethodForPenaltyList } from "./revisionPeriodSelectionMethodForPenaltyList.model"
import { revolvingDueDateCalculationList } from "./revolvingDueDateCalculationList.model"
import { txElType } from "./txElType.model"
import { valueReductionPrinciple } from "./valueReductionPrinciple.model"
import { writeOffInterestPercentageDefinitionList } from "./writeOffInterestPercentageDefinitionList.model"
import { writeOffPenaltyMethodList } from "./writeOffPenaltyMethodList.model"

export class productCodeTables extends baseModel{
  state!: number
  creditProviderList: creditProviderList[]=[]
  productTypeList: productTypeList[]=[]
  countryList: countryList[] = []
  dueTransferMethodList: dueTransferMethod[] = [];
  highestRevisionPeriodMethodList: highestRevisionPeriodMethod[] = []
  productNameList: productName[] = []
  commercialNameList: commercialNameList[] = []
  amortizationSheduleList: amortizationSheduleList[] = []
  interestCalculationList: interestCalculationList[] = []
  periodicityList: periodicityList[] = []
  ioaPercentageDefinitionList: ioaPercentageDefinition[] = []
  ioaCalculationList: ioaCalculationList[] = []
  ioaCalculationBaseList: ioaCalculationBaseList[] = []
  txElType: txElType[] = []
  prePaymentCalculationDto: prePaymentCalculation[] = []
  loanPurposeDto: loanPurposeList[] = []
  creditStatusList: creditStatusList[] = []
  reminderScenarioRefList: reminderScenarioRefList[] = []
  paymentAllocationRefList: paymentAllocationRefList[] = []
  valueReductionPrinciples: valueReductionPrinciple[] = []
  creditInsurerList: creditInsurerList[] = []
  reductionOfLimitBorrowerTypeList: reductionOfLimitBorrowerTypeList[] = []
  productFamilyList: productFamilyList[] = []
  prepaymentPenaltyMethodList: prepaymentPenaltyMethodList[] = []
  revolvingDueDateCalculationList: revolvingDueDateCalculationList[] = []
  retailLendingSubTypeList: retailLendingSubTypeList[] = []
  costTypeList: costTypeList[] = []
  followUpEventNameList: followUpEventNameList[] = []
  feeConfigList: feeConfig[] = []
  feeTypeList: feeTypeList[] = []
  feeCalculationTypeList: feeCalculationTypeList[] = []
  writeOffPenaltyMethodList: writeOffPenaltyMethodList[] = []
  revisionPeriodSelectionMethodForPenaltyList: revisionPeriodSelectionMethodForPenaltyList[] = []
  commissionCalculationMethodList: commissionCalculationMethodList[] = []
  depotAllocationMethodList: depotAllocationMethodList[] = []
  mutationTypeList: mutationTypeList[] = []
  writeOffInterestPercentageDefinitionList: writeOffInterestPercentageDefinitionList[] = []
  amortizationRecalculationTypeList: amortizationRecalculationTypeList[] = []
  rateRevisionReevaluationMethodList: rateRevisionReevaluationMethodList[] = []
  actualizationTypeList: actualizationTypeList[] = []
  revisionPeriodList: revisionPeriodList[] = []
  useAPC!: boolean;
}

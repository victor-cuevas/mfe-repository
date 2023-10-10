
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { actualizationTypeList } from './Models/actualizationTypeList.model';
import { amortizationRecalculationTypeList } from './Models/amortizationRecalculationTypeList.model';
import { commercialNameList } from './Models/commercialNameList.model';
import { costTypeList } from './Models/costTypeList.model';
import { countryList } from './Models/countryList.model';
import { creditInsurerList } from './Models/creditInsurerList.model';
import { depotAllocationMethodList } from './Models/depotAllocationMethodList.model';
import { feeCalculationTypeList } from './Models/feeCalculationTypeList.model';
import { feeConfig } from './Models/feeConfig.model';
import { interestCalculationList } from './Models/interestCalculationList.model';
import { ioaCalculationBaseList } from './Models/ioaCalculationBaseList.model';
import { ioaCalculationList } from './Models/ioaCalculationList.model';
import { ioaPercentageDefinition } from './Models/ioaPercentageDefinition.model';
import { limitReductionPeriodicity } from './Models/limitReductionPeriodicity.model';
import { loanPurposeList } from './Models/loanPurposeList.model';
import { mutationTypeConfig } from './Models/mutationTypeConfig.model';
import { mutationTypeList } from './Models/mutationTypeList.model';
import { paymentAllocation } from './Models/paymentAllocation.model';
import { periodicityList } from './Models/periodicityList.model';
import { prePaymentCalculation } from './Models/prePaymentCalculation.model';
import { prepaymentPenaltyMethodList } from './Models/prepaymentPenaltyMethodList.model';
import { product } from './Models/product.model';
import { product2AmortizationScheduleList } from './Models/product2AmortizationScheduleList.model';
import { product2FeeConfigList } from './Models/product2FeeConfigList';
import { product2ProductNameList } from './Models/product2ProductNameList.model';
import { productCodeTables } from './Models/productCodeTables.model';
import { productFamilyList } from './Models/productFamilyList.model';
import { productName } from './Models/productName.model';
import { productPrecomputed } from './Models/productPrecomputed.model';
import { productRevolving } from './Models/productRevolving.model';
import { productTypeList } from './Models/productTypeList.model';
import { reductionOfLimitBorrowerTypeList } from './Models/reductionOfLimitBorrowerTypeList.model';
import { reminderScenario } from './Models/reminderScenario.model';
import { reminderScenarioRefList } from './Models/reminderScenarioRefList.model';
import { reservationCommission } from './Models/reservationCommission.model';
import { retailLendingSubTypeList } from './Models/retailLendingSubTypeList.model';
import { revolvingDueDateCalculationList } from './Models/revolvingDueDateCalculationList.model';
import { servicingCustomer } from './Models/servicingCustomer.model';
import { stateModel } from './Models/stateModel.model';
import { valueReductionPrinciple } from './Models/valueReductionPrinciple.model';
import { writeOffInterestPercentageDefinitionList } from './Models/writeOffInterestPercentageDefinitionList.model';
import { writeOffPenaltyMethodList } from './Models/writeOffPenaltyMethodList.model';
import { NewProductService } from './service/new-product.service';
import { SpinnerService } from '@close-front-office/mfe-product-config/core'
import { newProductNameAtRateRevision } from './Models/newProductNameAtRateRevision.model';
import { precomputedResponse } from './Models/precomputedResponse.model';
import { revolvingResponse } from './Models/revolvingResponse.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';
import { dueTransferMethod } from './Models/dueTransferMethod.model';
import { highestRevisionPeriodMethod } from './Models/highestRevisionPeriodMethod.model';
import { CommercialNameDto } from '../search-product/Models/commercial-name.model';
import { revisionPeriodSelectionMethodForPenaltyList } from './Models/revisionPeriodSelectionMethodForPenaltyList.model';



@Component({
  selector: 'mprdc-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public startDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public productFamilyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public retailLendingTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public productNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public retailLendingSubTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public servicingCustomerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public commercialOwnerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public productNrTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public creditInsurerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public periodicityDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public interestCalculationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public minDurationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public maxDurationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public feeTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public feeCalculationTypeCalculationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public feeAmountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public feePercentageTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public productNameListDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public paymentAllocationTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public paymentAllocationCreditStatusDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public percentageDefinitionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public calculationBaseDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public calculationMethodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public writeOffpercentageDefinitionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public graceDaysTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public writeoffpercentageBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public calculationDayTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public startPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public endPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public rateTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public nrOfMonthsBeforeLRTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public reductionOfLimitAgeTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public reductionOfLimitBorrowerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public LimitPeriodsTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public LRPeriodicityDropdownconfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public prePaymentCalculationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public prepaymentPenaltyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public excemptionPercentageTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public penaltyPercentageTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public penaltyBeforeRevisionTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public penaltyAfterRevisionTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public writeOffPenaltyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public revisionPeriodSelectionMethodForPenaltyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public valueReductionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public valueReductionCreditStatusDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reminderScenarioDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reminderScenarioCreditStatusDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public defaultLimitTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public minLimitTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public maxLimitTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NewProductNameAtRateRevisionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public HighestRevisionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  paymentAllocationcolumn = [
    { header: this.translate.instant('product.newProduct.tab.tabHead.PaymentAllocation'), field: 'paymentAllocation.paymentAllocationType?.caption', property: 'paymentAllocationdropdownList', width: '45%' }, { header: this.translate.instant('product.newProduct.card.PayCreditStatus'), field: 'creditStatus.caption', property: 'paymentAllocationdropdownList1', width: '40%' }, { field: null, property: 'Delete', width: '5%' }
  ]
  valueReductioncolumn = [
    { header: this.translate.instant('product.newProduct.card.Value Reduction'), field: 'valueReductionPrinciple.name', property: 'valueReductiondropdownList', width: '45%' }, { header: this.translate.instant('product.newProduct.card.ValCredit Status'), field: 'creditStatus.caption', property: 'valueReductiondropdownList1', width: '40%' }, { field: null, property: 'Delete', width: '5%' }
  ]
  remainderScenariocolumn = [
    { header: this.translate.instant('product.newProduct.card.Remainder Scenario'), field: 'reminderScenario.scenarioType?.caption', property: 'remainderScenariodropdownList', width: '45%' }, { header: this.translate.instant('product.newProduct.card.RCredit Status'), field: 'creditStatus.caption', property: 'remainderScenariodropdownList1', width: '45%' }
  ]
  isUseApccolumn = [
    { field: 'caption', header: this.translate.instant('product.newProduct.card.Product name'), property: 'isUseApcdropdownList', width: '90%' }, { field: null, header: this.translate.instant('product.newProduct.tabel.FreeDelete'), property: 'Delete', width: '10%' }
  ]

  disable!: boolean;
  isRevolving!: boolean;
  isPrecomputed!: boolean;
  prePaymentCalculationVisible!: boolean
  prePaymentPenaltyVisible!: boolean
  minimumAmountVisible!: boolean
  limitReductionStartVisible!: boolean
  reductionOfLimitAgeAndLimitBorrowerVisible!: boolean
  isUpdate!: boolean
  isPost!: boolean
  invalidDueDateCalculation!: boolean
  filteredcountries!: countryList[];
  placeholder = 'select';
  Header = this.translate.instant('product.Validation.Header');
  minDate!: Date
  defaultDate = new Date('01/01/1900');
  maxLength = 4;
  maxDays = 10;
  maxAmount = 21;
  maxLimitForNumbers = 2147483647;
  minValue = 1;
  codeTableValues!: productCodeTables
  codeTableProductName: productName[] = []
  codeTableReminderScenario: reminderScenarioRefList[] = []
  codeTableFeeCalculation: feeCalculationTypeList[] = []
  feeConfigCardValue!: product2FeeConfigList
  RecordsOfProductNameList: product2ProductNameList[] = [];
  RecordsOfValueReduction: valueReductionPrinciple[] = [];
  RecordsOfPaymentAllocation: paymentAllocation[] = [];
  paymentAllocationDup: paymentAllocation[] = []
  valueReductionDup: valueReductionPrinciple[] = []
  remainderScenarioDup: reminderScenario[] = []
  reservationCommissionCardValue!: reservationCommission
  notHideReservationCommission!: boolean
  reservationCommissionIndex!: any
  notHideFeeConfig!: boolean
  isPercentage!: boolean
  isAmount!: boolean;
  feeConfigIndex!: any;
  feeconfigBusinessError = this.translate.instant('product.newProduct.fields.feeconfig');
  paymentAllocationBusinessError = this.translate.instant('product.newProduct.fields.paymentAllocation')
  ValueReductionBusinessError = this.translate.instant('product.newProduct.fields.ValueReduction')
  reminderScenarioBusinessError = this.translate.instant('product.newProduct.fields.reminderScenario')
  countryBusinessError = this.translate.instant('product.newProduct.fields.country')
  amortizationBusinessError = this.translate.instant('product.newProduct.fields.amortization')
  apiBusinessError!:string
  interestOnArrearDisable!: boolean
  writeOffInterestDisable!: boolean
  isGracePeriodZero!: boolean
  blockAndLRCheckVisible!: boolean
  prepaymentPercentageDisable!: boolean
  NotClickedCopy!: boolean
  copyClick!: boolean
  copyYesClick!:boolean
  disableDepositAllocation!: boolean
  ValidationHeader!: any[];
  ReservationCommissionHeader!: any[];
  CostsHeader!: any[];
  FreeConfigHeader!: any[];
  MutationTypeHeader!: any[];
  dataSelected: any;
  path: any;
  isPaymentAllocationBusinessError!: boolean
  isvalueReductionBusinessError!: boolean
  isReminderScenarioBusinessError!: boolean
  isAmortizationBusinessError!: boolean
  isFeeConfigBusinessError!: boolean
  isCountryBusinessError!: boolean
  modifiedFeeAmount!: number;
  modifiedFeePercentage!: number
  precomputedProduct: productPrecomputed = new productPrecomputed();
  revolvingProduct: productRevolving = new productRevolving();
  productCodeTableData: productCodeTables = new productCodeTables();
  productInfo: product = new product();
  minErrorDto: ErrorDto[] = []
  maxErrorDto: ErrorDto[] = []
  minLimitErrorDto: ErrorDto[] = []
  maxLimitErrorDto: ErrorDto[] = []
  defaultMinLimitErrorDto: ErrorDto[] = []
  defaultMaxLimitErrorDto: ErrorDto[] = []
  numberErrorDto:ErrorDto[] = []
  SelectedTabIndex!: number
  showConfirmBox!: boolean
  showCopyConfirmBox!: boolean
  exceptionBox!: boolean
  isErrors!: boolean;
  notProductConversion!: boolean
  navigateUrl!: string
  errorCode!:string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService,
    public service: NewProductService, public datepipe: DatePipe, public activatedRoute: Router, public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService, public decimalpipe: DecimalTransformPipe) {

    this.path = this.activatedRoute.getCurrentNavigation()?.extras?.state;

    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {

      this.SelectedTabIndex = selectedTabIndex;

    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
    this.copyYesClick = false;
  }

  //update or post methods
  // card events
  changeProductFamily(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event?.value != null) {
      console.log(event?.value)
      this.productInfo.productFamily = event?.value;

      if (this.isPrecomputed) {
        if (this.productInfo.productFamily?.codeId == 1) {
          this.prePaymentCalculationVisible = true;
          this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList
          this.precomputedProduct.highestRevisionPeriodMethod = null as unknown as highestRevisionPeriodMethod
          this.prePaymentPenaltyVisible = false;
        }
        else {
          this.prePaymentPenaltyVisible = true;
          this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation
          this.prePaymentCalculationVisible = false;
        }
      }
      else {
        this.prePaymentPenaltyVisible = true;
        this.prePaymentCalculationVisible = true;
      }
      

      if ((this.productInfo.country == null || this.productInfo.consumerProductType == null) ||
        (this.productInfo.productFamily?.codeId != 2 || this.productInfo.country?.caption != 'Netherlands' ||
          this.productInfo.consumerProductType.codeId != 1)) {

        this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList
        this.disableDepositAllocation = true;
      }
      else { this.disableDepositAllocation = false; } 
    }
    else {
      this.productInfo.productFamily = null as unknown as productFamilyList
      this.prePaymentPenaltyVisible = false;
      this.disableDepositAllocation = true;
      this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList
      this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList
      this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation
      this.precomputedProduct.highestRevisionPeriodMethod = null as unknown as highestRevisionPeriodMethod
      this.prePaymentCalculationVisible = false;
      this.productFamilyDropdownConfig.externalError = true;
    }
    this.removePrePaymentCalcAndPenaltyError();
    this.prepaymentPenaltyDropdownConfig.externalError = false;
    this.prePaymentCalculationDropdownConfig.externalError = false;
    this.HighestRevisionDropdownConfig.externalError = false;
  }

  changeRetailLeadingType(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event?.value != null) {
      console.log(event?.value)
      this.productInfo.consumerProductType = event?.value;

      if ((this.productInfo.country == null || this.productInfo.productFamily == null) ||
        (this.productInfo.productFamily?.codeId != 2 || this.productInfo.country?.caption != 'Netherlands' ||
          this.productInfo.consumerProductType.codeId != 1)) {

        this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList
        this.disableDepositAllocation = true;
      }
      else {
        this.disableDepositAllocation = false;
     }

      if (this.productInfo.consumerProductType.codeId != 1) {

        this.isPrecomputed = false;
        this.isRevolving = true;
        this.revolvingProduct = new productRevolving
        this.revolvingProduct.consumerProductType = this.productInfo?.consumerProductType
        this.revolvingProduct.servicingCustomer = this.productInfo?.servicingCustomer
        this.revolvingProduct.productName = this.productInfo?.productName
        this.revolvingProduct.productNr = this.productInfo?.productNr
        this.revolvingProduct.commercialName = this.productInfo?.commercialName
        this.revolvingProduct.country = this.productInfo?.country
        this.revolvingProduct.productFamily = this.productInfo?.productFamily
        this.revolvingProduct.startDate = this.productInfo?.startDate
        this.revolvingProduct.endDate = this.productInfo?.endDate
        this.revolvingProduct.economicalOwner = this.productInfo?.economicalOwner
        this.revolvingProduct.judicialOwner = this.productInfo?.judicialOwner
        this.revolvingProduct.externalProductNr = this.productInfo?.externalProductNr
        this.revolvingProduct.consumerProductType = this.productInfo?.consumerProductType
        this.revolvingProduct.useAPC = this.productInfo?.useAPC;
        this.productInfo = this.revolvingProduct
        this.productInfo.ioaApplicable = true;
        this.productInfo.writeOffInterestApplicable = true;
        this.interestOnArrearDisable = false;
        this.writeOffInterestDisable = false;
        this.notHideReservationCommission = false;
        this.notHideFeeConfig = false;
        
        this.precomputedProduct.durationMaxInMonths = null as unknown as number;
        this.precomputedProduct.durationMinInMonths = null as unknown as number;
        this.precomputedProduct.highestRevisionPeriodMethod = null as unknown as highestRevisionPeriodMethod
        this.precomputedProduct.dueTransferMethod = null as unknown as dueTransferMethod
        this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation;
        this.precomputedProduct.reservationCommissionList = [];
        this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList;
        this.precomputedProduct.prepaymentPenaltyExemptionPercentage = null as unknown as number;
        this.precomputedProduct.rewithdrawable = false;
        this.precomputedProduct.capitalizeInterestAllowed = false;
        this.precomputedProduct.penaltyFreePeriodBeforeRevisionDateInMonths = null as unknown as number;
        this.precomputedProduct.penaltyFreePeriodAfterRevisionDateInMonths = null as unknown as number;
        this.invalidDueDateCalculation = true;
        this.notProductConversion = true;
        this.prePaymentPenaltyVisible = true;
        this.prePaymentCalculationVisible = true;
        this.disableDepositAllocation = true;


        this.productCodeTableData.mutationTypeList.forEach(set => {
          set.isApplicable = false;
          set.isDirtyForIsApplicable = false;
          set.chargeCostForVariableConversion = false;
          set.chargeMutationCosts = false;
          set.no4EyeValidationApplicable = false;
        })
        this.precomputedProduct.mutationTypeConfigList = [];
        this.precomputedProduct.blockSTPPrepayment = false;
        this.precomputedProduct.amortizationRecalculationType = null as unknown as amortizationRecalculationTypeList;
        this.precomputedProduct.prepaymentPenaltyPercentage = null as unknown as number;

        this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList;
        this.codeTableValues.reminderScenarioRefList.forEach(x => {
          if (x.scenarioType.codeId == 2) {
            x.canHide = true;
          }
        })
        this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList.filter(val => {
          if (!val.canHide) {
            return val;
          }
          else return false;
        })

      }
      else {
        this.isPrecomputed = true;
        this.isRevolving = false;
        this.precomputedProduct = new productPrecomputed
        this.precomputedProduct.consumerProductType = this.productInfo?.consumerProductType
        this.precomputedProduct.servicingCustomer = this.productInfo?.servicingCustomer
        this.precomputedProduct.productName = this.productInfo?.productName
        this.precomputedProduct.productNr = this.productInfo?.productNr
        this.precomputedProduct.commercialName = this.productInfo?.commercialName
        this.precomputedProduct.country = this.productInfo?.country
        this.precomputedProduct.productFamily = this.productInfo?.productFamily
        this.precomputedProduct.startDate = this.productInfo?.startDate
        this.precomputedProduct.endDate = this.productInfo?.endDate
        this.precomputedProduct.economicalOwner = this.productInfo?.economicalOwner
        this.precomputedProduct.judicialOwner = this.productInfo?.judicialOwner
        this.precomputedProduct.externalProductNr = this.productInfo?.externalProductNr
        this.precomputedProduct.consumerProductType = this.productInfo?.consumerProductType
        this.precomputedProduct.useAPC = this.productInfo?.useAPC;
        this.productInfo = this.precomputedProduct
        this.productInfo.ioaApplicable = true;
        this.productInfo.writeOffInterestApplicable = true;
        this.interestOnArrearDisable = false;
        this.writeOffInterestDisable = false;

        this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList.filter(val => {
          if (val.codeId != 2) {
            return val;
          }
          else return false;
        })

        
        this.notHideReservationCommission = false;
        this.notHideFeeConfig = false;
        this.productInfo.product2AmortizationScheduleList = [];
        for (let i = 0; i < this.productCodeTableData.amortizationSheduleList.length; i++) {
          this.productInfo.product2AmortizationScheduleList.push({ ...new product2AmortizationScheduleList });
          this.productInfo.product2AmortizationScheduleList[i].amortizationShedule = { ...this.productCodeTableData.amortizationSheduleList[i] };
          this.productInfo.product2AmortizationScheduleList[i].isSelected = false;
        }

        this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList
        this.revolvingProduct.payPercOfLimitDefault = null as unknown as number;
        this.revolvingProduct.payPercOfLimitMax = null as unknown as number;
        this.revolvingProduct.payPercOfLimitMin = null as unknown as number;
        this.revolvingProduct.reductionOfLimitAge = null;
        this.revolvingProduct.reductionOfLimitPeriods = null;
        this.revolvingProduct.reductionOfLimitBorrowerType = null;
        this.revolvingProduct.reductionOfLimitBlockPayment = false;
        this.revolvingProduct.reductionOfLimitModifyRepaymentPerc = false;
        this.revolvingProduct.revolvingDueDateCalculation = null as unknown as revolvingDueDateCalculationList;
        this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = null;
        this.revolvingProduct.isLimitReductionApplicable = false;
        this.revolvingProduct.limitReductionPeriodicity = null;
        this.revolvingProduct.actualizationType = null as unknown as actualizationTypeList;
        this.notProductConversion = true;

        if (this.productInfo?.productFamily != null) {

          if (this.productInfo.productFamily?.caption == this.codeTableValues?.productFamilyList[0]?.caption) {
            this.prePaymentCalculationVisible = true;
            this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList
            this.prePaymentPenaltyVisible = false;
          }
          else {
            this.prePaymentPenaltyVisible = true;
            this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation
            this.prePaymentCalculationVisible = false;
          }
        }
        else {
          this.prePaymentPenaltyVisible = false;
          this.prePaymentCalculationVisible = false;
        }

        this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList;

      }
    }
    else {
      this.productInfo.consumerProductType = null as unknown as productTypeList
      this.isPrecomputed = false;
      this.isRevolving = false;
      this.notHideReservationCommission = false;
      this.notHideFeeConfig = false;
      this.precomputedProduct.durationMaxInMonths = null as unknown as number;
      this.precomputedProduct.durationMinInMonths = null as unknown as number;
      this.precomputedProduct.highestRevisionPeriodMethod = null as unknown as highestRevisionPeriodMethod
      this.precomputedProduct.dueTransferMethod = null as unknown as dueTransferMethod
      this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation;
      this.precomputedProduct.reservationCommissionList = [];
      this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList;
      this.precomputedProduct.prepaymentPenaltyExemptionPercentage = null as unknown as number;
      this.precomputedProduct.rewithdrawable = false;
      this.precomputedProduct.capitalizeInterestAllowed = false;
      this.precomputedProduct.penaltyFreePeriodBeforeRevisionDateInMonths = null as unknown as number;
      this.precomputedProduct.penaltyFreePeriodAfterRevisionDateInMonths = null as unknown as number;
      this.invalidDueDateCalculation = true;
      this.notProductConversion = true;
      this.prePaymentPenaltyVisible = false;
      this.prePaymentCalculationVisible = false;

      this.productCodeTableData.mutationTypeList.forEach(set => {
        set.isApplicable = false;
        set.isDirtyForIsApplicable = false;
        set.chargeCostForVariableConversion = false;
        set.chargeMutationCosts = false;
        set.no4EyeValidationApplicable = false;
      })
      this.precomputedProduct.mutationTypeConfigList = [];
      this.precomputedProduct.blockSTPPrepayment = false;
      this.precomputedProduct.amortizationRecalculationType = null as unknown as amortizationRecalculationTypeList;
      this.precomputedProduct.prepaymentPenaltyPercentage = null as unknown as number;

      this.revolvingProduct.payPercOfLimitDefault = null as unknown as number;
      this.revolvingProduct.payPercOfLimitMax = null as unknown as number;
      this.revolvingProduct.payPercOfLimitMin = null as unknown as number;
      this.revolvingProduct.reductionOfLimitAge = null;
      this.revolvingProduct.reductionOfLimitPeriods = null;
      this.revolvingProduct.reductionOfLimitBorrowerType = null;
      this.revolvingProduct.reductionOfLimitBlockPayment = false;
      this.revolvingProduct.reductionOfLimitModifyRepaymentPerc = false;
      this.revolvingProduct.revolvingDueDateCalculation = null as unknown as revolvingDueDateCalculationList;
      this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = null;
      this.revolvingProduct.isLimitReductionApplicable = false;
      this.revolvingProduct.limitReductionPeriodicity = null;
      this.revolvingProduct.actualizationType = null as unknown as actualizationTypeList;

      this.retailLendingTypeDropdownConfig.externalError = true;
    }
    this.removeActualizationTypeErrors();
    this.removeArrearsErrors();
    this.removePrePaymentCalcAndPenaltyError();
    this.removeDurationErrors();
    this.removeFeeErrors();
    this.removeLRApplicableErrors();
    this.removePenaltyErrors();
    this.removePrincipalAndInterestErrors();
    this.removeProductNameAtRRErrors();
    this.removeWriteOffErrors();
    this.removeReservationCommissionErrors();
    this.setExternalErrorFalse();
    this.RemoveBusinessError(this.feeconfigBusinessError)
    this.RemoveBusinessError(this.paymentAllocationBusinessError)
    this.RemoveBusinessError(this.ValueReductionBusinessError)
    this.RemoveBusinessError(this.reminderScenarioBusinessError)
    this.RemoveBusinessError(this.countryBusinessError)
    this.RemoveBusinessError(this.amortizationBusinessError)
    this.RemoveBusinessError(this.apiBusinessError)
  }

  changeServicingCustomer(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event?.value != null) {
      console.log(event?.value)
      this.productInfo.servicingCustomer = event?.value;
    }
    else {
      this.productInfo.servicingCustomer = null as unknown as servicingCustomer
      this.servicingCustomerDropdownConfig.externalError = true;
    }

  }

  changeCountry(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {

      const country = this.productCodeTableData.countryList.filter(x => {
        return x.caption == event?.caption;
      })
      if (country[0] != null) {
        console.log(country[0]);
        this.productInfo.country = country[0];

        if ((this.productInfo.productFamily == null || this.productInfo.consumerProductType == null) ||
          (this.productInfo.productFamily?.codeId != 2 || this.productInfo.country?.caption != 'Netherlands' ||
            this.productInfo.consumerProductType.codeId != 1)) {

          this.disableDepositAllocation = true;
          this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList

        }
        else { this.disableDepositAllocation = false; }

        this.RemoveBusinessError(this.countryBusinessError);
        this.isCountryBusinessError = false;
      }
    }
    else {
      this.productInfo.country = null as unknown as countryList
      this.disableDepositAllocation = true;
      this.productInfo.depotAllocationMethod = null as unknown as depotAllocationMethodList
      this.RemoveBusinessError(this.countryBusinessError);
      this.isCountryBusinessError = false;
      this.AutoCompleteConfig.externalError = true;
    }
  }

  filterCountry(event: any) {
    if (event) {
      this.filteredcountries = [];

      this.productCodeTableData.countryList
        .filter(data => {
          if (data.caption?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredcountries.push(data);
          }

        });
    }
  }

  clearCountry(event: any) {
    console.log(event);
    setTimeout(() => {
      //this.productInfo.country = null as unknown as countryList;
      this.AutoCompleteConfig.externalError = true;
    }, 100)
  }

  changeRetailLendingSubtype(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      console.log(event?.value)
      this.productInfo.retailLendingSubType = event?.value;
      this.RemoveBusinessError(this.countryBusinessError);
      this.isCountryBusinessError = false;
    }
    else {
      this.productInfo.retailLendingSubType = null as unknown as retailLendingSubTypeList
      this.retailLendingSubTypeDropdownConfig.externalError = true;
    }

  }

  changeProductName(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.productInfo.productName = event?.value;
    }
    else {
      this.productInfo.productName = null as unknown as productName
      this.productNameDropdownConfig.externalError = true;
    }

  }

  changeCommercialName(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.productInfo.commercialName = event?.value;
    }
    else {
      this.productInfo.commercialName = null as unknown as commercialNameList
      this.commercialOwnerDropdownConfig.externalError = true;
    }

  }

  changeProductNumber(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null && event != '0' && event <= this.maxLimitForNumbers) {

      this.productInfo.productNr = parseInt(event);
    }
    else {

      this.productInfo.productNr = event;
      setTimeout(() => {
        this.productInfo.productNr = null as unknown as number
        this.productNrTextBoxconfig.externalError = true;
      },3)
    }

  }

  changeNoSpec(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {

      this.productInfo.noSepaCTOut = event;
    }

  }

  changeRewithdrawable(event: any) {
    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event != null) {

      this.precomputedProduct.rewithdrawable = event;
    }
  }

  changeDepositAllocation(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.depotAllocationMethod = event?.value;
  }

  changeAutomaticReevaluation(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.productInfo.isAutomaticRateAdaptationReevaluationApplicable = event;
  }

  changeMortgageForTax(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {

      this.productInfo.isMortgageForTaxCertificate = event;
    }

  }

  changeStartDate(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {

      this.productInfo.startDate = event;
      this.minDate = new Date(this.productInfo.startDate)
      this.minDate.setDate(this.minDate.getDate()+1)
    }
    else {
      this.productInfo.startDate = null as unknown as Date
      this.startDateconfig.externalError = true;
    }
  }

  changeEndDate(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.endDate = event;

  }
  changeEconomicalOwner(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.economicalOwner = event?.value;
  }

  changeJudicialOwner(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.judicialOwner = event?.value;

  }

  changeExProductNumber(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.externalProductNr = event;

  }

  changeCreditInsurer(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.productInfo.creditInsurer = event?.value;
    }
    else {
      this.productInfo.creditInsurer = null as unknown as creditInsurerList
      this.creditInsurerDropdownConfig.externalError = true;
    }

  }

  changeConstructionDepot(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.productInfo.isConstructionDepotAllowed = event;
  }

  changeCommissionCalculation(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.productInfo.commissionCalculationMethod = event?.value;

  }

  changeCapitalizedInterest(event: any) {
    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    this.precomputedProduct.capitalizeInterestAllowed = event;
  }

  changeRateRevision(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.productInfo.rateRevisionReevaluationMethod = event?.value;

  }

  changeProductConversionAtRateRevision(event:any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {

      this.productInfo.productConversionNecessaryAtRateRevision = event;
      if (this.productInfo.productConversionNecessaryAtRateRevision) {
        this.notProductConversion = false;
      }
      else {
        this.notProductConversion = true;
      }
      this.productInfo.newProductNameAtRateRevision = null as unknown as newProductNameAtRateRevision
      this.removeProductNameAtRRErrors();
    }
  }


  changeNewProductNameAtRateRevision(event:any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.productInfo.newProductNameAtRateRevision = event?.value;
    }
    else {
      this.productInfo.newProductNameAtRateRevision = null as unknown as newProductNameAtRateRevision
      this.NewProductNameAtRateRevisionDropdownConfig.externalError = true;
    }

  }

  changeDueTransfer(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    if (event?.value != null) {
      console.log(event?.value)
      this.precomputedProduct.dueTransferMethod = event?.value;
    }
    else {
      this.precomputedProduct.dueTransferMethod = null as unknown as dueTransferMethod
    }

  }

  removeProductNameAtRRErrors() {
    const removeProductNameErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.NewProductNameAtRateRevision') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeProductNameErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeProductNameErrors, 1);

    }

  }

  // principal and interest

  changePeriodicity(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event?.value != null) {

      this.productInfo.periodicity = event?.value;
    }
    else {
      this.productInfo.periodicity = null as unknown as periodicityList
      this.periodicityDropdownConfig.externalError = true;
    }

  }

  changeInterestCalculation(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.productInfo.interestCalculation = event?.value;
    }
    else {
      this.productInfo.interestCalculation = null as unknown as interestCalculationList
      this.interestCalculationDropdownConfig.externalError = true;
    }

  }

  changeMaxCalibration(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null && event != '0') {

      this.productInfo.maxCalibrationMonths = parseInt(event);
    }
    else {
      this.productInfo.maxCalibrationMonths = event;
      setTimeout(() => {
        this.productInfo.maxCalibrationMonths = null;
      }, 10)
    }

  }

  changeDueDateCalculation(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event?.value != null) {

      this.revolvingProduct.revolvingDueDateCalculation = event?.value;

      if (this.revolvingProduct.revolvingDueDateCalculation.codeId != 2) {

        this.invalidDueDateCalculation = true
      }
      else {
        this.invalidDueDateCalculation = false;
        
      }
      this.revolvingProduct.payPercOfLimitDefault = null as unknown as number
      this.revolvingProduct.payPercOfLimitMin = null as unknown as number
      this.revolvingProduct.payPercOfLimitMax = null as unknown as number
      this.defaultLimitTextBoxconfig.externalError = false;
      this.minLimitTextBoxconfig.externalError = false;
      this.maxLimitTextBoxconfig.externalError = false;
      this.removePrincipalAndInterestErrors()

    }
    else {
      this.revolvingProduct.revolvingDueDateCalculation = null as unknown as revolvingDueDateCalculationList
      this.invalidDueDateCalculation = true
      this.revolvingProduct.payPercOfLimitDefault = null as unknown as number
      this.revolvingProduct.payPercOfLimitMin = null as unknown as number
      this.revolvingProduct.payPercOfLimitMax = null as unknown as number
      this.removePrincipalAndInterestErrors()

    }
  }

  changeAmortizationRecalculation(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    this.precomputedProduct.amortizationRecalculationType = event?.value;

  }

  changeDefault(event: any,isChanged:boolean) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event != null) {
      if (!isChanged) {

        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        
          this.revolvingProduct.payPercOfLimitDefault = parseFloat(floatValue);

        if (this.revolvingProduct.payPercOfLimitMin != null && (this.revolvingProduct.payPercOfLimitDefault < this.revolvingProduct.payPercOfLimitMin)) {
          this.defaultLimitTextBoxconfig.externalError = true;
        }
        
        else if (this.revolvingProduct.payPercOfLimitMax != null && (this.revolvingProduct.payPercOfLimitDefault > this.revolvingProduct.payPercOfLimitMax)) {
          this.defaultLimitTextBoxconfig.externalError = true;
        }
        else if ((this.revolvingProduct.payPercOfLimitMax != null && this.revolvingProduct.payPercOfLimitMin != null) &&
          (this.revolvingProduct.payPercOfLimitMax >= this.revolvingProduct.payPercOfLimitMin))
        {
          setTimeout(() => {
            this.userDetailsform.form.controls['min'].setErrors(null);
            this.userDetailsform.form.controls['max'].setErrors(null);
          }, 1)
        }
        else {
          this.defaultLimitTextBoxconfig.externalError = false;
         
        }

      }
     
    }
    else {
      this.revolvingProduct.payPercOfLimitDefault = null as unknown as number
      this.defaultLimitTextBoxconfig.externalError = true;
    }

  }

  changeMin(event: any,isChanged:boolean) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);


       
          this.revolvingProduct.payPercOfLimitMin = parseFloat(floatValue);


        if (this.revolvingProduct.payPercOfLimitDefault != null && (this.revolvingProduct.payPercOfLimitDefault < this.revolvingProduct.payPercOfLimitMin)) {
          this.minLimitTextBoxconfig.externalError = true;
        }

        else if (this.revolvingProduct.payPercOfLimitMax != null && (this.revolvingProduct.payPercOfLimitMin > this.revolvingProduct.payPercOfLimitMax)) {
          this.minLimitTextBoxconfig.externalError = true;
        }

        else if ((this.revolvingProduct.payPercOfLimitMax != null && this.revolvingProduct.payPercOfLimitDefault != null) &&
          (this.revolvingProduct.payPercOfLimitMax >= this.revolvingProduct.payPercOfLimitDefault)) {
          setTimeout(() => {
            this.userDetailsform.form.controls['default'].setErrors(null);
            this.userDetailsform.form.controls['max'].setErrors(null);
          }, 1)
        }
        else {
          this.minLimitTextBoxconfig.externalError = false;
         
        }
       
      }
     
    }
    else {
      this.revolvingProduct.payPercOfLimitMin = null as unknown as number
      this.minLimitTextBoxconfig.externalError = true;
    }

  }

  changeMax(event: any,isChanged:boolean) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

       
          this.revolvingProduct.payPercOfLimitMax = parseFloat(floatValue);


        if (this.revolvingProduct.payPercOfLimitDefault != null && (this.revolvingProduct.payPercOfLimitDefault > this.revolvingProduct.payPercOfLimitMax)) {
          this.maxLimitTextBoxconfig.externalError = true;
         
        }


        else if (this.revolvingProduct.payPercOfLimitMin != null && (this.revolvingProduct.payPercOfLimitMin > this.revolvingProduct.payPercOfLimitMax)) {
          this.maxLimitTextBoxconfig.externalError = true;
          
        }

        else if ((this.revolvingProduct.payPercOfLimitMin != null && this.revolvingProduct.payPercOfLimitDefault != null) &&
          (this.revolvingProduct.payPercOfLimitMin <= this.revolvingProduct.payPercOfLimitDefault)) {
          setTimeout(() => {
            this.userDetailsform.form.controls['default'].setErrors(null);
            this.userDetailsform.form.controls['min'].setErrors(null);
          }, 1)
        }

        else {
          this.maxLimitTextBoxconfig.externalError = false;
        }

      }
      
    }
    else {
      this.revolvingProduct.payPercOfLimitMax = null as unknown as number
      this.maxLimitTextBoxconfig.externalError = true;
    }
  }

  changeAmortizationSchedule(event: any, codeId: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if ((event && codeId) != null) {
      if (this.productInfo.product2AmortizationScheduleList.length > 0) {

        this.productInfo.product2AmortizationScheduleList.forEach(x => {
          if (x.amortizationShedule.codeId == codeId) {
            x.isSelected = event;
          }
        })
        this.RemoveBusinessError(this.amortizationBusinessError);
        this.isAmortizationBusinessError = false;
      }
    }


  }

  removePrincipalAndInterestErrors() {
    const removeDefaultErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Default list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeDefaultErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeDefaultErrors, 1);

    }

    const removeMinErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Min list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeMinErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMinErrors, 1);

    }

    const removeMaxErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Max list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeMaxErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMaxErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.DMIMA')

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }

  }

  //Payment allocation
  changePaymentAllocationType(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.paymentAllocations[index].state != stateModel.Created) {

      this.productInfo.paymentAllocations[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.paymentAllocationDup = [];

      this.productInfo.paymentAllocations[index].paymentAllocation = event?.value;

      this.paymentAllocationDup = this.productInfo.paymentAllocations.reduce((accumalator: paymentAllocation[], current) => {
        if ((
          !accumalator.some(
            (item: paymentAllocation) => item.paymentAllocation?.paymentAllocationType?.caption == current.paymentAllocation?.paymentAllocationType?.caption &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: paymentAllocation[] = []
      this.productInfo.paymentAllocations.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })
      console.log(this.paymentAllocationDup)
      console.log(compareArray)
      if (this.paymentAllocationDup.length != compareArray.length) {
        this.throwBusinessError(this.paymentAllocationBusinessError);
        this.isPaymentAllocationBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.paymentAllocationBusinessError);
        this.isPaymentAllocationBusinessError = false;
        this.paymentAllocationDup = [];
      }
    }
    else {
      this.productInfo.paymentAllocations[index].paymentAllocation = null
      this.paymentAllocationTypeDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.paymentAllocationBusinessError);
    }

  }

  changePaymentAllocationCreditStatus(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.paymentAllocations[index].state != stateModel.Created) {

      this.productInfo.paymentAllocations[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.paymentAllocationDup = [];
      this.productInfo.paymentAllocations[index].creditStatus = event?.value;

      this.paymentAllocationDup = this.productInfo.paymentAllocations.reduce((accumalator: paymentAllocation[], current) => {
        if ((
          !accumalator.some(
            (item: paymentAllocation) => item.paymentAllocation?.paymentAllocationType?.caption == current.paymentAllocation?.paymentAllocationType?.caption &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: paymentAllocation[] = []
      this.productInfo.paymentAllocations.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })
      console.log(this.paymentAllocationDup)
      console.log(compareArray)
      if (this.paymentAllocationDup.length != compareArray.length) {
        this.throwBusinessError(this.paymentAllocationBusinessError);
        this.isPaymentAllocationBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.paymentAllocationBusinessError);
        this.isPaymentAllocationBusinessError = false;
        this.paymentAllocationDup = [];
      }

    }

    else {
      this.productInfo.paymentAllocations[index].creditStatus = null
      this.paymentAllocationCreditStatusDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.paymentAllocationBusinessError);
    }

  }

  addPaymentAllocations() {
    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid) {
      if (this.isUpdate) {
        this.productInfo.state = stateModel.Dirty;
      }
      else if (this.isPost) {
        this.productInfo.state = stateModel.Created;
      }
      this.paymentAllocationTypeDropdownConfig.externalError = false;
      this.paymentAllocationCreditStatusDropdownConfig.externalError = false;
      const paymentAllocationsObj = new paymentAllocation();
      paymentAllocationsObj.state = stateModel.Created;
      paymentAllocationsObj.pKey = 0;
      paymentAllocationsObj.canValidate = false;
      paymentAllocationsObj.isDelete = false;
      paymentAllocationsObj.rowVersion = 0;
      const newlist = this.productInfo.paymentAllocations;
      newlist.push({ ...paymentAllocationsObj });
      this.productInfo.paymentAllocations = [...newlist];

    }
    else {
      this.setExternalError();
    }
  }

  deletePaymentAllocations(event: paymentAllocation, gridData: paymentAllocation[]) {
    this.RemoveBusinessError(this.apiBusinessError);
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.paymentAllocationDup = [];

    const deletedata = gridData.findIndex(data => {
      return data == event;
    });

    event.state = stateModel.Deleted;


    event = <paymentAllocation>{}
    setTimeout(() => {
      this.deletePaymentAllocationData(deletedata, gridData);
    }, 100);

    this.paymentAllocationCreditStatusDropdownConfig.externalError = false;
    this.paymentAllocationTypeDropdownConfig.externalError = false;
  }

  deletePaymentAllocationData(deletedata: number, paymentAllocationGrid: paymentAllocation[]) {
    paymentAllocationGrid[deletedata].isDelete = true;

    this.productInfo.paymentAllocations = [...paymentAllocationGrid];

    this.paymentAllocationDup = this.productInfo.paymentAllocations.reduce((accumalator: paymentAllocation[], current) => {
      if ((
        !accumalator.some(
          (item: paymentAllocation) => item.paymentAllocation?.paymentAllocationType?.caption == current.paymentAllocation?.paymentAllocationType?.caption &&
            item.creditStatus?.caption == current.creditStatus?.caption
        ) && (!current.isDelete))
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);

    const compareArray: paymentAllocation[] = []
    this.productInfo.paymentAllocations.forEach(x => {
      if (!x.isDelete) {
        compareArray.push(x);
      }
    })
    console.log(this.paymentAllocationDup)
    console.log(compareArray)
    if (this.paymentAllocationDup.length != compareArray.length) {
      this.throwBusinessError(this.paymentAllocationBusinessError);
      this.isPaymentAllocationBusinessError = true;
    }
    else {
      this.RemoveBusinessError(this.paymentAllocationBusinessError);
      this.isPaymentAllocationBusinessError = false;
      this.paymentAllocationDup = [];
    }

  }

  //value Reduction
  changeValuePrinciple(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.valueReductionPrinciples[index].state != stateModel.Created) {

      this.productInfo.valueReductionPrinciples[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.valueReductionDup = [];

      this.productInfo.valueReductionPrinciples[index].valueReductionPrinciple = event?.value;

      this.valueReductionDup = this.productInfo.valueReductionPrinciples.reduce((accumalator: valueReductionPrinciple[], current) => {
        if ((
          !accumalator.some(
            (item: valueReductionPrinciple) => item.valueReductionPrinciple?.name == current.valueReductionPrinciple?.name &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: valueReductionPrinciple[] = []
      this.productInfo.valueReductionPrinciples.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })

      if (this.valueReductionDup.length != compareArray.length) {
        this.throwBusinessError(this.ValueReductionBusinessError);
        this.isvalueReductionBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.ValueReductionBusinessError);
        this.isvalueReductionBusinessError = false;
        this.valueReductionDup = [];
      }
    }
    else {
      this.productInfo.valueReductionPrinciples[index].valueReductionPrinciple = null
      this.valueReductionDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.ValueReductionBusinessError);
    }

  }

  changeValuePrincipleCreditStatus(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.valueReductionPrinciples[index].state != stateModel.Created) {

      this.productInfo.valueReductionPrinciples[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.valueReductionDup = [];
      this.productInfo.valueReductionPrinciples[index].creditStatus = event?.value;

      this.valueReductionDup = this.productInfo.valueReductionPrinciples.reduce((accumalator: valueReductionPrinciple[], current) => {
        if ((
          !accumalator.some(
            (item: valueReductionPrinciple) => item.valueReductionPrinciple?.name == current.valueReductionPrinciple?.name &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: valueReductionPrinciple[] = []
      this.productInfo.valueReductionPrinciples.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })

      if (this.valueReductionDup.length != compareArray.length) {
        this.throwBusinessError(this.ValueReductionBusinessError);
        this.isvalueReductionBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.ValueReductionBusinessError);
        this.isvalueReductionBusinessError = false;
        this.valueReductionDup = [];
      }

    }
    else {
      this.productInfo.valueReductionPrinciples[index].creditStatus = null
      this.valueReductionCreditStatusDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.ValueReductionBusinessError);
    }

  }

  addValuePrinciples() {
    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid) {

      if (this.isUpdate) {
        this.productInfo.state = stateModel.Dirty;
      }
      else if (this.isPost) {
        this.productInfo.state = stateModel.Created;
      }

      this.valueReductionDropdownConfig.externalError = false;
      this.valueReductionCreditStatusDropdownConfig.externalError = false;
      const valuPrinciplesObj = new valueReductionPrinciple();
      valuPrinciplesObj.state = stateModel.Created;
      valuPrinciplesObj.pKey = 0;
      valuPrinciplesObj.canValidate = false;
      valuPrinciplesObj.isDelete = false;
      valuPrinciplesObj.rowVersion = 0;
      const newlist = this.productInfo.valueReductionPrinciples;
      newlist.push({ ...valuPrinciplesObj });
      this.productInfo.valueReductionPrinciples = [...newlist];

    }
    else {
      this.setExternalError();

    }
  }

  deleteValuePrinciples(event: valueReductionPrinciple, gridData: valueReductionPrinciple[]) {
    this.RemoveBusinessError(this.apiBusinessError);
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.valueReductionDup = [];

    const deletedata = gridData.findIndex(data => {
      return data == event;
    });


    event.state = stateModel.Deleted;

    event = <valueReductionPrinciple>{}
    setTimeout(() => {
      this.deleteValuePrinciplesData(deletedata, gridData);
    }, 100);

    this.valueReductionDropdownConfig.externalError = false;
    this.valueReductionCreditStatusDropdownConfig.externalError = false;
  }

  deleteValuePrinciplesData(deletedata: number, valuePrinciplesGrid: valueReductionPrinciple[]) {
    valuePrinciplesGrid[deletedata].isDelete = true;

    this.productInfo.valueReductionPrinciples = [...valuePrinciplesGrid]

    this.valueReductionDup = this.productInfo.valueReductionPrinciples.reduce((accumalator: valueReductionPrinciple[], current) => {
      if ((
        !accumalator.some(
          (item: valueReductionPrinciple) => item.valueReductionPrinciple?.name == current.valueReductionPrinciple?.name &&
            item.creditStatus?.caption == current.creditStatus?.caption
        ) && (!current.isDelete))
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);

    const compareArray: valueReductionPrinciple[] = []
    this.productInfo.valueReductionPrinciples.forEach(x => {
      if (!x.isDelete) {
        compareArray.push(x);
      }
    })

    if (this.valueReductionDup.length != compareArray.length) {
      this.throwBusinessError(this.ValueReductionBusinessError);
      this.isvalueReductionBusinessError = true;
    }
    else {
      this.RemoveBusinessError(this.ValueReductionBusinessError);
      this.isvalueReductionBusinessError = false;
      this.valueReductionDup = [];
    }
  }

  //Penalty
  changePrepaymentCalculation(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.precomputedProduct.prepaymentCalculation = event?.value;
    }
    else {
      this.precomputedProduct.prepaymentCalculation = null as unknown as prePaymentCalculation
      this.prePaymentCalculationDropdownConfig.externalError = true;

    }

  }

  changeHighestRevision(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.precomputedProduct.highestRevisionPeriodMethod = event?.value;
    }
    else {
      this.precomputedProduct.highestRevisionPeriodMethod = null as unknown as prePaymentCalculation
      this.HighestRevisionDropdownConfig.externalError = true;

    }

  }

  changePrepaymentPenaltyMethod(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event?.value != null) {

      this.precomputedProduct.prepaymentPenaltyMethod = event?.value;

      const prepaymentEvent = this.precomputedProduct.prepaymentPenaltyMethod;

      if (prepaymentEvent.codeId == 14 || prepaymentEvent.codeId == 16 ||
        prepaymentEvent.codeId == 13 || prepaymentEvent.codeId == 15 || prepaymentEvent.codeId == 18) {

        this.prepaymentPercentageDisable = false;
      }
      else {
        this.precomputedProduct.prepaymentPenaltyPercentage = null
        this.prepaymentPercentageDisable = true;
      }
      this.penaltyPercentageTextBoxconfig.externalError = false;
      this.removePenaltyErrors();
    }
    else {
      this.precomputedProduct.prepaymentPenaltyMethod = null as unknown as prepaymentPenaltyMethodList
      this.prepaymentPenaltyDropdownConfig.externalError = true;
      this.precomputedProduct.prepaymentPenaltyPercentage = null
      this.prepaymentPercentageDisable = true;
      this.removePenaltyErrors();

    }

  }

  changePenaltyPercentage(event: any, isChanged: boolean) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.precomputedProduct.prepaymentPenaltyPercentage = parseFloat(floatValue);
        
      }
     
    }
    else {
      this.precomputedProduct.prepaymentPenaltyPercentage = null as unknown as number
      this.penaltyPercentageTextBoxconfig.externalError = true;
    }
  }

  changeExemptionPercentage(event: any,isChanged:boolean) {
    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event != null) {

      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.precomputedProduct.prepaymentPenaltyExemptionPercentage = parseFloat(floatValue);

      }
     
    }
    else {
      this.precomputedProduct.prepaymentPenaltyExemptionPercentage = null as unknown as number
      this.excemptionPercentageTextBoxconfig.externalError = true;
    }
  }

  changeFreePeriodBeforeRevisionDate(event: any) {
    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event != null) {

      this.precomputedProduct.penaltyFreePeriodBeforeRevisionDateInMonths = parseInt(event);
    }
    else {
      this.precomputedProduct.penaltyFreePeriodBeforeRevisionDateInMonths = null as unknown as number
      this.penaltyBeforeRevisionTextBoxconfig.externalError = true;
    }
  }

  changeFreePeriodAfterRevisionDate(event: any) {
    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event != null) {

      this.precomputedProduct.penaltyFreePeriodAfterRevisionDateInMonths = parseInt(event);
    }
    else {
      this.precomputedProduct.penaltyFreePeriodAfterRevisionDateInMonths = null as unknown as number
      this.penaltyAfterRevisionTextBoxconfig.externalError = true;
    }
  }

  changeSTPPrepayment(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    if (event != null) {
      this.precomputedProduct.blockSTPPrepayment = event;
    }

  }

  changeRevisionPeriodSelectionMethodForPenalty(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.revisionPeriodSelectionMethodForPenalty = event?.value;

    }
    else {
      this.productInfo.revisionPeriodSelectionMethodForPenalty = null as unknown as revisionPeriodSelectionMethodForPenaltyList
      this.revisionPeriodSelectionMethodForPenaltyDropdownConfig.externalError = true;

    }

  }
  changeWriteOffPenaltyMethod(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.writeOffPenaltyMethod = event?.value;

    }
    else {
      this.productInfo.writeOffPenaltyMethod = null as unknown as writeOffPenaltyMethodList
      this.writeOffPenaltyDropdownConfig.externalError = true;

    }

  }

  removePenaltyErrors() {
    const removePenaltyPercErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.PrepaymentPercentage') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removePenaltyPercErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePenaltyPercErrors, 1);

    }
 
  }

  removePrePaymentCalcAndPenaltyError() {
    const removePaymentcalcErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Prepayment calculation') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removePaymentcalcErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePaymentcalcErrors, 1);

    }

    const removeHighestRevisionErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.highestRevision') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeHighestRevisionErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeHighestRevisionErrors, 1);

    }

    const removePenaltyErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.PrepaymentMethod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removePenaltyErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePenaltyErrors, 1);

    }
  }


  //reminder scenario

  changeReminderScenario(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.reminderScenarios[index].state != stateModel.Created) {

      this.productInfo.reminderScenarios[index].state = stateModel.Dirty;
    }


    if (event?.value != null) {

      this.remainderScenarioDup = [];

      this.productInfo.reminderScenarios[index].reminderScenario = event?.value;

      this.remainderScenarioDup = this.productInfo.reminderScenarios.reduce((accumalator: reminderScenario[], current) => {
        if ((
          !accumalator.some(
            (item: reminderScenario) => item.reminderScenario?.scenarioName == current.reminderScenario?.scenarioName &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: reminderScenario[] = []
      this.productInfo.reminderScenarios.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })

      if (this.remainderScenarioDup.length != compareArray.length) {
        this.throwBusinessError(this.reminderScenarioBusinessError);
        this.isReminderScenarioBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.reminderScenarioBusinessError);
        this.isReminderScenarioBusinessError = false;
        this.remainderScenarioDup = [];
      }
    }
    else {
      this.productInfo.reminderScenarios[index].reminderScenario = null
      this.reminderScenarioDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.reminderScenarioBusinessError);
    }

  }

  changeReminderScenarioCreditStatus(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (this.isUpdate && this.productInfo.reminderScenarios[index].state != stateModel.Created) {

      this.productInfo.reminderScenarios[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.remainderScenarioDup = [];
      this.productInfo.reminderScenarios[index].creditStatus = event?.value;


      this.remainderScenarioDup = this.productInfo.reminderScenarios.reduce((accumalator: reminderScenario[], current) => {
        if ((
          !accumalator.some(
            (item: reminderScenario) => item.reminderScenario?.scenarioName == current.reminderScenario?.scenarioName &&
              item.creditStatus?.caption == current.creditStatus?.caption
          ) && (!current.isDelete))
        ) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);

      const compareArray: reminderScenario[] = []
      this.productInfo.reminderScenarios.forEach(x => {
        if (!x.isDelete) {
          compareArray.push(x);
        }
      })

      if (this.remainderScenarioDup.length != compareArray.length) {
        this.throwBusinessError(this.reminderScenarioBusinessError);
        this.isReminderScenarioBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.reminderScenarioBusinessError);
        this.isReminderScenarioBusinessError = false;
        this.remainderScenarioDup = [];
      }
    }
    else {
      this.productInfo.reminderScenarios[index].creditStatus = null
      this.reminderScenarioCreditStatusDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.reminderScenarioBusinessError);
    }

  }

  addReminderScenario() {
    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid) {
      if (this.isUpdate) {
        this.productInfo.state = stateModel.Dirty;
      }
      else if (this.isPost) {
        this.productInfo.state = stateModel.Created;
      }

      this.reminderScenarioDropdownConfig.externalError = false;
      this.reminderScenarioCreditStatusDropdownConfig.externalError = false;
      const reminderScenarioObj = new reminderScenario();
      reminderScenarioObj.state = stateModel.Created;
      reminderScenarioObj.pKey = 0;
      reminderScenarioObj.canValidate = false;
      reminderScenarioObj.isDelete = false;
      reminderScenarioObj.rowVersion = 0;
      const newlist = this.productInfo.reminderScenarios;
      newlist.push({ ...reminderScenarioObj });
      this.productInfo.reminderScenarios = [...newlist];

    }
    else {
      this.setExternalError();

    }
  }


  // Interest on arrears

  changeInterestOnArrearApplicable(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {
      this.productInfo.ioaApplicable = event;
      if (this.productInfo.ioaApplicable) {
        this.interestOnArrearDisable = false;
        this.isGracePeriodZero = true;
        console.log(this.productInfo.ioaGracePeriod)
        this.removeArrearsErrors()
      }
      else {
        this.interestOnArrearDisable = true;
        this.isGracePeriodZero = true;
        this.productInfo.ioaGracePeriod = null as unknown as number;
        this.productInfo.ioaPercentageDefinition = null;
        this.productInfo.ioaCalculationBase = null;
        this.productInfo.ioaCalculation = null;
        this.minimumAmountVisible = false;
        this.removeArrearsErrors()

      }
      this.graceDaysTextBoxconfig.externalError = false;
      this.percentageDefinitionDropdownConfig.externalError = false;
      this.calculationBaseDropdownConfig.externalError = false;
      this.calculationMethodDropdownConfig.externalError = false;
    }


  }

  changeGraceDays(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event != null) {

      if (event == '0') {
        this.productInfo.ioaResetGracePeriodAfterDueDate = false;
        this.isGracePeriodZero = true;
      }
      else {
        this.isGracePeriodZero = false;
      }
      this.productInfo.ioaGracePeriod = parseInt(event);
      if (this.productInfo.ioaGracePeriod > this.maxLimitForNumbers) {
        this.graceDaysTextBoxconfig.externalError = true;
      }
    }
    else {
      this.productInfo.ioaGracePeriod = null as unknown as number
      this.productInfo.ioaResetGracePeriodAfterDueDate = false;
      this.isGracePeriodZero = true;
      this.graceDaysTextBoxconfig.externalError = true;
    }
  }

  changeResetGracePeriod(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {
      this.productInfo.ioaResetGracePeriodAfterDueDate = event;

    }

  }

  changePercentageDefinition(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.ioaPercentageDefinition = event?.value;
    }
    else {
      this.productInfo.ioaPercentageDefinition = null as unknown as ioaPercentageDefinition
      this.percentageDefinitionDropdownConfig.externalError = true;
    }

  }

  changeCalculationBase(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.ioaCalculationBase = event?.value;
    }
    else {
      this.productInfo.ioaCalculationBase = null as unknown as ioaCalculationBaseList
      this.calculationBaseDropdownConfig.externalError = true;
    }

  }

  changeCalculationMethod(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.ioaCalculation = event?.value;
      if (this.productInfo.ioaCalculation?.codeId != 1) {
        this.minimumAmountVisible = true;
      }
      else { this.minimumAmountVisible = false; this.productInfo.ioaMinimumAmount = null }
    }
    else {
      this.productInfo.ioaCalculation = null as unknown as ioaCalculationList
      this.minimumAmountVisible = false;
      this.productInfo.ioaMinimumAmount = null
      this.calculationMethodDropdownConfig.externalError = true;
    }
  }

  changeMinimumAmount(event: any, isChanged: boolean) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

          this.productInfo.ioaMinimumAmount = parseFloat(floatValue);
       
      }
      
    }
    else { this.productInfo.ioaMinimumAmount = null }
  }

  changeWriteOffInterestApplicable(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {
      this.productInfo.writeOffInterestApplicable = event;
      if (this.productInfo.writeOffInterestApplicable) {
        this.writeOffInterestDisable = false;
        this.removeWriteOffErrors()
      }
      else {
        this.writeOffInterestDisable = true;
        this.productInfo.writeOffInterestPercentage = null;
        this.productInfo.writeOffInterestPercentageDefinition = null;
        this.productInfo.writeOffInterestCalculationDay = null;
        this.removeWriteOffErrors()
      }
      this.writeoffpercentageBoxconfig.externalError = false;
      this.writeOffpercentageDefinitionDropdownConfig.externalError = false;
      this.calculationDayTextBoxconfig.externalError = false;
    }


  }

  changeWriteOffPercentageDefinition(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.productInfo.writeOffInterestPercentageDefinition = event?.value;
    }
    else {
      this.productInfo.writeOffInterestPercentageDefinition = null as unknown as writeOffInterestPercentageDefinitionList
      this.writeOffpercentageDefinitionDropdownConfig.externalError = true;
    }

  }

  changeWriteOffPercentage(event: any, isChanged: boolean) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.productInfo.writeOffInterestPercentage = parseFloat(floatValue);
      }

    }
    else {
    
        this.productInfo.writeOffInterestPercentage = event;
      
      setTimeout(() => {
      this.productInfo.writeOffInterestPercentage = null
        this.writeoffpercentageBoxconfig.externalError = true;
      }, 7)
    }
  }

  changecalculationDay(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event != null) {

      this.productInfo.writeOffInterestCalculationDay = parseInt(event);
      if (this.productInfo.writeOffInterestCalculationDay > this.maxLimitForNumbers) {
        this.calculationDayTextBoxconfig.externalError = true;

      }
    }
    else {
      this.productInfo.writeOffInterestCalculationDay = null
      this.calculationDayTextBoxconfig.externalError = true;
    }
  }

  removeArrearsErrors() {
    const removeGraceErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Grace days') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeGraceErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeGraceErrors, 1);

    }


    const removePercDefErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Percentage definition') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removePercDefErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePercDefErrors, 1);

    }

    const removeCalBaseErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Calculation base') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeCalBaseErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeCalBaseErrors, 1);

    }

    const removeCalMethodErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Calculation method') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeCalMethodErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeCalMethodErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }
  }

  removeWriteOffErrors() {
    
    const removePercDefErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Percentagedef') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removePercDefErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePercDefErrors, 1);

    }

    const removeCalDayErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Calculation Day') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeCalDayErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeCalDayErrors, 1);

    }

    const removeWritePercErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.WriteOffPer') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeWritePercErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeWritePercErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }
  }
  //validations

  changeMinDuration(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    if (event != null && event != '0') {

      this.precomputedProduct.durationMinInMonths = parseInt(event);

      if (this.precomputedProduct.durationMinInMonths > this.maxLimitForNumbers) {

        this.minDurationTextBoxconfig.externalError = true;
        const maxValidation = new ErrorDto;
        maxValidation.validation = "maxError";
        maxValidation.isModelError = true;
        maxValidation.validationMessage = 'Value was either too large or too small for Int32';
        this.maxErrorDto = [maxValidation];
        const minDurationError = new ErrorDto;
        minDurationError.validation = "required";
        minDurationError.isModelError = true;
        minDurationError.validationMessage = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
        this.minDurationTextBoxconfig.required = true;
        this.minDurationTextBoxconfig.Errors = [minDurationError];
        this.minDurationTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
        this.minDurationTextBoxconfig.maxValueValidation = 'Input is not in a correct format';

      }

     
       else if (this.precomputedProduct.durationMaxInMonths != null && (this.precomputedProduct.durationMinInMonths > this.precomputedProduct.durationMaxInMonths)) {
          this.minDurationTextBoxconfig.externalError = true;

          const maxValidation = new ErrorDto;
          maxValidation.validation = "maxError";
          maxValidation.isModelError = true;
        maxValidation.validationMessage = this.translate.instant('product.newProduct.fields.minduration');
          this.maxErrorDto = [maxValidation];
          const minDurationError = new ErrorDto;
          minDurationError.validation = "required";
          minDurationError.isModelError = true;
          minDurationError.validationMessage = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
          this.minDurationTextBoxconfig.required = true;
          this.minDurationTextBoxconfig.Errors = [minDurationError];
          this.minDurationTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
        this.minDurationTextBoxconfig.maxValueValidation = this.translate.instant('product.newProduct.fields.minduration');

        }
      
      else {
        this.minDurationTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.userDetailsform.form.controls['durationMinInMonths'].setErrors(null);
          this.userDetailsform.form.controls['durationMaxInMonths'].setErrors(null);
        }, 1)
      }
    }
    else {
      this.precomputedProduct.durationMinInMonths = event
      setTimeout(() => {
        this.precomputedProduct.durationMinInMonths = null as unknown as number
        this.minDurationTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeMaxDuration(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    if (event != null && event != '0') {

      this.precomputedProduct.durationMaxInMonths = parseInt(event);
      if (this.precomputedProduct.durationMaxInMonths > this.maxLimitForNumbers) {
        this.maxDurationTextBoxconfig.externalError = true;
      }

       else if (this.precomputedProduct.durationMinInMonths != null && (this.precomputedProduct.durationMinInMonths > this.precomputedProduct.durationMaxInMonths)) {
          this.maxDurationTextBoxconfig.externalError = true;
       }
      
      else {
        this.maxDurationTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.userDetailsform.form.controls['durationMinInMonths'].setErrors(null);
          this.userDetailsform.form.controls['durationMaxInMonths'].setErrors(null);
        }, 1)
      }
    }
    else {
      this.precomputedProduct.durationMaxInMonths = event
      setTimeout(() => {
        this.precomputedProduct.durationMaxInMonths = null as unknown as number
        this.maxDurationTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeLoanPurpose(data: loanPurposeList) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.codeTableValues.loanPurposeDto.forEach(x => {

      if (x == data) {
        x.isChecked = data.isChecked;
      }
    })

    const loanArray: loanPurposeList[] = []

    if (this.codeTableValues.loanPurposeDto.length > 0) {
      for (let i = 0; i < this.codeTableValues.loanPurposeDto.length; i++) {
        if (this.codeTableValues.loanPurposeDto[i].isChecked) {
          loanArray.push({ ... new loanPurposeList });
          loanArray[i] = this.codeTableValues.loanPurposeDto[i]
        }
      }

    }
    this.productInfo.loanPurposeList = [];
    if (loanArray.length > 0) {
      loanArray.forEach(x => {
        if (Object.keys(x).length != 0 || x.constructor != Object) {
          this.productInfo.loanPurposeList.push(x);
        }
      })

    }

    console.log(this.productInfo.loanPurposeList)

  }

  changeProduct2productNameList(event: any, index: number) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (this.isUpdate && this.productInfo.product2ProductNameList[index].state != stateModel.Created) {

      this.productInfo.product2ProductNameList[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.productInfo.product2ProductNameList[index].productName = event?.value;
      this.productInfo.product2ProductNameList[index].nameListDropdownDisable = true;
    }
    else {
      this.productInfo.product2ProductNameList[index].productName = null as unknown as productName
      this.productNameListDropdownConfig.externalError = true;
    }

  }

  deleteProduct2productNameList(event: product2ProductNameList, gridData: product2ProductNameList[]) {

    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid || event.productName == null) {
      const deletedata = gridData.findIndex(data => {
        return data == event;
      });
      if (this.isUpdate) {
        this.productInfo.state = stateModel.Dirty;
      } else if (this.isPost) {
        this.productInfo.state = stateModel.Created;
      }

      event.state = stateModel.Deleted;

      event.productName = <productName>{}
      setTimeout(() => {
        this.deleteProductName(deletedata, this.productInfo.product2ProductNameList);
      }, 100);
      this.productNameListDropdownConfig.externalError = false;
    }
    else {
      this.productNameListDropdownConfig.externalError = true;
    }
  }

  deleteProductName(deletedata: number, productName: product2ProductNameList[]) {
    productName[deletedata].isDelete = true;
  }

  addProduct2productNameList() {

    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid) {

      if (this.isUpdate) {
        this.productInfo.state = stateModel.Dirty;
      } else if (this.isPost) {
        this.productInfo.state = stateModel.Created;
      }
      this.codeTableProductName = this.codeTableValues.productNameList.filter(val => {
        return !this.productInfo.product2ProductNameList.find(x => {
          if (!x.isDelete) {
            return x.productName?.codeId == val.codeId;
          }
          return false;

        });
      })
      this.productNameListDropdownConfig.externalError = false;
      const product2productNameObj = new product2ProductNameList();
      product2productNameObj.state = stateModel.Created;
      product2productNameObj.pKey = 0;
      product2productNameObj.canValidate = false;
      product2productNameObj.isRead = false;
      product2productNameObj.nameListDropdownDisable = false;
      product2productNameObj.rowVersion = 0;
      product2productNameObj.productNameList = this.codeTableProductName;
      const newlist = this.productInfo.product2ProductNameList;
      newlist.push({ ...product2productNameObj });
      this.productInfo.product2ProductNameList = [...newlist];

    }
    else {
      this.setExternalError();
    }
  }

  removeDurationErrors() {

    const removeMinErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeMinErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMinErrors, 1);

    }

    const removeMaxErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.Maximal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeMaxErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMaxErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }

    const removeMaxBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.maxduration')

    );

    if (removeMaxBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMaxBusinessError, 1);

    }

    const removeMinBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.minduration')

    );

    if (removeMinBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeMinBusinessError, 1);

    }

  }
  //Limit Reduction

  changeActualizationType(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.revolvingProduct.actualizationType = event?.value;
      this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = null
      this.revolvingProduct.reductionOfLimitAge = null
      this.revolvingProduct.reductionOfLimitBorrowerType = null
      this.revolvingProduct.isLimitReductionApplicable = false;
      this.revolvingProduct.reductionOfLimitBlockPayment = false;
      this.revolvingProduct.reductionOfLimitPeriods = null
      this.revolvingProduct.limitReductionPeriodicity = null
      this.blockAndLRCheckVisible = true

      if (this.revolvingProduct.actualizationType?.codeId != 1) {
        this.limitReductionStartVisible = true;
        this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
      }
      else {
        this.limitReductionStartVisible = false;
        this.reductionOfLimitAgeAndLimitBorrowerVisible = true;
      }
    }
    else {
      this.revolvingProduct.actualizationType = null as unknown as actualizationTypeList
      this.blockAndLRCheckVisible = false;
      this.limitReductionStartVisible = false;
      this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
      this.revolvingProduct.isLimitReductionApplicable = false;
      this.revolvingProduct.reductionOfLimitBlockPayment = false;
      this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = null
      this.revolvingProduct.reductionOfLimitAge = null
      this.revolvingProduct.reductionOfLimitBorrowerType = null
      this.revolvingProduct.reductionOfLimitPeriods = null
      this.revolvingProduct.limitReductionPeriodicity = null
    }
    this.nrOfMonthsBeforeLRTextBoxconfig.externalError = false;
    this.reductionOfLimitAgeTextBoxconfig.externalError = false;
    this.reductionOfLimitBorrowerDropdownConfig.externalError = false;
    this.LimitPeriodsTextBoxconfig.externalError = false;
    this.LRPeriodicityDropdownconfig.externalError = false;
    this.removeActualizationTypeErrors()
  }

  changeNrOfMonthsBeforeLR(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event != null && event != '0') {

      this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = parseInt(event);

      if (this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart > this.maxLimitForNumbers) {
        this.nrOfMonthsBeforeLRTextBoxconfig.externalError = true;
      }
    }
    else {
      this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = event;
      setTimeout(() => {
        this.revolvingProduct.nrOfMonthsBeforeLimitReductionStart = null as unknown as number
        this.nrOfMonthsBeforeLRTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeLimitReductionAge(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event != null && event != '0') {

      this.revolvingProduct.reductionOfLimitAge = parseInt(event);

      if (this.revolvingProduct.reductionOfLimitAge > this.maxLimitForNumbers) {
        this.reductionOfLimitAgeTextBoxconfig.externalError = true;
      }

    }
    else {

      this.revolvingProduct.reductionOfLimitAge = event;
      setTimeout(() => {
        this.revolvingProduct.reductionOfLimitAge = null as unknown as number
        this.reductionOfLimitAgeTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeLimitReductionBorrower(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.revolvingProduct.reductionOfLimitBorrowerType = event?.value;
    }
    else {
      this.revolvingProduct.reductionOfLimitBorrowerType = null as unknown as reductionOfLimitBorrowerTypeList
      this.reductionOfLimitBorrowerDropdownConfig.externalError = true;
    }

  }

  changeLRApplicable(event: any) {
    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event != null) {
      this.revolvingProduct.isLimitReductionApplicable = event;
      if (!this.revolvingProduct.isLimitReductionApplicable) {

        this.revolvingProduct.reductionOfLimitPeriods = null
        this.revolvingProduct.limitReductionPeriodicity = null
      }
    }
    this.LimitPeriodsTextBoxconfig.externalError = false;
    this.LRPeriodicityDropdownconfig.externalError = false;
    this.removeLRApplicableErrors();

  }

  changeBlockOutgoing(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event != null) {
      this.revolvingProduct.reductionOfLimitBlockPayment = event;
    }

  }

  changeLRPeriods(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }
    if (event != null && event != '0') {

      this.revolvingProduct.reductionOfLimitPeriods = parseInt(event);

      if (this.revolvingProduct.reductionOfLimitPeriods > this.maxLimitForNumbers) {
        this.LimitPeriodsTextBoxconfig.externalError = true;
      }
    }
    else {
      this.revolvingProduct.reductionOfLimitPeriods = event;
      setTimeout(() => {
        this.revolvingProduct.reductionOfLimitPeriods = null as unknown as number
        this.LimitPeriodsTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeLRPeriodicity(event: any) {

    if (this.isUpdate) {
      this.revolvingProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.revolvingProduct.state = stateModel.Created;
    }

    if (event?.value != null) {
      this.revolvingProduct.limitReductionPeriodicity = event?.value;
    }
    else {
      this.revolvingProduct.limitReductionPeriodicity = null as unknown as limitReductionPeriodicity
      this.LRPeriodicityDropdownconfig.externalError = true;
    }

  }

  removeActualizationTypeErrors() {

    const removeNrOfMonthsErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.nrOfBeforeLR') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeNrOfMonthsErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeNrOfMonthsErrors, 1);

    }

    const removeLRAgeErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.LRAge') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeLRAgeErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeLRAgeErrors, 1);

    }

    const removeLRBorrowerErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.LRBorrower') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeLRBorrowerErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeLRBorrowerErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }
  }

  removeLRApplicableErrors() {

    const removeLRPeriodsErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.LRPeriods') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeLRPeriodsErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeLRPeriodsErrors, 1);

    }

    const removeLRPeriodicityErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.LRPeriodicity') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeLRPeriodicityErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeLRPeriodicityErrors, 1);

    }

    const removeBusinessError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeBusinessError >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeBusinessError, 1);

    }

  }

  //Reservation commission
  settingReservationCommissionFalse() {
    this.precomputedProduct.reservationCommissionList.forEach(x => {
      x.isEntered = false;
    })
  }

  addReservationCommission() {

    this.RemoveBusinessError(this.apiBusinessError);
    if (this.userDetailsform.valid) {

      if (this.isUpdate) {
        this.precomputedProduct.state = stateModel.Dirty;
      } else if (this.isPost) {
        this.precomputedProduct.state = stateModel.Created;
      }
      this.startPeriodTextBoxconfig.externalError = false;
      this.endPeriodTextBoxconfig.externalError = false;
      this.rateTextBoxconfig.externalError = false;
      this.settingReservationCommissionFalse()
      const reservationCommissionObj = { ...new reservationCommission() };
      reservationCommissionObj.state = stateModel.Created;
      reservationCommissionObj.pKey = 0;
      reservationCommissionObj.canValidate = false;
      reservationCommissionObj.rowVersion = 0;
      reservationCommissionObj.isEntered = true;
      this.notHideReservationCommission = true;
      const newlist = this.precomputedProduct.reservationCommissionList;
      newlist.push({ ...reservationCommissionObj });
      this.precomputedProduct.reservationCommissionList = [...newlist];
      this.reservationCommissionCardValue = { ...new reservationCommission() }
      this.reservationCommissionCardValue = this.precomputedProduct.reservationCommissionList[this.precomputedProduct.reservationCommissionList.length - 1]

    }
    else {
      this.setExternalError();
    }
  }

  deleteReservationCommission(dataselect: reservationCommission, array: reservationCommission[]) {

    this.RemoveBusinessError(this.apiBusinessError);
    if ((this.userDetailsform.valid) || ((dataselect.startPeriod == null || dataselect.endPeriod == null || dataselect.rate == null) &&
      dataselect.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == dataselect;
      })
      if (this.isUpdate) {
        this.precomputedProduct.state = stateModel.Dirty;
      } else if (this.isPost) {
        this.precomputedProduct.state = stateModel.Created;
      }

      array.splice(deletedata, 1);
      this.startPeriodTextBoxconfig.externalError = false;
      this.endPeriodTextBoxconfig.externalError = false;
      this.rateTextBoxconfig.externalError = false;


      this.precomputedProduct.reservationCommissionList = [...array];
      if (this.precomputedProduct.reservationCommissionList.length == 0) {
        setTimeout(() => {
          this.notHideReservationCommission = false;
        }, 5);

      }

      if (this.precomputedProduct.reservationCommissionList.length > 0) {

        this.reservationCommissionCardValue = this.precomputedProduct.reservationCommissionList[this.precomputedProduct.reservationCommissionList.length - 1]
        this.settingReservationCommissionFalse();
        this.precomputedProduct.reservationCommissionList[this.precomputedProduct.reservationCommissionList.length - 1].isEntered = true;
      }

    }
    else {
      this.startPeriodTextBoxconfig.externalError = true;
      this.endPeriodTextBoxconfig.externalError = true;
      this.rateTextBoxconfig.externalError = true;
    }
  }

  clickReservationCommission(event: reservationCommission) {

    this.RemoveBusinessError(this.apiBusinessError);
    if (event) {
      if (this.userDetailsform.valid || event.isEntered) {

        this.settingReservationCommissionFalse();
        this.reservationCommissionIndex = this.precomputedProduct.reservationCommissionList.findIndex(item => {
          return item == event
        })
        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].isEntered = true;

        this.reservationCommissionCardValue = event

      }
      else {
        this.setExternalError();
      }
    }
  }

  changeStartPeriod(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    this.reservationCommissionIndex = this.precomputedProduct.reservationCommissionList.findIndex(get => {
      return get.isEntered == true;
    })
    if (event != null && event != '0' && event <= this.maxLimitForNumbers) {

      this.reservationCommissionCardValue.startPeriod = parseInt(event);

      if (this.isUpdate && this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state != stateModel.Created) {

        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state = stateModel.Dirty;
      }
      this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].startPeriod = parseInt(event);

    }
    else {
      
      this.reservationCommissionCardValue.startPeriod = event;
      setTimeout(() => {
        this.reservationCommissionCardValue.startPeriod = null as unknown as number
        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].startPeriod = null as unknown as number
        this.startPeriodTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeEndPeriod(event: any) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }
    this.reservationCommissionIndex = this.precomputedProduct.reservationCommissionList.findIndex(get => {
      return get.isEntered == true;
    })

    if (event != null && event != '0' && event <= this.maxLimitForNumbers) {

      this.reservationCommissionCardValue.endPeriod = parseInt(event);

      if (this.isUpdate && this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state != stateModel.Created) {

        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state = stateModel.Dirty;
      }
      this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].endPeriod = parseInt(event);


    }
    else {

      this.reservationCommissionCardValue.endPeriod = event;
      setTimeout(() => {
        this.reservationCommissionCardValue.endPeriod = null as unknown as number
        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].endPeriod = null as unknown as number
        this.endPeriodTextBoxconfig.externalError = true;
      },10)
    }
  }

  changeRate(event: any ,isChanged:boolean) {

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    this.reservationCommissionIndex = this.precomputedProduct.reservationCommissionList.findIndex(get => {
      return get.isEntered == true;
    })

    if (event != null && event != '0,00') {

      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

       // setTimeout(() => {
          if (this.isUpdate && this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state != stateModel.Created) {

            this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].state = stateModel.Dirty;
          }
          this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].rate = parseFloat(floatValue);
       // }, 5)
        this.reservationCommissionCardValue.rate = parseFloat(floatValue as unknown as string);

      }
     
    }
    else {

      this.reservationCommissionCardValue.rate = event;
      setTimeout(() => {
        this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].rate = null as unknown as number;
        this.reservationCommissionCardValue.rate = null as unknown as number;
        this.rateTextBoxconfig.externalError = true;
      },7)
    }
  }

  removeReservationCommissionErrors() {
    const removeStartErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.startPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeStartErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeStartErrors, 1);

    }

    const removeEndErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.endPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeEndErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeEndErrors, 1);

    }

    const removeRateErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.rate') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeRateErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeRateErrors, 1);

    }
  }

  //costs

  changeCosts(data: costTypeList) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    }
    else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.codeTableValues.costTypeList.forEach(x => {

      if (x == data) {
        x.isChecked = data.isChecked;
      }
    })

    const costArray: costTypeList[] = [];

    if (this.codeTableValues.costTypeList.length > 0) {
      for (let i = 0; i < this.codeTableValues.costTypeList.length; i++) {
        if (this.codeTableValues.costTypeList[i].isChecked) {
          costArray.push({ ... new costTypeList });
          costArray[i] = this.codeTableValues.costTypeList[i]
        }
      }

    }

    this.productInfo.costTypeList = [];
    if (costArray.length > 0) {
      costArray.forEach(x => {
        if (Object.keys(x).length != 0 || x.constructor != Object) {
          this.productInfo.costTypeList.push(x);
        }
      })

    }
   
    console.log(this.productInfo.costTypeList)

  }

  //FeeConfiguration

  settingFalse() {
    this.productInfo.product2FeeConfigList.forEach(set => {
      set.isEntered = false;
    })
  }

  addProduct2FeeConfigList() {
    this.RemoveBusinessError(this.apiBusinessError);

    const filteredData = this.productInfo.product2FeeConfigList.map(item => { return item.feeConfig?.feeType?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })
    if (this.userDetailsform.valid) {
      if (!hasValue) {
        if (this.isUpdate) {
          this.productInfo.state = stateModel.Dirty;
        } else if (this.isPost) {
          this.productInfo.state = stateModel.Created;
        }
        this.feeAmountTextBoxconfig.externalError = false;
        this.feePercentageTextBoxconfig.externalError = false;
        this.feeTypeDropdownConfig.externalError = false;
        this.feeCalculationTypeCalculationDropdownConfig.externalError = false;
        this.settingFalse()
        const product2FeeConfigObj = { ...new product2FeeConfigList() };
        product2FeeConfigObj.state = stateModel.Created;
        product2FeeConfigObj.pKey = 0;
        product2FeeConfigObj.canValidate = false;
        product2FeeConfigObj.rowVersion = 0;
        product2FeeConfigObj.gridCheckDisable = true;
        product2FeeConfigObj.isEntered = true;
        this.notHideFeeConfig = true;
        this.isAmount = false
        this.isPercentage = false;
        const newlist = this.productInfo.product2FeeConfigList;
        newlist.push({ ...product2FeeConfigObj });
        this.productInfo.product2FeeConfigList = [...newlist];
        this.feeConfigCardValue = new product2FeeConfigList()
        this.feeConfigCardValue = this.productInfo.product2FeeConfigList[this.productInfo.product2FeeConfigList.length - 1];
      }
      else {
        this.throwBusinessError(this.feeconfigBusinessError);
        this.isFeeConfigBusinessError = true;
      }

    }
    else {
      this.setExternalError();

      if (hasValue) {
        this.throwBusinessError(this.feeconfigBusinessError);
        this.isFeeConfigBusinessError = true;
      }
    }

  }

  deleteProduct2FeeConfigList(dataselect: product2FeeConfigList, array: product2FeeConfigList[]) {

    this.RemoveBusinessError(this.apiBusinessError);
    const filteredData = this.productInfo.product2FeeConfigList.map(item => { return item.feeConfig?.feeType?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })
    if ((this.userDetailsform.valid) || (((dataselect.feeConfig?.feeType == null || dataselect.feeConfig?.feeType.caption == null) ||
      (dataselect.feeCalculationType == null || dataselect.feeCalculationType.caption == null) || (dataselect.feeAmount == null) ||
      (dataselect.feePercentage == null)) && dataselect.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == dataselect;
      })

      if (!hasValue || hasValue && (dataselect.isEntered)) {

        if (this.isUpdate) {
          this.productInfo.state = stateModel.Dirty;
        } else if (this.isPost) {
          this.productInfo.state = stateModel.Created;
        }

        array.splice(deletedata, 1);
        this.RemoveBusinessError(this.feeconfigBusinessError);
        this.feeAmountTextBoxconfig.externalError = false;
        this.feeCalculationTypeCalculationDropdownConfig.externalError = false;
        this.feePercentageTextBoxconfig.externalError = false;
        this.feeTypeDropdownConfig.externalError = false;
        this.isFeeConfigBusinessError = false;

        this.productInfo.product2FeeConfigList = [...array];
        if (this.productInfo.product2FeeConfigList.length == 0) {
          setTimeout(() => {
            this.notHideFeeConfig = false;
          }, 5);

        }

        if (this.productInfo.product2FeeConfigList.length > 0) {

          if (this.productInfo.product2FeeConfigList[this.productInfo.product2FeeConfigList.length - 1].feeCalculationType?.codeId == 1) {
            this.isAmount = true;
            this.isPercentage = false;
          }
          else {
            this.isAmount = false;
            this.isPercentage = true;
          }

          this.feeConfigCardValue = this.productInfo.product2FeeConfigList[this.productInfo.product2FeeConfigList.length - 1]
          this.settingFalse();
          this.productInfo.product2FeeConfigList[this.productInfo.product2FeeConfigList.length - 1].isEntered = true;
        }

      }

      else {
        this.throwBusinessError(this.feeconfigBusinessError);
        this.isFeeConfigBusinessError = true;
      }
    }
    else {
      this.feeAmountTextBoxconfig.externalError = true;
      this.feeCalculationTypeCalculationDropdownConfig.externalError = true;
      this.feePercentageTextBoxconfig.externalError = true;
      this.feeTypeDropdownConfig.externalError = true;

      if (hasValue) {
        this.throwBusinessError(this.feeconfigBusinessError);
        this.isFeeConfigBusinessError = true;
      }
    }
  }

  clickProduct2FeeConfigList(event: product2FeeConfigList) {

    this.RemoveBusinessError(this.apiBusinessError);
    if (event) {
      const filteredData = this.productInfo.product2FeeConfigList.map(item => { return item.feeConfig?.feeType?.caption });
      const hasValue = filteredData.some(function (item, index) {
        return filteredData.indexOf(item) != index
      })
      if (this.userDetailsform.valid || event.isEntered) {
        if (!hasValue) {
          this.settingFalse();
          this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(item => {
            return item == event
          })
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].isEntered = true;
          if (event.feeCalculationType?.codeId == 1) {
            this.isAmount = true;
            this.isPercentage = false;
          }
          else {
            this.isAmount = false;
            this.isPercentage = true;
          }
          this.feeConfigCardValue = event

        }
        else {
          this.throwBusinessError(this.feeconfigBusinessError);
          this.isFeeConfigBusinessError = true;
        }
      }
      else {
        this.setExternalError();

        if (hasValue) {
          this.throwBusinessError(this.feeconfigBusinessError);
        }
      }
    }
  }


  changeFeePercentage(event: any,isChanged:boolean) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
      return get.isEntered == true;
    })

    if (event != null) {

      if (!isChanged) {
        if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

          this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
        }

        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

       // setTimeout(() => {
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].feePercentage = parseFloat(floatValue);
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = event;
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount.toString().concat(" %")
        //}, 10)
        this.feeConfigCardValue.feePercentage = parseFloat(floatValue);
      }

    }
    else {
      this.feeConfigCardValue.feePercentage = null as unknown as number;
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = " %"
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feePercentage = null as unknown as number
      this.feePercentageTextBoxconfig.externalError = true;
    }
  }

  changeFeeAmount(event: any,isChanged:boolean) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
      return get.isEntered == true;
    })

    if (event != null) {

      if (!isChanged) {
        if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

          this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
        }

        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

       // setTimeout(() => {
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeAmount = parseFloat(floatValue);
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = event;
          this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount.toString().concat(" EUR")
       // }, 10)
        this.feeConfigCardValue.feeAmount = parseFloat(floatValue);
      }

      

    }
    else {
      this.feeConfigCardValue.feeAmount = null as unknown as number;
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = " EUR"
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeAmount = null as unknown as number
      this.feeAmountTextBoxconfig.externalError = true;
    }

  }

  changeFeeType(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (event?.value != null) {

      if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

        this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
      }

      this.feeConfigCardValue.feeConfig = event?.value;
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeConfig = event?.value;
      this.RemoveBusinessError(this.feeconfigBusinessError);
      this.isFeeConfigBusinessError = false;

    }
    else {
      this.feeConfigCardValue.feeConfig = null as unknown as feeConfig;
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeConfig = null as unknown as feeConfig
      this.feeTypeDropdownConfig.externalError = true;
      this.RemoveBusinessError(this.feeconfigBusinessError);
    }

  }

  changeFeeCalculationType(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
      return get.isEntered == true;
    })

    if (event?.value != null) {
      this.feeConfigCardValue.feeCalculationType = event?.value;


      if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

        this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
      }

      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType = event?.value;
      if (event?.value?.codeId == 1) {
        this.isAmount = true;
        this.isPercentage = false;
        this.removeFeeErrors();
        this.feePercentageTextBoxconfig.externalError = false;
        this.feeAmountTextBoxconfig.externalError = false;
        this.feeConfigCardValue.feePercentage = null;
        this.productInfo.product2FeeConfigList[this.feeConfigIndex].feePercentage = null as unknown as number
        this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = " EUR"

      }
      else {
        this.feeConfigCardValue.feeAmount = null;
        this.isAmount = false;
        this.isPercentage = true;
        this.removeFeeErrors();
        this.feePercentageTextBoxconfig.externalError = false;
        this.feeAmountTextBoxconfig.externalError = false;
        this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeAmount = null as unknown as number
        this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = " %"

      }
    }
    else {
      this.feeConfigCardValue.feeCalculationType = null as unknown as feeCalculationTypeList;
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType = null as unknown as feeCalculationTypeList
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].modifyFeePercentageAndAmount = ""
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeAmount = null as unknown as number
      this.productInfo.product2FeeConfigList[this.feeConfigIndex].feePercentage = null as unknown as number
      this.feeConfigCardValue.feeAmount = null;
      this.feeConfigCardValue.feePercentage = null;
      this.isAmount = false;
      this.isPercentage = false;
      this.removeFeeErrors();
      this.feePercentageTextBoxconfig.externalError = false;
      this.feeAmountTextBoxconfig.externalError = false;
      this.feeCalculationTypeCalculationDropdownConfig.externalError = true;
    }
    this.feeAmountTextBoxconfig.externalError = false;
    this.feePercentageTextBoxconfig.externalError = false;
  }

  changeOutstandingCheck(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {
      this.feeConfigCardValue.isIncludedInOutstanding = event;
      this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
        return get.isEntered == true;
      })

      if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

        this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
      }

      this.productInfo.product2FeeConfigList[this.feeConfigIndex].isIncludedInOutstanding = event;
    }


  }

  changeDueDateCalculationCheck(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    if (event != null) {
      this.feeConfigCardValue.isIncludedInDueDateCalculation = event;
      this.feeConfigIndex = this.productInfo.product2FeeConfigList.findIndex(get => {
        return get.isEntered == true;
      })

      if (this.isUpdate && this.productInfo.product2FeeConfigList[this.feeConfigIndex].state != stateModel.Created) {

        this.productInfo.product2FeeConfigList[this.feeConfigIndex].state = stateModel.Dirty;
      }

      this.productInfo.product2FeeConfigList[this.feeConfigIndex].isIncludedInDueDateCalculation = event;
    }


  }

  removeFeeErrors() {
    const removeFeeAmountErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.feeAmount') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeFeeAmountErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeFeeAmountErrors, 1);

    }

    const removeFeePercentageErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('product.newProduct.fields.feePerc') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')

    );

    if (removeFeePercentageErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeFeePercentageErrors, 1);

    }
  }


  //Revision Process
  changeRPStartEvent(event: any) {
    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.revisionProcessStartEvent = event?.value;

  }

  changeRPRestartEvent(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.revisionProcessRestartEvent = event?.value;

  }

  changeRPReferenceDateOffset(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    if (event != null) {
      this.productInfo.revisionProcessReferenceDateOffset = parseInt(event);
      if (this.productInfo.revisionProcessReferenceDateOffset > this.maxLimitForNumbers) {
        this.productInfo.revisionProcessReferenceDateOffset = null as unknown as number
      }
    }
    else {
      this.productInfo.revisionProcessReferenceDateOffset = null as unknown as number
    }

  }

  changeEPStartEvent(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.extensionProcessStartEvent = event?.value;
  }

  changeEPRestartEvent(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }

    this.productInfo.extensionProcessRestartEvent = event?.value;

  }

  DefaultRevisionPeriod(event: any) {

    if (this.isUpdate) {
      this.productInfo.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.productInfo.state = stateModel.Created;
    }
    this.productInfo.defaultRevisionPeriodForRateRevision = event?.value;

  }
  //MutationType
  changeMuationType(data: mutationTypeList) {

    console.log(data);

    if (this.isUpdate) {
      this.precomputedProduct.state = stateModel.Dirty;
    } else if (this.isPost) {
      this.precomputedProduct.state = stateModel.Created;
    }

    console.log(this.codeTableValues)
    this.codeTableValues.mutationTypeList.forEach(x => {

      if (x.caption == data.caption) {
        x.chargeCostForVariableConversion = data.chargeCostForVariableConversion
        x.chargeMutationCosts = data.chargeMutationCosts
        x.no4EyeValidationApplicable = data.no4EyeValidationApplicable;
        x.isApplicable = data.isApplicable;
        if (!x.isApplicable) {
          x.gridVisibilityCheck = true;
          x.isDirtyForIsApplicable = false;
          x.chargeCostForVariableConversion = false;
          x.chargeMutationCosts = false;
          x.no4EyeValidationApplicable = false;
        }
        else if (x.isApplicable && !x.isDirtyForIsApplicable) {
          x.chargeCostForVariableConversion = true;
          x.chargeMutationCosts = true;
          x.no4EyeValidationApplicable = true;
          x.isDirtyForIsApplicable = true;
          x.gridVisibilityCheck = false;
        }
        else {
          x.gridVisibilityCheck = false;
        }
      }
    })

    const mutationTempArray: mutationTypeConfig[] = [];

    for (let i = 0; i < this.codeTableValues.mutationTypeList.length; i++) {
      if (this.codeTableValues.mutationTypeList[i].isApplicable) {
        mutationTempArray.push({ ...new mutationTypeConfig });
        const arr = mutationTempArray[i] || {}
        arr.mutationType = { ...this.codeTableValues.mutationTypeList[i] }
        arr.chargeCostForVariableConversion = this.codeTableValues.mutationTypeList[i].chargeCostForVariableConversion;
        arr.chargeMutationCosts = this.codeTableValues.mutationTypeList[i].chargeMutationCosts;
        arr.no4EyeValidationApplicable = this.codeTableValues.mutationTypeList[i].no4EyeValidationApplicable;
        mutationTempArray[i] = arr;
      }

    }

    this.precomputedProduct.mutationTypeConfigList = [];
    if (mutationTempArray.length > 0) {
      mutationTempArray.forEach(x => {
        if (Object.keys(x).length != 0 || x.constructor != Object) {
          this.precomputedProduct.mutationTypeConfigList.push(x);
        }
      })

    }

    console.log(this.precomputedProduct.mutationTypeConfigList)


  }

  //confirm box
  onclose() {
    console.log(this.productInfo.state)
    console.log(this.precomputedProduct.state)
    console.log(this.revolvingProduct.state)

    if (this.disable) {
      this.showConfirmBox = false;
      window.location.assign(this.navigateUrl);
    }
    else if ((this.productInfo.state == stateModel.Dirty || this.productInfo.state == stateModel.Created) ||
      (this.precomputedProduct.state == stateModel.Dirty || this.precomputedProduct.state == stateModel.Created) ||
      (this.revolvingProduct.state == stateModel.Dirty || this.revolvingProduct.state == stateModel.Created)) {

      this.showConfirmBox = true;
    }
    else {
      this.path = null;
      this.showConfirmBox = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes() {
    this.showConfirmBox = false;
    this.saveproduct();
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.path = null;
    this.showConfirmBox = false;
    this.removeActualizationTypeErrors();
    this.removeArrearsErrors();
    this.removeDurationErrors();
    this.removeFeeErrors();
    this.removeLRApplicableErrors();
    this.removePenaltyErrors();
    this.removePrePaymentCalcAndPenaltyError();
    this.removePrincipalAndInterestErrors();
    this.removeProductNameAtRRErrors();
    this.removeWriteOffErrors();
    this.removeReservationCommissionErrors();
    this.setExternalErrorFalse();
    this.retailLendingTypeDropdownConfig.externalError = false;
    this.RemoveBusinessError(this.feeconfigBusinessError)
    this.RemoveBusinessError(this.paymentAllocationBusinessError)
    this.RemoveBusinessError(this.ValueReductionBusinessError)
    this.RemoveBusinessError(this.reminderScenarioBusinessError)
    this.RemoveBusinessError(this.countryBusinessError)
    this.RemoveBusinessError(this.amortizationBusinessError)
    this.RemoveBusinessError(this.apiBusinessError)

    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.showConfirmBox = false;
  }
  onException() {
    this.exceptionBox = false;
  }
  //business error

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage

      })
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
      }
    }
    else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true))
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {

      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);

      }

    })

  }

  //model error

  setExternalError() {
    this.AutoCompleteConfig.externalError = true;
    this.startDateconfig.externalError = true;
    this.productFamilyDropdownConfig.externalError = true;
    this.retailLendingTypeDropdownConfig.externalError = true;
    this.productNameDropdownConfig.externalError = true;
    this.retailLendingSubTypeDropdownConfig.externalError = true;
    this.servicingCustomerDropdownConfig.externalError = true;
    this.commercialOwnerDropdownConfig.externalError = true;
    this.productNrTextBoxconfig.externalError = true;
    this.creditInsurerDropdownConfig.externalError = true;
    this.periodicityDropdownConfig.externalError = true;
    this.interestCalculationDropdownConfig.externalError = true;
    this.minDurationTextBoxconfig.externalError = true;
    this.maxDurationTextBoxconfig.externalError = true;
    this.feeTypeDropdownConfig.externalError = true;
    this.feeCalculationTypeCalculationDropdownConfig.externalError = true;
    this.feeAmountTextBoxconfig.externalError = true;
    this.feePercentageTextBoxconfig.externalError = true;
    this.productNameListDropdownConfig.externalError = true;
    this.paymentAllocationTypeDropdownConfig.externalError = true;
    this.paymentAllocationCreditStatusDropdownConfig.externalError = true;
    this.percentageDefinitionDropdownConfig.externalError = true;
    this.calculationBaseDropdownConfig.externalError = true;
    this.calculationMethodDropdownConfig.externalError = true;
    this.writeOffpercentageDefinitionDropdownConfig.externalError = true;
    this.graceDaysTextBoxconfig.externalError = true;
    this.writeoffpercentageBoxconfig.externalError = true;
    this.calculationDayTextBoxconfig.externalError = true;
    this.startPeriodTextBoxconfig.externalError = true;
    this.endPeriodTextBoxconfig.externalError = true;
    this.rateTextBoxconfig.externalError = true;
    this.nrOfMonthsBeforeLRTextBoxconfig.externalError = true;
    this.reductionOfLimitAgeTextBoxconfig.externalError = true;
    this.reductionOfLimitBorrowerDropdownConfig.externalError = true;
    this.LimitPeriodsTextBoxconfig.externalError = true;
    this.LRPeriodicityDropdownconfig.externalError = true;
    this.prePaymentCalculationDropdownConfig.externalError = true;
    this.prepaymentPenaltyDropdownConfig.externalError = true;
    this.excemptionPercentageTextBoxconfig.externalError = true;
    this.penaltyPercentageTextBoxconfig.externalError = true;
    this.penaltyBeforeRevisionTextBoxconfig.externalError = true;
    this.penaltyAfterRevisionTextBoxconfig.externalError = true;
    this.writeOffPenaltyDropdownConfig.externalError = true;
    this.revisionPeriodSelectionMethodForPenaltyDropdownConfig.externalError = true;
    this.valueReductionDropdownConfig.externalError = true;
    this.valueReductionCreditStatusDropdownConfig.externalError = true;
    this.reminderScenarioDropdownConfig.externalError = true;
    this.reminderScenarioCreditStatusDropdownConfig.externalError = true;
    this.defaultLimitTextBoxconfig.externalError = true;
    this.maxLimitTextBoxconfig.externalError = true;
    this.minLimitTextBoxconfig.externalError = true;
    this.NewProductNameAtRateRevisionDropdownConfig.externalError = true;
    this.HighestRevisionDropdownConfig.externalError = true;
  }

  setExternalErrorFalse() {
    this.AutoCompleteConfig.externalError = false;
    this.startDateconfig.externalError = false;
    this.productFamilyDropdownConfig.externalError = false;
    this.productNameDropdownConfig.externalError = false;
    this.retailLendingSubTypeDropdownConfig.externalError = false;
    this.servicingCustomerDropdownConfig.externalError = false;
    this.commercialOwnerDropdownConfig.externalError = false;
    this.productNrTextBoxconfig.externalError = false;
    this.creditInsurerDropdownConfig.externalError = false;
    this.periodicityDropdownConfig.externalError = false;
    this.interestCalculationDropdownConfig.externalError = false;
    this.minDurationTextBoxconfig.externalError = false;
    this.maxDurationTextBoxconfig.externalError = false;
    this.feeTypeDropdownConfig.externalError = false;
    this.feeCalculationTypeCalculationDropdownConfig.externalError = false;
    this.feeAmountTextBoxconfig.externalError = false;
    this.feePercentageTextBoxconfig.externalError = false;
    this.productNameListDropdownConfig.externalError = false;
    this.paymentAllocationTypeDropdownConfig.externalError = false;
    this.paymentAllocationCreditStatusDropdownConfig.externalError = false;
    this.percentageDefinitionDropdownConfig.externalError = false;
    this.calculationBaseDropdownConfig.externalError = false;
    this.calculationMethodDropdownConfig.externalError = false;
    this.writeOffpercentageDefinitionDropdownConfig.externalError = false;
    this.graceDaysTextBoxconfig.externalError = false;
    this.writeoffpercentageBoxconfig.externalError = false;
    this.calculationDayTextBoxconfig.externalError = false;
    this.startPeriodTextBoxconfig.externalError = false;
    this.endPeriodTextBoxconfig.externalError = false;
    this.rateTextBoxconfig.externalError = false;
    this.nrOfMonthsBeforeLRTextBoxconfig.externalError = false;
    this.reductionOfLimitAgeTextBoxconfig.externalError = false;
    this.reductionOfLimitBorrowerDropdownConfig.externalError = false;
    this.LimitPeriodsTextBoxconfig.externalError = false;
    this.LRPeriodicityDropdownconfig.externalError = false;
    this.prePaymentCalculationDropdownConfig.externalError = false;
    this.prepaymentPenaltyDropdownConfig.externalError = false;
    this.excemptionPercentageTextBoxconfig.externalError = false;
    this.penaltyPercentageTextBoxconfig.externalError = false;
    this.penaltyBeforeRevisionTextBoxconfig.externalError = false;
    this.penaltyAfterRevisionTextBoxconfig.externalError = false;
    this.writeOffPenaltyDropdownConfig.externalError = false;
    this.revisionPeriodSelectionMethodForPenaltyDropdownConfig.externalError = false;
    this.valueReductionDropdownConfig.externalError = false;
    this.valueReductionCreditStatusDropdownConfig.externalError = false;
    this.reminderScenarioDropdownConfig.externalError = false;
    this.reminderScenarioCreditStatusDropdownConfig.externalError = false;
    this.defaultLimitTextBoxconfig.externalError = false;
    this.maxLimitTextBoxconfig.externalError = false;
    this.minLimitTextBoxconfig.externalError = false;
    this.NewProductNameAtRateRevisionDropdownConfig.externalError = false;
    this.HighestRevisionDropdownConfig.externalError = false;

  }

  // copy object

  copyConfirmBox() {
    if ((this.productInfo.state == stateModel.Dirty || this.productInfo.state == stateModel.Created) ||
      (this.precomputedProduct.state == stateModel.Dirty || this.precomputedProduct.state == stateModel.Created) ||
      (this.revolvingProduct.state == stateModel.Dirty || this.revolvingProduct.state == stateModel.Created)) {

      this.showCopyConfirmBox = true;
    }
    else {
      this.showCopyConfirmBox = false;
      this.copyProduct();
    }
  }

  copyYes() {
    this.showCopyConfirmBox = false;
    this.copyYesClick = true;
    this.saveproduct();
      if (this.isErrors) {
        this.copyClick = false;
        this.NotClickedCopy = true;
      }
      else {
        this.copyClick = true;
        this.NotClickedCopy = false;
      }
  }

  copyCancel() {
    this.showCopyConfirmBox = false;
  }

  copyNo() {
    this.showCopyConfirmBox = false;
    this.removeActualizationTypeErrors();
    this.removeArrearsErrors();
    this.removeDurationErrors();
    this.removeFeeErrors();
    this.removeLRApplicableErrors();
    this.removePenaltyErrors();
    this.removePrePaymentCalcAndPenaltyError();
    this.removePrincipalAndInterestErrors();
    this.removeProductNameAtRRErrors();
    this.removeWriteOffErrors();
    this.removeReservationCommissionErrors();
    this.setExternalErrorFalse();
    this.retailLendingTypeDropdownConfig.externalError = false;
    this.RemoveBusinessError(this.feeconfigBusinessError)
    this.RemoveBusinessError(this.paymentAllocationBusinessError)
    this.RemoveBusinessError(this.ValueReductionBusinessError)
    this.RemoveBusinessError(this.reminderScenarioBusinessError)
    this.RemoveBusinessError(this.countryBusinessError)
    this.RemoveBusinessError(this.amortizationBusinessError)
    this.RemoveBusinessError(this.apiBusinessError)
    this.copyProduct();
  }

  copyProduct() {
    this.copyClick = true;
    this.OnInitCall();
  }

  ngOnInit(): void {

    this.OnInitCall();
  }

  OnInitCall() {
    this.setExternalErrorFalse();
    //codetable call
    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
      this.productCodeTableData = res.CodeTableResolver;
      this.codeTableValues = this.productCodeTableData;
      console.log(this.productCodeTableData)

      if (this.path != undefined) {

        if (this.path?.IsRead) {

          if (this.path?.Type == this.productCodeTableData.productTypeList[0].caption) {
            //precomputed call

            this.spinnerService.setIsLoading(true)
            this.service.getPrecomputedresponse(this.path?.updateProductData).subscribe(res => {
              this.spinnerService.setIsLoading(false)
              this.precomputedProduct = res as productPrecomputed
              this.productInfo = this.precomputedProduct;
              console.log(this.precomputedProduct)
              this.isPrecomputed = true;
              this.isRevolving = false;
              this.disable = true;
              this.isUpdate = false;
              this.isPost = false;
              this.NotClickedCopy = false;
              this.showConfirmBox = false;
              this.showCopyConfirmBox = false;

              if (this.productInfo.creditInsurer == null) {
                const creditIndex = this.productCodeTableData.creditInsurerList.findIndex(x => {
                  return x.name.codeId == 3;
                })
                this.productInfo.creditInsurer = this.productCodeTableData.creditInsurerList[creditIndex];
              }

              this.productCodeTableData.mutationTypeList.forEach(set => {
                set.gridVisibilityCheck = this.disable;
                set.gridDisable = this.disable
              });
              this.productCodeTableData.loanPurposeDto.forEach(x => {
                x.gridDisable = this.disable;
              });
              this.productCodeTableData.costTypeList.forEach(x => {
                x.gridDisable = this.disable;
              });

              this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList.filter(val => {
                if (val.codeId != 2) {
                  return val;
                }
                else return false;
              })


              this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList;

              if ((this.productInfo.productFamily != null &&
                this.productInfo.country != null) && (this.productInfo.productFamily?.codeId == 2 &&
                this.productInfo.country?.caption == 'Netherlands')) {
                this.disableDepositAllocation = false;
              }
              else {
                this.disableDepositAllocation = true;
              }

              if (this.productInfo.productFamily != null) {
                if (this.productInfo.productFamily?.codeId == 1) {
                  this.prePaymentCalculationVisible = true;
                  this.prePaymentPenaltyVisible = false;
                }
                else {
                  this.prePaymentPenaltyVisible = true;
                  this.prePaymentCalculationVisible = false;
                }
              } else {
                this.prePaymentPenaltyVisible = false;
                this.prePaymentCalculationVisible = false;
              }
              


              const prepaymentEvent = this.precomputedProduct.prepaymentPenaltyMethod;

              if (prepaymentEvent?.caption != null) {
                if (prepaymentEvent.codeId == 14 || prepaymentEvent.codeId == 16 ||
                  prepaymentEvent.codeId == 13 || prepaymentEvent.codeId == 15 || prepaymentEvent.codeId == 18) {

                  this.prepaymentPercentageDisable = false;
                }
                else {
                  this.prepaymentPercentageDisable = true;
                }
              }
              else { this.prepaymentPercentageDisable = true; }

              if (this.productInfo.ioaCalculation?.caption != null) {
                if (this.productInfo.ioaCalculation?.codeId != 1) {
                  this.minimumAmountVisible = true;
                }
                else { this.minimumAmountVisible = false; }
              }
              else { this.minimumAmountVisible = false; }


              if (this.productInfo.ioaApplicable) {
                this.interestOnArrearDisable = false;
              }
              else {
                this.interestOnArrearDisable = true;
              }

              if (this.productInfo.writeOffInterestApplicable) {
                this.writeOffInterestDisable = false;
              }
              else {
                this.writeOffInterestDisable = true;
              }
              if (this.productInfo.ioaGracePeriod == 0) {
                this.isGracePeriodZero = true;
              }
              else {
                this.isGracePeriodZero = false;
              }

              if (this.productInfo.startDate != null) {
                this.productInfo.startDate = new Date(this.productInfo.startDate);
              }

              if (this.productInfo.endDate != null) {
                this.productInfo.endDate = new Date(this.productInfo.endDate as Date);
                if (this.productInfo.endDate.getFullYear() == 1) {
                  this.productInfo.endDate = null as unknown as Date;
                }
              }



              if (this.productInfo.useAPC) {
                if (this.productInfo.product2ProductNameList.length > 0) {
                  this.productInfo.product2ProductNameList.forEach(x => {
                    x.isDelete = false;
                    x.isRead = true;
                  })
                }
              }

              this.feeConfigIndex = 0;
              if (this.productInfo.product2FeeConfigList.length > 0) {
                this.notHideFeeConfig = true;
                this.productInfo.product2FeeConfigList.forEach(x => {
                  x.gridCheckDisable = true;
                  if (x.feeCalculationType?.codeId == 1) {

                    x.modifyFeePercentageAndAmount = parseFloat(x.feeAmount as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" EUR")
                    }, 2);
                  }
                  else {
                    x.modifyFeePercentageAndAmount = parseFloat(x.feePercentage as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" %")
                    }, 2);
                  }
                })
                this.settingFalse();
                this.productInfo.product2FeeConfigList[this.feeConfigIndex].isEntered = true;
                if (this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType?.codeId == 1) {
                  this.isAmount = true;
                  this.isPercentage = false;
                }
                else {
                  this.isAmount = false;
                  this.isPercentage = true;
                }
                this.feeConfigCardValue =  this.productInfo.product2FeeConfigList[this.feeConfigIndex];
              }

              this.reservationCommissionIndex = 0;
              if (this.precomputedProduct.reservationCommissionList.length > 0) {
                this.notHideReservationCommission = true;
                this.settingReservationCommissionFalse()
                this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].isEntered = true;
                this.reservationCommissionCardValue = this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex] 
              }

              this.productCodeTableData.mutationTypeList.forEach(set => {
                set.isApplicable = false;
                set.isDirtyForIsApplicable = false;
                set.chargeCostForVariableConversion = false;
                set.chargeMutationCosts = false;
                set.no4EyeValidationApplicable = false;
              })

              if (this.precomputedProduct.mutationTypeConfigList.length > 0) {

                this.productCodeTableData.mutationTypeList.forEach(y => {
                  this.precomputedProduct.mutationTypeConfigList.forEach(z => {
                    if (z.mutationType.caption == y.caption) {
                      y.chargeCostForVariableConversion = z.chargeCostForVariableConversion
                      y.chargeMutationCosts = z.chargeMutationCosts
                      y.no4EyeValidationApplicable = z.no4EyeValidationApplicable;
                      y.isApplicable = true;
                      y.isDirtyForIsApplicable = true;
                    }
                  })
                })

              }


              if (this.productInfo.loanPurposeList.length > 0) {
                this.productCodeTableData.loanPurposeDto.forEach(x => {
                  this.productInfo.loanPurposeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })
              }


              if (this.productInfo.costTypeList.length > 0) {
                this.productCodeTableData.costTypeList.forEach(x => {
                  this.productInfo.costTypeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })

              }

            },
              err => {
                if (err?.error?.errorCode) {
                  this.errorCode = err.error.errorCode;
                }
                else {
                  this.errorCode = "InternalServiceFault"
                }
                this.spinnerService.setIsLoading(false)
                this.exceptionBox = true;
              });
          }
          else {
            //revolving call
            this.spinnerService.setIsLoading(true)
            this.service.getRevolvingresponse(this.path?.updateProductData).subscribe(res => {
              this.spinnerService.setIsLoading(false)
              this.revolvingProduct = res as productRevolving
              this.productInfo = this.revolvingProduct
              console.log(this.revolvingProduct)
              this.isPrecomputed = false;
              this.isRevolving = true;
              this.disable = true;
              this.isUpdate = false;
              this.isPost = false;
              this.NotClickedCopy = false;
              this.prePaymentCalculationVisible = true;
              this.prePaymentPenaltyVisible = true;
              this.showConfirmBox = false;
              this.showCopyConfirmBox = false;

              if (this.productInfo.creditInsurer == null) {
                const creditIndex = this.productCodeTableData.creditInsurerList.findIndex(x => {
                  return x.name.codeId == 3;
                })
                this.productInfo.creditInsurer = this.productCodeTableData.creditInsurerList[creditIndex];
              }

              this.productCodeTableData.loanPurposeDto.forEach(x => {
                x.gridDisable = this.disable;
              });
              this.productCodeTableData.costTypeList.forEach(x => {
                x.gridDisable = this.disable;
              });

              this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList;

              this.productCodeTableData.reminderScenarioRefList.forEach(x => {
                if (x.scenarioType.codeId == 2) {
                  x.canHide = true;
                }
              })
              this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList.filter(val => {
                if (!val.canHide) {
                  return val;
                }
                else return false;
              })

              if (this.productInfo.ioaCalculation?.caption != null) {
                if (this.productInfo.ioaCalculation?.codeId != 1) {
                  this.minimumAmountVisible = true;
                }
                else { this.minimumAmountVisible = false; }
              }
              else { this.minimumAmountVisible = false; }


              if (this.revolvingProduct.actualizationType?.caption != null) {
                if (this.revolvingProduct.actualizationType?.codeId != 1) {
                  this.limitReductionStartVisible = true;
                  this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
                }
                else {
                  this.limitReductionStartVisible = false;
                  this.reductionOfLimitAgeAndLimitBorrowerVisible = true;
                }
                this.blockAndLRCheckVisible = true;
              }
              else {
                this.blockAndLRCheckVisible = false;
                this.limitReductionStartVisible = false;
                this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
                this.revolvingProduct.isLimitReductionApplicable = false;
                this.revolvingProduct.reductionOfLimitBlockPayment = false;
              }

              if (this.revolvingProduct.revolvingDueDateCalculation != null) {
                if (this.revolvingProduct.revolvingDueDateCalculation.codeId != 2) {

                  this.invalidDueDateCalculation = true
                }
                else {
                  this.invalidDueDateCalculation = false;
                }
              } else { this.invalidDueDateCalculation = true}
              

              if (this.productInfo.ioaApplicable) {
                this.interestOnArrearDisable = false;
              }
              else {
                this.interestOnArrearDisable = true;
              }

              if (this.productInfo.writeOffInterestApplicable) {
                this.writeOffInterestDisable = false;
              }
              else {
                this.writeOffInterestDisable = true;
              }

              if (this.productInfo.ioaGracePeriod == 0) {
                this.isGracePeriodZero = true;
              }
              else {
                this.isGracePeriodZero = false;
              }

              if (this.productInfo.startDate != null) {
                this.productInfo.startDate = new Date(this.productInfo.startDate);
              }
              if (this.productInfo.endDate != null) {
                this.productInfo.endDate = new Date(this.productInfo.endDate as Date);
                if (this.productInfo.endDate.getFullYear() == 1) {
                  this.productInfo.endDate = null as unknown as Date;
                }
              }

              if (this.productInfo.useAPC) {
                if (this.productInfo.product2ProductNameList.length > 0) {
                  this.productInfo.product2ProductNameList.forEach(x => {
                    x.isDelete = false;
                    x.isRead = true;
                  })
                }
              }

              if (this.productInfo.loanPurposeList.length > 0) {
                this.productCodeTableData.loanPurposeDto.forEach(x => {
                  this.productInfo.loanPurposeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })
              }

              this.feeConfigIndex = 0;
              if (this.productInfo.product2FeeConfigList.length > 0) {
                this.notHideFeeConfig = true;
                this.productInfo.product2FeeConfigList.forEach(x => {
                  x.gridCheckDisable = true;
                  if (x.feeCalculationType?.codeId == 1) {

                    x.modifyFeePercentageAndAmount = parseFloat(x.feeAmount as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" EUR")
                    }, 2);
                  }
                  else {
                    x.modifyFeePercentageAndAmount = parseFloat(x.feePercentage as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" %")
                    }, 2);
                  }
                })
                this.settingFalse();
                this.productInfo.product2FeeConfigList[this.feeConfigIndex].isEntered = true;
                if (this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType?.caption
                  == this.codeTableValues.feeCalculationTypeList[0].caption) {
                  this.isAmount = true;
                  this.isPercentage = false;
                }
                else {
                  this.isAmount = false;
                  this.isPercentage = true;
                }
                this.feeConfigCardValue =  this.productInfo.product2FeeConfigList[this.feeConfigIndex] ;
              }


              if (this.productInfo.costTypeList.length > 0) {
                this.productCodeTableData.costTypeList.forEach(x => {
                  this.productInfo.costTypeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })

              }
            },
              err => {
                if (err?.error?.errorCode) {
                  this.errorCode = err.error.errorCode;
                }
                else {
                  this.errorCode = "InternalServiceFault"
                }
                this.spinnerService.setIsLoading(false)
                this.exceptionBox = true;
              });
          }
        }
        else {
         
          if (this.path?.Type == this.productCodeTableData.productTypeList[0].caption) {
            this.spinnerService.setIsLoading(true)
            this.service.getPrecomputedresponse(this.path?.updateProductData).subscribe(res => {
              this.spinnerService.setIsLoading(false)
              this.revolvingProduct = new productRevolving()
              this.precomputedProduct = res as productPrecomputed
              this.productInfo = this.precomputedProduct;
              console.log(this.precomputedProduct)

              if (this.copyClick) {
                this.NotClickedCopy = false;
                this.productInfo.productName = null as unknown as productName
                this.productInfo.productNr = null as unknown as number
                this.productInfo.commercialName = null as unknown as CommercialNameDto
                this.productInfo.externalProductNr = null as unknown as string
              }
              else { this.NotClickedCopy = true; }
              this.isPrecomputed = true;
              this.isRevolving = false;
              this.disable = false;
              this.isUpdate = true;
              this.isPost = false;
              this.showConfirmBox = false;
              this.showCopyConfirmBox = false;

              this.RecordsOfProductNameList = new Array<product2ProductNameList>()
              this.RecordsOfValueReduction = new Array<valueReductionPrinciple>()
              this.RecordsOfPaymentAllocation = new Array<paymentAllocation>()

              if (this.productInfo.creditInsurer == null) {
                const creditIndex = this.productCodeTableData.creditInsurerList.findIndex(x => {
                  return x.name.codeId == 3;
                })
                this.productInfo.creditInsurer = this.productCodeTableData.creditInsurerList[creditIndex];
              }

              this.productCodeTableData.loanPurposeDto.forEach(x => {
                x.gridDisable = this.disable;
              });
              this.productCodeTableData.costTypeList.forEach(x => {
                x.gridDisable = this.disable;
              });

              this.productCodeTableData.mutationTypeList.forEach(set => {
                set.gridDisable = this.disable
              });

              this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList.filter(val => {
                if (val.codeId != 2) {
                  return val;
                }
                else return false;
              })

              this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList;

              if ((this.productInfo.productFamily != null &&
                this.productInfo.country != null) && (this.productInfo.productFamily?.codeId == 2 &&
                this.productInfo.country?.caption == 'Netherlands') ) {
                this.disableDepositAllocation = false;
              }
              else {
                this.disableDepositAllocation = true;
              }

              if (this.productInfo.productFamily != null) {
                if (this.productInfo.productFamily?.codeId == 1) {
                  this.prePaymentCalculationVisible = true;
                  this.prePaymentPenaltyVisible = false;
                }
                else {
                  this.prePaymentPenaltyVisible = true;
                  this.prePaymentCalculationVisible = false;
                }
              } else {
                this.prePaymentPenaltyVisible = false;
                this.prePaymentCalculationVisible = false;
              }
              

             
              const prepaymentEvent = this.precomputedProduct.prepaymentPenaltyMethod;

              if (prepaymentEvent?.caption != null) {
                if (prepaymentEvent.codeId == 14 || prepaymentEvent.codeId == 16 ||
                  prepaymentEvent.codeId == 13 || prepaymentEvent.codeId == 15 || prepaymentEvent.codeId == 18) {

                  this.prepaymentPercentageDisable = false;
                }
                else {
                  this.prepaymentPercentageDisable = true;
                }
              }
              else { this.prepaymentPercentageDisable = true; }

              if (this.productInfo.ioaCalculation?.caption != null) {
                if (this.productInfo.ioaCalculation?.codeId != 1) {
                  this.minimumAmountVisible = true;
                }
                else { this.minimumAmountVisible = false; }
              }
              else { this.minimumAmountVisible = false; }

              if (this.productInfo.ioaApplicable) {
                this.interestOnArrearDisable = false;
              }
              else {
                this.interestOnArrearDisable = true;
              }

              if (this.productInfo.writeOffInterestApplicable) {
                this.writeOffInterestDisable = false;
              }
              else {
                this.writeOffInterestDisable = true;
              }
              if (this.productInfo.ioaGracePeriod == 0) {
                this.isGracePeriodZero = true;
              }
              else {
                this.isGracePeriodZero = false;
              }
              if (this.productInfo.startDate != null) {
                this.productInfo.startDate = new Date(this.productInfo.startDate);
              }
              if (this.productInfo.endDate != null) {
                this.productInfo.endDate = new Date(this.productInfo.endDate as Date);
                if (this.productInfo.endDate.getFullYear() == 1) {
                  this.productInfo.endDate = null as unknown as Date;
                }
              }

              if (this.productInfo.paymentAllocations.length > 0) {
                this.productInfo.paymentAllocations.forEach(x => {
                  x.isDelete = false;
                })
              }
             

              if (this.productInfo.useAPC) {

                if (this.productInfo.productConversionNecessaryAtRateRevision) {
                  this.notProductConversion = false;
                }
                else {
                  this.notProductConversion = true;
                }

                if (this.productInfo.product2ProductNameList.length > 0) {
                  this.productInfo.product2ProductNameList.forEach(x => {
                    x.isDelete = false;
                    x.isRead = true;
                  })
                }
              }

              this.productCodeTableData.mutationTypeList.forEach(set => {
                set.isApplicable = false;
                set.gridVisibilityCheck = true;
                set.isDirtyForIsApplicable = false;
                set.chargeCostForVariableConversion = false;
                set.chargeMutationCosts = false;
                set.no4EyeValidationApplicable = false;
              })
              if (this.precomputedProduct.mutationTypeConfigList.length > 0) {
                this.productCodeTableData.mutationTypeList.forEach(y => {
                  this.precomputedProduct.mutationTypeConfigList.forEach(z => {
                    if (z.mutationType.caption == y.caption) {
                      y.chargeCostForVariableConversion = z.chargeCostForVariableConversion
                      y.chargeMutationCosts = z.chargeMutationCosts
                      y.no4EyeValidationApplicable = z.no4EyeValidationApplicable;
                      y.isApplicable = true;
                      y.isDirtyForIsApplicable = true;
                      y.gridVisibilityCheck = false;
                    }
                  })
                })
              }


              this.feeConfigIndex = 0;
              if (this.productInfo.product2FeeConfigList.length > 0) {
                this.notHideFeeConfig = true;
                this.productInfo.product2FeeConfigList.forEach(x => {
                  x.gridCheckDisable = true;
                  if (x.feeCalculationType?.codeId == 1) {

                    x.modifyFeePercentageAndAmount = parseFloat(x.feeAmount as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" EUR")
                    }, 2);
                  }
                  else {
                    x.modifyFeePercentageAndAmount = parseFloat(x.feePercentage as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" %")
                    }, 2);
                  }
                })
                console.log(this.productInfo.product2FeeConfigList);
                this.settingFalse();
                this.productInfo.product2FeeConfigList[this.feeConfigIndex].isEntered = true;
                if (this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType?.codeId == 1) {
                  this.isAmount = true;
                  this.isPercentage = false;
                }
                else {
                  this.isAmount = false;
                  this.isPercentage = true;
                }
                this.feeConfigCardValue =  this.productInfo.product2FeeConfigList[this.feeConfigIndex] ;
              }

              this.reservationCommissionIndex = 0;
              if (this.precomputedProduct.reservationCommissionList.length > 0) {
                this.notHideReservationCommission = true;
                this.settingReservationCommissionFalse()
                this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex].isEntered = true;
                this.reservationCommissionCardValue = this.precomputedProduct.reservationCommissionList[this.reservationCommissionIndex] 
              }

              if (this.productInfo.loanPurposeList.length > 0) {
                this.productCodeTableData.loanPurposeDto.forEach(x => {
                  this.productInfo.loanPurposeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })
              }


              if (this.productInfo.costTypeList.length > 0) {
                this.productCodeTableData.costTypeList.forEach(x => {
                  this.productInfo.costTypeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                })

              }

            },
              err => {
                if (err?.error?.errorCode) {
                  this.errorCode = err.error.errorCode;
                }
                else {
                  this.errorCode = "InternalServiceFault"
                }
                this.spinnerService.setIsLoading(false)
                this.exceptionBox = true;
              });

          }
          else {
            this.spinnerService.setIsLoading(true)
            this.service.getRevolvingresponse(this.path?.updateProductData).subscribe(res => {
              this.spinnerService.setIsLoading(false)
              this.precomputedProduct = new productPrecomputed()
              this.revolvingProduct = res as productRevolving
              this.productInfo = this.revolvingProduct
              console.log(this.revolvingProduct)

              if (this.copyClick) {
                this.NotClickedCopy = false;
                this.productInfo.productName = null as unknown as productName
                this.productInfo.productNr = null as unknown as number
                this.productInfo.commercialName = null as unknown as CommercialNameDto
                this.productInfo.externalProductNr = null as unknown as string
              }
              else { this.NotClickedCopy = true; }
              this.isPrecomputed = false;
              this.isRevolving = true;
              this.disable = false;
              this.isUpdate = true;
              this.isPost = false;
              this.showConfirmBox = false;
              this.showCopyConfirmBox = false;
              this.prePaymentCalculationVisible = true;
              this.prePaymentPenaltyVisible = true;
              this.RecordsOfProductNameList = new Array<product2ProductNameList>()
              this.RecordsOfValueReduction = new Array<valueReductionPrinciple>()
              this.RecordsOfPaymentAllocation = new Array<paymentAllocation>()

              if (this.productInfo.creditInsurer == null) {
                const creditIndex = this.productCodeTableData.creditInsurerList.findIndex(x => {
                  return x.name.codeId == 3;
                })
                this.productInfo.creditInsurer = this.productCodeTableData.creditInsurerList[creditIndex];
              }

              this.productCodeTableData.loanPurposeDto.forEach(x => {
                x.gridDisable = this.disable;
              });
              this.productCodeTableData.costTypeList.forEach(x => {
                x.gridDisable = this.disable;
              });

              this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList;


              this.productCodeTableData.reminderScenarioRefList.forEach(x => {
                if (x.scenarioType.codeId == 2) {
                  x.canHide = true;
                }
              })
              this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList.filter(val => {
                if (!val.canHide) {
                  return val;
                }
                else return false;
              })

              if (this.productInfo.ioaCalculation?.caption != null) {
                if (this.productInfo.ioaCalculation?.codeId != 1) {
                  this.minimumAmountVisible = true;
                }
                else { this.minimumAmountVisible = false; }
              }
              else { this.minimumAmountVisible = false; }


              if (this.revolvingProduct.actualizationType?.caption != null) {
                if (this.revolvingProduct.actualizationType?.codeId != 1) {
                  this.limitReductionStartVisible = true;
                  this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
                }
                else {
                  this.limitReductionStartVisible = false;
                  this.reductionOfLimitAgeAndLimitBorrowerVisible = true;
                }
                this.blockAndLRCheckVisible = true;
              }
              else {
                this.blockAndLRCheckVisible = false
                this.limitReductionStartVisible = false;
                this.reductionOfLimitAgeAndLimitBorrowerVisible = false;
                this.revolvingProduct.isLimitReductionApplicable = false;
                this.revolvingProduct.reductionOfLimitBlockPayment = false;
              }

              if (this.revolvingProduct.revolvingDueDateCalculation != null) {
                if (this.revolvingProduct.revolvingDueDateCalculation.codeId != 2) {

                  this.invalidDueDateCalculation = true
                }
                else {
                  this.invalidDueDateCalculation = false;
                }
              } else { this.invalidDueDateCalculation = true}
              

              if (this.productInfo.ioaApplicable) {
                this.interestOnArrearDisable = false;
              }
              else {
                this.interestOnArrearDisable = true;
              }
              if (this.productInfo.writeOffInterestApplicable) {
                this.writeOffInterestDisable = false;
              }
              else {
                this.writeOffInterestDisable = true;
              }

              if (this.productInfo.ioaGracePeriod == 0) {
                this.isGracePeriodZero = true;
              }
              else {
                this.isGracePeriodZero = false;
              }

              if (this.productInfo.startDate != null) {
                this.productInfo.startDate = new Date(this.productInfo.startDate);
              }
              if (this.productInfo.endDate != null) {
                this.productInfo.endDate = new Date(this.productInfo.endDate as Date);
                if (this.productInfo.endDate.getFullYear() == 1) {
                  this.productInfo.endDate = null as unknown as Date;
                }
              }

              this.feeConfigIndex = 0;
              if (this.productInfo.product2FeeConfigList.length > 0) {
                this.notHideFeeConfig = true;
                this.productInfo.product2FeeConfigList.forEach(x => {
                  x.gridCheckDisable = true;
                  if (x.feeCalculationType?.codeId == 1) {

                    x.modifyFeePercentageAndAmount = parseFloat(x.feeAmount as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" EUR")
                    }, 2);
                  }
                  else {
                    x.modifyFeePercentageAndAmount = parseFloat(x.feePercentage as string).toFixed(2)
                    x.modifyFeePercentageAndAmount = this.decimalpipe.transform(x.modifyFeePercentageAndAmount) as string
                    setTimeout(() => {
                      x.modifyFeePercentageAndAmount = x.modifyFeePercentageAndAmount.toString().concat(" %")
                    }, 2);
                  }
                })
                this.settingFalse();
                this.productInfo.product2FeeConfigList[this.feeConfigIndex].isEntered = true;
                if (this.productInfo.product2FeeConfigList[this.feeConfigIndex].feeCalculationType?.codeId
                  == 1) {
                  this.isAmount = true;
                  this.isPercentage = false;
                }
                else {
                  this.isAmount = false;
                  this.isPercentage = true;
                }
                this.feeConfigCardValue =  this.productInfo.product2FeeConfigList[this.feeConfigIndex] ;
              }

              if (this.productInfo.useAPC) {

                if (this.productInfo.productConversionNecessaryAtRateRevision) {
                  this.notProductConversion = false;
                }
                else {
                  this.notProductConversion = true;
                }

                if (this.productInfo.product2ProductNameList.length > 0) {
                  this.productInfo.product2ProductNameList.forEach(x => {
                    x.isDelete = false;
                    x.isRead = true;
                  })
                }
              }

              if (this.productInfo.loanPurposeList.length > 0) {
                this.productCodeTableData.loanPurposeDto.forEach(x => {
                  this.productInfo.loanPurposeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  });
                });
              }


              if (this.productInfo.costTypeList.length > 0) {
                this.productCodeTableData.costTypeList.forEach(x => {
                  this.productInfo.costTypeList.forEach(y => {
                    if (x.caption == y.caption) {
                      x.isChecked = true;
                    }
                  })
                });
              }


            },
              err => {
                if (err?.error?.errorCode) {
                  this.errorCode = err.error.errorCode;
                }
                else {
                  this.errorCode = "InternalServiceFault"
                }
                this.spinnerService.setIsLoading(false)
                this.exceptionBox = true;
              });


          }

        }
      }
      else {
       
        this.isUpdate = false;
        this.isPost = true;
        this.precomputedProduct = new productPrecomputed
        this.productInfo = this.precomputedProduct;
        this.productInfo.useAPC = this.productCodeTableData.useAPC
        this.notProductConversion = true;
        this.productInfo.consumerProductType = this.productCodeTableData.productTypeList[0];
        this.isPrecomputed = true;
        this.disableDepositAllocation = true;
        this.prePaymentPenaltyVisible = false;
        this.prePaymentCalculationVisible = false;
        this.prepaymentPercentageDisable = true;
        this.minimumAmountVisible = false;
        this.productInfo.ioaApplicable = true;
        this.productInfo.writeOffInterestApplicable = true;
        this.interestOnArrearDisable = false;
        this.writeOffInterestDisable = false;
        this.isGracePeriodZero = true;
        this.showConfirmBox = false;
        this.showCopyConfirmBox = false;
        this.RecordsOfProductNameList = new Array<product2ProductNameList>()
        this.RecordsOfValueReduction = new Array<valueReductionPrinciple>()
        this.RecordsOfPaymentAllocation = new Array<paymentAllocation>()

        this.codeTableFeeCalculation = this.productCodeTableData.feeCalculationTypeList.filter(val => {
          if (val.codeId != 2) {
            return val;
          }
          else return false;
        })

        this.codeTableReminderScenario = this.productCodeTableData.reminderScenarioRefList;

        this.productCodeTableData.mutationTypeList.forEach(set => {
          set.isApplicable = false;
          set.isDirtyForIsApplicable = false;
          set.chargeCostForVariableConversion = false;
          set.chargeMutationCosts = false;
          set.no4EyeValidationApplicable = false;
          set.gridVisibilityCheck = true;
         
        })

        this.productInfo.product2AmortizationScheduleList = [];
        for (let i = 0; i < this.productCodeTableData.amortizationSheduleList.length; i++) {
          this.productInfo.product2AmortizationScheduleList.push({ ...new product2AmortizationScheduleList });
          this.productInfo.product2AmortizationScheduleList[i].amortizationShedule = { ...this.productCodeTableData.amortizationSheduleList[i] };
          this.productInfo.product2AmortizationScheduleList[i].isSelected = false;
        }
      }
    });

    this.buildConfiguration();


    this.ValidationHeader = [
      { header: this.translate.instant('product.newProduct.tabel.ValLoanPurpose'), field: 'caption', width: '' },
      { header: this.translate.instant('product.newProduct.tabel.ValIncl'), field: 'isChecked', width: '', fieldType: 'checkbox', isReadOnly: 'gridDisable' }];

    this.ReservationCommissionHeader = [
      { header: this.translate.instant('product.newProduct.tabel.StartPeriod'), field: 'startPeriod', width: '30%' },
      { header: this.translate.instant('product.newProduct.tabel.RevEndPeriod'), field: 'endPeriod', width: '30%' },
      { header: this.translate.instant('product.newProduct.tabel.RevRate'), field: 'rate', width: '32%' },
      { header: this.translate.instant('product.newProduct.tabel.RevDelete'), field: 'delete', width: '8%', fieldType: 'deleteButton' },
    ];

    this.CostsHeader = [{ header: this.translate.instant('product.newProduct.tabel.CostType'), field: 'caption', width: '50%' },
    { header: this.translate.instant('product.newProduct.tabel.Incl'), field: 'isChecked', width: '50%', fieldType: 'checkbox', isReadOnly: 'gridDisable' }
    ];

    this.FreeConfigHeader = [

      { header: this.translate.instant('product.newProduct.tabel.FreeType'), field: 'feeConfig.feeType.caption', width: '20%' },
      { header: this.translate.instant('product.newProduct.tabel.FreeCalculationType'), field: 'feeCalculationType.caption', width: '20%' },
      { header: this.translate.instant('product.newProduct.tabel.'), field: 'modifyFeePercentageAndAmount', width: '20%',pSortableColumnDisabled:true },
      { header: this.translate.instant('product.newProduct.tabel.Outstanding'), field: 'isIncludedInOutstanding', fieldType: 'checkbox', width: '20%', isReadOnly: 'gridCheckDisable', pSortableColumnDisabled: true },
      { header: this.translate.instant('product.newProduct.tabel.DueDateCalculation'), field: 'isIncludedInDueDateCalculation', fieldType: 'checkbox', width: '18%', isReadOnly: 'gridCheckDisable', pSortableColumnDisabled: true },
      { header: this.translate.instant('product.newProduct.tabel.FreeDelete'), field: 'Delete', width: '8%', fieldType: 'deleteButton' }

    ];

    this.MutationTypeHeader = [
      { header: this.translate.instant('product.newProduct.tabel.MutationType'), field: 'mutationType.caption', width: '25%' },
      { header: this.translate.instant('product.newProduct.tabel.Applicable'), field: 'isApplicable', width: '25%', fieldType: 'checkbox', isReadOnly: 'gridDisable' },
      { header: this.translate.instant('product.newProduct.tabel.ChanceMutationCosts'), field: 'chargeMutationCosts', width: '30%', fieldType: 'checkbox', isReadOnly: 'gridVisibilityCheck' },
      { header: this.translate.instant('product.newProduct.tabel.ChangeCostsVariable'), field: 'chargeCostForVariableConversion', width: '30%', fieldType: 'checkbox', isReadOnly: 'gridVisibilityCheck' },
      { header: this.translate.instant('product.newProduct.tabel.ValidationApplicable'), field: 'no4EyeValidationApplicable', width: '30%', fieldType: 'checkbox', isReadOnly: 'gridVisibilityCheck' }
    ];
  }

  saveMethodBusinessError() {
    if (this.productInfo.country != null && this.productInfo.retailLendingSubType != null) {
      if (this.productInfo.country?.caption == 'Netherlands' &&
        this.productInfo.retailLendingSubType.codeId == 8) {

        this.throwBusinessError(this.countryBusinessError);
        this.isCountryBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.countryBusinessError);
        this.isCountryBusinessError = false;
      }
    }

    if (this.isPrecomputed) {
      let count = 0;
      this.precomputedProduct.product2AmortizationScheduleList.forEach(x => {
        if (x.isSelected) {
          count++;
        }
      })
      if (count <= 0) {
        this.throwBusinessError(this.amortizationBusinessError);
        this.isAmortizationBusinessError = true;
      }
      else {
        this.RemoveBusinessError(this.amortizationBusinessError);
        this.isAmortizationBusinessError = false;
      }
    }
    const filteredData = this.productInfo.product2FeeConfigList.map(item => { return item.feeConfig?.feeType?.caption });
    const hasValue = filteredData.some(function (item, index) {
      return filteredData.indexOf(item) != index
    })
    if (hasValue) {
      this.throwBusinessError(this.feeconfigBusinessError);
      this.isFeeConfigBusinessError = true;
    }
    else {
      this.RemoveBusinessError(this.feeconfigBusinessError);
      this.isFeeConfigBusinessError = false;
    }
  }

  saveproduct() {
   

    let paymentAllocationNullIndex;
    let valueReductionNullIndex;
    let reminderScenarioNullIndex;
    let feeConfigNullIndex;
    let reservationCommissionNullIndex;
    let productNameListNullIndex;
    this.RecordsOfProductNameList = new Array<product2ProductNameList>()
    this.RecordsOfValueReduction = new Array<valueReductionPrinciple>()
    this.RecordsOfPaymentAllocation = new Array<paymentAllocation>()
    this.RemoveBusinessError(this.apiBusinessError);

    if (this.productInfo.paymentAllocations.length > 0) {
      paymentAllocationNullIndex = this.productInfo.paymentAllocations.findIndex(x => {
        return ((x.paymentAllocation?.paymentAllocationType == null || x.creditStatus == null) && !x.isDelete)
      })
    }
    else { paymentAllocationNullIndex = -1 }

    if (this.productInfo.valueReductionPrinciples.length > 0) {
      valueReductionNullIndex = this.productInfo.valueReductionPrinciples.findIndex(x => {
        return ((x.valueReductionPrinciple?.name == null || x.creditStatus == null) && !x.isDelete)
      })
    }
    else { valueReductionNullIndex = -1 }

    if (this.productInfo.reminderScenarios.length > 0) {
      reminderScenarioNullIndex = this.productInfo.reminderScenarios.findIndex(x => {
        return ((x.reminderScenario?.scenarioName == null || x.creditStatus == null) && !x.isDelete)
      })
    }
    else { reminderScenarioNullIndex = -1 }

    if (this.productInfo.product2FeeConfigList.length > 0) {
      feeConfigNullIndex = this.productInfo.product2FeeConfigList.findIndex(x => {
        return (x.feeConfig?.feeType == null || x.feeCalculationType == null ||
          (x.feeAmount == null && x.feePercentage == null))
      })
    }
    else { feeConfigNullIndex = -1 }

    if (this.precomputedProduct.reservationCommissionList.length > 0) {
      reservationCommissionNullIndex = this.precomputedProduct.reservationCommissionList.findIndex(x => {
        return (x.startPeriod == null || x.endPeriod == null || x.rate == null)
      })
    }
    else { reservationCommissionNullIndex = -1 }

    if (this.productInfo.product2ProductNameList.length > 0) {
      productNameListNullIndex = this.productInfo.product2ProductNameList.findIndex(x => {
        return (x.productName == null && !x.isDelete)
      })
    }
    else { productNameListNullIndex = -1 }


    if (this.userDetailsform.valid && paymentAllocationNullIndex == -1 && valueReductionNullIndex == -1 &&
      reminderScenarioNullIndex == -1 && feeConfigNullIndex == -1 && reservationCommissionNullIndex == -1 && productNameListNullIndex == -1) {

      this.saveMethodBusinessError();

      if (!this.isAmortizationBusinessError && !this.isCountryBusinessError && !this.isFeeConfigBusinessError &&
        !this.isPaymentAllocationBusinessError && !this.isReminderScenarioBusinessError && !this.isvalueReductionBusinessError) {

        this.isErrors = false;
        this.RemoveBusinessError(this.feeconfigBusinessError)
        this.RemoveBusinessError(this.paymentAllocationBusinessError)
        this.RemoveBusinessError(this.ValueReductionBusinessError)
        this.RemoveBusinessError(this.reminderScenarioBusinessError)
        this.RemoveBusinessError(this.countryBusinessError)
        this.RemoveBusinessError(this.amortizationBusinessError)
        this.RemoveBusinessError(this.apiBusinessError)
        this.retailLendingTypeDropdownConfig.externalError = false;
        this.setExternalErrorFalse();

        if (this.isPrecomputed) {
          const savePrecomputedProduct = { ...this.precomputedProduct };

          if (!this.NotClickedCopy) {
            savePrecomputedProduct.state = stateModel.Created;
            savePrecomputedProduct.pKey = 0;
            savePrecomputedProduct.rowVersion = 0;
            this.copyClick = false;
          }

          if (savePrecomputedProduct.writeOffInterestPercentage == null) {
            savePrecomputedProduct.writeOffInterestPercentage = 0;
          }

          if (savePrecomputedProduct.prepaymentPenaltyExemptionPercentage == null) {
            savePrecomputedProduct.prepaymentPenaltyExemptionPercentage = 0;
          }

          if (savePrecomputedProduct.startDate != null) {
            savePrecomputedProduct.startDate = new Date(
              Date.UTC(savePrecomputedProduct.startDate.getFullYear(), savePrecomputedProduct.startDate.getMonth(), savePrecomputedProduct.startDate.getDate(), 0, 0, 0)
            );
          }

          if (savePrecomputedProduct.endDate != null) {
            savePrecomputedProduct.endDate = new Date(
              Date.UTC(savePrecomputedProduct.endDate.getFullYear(), savePrecomputedProduct.endDate.getMonth(), savePrecomputedProduct.endDate.getDate(), 0, 0, 0)
            );
          }


          if (savePrecomputedProduct.paymentAllocations.length > 0) {
            savePrecomputedProduct.paymentAllocations.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfPaymentAllocation.push({ ...x })
              }
            })
            savePrecomputedProduct.paymentAllocations = [...this.RecordsOfPaymentAllocation]

          }

          if (savePrecomputedProduct.valueReductionPrinciples.length > 0) {
            savePrecomputedProduct.valueReductionPrinciples.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfValueReduction.push({ ...x })
              }
            })
            savePrecomputedProduct.valueReductionPrinciples = [...this.RecordsOfValueReduction]
            console.log(savePrecomputedProduct.valueReductionPrinciples)
          }


          if (savePrecomputedProduct.product2ProductNameList.length > 0) {
            savePrecomputedProduct.product2ProductNameList.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfProductNameList.push({ ...x })
              }
            })
            savePrecomputedProduct.product2ProductNameList = [...this.RecordsOfProductNameList]

          }

          console.log(savePrecomputedProduct)
          this.spinnerService.setIsLoading(true);
          this.service.postPrecomputedResponse(savePrecomputedProduct).subscribe(res => {
            this.spinnerService.setIsLoading(false);

            const response = { ...res as precomputedResponse };

            if (response.isSuccess) {
              const precomputedResponse = { ...response.productPrecomputed as productPrecomputed }
              this.isErrors = false;
              this.copyYesClick = false;
              const pathType = this.path || {};
              pathType.Type = precomputedResponse.consumerProductType?.caption;
              pathType.IsRead = false;
              pathType.updateProductData = precomputedResponse.pKey;
              this.path = pathType;
              this.OnInitCall();
              this.productInfo.state = stateModel.Unknown
              this.precomputedProduct.state = stateModel.Unknown
              this.revolvingProduct.state = stateModel.Unknown
            }
            else {
              this.apiBusinessError = response.businessErrorMessage;
              this.throwBusinessError(this.apiBusinessError);
              if (this.copyYesClick) {
                this.copyClick = false;
                this.NotClickedCopy = true;
              }
            }
           
          },
            err => {
              if (err?.error?.errorCode) {
                this.errorCode = err.error.errorCode;
              }
              else {
                this.errorCode = "InternalServiceFault"
              }
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
           })
        }
        else {
          const saveRevolvingProduct = { ...this.revolvingProduct };

          if (!this.NotClickedCopy) {
            saveRevolvingProduct.state = stateModel.Created;
            saveRevolvingProduct.pKey = 0;
            saveRevolvingProduct.rowVersion = 0;
            this.copyClick = false;
          }

          if (saveRevolvingProduct.writeOffInterestPercentage == null) {
            saveRevolvingProduct.writeOffInterestPercentage = 0;
          }

          if (saveRevolvingProduct.startDate != null) {
            saveRevolvingProduct.startDate = new Date(
              Date.UTC(saveRevolvingProduct.startDate.getFullYear(), saveRevolvingProduct.startDate.getMonth(), saveRevolvingProduct.startDate.getDate(), 0, 0, 0)
            );
          }

          if (saveRevolvingProduct.endDate != null) {
            saveRevolvingProduct.endDate = new Date(
              Date.UTC(saveRevolvingProduct.endDate.getFullYear(), saveRevolvingProduct.endDate.getMonth(), saveRevolvingProduct.endDate.getDate(), 0, 0, 0)
            );
          }

          if (saveRevolvingProduct.paymentAllocations.length > 0) {
            saveRevolvingProduct.paymentAllocations.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfPaymentAllocation.push({ ...x })
              }
            })
            saveRevolvingProduct.paymentAllocations = [...this.RecordsOfPaymentAllocation]

          }

          if (saveRevolvingProduct.valueReductionPrinciples.length > 0) {
            saveRevolvingProduct.valueReductionPrinciples.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfValueReduction.push({ ...x })
              }
            })
            saveRevolvingProduct.valueReductionPrinciples = [...this.RecordsOfValueReduction]

          }

          if (saveRevolvingProduct.product2ProductNameList.length > 0) {
            saveRevolvingProduct.product2ProductNameList.forEach(x => {
              if (x.state != stateModel.Deleted && !x.isDelete) {
                this.RecordsOfProductNameList.push({ ...x })
              }
            })
            saveRevolvingProduct.product2ProductNameList = [...this.RecordsOfProductNameList]

          }

          console.log(saveRevolvingProduct)
          this.spinnerService.setIsLoading(true);
          this.service.postRevolvingResponse(saveRevolvingProduct).subscribe(res => {
            this.spinnerService.setIsLoading(false);

            const response = { ...res as revolvingResponse };

            if (response.isSuccess) {
              const revolvingResponse = { ...response.productRevolving as productRevolving }
              this.isErrors = false;
              this.copyYesClick = false;
              const pathType = this.path || {};
              pathType.Type = revolvingResponse.consumerProductType?.caption;
              pathType.IsRead = false;
              pathType.updateProductData = revolvingResponse.pKey;
              this.path = pathType;
              this.OnInitCall();
              this.productInfo.state = stateModel.Unknown
              this.precomputedProduct.state = stateModel.Unknown
              this.revolvingProduct.state = stateModel.Unknown
            }
            else {
              this.apiBusinessError = response.businessErrorMessage;
              this.throwBusinessError(this.apiBusinessError);
              if (this.copyYesClick) {
                this.copyClick = false;
                this.NotClickedCopy = true;
              }
            }
           
          },
            err => {
              if (err?.error?.errorCode) {
                this.errorCode = err.error.errorCode;
              }
              else {
                this.errorCode = "InternalServiceFault"
              }
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            }
          )

        }
      }
      else {
        this.isErrors = true;
        if (this.isPaymentAllocationBusinessError) {
          this.throwBusinessError(this.paymentAllocationBusinessError);
        }
        if (this.isReminderScenarioBusinessError) {
          this.throwBusinessError(this.reminderScenarioBusinessError);
        }
        if (this.isvalueReductionBusinessError) {
          this.throwBusinessError(this.ValueReductionBusinessError);
        }
      }
    }
    else {
      this.isErrors = true;
      this.setExternalError();
      this.saveMethodBusinessError();
      if (this.isPaymentAllocationBusinessError) {
        this.throwBusinessError(this.paymentAllocationBusinessError);
      }
      if (this.isReminderScenarioBusinessError) {
        this.throwBusinessError(this.reminderScenarioBusinessError);
      }
      if (this.isvalueReductionBusinessError) {
        this.throwBusinessError(this.ValueReductionBusinessError);
      }
    }

  }

  buildConfiguration() {
    const AutoCompleteError = new ErrorDto;
    AutoCompleteError.validation = "required";
    AutoCompleteError.isModelError = true;
    AutoCompleteError.validationMessage = this.translate.instant('product.newProduct.fields.Country') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.AutoCompleteConfig.required = true;
    this.AutoCompleteConfig.Errors=[AutoCompleteError];

    const startDateError = new ErrorDto;
    startDateError.validation = "required";
    startDateError.isModelError = true;
    startDateError.validationMessage = this.translate.instant('product.newProduct.fields.Start') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.startDateconfig.required = true;
    this.startDateconfig.Errors=[startDateError];

    const productFamilyError = new ErrorDto;
    productFamilyError.validation = "required";
    productFamilyError.isModelError = true;
    productFamilyError.validationMessage = this.translate.instant('product.newProduct.fields.Product Family') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.productFamilyDropdownConfig.required = true;
    this.productFamilyDropdownConfig.Errors=[productFamilyError];

    const retailLendingTypeError = new ErrorDto;
    retailLendingTypeError.validation = "required";
    retailLendingTypeError.isModelError = true;
    retailLendingTypeError.validationMessage = this.translate.instant('product.newProduct.fields.Retail leading type') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.retailLendingTypeDropdownConfig.required = true;
    this.retailLendingTypeDropdownConfig.Errors=[retailLendingTypeError];

    const productNameError = new ErrorDto;
    productNameError.validation = "required";
    productNameError.isModelError = true;
    productNameError.validationMessage = this.translate.instant('product.newProduct.fields.Product name') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.productNameDropdownConfig.required = true;
    this.productNameDropdownConfig.Errors = [productNameError];

    const NewProductNameAtRateRevisionError = new ErrorDto;
    NewProductNameAtRateRevisionError.validation = "required";
    NewProductNameAtRateRevisionError.isModelError = true;
    NewProductNameAtRateRevisionError.validationMessage = this.translate.instant('product.newProduct.fields.NewProductNameAtRateRevision') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.NewProductNameAtRateRevisionDropdownConfig.required = true;
    this.NewProductNameAtRateRevisionDropdownConfig.Errors = [NewProductNameAtRateRevisionError];

    const retailLendingSubTypeError = new ErrorDto;
    retailLendingSubTypeError.validation = "required";
    retailLendingSubTypeError.isModelError = true;
    retailLendingSubTypeError.validationMessage = this.translate.instant('product.newProduct.fields.Retail leading sub type') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.retailLendingSubTypeDropdownConfig.required = true;
    this.retailLendingSubTypeDropdownConfig.Errors=[retailLendingSubTypeError];

    const servicingCustomerError = new ErrorDto;
    servicingCustomerError.validation = "required";
    servicingCustomerError.isModelError = true;
    servicingCustomerError.validationMessage = this.translate.instant('product.newProduct.fields.Servicing Customer') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.servicingCustomerDropdownConfig.required = true;
    this.servicingCustomerDropdownConfig.Errors=[servicingCustomerError];

    const commercialOwnerError = new ErrorDto;
    commercialOwnerError.validation = "required";
    commercialOwnerError.isModelError = true;
    commercialOwnerError.validationMessage = this.translate.instant('product.newProduct.fields.Commercial name') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.commercialOwnerDropdownConfig.required = true;
    this.commercialOwnerDropdownConfig.Errors=[commercialOwnerError];

    const productNrError = new ErrorDto;
    productNrError.validation = "required";
    productNrError.isModelError = true;
    productNrError.validationMessage = this.translate.instant('product.newProduct.fields.Product nbr') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.productNrTextBoxconfig.required = true;
    this.productNrTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.Product nbr') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.productNrTextBoxconfig.Errors=[productNrError];

    const creditInsurerError = new ErrorDto;
    creditInsurerError.validation = "required";
    creditInsurerError.isModelError = true;
    creditInsurerError.validationMessage = this.translate.instant('product.newProduct.fields.Credit Insurer') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.creditInsurerDropdownConfig.required = true;
    this.creditInsurerDropdownConfig.Errors = [creditInsurerError];

    const periodicityError = new ErrorDto;
    periodicityError.validation = "required";
    periodicityError.isModelError = true;
    periodicityError.validationMessage = this.translate.instant('product.newProduct.fields.Periodicity') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.periodicityDropdownConfig.required = true;
    this.periodicityDropdownConfig.Errors=[periodicityError];

    const interestCalculationError = new ErrorDto;
    interestCalculationError.validation = "required";
    interestCalculationError.isModelError = true;
    interestCalculationError.validationMessage = this.translate.instant('product.newProduct.fields.Interest') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.interestCalculationDropdownConfig.required = true;
    this.interestCalculationDropdownConfig.Errors=[interestCalculationError];

    const defaultMinLimitValidation = new ErrorDto;
    defaultMinLimitValidation.validation = "maxError";
    defaultMinLimitValidation.isModelError = true;
    defaultMinLimitValidation.validationMessage = this.translate.instant('product.newProduct.fields.DMIMA');
    this.defaultMinLimitErrorDto=[defaultMinLimitValidation];
    const defaultMinLimitError = new ErrorDto;
    defaultMinLimitError.validation = "required";
    defaultMinLimitError.isModelError = true;
    this.defaultLimitTextBoxconfig.required = true;
    this.defaultLimitTextBoxconfig.Errors=[defaultMinLimitError];
    this.defaultLimitTextBoxconfig.minValueValidation = this.translate.instant('product.newProduct.fields.DMIMA');

    const defaultMaxLimitValidation = new ErrorDto;
    defaultMaxLimitValidation.validation = "maxError";
    defaultMaxLimitValidation.isModelError = true;
    defaultMaxLimitValidation.validationMessage = this.translate.instant('product.newProduct.fields.DMIMA');
    this.defaultMaxLimitErrorDto=[defaultMinLimitValidation];
    const defaultMaxLimitError = new ErrorDto;
    defaultMaxLimitError.validation = "required";
    defaultMaxLimitError.isModelError = true;
    defaultMaxLimitError.validationMessage = this.translate.instant('product.newProduct.fields.Default list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.defaultLimitTextBoxconfig.required = true;
    this.defaultLimitTextBoxconfig.Errors=[defaultMaxLimitError];
    this.defaultLimitTextBoxconfig.maxValueValidation = this.translate.instant('product.newProduct.fields.DMIMA');


    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('product.newProduct.fields.DMIMA');
    this.maxLimitErrorDto=[maxLimitValidation];
    const maxLimitError = new ErrorDto;
    maxLimitError.validation = "required";
    maxLimitError.isModelError = true;
    maxLimitError.validationMessage = this.translate.instant('product.newProduct.fields.Max list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.maxLimitTextBoxconfig.required = true;
    this.maxLimitTextBoxconfig.Errors=[maxLimitError];
    this.maxLimitTextBoxconfig.minValueValidation = this.translate.instant('product.newProduct.fields.DMIMA');

    const minLimitValidation = new ErrorDto;
    minLimitValidation.validation = "maxError";
    minLimitValidation.isModelError = true;
    minLimitValidation.validationMessage = this.translate.instant('product.newProduct.fields.DMIMA');
    this.minLimitErrorDto=[minLimitValidation];
    const minLimitError = new ErrorDto;
    minLimitError.validation = "required";
    minLimitError.isModelError = true;
    minLimitError.validationMessage = this.translate.instant('product.newProduct.fields.Min list') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.minLimitTextBoxconfig.required = true;
    this.minLimitTextBoxconfig.Errors=[minLimitError];
    this.minLimitTextBoxconfig.maxValueValidation = this.translate.instant('product.newProduct.fields.DMIMA');

    const maxValidation = new ErrorDto;
    maxValidation.validation = "maxError";
    maxValidation.isModelError = true;
    maxValidation.validationMessage = this.translate.instant('product.newProduct.fields.minduration');
    this.maxErrorDto=[maxValidation];
    const minDurationError = new ErrorDto;
    minDurationError.validation = "required";
    minDurationError.isModelError = true;
    minDurationError.validationMessage = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.minDurationTextBoxconfig.required = true;
    this.minDurationTextBoxconfig.Errors = [minDurationError];
    this.minDurationTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.Minimal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.minDurationTextBoxconfig.maxValueValidation = this.translate.instant('product.newProduct.fields.minduration');


    const minValidation = new ErrorDto;
    minValidation.validation = "minError";
    minValidation.isModelError = true;
    minValidation.validationMessage = this.translate.instant('product.newProduct.fields.maxduration');
    this.minErrorDto = [minValidation];
    const maxNumberValidation = new ErrorDto;
    maxNumberValidation.validation = "maxError";
    maxNumberValidation.isModelError = true;
    maxNumberValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxNumberValidation];
    const maxDurationError = new ErrorDto;
    maxDurationError.validation = "required";
    maxDurationError.isModelError = true;
    maxDurationError.validationMessage = this.translate.instant('product.newProduct.fields.Maximal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.maxDurationTextBoxconfig.required = true;
    this.maxDurationTextBoxconfig.Errors=[maxDurationError];
    this.maxDurationTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.Maximal duration') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.maxDurationTextBoxconfig.minValueValidation = this.translate.instant('product.newProduct.fields.maxduration');
    this.maxDurationTextBoxconfig.maxValueValidation = 'Input is not in a correct format'


    const feeTypeError = new ErrorDto;
    feeTypeError.validation = "required";
    feeTypeError.isModelError = true;
    feeTypeError.validationMessage = this.translate.instant('product.newProduct.fields.feeType') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.feeTypeDropdownConfig.required = true;
    this.feeTypeDropdownConfig.Errors=[feeTypeError];

    const feeCalculationTypeError = new ErrorDto;
    feeCalculationTypeError.validation = "required";
    feeCalculationTypeError.isModelError = true;
    feeCalculationTypeError.validationMessage = this.translate.instant('product.newProduct.fields.FeecalcType') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.feeCalculationTypeCalculationDropdownConfig.required = true;
    this.feeCalculationTypeCalculationDropdownConfig.Errors=[feeCalculationTypeError];

    const feeAmountError = new ErrorDto;
    feeAmountError.validation = "required";
    feeAmountError.isModelError = true;
    feeAmountError.validationMessage = this.translate.instant('product.newProduct.fields.feeAmount') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.feeAmountTextBoxconfig.required = true;
    this.feeAmountTextBoxconfig.Errors=[feeAmountError];

    const feePercentageError = new ErrorDto;
    feePercentageError.validation = "required";
    feePercentageError.isModelError = true;
    feePercentageError.validationMessage = this.translate.instant('product.newProduct.fields.feePerc') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.feePercentageTextBoxconfig.required = true;
    this.feePercentageTextBoxconfig.Errors=[feePercentageError];

    const productNameListError = new ErrorDto;
    productNameListError.validation = "required";
    productNameListError.isModelError = true;
    productNameListError.validationMessage = this.translate.instant('product.newProduct.fields.Product name') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.productNameListDropdownConfig.Errors=[productNameListError];
    this.productNameListDropdownConfig.required = true;

    const paymentAllocationError = new ErrorDto;
    paymentAllocationError.validation = "required";
    paymentAllocationError.isModelError = true;
    paymentAllocationError.validationMessage = this.translate.instant('product.newProduct.fields.PaymentAllocation') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.paymentAllocationTypeDropdownConfig.Errors=[paymentAllocationError];
    this.paymentAllocationTypeDropdownConfig.required = true;

    const paymentAllocationCreditError = new ErrorDto;
    paymentAllocationCreditError.validation = "required";
    paymentAllocationCreditError.isModelError = true;
    paymentAllocationCreditError.validationMessage = this.translate.instant('product.newProduct.fields.PayCreditStatus') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.paymentAllocationCreditStatusDropdownConfig.Errors=[paymentAllocationCreditError];
    this.paymentAllocationCreditStatusDropdownConfig.required = true;

    const percentageDefinitionError = new ErrorDto;
    percentageDefinitionError.validation = "required";
    percentageDefinitionError.isModelError = true;
    percentageDefinitionError.validationMessage = this.translate.instant('product.newProduct.fields.Percentage definition') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.percentageDefinitionDropdownConfig.Errors=[percentageDefinitionError];
    this.percentageDefinitionDropdownConfig.required = true;

    const calculationBaseError = new ErrorDto;
    calculationBaseError.validation = "required";
    calculationBaseError.isModelError = true;
    calculationBaseError.validationMessage = this.translate.instant('product.newProduct.fields.Calculation base') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.calculationBaseDropdownConfig.Errors=[calculationBaseError];
    this.calculationBaseDropdownConfig.required = true;

    const calculationMethodError = new ErrorDto;
    calculationMethodError.validation = "required";
    calculationMethodError.isModelError = true;
    calculationMethodError.validationMessage = this.translate.instant('product.newProduct.fields.Calculation method') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.calculationMethodDropdownConfig.Errors=[calculationMethodError];
    this.calculationMethodDropdownConfig.required = true;

    const HighestRevisionError = new ErrorDto;
    HighestRevisionError.validation = "required";
    HighestRevisionError.isModelError = true;
    HighestRevisionError.validationMessage = this.translate.instant('product.newProduct.fields.highestRevision') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.HighestRevisionDropdownConfig.required = true;
    this.HighestRevisionDropdownConfig.Errors = [HighestRevisionError];

    const writeOffpercentageDefinitionError = new ErrorDto;
    writeOffpercentageDefinitionError.validation = "required";
    writeOffpercentageDefinitionError.isModelError = true;
    writeOffpercentageDefinitionError.validationMessage = this.translate.instant('product.newProduct.fields.Percentagedef') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.writeOffpercentageDefinitionDropdownConfig.Errors=[writeOffpercentageDefinitionError];
    this.writeOffpercentageDefinitionDropdownConfig.required = true;

    const maxGraceValidation = new ErrorDto;
    maxGraceValidation.validation = "maxError";
    maxGraceValidation.isModelError = true;
    maxGraceValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxGraceValidation];
    const graceDaysError = new ErrorDto;
    graceDaysError.validation = "required";
    graceDaysError.isModelError = true;
    graceDaysError.validationMessage = this.translate.instant('product.newProduct.fields.Grace days') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.graceDaysTextBoxconfig.Errors = [graceDaysError];
    this.graceDaysTextBoxconfig.maxValueValidation='Input is not in a correct format'
    this.graceDaysTextBoxconfig.required = true;

    const writeoffpercentageError = new ErrorDto;
    writeoffpercentageError.validation = "required";
    writeoffpercentageError.isModelError = true;
    writeoffpercentageError.validationMessage = this.translate.instant('product.newProduct.fields.WriteOffPer') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.writeoffpercentageBoxconfig.Errors=[writeoffpercentageError];
    this.writeoffpercentageBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.WriteOffPer') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.writeoffpercentageBoxconfig.required = true;

    const maxCalDayValidation = new ErrorDto;
    maxCalDayValidation.validation = "maxError";
    maxCalDayValidation.isModelError = true;
    maxCalDayValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxCalDayValidation];
    const calculationDayError = new ErrorDto;
    calculationDayError.validation = "required";
    calculationDayError.isModelError = true;
    calculationDayError.validationMessage = this.translate.instant('product.newProduct.fields.Calculation Day') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.calculationDayTextBoxconfig.Errors = [calculationDayError];
    this.calculationDayTextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.calculationDayTextBoxconfig.required = true;

    const startPeriodError = new ErrorDto;
    startPeriodError.validation = "required";
    startPeriodError.isModelError = true;
    startPeriodError.validationMessage = this.translate.instant('product.newProduct.fields.startPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.startPeriodTextBoxconfig.Errors=[startPeriodError];
    this.startPeriodTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.startPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.startPeriodTextBoxconfig.required = true;

    const endPeriodError = new ErrorDto;
    endPeriodError.validation = "required";
    endPeriodError.isModelError = true;
    endPeriodError.validationMessage = this.translate.instant('product.newProduct.fields.endPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.endPeriodTextBoxconfig.Errors=[endPeriodError];
    this.endPeriodTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.endPeriod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.endPeriodTextBoxconfig.required = true;

    const rateError = new ErrorDto;
    rateError.validation = "required";
    rateError.isModelError = true;
    rateError.validationMessage = this.translate.instant('product.newProduct.fields.rate') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.rateTextBoxconfig.Errors=[rateError];
    this.rateTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.rate') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.rateTextBoxconfig.required = true;

    const maxnrOfMonthsValidation = new ErrorDto;
    maxnrOfMonthsValidation.validation = "maxError";
    maxnrOfMonthsValidation.isModelError = true;
    maxnrOfMonthsValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxnrOfMonthsValidation];
    const nrOfMonthsBeforeLRTError = new ErrorDto;
    nrOfMonthsBeforeLRTError.validation = "required";
    nrOfMonthsBeforeLRTError.isModelError = true;
    nrOfMonthsBeforeLRTError.validationMessage = this.translate.instant('product.newProduct.fields.nrOfBeforeLR') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.nrOfMonthsBeforeLRTextBoxconfig.Errors=[nrOfMonthsBeforeLRTError];
    this.nrOfMonthsBeforeLRTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.nrOfBeforeLR') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.nrOfMonthsBeforeLRTextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.nrOfMonthsBeforeLRTextBoxconfig.required = true;

    const maxLimitAgeValidation = new ErrorDto;
    maxLimitAgeValidation.validation = "maxError";
    maxLimitAgeValidation.isModelError = true;
    maxLimitAgeValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxLimitAgeValidation];
    const reductionOfLimitAgeError = new ErrorDto;
    reductionOfLimitAgeError.validation = "required";
    reductionOfLimitAgeError.isModelError = true;
    reductionOfLimitAgeError.validationMessage = this.translate.instant('product.newProduct.fields.LRAge') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.reductionOfLimitAgeTextBoxconfig.Errors=[reductionOfLimitAgeError];
    this.reductionOfLimitAgeTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.LRAge') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.reductionOfLimitAgeTextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.reductionOfLimitAgeTextBoxconfig.required = true;

    const reductionOfLimitBorrowerError = new ErrorDto;
    reductionOfLimitBorrowerError.validation = "required";
    reductionOfLimitBorrowerError.isModelError = true;
    reductionOfLimitBorrowerError.validationMessage = this.translate.instant('product.newProduct.fields.LRBorrower') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.reductionOfLimitBorrowerDropdownConfig.Errors=[reductionOfLimitBorrowerError];
    this.reductionOfLimitBorrowerDropdownConfig.required = true;

    const maxLimitPeriodsValidation = new ErrorDto;
    maxLimitPeriodsValidation.validation = "maxError";
    maxLimitPeriodsValidation.isModelError = true;
    maxLimitPeriodsValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxLimitPeriodsValidation];
    const LimitPeriodsError = new ErrorDto;
    LimitPeriodsError.validation = "required";
    LimitPeriodsError.isModelError = true;
    LimitPeriodsError.validationMessage = this.translate.instant('product.newProduct.fields.LRPeriods') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.LimitPeriodsTextBoxconfig.Errors=[LimitPeriodsError];
    this.LimitPeriodsTextBoxconfig.invalidDefaultValidation = this.translate.instant('product.newProduct.fields.LRPeriods') + this.translate.instant('product.newProduct.RequiredMsg.mandatory')
    this.LimitPeriodsTextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.LimitPeriodsTextBoxconfig.required = true;

    const PeriodicityError = new ErrorDto;
    PeriodicityError.validation = "required";
    PeriodicityError.isModelError = true;
    PeriodicityError.validationMessage = this.translate.instant('product.newProduct.fields.LRPeriodicity') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.LRPeriodicityDropdownconfig.Errors=[PeriodicityError];
    this.LRPeriodicityDropdownconfig.required = true;

    const prePaymentCalculationError = new ErrorDto;
    prePaymentCalculationError.validation = "required";
    prePaymentCalculationError.isModelError = true;
    prePaymentCalculationError.validationMessage = this.translate.instant('product.newProduct.fields.Prepayment calculation') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.prePaymentCalculationDropdownConfig.Errors=[prePaymentCalculationError];
    this.prePaymentCalculationDropdownConfig.required = true;

    const prepaymentPenaltyError = new ErrorDto;
    prepaymentPenaltyError.validation = "required";
    prepaymentPenaltyError.isModelError = true;
    prepaymentPenaltyError.validationMessage = this.translate.instant('product.newProduct.fields.PrepaymentMethod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.prepaymentPenaltyDropdownConfig.Errors=[prepaymentPenaltyError];
    this.prepaymentPenaltyDropdownConfig.required = true;

    const excemptionPercentageError = new ErrorDto;
    excemptionPercentageError.validation = "required";
    excemptionPercentageError.isModelError = true;
    excemptionPercentageError.validationMessage = this.translate.instant('product.newProduct.fields.PrepaymentExemption') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.excemptionPercentageTextBoxconfig.Errors=[excemptionPercentageError];
    this.excemptionPercentageTextBoxconfig.required = true;

    const penaltyPercentageError = new ErrorDto;
    penaltyPercentageError.validation = "required";
    penaltyPercentageError.isModelError = true;
    penaltyPercentageError.validationMessage = this.translate.instant('product.newProduct.fields.PrepaymentPercentage') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.penaltyPercentageTextBoxconfig.Errors=[penaltyPercentageError];
    this.penaltyPercentageTextBoxconfig.required = true;

    const penaltyBeforeRevisionError = new ErrorDto;
    penaltyBeforeRevisionError.validation = "required";
    penaltyBeforeRevisionError.isModelError = true;
    penaltyBeforeRevisionError.validationMessage = this.translate.instant('product.newProduct.fields.PenaltyBefore') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.penaltyBeforeRevisionTextBoxconfig.Errors=[penaltyBeforeRevisionError];
    this.penaltyBeforeRevisionTextBoxconfig.required = true;

    const penaltyAfterRevisionError = new ErrorDto;
    penaltyAfterRevisionError.validation = "required";
    penaltyAfterRevisionError.isModelError = true;
    penaltyAfterRevisionError.validationMessage = this.translate.instant('product.newProduct.fields.PenaltyAfter') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.penaltyAfterRevisionTextBoxconfig.Errors=[penaltyAfterRevisionError];
    this.penaltyAfterRevisionTextBoxconfig.required = true;

    const writeOffPenaltyError = new ErrorDto;
    writeOffPenaltyError.validation = "required";
    writeOffPenaltyError.isModelError = true;
    writeOffPenaltyError.validationMessage = this.translate.instant('product.newProduct.fields.WriteMethod') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.writeOffPenaltyDropdownConfig.Errors=[writeOffPenaltyError];
    this.writeOffPenaltyDropdownConfig.required = true;

    const revisionPeriodSelectionMethodForPenaltyError = new ErrorDto;
    revisionPeriodSelectionMethodForPenaltyError.validation = "required";
    revisionPeriodSelectionMethodForPenaltyError.isModelError = true;
    revisionPeriodSelectionMethodForPenaltyError.validationMessage = this.translate.instant('product.newProduct.fields.revisionPeriodSelectionMethodForPenalty') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.revisionPeriodSelectionMethodForPenaltyDropdownConfig.Errors = [revisionPeriodSelectionMethodForPenaltyError];
    this.revisionPeriodSelectionMethodForPenaltyDropdownConfig.required = true;

    const valueReductionError = new ErrorDto;
    valueReductionError.validation = "required";
    valueReductionError.isModelError = true;
    valueReductionError.validationMessage = this.translate.instant('product.newProduct.fields.Value Reduction') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.valueReductionDropdownConfig.Errors=[valueReductionError];
    this.valueReductionDropdownConfig.required = true;

    const valueReductionCreditError = new ErrorDto;
    valueReductionCreditError.validation = "required";
    valueReductionCreditError.isModelError = true;
    valueReductionCreditError.validationMessage = this.translate.instant('product.newProduct.fields.ValCredit Status') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.valueReductionCreditStatusDropdownConfig.Errors=[valueReductionCreditError];
    this.valueReductionCreditStatusDropdownConfig.required = true;

    const reminderScenarioError = new ErrorDto;
    reminderScenarioError.validation = "required";
    reminderScenarioError.isModelError = true;
    reminderScenarioError.validationMessage = this.translate.instant('product.newProduct.fields.Remainder Scenario') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.reminderScenarioDropdownConfig.Errors=[reminderScenarioError];
    this.reminderScenarioDropdownConfig.required = true;

    const reminderScenarioCreditError = new ErrorDto;
    reminderScenarioCreditError.validation = "required";
    reminderScenarioCreditError.isModelError = true;
    reminderScenarioCreditError.validationMessage = this.translate.instant('product.newProduct.fields.RCredit Status') + this.translate.instant('product.newProduct.RequiredMsg.mandatory');
    this.reminderScenarioCreditStatusDropdownConfig.Errors=[reminderScenarioCreditError];
    this.reminderScenarioCreditStatusDropdownConfig.required = true;
  }
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, ErrorDto, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidFormatIBANPipe, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ActualizationConfigDto, BannedAccountNumberDto, CollectionsConfigurationDto, CountryDto, CreditProviderRefDto, CreditProviderSettings2ArrearsConfigurationDto, CreditProviderSettingsDto, DirectDebitConfigDto, DirectDebitConfigResendDto, DirectDebitEventDto, DtoState, FilterBannedACCriteriaDto, FilterTrustedDomesticAccountCriteriaDto, FilterTrustedIBANCriteriaDto, GetCreditProviderRefCodeData, GetCreditProviderSettingsDto, GetPostalCodeCityRequest, PaymentValidationSettingsDto, PaymentValidatorDto, PaymentValidatorGroupDto, PostalCodeCityDto, SaveCreditProviderSettingDto, SearchPostalCodeCityDto, SearchPostalCodeCityRequest, TrustedDomesticAccountDto, TrustedIBANAccountDto, UserDto } from './model/credit-provider.model';
import { CreditProviderService } from './service/credit-provider.service';
import { ConfigContextService } from '@close-front-office/shared/config';
import { CodeTable } from '../manage-integration/model/manage-integration.model';

@Component({
  selector: 'maic-manage-credit-provider',
  templateUrl: './manage-credit-provider.component.html',
  styleUrls: ['./manage-credit-provider.component.scss']
})
export class ManageCreditProviderComponent implements OnInit {
  @ViewChild("creditProviderForm", { static: true }) creditProviderForm!: NgForm;
  @ViewChild("validatePaymentForm", { static: true }) validatePaymentForm!: NgForm;
  @ViewChild("trustedAccountForm", { static: true }) trustedAccountForm!: NgForm;
  @ViewChild("bannedAccountForm", { static: true }) bannedAccountForm!: NgForm;
  @ViewChild("actualizationForm", { static: true }) actualizationForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;


  public MinDueDatesForTaskTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinDueDatesForUrgentTaskTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinAmountForBonusTaskForRevolvingTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinBonusThresholdforRefundTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinDueThresholdforRemiseTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinDueElapsedPeriodforRemiseTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public BonusRefundReceiverTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MinRemainingValueAfterPrepaymentTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NrOfDaysAdvancedNoticeTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NrOfDaysForIsRegularCalculationBaseTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ExtendRevisionPeriodsWithinLimitCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public CommissionNotePeriodicityDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CommissionNoteCalendarDayDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ExpectedMarginCalculationMethodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PaymentPromiseGraceDaysTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NrOfDaysBeforeEnfTitleExpirationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ChargeMutationCostOncePerMutationTypeCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public MinDurationInMonthsTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxDurationInMonthsTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PercentageOfLimitThresholdTextBoxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public EmailTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PaymentValidatorGroupNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ValidatorAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public BannedAccountNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public BannedibanAccountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedDomesticAccountNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedDomesticAccountNrTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedDomesticSortCodeTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AggregateDirectDebitCollectionCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public BonusInInstallmentCalculationMethodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DueInInstallmentCalculationMethodDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DaysLimitOnResendTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DaysOnResendTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public UseBusinessDaysForClaimDateCalculationCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public DaysBeforeDueDateTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CreditorSchemeIDTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public sendEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TrustedIBANAccountNameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedibanAccountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedIBANbicCodeAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public TrustedcountryAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public TrustedpostalCodeAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public TrustedpostalCodeTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedcityTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedstreetTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TrustedstreetAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public TrustedhouseNrTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActualizationFrequencyForOutstandingTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActualizationFrequencyForRemainingDurationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActualizationThresholdForOutstandingTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ActualizationThresholdForRemainingDurationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PostalCodeAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public NumberOfMonthsToExtendRevisionPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public IBANTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ArrearNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CreditStatusDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;


  validationHeader!: string;
  creditProviderListData: GetCreditProviderSettingsDto = new GetCreditProviderSettingsDto;
  creditProviderDetails: CreditProviderSettingsDto = new CreditProviderSettingsDto;
  directDebitDetails: DirectDebitConfigDto = new DirectDebitConfigDto;
  creditProvider!: CreditProviderRefDto;
  calendarDayList = [
    { caption: 1 },
    { caption: 2 },
    { caption: 3 },
    { caption: 4 },
    { caption: 5 },
    { caption: 6 },
    { caption: 7 },
    { caption: 8 },
    { caption: 9 },
    { caption: 10 },
    { caption: 11},
    { caption: 12},
    { caption: 13},
    { caption: 14},
    { caption: 15},
    { caption: 16},
    { caption: 17},
    { caption: 18},
    { caption: 19},
    { caption: 20},
    { caption: 21},
    { caption: 22},
    { caption: 23},
    { caption: 24},
    { caption: 25},
    { caption: 26},
    { caption: 27},
    { caption: 28},
    { caption: 29},
    { caption: 30},
    { caption: 31}];
  percentageOfLimitDetail!: ActualizationConfigDto
  paymentValidatorGroupDetail!: PaymentValidatorGroupDto;
  paymentValidatorsDetail!: PaymentValidatorDto
  filterBanned: FilterBannedACCriteriaDto = new FilterBannedACCriteriaDto
  bannedList: BannedAccountNumberDto[] = []
  bannedAccountDetail!: BannedAccountNumberDto
  filtertrustedDomesticAccount: FilterTrustedDomesticAccountCriteriaDto = new FilterTrustedDomesticAccountCriteriaDto
  trustedDomesticAccountList: TrustedDomesticAccountDto[] = []
  trustedDomesticAccountDetail!: TrustedDomesticAccountDto
  filterTrustedIBanAccount: FilterTrustedIBANCriteriaDto = new FilterTrustedIBANCriteriaDto
  trustedIbanAccountList: TrustedIBANAccountDto[] = []
  trustedIbanAccountDetail!: TrustedIBANAccountDto
  directDebitEventDetails!: DirectDebitConfigResendDto
  saveCreditproviderList: SaveCreditProviderSettingDto = new SaveCreditProviderSettingDto
  isViewTabs!: boolean
  filterDisplayName: UserDto[] = []
  filterBICCode: string[] = []
  filterCountry: CountryDto[] = []
  IsIncludeBonusWithinMax!: boolean
  IsIncludeDueWithinMax!: boolean
  showTrustedAccountDetails!: boolean
  showTrustedIbanAccountDetails!: boolean
  showValidatePaymentGroupDetails!: boolean
  showValidatePaymentDetails!: boolean
  showBannedAccountDetails!: boolean
  showPercentageOfLimitDetails!: boolean
  SelectedTabIndex!: number
  BICCodeList: string[] = [];
  countryList: CountryDto[] = []
  showDialog!: boolean;
  navigateUrl!: string;
  postalCodeCityRequest: GetPostalCodeCityRequest = new GetPostalCodeCityRequest
  exceptionBox!: boolean
  invalidIBANErrorDto: ErrorDto[] = [];
  getReferenceData!: GetCreditProviderRefCodeData;
  filterPostalCode: string[] = [];
  searchPostalCode: SearchPostalCodeCityRequest = new SearchPostalCodeCityRequest;
  filterTrustedPostalCode: string[] = []
  postalCodeSearchData: PostalCodeCityDto[] = []
  filterTrustedStreet: string[] = [];
  streetSearchData!: SearchPostalCodeCityDto;
  intMaxValue = 2147483647;
  placeholder = 'select';
  maxErrorDto: ErrorDto[] = []
  errorCode!: string
  useBusinessday!: boolean

  ActualizationHeader!: any[];
  BannedHeader!: any[];
  TrustedIBANHeader!: any[]
  TrustedHeader!: any[];
  Payment2Header!: any[];
  Payment1Header!: any[];
  ResendHeader!: any[];
  arrearHeader!: any[];

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public service: CreditProviderService, public route: ActivatedRoute,
    private spinnerService: SpinnerService, private fluidValidation: fluidValidationService, private commonService: ConfigContextService, private ibanPipe: FluidFormatIBANPipe) {
    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.isViewTabs = false;
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.BICCodeList = res.bicCodeData;
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.countryList = res.CountryData;
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.getReferenceData = res.CreditProviderRefData;
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.creditProviderListData = res.creditProviderData;
    })

    this.arrearHeader = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.Name'), field: 'name', property: 'Name', width: '45%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.CreditStatus'), field: 'creditStatus.caption', property: 'CreditStatus', width: '45%' },
      { header: '', field: '', property: 'Delete', width: '10%' }
    ];

    this.ResendHeader = [
      { header: '', field: 'isSelected', fieldType: 'checkbox', width: '20%' },
      { header: '', field: 'reasonCode.enumCaption', width: '20%' },
      { header: '', field: 'reasonCode.caption', width: '60%' }];

    this.Payment1Header = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.paymentValidator'), field: 'name', width: '95%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }];

    this.Payment2Header = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.Validator'), field: 'name.displayName', width: '47%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.Email'), field: 'email', width: '48%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: null, fieldType: 'deleteButton', width: '5%' }];

    this.TrustedHeader = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.Name'), field: 'name', property: 'Name', width: '31%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.PayeeReference'), field: 'payeeReference', property: 'PayeeReference', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.bankAccount'), field: 'domesticAccount', property: 'DomesticAccount', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: '', fieldType: 'deleteButton', property: 'Delete', width: '5%' }];

    this.BannedHeader = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.Names'), field: 'name', property: 'Name', width: '31%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.IBANAccount'), field: 'ibanAccount', property: 'IbanAccount', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.BICCode'), field: 'bicCode', property: 'BicCode', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: '', fieldType: 'deleteButton', property: 'Delete', width: '5%' }];

    this.TrustedIBANHeader = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.Names'), field: 'name', property:'Name', width: '23%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.PayeeReference'), field: 'payeeReference', property: 'PayeeReference', width: '24%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.IBANAccount'), field: 'modifiedIbanAccount', property: 'IbanAccount', width: '24%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.BICCode'), field: 'bicCode', property: 'BicCode', width: '24%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: '', fieldType: 'deleteButton', property: 'Delete', width: '5%' }];

    this.ActualizationHeader = [
      { header: this.translate.instant('app-instance.credit-provider.tabel.MinDuration'), field: 'minDurationInMonths', width: '31%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.MaxDuration'), field: 'maxDurationInMonths', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.PercentageOfLimit'), field: 'percentageOfLimitThreshold', width: '32%' },
      { header: this.translate.instant('app-instance.credit-provider.tabel.'), field: '', fieldType: 'deleteButton', width: '5%' }];
  }

  onChangeCreditprovider(event: CreditProviderRefDto) {

    if ((this.creditProviderForm.valid && this.trustedAccountForm.valid && this.bannedAccountForm.valid && this.actualizationForm.valid && this.validatePaymentForm.valid) || !this.isViewTabs) {
      this.creditProvider = event;
      if (event != null) {
        this.isViewTabs = true;
        const creditIndex = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.creditProvider.name.codeId == event.name.codeId);
        if (creditIndex != -1) {
          this.settingIsCreditSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[creditIndex].isCreditSelected = true;
          this.creditProviderDetails = this.creditProviderListData.creditProviderSettingList[creditIndex];
        }
        else {
          this.creditProviderListData.creditProviderSettingList.push(new CreditProviderSettingsDto());
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].trustedDomesticAccounts = [];
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].trustedIBANAccounts = [];
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].bannedAccountNumbers = [];
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].creditProvider2ArrearConfiguration = [];
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].actualizationConfigs = [];
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].paymentValidationSettings = [];
          this.settingIsCreditSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].isCreditSelected = true;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].creditProvider = event;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].state = DtoState.Created;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].pKey = 0;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].prepaymentSettings.minRemainingValueAfterPrepayment = 999.99;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].extendRevisionPeriodsWithinLimit = false;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].chargeMutationCostOncePerMutationType = false;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].suspendDirectDebitByDefault = false;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].suspendRemindersByDefault = false;
          this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1].collectionsConfiguration = new CollectionsConfigurationDto();
          this.creditProviderDetails = this.creditProviderListData.creditProviderSettingList[this.creditProviderListData.creditProviderSettingList.length - 1];
        }

        if (this.creditProviderDetails.paymentValidationSettings.length == 0) {
          this.creditProviderDetails.paymentValidationSettings.push(new PaymentValidationSettingsDto)
          this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups = [];
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForBonusPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForConstructionDepotPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForCostPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForIntermediaryPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForMortgageDossierPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForPaymentOut = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForRunningAccountPayment = 0;
          this.creditProviderDetails.paymentValidationSettings[0].maxAmountForSubsidyPayment = 0;
        }

        const debitIndex = this.creditProviderListData.directDebitConfigList.findIndex(x => x.creditProvider.name.caption.toLowerCase() == event.name.caption.toLowerCase());
        if (debitIndex != -1) {
          this.settingIsDebitSelectedFalse();
          this.creditProviderListData.directDebitConfigList[debitIndex].isDebitSelected = true;
          this.directDebitDetails = this.creditProviderListData.directDebitConfigList[debitIndex];
        }
        else {
          this.creditProviderListData.directDebitConfigList.push(new DirectDebitConfigDto());
          this.settingIsDebitSelectedFalse();
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].isDebitSelected = true;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].state = DtoState.Created;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].pKey = 0;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].useBusinessDaysForClaimDateCalculation = false;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].useNextBusinessDayIfReferenceDateIsNotABusinessDay = false;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].aggregateDirectDebitCollection = false;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].creditProvider = event;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].directDebitConfigResendList = [];
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].daysOnResend = 1;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].daysBeforeDueDate = 2;
          this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1].daysLimitOnResend = 5;
          this.directDebitDetails = this.creditProviderListData.directDebitConfigList[this.creditProviderListData.directDebitConfigList.length - 1];
        }

        if (this.directDebitDetails.directDebitConfigResendList.length != this.creditProviderListData.reasonCodeList.length) {
          if (this.directDebitDetails.directDebitConfigResendList.length == 0) {
            for (let i = 0; i < this.creditProviderListData.reasonCodeList.length; i++) {
              this.directDebitDetails.directDebitConfigResendList.push({ ...new DirectDebitConfigResendDto });
              this.directDebitDetails.directDebitConfigResendList[i].reasonCode = { ...this.creditProviderListData.reasonCodeList[i] };
              this.directDebitDetails.directDebitConfigResendList[i].isSelected = false;
              this.directDebitDetails.directDebitConfigResendList[i].state = DtoState.Unmodified;
            }
          }
          else {

            this.directDebitDetails.directDebitConfigResendList.sort((a, b) => {
              return (a.reasonCode.caption.toLowerCase() < b.reasonCode.caption.toLowerCase()) ? -1 : 1;
            })

            this.directDebitDetails.directDebitConfigResendList.forEach(x => this.creditProviderListData.reasonCodeList.forEach(y => {
              const index = this.directDebitDetails.directDebitConfigResendList.findIndex(x => x.reasonCode.codeId == y.codeId);
              if (y.codeId != x.reasonCode.codeId && index == -1) {
                const reasonList = new DirectDebitConfigResendDto;
                reasonList.reasonCode = y;
                reasonList.isSelected = false;
                reasonList.state = DtoState.Unmodified;
                this.directDebitDetails.directDebitConfigResendList.push(reasonList);
              }
            }))
          }
          this.directDebitDetails.directDebitConfigResendList.forEach(x => x.directDebitEvents = <DirectDebitEventDto>{})
          this.directDebitDetails.directDebitConfigResendList.forEach(x => this.creditProviderListData.directDebitEventsList.forEach(y => {
            if (x.reasonCode.codeId == y.reasonCode.codeId) {
              x.directDebitEvents.reasonCode = y.reasonCode;
              x.directDebitEvents.sendEvent = y.sendEvent;
              x.directDebitEvents.resendEvent = y.resendEvent;
            }
          }))
        }

        this.directDebitEventDetails = undefined as unknown as DirectDebitConfigResendDto;

        this.filtertrustedDomesticAccount = new FilterTrustedDomesticAccountCriteriaDto
        this.filterTrustedIBanAccount = new FilterTrustedIBANCriteriaDto
        this.filterBanned = new FilterBannedACCriteriaDto

        if (this.creditProviderDetails.bannedAccountNumbers.length > 0) {
          this.settingIsBannedAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[creditIndex].bannedAccountNumbers.forEach(x => {
            x.modifiedIban = x.ibanAccount;
            x.modifiedIban = this.ibanPipe.transform(x.modifiedIban as string)
          })
          this.creditProviderListData.creditProviderSettingList[creditIndex].bannedAccountNumbers[0].isBannedAccountSelected = true;
          this.bannedAccountDetail = this.creditProviderListData.creditProviderSettingList[creditIndex].bannedAccountNumbers[0];
        }

        if (this.creditProviderDetails.trustedDomesticAccounts.length > 0) {
          this.settingIsTrustedDomesticAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[creditIndex].trustedDomesticAccounts[0].isTrustedDomesticAccountSelected = true;
          this.trustedDomesticAccountDetail = this.creditProviderListData.creditProviderSettingList[creditIndex].trustedDomesticAccounts[0];
        }

        if (this.creditProviderDetails.trustedIBANAccounts.length > 0) {
          this.settingIsTrustedIBANAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[creditIndex].trustedIBANAccounts.forEach(x => {

            x.modifiedIbanAccount = x.ibanAccount;
            x.modifiedIbanAccount = this.ibanPipe.transform(x.modifiedIbanAccount as string)

            if (x.country?.codeId == 21 || x.country?.codeId == 161) {
              x.isEnablePostalCodeAutoComplete = true;
              x.isEnableCity = false;
            }
            else {
              x.isEnablePostalCodeAutoComplete = false;
              x.isEnableCity = true;
            }
            x.isEnableStreetAutoComplete = false;
            x.isEnableStreet = false;
          })
          this.creditProviderListData.creditProviderSettingList[creditIndex].trustedIBANAccounts[0].isTrustedIBANAccountSelected = true;
          this.trustedIbanAccountDetail = this.creditProviderListData.creditProviderSettingList[creditIndex].trustedIBANAccounts[0];
        }

        if (this.creditProviderDetails.creditProvider2ArrearConfiguration.length > 0) {
          this.creditProviderDetails.creditProvider2ArrearConfiguration.forEach(x => {
            x.arrearConfigList = this.creditProviderListData.arrearsConfigurationList
            x.enableArrearConfig = false;
          })
        }

        this.creditProviderDetails.modifiedCommissionNoteCalendarDay = this.calendarDayList.filter(x => x.caption == this.creditProviderDetails.commissionNoteCalendarDay)[0] as unknown as CodeTable;
        this.creditProviderDetails.modifiedDueDateCalendarDay = this.calendarDayList.filter(x => x.caption == this.creditProviderDetails.dueDateCalendarDay)[0] as unknown as CodeTable;

        if (this.creditProviderDetails.paymentValidationSettings.length > 0) {
          if (this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups.length > 0) {
            this.creditProviderListData.creditProviderSettingList[creditIndex].paymentValidationSettings[0].paymentValidatorGroups[0].isPaymentValidatorGroupSelected = true;
            this.paymentValidatorGroupDetail = this.creditProviderListData.creditProviderSettingList[creditIndex].paymentValidationSettings[0].paymentValidatorGroups[0];
            if (this.paymentValidatorGroupDetail.paymentValidators.length > 0) {
              this.creditProviderListData.creditProviderSettingList[creditIndex].paymentValidationSettings[0].paymentValidatorGroups[0].paymentValidators[0].isPaymentValidatorIsSelected = true;
              this.paymentValidatorsDetail = this.paymentValidatorGroupDetail.paymentValidators[0];
            }
          }
        }

        if (this.creditProviderDetails.actualizationConfigs.length > 0) {
          this.settingIsActualizationSelectFalse();
          this.creditProviderListData.creditProviderSettingList[creditIndex].actualizationConfigs[0].isActualizationSelected = true;
          this.percentageOfLimitDetail = this.creditProviderListData.creditProviderSettingList[creditIndex].actualizationConfigs[0];
        }

        if (this.directDebitDetails.dueInInstallmentCalculationMethod != undefined && this.directDebitDetails.dueInInstallmentCalculationMethod.codeId == 2) {
          this.IsIncludeDueWithinMax = false;
        }
        else {
          this.IsIncludeDueWithinMax = true;
        }

        if (this.directDebitDetails.bonusInInstallmentCalculationMethod != undefined && this.directDebitDetails.bonusInInstallmentCalculationMethod.codeId == 2) {
          this.IsIncludeBonusWithinMax = false;
        }
        else {
          this.IsIncludeBonusWithinMax = true;
        }

        if (this.directDebitDetails.useBusinessDaysForClaimDateCalculation) {
          this.useBusinessday = true;
        }

        if (this.creditProviderDetails.trustedDomesticAccounts.length == 0) {
          this.showTrustedAccountDetails = false
        }
        else {
          this.showTrustedAccountDetails = true
        }

        if (this.creditProviderDetails.trustedIBANAccounts.length == 0) {
          this.showTrustedIbanAccountDetails = false
        }
        else {
          this.showTrustedIbanAccountDetails = true
        }

        if (this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups.length == 0) {
          this.showValidatePaymentGroupDetails = false
        }
        else {
          this.showValidatePaymentGroupDetails = true
        }
        if (this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups.length != 0) {
          if (this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[0].paymentValidators.length == 0) {
            this.showValidatePaymentDetails = false
          }
          else {
            this.showValidatePaymentDetails = true
          }
        }

        if (this.creditProviderDetails.bannedAccountNumbers.length == 0) {
          this.showBannedAccountDetails = false
        }
        else {
          this.showBannedAccountDetails = true
        }

        if (this.creditProviderDetails.actualizationConfigs.length == 0) {
          this.showPercentageOfLimitDetails = false
        }
        else {
          this.showPercentageOfLimitDetails = true
        }
      }
      else {
        this.isViewTabs = false;
        this.settingExternalErrorFalse()
      }
    }
    else {
      if (event == null && (this.creditProviderDetails.state == DtoState.Created && this.directDebitDetails.state == DtoState.Created)) {
        if (this.creditProviderDetails.state == DtoState.Created) {
          const creditindex = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.creditProvider == this.creditProviderDetails.creditProvider);
          this.creditProviderListData.creditProviderSettingList.splice(creditindex, 1)
        }
        if (this.directDebitDetails.state == DtoState.Created) {
          const debitindex = this.creditProviderListData.directDebitConfigList.findIndex(x => x.creditProvider == this.directDebitDetails.creditProvider);
          this.creditProviderListData.directDebitConfigList.splice(debitindex, 1)
        }
        this.isViewTabs = false;
        this.settingExternalErrorFalse()
        this.RemoveIBANErrors();
        this.creditProvider = event;
      }
      if (this.isViewTabs) {
        this.settingExternalErrorTrue();
        this.creditProvider = <CreditProviderRefDto>{};
        setTimeout(() => {
          this.creditProvider = this.creditProviderDetails.creditProvider;
        }, 5)
      }
    }
  }

  onSave(creditProviderListData: GetCreditProviderSettingsDto) {
    this.RemoveBusinessError(this.translate.instant('app-instance.credit-provider.validations.MinDurationBusinessError'))
    this.RemoveBusinessError(this.translate.instant('app-instance.credit-provider.validations.NoOverlapForActualization'))
    let businessError = false;
    let minerrorTrue = false;
    creditProviderListData.creditProviderSettingList.forEach(x => x.actualizationConfigs.forEach(y => {
      if ((y.minDurationInMonths as number) > (y.maxDurationInMonths as number)) {
        minerrorTrue = true;
        businessError = true;
        this.throwBusinessError(this.translate.instant('app-instance.credit-provider.validations.MinDurationBusinessError'))
      }
    }))

    if (!minerrorTrue) {
      creditProviderListData.creditProviderSettingList.forEach(x => x.actualizationConfigs.forEach(y => x.actualizationConfigs.forEach(z => {
        if (y != z && (y.minDurationInMonths == z.minDurationInMonths || y.maxDurationInMonths == z.maxDurationInMonths)) {
          businessError = true;
          this.throwBusinessError(this.translate.instant('app-instance.credit-provider.validations.NoOverlapForActualization'))
        }
      })))
    }

    if (this.creditProviderForm.valid && this.trustedAccountForm.valid && this.bannedAccountForm.valid && this.actualizationForm.valid && this.validatePaymentForm.valid && !businessError) {

      this.saveCreditproviderList.creditProviderSettingList = this.creditProviderListData.creditProviderSettingList.filter(x => x.state == DtoState.Dirty || x.state == DtoState.Created);

      this.saveCreditproviderList.directDebitConfigList = this.creditProviderListData.directDebitConfigList.filter(x => x.state == DtoState.Dirty || x.state == DtoState.Created);

      if (this.saveCreditproviderList.creditProviderSettingList.length > 0 || this.saveCreditproviderList.directDebitConfigList.length > 0) {
        this.spinnerService.setIsLoading(true);

        this.service.saveCreditProviderData(this.saveCreditproviderList).subscribe(res => {

          this.spinnerService.setIsLoading(false);
          this.creditProviderListData.creditProviderSettingList = res.creditProviderSettingList;
          this.creditProviderListData.directDebitConfigList = res.directDebitConfigList;
          this.onChangeCreditprovider(this.creditProvider);
          this.saveCreditproviderList = new SaveCreditProviderSettingDto;

        }, err => {
          this.spinnerService.setIsLoading(false);
          this.saveCreditproviderList = new SaveCreditProviderSettingDto;
          this.exceptionBox = true;
          if (err?.error?.errorCode) {
            this.errorCode = err?.error?.errorCode;
          }
          else {
            this.errorCode = 'InternalServiceFault';
          }
        });
      }
    }
    else {
      if (this.isViewTabs) {
        this.settingExternalErrorTrue();
      }
    }
  }

  onSearchBannedAccount(filterBanned: FilterBannedACCriteriaDto) {
    if ((filterBanned.name != undefined && filterBanned.name != "") || (filterBanned.ibanAccount != undefined && filterBanned.ibanAccount != "")) {
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      filterBanned.creditProviderSettingsFKey = this.creditProviderDetails.pKey as unknown as string;

      this.service.searchBannedAccount(filterBanned).subscribe(res => {
        const data: BannedAccountNumberDto[] = res as BannedAccountNumberDto[];
        if (data.length > 0) {
          this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.forEach(x => data.forEach(y => {
            if (x.pKey != y.pKey && x.isFilterData != false) {
              x.isFilterData = true
            }
            else {
              x.isFilterData = false
            }
          }))
          this.creditProviderDetails.bannedAccountNumbers = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers
          this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.forEach(x => {
            x.modifiedIban = x.ibanAccount;
            x.modifiedIban = this.ibanPipe.transform(x.modifiedIban as string)
          })
          if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.length > 0) {
            const detailIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => !x.isFilterData)

            this.settingIsBannedAccountSelectedFalse();
            this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[detailIndex].isBannedAccountSelected = true;
            this.bannedAccountDetail = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[detailIndex];
            this.showBannedAccountDetails = true;
          }
          else {
            this.showBannedAccountDetails = false;
          }
        }
        else {
          this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.forEach(x => x.isFilterData = true);
          this.showBannedAccountDetails = false;
        }
      });
    }
  }

  onSearchTrustedDomesticAccount(filtertrustedDomestic: FilterTrustedDomesticAccountCriteriaDto) {
    if ((filtertrustedDomestic.name != undefined && filtertrustedDomestic.name != "") ||
      (filtertrustedDomestic.domesticAccount != undefined && filtertrustedDomestic.domesticAccount != "") ||
      (filtertrustedDomestic.sortCode != undefined && filtertrustedDomestic.sortCode != "")) {
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      filtertrustedDomestic.creditProviderSettingsPKey = this.creditProviderDetails.pKey;

      this.service.searchTrustedDomesticAccount(filtertrustedDomestic).subscribe(res => {
        const data: TrustedDomesticAccountDto[] = res as TrustedDomesticAccountDto[];
        if (data.length > 0) {
          this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.forEach(x => data.forEach(y => {
            if (x.pKey != y.pKey && x.isFilterData != false) {
              x.isFilterData = true
            }
            else {
              x.isFilterData = false
            }
          }))
          this.creditProviderDetails.trustedDomesticAccounts = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts
          if (this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.length > 0) {
            const detailIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => !x.isFilterData)

            this.settingIsTrustedDomesticAccountSelectedFalse();
            this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[detailIndex].isTrustedDomesticAccountSelected = true;
            this.trustedDomesticAccountDetail = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[detailIndex]
            this.showTrustedAccountDetails = true;
          }
          else {
            this.showTrustedAccountDetails = false;
          }
        }
        else {
          this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.forEach(x => x.isFilterData = true);
          this.showTrustedAccountDetails = false;
        }
      });

    }
  }

  onSearchTrustedIBANAccount(filterTrustedIBanAccount: FilterTrustedIBANCriteriaDto) {
    if ((filterTrustedIBanAccount.name != undefined && filterTrustedIBanAccount.name != "") || (filterTrustedIBanAccount.ibanAccount != undefined && filterTrustedIBanAccount.ibanAccount != "")) {
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      this.service.searchTrustedIBANAccount(filterTrustedIBanAccount).subscribe(res => {

        const data: TrustedIBANAccountDto[] = res as TrustedIBANAccountDto[];
        if (data.length > 0) {
          this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.forEach(x => data.forEach(y => {
            if (x.pKey != y.pKey && x.isFilterData != false) {
              x.isFilterData = true
            }
            else {
              x.isFilterData = false
            }
          }))
          this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.forEach(x => {
            x.modifiedIbanAccount = x.ibanAccount;
            x.modifiedIbanAccount = this.ibanPipe.transform(x.modifiedIbanAccount as string)
          })
          this.creditProviderDetails.trustedIBANAccounts = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts
          if (this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.length > 0) {
            this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.forEach(x => {
              if (x.country?.codeId == 21 || x.country?.codeId == 161) {
                x.isEnablePostalCodeAutoComplete = true;
                x.isEnableCity = false;
              }
              else {
                x.isEnablePostalCodeAutoComplete = false;
                x.isEnableCity = true;
              }
              x.isEnableStreetAutoComplete = false;
              x.isEnableStreet = false;
            })

            const detailIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => !x.isFilterData)
            this.settingIsTrustedIBANAccountSelectedFalse();
            this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[detailIndex].isTrustedIBANAccountSelected = true;
            this.trustedIbanAccountDetail = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[detailIndex];
            this.showTrustedIbanAccountDetails = true;
          }
          else {
            this.showTrustedIbanAccountDetails = false;
          }
        }
        else {
          this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.forEach(x => x.isFilterData = true);
          this.showTrustedIbanAccountDetails = false;
        }
      });
    }
  }

  directDebitResendDataSelect(event: DirectDebitConfigResendDto) {
    this.settingIsEventSelectedFalse();
    this.directDebitEventDetails = event;
    this.directDebitEventDetails.isEventSelected = true;
  }

  addArrearConfig() {
    if (this.creditProviderForm.valid) {
      this.settingCreditStateDirty();
      this.ArrearNameDropdownConfig.externalError = false;
      this.CreditStatusDropdownConfig.externalError = false;
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      let commonArrearConfigDropdown;
      if (this.creditProviderListData.creditProviderSettingList.length > 0) {
        commonArrearConfigDropdown = this.creditProviderListData.arrearsConfigurationList.filter(val => {
          return !this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration.find(x => {
            return x.arrearsConfiguration?.pKey == val?.pKey;
          })
        })
      }
      else {
        commonArrearConfigDropdown = this.creditProviderListData.arrearsConfigurationList;
      }

      const newRow = new CreditProviderSettings2ArrearsConfigurationDto;
      newRow.pKey = 0;
      newRow.state = DtoState.Created;
      newRow.enableArrearConfig = true;
      newRow.arrearConfigList = commonArrearConfigDropdown;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration;
      newuserList.push({ ...newRow });

      this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration = [...newuserList];
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onArreaConfigRowDelete(event: CreditProviderSettings2ArrearsConfigurationDto, gridData: CreditProviderSettings2ArrearsConfigurationDto[]) {
    if (this.creditProviderForm.valid || event?.arrearsConfiguration == null || event?.creditStatus == null) {
      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration = [...gridData];
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  paymentValidatorGroupDataSelect(event: any) {
    if (this.validatePaymentForm.valid) {

      this.settingIsPaymentValidatorGroupSelectedFalse();
      this.paymentValidatorGroupDetail = event;
      this.paymentValidatorGroupDetail.isPaymentValidatorGroupSelected = true;

      if (this.paymentValidatorGroupDetail.paymentValidators.length > 0) {
        this.settingIsPaymentValidatorIsSelectedFalse();
        this.paymentValidatorsDetail = this.paymentValidatorGroupDetail.paymentValidators[0];
        this.paymentValidatorsDetail.isPaymentValidatorIsSelected = true;
      }
      if (this.paymentValidatorGroupDetail.paymentValidators.length == 0) {
        this.showValidatePaymentDetails = false
      }
      else {
        this.showValidatePaymentDetails = true
      }
    }
    else {
      this.PaymentValidatorGroupNameTextBoxconfig.externalError = true;
      this.ValidatorAutoCompleteConfig.externalError = true;
      if (this.paymentValidatorsDetail.email == "" && this.paymentValidatorsDetail.name != null as unknown as UserDto && this.paymentValidatorsDetail.name != undefined) {
        this.EmailTextBoxconfig.externalError = true;
      }
    }
  }

  addPaymentValidatorGroup() {
    if (this.validatePaymentForm.valid) {
      this.settingCreditStateDirty();

      this.PaymentValidatorGroupNameTextBoxconfig.externalError = false;
      this.showValidatePaymentGroupDetails = true;
      this.showValidatePaymentDetails = false;

      this.settingIsPaymentValidatorGroupSelectedFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const newRow = new PaymentValidatorGroupDto;
      newRow.isPaymentValidatorGroupSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups;
      newuserList.push({ ...newRow });
      this.paymentValidatorGroupDetail = new PaymentValidatorGroupDto();
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups = [...newuserList];

      this.paymentValidatorGroupDetail.pKey = 0;
      this.paymentValidatorGroupDetail.state = DtoState.Created;
      this.paymentValidatorGroupDetail.isPaymentValidatorGroupSelected = true;
      this.paymentValidatorGroupDetail.isForBonusRefund = false;
      this.paymentValidatorGroupDetail.isForConstructionDepotPayment = false;
      this.paymentValidatorGroupDetail.isForCostPayment = false;
      this.paymentValidatorGroupDetail.isForIntermediaryPayment = false;
      this.paymentValidatorGroupDetail.isForMortgageDossierPayment = false;
      this.paymentValidatorGroupDetail.isForPaymentOut = false;
      this.paymentValidatorGroupDetail.isForRunningAccountPayment = false;
      this.paymentValidatorGroupDetail.isForSubsidyPayment = false;
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.length - 1] = this.paymentValidatorGroupDetail;
    }
    else {
      this.PaymentValidatorGroupNameTextBoxconfig.externalError = true;
      this.ValidatorAutoCompleteConfig.externalError = true;
      if (this.paymentValidatorsDetail?.email == "" && this.paymentValidatorsDetail?.name != null as unknown as UserDto && this.paymentValidatorsDetail?.name != undefined) {
        this.EmailTextBoxconfig.externalError = true;
      }
    }
  }

  onPaymentValidatorGroupDelete(event: PaymentValidatorGroupDto, gridData: PaymentValidatorGroupDto[]) {
    if (this.validatePaymentForm.valid || event.name == undefined || event.name == "") {
      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups = [...gridData];
      if (gridData.length > 0) {
        this.settingIsPaymentValidatorGroupSelectedFalse();
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.length - 1].isPaymentValidatorGroupSelected = true;
        this.paymentValidatorGroupDetail = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.length - 1]
      }
      else {
        this.PaymentValidatorGroupNameTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.showValidatePaymentGroupDetails = false;
        }, 2)
      }
    }
  }

  paymentValidatorDataSelect(event: PaymentValidatorDto) {
    if (this.validatePaymentForm.valid) {

      this.settingIsPaymentValidatorIsSelectedFalse();
      this.paymentValidatorsDetail = event;
      this.paymentValidatorsDetail.isPaymentValidatorIsSelected = true;
    }
    else {
      this.ValidatorAutoCompleteConfig.externalError = true;
      if (this.paymentValidatorsDetail.email == "" && this.paymentValidatorsDetail.name != null as unknown as UserDto && this.paymentValidatorsDetail.name != undefined) {
        this.EmailTextBoxconfig.externalError = true;
      }
    }
  }

  addPaymentValidator() {
    if (this.validatePaymentForm.valid) {
      this.settingCreditStateDirty();
      this.showValidatePaymentDetails = true;

      this.ValidatorAutoCompleteConfig.externalError = false;
      this.EmailTextBoxconfig.externalError = false;

      this.settingIsPaymentValidatorIsSelectedFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
      const newRow = new PaymentValidatorDto;
      newRow.isPaymentValidatorIsSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators;
      newuserList.push({ ...newRow });
      this.paymentValidatorsDetail = new PaymentValidatorDto();
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators = [...newuserList];

      this.paymentValidatorsDetail.pKey = 0;
      this.paymentValidatorsDetail.state = DtoState.Created;
      this.paymentValidatorsDetail.isPaymentValidatorIsSelected = true;

      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.length - 1] = this.paymentValidatorsDetail;
    }
    else {
      this.PaymentValidatorGroupNameTextBoxconfig.externalError = true;
      this.ValidatorAutoCompleteConfig.externalError = true;
      if (this.paymentValidatorsDetail.email == "" && this.paymentValidatorsDetail.name != null as unknown as UserDto && this.paymentValidatorsDetail.name != undefined) {
        this.EmailTextBoxconfig.externalError = true;
      }
    }
  }

  onPaymentValidatorDelete(event: PaymentValidatorDto, gridData: PaymentValidatorDto[]) {

    const validatorIndex = this.paymentValidatorGroupDetail.paymentValidators.findIndex(x => x.name?.displayName == undefined)
    const emailIndex = this.paymentValidatorGroupDetail.paymentValidators.findIndex(x => x.email == "" || x.email == undefined)

    if ((validatorIndex == -1 && emailIndex == -1) || event.name == undefined || event.name == null || event.email == "" || event.email == undefined) {
      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators = [...gridData];
      if (gridData.length > 0) {
        this.settingIsPaymentValidatorIsSelectedFalse();
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.length - 1].isPaymentValidatorIsSelected = true;
        this.paymentValidatorsDetail = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.length - 1]
      }
      else {
        this.ValidatorAutoCompleteConfig.externalError = false;
        this.EmailTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.showValidatePaymentDetails = false
        }, 2)
      }
    }
  }

  bannedAccountDataSelect(event: BannedAccountNumberDto) {
    if (this.bannedAccountForm.valid) {
      this.settingIsBannedAccountSelectedFalse();
      this.bannedAccountDetail = event;
      this.bannedAccountDetail.isBannedAccountSelected = true;
    }
    else {
      this.BannedAccountNameTextBoxconfig.externalError = true;
      this.BannedibanAccountTextBoxconfig.externalError = true;
    }
  }

  addbannedAccount() {
    if (this.bannedAccountForm.valid) {
      this.settingCreditStateDirty();
      this.BannedAccountNameTextBoxconfig.externalError = false;
      this.BannedibanAccountTextBoxconfig.externalError = false;
      this.showBannedAccountDetails = true

      this.settingIsBannedAccountSelectedFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const newRow = new BannedAccountNumberDto;
      newRow.isBannedAccountSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers;
      newuserList.push({ ...newRow });
      this.bannedAccountDetail = new BannedAccountNumberDto();
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers = [...newuserList];

      this.bannedAccountDetail.pKey = 0;
      this.bannedAccountDetail.state = DtoState.Created;
      this.bannedAccountDetail.isBannedAccountSelected = true;

      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.length - 1] = this.bannedAccountDetail;
    }
    else {
      this.BannedAccountNameTextBoxconfig.externalError = true;
      this.BannedibanAccountTextBoxconfig.externalError = true;
    }
  }

  onBannedAccountDelete(event: BannedAccountNumberDto, gridData: BannedAccountNumberDto[]) {
    if (this.bannedAccountForm.valid || event.name == undefined || event.name == null || event.ibanAccount == undefined || event.ibanAccount == null) {
      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers = [...gridData];
      const filterIndex = gridData.findIndex(x => !x.isFilterData)
      if (gridData.length > 0 && filterIndex != -1) {
        const trueIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isFilterData);
        if (trueIndex == -1) {
          this.settingIsBannedAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.length - 1].isBannedAccountSelected = true;
          this.bannedAccountDetail = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.length - 1]
        }
        else {
          const bannedData: BannedAccountNumberDto[] = [...this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers];
          const detailIndex = bannedData.reverse().findIndex(x => !x.isFilterData);
          const count = bannedData.length - 1
          const finalIndex = detailIndex >= 0 ? count - detailIndex : detailIndex;
          this.settingIsBannedAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[finalIndex].isBannedAccountSelected = true;
          this.bannedAccountDetail = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[finalIndex]
        }
      }
      else {
        this.BannedAccountNameTextBoxconfig.externalError = false;
        this.BannedibanAccountTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.showBannedAccountDetails = false;
        }, 2)
      }
    }
  }

  trustedDomesticAccountDataSelect(event: TrustedDomesticAccountDto) {
    if (this.trustedAccountForm.valid) {
      this.settingIsTrustedDomesticAccountSelectedFalse();
      this.trustedDomesticAccountDetail = event;
      this.trustedDomesticAccountDetail.isTrustedDomesticAccountSelected = true;
    }
    else {
      this.TrustedDomesticAccountNameTextBoxconfig.externalError = true;
      this.TrustedDomesticAccountNrTextBoxconfig.externalError = true;
      this.TrustedDomesticSortCodeTextBoxconfig.externalError = true;
    }
  }

  addTrustedDomesticAccount() {
    if (this.trustedAccountForm.valid) {
      this.settingCreditStateDirty();
      this.TrustedDomesticAccountNameTextBoxconfig.externalError = false;
      this.TrustedDomesticAccountNrTextBoxconfig.externalError = false;
      this.TrustedDomesticSortCodeTextBoxconfig.externalError = false;

      this.showTrustedAccountDetails = true;

      this.settingIsTrustedDomesticAccountSelectedFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const newRow = new TrustedDomesticAccountDto;
      newRow.isTrustedDomesticAccountSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts;
      newuserList.push({ ...newRow });
      this.trustedDomesticAccountDetail = new TrustedDomesticAccountDto();
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts = [...newuserList];

      this.trustedDomesticAccountDetail.pKey = 0;
      this.trustedDomesticAccountDetail.state = DtoState.Created;
      this.trustedDomesticAccountDetail.isTrustedDomesticAccountSelected = true;

      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.length - 1] = this.trustedDomesticAccountDetail;
    }
    else {
      this.TrustedDomesticAccountNameTextBoxconfig.externalError = true;
      this.TrustedDomesticAccountNrTextBoxconfig.externalError = true;
      this.TrustedDomesticSortCodeTextBoxconfig.externalError = true;
    }
  }

  onTrustedDomesticAccountDelete(event: TrustedDomesticAccountDto, gridData: TrustedDomesticAccountDto[]) {
    if (this.trustedAccountForm.valid || event.name == null || event.name == undefined || event.domesticAccount == null ||
      event.domesticAccount == undefined || event.sortCode == null || event.sortCode == undefined) {

      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts = [...gridData];
      const filterIndex = gridData.findIndex(x => !x.isFilterData)
      if (gridData.length > 0 && filterIndex != -1) {
        const trueIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => x.isFilterData);
        if (trueIndex == -1) {
          this.settingIsTrustedDomesticAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.length - 1].isTrustedDomesticAccountSelected = true;
          this.trustedDomesticAccountDetail = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.length - 1]
        }
        else {
          const trustedData: TrustedDomesticAccountDto[] = [...this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts];
          const detailIndex = trustedData.reverse().findIndex(x => !x.isFilterData);
          const count = trustedData.length - 1
          const finalIndex = detailIndex >= 0 ? count - detailIndex : detailIndex;
          this.settingIsTrustedDomesticAccountSelectedFalse();
          this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[finalIndex].isTrustedDomesticAccountSelected = true;
          this.trustedDomesticAccountDetail = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[finalIndex]
        }
      }
      else {
        this.TrustedDomesticAccountNameTextBoxconfig.externalError = false;
        this.TrustedDomesticAccountNrTextBoxconfig.externalError = false;
        this.TrustedDomesticSortCodeTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.showTrustedAccountDetails = false
        }, 2)
      }
    }
  }

  trustedIBANAccountDataSelect(event: TrustedIBANAccountDto) {
    if (this.trustedAccountForm.valid) {
      this.settingIsTrustedIBANAccountSelectedFalse();
      this.trustedIbanAccountDetail = event;
      this.trustedIbanAccountDetail.isTrustedIBANAccountSelected = true;
    }
    else {
      if (!event.isTrustedIBANAccountSelected) {
        this.settingTrustedIbanAccountExternalErrorTrue();
      }
    }
  }

  addTrustedIBANAccount() {
    if (this.trustedAccountForm.valid) {
      this.settingCreditStateDirty();
      this.settingTrustedIbanAccountExternalErrorFalse();
      this.showTrustedIbanAccountDetails = true;

      this.settingIsTrustedIBANAccountSelectedFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const newRow = new TrustedIBANAccountDto;
      newRow.isTrustedIBANAccountSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts;
      newuserList.push({ ...newRow });
      this.trustedIbanAccountDetail = new TrustedIBANAccountDto();
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts = [...newuserList];

      this.trustedIbanAccountDetail.pKey = 0;
      this.trustedIbanAccountDetail.state = DtoState.Created;
      this.trustedIbanAccountDetail.isTrustedIBANAccountSelected = true;
      this.trustedIbanAccountDetail.isEnablePostalCodeAutoComplete = false;
      this.trustedIbanAccountDetail.isEnableStreetAutoComplete = false;
      this.trustedIbanAccountDetail.isEnableCity = true;
      this.trustedIbanAccountDetail.isEnableStreet = true;

      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.length - 1] = this.trustedIbanAccountDetail;
    }
    else {
      this.settingTrustedIbanAccountExternalErrorTrue();
    }
  }

  onTrustedIBANAccountDelete(event: TrustedIBANAccountDto, gridData: TrustedIBANAccountDto[]) {
    if (this.trustedAccountForm.valid || event.name == undefined || event.name == null || event.ibanAccount == undefined || event.ibanAccount == null ||
      event.bicCode == undefined || event.bicCode == null || event.country == undefined || event.country == null || event.street == undefined ||
      event.street == null || event.city == undefined || event.city == null || event.houseNr == undefined || event.houseNr == null) {

      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData[deletedata].postalCode = "0";

      setTimeout(() => {
        this.DeleteTrustedIbanAccount(deletedata, gridData, index, this.creditProviderListData);
      }, 0.1);

    }
  }

  DeleteTrustedIbanAccount(deletedata: number, gridData: TrustedIBANAccountDto[], index: number, creditProviderListData: GetCreditProviderSettingsDto) {
    gridData.splice(deletedata, 1);
    creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts = [...gridData];
    const filterIndex = gridData.findIndex(x => !x.isFilterData)
    if (gridData.length > 0 && filterIndex != -1) {
      const trueIndex = creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isFilterData);
     
      if (trueIndex == -1) {
        this.settingIsTrustedIBANAccountSelectedFalse();
        creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.length - 1].isTrustedIBANAccountSelected = true;
        this.trustedIbanAccountDetail = creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.length - 1]
      }
      else {
        const trustedData: TrustedIBANAccountDto[] = [...creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts];
        const detailIndex = trustedData.reverse().findIndex(x => !x.isFilterData);
        const count = trustedData.length - 1
        const finalIndex = detailIndex >= 0 ? count - detailIndex : detailIndex;
        this.settingIsTrustedIBANAccountSelectedFalse();
        creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[finalIndex].isTrustedIBANAccountSelected = true;
        this.trustedIbanAccountDetail = creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[finalIndex]
      }
    }
    else {
      this.settingTrustedIbanAccountExternalErrorFalse();
      setTimeout(() => {
        this.showTrustedIbanAccountDetails = false;
      }, 2)
    }
  }

  percentageOfLimitDataSelect(event: ActualizationConfigDto) {
    if (this.actualizationForm.valid) {
      this.settingIsActualizationSelectFalse();
      this.percentageOfLimitDetail = event;
      this.percentageOfLimitDetail.isActualizationSelected = true;
    }
    else {
      this.MinDurationInMonthsTextBoxConfig.externalError = true;
      this.MaxDurationInMonthsTextBoxConfig.externalError = true;
      this.PercentageOfLimitThresholdTextBoxConfig.externalError = true;
    }
  }

  addPercentageOfLimit() {
    if (this.actualizationForm.valid) {
      this.settingCreditStateDirty();
      this.MinDurationInMonthsTextBoxConfig.externalError = false;
      this.MaxDurationInMonthsTextBoxConfig.externalError = false;
      this.PercentageOfLimitThresholdTextBoxConfig.externalError = false;
      this.showPercentageOfLimitDetails = true;

      this.settingIsActualizationSelectFalse();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
      const newRow = new ActualizationConfigDto;
      newRow.isActualizationSelected = true;
      const newuserList = this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs;
      newuserList.push({ ...newRow });
      this.percentageOfLimitDetail = new ActualizationConfigDto();
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs = [...newuserList];

      this.percentageOfLimitDetail.pKey = 0;
      this.percentageOfLimitDetail.state = DtoState.Created;
      this.percentageOfLimitDetail.isActualizationSelected = true;

      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.length - 1] = this.percentageOfLimitDetail;
    }
    else {
      this.MinDurationInMonthsTextBoxConfig.externalError = true;
      this.MaxDurationInMonthsTextBoxConfig.externalError = true;
      this.PercentageOfLimitThresholdTextBoxConfig.externalError = true;
    }
  }

  onPercentageOfLimitDelete(event: ActualizationConfigDto, gridData: ActualizationConfigDto[]) {
    if (this.actualizationForm.valid || event.minDurationInMonths == null || event.minDurationInMonths == undefined || event.maxDurationInMonths == null
      || event.maxDurationInMonths == undefined || event.percentageOfLimitThreshold == null || event.percentageOfLimitThreshold == undefined) {

      this.settingCreditStateDirty();
      const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      gridData.splice(deletedata, 1);
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs = [...gridData];
      if (gridData.length > 0) {
        this.settingIsActualizationSelectFalse();
        this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.length - 1].isActualizationSelected = true;
        this.percentageOfLimitDetail = this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.length - 1]
      }
      else {
        this.MinDurationInMonthsTextBoxConfig.externalError = false;
        this.MaxDurationInMonthsTextBoxConfig.externalError = false;
        this.PercentageOfLimitThresholdTextBoxConfig.externalError = false;
        setTimeout(() => {
          this.showPercentageOfLimitDetails = false;
        }, 2)
      }
    }
  }

  settingTrustedIbanAccountExternalErrorFalse() {
    this.TrustedIBANAccountNameTextBoxconfig.externalError = false;
    this.TrustedibanAccountTextBoxconfig.externalError = false;
    this.TrustedIBANbicCodeAutoCompleteConfig.externalError = false;
    this.TrustedcityTextBoxconfig.externalError = false;
    this.TrustedcountryAutoCompleteConfig.externalError = false;
    this.TrustedstreetTextBoxconfig.externalError = false;
    this.TrustedstreetAutoCompleteConfig.externalError = false;
    this.TrustedpostalCodeAutoCompleteConfig.externalError = false;
    this.TrustedpostalCodeTextBoxconfig.externalError = false;
    this.TrustedhouseNrTextBoxconfig.externalError = false;
  }

  settingTrustedIbanAccountExternalErrorTrue() {
    this.TrustedIBANAccountNameTextBoxconfig.externalError = true;
    this.TrustedibanAccountTextBoxconfig.externalError = true;
    this.TrustedIBANbicCodeAutoCompleteConfig.externalError = true;
    this.TrustedcityTextBoxconfig.externalError = true;
    this.TrustedcountryAutoCompleteConfig.externalError = true;
    this.TrustedstreetTextBoxconfig.externalError = true;
    this.TrustedstreetAutoCompleteConfig.externalError = true;
    this.TrustedpostalCodeAutoCompleteConfig.externalError = true;
    this.TrustedpostalCodeTextBoxconfig.externalError = true;
    this.TrustedhouseNrTextBoxconfig.externalError = true;
  }

  settingIsCreditSelectedFalse() {
    this.creditProviderListData.creditProviderSettingList.forEach(x => x.isCreditSelected = false);
  }

  settingIsDebitSelectedFalse() {
    this.creditProviderListData.directDebitConfigList.forEach(x => x.isDebitSelected = false);
  }

  settingIsEventSelectedFalse() {
    this.directDebitDetails.directDebitConfigResendList.forEach(x => x.isEventSelected = false);
  }

  settingIsPaymentValidatorGroupSelectedFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.forEach(x => x.isPaymentValidatorGroupSelected = false);
  }

  settingIsPaymentValidatorIsSelectedFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.forEach(x => x.isPaymentValidatorIsSelected = false);
  }

  settingIsBannedAccountSelectedFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.forEach(x => x.isBannedAccountSelected = false);
  }

  settingIsTrustedDomesticAccountSelectedFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.forEach(x => x.isTrustedDomesticAccountSelected = false);
  }

  settingIsTrustedIBANAccountSelectedFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.forEach(x => x.isTrustedIBANAccountSelected = false);
  }

  settingIsActualizationSelectFalse() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.forEach(x => x.isActualizationSelected = false);
  }

  settingCreditStateDirty() {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    if (this.creditProviderListData.creditProviderSettingList[index].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].state = DtoState.Dirty;
    }
  }

  // General tab onChange Event
  onChangeCreditDossierStructure(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].creditDossierStructure = event?.value;
    this.creditProviderDetails.creditDossierStructure = event?.value;
  }

  onChangeIsCreditReferenceFormattingRequired(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].isCreditReferenceFormattingRequired = event;
    this.creditProviderDetails.isCreditReferenceFormattingRequired = event;
  }

  onChangeCollectionsAccount(event: any) {
    const value = event.target?.value.replace(/\s/g, '');
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].collectionsAccount = value;
    this.creditProviderDetails.collectionsAccount = value;
  }

  onChangeCollectionsDomesticAccount(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].collectionsDomesticAccount = event;
    this.creditProviderDetails.collectionsDomesticAccount = event;
  }

  onChangeCollectionsSortCode(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].collectionsSortCode = event;
    this.creditProviderDetails.collectionsSortCode = event;
  }

  onChangeFinancialInstitutionPrefix(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].financialInstitutionPrefix = event;
    this.creditProviderDetails.financialInstitutionPrefix = event;
  }

  onChangeIdentificationNr(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].identificationNr = event;
    this.creditProviderDetails.identificationNr = event;
  }

  onChangeDisbursementAccount(event: any) {
    const value = event.target?.value.replace(/\s/g, '');
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].disbursementAccount = value;
    this.creditProviderDetails.disbursementAccount = value;
  }

  onChangeDisbursementDomesticAccount(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].disbursementDomesticAccount = event;
    this.creditProviderDetails.disbursementDomesticAccount = event;
  }

  onChangeDisbursementBIC(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].disbursementBIC = event;
    this.creditProviderDetails.disbursementBIC = event;
  }

  onChangeDisbursementSortCode(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].disbursementSortCode = event;
    this.creditProviderDetails.disbursementSortCode = event;
  }

  onChangeMinDueDatesForTask(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].minDueDatesForTask = parseInt(event);
      this.creditProviderDetails.minDueDatesForTask = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].minDueDatesForTask = null;
          this.creditProviderDetails.minDueDatesForTask = null;
          this.MinDueDatesForTaskTextBoxConfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minDueDatesForTask = null;
      this.creditProviderDetails.minDueDatesForTask = null;
      this.MinDueDatesForTaskTextBoxConfig.externalError = true;
    }
  }

  onChangeMinDueDatesForUrgentTask(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].minDueDatesForUrgentTask = parseInt(event);
      this.creditProviderDetails.minDueDatesForUrgentTask = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].minDueDatesForUrgentTask = null;
          this.creditProviderDetails.minDueDatesForUrgentTask = null;
          this.MinDueDatesForUrgentTaskTextBoxConfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minDueDatesForUrgentTask = null;
      this.creditProviderDetails.minDueDatesForUrgentTask = null;
      this.MinDueDatesForUrgentTaskTextBoxConfig.externalError = true;
    }
  }

  onChangeMinAmountForBonusTaskForRevolving(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].minAmountForBonusTaskForRevolving = parseFloat(floatValue);
        this.creditProviderDetails.minAmountForBonusTaskForRevolving = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minAmountForBonusTaskForRevolving = null as unknown as number;
      this.creditProviderDetails.minAmountForBonusTaskForRevolving = null as unknown as number;
      this.MinAmountForBonusTaskForRevolvingTextBoxConfig.externalError = true;
    }
  }

  onChangeMinBonusThresholdforRefund(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].minBonusThresholdforRefund = parseInt(event);
      this.creditProviderDetails.minBonusThresholdforRefund = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].minBonusThresholdforRefund = null as unknown as number;
          this.creditProviderDetails.minBonusThresholdforRefund = null as unknown as number;
          this.MinBonusThresholdforRefundTextBoxConfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minBonusThresholdforRefund = null as unknown as number;
      this.creditProviderDetails.minBonusThresholdforRefund = null as unknown as number;
      this.MinBonusThresholdforRefundTextBoxConfig.externalError = true;
    }
  }

  onChangeMinDueThresholdforRemise(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        if (event != "0,00") {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.creditProviderListData.creditProviderSettingList[index].minDueThresholdforRemise = parseFloat(floatValue);
          this.creditProviderDetails.minDueThresholdforRemise = parseFloat(floatValue);
        }
        else {
          this.creditProviderDetails.minDueThresholdforRemise = event;
          this.MinDueThresholdforRemiseTextBoxConfig.externalError = true;
        }
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minDueThresholdforRemise = null as unknown as number;
      this.creditProviderDetails.minDueThresholdforRemise = null as unknown as number;
      this.MinDueThresholdforRemiseTextBoxConfig.externalError = true;
    }
  }

  onChangeMinDueElapsedPeriodforRemise(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].minDueElapsedPeriodforRemise = parseInt(event);
      this.creditProviderDetails.minDueElapsedPeriodforRemise = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].minDueElapsedPeriodforRemise = null;
          this.creditProviderDetails.minDueElapsedPeriodforRemise = null;
          this.MinDueElapsedPeriodforRemiseTextBoxConfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].minDueElapsedPeriodforRemise = null;
      this.creditProviderDetails.minDueElapsedPeriodforRemise = null;
      this.MinDueElapsedPeriodforRemiseTextBoxConfig.externalError = true;
    }
  }

  onChangeMaxDueThresholdforRemise(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].maxDueThresholdforRemise = parseFloat(floatValue);
        this.creditProviderDetails.maxDueThresholdforRemise = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.maxDueThresholdforRemise = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].maxDueThresholdforRemise = 0;
        this.creditProviderDetails.maxDueThresholdforRemise = 0;
      }, 1)
    }
  }

  onChangeMaxDueElapsedPeriodForRemise(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].maxDueElapsedPeriodForRemise = parseInt(event);
      this.creditProviderDetails.maxDueElapsedPeriodForRemise = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].maxDueElapsedPeriodForRemise = null;
          this.creditProviderDetails.maxDueElapsedPeriodForRemise = null;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].maxDueElapsedPeriodForRemise = null;
      this.creditProviderDetails.maxDueElapsedPeriodForRemise = null;
    }
  }

  onChangeBonusRefundReceiverTypeList(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].bonusRefundReceiverType = event?.value;
    this.creditProviderDetails.bonusRefundReceiverType = event?.value;
    if (event?.value == null) {
      this.BonusRefundReceiverTypeDropdownConfig.externalError = true;
    }
  }

  onChangeMinRemainingValueAfterPrepayment(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.state = DtoState.Dirty;
    if (event != null) {
      if (!isChanged) {
        if (event != "0,00") {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.minRemainingValueAfterPrepayment = parseFloat(floatValue);
          this.creditProviderDetails.prepaymentSettings.minRemainingValueAfterPrepayment = parseFloat(floatValue);
        }
        else {
          this.creditProviderDetails.prepaymentSettings.minRemainingValueAfterPrepayment = event;
          this.MinRemainingValueAfterPrepaymentTextBoxconfig.externalError = true;
        }
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.minRemainingValueAfterPrepayment = null as unknown as number;
      this.creditProviderDetails.prepaymentSettings.minRemainingValueAfterPrepayment = null as unknown as number;
      this.MinRemainingValueAfterPrepaymentTextBoxconfig.externalError = true;
    }
  }

  onChangeMaxDueAfterPrepaymentForMortgage(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.state = DtoState.Dirty;
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.maxDueAfterPrepaymentForMortgage = parseFloat(floatValue);
        this.creditProviderDetails.prepaymentSettings.maxDueAfterPrepaymentForMortgage = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.maxDueAfterPrepaymentForMortgage = null as unknown as number;
      this.creditProviderDetails.prepaymentSettings.maxDueAfterPrepaymentForMortgage = null as unknown as number;
    }
  }

  onChangeNrOfDaysAdvancedNotice(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.state = DtoState.Dirty;
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.nrOfDaysAdvancedNotice = parseInt(event);
      this.creditProviderDetails.prepaymentSettings.nrOfDaysAdvancedNotice = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.nrOfDaysAdvancedNotice = null;
          this.creditProviderDetails.prepaymentSettings.nrOfDaysAdvancedNotice = null;
          this.NrOfDaysAdvancedNoticeTextBoxconfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.nrOfDaysAdvancedNotice = null;
      this.creditProviderDetails.prepaymentSettings.nrOfDaysAdvancedNotice = null;
      this.NrOfDaysAdvancedNoticeTextBoxconfig.externalError = true;
    }
  }

  onChangeAutomaticPartialPrepaymentForPaymentIn(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.state = DtoState.Dirty;
    this.creditProviderListData.creditProviderSettingList[index].prepaymentSettings.automaticPartialPrepaymentForPaymentIn = event;
    this.creditProviderDetails.prepaymentSettings.automaticPartialPrepaymentForPaymentIn = event;
  }

  onChangeSuspendDirectDebitByDefault(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].suspendDirectDebitByDefault = event;
    this.creditProviderDetails.suspendDirectDebitByDefault = event;
  }

  onChangeSuspendRemindersByDefault(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].suspendRemindersByDefault = event;
    this.creditProviderDetails.suspendRemindersByDefault = event;
  }

  onChangeNrOfDaysForIsRegularCalculationBase(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].nrOfDaysForIsRegularCalculationBase = parseInt(event);
      this.creditProviderDetails.nrOfDaysForIsRegularCalculationBase = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].nrOfDaysForIsRegularCalculationBase = null;
          this.creditProviderDetails.nrOfDaysForIsRegularCalculationBase = null;
          this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].nrOfDaysForIsRegularCalculationBase = null;
      this.creditProviderDetails.nrOfDaysForIsRegularCalculationBase = null;
      this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.externalError = true;
    }
  }

  onChangeCalculateFirstInterestFromPaymentOutDate(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].calculateFirstInterestFromPaymentOutDate = event;
    this.creditProviderDetails.calculateFirstInterestFromPaymentOutDate = event;
  }

  onChangeNrOfDaysDeviationForFirstInterestCalculation(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].nrOfDaysDeviationForFirstInterestCalculation = parseInt(event);
      this.creditProviderDetails.nrOfDaysDeviationForFirstInterestCalculation = parseInt(event);
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].nrOfDaysDeviationForFirstInterestCalculation = null;
      this.creditProviderDetails.nrOfDaysDeviationForFirstInterestCalculation = null;
    }
  }

  onChangeChargeFirstInterestAtFirstDueDateCalendarDay(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].chargeFirstInterestAtFirstDueDateCalendarDay = event;
    this.creditProviderDetails.chargeFirstInterestAtFirstDueDateCalendarDay = event;
  }

  onChangeApplyInterestCapitalizationForRevolvingCredits(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].applyInterestCapitalizationForRevolvingCredits = event;
    this.creditProviderDetails.applyInterestCapitalizationForRevolvingCredits = event;
  }

  onChangeApplyMinMaxNetRate(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].applyMinMaxNetRate = event;
    if (!event) {
      this.creditProviderListData.creditProviderSettingList[index].removeRateRevisionProposalsUnderMinRate = false;
      this.creditProviderDetails.removeRateRevisionProposalsUnderMinRate = false;
    }
    this.creditProviderDetails.applyMinMaxNetRate = event;
  }

  onChangeRemoveRateRevisionProposalsUnderMinRate(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].removeRateRevisionProposalsUnderMinRate = event;
    this.creditProviderDetails.removeRateRevisionProposalsUnderMinRate = event;
  }

  onChangeExtendRevisionPeriodsWithinLimit(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].extendRevisionPeriodsWithinLimit = event;
    if (!event) {
      this.creditProviderListData.creditProviderSettingList[index].numberOfMonthsToExtendRevisionPeriod = null as unknown as number;
      this.creditProviderDetails.numberOfMonthsToExtendRevisionPeriod = null as unknown as number;
      this.creditProviderListData.creditProviderSettingList[index].numberOfDaysToExtendVariableRevisionPeriod = null as unknown as number;
      this.creditProviderDetails.numberOfDaysToExtendVariableRevisionPeriod = null as unknown as number;
    }
    this.creditProviderDetails.extendRevisionPeriodsWithinLimit = event;
    if (event == null) {
      this.ExtendRevisionPeriodsWithinLimitCheckboxConfig.externalError = true;
    }
  }

  onChangeNumberOfMonthsToExtendRevisionPeriod(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].numberOfMonthsToExtendRevisionPeriod = parseInt(event);
      this.creditProviderDetails.numberOfMonthsToExtendRevisionPeriod = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].numberOfMonthsToExtendRevisionPeriod = null;
          this.creditProviderDetails.numberOfMonthsToExtendRevisionPeriod = null;
          this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].numberOfMonthsToExtendRevisionPeriod = null;
      this.creditProviderDetails.numberOfMonthsToExtendRevisionPeriod = null;
      this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.externalError = true;
    }
  }

  onChangeNumberOfDaysToExtendVariableRevisionPeriod(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].numberOfDaysToExtendVariableRevisionPeriod = parseInt(event);
      this.creditProviderDetails.numberOfDaysToExtendVariableRevisionPeriod = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].numberOfDaysToExtendVariableRevisionPeriod = null;
          this.creditProviderDetails.numberOfDaysToExtendVariableRevisionPeriod = null;
          this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].numberOfDaysToExtendVariableRevisionPeriod = null;
      this.creditProviderDetails.numberOfDaysToExtendVariableRevisionPeriod = null;
      this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.externalError = true;
    }
  }

  onChangeThirdPartyWarrantyPercentage(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].thirdPartyWarrantyPercentage = parseFloat(floatValue);
        this.creditProviderDetails.thirdPartyWarrantyPercentage = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.thirdPartyWarrantyPercentage = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].thirdPartyWarrantyPercentage = 0;
        this.creditProviderDetails.thirdPartyWarrantyPercentage = 0;
      }, 1)
    }
  }

  onChangeUseDossierLTV(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].useDossierLTV = event;
    this.creditProviderDetails.useDossierLTV = event;
  }

  onChangeDueDateCalendarDay(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].dueDateCalendarDay = event?.value?.caption;
    this.creditProviderDetails.dueDateCalendarDay = event?.value?.caption;
    this.creditProviderDetails.modifiedDueDateCalendarDay = event?.value;
  }

  onChangeTheoreticalEndDateDeterminationType(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].theoreticalEndDateDeterminationType = event?.value;
    this.creditProviderDetails.theoreticalEndDateDeterminationType = event?.value;
  }

  onChangeNo4EyeValidationForCollateralMutation(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].no4EyeValidationForCollateralMutation = event;
    this.creditProviderDetails.no4EyeValidationForCollateralMutation = event;
  }

  onChangeNo4EyeValidationForRoleMutation(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].no4EyeValidationForRoleMutation = event;
    this.creditProviderDetails.no4EyeValidationForRoleMutation = event;
  }

  onChangeTransferRemainingGracePeriod(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].transferRemainingGracePeriod = event;
    this.creditProviderDetails.transferRemainingGracePeriod = event;
  }

  onChangeNo4EyeValidationForRealEstateValue(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].no4EyeValidationForRealEstateValue = event;
    this.creditProviderDetails.no4EyeValidationForRealEstateValue = event;
  }

  //Direct debit OnChange Event
  onChangeCreditorSchemeID(event: string) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].creditorSchemeID = event;
    this.directDebitDetails.creditorSchemeID = event;
    if (event == "") {
      this.CreditorSchemeIDTextBoxconfig.externalError = true;
    }
  }

  onChangeClaimDateDeviationFromDueDate(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.creditProviderListData.directDebitConfigList[index].claimDateDeviationFromDueDate = parseInt(event);
      this.directDebitDetails.claimDateDeviationFromDueDate = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.directDebitConfigList[index].claimDateDeviationFromDueDate = null;
          this.directDebitDetails.claimDateDeviationFromDueDate = null;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.directDebitConfigList[index].claimDateDeviationFromDueDate = null;
      this.directDebitDetails.claimDateDeviationFromDueDate = null;
    }
  }

  onChangedDaysBeforeDueDate(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.creditProviderListData.directDebitConfigList[index].daysBeforeDueDate = parseInt(event);
      this.directDebitDetails.daysBeforeDueDate = parseInt(event);
      if (event == 0 || parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.directDebitConfigList[index].daysBeforeDueDate = null;
          this.directDebitDetails.daysBeforeDueDate = null;
          this.DaysBeforeDueDateTextBoxconfig.externalError = true;
        }, 2)
      }
    }
    if (event == null) {
      this.creditProviderListData.directDebitConfigList[index].daysBeforeDueDate = null;
      this.directDebitDetails.daysBeforeDueDate = null;
      this.DaysBeforeDueDateTextBoxconfig.externalError = true;
    }

  }

  onChangeUseBusinessDaysForClaimDateCalculation(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].useBusinessDaysForClaimDateCalculation = event;
    this.directDebitDetails.useBusinessDaysForClaimDateCalculation = event;
    if (this.directDebitDetails.useBusinessDaysForClaimDateCalculation)
      this.useBusinessday = true;
    else {
      this.useBusinessday = false;
      this.creditProviderListData.directDebitConfigList[index].useNextBusinessDayIfReferenceDateIsNotABusinessDay = false;
      this.directDebitDetails.useNextBusinessDayIfReferenceDateIsNotABusinessDay = false;
    }

    if (event == null) {
      this.UseBusinessDaysForClaimDateCalculationCheckboxConfig.externalError = true;
    }
  }

  onChangeUseNextBusinessDaysIfNotBusinessDay(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (this.useBusinessday) {
      this.creditProviderListData.directDebitConfigList[index].useNextBusinessDayIfReferenceDateIsNotABusinessDay = event;
      this.directDebitDetails.useNextBusinessDayIfReferenceDateIsNotABusinessDay = event;
    }
    if (event == null) {
      this.UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig.externalError = true;
    }
  }

  onChangeDaysOnResend(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null && event != "0") {
      this.creditProviderListData.directDebitConfigList[index].daysOnResend = parseInt(event);
      this.directDebitDetails.daysOnResend = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.DaysOnResendTextBoxconfig.externalError = true;
      }
    }
    else {
      if (event == "0") {
        this.DaysOnResendTextBoxconfig.externalError = true;
      }
      else {
        this.creditProviderListData.directDebitConfigList[index].daysOnResend = null;
        this.directDebitDetails.daysOnResend = null;
        this.DaysOnResendTextBoxconfig.externalError = true;
      }
    }
  }

  onChangeDaysLimitOnResend(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != "") {
      this.creditProviderListData.directDebitConfigList[index].daysLimitOnResend = parseInt(event);
      this.directDebitDetails.daysLimitOnResend = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.DaysLimitOnResendTextBoxconfig.externalError = true;
      }
    }
    else {
      this.creditProviderListData.directDebitConfigList[index].daysLimitOnResend = null;
      this.directDebitDetails.daysLimitOnResend = null;
      this.DaysLimitOnResendTextBoxconfig.externalError = true;
    }
  }

  onChangeDueInInstallmentCalculationMethod(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].dueInInstallmentCalculationMethod = event?.value;
    this.directDebitDetails.dueInInstallmentCalculationMethod = event?.value;
    if (event?.value?.codeId == 2) {
      this.IsIncludeDueWithinMax = false;
    }
    else {
      this.IsIncludeDueWithinMax = true;
      this.creditProviderListData.directDebitConfigList[index].includeArrearsInInstallmentCalculationMaxAmount = null as unknown as number;
      this.directDebitDetails.includeArrearsInInstallmentCalculationMaxAmount = null as unknown as number;
    }
    if (event?.value == null) {
      this.IsIncludeDueWithinMax = true;
      this.DueInInstallmentCalculationMethodDropdownConfig.externalError = true;
    }
  }

  onChangeIncludeArrearsInInstallmentCalculationMaxAmount(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.directDebitConfigList[index].includeArrearsInInstallmentCalculationMaxAmount = parseFloat(floatValue);
        this.directDebitDetails.includeArrearsInInstallmentCalculationMaxAmount = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.directDebitConfigList[index].includeArrearsInInstallmentCalculationMaxAmount = null as unknown as number;
      this.directDebitDetails.includeArrearsInInstallmentCalculationMaxAmount = null as unknown as number;
    }
  }

  onChangeBonusInInstallmentCalculationMethod(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].bonusInInstallmentCalculationMethod = event?.value;
    this.directDebitDetails.bonusInInstallmentCalculationMethod = event?.value;
    if (event.value != null) {
      if (this.directDebitDetails.bonusInInstallmentCalculationMethod.codeId == 2) {
        this.IsIncludeBonusWithinMax = false;
      }
      else {
        this.IsIncludeBonusWithinMax = true;
        this.creditProviderListData.directDebitConfigList[index].includeBonusInInstallmentCalculationMaxAmount = null as unknown as number;
        this.directDebitDetails.includeBonusInInstallmentCalculationMaxAmount = null as unknown as number;
      }
    }
    if (event?.value == null) {
      this.IsIncludeBonusWithinMax = true;
      this.BonusInInstallmentCalculationMethodDropdownConfig.externalError = true;
    }
  }

  onChangeIncludeBonusInInstallmentCalculationMaxAmount(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }

    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.directDebitConfigList[index].includeBonusInInstallmentCalculationMaxAmount = parseFloat(floatValue);
        this.directDebitDetails.includeBonusInInstallmentCalculationMaxAmount = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.directDebitConfigList[index].includeBonusInInstallmentCalculationMaxAmount = null as unknown as number;
      this.directDebitDetails.includeBonusInInstallmentCalculationMaxAmount = null as unknown as number;
    }
  }

  onChangeIsIOA(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isIOA = event;
    this.directDebitDetails.isIOA = event;
  }

  onChangeAggregateDirectDebitCollection(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].aggregateDirectDebitCollection = event;
    this.directDebitDetails.aggregateDirectDebitCollection = event;
    if (event == null) {
      this.AggregateDirectDebitCollectionCheckboxConfig.externalError = true;
    }
  }

  onChangeIsAssumedPaid(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isAssumedPaid = event;
    this.directDebitDetails.isAssumedPaid = event;
  }

  onChangeStopAllocationReversalsUponStornoWithCoveringBonus(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].stopAllocationReversalsUponStornoWithCoveringBonus = event;
    this.directDebitDetails.stopAllocationReversalsUponStornoWithCoveringBonus = event;
  }

  onChangeSendDirectDebitInstruction(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].sendDirectDebitInstruction = event;
    this.directDebitDetails.sendDirectDebitInstruction = event;
    if (!event) {
      this.creditProviderListData.directDebitConfigList[index].daysToProcessDDInstruction = null;
      this.directDebitDetails.daysToProcessDDInstruction = null;
    }
  }

  onChangeDaysToProcessDDInstruction(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      this.creditProviderListData.directDebitConfigList[index].daysToProcessDDInstruction = parseInt(event);
      this.directDebitDetails.daysToProcessDDInstruction = parseInt(event);
    }
    else {
      this.creditProviderListData.directDebitConfigList[index].daysToProcessDDInstruction = null;
      this.directDebitDetails.daysToProcessDDInstruction = null;
    }
  }

  onChangeIsMaxAmtPrecomputed(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isMaxAmtPrecomputed = event;
    this.directDebitDetails.isMaxAmtPrecomputed = event;
  }

  onChangeMaxAmtPrecomputed(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.directDebitConfigList[index].maxAmtPrecomputed = parseFloat(floatValue);
        this.directDebitDetails.maxAmtPrecomputed = parseFloat(floatValue);
      }
    }
    else {
      this.directDebitDetails.maxAmtPrecomputed = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.directDebitConfigList[index].maxAmtPrecomputed = 0;
        this.directDebitDetails.maxAmtPrecomputed = 0;
      }, 1)
    }
  }

  onChangeInverseIsMaxAmtPrecomputed(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isMaxAmtPrecomputed = !event;
    this.directDebitDetails.isMaxAmtPrecomputed = !event;
  }

  onChangeMaxAmtPrecomputedPercentage(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.directDebitConfigList[index].maxAmtPrecomputedPercentage = parseFloat(floatValue);
        this.directDebitDetails.maxAmtPrecomputedPercentage = parseFloat(floatValue);
      }
    }
    else {
      this.directDebitDetails.maxAmtPrecomputedPercentage = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.directDebitConfigList[index].maxAmtPrecomputedPercentage = 0;
        this.directDebitDetails.maxAmtPrecomputedPercentage = 0;
      }, 1)
    }
  }

  onChangeMaxAmtRevolving(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.directDebitConfigList[index].maxAmtRevolving = parseFloat(floatValue);
        this.directDebitDetails.maxAmtRevolving = parseFloat(floatValue);
      }
    }
    else {
      this.directDebitDetails.maxAmtRevolving = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.directDebitConfigList[index].maxAmtRevolving = 0;
        this.directDebitDetails.maxAmtRevolving = 0;
      }, 1)
    }
  }

  onChangeIsSplitEqualPrecomputed(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isSplitEqualPrecomputed = event;
    this.directDebitDetails.isSplitEqualPrecomputed = event;
  }

  onChangeInverseIsSplitEqualPrecomputed(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isSplitEqualPrecomputed = !event;
    this.directDebitDetails.isSplitEqualPrecomputed = !event;
  }

  onChangeIsSplitEqualRevolving(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isSplitEqualRevolving = event;
    this.directDebitDetails.isSplitEqualRevolving = event;
  }

  onChangeInverseIsSplitEqualRevolving(event: boolean) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    this.creditProviderListData.directDebitConfigList[index].isSplitEqualRevolving = !event;
    this.directDebitDetails.isSplitEqualRevolving = !event;
  }

  onChangeIsSelected(event: DirectDebitConfigResendDto) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    const listIndex = this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList.findIndex(x => x.reasonCode?.codeId == event.reasonCode?.codeId)
    /* this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].state = DtoState.Dirty;*/
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex] = event;
    this.directDebitDetails.directDebitConfigResendList[listIndex] = event;
  }

  onChangeSendEvent(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    const listIndex = this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList.findIndex(x => x.isEventSelected)
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].state = DtoState.Dirty;
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].directDebitEvents.state = DtoState.Dirty;
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].directDebitEvents.sendEvent = event?.value?.sendEvent;
    this.directDebitDetails.directDebitConfigResendList[listIndex].directDebitEvents.sendEvent = event?.value?.sendEvent;
    this.directDebitEventDetails.directDebitEvents.sendEvent = event?.value?.sendEvent;
    if (event?.value == null) {
      this.sendEventDropdownConfig.externalError = true;
    }
  }

  onChangeResendEvent(event: any) {
    const index = this.creditProviderListData.directDebitConfigList.findIndex(x => x.isDebitSelected);
    if (this.creditProviderListData.directDebitConfigList[index].state != DtoState.Created) {
      this.creditProviderListData.directDebitConfigList[index].state = DtoState.Dirty;
    }
    const listIndex = this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList.findIndex(x => x.reasonCode?.codeId == event.reasonCode?.codeId)
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].state = DtoState.Dirty;
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].directDebitEvents.state = DtoState.Dirty;
    this.creditProviderListData.directDebitConfigList[index].directDebitConfigResendList[listIndex].directDebitEvents.resendEvent = event?.value?.resendEvent;
    this.directDebitDetails.directDebitConfigResendList[listIndex].directDebitEvents.resendEvent = event?.value?.resendEvent;
    this.directDebitEventDetails.directDebitEvents.resendEvent = event?.value?.resendEvent;
  }

  //Collections tab onChange Event
  onChangeNrOfDaysBeforeEnfTitleExpiration(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.state = DtoState.Dirty;
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = parseInt(event);
      this.creditProviderDetails.collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = parseInt(event);
      if (event == 0 || parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = null;
          this.creditProviderDetails.collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = null;
          this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.externalError = true;
        }, 2)
      }
    }
    if (event == null) {
      this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = null;
      this.creditProviderDetails.collectionsConfiguration.nrOfDaysBeforeEnfTitleExpiration = null;
      this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.externalError = true;
    }
  }

  onChangePaymentPromiseGraceDays(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.state = DtoState.Dirty;
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.paymentPromiseGraceDays = parseInt(event);
      this.creditProviderDetails.collectionsConfiguration.paymentPromiseGraceDays = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.PaymentPromiseGraceDaysTextBoxconfig.externalError = true;
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].collectionsConfiguration.paymentPromiseGraceDays = null;
      this.creditProviderDetails.collectionsConfiguration.paymentPromiseGraceDays = null;
      this.PaymentPromiseGraceDaysTextBoxconfig.externalError = true;
    }
  }

  onChangeCheckOnServicingNoticeUponDebtorDate(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].checkOnServicingNoticeUponDebtorDate = event;
    this.creditProviderDetails.checkOnServicingNoticeUponDebtorDate = event;
    if (!event) {
      this.creditProviderListData.creditProviderSettingList[index].servicingNoticeUponDebtorNumberOfDays = null as unknown as number;
      this.creditProviderDetails.servicingNoticeUponDebtorNumberOfDays = null as unknown as number;
    }
  }

  onChangeServicingNoticeUponDebtorNumberOfDays(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].servicingNoticeUponDebtorNumberOfDays = parseInt(event);
      this.creditProviderDetails.servicingNoticeUponDebtorNumberOfDays = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].servicingNoticeUponDebtorNumberOfDays = null;
          this.creditProviderDetails.servicingNoticeUponDebtorNumberOfDays = null;
          this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.externalError = true;
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].servicingNoticeUponDebtorNumberOfDays = null;
      this.creditProviderDetails.servicingNoticeUponDebtorNumberOfDays = null;
      this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.externalError = true;
    }
  }

  onChangeIsIntermediateWriteOffAllowed(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].isIntermediateWriteOffAllowed = event;
    this.creditProviderDetails.isIntermediateWriteOffAllowed = event;
  }

  onChangeExpectedMarginCalculationMethod(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].expectedMarginCalculationMethod = event?.value;
    this.creditProviderDetails.expectedMarginCalculationMethod = event?.value;
    if (event?.value == null) {
      this.ExpectedMarginCalculationMethodDropdownConfig.externalError = true;
    }
  }

  onChangeArrearName(event: any, listIndex: number) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].state = DtoState.Dirty;
    }
    this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].arrearsConfiguration = event?.value;
    this.creditProviderDetails.creditProvider2ArrearConfiguration[listIndex].arrearsConfiguration = event?.value;
    this.creditProviderDetails.creditProvider2ArrearConfiguration[listIndex].enableArrearConfig = false;
    if (event?.value?.name == null) {
      this.ArrearNameDropdownConfig.externalError = true;
    }
  }

  onChangeCreditStatus(event: any, listIndex: number) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].state = DtoState.Dirty;
    }
    this.creditProviderListData.creditProviderSettingList[index].creditProvider2ArrearConfiguration[listIndex].creditStatus = event?.value;
    this.creditProviderDetails.creditProvider2ArrearConfiguration[listIndex].creditStatus = event?.value;
    if (event?.value?.creditStatus == null) {
      this.CreditStatusDropdownConfig.externalError = true;
    }
  }

  //Commission tab Onchange
  onChangeCommissionNotePeriodicity(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].commissionNotePeriodicity = event?.value;
    this.creditProviderDetails.commissionNotePeriodicity = event?.value;
    if (event?.value == null) {
      this.CommissionNotePeriodicityDropdownConfig.externalError = true;
    }
  }

  onChangeCommissionNoteCalendarDay(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].commissionNoteCalendarDay = event?.value?.caption;
    this.creditProviderDetails.commissionNoteCalendarDay = event?.value?.caption;
    this.creditProviderDetails.modifiedCommissionNoteCalendarDay = event?.value;
    if (event?.value == null) {
      this.CommissionNoteCalendarDayDropdownConfig.externalError = true;
    }
  }

  onChangeEnableCommissionPayments(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].enableCommissionPayments = event;
    this.creditProviderDetails.enableCommissionPayments = event;
  }

  //Validate Payments tab OnChange
  onChangeMaxAmountForConstructionDepotPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForConstructionDepotPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForConstructionDepotPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForConstructionDepotPayment = 0.000000009;
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForConstructionDepotPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForConstructionDepotPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForSubsidyPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForSubsidyPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForSubsidyPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForSubsidyPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForSubsidyPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForSubsidyPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForBonusPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForBonusPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForBonusPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForBonusPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForBonusPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForBonusPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForCostPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForCostPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForCostPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForCostPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForCostPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForCostPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForPaymentOut(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForPaymentOut = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForPaymentOut = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForPaymentOut = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForPaymentOut = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForPaymentOut = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForIntermediaryPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForIntermediaryPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForIntermediaryPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForIntermediaryPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForIntermediaryPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForIntermediaryPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForMortgageDossierPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForMortgageDossierPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForMortgageDossierPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForMortgageDossierPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForMortgageDossierPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForMortgageDossierPayment = 0;
      }, 1)
    }
  }

  onChangeMaxAmountForRunningAccountPayment(event: any, listIndex: number, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForRunningAccountPayment = parseFloat(floatValue);
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForRunningAccountPayment = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForRunningAccountPayment = 0.000000009
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[listIndex].maxAmountForRunningAccountPayment = 0;
        this.creditProviderDetails.paymentValidationSettings[listIndex].maxAmountForRunningAccountPayment = 0;
      }, 1)
    }
  }

  onChangePaymentValidatorGroupName(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].name = event?.target?.value;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].name = event?.target?.value;
    this.paymentValidatorGroupDetail.name = event?.target?.value;
    if (event?.target?.value == "") {
      this.PaymentValidatorGroupNameTextBoxconfig.externalError = true;
    }
  }

  onChangeIsForConstructionDepotPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForConstructionDepotPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForConstructionDepotPayment = event;
    this.paymentValidatorGroupDetail.isForConstructionDepotPayment = event;
  }

  onChangeIsForSubsidyPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForSubsidyPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForSubsidyPayment = event;
    this.paymentValidatorGroupDetail.isForSubsidyPayment = event;
  }

  onChangeIsForBonusRefund(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForBonusRefund = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForBonusRefund = event;
    this.paymentValidatorGroupDetail.isForBonusRefund = event;
  }

  onChangeIsForCostPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForCostPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForCostPayment = event;
    this.paymentValidatorGroupDetail.isForCostPayment = event;
  }

  onChangeIsForPaymentOut(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForPaymentOut = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForPaymentOut = event;
    this.paymentValidatorGroupDetail.isForPaymentOut = event;
  }

  onChangeIsForIntermediaryPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForIntermediaryPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForIntermediaryPayment = event;
    this.paymentValidatorGroupDetail.isForIntermediaryPayment = event;
  }

  onChangeIsForMortgageDossierPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForMortgageDossierPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForMortgageDossierPayment = event;
    this.paymentValidatorGroupDetail.isForMortgageDossierPayment = event;
  }

  onChangeIsForRunningAccountPayment(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForRunningAccountPayment = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].isForRunningAccountPayment = event;
    this.paymentValidatorGroupDetail.isForRunningAccountPayment = event;
  }

  filterDisplayNames(event: any) {
    if (event) {

      this.filterDisplayName = [];

      this.creditProviderListData.userList
        .filter(data => {
          if (data.displayName.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterDisplayName.push(data);
          }
        });
    }
  }

  changeDisplayName(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected)
    const paymentValidatorIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.findIndex(x => x.isPaymentValidatorIsSelected)

    if (event?.target?.value) {

      const name = this.creditProviderListData.userList.filter(x => {
        return x.displayName == event?.target?.value;
      })
      if (name[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].name = name[0];
        this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].name = name[0];
        this.paymentValidatorGroupDetail.paymentValidators[paymentValidatorIndex].name = name[0];
        this.paymentValidatorsDetail.name = name[0];

        if (this.paymentValidatorsDetail.email == undefined) {
          this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].email = name[0].email;
          this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].email = name[0].email;
          this.paymentValidatorGroupDetail.paymentValidators[paymentValidatorIndex].email = name[0].email;
          this.paymentValidatorsDetail.email = name[0].email;
        }
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].name = null;
      this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].name = null;
      this.paymentValidatorGroupDetail.paymentValidators[paymentValidatorIndex].name = null;
      this.paymentValidatorsDetail.name = null;
      this.ValidatorAutoCompleteConfig.externalError = true;
    }
  }

  onChangeEmail(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const paymentGroupIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups.findIndex(x => x.isPaymentValidatorGroupSelected);
    const paymentValidatorIndex = this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators.findIndex(x => x.isPaymentValidatorIsSelected)

    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].email = event;
    this.creditProviderDetails.paymentValidationSettings[0].paymentValidatorGroups[paymentGroupIndex].paymentValidators[paymentValidatorIndex].email = event;
    this.paymentValidatorGroupDetail.paymentValidators[paymentValidatorIndex].email = event;
    this.paymentValidatorsDetail.email = event;
    if (event == "" && this.paymentValidatorsDetail.name != null as unknown as UserDto && this.paymentValidatorsDetail.name != undefined) {
      this.EmailTextBoxconfig.externalError = true;
    }
  }

  //trusted Account tab OnChange
  onChangeTrustedDomesticAccountName(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => x.isTrustedDomesticAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state = DtoState.Dirty;
    }
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].name = event?.target?.value;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].name = event?.target?.value;
      this.trustedDomesticAccountDetail.name = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].name = null;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].name = null;
      this.trustedDomesticAccountDetail.name = null;
      this.TrustedDomesticAccountNameTextBoxconfig.externalError = true;
    }
  }

  onChangeTrustedPayeeReference(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => x.isTrustedDomesticAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state = DtoState.Dirty;
    }
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].payeeReference = event?.target?.value;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].payeeReference = event?.target?.value;
      this.trustedDomesticAccountDetail.payeeReference = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].payeeReference = null;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].payeeReference = null;
      this.trustedDomesticAccountDetail.payeeReference = null;
    }
  }

  onChangeTrustedDomesticAccountNr(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => x.isTrustedDomesticAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state = DtoState.Dirty;
    }
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].domesticAccount = event?.target?.value;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].domesticAccount = event?.target?.value;
      this.trustedDomesticAccountDetail.domesticAccount = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].domesticAccount = null;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].domesticAccount = null;
      this.trustedDomesticAccountDetail.domesticAccount = null;
      this.TrustedDomesticAccountNrTextBoxconfig.externalError = true;
    }
  }

  onChangeTrustedDomesticSortCode(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts.findIndex(x => x.isTrustedDomesticAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].state = DtoState.Dirty;
    }
    if (event) {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].sortCode = event;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].sortCode = event;
      this.trustedDomesticAccountDetail.sortCode = event;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedDomesticAccounts[listIndex].sortCode = null;
      this.creditProviderDetails.trustedDomesticAccounts[listIndex].sortCode = null;
      this.trustedDomesticAccountDetail.sortCode = null;
      this.TrustedDomesticSortCodeTextBoxconfig.externalError = true;
    }
  }

  //Trusted IBAN Account Onchange

  onChangeTrustedFilterIBAN(event: any) {
    if (event?.target?.value) {
      const value = event?.target?.value.replace(/\s/g, '');
      this.filterTrustedIBanAccount.ibanAccount = value
    }
    else {
      this.filterTrustedIBanAccount.ibanAccount = null as unknown as string
    }
  }

  onChangeTrustedIBANAccountName(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].name = event?.target?.value;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].name = event?.target?.value;
      this.trustedIbanAccountDetail.name = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].name = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].name = null;
      this.trustedIbanAccountDetail.name = null;
      this.TrustedIBANAccountNameTextBoxconfig.externalError = true;
    }
  }

  onChangeTrustedIBANPayeeReference(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].payeeReference = event?.target?.value;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].payeeReference = event?.target?.value;
      this.trustedIbanAccountDetail.payeeReference = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].payeeReference = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].payeeReference = null;
      this.trustedIbanAccountDetail.payeeReference = null;
    }
  }

  onChangeTrustedibanAccount(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event?.target?.value) {
      const value = event?.target?.value.replace(/\s/g, '');
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].ibanAccount = value;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].ibanAccount = value;
      this.trustedIbanAccountDetail.ibanAccount = value;
      this.trustedIbanAccountDetail.modifiedIbanAccount = this.ibanPipe.transform(value);
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].ibanAccount = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].ibanAccount = null;
      this.trustedIbanAccountDetail.ibanAccount = null;
      this.trustedIbanAccountDetail.modifiedIbanAccount = null;
      this.TrustedibanAccountTextBoxconfig.externalError = true;
    }
  }

  onChangetrustedbicCode(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event.target.value) {

      const name = this.BICCodeList.filter(x => {
        return x == event?.target?.value;
      })
      if (name[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].bicCode = name[0];
        this.creditProviderDetails.trustedIBANAccounts[listIndex].bicCode = name[0];
        this.trustedIbanAccountDetail.bicCode = name[0];
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].bicCode = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].bicCode = null;
      this.trustedIbanAccountDetail.bicCode = null;
      this.TrustedIBANbicCodeAutoCompleteConfig.externalError = true;
    }
  }


  filterCountries(event: any) {
    if (event) {
      this.filterCountry = [];

      this.countryList
        .filter(data => {
          if (data.caption.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterCountry.push(data);
          }
        });
    }
  }

  onChangetrustedcountry(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event.target.value) {

      const name = this.filterCountry.filter(x => {
        return x.caption == event?.target?.value;
      })
      if (name[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].country = name[0];
        this.creditProviderDetails.trustedIBANAccounts[listIndex].country = name[0];
        this.trustedIbanAccountDetail.country = name[0];
        if (this.trustedIbanAccountDetail.country?.codeId == 21 || this.trustedIbanAccountDetail.country?.codeId == 161) {
          this.trustedIbanAccountDetail.postalCode = null;
          this.trustedIbanAccountDetail.isEnableCity = false;
          this.TrustedpostalCodeTextBoxconfig.externalError = false;
          setTimeout(() => {
            this.trustedIbanAccountDetail.isEnablePostalCodeAutoComplete = true;
          }, 1)
        }
        else {
          this.trustedIbanAccountDetail.isEnableCity = true;
          this.TrustedpostalCodeAutoCompleteConfig.externalError = false;
          setTimeout(() => {
            this.trustedIbanAccountDetail.isEnablePostalCodeAutoComplete = false;
          }, 1)
        }
        if (this.trustedIbanAccountDetail.country?.codeId == 161) {
          this.trustedIbanAccountDetail.isEnableStreet = false;
        }
        else {
          this.trustedIbanAccountDetail.isEnableStreet = true;
        }
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].country = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].country = null;
      this.trustedIbanAccountDetail.country = null;
      this.trustedIbanAccountDetail.isEnableCity = true;
      this.trustedIbanAccountDetail.isEnableStreet = true;
      this.trustedIbanAccountDetail.isEnablePostalCodeAutoComplete = false;
      this.TrustedcountryAutoCompleteConfig.externalError = true;
    }
  }

  filterTrustedPostalCodes(event: any) {
    if (event) {

      if (this.trustedIbanAccountDetail.country == null || this.trustedIbanAccountDetail.country == undefined || (this.trustedIbanAccountDetail.country?.codeId != 21 && this.trustedIbanAccountDetail.country?.codeId != 161)) {
        return;
      }

      this.searchPostalCode.country = this.trustedIbanAccountDetail.country as CountryDto;
      this.searchPostalCode.postalCode = event?.query;
      if (event?.query > 9) {
        this.spinnerService.setIsLoading(true);
        this.service.searchPostalCodeCity(this.searchPostalCode).subscribe(res => {
          this.filterTrustedPostalCode = [];
          this.spinnerService.setIsLoading(false);
          this.postalCodeSearchData = res as PostalCodeCityDto[];
          this.postalCodeSearchData
            .forEach(data => {
              if (data.caption.toLowerCase().startsWith(event?.query.toLowerCase())) {
                this.filterTrustedPostalCode.push(data.caption);
              }
            });
        }, err => {
          this.spinnerService.setIsLoading(false);
        });
      }
    }
  }

  onChangetrustedPostalCode(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();

    if (event.target.value) {

      const name = this.postalCodeSearchData.filter(x => {
        return x.caption == event?.target?.value;

      })
      if (name[0] != null) {

        this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].postalCode = name[0].postalCode;
        this.creditProviderDetails.trustedIBANAccounts[listIndex].postalCode = name[0].postalCode;
        this.trustedIbanAccountDetail.postalCode = name[0].postalCode;

        if (this.trustedIbanAccountDetail.country?.codeId == 161 && this.postalCodeSearchData.length > 0) {
          const SearchStreetRequest: GetPostalCodeCityRequest = new GetPostalCodeCityRequest;
          SearchStreetRequest.country = this.trustedIbanAccountDetail.country;
          SearchStreetRequest.postalCode = this.trustedIbanAccountDetail.postalCode;

          this.spinnerService.setIsLoading(true);
          this.service.getPostalCodeCity(SearchStreetRequest).subscribe(res => {
            this.spinnerService.setIsLoading(false);
            this.streetSearchData = res as SearchPostalCodeCityDto;
          }, err => {
            this.spinnerService.setIsLoading(false);
          })
        }

        this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].city = name[0].city;
        this.creditProviderDetails.trustedIBANAccounts[listIndex].city = name[0].city;
        this.trustedIbanAccountDetail.city = name[0].city;


        setTimeout(() => {
          if (this.streetSearchData?.streetNameList?.length == 1) {
            this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].street = this.streetSearchData.streetNameList[0];
            this.creditProviderDetails.trustedIBANAccounts[listIndex].street = this.streetSearchData.streetNameList[0];
            this.trustedIbanAccountDetail.street = this.streetSearchData.streetNameList[0];
            this.trustedIbanAccountDetail.isEnableStreet = false;
            this.trustedIbanAccountDetail.isEnableStreetAutoComplete = false;
          }
          else if (this.streetSearchData?.streetNameList?.length > 1) {
            this.trustedIbanAccountDetail.isEnableStreetAutoComplete = true;
          }
          else {
            this.trustedIbanAccountDetail.isEnableStreet = true;
          }
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].postalCode = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].postalCode = null;
      this.trustedIbanAccountDetail.postalCode = null;
      this.TrustedpostalCodeAutoCompleteConfig.externalError = true;
    }
  }

  onChangeibanPostalCode(event: string) {

    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event != "") {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].postalCode = event;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].postalCode = event;
      this.trustedIbanAccountDetail.postalCode = event;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].postalCode = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].postalCode = null;
      this.trustedIbanAccountDetail.postalCode = null;
      this.TrustedpostalCodeTextBoxconfig.externalError = true;
    }
  }

  onChangeTrustedCity(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event != "") {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].city = event;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].city = event;
      this.trustedIbanAccountDetail.city = event;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].city = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].city = null;
      this.trustedIbanAccountDetail.city = null;
      this.TrustedcityTextBoxconfig.externalError = true;
    }
  }

  filterTrustedStreets(event: any) {
    if (event) {
      this.filterTrustedStreet = [];

      this.streetSearchData.streetNameList
        .filter(data => {
          if (data.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterTrustedStreet.push(data);
          }
        });
    }
  }

  onChangetrustedStreet(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event.target.value) {

      const name = this.streetSearchData.streetNameList.filter(x => {
        return x == event?.target?.value;
      })
      if (name[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].street = name[0];
        this.creditProviderDetails.trustedIBANAccounts[listIndex].street = name[0];
        this.trustedIbanAccountDetail.street = name[0];
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].street = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].street = null;
      this.trustedIbanAccountDetail.street = null;

    }
  }

  onChangeibanStreet(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event != "") {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].street = event;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].street = event;
      this.trustedIbanAccountDetail.street = event;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].street = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].street = null;
      this.trustedIbanAccountDetail.street = null;
      this.TrustedstreetTextBoxconfig.externalError = true;
    }
  }

  onChangeHouseNr(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    if (event?.target?.value != "") {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].houseNr = event?.target?.value;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].houseNr = event?.target?.value;
      this.trustedIbanAccountDetail.houseNr = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].houseNr = null;
      this.creditProviderDetails.trustedIBANAccounts[listIndex].houseNr = null;
      this.trustedIbanAccountDetail.houseNr = null;
      this.TrustedhouseNrTextBoxconfig.externalError = true;
    }

  }

  onChangeTrustedhouseNumberSuffix(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].houseNumberSuffix = event;
    this.creditProviderDetails.trustedIBANAccounts[listIndex].houseNumberSuffix = event;
    this.trustedIbanAccountDetail.houseNumberSuffix = event;
  }

  onChangeTrustedbox(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts.findIndex(x => x.isTrustedIBANAccountSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].trustedIBANAccounts[listIndex].box = event;
    this.creditProviderDetails.trustedIBANAccounts[listIndex].box = event;
    this.trustedIbanAccountDetail.box = event;
  }

  //Banned Account tab OnChange

  onChangeBannedFilterIBAN(event: any) {
    if (event?.target?.value) {
      const value = event?.target?.value.replace(/\s/g, '');
      this.filterBanned.ibanAccount = value
    }
    else {
      this.filterBanned.ibanAccount = null as unknown as string
    }
  }
  onChangeBannedAccountName(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    if (event?.target?.value) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].name = event?.target?.value;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].name = event?.target?.value;
      this.bannedAccountDetail.name = event?.target?.value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].name = null;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].name = null;
      this.bannedAccountDetail.name = null;
      this.BannedAccountNameTextBoxconfig.externalError = true;
    }
  }

  onChangeBannedibanAccount(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    if (event?.target?.value) {
      const value = event?.target?.value.replace(/\s/g, '');
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].ibanAccount = value;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].ibanAccount = value;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].modifiedIban = this.ibanPipe.transform(value);
      this.bannedAccountDetail.ibanAccount = value;
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].ibanAccount = null;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].ibanAccount = null;
      this.creditProviderDetails.bannedAccountNumbers[listIndex].modifiedIban = null;
      this.bannedAccountDetail.ibanAccount = null;
      this.BannedibanAccountTextBoxconfig.externalError = true;
    }
  }

  filterBICCodes(event: any) {
    if (event) {
      this.filterBICCode = [];

      this.BICCodeList
        .filter(data => {
          if (data.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterBICCode.push(data);
          }
        });
    }
  }

  onChangeBannedbicCode(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    if (event.target.value) {

      const name = this.BICCodeList.filter(x => {
        return x == event?.target?.value;
      })
      if (name[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].bicCode = name[0];
        this.creditProviderDetails.bannedAccountNumbers[listIndex].bicCode = name[0];
        this.bannedAccountDetail.bicCode = name[0];
      }
    }
  }

  onChangeBannedStreet(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].street = event;
    this.creditProviderDetails.bannedAccountNumbers[listIndex].street = event;
    this.bannedAccountDetail.street = event;
  }

  onChangeBannedHouseNr(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].houseNr = event?.target?.value;
    this.creditProviderDetails.bannedAccountNumbers[listIndex].houseNr = event?.target?.value;
    this.bannedAccountDetail.houseNr = event?.target?.value;
    if (event?.target?.value == "") {
      setTimeout(() => {
        this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].houseNr = 0;
        this.creditProviderDetails.bannedAccountNumbers[listIndex].houseNr = 0;
        this.bannedAccountDetail.houseNr = 0;
      }, 2)
    }
  }

  filterPostalCodes(event: any) {
    if (event) {
      this.filterPostalCode = [];

      this.getReferenceData.postalCodeCityList
        .filter(data => {
          if (data.city.toLowerCase().startsWith(event?.query.toLowerCase()) || data.postalCode.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterPostalCode.push(data.caption);
          }
        });
    }
  }

  onChangeBannedpostalCode(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    if (event.target.value) {

      const code = this.getReferenceData.postalCodeCityList.filter(x => {
        return x.caption == event?.target?.value;
      })
      if (code[0] != null) {
        this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].postalCode = code[0].postalCode;
        this.creditProviderDetails.bannedAccountNumbers[listIndex].postalCode = code[0].postalCode;
        this.bannedAccountDetail.postalCode = code[0].postalCode;

        this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].city = code[0].city;
        this.creditProviderDetails.bannedAccountNumbers[listIndex].city = code[0].city;
        this.bannedAccountDetail.city = code[0].city;
      }
    }
  }

  onChangeBannedCity(event: string) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers.findIndex(x => x.isBannedAccountSelected);
    this.settingCreditStateDirty();
    if (this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state != DtoState.Created) {
      this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].state = DtoState.Dirty
    }
    this.creditProviderListData.creditProviderSettingList[index].bannedAccountNumbers[listIndex].city = event;
    this.creditProviderDetails.bannedAccountNumbers[listIndex].city = event;
    this.bannedAccountDetail.city = event;
  }

  //Mutation Cost tab OnChange

  onChangeDefaultingMutationCosts(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].defaultingMutationCosts = event?.value;
    this.creditProviderDetails.defaultingMutationCosts = event?.value;
  }

  onChangeChargeMutationCostOncePerMutationType(event: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    this.creditProviderListData.creditProviderSettingList[index].chargeMutationCostOncePerMutationType = event;
    this.creditProviderDetails.chargeMutationCostOncePerMutationType = event;
    if (event == null && event == undefined) {
      this.ChargeMutationCostOncePerMutationTypeCheckboxConfig.externalError = true;
    }
  }

  onChangeMaxTotalMutationCostPerCredit(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();

    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].maxTotalMutationCostPerCredit = parseFloat(floatValue);
        this.creditProviderDetails.maxTotalMutationCostPerCredit = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].maxTotalMutationCostPerCredit = null as unknown as number;
      this.creditProviderDetails.maxTotalMutationCostPerCredit = null as unknown as number;
    }
  }

  onChangeMaxTotalMutationCostPerDossierMutation(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].maxTotalMutationCostPerDossierMutation = parseFloat(floatValue);
        this.creditProviderDetails.maxTotalMutationCostPerDossierMutation = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].maxTotalMutationCostPerDossierMutation = null as unknown as number;
      this.creditProviderDetails.maxTotalMutationCostPerDossierMutation = null as unknown as number;
    }
  }

  //actualization tab onChange
  onChangeMinDurationInMonths(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.findIndex(x => x.isActualizationSelected)
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].minDurationInMonths = parseInt(event);
      this.creditProviderDetails.actualizationConfigs[listIndex].minDurationInMonths = parseInt(event);
      this.percentageOfLimitDetail.minDurationInMonths = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MinDurationInMonthsTextBoxConfig.externalError = true;
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].minDurationInMonths = null;
      this.creditProviderDetails.actualizationConfigs[listIndex].minDurationInMonths = null;
      this.percentageOfLimitDetail.minDurationInMonths = null;
      this.MinDurationInMonthsTextBoxConfig.externalError = true;
    }
  }

  onChangeMaxDurationInMonths(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.findIndex(x => x.isActualizationSelected)
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].maxDurationInMonths = parseInt(event);
      this.creditProviderDetails.actualizationConfigs[listIndex].maxDurationInMonths = parseInt(event);
      this.percentageOfLimitDetail.maxDurationInMonths = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MaxDurationInMonthsTextBoxConfig.externalError = true;
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].maxDurationInMonths = null;
      this.creditProviderDetails.actualizationConfigs[listIndex].maxDurationInMonths = null;
      this.percentageOfLimitDetail.maxDurationInMonths = null;
      this.MaxDurationInMonthsTextBoxConfig.externalError = true;
    }
  }

  onChangePercentageOfLimitThreshold(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    const listIndex = this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs.findIndex(x => x.isActualizationSelected)

    if (event != null) {
      if (!isChanged) {
        if (event != "0,00") {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].percentageOfLimitThreshold = parseFloat(floatValue);
          this.creditProviderDetails.actualizationConfigs[listIndex].percentageOfLimitThreshold = parseFloat(floatValue);
        }
        else {
          this.creditProviderDetails.actualizationConfigs[listIndex].percentageOfLimitThreshold = event;
          this.PercentageOfLimitThresholdTextBoxConfig.externalError = true;
        }
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationConfigs[listIndex].percentageOfLimitThreshold = null as unknown as number;
      this.creditProviderDetails.actualizationConfigs[listIndex].percentageOfLimitThreshold = null as unknown as number;
      this.percentageOfLimitDetail.percentageOfLimitThreshold = null as unknown as number;
      this.PercentageOfLimitThresholdTextBoxConfig.externalError = true;
    }
  }

  onChangeActualizationThresholdForOutstanding(event: any, isChanged: boolean) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.creditProviderListData.creditProviderSettingList[index].actualizationThresholdForOutstanding = parseFloat(floatValue);
        this.creditProviderDetails.actualizationThresholdForOutstanding = parseFloat(floatValue);
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationThresholdForOutstanding = null as unknown as number;
      this.creditProviderDetails.actualizationThresholdForOutstanding = null as unknown as number;
      if (this.creditProviderDetails.actualizationFrequencyForOutstanding != null && this.creditProviderDetails.actualizationFrequencyForOutstanding != undefined) {
        this.ActualizationThresholdForOutstandingTextBoxconfig.externalError = true;
      }
    }
  }

  onChangeActualizationFrequencyForOutstanding(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForOutstanding = parseInt(event);
      this.creditProviderDetails.actualizationFrequencyForOutstanding = parseInt(event);
      this.ActualizationFrequencyForOutstandingTextBoxconfig.externalError = false;
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForOutstanding = null;
          this.creditProviderDetails.actualizationFrequencyForOutstanding = null;
          if (this.creditProviderDetails.actualizationThresholdForOutstanding != null && this.creditProviderDetails.actualizationThresholdForOutstanding != undefined) {
            this.ActualizationFrequencyForOutstandingTextBoxconfig.externalError = true;
          }
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForOutstanding = null;
      this.creditProviderDetails.actualizationFrequencyForOutstanding = null;
      if (this.creditProviderDetails.actualizationThresholdForOutstanding != null && this.creditProviderDetails.actualizationThresholdForOutstanding != undefined) {
        this.ActualizationFrequencyForOutstandingTextBoxconfig.externalError = true;
      }
    }
  }

  onChangeActualizationThresholdForRemainingDuration(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].actualizationThresholdForRemainingDuration = parseInt(event);
      this.creditProviderDetails.actualizationThresholdForRemainingDuration = parseInt(event);
      this.ActualizationThresholdForRemainingDurationTextBoxconfig.externalError = false;
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].actualizationThresholdForRemainingDuration = null;
          this.creditProviderDetails.actualizationThresholdForRemainingDuration = null;
          if (this.creditProviderDetails.actualizationFrequencyForRemainingDuration != null && this.creditProviderDetails.actualizationFrequencyForRemainingDuration != undefined) {
            this.ActualizationThresholdForRemainingDurationTextBoxconfig.externalError = true;
          }
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationThresholdForRemainingDuration = null;
      this.creditProviderDetails.actualizationThresholdForRemainingDuration = null;
      if (this.creditProviderDetails.actualizationFrequencyForRemainingDuration != null && this.creditProviderDetails.actualizationFrequencyForRemainingDuration != undefined) {
        this.ActualizationThresholdForRemainingDurationTextBoxconfig.externalError = true;
      }
    }
  }

  onChangeActualizationFrequencyForRemainingDuration(event: any) {
    const index = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.isCreditSelected);
    this.settingCreditStateDirty();
    if (event != null) {
      this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForRemainingDuration = parseInt(event);
      this.creditProviderDetails.actualizationFrequencyForRemainingDuration = parseInt(event);
      this.ActualizationFrequencyForRemainingDurationTextBoxconfig.externalError = false;
      if (parseInt(event) > this.intMaxValue) {
        setTimeout(() => {
          this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForRemainingDuration = null;
          this.creditProviderDetails.actualizationFrequencyForRemainingDuration = null;
          if (this.creditProviderDetails.actualizationThresholdForRemainingDuration != null && this.creditProviderDetails.actualizationThresholdForRemainingDuration != undefined) {
            this.ActualizationFrequencyForRemainingDurationTextBoxconfig.externalError = true;
          }
        }, 1)
      }
    }
    else {
      this.creditProviderListData.creditProviderSettingList[index].actualizationFrequencyForRemainingDuration = null;
      this.creditProviderDetails.actualizationFrequencyForRemainingDuration = null;
      if (this.creditProviderDetails.actualizationThresholdForRemainingDuration != null && this.creditProviderDetails.actualizationThresholdForRemainingDuration != undefined) {
        this.ActualizationFrequencyForRemainingDurationTextBoxconfig.externalError = true;
      }
    }

  }

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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const creditUpdated = this.creditProviderListData.creditProviderSettingList.findIndex(x => x.state == DtoState.Dirty);
    const debitUpdated = this.creditProviderListData.directDebitConfigList.findIndex(x => x.state == DtoState.Dirty);
    if (creditUpdated != -1 || debitUpdated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(creditProviderList: GetCreditProviderSettingsDto) {
    this.showDialog = false;
    this.onSave(creditProviderList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.showDialog = false;
    this.settingExternalErrorFalse();
    this.RemoveIBANErrors();
    window.location.assign(this.navigateUrl);
  }

  onClickCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const minDueDatesForTaskError = new ErrorDto;
    minDueDatesForTaskError.validation = "required";
    minDueDatesForTaskError.isModelError = true;
    minDueDatesForTaskError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinDueDateForTask');
    this.MinDueDatesForTaskTextBoxConfig.required = true;
    this.MinDueDatesForTaskTextBoxConfig.Errors = [minDueDatesForTaskError];

    const minDueDatesForUrgentTaskError = new ErrorDto;
    minDueDatesForUrgentTaskError.validation = "required";
    minDueDatesForUrgentTaskError.isModelError = true;
    minDueDatesForUrgentTaskError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinDueDateForUrgentTask');
    this.MinDueDatesForUrgentTaskTextBoxConfig.required = true;
    this.MinDueDatesForUrgentTaskTextBoxConfig.Errors = [minDueDatesForUrgentTaskError];

    const minAmountForBonusTaskForRevolvingError = new ErrorDto;
    minAmountForBonusTaskForRevolvingError.validation = "required";
    minAmountForBonusTaskForRevolvingError.isModelError = true;
    minAmountForBonusTaskForRevolvingError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinAmountForTaskRevolvong');
    this.MinAmountForBonusTaskForRevolvingTextBoxConfig.required = true;
    this.MinAmountForBonusTaskForRevolvingTextBoxConfig.Errors = [minAmountForBonusTaskForRevolvingError];

    const minBonusThresholdforRefundError = new ErrorDto;
    minBonusThresholdforRefundError.validation = "required";
    minBonusThresholdforRefundError.isModelError = true;
    minBonusThresholdforRefundError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinBonusThreshold');
    this.MinBonusThresholdforRefundTextBoxConfig.required = true;
    this.MinBonusThresholdforRefundTextBoxConfig.Errors = [minBonusThresholdforRefundError];

    const minDueThresholdforRemiseError = new ErrorDto;
    minDueThresholdforRemiseError.validation = "required";
    minDueThresholdforRemiseError.isModelError = true;
    minDueThresholdforRemiseError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinDueThreshold');
    this.MinDueThresholdforRemiseTextBoxConfig.required = true;
    this.MinDueThresholdforRemiseTextBoxConfig.Errors = [minDueThresholdforRemiseError];
    this.MinDueThresholdforRemiseTextBoxConfig.invalidDefaultValidation = this.translate.instant('app-instance.credit-provider.validations.MinDueThreshold');

    const minDueElapsedPeriodforRemiseError = new ErrorDto;
    minDueElapsedPeriodforRemiseError.validation = "required";
    minDueElapsedPeriodforRemiseError.isModelError = true;
    minDueElapsedPeriodforRemiseError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinelapsedPeriod');
    this.MinDueElapsedPeriodforRemiseTextBoxConfig.required = true;
    this.MinDueElapsedPeriodforRemiseTextBoxConfig.Errors = [minDueElapsedPeriodforRemiseError];

    const bonusRefundReceiverTypeError = new ErrorDto;
    bonusRefundReceiverTypeError.validation = "required";
    bonusRefundReceiverTypeError.isModelError = true;
    bonusRefundReceiverTypeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.RefundBonus');
    this.BonusRefundReceiverTypeDropdownConfig.required = true;
    this.BonusRefundReceiverTypeDropdownConfig.Errors = [bonusRefundReceiverTypeError];

    const minRemainingValueAfterPrepaymentError = new ErrorDto;
    minRemainingValueAfterPrepaymentError.validation = "required";
    minRemainingValueAfterPrepaymentError.isModelError = true;
    minRemainingValueAfterPrepaymentError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MaxDueAfterPrep');
    this.MinRemainingValueAfterPrepaymentTextBoxconfig.required = true;
    this.MinRemainingValueAfterPrepaymentTextBoxconfig.Errors = [minRemainingValueAfterPrepaymentError];
    this.MinRemainingValueAfterPrepaymentTextBoxconfig.invalidDefaultValidation = this.translate.instant('app-instance.credit-provider.validations.MaxDueAfterPrep');

    const nrOfDaysAdvancedNoticeError = new ErrorDto;
    nrOfDaysAdvancedNoticeError.validation = "required";
    nrOfDaysAdvancedNoticeError.isModelError = true;
    nrOfDaysAdvancedNoticeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.NrOfDaysAdvanced');
    this.NrOfDaysAdvancedNoticeTextBoxconfig.required = true;
    this.NrOfDaysAdvancedNoticeTextBoxconfig.Errors = [nrOfDaysAdvancedNoticeError];

    const nrOfDaysForIsRegularCalculationBaseError = new ErrorDto;
    nrOfDaysForIsRegularCalculationBaseError.validation = "required";
    nrOfDaysForIsRegularCalculationBaseError.isModelError = true;
    nrOfDaysForIsRegularCalculationBaseError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.NrOfDaysForCredit');
    this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.required = true;
    this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.Errors = [nrOfDaysForIsRegularCalculationBaseError];

    const extendRevisionPeriodsWithinLimitError = new ErrorDto;
    extendRevisionPeriodsWithinLimitError.validation = "required";
    extendRevisionPeriodsWithinLimitError.isModelError = true;
    extendRevisionPeriodsWithinLimitError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ExtendRevision');
    this.ExtendRevisionPeriodsWithinLimitCheckboxConfig.required = true;
    this.ExtendRevisionPeriodsWithinLimitCheckboxConfig.Errors = [extendRevisionPeriodsWithinLimitError];


    const commissionNotePeriodicityError = new ErrorDto;
    commissionNotePeriodicityError.validation = "required";
    commissionNotePeriodicityError.isModelError = true;
    commissionNotePeriodicityError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Periodicity');
    this.CommissionNotePeriodicityDropdownConfig.required = true;
    this.CommissionNotePeriodicityDropdownConfig.Errors = [commissionNotePeriodicityError];

    const commissionNoteCalendarDayError = new ErrorDto;
    commissionNoteCalendarDayError.validation = "required";
    commissionNoteCalendarDayError.isModelError = true;
    commissionNoteCalendarDayError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.CalendarDay');
    this.CommissionNoteCalendarDayDropdownConfig.required = true;
    this.CommissionNoteCalendarDayDropdownConfig.Errors = [commissionNoteCalendarDayError];

    const expectedMarginCalculationMethodError = new ErrorDto;
    expectedMarginCalculationMethodError.validation = "required";
    expectedMarginCalculationMethodError.isModelError = true;
    expectedMarginCalculationMethodError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ExpectedMargin');
    this.ExpectedMarginCalculationMethodDropdownConfig.required = true;
    this.ExpectedMarginCalculationMethodDropdownConfig.Errors = [expectedMarginCalculationMethodError];

    const servicingNoticeUponDebtorNumberOfDaysError = new ErrorDto;
    servicingNoticeUponDebtorNumberOfDaysError.validation = "required";
    servicingNoticeUponDebtorNumberOfDaysError.isModelError = true;
    servicingNoticeUponDebtorNumberOfDaysError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ServicingNotice');
    this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.required = true;
    this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.Errors = [servicingNoticeUponDebtorNumberOfDaysError];

    const paymentPromiseGraceDaysError = new ErrorDto;
    paymentPromiseGraceDaysError.validation = "required";
    paymentPromiseGraceDaysError.isModelError = true;
    paymentPromiseGraceDaysError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.GraceDays');
    this.PaymentPromiseGraceDaysTextBoxconfig.required = true;
    this.PaymentPromiseGraceDaysTextBoxconfig.Errors = [paymentPromiseGraceDaysError];
    this.PaymentPromiseGraceDaysTextBoxconfig.maxValueValidation = this.translate.instant('app-instance.credit-provider.validations.InputIncorrect');

    const nrOfDaysBeforeEnfTitleExpirationError = new ErrorDto;
    nrOfDaysBeforeEnfTitleExpirationError.validation = "required";
    nrOfDaysBeforeEnfTitleExpirationError.isModelError = true;
    nrOfDaysBeforeEnfTitleExpirationError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.NotifyBeforeExpiration');
    this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.required = true;
    this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.Errors = [nrOfDaysBeforeEnfTitleExpirationError];

    const chargeMutationCostOncePerMutationTypeError = new ErrorDto;
    chargeMutationCostOncePerMutationTypeError.validation = "required";
    chargeMutationCostOncePerMutationTypeError.isModelError = true;
    chargeMutationCostOncePerMutationTypeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ChargeMutationCost');
    this.ChargeMutationCostOncePerMutationTypeCheckboxConfig.required = true;
    this.ChargeMutationCostOncePerMutationTypeCheckboxConfig.Errors = [chargeMutationCostOncePerMutationTypeError];

    const minDurationInMonthsError = new ErrorDto;
    minDurationInMonthsError.validation = "required";
    minDurationInMonthsError.isModelError = true;
    minDurationInMonthsError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MinDurationInMonths');
    this.MinDurationInMonthsTextBoxConfig.required = true;
    this.MinDurationInMonthsTextBoxConfig.Errors = [minDurationInMonthsError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('app-instance.credit-provider.validations.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.MinDurationInMonthsTextBoxConfig.maxValueValidation = this.translate.instant('app-instance.credit-provider.validations.InputIncorrect');


    const maxDurationInMonthsError = new ErrorDto;
    maxDurationInMonthsError.validation = "required";
    maxDurationInMonthsError.isModelError = true;
    maxDurationInMonthsError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.MaxDurationInMonths');
    this.MaxDurationInMonthsTextBoxConfig.required = true;
    this.MaxDurationInMonthsTextBoxConfig.Errors = [maxDurationInMonthsError];
    this.MaxDurationInMonthsTextBoxConfig.maxValueValidation = this.translate.instant('app-instance.credit-provider.validations.InputIncorrect');


    const percentageOfLimitThresholdError = new ErrorDto;
    percentageOfLimitThresholdError.validation = "required";
    percentageOfLimitThresholdError.isModelError = true;
    percentageOfLimitThresholdError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.PercentageOfLimit');
    this.PercentageOfLimitThresholdTextBoxConfig.required = true;
    this.PercentageOfLimitThresholdTextBoxConfig.Errors = [percentageOfLimitThresholdError];
    this.PercentageOfLimitThresholdTextBoxConfig.invalidDefaultValidation = this.translate.instant('app-instance.credit-provider.validations.PercentageOfLimit');

    const emailError = new ErrorDto;
    emailError.validation = "required";
    emailError.isModelError = true;
    emailError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Email');
    this.EmailTextBoxconfig.required = true;
    this.EmailTextBoxconfig.Errors = [emailError];

    const paymentValidatorGroupNameError = new ErrorDto;
    paymentValidatorGroupNameError.validation = "required";
    paymentValidatorGroupNameError.isModelError = true;
    paymentValidatorGroupNameError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.PaymentValidatorGroupNameTextBoxconfig.required = true;
    this.PaymentValidatorGroupNameTextBoxconfig.Errors = [paymentValidatorGroupNameError];

    const validatorError = new ErrorDto;
    validatorError.validation = "required";
    validatorError.isModelError = true;
    validatorError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.ValidatorAutoCompleteConfig.required = true;
    this.ValidatorAutoCompleteConfig.Errors = [validatorError];

    const bannedAccountNameError = new ErrorDto;
    bannedAccountNameError.validation = "required";
    bannedAccountNameError.isModelError = true;
    bannedAccountNameError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.BannedAccountNameTextBoxconfig.required = true;
    this.BannedAccountNameTextBoxconfig.Errors = [bannedAccountNameError];

    const bannedibanAccountError = new ErrorDto;
    bannedibanAccountError.validation = "required";
    bannedibanAccountError.isModelError = true;
    bannedibanAccountError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.BankAccount');
    this.BannedibanAccountTextBoxconfig.required = true;
    this.BannedibanAccountTextBoxconfig.Errors = [bannedibanAccountError];
    const invalidIBANError = new ErrorDto;
    invalidIBANError.validation = "required";
    invalidIBANError.isModelError = true;
    invalidIBANError.validationMessage = 'Invalid IBAN';
    this.invalidIBANErrorDto = [invalidIBANError];
    this.BannedibanAccountTextBoxconfig.invalidIBANValidation = 'Invalid IBAN';

    const trustedDomesticAccountNamerError = new ErrorDto;
    trustedDomesticAccountNamerError.validation = "required";
    trustedDomesticAccountNamerError.isModelError = true;
    trustedDomesticAccountNamerError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.TrustedDomesticAccountNameTextBoxconfig.required = true;
    this.TrustedDomesticAccountNameTextBoxconfig.Errors = [trustedDomesticAccountNamerError];

    const trustedDomesticAccountNrError = new ErrorDto;
    trustedDomesticAccountNrError.validation = "required";
    trustedDomesticAccountNrError.isModelError = true;
    trustedDomesticAccountNrError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.AccountNumber');
    this.TrustedDomesticAccountNrTextBoxconfig.required = true;
    this.TrustedDomesticAccountNrTextBoxconfig.Errors = [trustedDomesticAccountNrError];

    const trustedDomesticSortCodeError = new ErrorDto;
    trustedDomesticSortCodeError.validation = "required";
    trustedDomesticSortCodeError.isModelError = true;
    trustedDomesticSortCodeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.SortCode');
    this.TrustedDomesticSortCodeTextBoxconfig.required = true;
    this.TrustedDomesticSortCodeTextBoxconfig.Errors = [trustedDomesticSortCodeError];

    const aggregateDirectDebitCollectionError = new ErrorDto;
    aggregateDirectDebitCollectionError.validation = "required";
    aggregateDirectDebitCollectionError.isModelError = true;
    aggregateDirectDebitCollectionError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.AggregateDirectdebit');
    this.AggregateDirectDebitCollectionCheckboxConfig.required = true;
    this.AggregateDirectDebitCollectionCheckboxConfig.Errors = [aggregateDirectDebitCollectionError];

    const bonusInInstallmentCalculationMethodError = new ErrorDto;
    bonusInInstallmentCalculationMethodError.validation = "required";
    bonusInInstallmentCalculationMethodError.isModelError = true;
    bonusInInstallmentCalculationMethodError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.BonusInInstallment');
    this.BonusInInstallmentCalculationMethodDropdownConfig.required = true;
    this.BonusInInstallmentCalculationMethodDropdownConfig.Errors = [bonusInInstallmentCalculationMethodError];

    const DueInInstallmentCalculationMethodError = new ErrorDto;
    DueInInstallmentCalculationMethodError.validation = "required";
    DueInInstallmentCalculationMethodError.isModelError = true;
    DueInInstallmentCalculationMethodError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.DueInInstallemnt');
    this.DueInInstallmentCalculationMethodDropdownConfig.required = true;
    this.DueInInstallmentCalculationMethodDropdownConfig.Errors = [DueInInstallmentCalculationMethodError];

    const daysLimitOnResendError = new ErrorDto;
    daysLimitOnResendError.validation = "required";
    daysLimitOnResendError.isModelError = true;
    daysLimitOnResendError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.LimitDaysOnResend');
    this.DaysLimitOnResendTextBoxconfig.required = true;
    this.DaysLimitOnResendTextBoxconfig.Errors = [daysLimitOnResendError];
    this.DaysLimitOnResendTextBoxconfig.maxValueValidation = this.translate.instant('app-instance.credit-provider.validations.InputIncorrect');


    const daysOnResendError = new ErrorDto;
    daysOnResendError.validation = "required";
    daysOnResendError.isModelError = true;
    daysOnResendError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.DaysonResend');
    this.DaysOnResendTextBoxconfig.required = true;
    this.DaysOnResendTextBoxconfig.Errors = [daysOnResendError];
    this.DaysOnResendTextBoxconfig.invalidDefaultValidation = this.translate.instant('app-instance.credit-provider.validations.DaysonResend');
    this.DaysOnResendTextBoxconfig.maxValueValidation = this.translate.instant('app-instance.credit-provider.validations.InputIncorrect');

    const UseBusinessDaysForClaimDateCalculationError = new ErrorDto;
    UseBusinessDaysForClaimDateCalculationError.validation = "required";
    UseBusinessDaysForClaimDateCalculationError.isModelError = true;
    UseBusinessDaysForClaimDateCalculationError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ClaimDateCalculation');
    this.UseBusinessDaysForClaimDateCalculationCheckboxConfig.required = true;
    this.UseBusinessDaysForClaimDateCalculationCheckboxConfig.Errors = [UseBusinessDaysForClaimDateCalculationError];

    const UseNextBusinessDaysIfNotBusinessDayError = new ErrorDto;
    UseNextBusinessDaysIfNotBusinessDayError.validation = "required";
    UseNextBusinessDaysIfNotBusinessDayError.isModelError = true;
    UseNextBusinessDaysIfNotBusinessDayError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.ClaimDateCalculation');
    this.UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig.required = true;
    this.UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig.Errors = [UseNextBusinessDaysIfNotBusinessDayError];

    const daysBeforeDueDateError = new ErrorDto;
    daysBeforeDueDateError.validation = "required";
    daysBeforeDueDateError.isModelError = true;
    daysBeforeDueDateError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.DaysBeforeDueDate');
    this.DaysBeforeDueDateTextBoxconfig.required = true;
    this.DaysBeforeDueDateTextBoxconfig.Errors = [daysBeforeDueDateError];

    const creditorSchemeIDError = new ErrorDto;
    creditorSchemeIDError.validation = "required";
    creditorSchemeIDError.isModelError = true;
    creditorSchemeIDError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.CreditorSchemeID');
    this.CreditorSchemeIDTextBoxconfig.required = true;
    this.CreditorSchemeIDTextBoxconfig.Errors = [creditorSchemeIDError];

    const sendEventError = new ErrorDto;
    sendEventError.validation = "required";
    sendEventError.isModelError = true;
    sendEventError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.SendEvent');
    this.sendEventDropdownConfig.required = true;
    this.sendEventDropdownConfig.Errors = [sendEventError];

    const trustedIBANAccountNameError = new ErrorDto;
    trustedIBANAccountNameError.validation = "required";
    trustedIBANAccountNameError.isModelError = true;
    trustedIBANAccountNameError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.TrustedIBANAccountNameTextBoxconfig.required = true;
    this.TrustedIBANAccountNameTextBoxconfig.Errors = [trustedIBANAccountNameError];

    const trustedibanAccountError = new ErrorDto;
    trustedibanAccountError.validation = "required";
    trustedibanAccountError.isModelError = true;
    trustedibanAccountError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.IBANAccountNumber');
    this.TrustedibanAccountTextBoxconfig.required = true;
    this.TrustedibanAccountTextBoxconfig.Errors = [trustedibanAccountError];
    const IBANError = new ErrorDto;
    IBANError.validation = "required";
    IBANError.isModelError = true;
    IBANError.validationMessage = 'Invalid IBAN';
    this.invalidIBANErrorDto = [IBANError];
    this.TrustedibanAccountTextBoxconfig.invalidIBANValidation = 'Invalid IBAN';
    this.IBANTextBoxconfig.invalidIBANValidation = 'Invalid IBAN'

    const trustedIBANbicCodeError = new ErrorDto;
    trustedIBANbicCodeError.validation = "required";
    trustedIBANbicCodeError.isModelError = true;
    trustedIBANbicCodeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.BICCode');
    this.TrustedIBANbicCodeAutoCompleteConfig.required = true;
    this.TrustedIBANbicCodeAutoCompleteConfig.Errors = [trustedIBANbicCodeError];

    const trustedcountryError = new ErrorDto;
    trustedcountryError.validation = "required";
    trustedcountryError.isModelError = true;
    trustedcountryError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Land');
    this.TrustedcountryAutoCompleteConfig.required = true;
    this.TrustedcountryAutoCompleteConfig.Errors = [trustedcountryError];

    const trustedpostalCodeError = new ErrorDto;
    trustedpostalCodeError.validation = "required";
    trustedpostalCodeError.isModelError = true;
    trustedpostalCodeError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Postcode');
    this.TrustedpostalCodeAutoCompleteConfig.required = true;
    this.TrustedpostalCodeAutoCompleteConfig.Errors = [trustedpostalCodeError];
    this.TrustedpostalCodeTextBoxconfig.required = true;
    this.TrustedpostalCodeTextBoxconfig.Errors = [trustedpostalCodeError];

    const trustedcityError = new ErrorDto;
    trustedcityError.validation = "required";
    trustedcityError.isModelError = true;
    trustedcityError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.City');
    this.TrustedcityTextBoxconfig.required = true;
    this.TrustedcityTextBoxconfig.Errors = [trustedcityError];

    const trustedstreetError = new ErrorDto;
    trustedstreetError.validation = "required";
    trustedstreetError.isModelError = true;
    trustedstreetError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Street');
    this.TrustedstreetTextBoxconfig.required = true;
    this.TrustedstreetTextBoxconfig.Errors = [trustedstreetError];
    this.TrustedstreetAutoCompleteConfig.required = true;
    this.TrustedstreetAutoCompleteConfig.Errors = [trustedstreetError];

    const trustedhouseNrError = new ErrorDto;
    trustedhouseNrError.validation = "required";
    trustedhouseNrError.isModelError = true;
    trustedhouseNrError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.HouseNumber');
    this.TrustedhouseNrTextBoxconfig.required = true;
    this.TrustedhouseNrTextBoxconfig.Errors = [trustedhouseNrError];

    const actualizationFrequencyForOutstandingError = new ErrorDto;
    actualizationFrequencyForOutstandingError.validation = "required";
    actualizationFrequencyForOutstandingError.isModelError = false;
    actualizationFrequencyForOutstandingError.isShowValidation = true;
    actualizationFrequencyForOutstandingError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.actualizationFrequencyForOutstanding');
    this.ActualizationFrequencyForOutstandingTextBoxconfig.required = false;
    this.ActualizationFrequencyForOutstandingTextBoxconfig.Errors = [actualizationFrequencyForOutstandingError];

    const actualizationFrequencyForRemainingDurationError = new ErrorDto;
    actualizationFrequencyForRemainingDurationError.validation = "required";
    actualizationFrequencyForRemainingDurationError.isModelError = false;
    actualizationFrequencyForRemainingDurationError.isShowValidation = true;
    actualizationFrequencyForRemainingDurationError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.actualizationFrequencyForRemainingDuration');
    this.ActualizationFrequencyForRemainingDurationTextBoxconfig.required = false;
    this.ActualizationFrequencyForRemainingDurationTextBoxconfig.Errors = [actualizationFrequencyForRemainingDurationError];

    const actualizationThresholdForOutstandingError = new ErrorDto;
    actualizationThresholdForOutstandingError.validation = "required";
    actualizationThresholdForOutstandingError.isModelError = false;
    actualizationThresholdForOutstandingError.isShowValidation = true;
    actualizationThresholdForOutstandingError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.actualizationThresholdForOutstanding');
    this.ActualizationThresholdForOutstandingTextBoxconfig.required = false;
    this.ActualizationThresholdForOutstandingTextBoxconfig.Errors = [actualizationThresholdForOutstandingError];

    const actualizationThresholdForRemainingDurationError = new ErrorDto;
    actualizationThresholdForRemainingDurationError.validation = "required";
    actualizationThresholdForRemainingDurationError.isModelError = false;
    actualizationThresholdForRemainingDurationError.isShowValidation = true;
    actualizationThresholdForRemainingDurationError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.actualizationThresholdForRemainingDuration');
    this.ActualizationThresholdForRemainingDurationTextBoxconfig.required = false;
    this.ActualizationThresholdForRemainingDurationTextBoxconfig.Errors = [actualizationThresholdForRemainingDurationError];

    const numberOfMonthsToExtendRevisionPeriodError = new ErrorDto;
    numberOfMonthsToExtendRevisionPeriodError.validation = "required";
    numberOfMonthsToExtendRevisionPeriodError.isModelError = true;
    numberOfMonthsToExtendRevisionPeriodError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.numberOfMonthsToExtendRevisionPeriod');
    this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.required = true;
    this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.Errors = [numberOfMonthsToExtendRevisionPeriodError];

    const numberOfDaysToExtendVariableRevisionPeriodError = new ErrorDto;
    numberOfDaysToExtendVariableRevisionPeriodError.validation = "required";
    numberOfDaysToExtendVariableRevisionPeriodError.isModelError = true;
    numberOfDaysToExtendVariableRevisionPeriodError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.numberOfDaysToExtendVariableRevision');
    this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.required = true;
    this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.Errors = [numberOfDaysToExtendVariableRevisionPeriodError];

    const arrearNameError = new ErrorDto;
    arrearNameError.validation = "required";
    arrearNameError.isModelError = true;
    arrearNameError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.Name');
    this.ArrearNameDropdownConfig.required = true;
    this.ArrearNameDropdownConfig.Errors = [arrearNameError];

    const creditStatusError = new ErrorDto;
    creditStatusError.validation = "required";
    creditStatusError.isModelError = true;
    creditStatusError.validationMessage = this.translate.instant('app-instance.credit-provider.validations.CreditStatus');
    this.CreditStatusDropdownConfig.required = true;
    this.CreditStatusDropdownConfig.Errors = [creditStatusError];
  }


  settingExternalErrorTrue() {
    this.MinDueDatesForTaskTextBoxConfig.externalError = true;
    this.MinDueDatesForUrgentTaskTextBoxConfig.externalError = true;
    this.MinAmountForBonusTaskForRevolvingTextBoxConfig.externalError = true;
    this.MinBonusThresholdforRefundTextBoxConfig.externalError = true;
    this.MinDueThresholdforRemiseTextBoxConfig.externalError = true;
    this.MinDueElapsedPeriodforRemiseTextBoxConfig.externalError = true;
    this.BonusRefundReceiverTypeDropdownConfig.externalError = true;
    this.MinRemainingValueAfterPrepaymentTextBoxconfig.externalError = true;
    this.NrOfDaysAdvancedNoticeTextBoxconfig.externalError = true;
    this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.externalError = true;
    this.ExtendRevisionPeriodsWithinLimitCheckboxConfig.externalError = true;
    this.CommissionNotePeriodicityDropdownConfig.externalError = true;
    this.CommissionNoteCalendarDayDropdownConfig.externalError = true;
    this.ExpectedMarginCalculationMethodDropdownConfig.externalError = true;
    this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.externalError = true;
    this.PaymentPromiseGraceDaysTextBoxconfig.externalError = true;
    this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.externalError = true;
    this.ChargeMutationCostOncePerMutationTypeCheckboxConfig.externalError = true;
    this.MinDurationInMonthsTextBoxConfig.externalError = true;
    this.MaxDurationInMonthsTextBoxConfig.externalError = true;
    this.PercentageOfLimitThresholdTextBoxConfig.externalError = true;
    this.EmailTextBoxconfig.externalError = true;
    this.PaymentValidatorGroupNameTextBoxconfig.externalError = true;
    this.ValidatorAutoCompleteConfig.externalError = true;
    this.BannedAccountNameTextBoxconfig.externalError = true;
    this.BannedibanAccountTextBoxconfig.externalError = true;
    this.TrustedDomesticAccountNameTextBoxconfig.externalError = true;
    this.TrustedDomesticAccountNrTextBoxconfig.externalError = true;
    this.TrustedDomesticSortCodeTextBoxconfig.externalError = true;
    this.AggregateDirectDebitCollectionCheckboxConfig.externalError = true;
    this.BonusInInstallmentCalculationMethodDropdownConfig.externalError = true;
    this.DueInInstallmentCalculationMethodDropdownConfig.externalError = true;
    this.DaysLimitOnResendTextBoxconfig.externalError = true;
    this.DaysOnResendTextBoxconfig.externalError = true;
    this.UseBusinessDaysForClaimDateCalculationCheckboxConfig.externalError = true;
    this.UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig.externalError = true;
    this.DaysBeforeDueDateTextBoxconfig.externalError = true;
    this.CreditorSchemeIDTextBoxconfig.externalError = true;
    this.sendEventDropdownConfig.externalError = true;
    this.TrustedIBANAccountNameTextBoxconfig.externalError = true;
    this.TrustedibanAccountTextBoxconfig.externalError = true;
    this.TrustedIBANbicCodeAutoCompleteConfig.externalError = true;
    this.TrustedcountryAutoCompleteConfig.externalError = true;
    this.TrustedpostalCodeAutoCompleteConfig.externalError = true;
    this.TrustedcityTextBoxconfig.externalError = true;
    this.TrustedstreetTextBoxconfig.externalError = true;
    this.TrustedhouseNrTextBoxconfig.externalError = true;
    this.TrustedpostalCodeTextBoxconfig.externalError = true;
    this.TrustedstreetAutoCompleteConfig.externalError = true;
    this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.externalError = true;
    this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.externalError = true;
    this.ArrearNameDropdownConfig.externalError = true;
    this.CreditStatusDropdownConfig.externalError = true;
    this.IBANTextBoxconfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.MinDueDatesForTaskTextBoxConfig.externalError = false;
    this.MinDueDatesForUrgentTaskTextBoxConfig.externalError = false;
    this.MinAmountForBonusTaskForRevolvingTextBoxConfig.externalError = false;
    this.MinBonusThresholdforRefundTextBoxConfig.externalError = false;
    this.MinDueThresholdforRemiseTextBoxConfig.externalError = false;
    this.MinDueElapsedPeriodforRemiseTextBoxConfig.externalError = false;
    this.BonusRefundReceiverTypeDropdownConfig.externalError = false;
    this.MinRemainingValueAfterPrepaymentTextBoxconfig.externalError = false;
    this.NrOfDaysAdvancedNoticeTextBoxconfig.externalError = false;
    this.NrOfDaysForIsRegularCalculationBaseTextBoxconfig.externalError = false;
    this.ExtendRevisionPeriodsWithinLimitCheckboxConfig.externalError = false;
    this.CommissionNotePeriodicityDropdownConfig.externalError = false;
    this.CommissionNoteCalendarDayDropdownConfig.externalError = false;
    this.ExpectedMarginCalculationMethodDropdownConfig.externalError = false;
    this.ServicingNoticeUponDebtorNumberOfDaysTextBoxconfig.externalError = false;
    this.PaymentPromiseGraceDaysTextBoxconfig.externalError = false;
    this.NrOfDaysBeforeEnfTitleExpirationTextBoxconfig.externalError = false;
    this.ChargeMutationCostOncePerMutationTypeCheckboxConfig.externalError = false;
    this.MinDurationInMonthsTextBoxConfig.externalError = false;
    this.MaxDurationInMonthsTextBoxConfig.externalError = false;
    this.PercentageOfLimitThresholdTextBoxConfig.externalError = false;
    this.EmailTextBoxconfig.externalError = false;
    this.PaymentValidatorGroupNameTextBoxconfig.externalError = false;
    this.ValidatorAutoCompleteConfig.externalError = false;
    this.BannedAccountNameTextBoxconfig.externalError = false;
    this.BannedibanAccountTextBoxconfig.externalError = false;
    this.TrustedDomesticAccountNameTextBoxconfig.externalError = false;
    this.TrustedDomesticAccountNrTextBoxconfig.externalError = false;
    this.TrustedDomesticSortCodeTextBoxconfig.externalError = false;
    this.AggregateDirectDebitCollectionCheckboxConfig.externalError = false;
    this.BonusInInstallmentCalculationMethodDropdownConfig.externalError = false;
    this.DueInInstallmentCalculationMethodDropdownConfig.externalError = false;
    this.DaysLimitOnResendTextBoxconfig.externalError = false;
    this.DaysOnResendTextBoxconfig.externalError = false;
    this.UseBusinessDaysForClaimDateCalculationCheckboxConfig.externalError = false;
    this.UseNextBusinessDayIfReferenceDateIsNotABusinessDayCheckboxConfig.externalError = false;
    this.DaysBeforeDueDateTextBoxconfig.externalError = false;
    this.CreditorSchemeIDTextBoxconfig.externalError = false;
    this.sendEventDropdownConfig.externalError = false;
    this.TrustedIBANAccountNameTextBoxconfig.externalError = false;
    this.TrustedibanAccountTextBoxconfig.externalError = false;
    this.TrustedIBANbicCodeAutoCompleteConfig.externalError = false;
    this.TrustedcountryAutoCompleteConfig.externalError = false;
    this.TrustedpostalCodeAutoCompleteConfig.externalError = false;
    this.TrustedcityTextBoxconfig.externalError = false;
    this.TrustedstreetTextBoxconfig.externalError = false;
    this.TrustedhouseNrTextBoxconfig.externalError = false;
    this.TrustedpostalCodeTextBoxconfig.externalError = false;
    this.TrustedstreetAutoCompleteConfig.externalError = false;
    this.NumberOfMonthsToExtendRevisionPeriodTextBoxconfig.externalError = false;
    this.NumberOfDaysToExtendVariableRevisionPeriodTextBoxconfig.externalError = false;
    this.ArrearNameDropdownConfig.externalError = false;
    this.CreditStatusDropdownConfig.externalError = false;
    this.IBANTextBoxconfig.externalError = false;
    this.RemoveBusinessError(this.translate.instant('app-instance.credit-provider.validations.MinDurationBusinessError'))
    this.RemoveBusinessError(this.translate.instant('app-instance.credit-provider.validations.NoOverlapForActualization'))
  }

  RemoveIBANErrors() {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.forEach(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == this.translate.instant('Invalid IBAN'))
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 2);
      }
    })
  }

}

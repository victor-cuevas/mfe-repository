import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import {
  FluidAutoCompleteConfig,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { codeTable } from './Models/codeTable.model';
import { getLegislationResponseDto } from './Models/getlegislationresponseDto.model';
import { legislationDto } from './Models/legislation.model';
import { responsePagedListBaseOfLegislationDto } from './Models/responsePagedListBaseLegislationDto.model';
import { SearchLegislationCriteriaDto } from './Models/searchLegislationCriteriaDto.model';
import { ManageLegislationService } from './Services/manage-legislation.service';
import { DtoState } from './Models/dtoBase.model';
import { preComputedDetailDto } from './Models/precomputedDetailDto.model';
import { revolvingDetailsWithRepayDto } from './Models/revolvingDetailsWithRepayDto.model';
import { revolvingDetailsWithoutRepayDto } from './Models/revolvingDetailsWithoutRepayDto.model';
import { thresholdForCreditBureauRegistrationListDto } from './Models/threshold-CreditBureau-RegistrationListDto.model';
import { CodeTable } from '../manage-integration/model/manage-integration.model';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'maic-manage-legislation',
  templateUrl: './manage-legislation.component.html',
  styleUrls: ['./manage-legislation.component.scss']
})
export class ManageLegislationComponent implements OnInit {
  @ViewChild('searchCriteriaform', { static: true }) searchCriteriaform!: NgForm;
  @ViewChild('legislationform', { static: true }) legislationform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;

  public RequiredAutoComplete: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public PreComputedMinAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PreComputedMaxAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PreComputedMinDurationConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PreComputedMaxDurationConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PreComputedAprMaxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  public RevolvingwithRepayMinAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingwithRepayMaxAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingwithRepayAPRMaxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevPrincipalRepayAbsConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevPrincipalRepayRelConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingMaxCalibrationConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  public RevolvingwithoutRepayMinAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingwithoutRepayMaxAmountConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingwithoutAprMaxConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RevolvingwithoutMaxCalibrationConfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  public ThresholdDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';

  showDialog = false;

  exceptionBox!: boolean;

  errorCode!: string;

  ThresholdHeader!: any[];

  RevolvingwooHeader!: any[];

  RevolvingsHeader!: any[];

  precomputedsHeader!: any[];

  ResultHeader!: any[];

  RevisionHeader!: any[];

  CountryList: codeTable[] = [];
  countryCodeTable: codeTable[] = [];
  retailLendingSubTypeList: codeTable[] = [];
  retailLendingCodeTable: codeTable[] = [];

  legislationIntialData: getLegislationResponseDto = new getLegislationResponseDto();
  searchlegislation: SearchLegislationCriteriaDto = new SearchLegislationCriteriaDto();
  searchResponse: responsePagedListBaseOfLegislationDto = new responsePagedListBaseOfLegislationDto();

  /*Card Data */
  legislationData: legislationDto = new legislationDto();
  legislationList: legislationDto[] = [];
  cardCountryList: codeTable[] = [];

  hideCard = false;
  defaultDate = new Date('01/01/1900');
  minDate!: Date;
  deletedLegislationData: legislationDto[] = [];
  intMaxValue = 2147483647;
  validationHeader!: string;

  /*Error Dto */
  preComputedMinAmountDto: ErrorDto[] = [];
  preComputedMaxAmountDto: ErrorDto[] = [];
  preComputedMinDuration: ErrorDto[] = [];
  preComputedMaxDuration: ErrorDto[] = [];

  revolvingwithRepayMinAmountDto: ErrorDto[] = [];
  revolvingwithRepayMaxAmountDto: ErrorDto[] = [];
  revolvingwithRepayMaxCalib: ErrorDto[] = [];

  revolvingwithoutRepayMinAmountDto: ErrorDto[] = [];
  revolvingwithoutRepayMaxAmountDto: ErrorDto[] = [];
  revolvingwithoutMaxCalib: ErrorDto[] = [];

  /*Others */
  consumerProductTypeList: codeTable[] = [];
  navigateURL: any;
  SelectedTabIndex!: number;
  SelectedLegislationDetail = new legislationDto();

  constructor(
    public fluidService: FluidControlsBaseService,
    public activatedroute: ActivatedRoute,
    public translate: TranslateService,
    public legislationService: ManageLegislationService,
    public datePipe: DatePipe,
    public fluidValidation: fluidValidationService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;

    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedroute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.countryCodeTable = data.legislationData.legislationCodeTables?.countryList;
      this.retailLendingCodeTable = data.legislationData.legislationCodeTables.retailLendingSubTypeList;
      this.consumerProductTypeList = data.consumerProductData;
    });

    this.headerValues();
  }

  headerValues() {
    this.ResultHeader = [
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.country'),
        field: 'country.caption',
        width: '35%',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.start'),
        field: 'modifiedStartDate',
        dateSort: 'startDate',
        width: '30%',
        pSortableColumnDisabled: false
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.end'),
        field: 'modifiedEndDate',
        dateSort: 'endDate',
        width: '30%',
        pSortableColumnDisabled: false
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.'),
        field: 'deleteButton',
        fieldType: 'deleteButton',
        width: '5%',
        pSortableColumnDisabled: true
      }
    ];

    this.precomputedsHeader = [
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.minam'),
        field: 'financeAmountMax',
        property: 'financeAmountMin',
        width: '20%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.maxam'),
        field: 'financeAmountMin',
        property: 'financeAmountMax',
        width: '20%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.mindur'),
        field: 'creditDurationMaxInMonths',
        property: 'creditDurationMinInMonths',
        width: '20%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.maxdur'),
        field: 'creditDurationMinInMonths',
        property: 'creditDurationMaxInMonths',
        width: '20%'
      },
      { header: this.translate.instant('app-instance.manage-legislation.tabel.aprpre'), field: 'aprMax', property: 'aprMax', width: '15%' },
      { header: this.translate.instant('app-instance.manage-legislation.tabel.'), field: null, property: 'delete', width: '5%' }
    ];

    this.RevolvingsHeader = [
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.minams'),
        field: 'financeAmountMin',
        property: 'financeAmountMinwithRepay',
        width: '15%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.maxams'),
        field: 'financeAmountMax',
        property: 'financeAmountMaxwithRepay',
        width: '15%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.aprrve'),
        field: 'aprMax',
        property: 'aprMaxwithRepay',
        width: '10%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.minrepay'),
        field: 'revPrincipalRepayAbsMin',
        property: 'revPrincipalRepayAbsMinwithRepay',
        width: '15%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.minrepays'),
        field: 'revPrincipalRepayRelMin',
        property: 'revPrincipalRepayRelMinwithRepay',
        width: '15%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.fullrepay'),
        field: 'maxCalibrationDuration',
        property: 'maxCalibrationDurationwithRepay',
        width: '15%'
      },
      { header: this.translate.instant('app-instance.manage-legislation.tabel.'), field: null, property: 'delete', width: '5%' }
    ];
    this.RevolvingwooHeader = [
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.minamo'),
        field: 'financeAmountMin',
        property: 'financeAmountMinwithoutRepay',
        width: '20%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.maxamo'),
        field: 'financeAmountMax',
        property: 'financeAmountMaxwithoutRepay',
        width: '25%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.aprrveo'),
        field: 'aprMax',
        property: 'aprMaxwithoutRepay',
        width: '25%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.fullrepayo'),
        field: 'maxCalibrationDuration',
        property: 'maxCalibrationDurationwithoutRepay',
        width: '25%'
      },
      { header: this.translate.instant('app-instance.manage-legislation.tabel.'), field: null, property: 'delete', width: '5%' }
    ];

    this.ThresholdHeader = [
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.retail'),
        field: 'retailLendingSubType',
        property: 'retailLendingSubType',
        width: '50%'
      },
      {
        header: this.translate.instant('app-instance.manage-legislation.tabel.ThtesAmount'),
        field: 'thresholdAmount',
        property: 'thresholdAmount',
        width: '45%'
      },
      { header: this.translate.instant('app-instance.manage-legislation.tabel.'), field: null, property: 'delete', width: '5%' }
    ];
  }

  buildConfiguration() {
    const AutoCompleteError = new ErrorDto();
    AutoCompleteError.validation = 'required';
    AutoCompleteError.isModelError = true;
    AutoCompleteError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.countrys') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RequiredAutoComplete.required = true;
    this.RequiredAutoComplete.Errors = [AutoCompleteError];

    const startDateError = new ErrorDto();
    startDateError.validation = 'required';
    startDateError.isModelError = true;
    startDateError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.StartDate') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RequiredDateConfig.required = true;
    this.RequiredDateConfig.Errors = [startDateError];

    const defaultMinAmountLimitValidation = new ErrorDto();
    defaultMinAmountLimitValidation.validation = 'maxError';
    defaultMinAmountLimitValidation.isModelError = true;
    defaultMinAmountLimitValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.preComputedMinAmountDto = [defaultMinAmountLimitValidation];
    const AmountError = new ErrorDto();
    AmountError.validation = 'required';
    AmountError.isModelError = true;
    AmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMinAmountConfig.required = true;
    this.PreComputedMinAmountConfig.Errors = [AmountError];
    this.PreComputedMinAmountConfig.maxValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.PreComputedMinAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const defaultMaxAmountLimitValidation = new ErrorDto();
    defaultMaxAmountLimitValidation.validation = 'maxError';
    defaultMaxAmountLimitValidation.isModelError = true;
    defaultMaxAmountLimitValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.preComputedMaxAmountDto = [defaultMaxAmountLimitValidation];
    const MaxAmountError = new ErrorDto();
    MaxAmountError.validation = 'required';
    MaxAmountError.isModelError = true;
    MaxAmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMaxAmountConfig.required = true;
    this.PreComputedMaxAmountConfig.Errors = [MaxAmountError];
    this.PreComputedMaxAmountConfig.minValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.PreComputedMaxAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const minDurationValidation = new ErrorDto();
    minDurationValidation.validation = 'maxError';
    minDurationValidation.isModelError = true;
    minDurationValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check');
    this.preComputedMinDuration = [minDurationValidation];
    const minDurationError = new ErrorDto();
    minDurationError.validation = 'required';
    minDurationError.isModelError = true;
    minDurationError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.MinDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMinDurationConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.MinDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMinDurationConfig.required = true;
    this.PreComputedMinDurationConfig.Errors = [minDurationError];
    this.PreComputedMinDurationConfig.maxValueValidation = this.translate.instant(
      'app-instance.manage-legislation.ValidationError.InputIncorrect'
    );

    const maxDurationValidation = new ErrorDto();
    maxDurationValidation.validation = 'maxError';
    maxDurationValidation.isModelError = true;
    maxDurationValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check');
    this.preComputedMaxDuration = [maxDurationValidation];
    const maxDurationError = new ErrorDto();
    maxDurationError.validation = 'required';
    maxDurationError.isModelError = true;
    maxDurationError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.MaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMaxDurationConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.MaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedMaxDurationConfig.required = true;
    this.PreComputedMaxDurationConfig.Errors = [maxDurationError];
    this.PreComputedMaxDurationConfig.maxValueValidation = this.translate.instant(
      'app-instance.manage-legislation.ValidationError.InputIncorrect'
    );

    const aprMaxError = new ErrorDto();
    aprMaxError.validation = 'required';
    aprMaxError.isModelError = true;
    aprMaxError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedAprMaxConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.PreComputedAprMaxConfig.required = true;
    this.PreComputedAprMaxConfig.Errors = [aprMaxError];

    const revolvingMinAmountLimitValidation = new ErrorDto();
    revolvingMinAmountLimitValidation.validation = 'maxError';
    revolvingMinAmountLimitValidation.isModelError = true;
    revolvingMinAmountLimitValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.revolvingwithRepayMinAmountDto = [revolvingMinAmountLimitValidation];
    const revolingMinAmountError = new ErrorDto();
    revolingMinAmountError.validation = 'required';
    revolingMinAmountError.isModelError = true;
    revolingMinAmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithRepayMinAmountConfig.required = true;
    this.RevolvingwithRepayMinAmountConfig.Errors = [revolingMinAmountError];
    this.RevolvingwithRepayMinAmountConfig.maxValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.RevolvingwithRepayMinAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const revolvingMaxAmountLimitValidation = new ErrorDto();
    revolvingMaxAmountLimitValidation.validation = 'maxError';
    revolvingMaxAmountLimitValidation.isModelError = true;
    revolvingMaxAmountLimitValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.revolvingwithRepayMaxAmountDto = [revolvingMaxAmountLimitValidation];
    const revolingMaxAmountError = new ErrorDto();
    revolingMaxAmountError.validation = 'required';
    revolingMaxAmountError.isModelError = true;
    revolingMaxAmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithRepayMaxAmountConfig.required = true;
    this.RevolvingwithRepayMaxAmountConfig.Errors = [revolingMaxAmountError];
    this.RevolvingwithRepayMaxAmountConfig.minValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.RevolvingwithRepayMaxAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const revolvingAprMaxError = new ErrorDto();
    revolvingAprMaxError.validation = 'required';
    revolvingAprMaxError.isModelError = true;
    revolvingAprMaxError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithRepayAPRMaxConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithRepayAPRMaxConfig.required = true;
    this.RevolvingwithRepayAPRMaxConfig.Errors = [revolvingAprMaxError];

    const revPrincipalRepayAbsMinError = new ErrorDto();
    revPrincipalRepayAbsMinError.validation = 'required';
    revPrincipalRepayAbsMinError.isModelError = true;
    revPrincipalRepayAbsMinError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevPrincipalRepayAbsConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevPrincipalRepayAbsConfig.required = true;
    this.RevPrincipalRepayAbsConfig.Errors = [revPrincipalRepayAbsMinError];

    const revPrincipalRepayRelError = new ErrorDto();
    revPrincipalRepayRelError.validation = 'required';
    revPrincipalRepayRelError.isModelError = true;
    revPrincipalRepayRelError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalRelMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevPrincipalRepayRelConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalRelMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevPrincipalRepayRelConfig.required = true;
    this.RevPrincipalRepayRelConfig.Errors = [revPrincipalRepayRelError];

    const revolvingMaxError = new ErrorDto();
    revolvingMaxError.validation = 'maxError';
    revolvingMaxError.isModelError = true;
    revolvingMaxError.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check');
    this.revolvingwithRepayMaxCalib = [revolvingMaxError];
    const revMaxCalibDurationError = new ErrorDto();
    revMaxCalibDurationError.validation = 'required';
    revMaxCalibDurationError.isModelError = true;
    revMaxCalibDurationError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingMaxCalibrationConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingMaxCalibrationConfig.required = true;
    this.RevolvingMaxCalibrationConfig.Errors = [revMaxCalibDurationError];
    this.RevolvingMaxCalibrationConfig.maxValueValidation = this.translate.instant(
      'app-instance.manage-legislation.ValidationError.InputIncorrect'
    );

    const revolvingwithoutRepayMinAmountLiValidation = new ErrorDto();
    revolvingwithoutRepayMinAmountLiValidation.validation = 'maxError';
    revolvingwithoutRepayMinAmountLiValidation.isModelError = true;
    revolvingwithoutRepayMinAmountLiValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.revolvingwithoutRepayMinAmountDto = [revolvingwithoutRepayMinAmountLiValidation];
    const revolingwithoutPayMinAmountError = new ErrorDto();
    revolingwithoutPayMinAmountError.validation = 'required';
    revolingwithoutPayMinAmountError.isModelError = true;
    revolingwithoutPayMinAmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutRepayMinAmountConfig.required = true;
    this.RevolvingwithoutRepayMinAmountConfig.Errors = [revolingwithoutPayMinAmountError];
    this.RevolvingwithoutRepayMinAmountConfig.maxValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MinError');
    this.RevolvingwithoutRepayMinAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const revolvingwithoutRepayMaxAmountLimitValidation = new ErrorDto();
    revolvingwithoutRepayMaxAmountLimitValidation.validation = 'maxError';
    revolvingwithoutRepayMaxAmountLimitValidation.isModelError = true;
    revolvingwithoutRepayMaxAmountLimitValidation.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.revolvingwithoutRepayMaxAmountDto = [revolvingwithoutRepayMaxAmountLimitValidation];
    const revolingwithoutMaxAmountError = new ErrorDto();
    revolingwithoutMaxAmountError.validation = 'required';
    revolingwithoutMaxAmountError.isModelError = true;
    revolingwithoutMaxAmountError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutRepayMaxAmountConfig.required = true;
    this.RevolvingwithoutRepayMaxAmountConfig.Errors = [revolingwithoutMaxAmountError];
    this.RevolvingwithoutRepayMaxAmountConfig.minValueValidation = this.translate.instant('app-instance.manage-legislation.ValidationError.MaxError');
    this.RevolvingwithoutRepayMaxAmountConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');

    const revwoMaxError = new ErrorDto();
    revwoMaxError.validation = 'required';
    revwoMaxError.isModelError = true;
    revwoMaxError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutAprMaxConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutAprMaxConfig.required = true;
    this.RevolvingwithoutAprMaxConfig.Errors = [revwoMaxError];

    const revolvingwithoutMaxError = new ErrorDto();
    revolvingwithoutMaxError.validation = 'maxError';
    revolvingwithoutMaxError.isModelError = true;
    revolvingwithoutMaxError.validationMessage = this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check');
    this.revolvingwithoutMaxCalib = [revolvingwithoutMaxError];
    const revwithoutMaxCalibDurationError = new ErrorDto();
    revwithoutMaxCalibDurationError.validation = 'required';
    revwithoutMaxCalibDurationError.isModelError = true;
    revwithoutMaxCalibDurationError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutMaxCalibrationConfig.invalidDefaultValidation =
      this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.RevolvingwithoutMaxCalibrationConfig.required = true;
    this.RevolvingwithoutMaxCalibrationConfig.Errors = [revwithoutMaxCalibDurationError];
    this.RevolvingwithoutMaxCalibrationConfig.maxValueValidation = this.translate.instant(
      'app-instance.manage-legislation.ValidationError.InputIncorrect'
    );

    const thresholdDropdownError = new ErrorDto();
    thresholdDropdownError.validation = 'required';
    thresholdDropdownError.isModelError = true;
    thresholdDropdownError.validationMessage =
      this.translate.instant('app-instance.manage-legislation.ValidationError.retailLending') +
      this.translate.instant('app-instance.manage-legislation.ValidationError.required');
    this.ThresholdDropdownConfig.required = true;
    this.ThresholdDropdownConfig.Errors = [thresholdDropdownError];
  }

  /*Search Criteria Event */
  filterCountry(event: any) {
    if (event) {
      this.CountryList = [];

      this.countryCodeTable.filter(data => {
        if (data.caption.toLowerCase().startsWith(event?.query.toLowerCase())) {
          this.CountryList.push(data);
        }
      });
    }
  }

  changeCountry(event: any) {
    if (event.target.value) {
      const name = this.countryCodeTable.filter(x => {
        return x.caption == event?.target?.value;
      });
      if (name[0] != null) {
        this.searchlegislation.country = name[0];
      }
    } else {
      this.searchlegislation.country = null;
    }
  }

  onStartDatChange(event: any) {
    this.searchlegislation.activeDate = event;
  }

  /*On Search Api Call */
  onSearch(searchlegislation: SearchLegislationCriteriaDto) {
    if (searchlegislation.activeDate) {
      searchlegislation.activeDate = new Date(
        Date.UTC(
          searchlegislation?.activeDate?.getFullYear(),
          searchlegislation?.activeDate?.getMonth(),
          searchlegislation?.activeDate?.getDate(),
          0,
          0,
          0
        )
      );
    }
    this.RemoveErrors();
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.NoRecord'));
    this.legislationService.searchLegislation(searchlegislation).subscribe(
      (data: any) => {
        this.spinnerService.setIsLoading(false);
        const updatedResponse = data.items.map((legislationData: legislationDto) => {
          const updatePreComputed = legislationData.precomputedDetails.map(x => {
            return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
          });

          const updateRevolvingwithRepay = legislationData.revolvingDetailsWithRepay.map(x => {
            return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
          });

          const updateRevolvingwithoutRepay = legislationData.revolvingDetailsWithoutRepay.map(x => {
            return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
          });

          const updatethreshold = legislationData.thresholdForCreditBureauRegistrationList.map(x => {
            return { ...x, isDeleted: false, rowSelected: false, randomNumber: this.generateRandomNumber() };
          });

          return {
            ...legislationData,
            startDate: new Date(legislationData?.startDate),
            modifiedStartDate: this.datePipe.transform(legislationData?.startDate, 'dd/MM/yyyy'),
            endDate: new Date(legislationData.endDate as Date),
            modifiedEndDate: this.datePipe.transform(legislationData?.endDate, 'dd/MM/yyyy'),
            randomNumber: this.generateRandomNumber(),
            precomputedDetails: updatePreComputed,
            revolvingDetailsWithRepay: updateRevolvingwithRepay,
            revolvingDetailsWithoutRepay: updateRevolvingwithoutRepay,
            thresholdForCreditBureauRegistrationList: updatethreshold,
            selectedRow: false
          };
        });

        updatedResponse.forEach((x: legislationDto) => {
          if (x.modifiedEndDate == null) x.endDate = null;
        });
        if (updatedResponse.length > 0) {
          updatedResponse[0].selectedRow = true;
          this.legislationList = updatedResponse;
          this.hideCard = true;
          if (this.legislationList[0].precomputedDetails.length > 0) {
            this.legislationList[0].precomputedDetails[0].rowSelected = true;
          }
          if (this.legislationList[0].revolvingDetailsWithRepay.length > 0) {
            this.legislationList[0].revolvingDetailsWithRepay[0].rowSelected = true;
          }
          if (this.legislationList[0].revolvingDetailsWithoutRepay.length > 0) {
            this.legislationList[0].revolvingDetailsWithoutRepay[0].rowSelected = true;
          }
          if (this.legislationList[0].thresholdForCreditBureauRegistrationList.length > 0) {
            this.legislationList[0].thresholdForCreditBureauRegistrationList[0].rowSelected = true;
          }
          this.legislationData = this.legislationList[0];
          this.SelectedLegislationDetail = this.legislationList[0];
          this.minDate = new Date(this.legislationData.startDate);
          this.minDate.setDate(this.minDate.getDate() + 1);
        }
      },
      err => {
        this.spinnerService.setIsLoading(false);
        this.throwBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.NoRecord'));
      }
    );
  }

  /*Add Legislation */
  onAddResult() {
    if (this.legislationform.valid) {
      const tabDataExist = this.checkPeriodExist(this.legislationList);
      if (tabDataExist) {
        this.removeExternalError();
        this.RemoveErrors();
        if (this.legislationList.length > 0) {
          const updateLegislationList = [...this.legislationList];
          const prevIndex = updateLegislationList.findIndex(x => x.selectedRow);
          const deselectedData = this.deselectData(updateLegislationList);
          this.legislationList[prevIndex].selectedRow = deselectedData[prevIndex].selectedRow;
        }
        const onUpdateLegislationList = [...this.legislationList];
        this.legislationData = new legislationDto();
        this.legislationData.state = 1;
        this.legislationData.startDate = new Date(Date.now());
        this.legislationData.endDate = new Date(Date.now());
        this.legislationData.modifiedStartDate = this.datePipe.transform(this.legislationData.startDate, 'dd/MM/yyyy');
        this.legislationData.modifiedEndDate = this.datePipe.transform(this.legislationData.endDate, 'dd/MM/yyyy');
        this.legislationData.randomNumber = this.generateRandomNumber();
        this.legislationData.selectedRow = true;
        this.legislationData.precomputedDetails = [];
        this.legislationData.revolvingDetailsWithRepay = [];
        this.legislationData.revolvingDetailsWithoutRepay = [];
        this.legislationData.thresholdForCreditBureauRegistrationList = [];

        onUpdateLegislationList.push({ ...this.legislationData });

        this.legislationList = [...onUpdateLegislationList];
        this.SelectedLegislationDetail = this.legislationList[this.legislationList.length - 1];
        this.minDate = new Date(this.legislationData.startDate);
        this.minDate.setDate(this.minDate.getDate() + 1);

        this.hideCard = true;
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  /*Select Legislation Detail in Grid */
  onRowselect(event: legislationDto) {
    if (this.legislationform.valid) {
      const tabDataExist = this.checkPeriodExist(this.legislationList);

      if (tabDataExist || event.selectedRow) {
        this.RemoveErrors();
        let updatedlegislationData = this.legislationList;
        const eventIndex = updatedlegislationData.findIndex(x => x.selectedRow);

        updatedlegislationData = this.deselectData(updatedlegislationData);

        this.legislationList[eventIndex].selectedRow = updatedlegislationData[eventIndex].selectedRow;

        const selectedIndex = updatedlegislationData.findIndex(x => x.randomNumber == event.randomNumber);

        this.legislationList[selectedIndex].selectedRow = true;

        if (event.precomputedDetails.length > 0) {
          event.precomputedDetails[0].rowSelected = true;
        }
        if (event.revolvingDetailsWithRepay.length > 0) {
          event.revolvingDetailsWithRepay[0].rowSelected = true;
        }
        if (event.revolvingDetailsWithoutRepay.length > 0) {
          event.revolvingDetailsWithoutRepay[0].rowSelected = true;
        }
        if (event.thresholdForCreditBureauRegistrationList.length > 0) {
          event.thresholdForCreditBureauRegistrationList[0].rowSelected = true;
        }

        this.legislationData = event;
        this.SelectedLegislationDetail = this.legislationList[selectedIndex];
        this.minDate = new Date(this.legislationData.startDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  /*Delete Legislation Detail in Grid */
  onRowDelete(event: legislationDto) {
    if (this.legislationform.valid || event.selectedRow) {
      let tabDataExist = true;
      if (event.country && event.country != null) {
        tabDataExist = this.checkPeriodExist(this.legislationList);
      }

      if (tabDataExist || event.selectedRow) {
        const legislationListData = [...this.legislationList];

        const todeleteIndex = legislationListData.findIndex((data: legislationDto) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != legislationListData.length - 1) {
          if (legislationListData[todeleteIndex].state == 1) {
            legislationListData.splice(todeleteIndex, 1);
            this.RemoveErrors();
          } else {
            legislationListData[todeleteIndex].state = 4;
            this.deletedLegislationData.push({ ...legislationListData[todeleteIndex] });
            legislationListData.splice(todeleteIndex, 1);
            this.RemoveErrors();
          }

          if (legislationListData.length > 0) {
            this.legislationList = this.deselectData(legislationListData);
            this.legislationList[0].selectedRow = true;
            this.legislationData = this.legislationList[0];
            this.SelectedLegislationDetail = this.legislationList[0];
            this.minDate = new Date(this.legislationData.startDate);
            this.minDate.setDate(this.minDate.getDate() + 1);
            //this.highlightGenericData = this.genericMappingList[0];
          } else {
            this.legislationList = [];
            this.legislationData = new legislationDto();
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        } else {
          if (legislationListData[todeleteIndex].state == 1) {
            legislationListData.splice(todeleteIndex, 1);
            this.RemoveErrors();
          } else {
            legislationListData[todeleteIndex].state = 4;
            this.deletedLegislationData.push({ ...legislationListData[todeleteIndex] });
            legislationListData.splice(todeleteIndex, 1);
            this.RemoveErrors();
          }

          if (legislationListData.length > 0) {
            this.legislationList = this.deselectData(legislationListData);
            this.legislationList[this.legislationList?.length - 1].selectedRow = true;
            const lastIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);

            this.legislationData = this.legislationList[lastIndex];
            this.SelectedLegislationDetail = this.legislationList[lastIndex];
            this.minDate = new Date(this.legislationData.startDate);
            this.minDate.setDate(this.minDate.getDate() + 1);
            //this.highlightGenericData = this.genericMappingList[lastIndex];
          } else {
            this.legislationList = [];
            this.legislationData = new legislationDto();
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        }
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  /*Common Methods */
  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  deselectData(relatedProduct: legislationDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: legislationDto) => {
            return {
              ...x,
              selectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Legislation Card */
  filterCardCountry(event: any) {
    if (event) {
      this.cardCountryList = [];

      this.countryCodeTable.filter(data => {
        if (data.caption.toLowerCase().startsWith(event?.query.toLowerCase())) {
          this.cardCountryList.push(data);
        }
      });
    }
  }

  changeCardCountry(event: any) {
    if (event) {
      const name = this.countryCodeTable.filter(x => {
        return x.caption == event.caption;
      });
      if (name[0] != null) {
        const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
        if (SelectedIndex >= 0) {
          const updateData = this.legislationList;
          const updategrid = { ...updateData[SelectedIndex] };
          updategrid.country = name[0];
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[SelectedIndex].country = updategrid.country;
          this.legislationList[SelectedIndex].state = updategrid.state;

          this.legislationData.country = updategrid.country;
        }
      }
    }
  }

  clearCountry(event: any) {
    setTimeout(() => {
      this.RequiredAutoComplete.externalError = true;
    }, 100);
  }

  onStartDateChange(event: Date) {
    const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);

    if (event) {
      const displaystartDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (SelectedIndex >= 0) {
        const updateData = this.legislationList;
        const updategrid = { ...updateData[SelectedIndex] };
        updategrid.startDate = event;
        updategrid.modifiedStartDate = displaystartDate;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.legislationList[SelectedIndex].startDate = updategrid.startDate;
        this.legislationList[SelectedIndex].modifiedStartDate = updategrid.modifiedStartDate;
        this.legislationList[SelectedIndex].state = updategrid.state;

        this.legislationData.startDate = event;
        this.minDate = new Date(this.legislationData.startDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
      }
    } else {
      if (this.legislationList[SelectedIndex].state != DtoState.Created) {
        this.legislationList[SelectedIndex].state = DtoState.Dirty;
      }
      this.legislationList[SelectedIndex].startDate = event;
      this.legislationList[SelectedIndex].modifiedStartDate = null;
      this.legislationData.startDate = event;
      this.RequiredDateConfig.externalError = true;
    }
  }

  onEndDateChange(event: Date) {
    const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
    if (event) {
      const displayEndDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (SelectedIndex >= 0) {
        const updateData = this.legislationList;
        const updategrid = { ...updateData[SelectedIndex] };
        updategrid.endDate = event;
        updategrid.modifiedEndDate = displayEndDate;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.legislationList[SelectedIndex].endDate = updategrid.endDate;
        this.legislationList[SelectedIndex].modifiedEndDate = updategrid.modifiedEndDate;
        this.legislationList[SelectedIndex].state = updategrid.state;

        this.legislationData.endDate = event;
      }
    } else {
      if (this.legislationList[SelectedIndex].state != DtoState.Created) {
        this.legislationList[SelectedIndex].state = DtoState.Dirty;
      }
      this.legislationList[SelectedIndex].endDate = null;
      this.legislationList[SelectedIndex].modifiedEndDate = null;
      this.legislationData.endDate = null;
      this.legislationData.modifiedEndDate = event;

      this.RemoveBusinessError(
        this.translate.instant('app-instance.manage-legislation.BusinessError.EndDate') +
          this.legislationList[SelectedIndex].country.caption
      );
    }
  }

  /*Validation */

  IsLegislationDateRangeValid(legislationList: legislationDto[]) {
    const cloneLegistationList = legislationList.map(lesigistate => {
      const updateLegistate = { ...lesigistate };
      if (updateLegistate?.precomputedDetails && updateLegistate.precomputedDetails.length > 0) {
        updateLegistate.precomputedDetails = updateLegistate.precomputedDetails.map(x => {
          return { ...x };
        });
      }
      if (updateLegistate?.revolvingDetailsWithRepay && updateLegistate.revolvingDetailsWithRepay.length > 0) {
        updateLegistate.revolvingDetailsWithRepay = updateLegistate.revolvingDetailsWithRepay.map(x => {
          return { ...x };
        });
      }
      if (updateLegistate?.revolvingDetailsWithoutRepay && updateLegistate.revolvingDetailsWithoutRepay.length > 0) {
        updateLegistate.revolvingDetailsWithoutRepay = updateLegistate.revolvingDetailsWithoutRepay.map(x => {
          return { ...x };
        });
      }
      return updateLegistate;
    });

    const UpdateLegislationList = [...cloneLegistationList];

    const uniqueCountry = [...new Map(UpdateLegislationList.map(item => [item.country?.caption, item])).values()];

    let errorExist = true;

    uniqueCountry.forEach(countryName => {
      const filteredList = UpdateLegislationList.filter(x => x.country.caption == countryName.country.caption);
      filteredList.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

      const noEndDateCount = filteredList.filter(x => x.endDate == null);
      const noEndDateObject = filteredList.find(e => e.endDate == null);

      if (noEndDateCount.length > 1) {
        this.throwBusinessError(
          this.translate.instant('app-instance.manage-legislation.BusinessError.MultipleLegislation') + `'${countryName.country.caption}'`
        );
        errorExist = false;
      } else if (
        UpdateLegislationList.length > 0 &&
        (noEndDateObject == null || noEndDateObject?.modifiedStartDate != filteredList[filteredList.length - 1].modifiedStartDate)
      ) {
        this.throwBusinessError(
          this.translate.instant('app-instance.manage-legislation.BusinessError.EndDate') + `'${countryName.country.caption}'`
        );
        errorExist = false;
      }
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        for (let index = 0; index < filteredList.length; index++) {
          if (index > 0) {
            const endDate = filteredList[index - 1].endDate as Date;

            if (endDate != null) {
              if (filteredList[index].startDate.getUTCDate() != endDate.getUTCDate() + 1) {
                this.throwBusinessError(
                  this.translate.instant('app-instance.manage-legislation.BusinessError.Overlapping') + `'${countryName.country.caption}'`
                );
                errorExist = false;
                break;
              }
            }
          }
        }
      }
    });
    return errorExist;
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
    } else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  RemoveErrors() {
    this.removeExternalError();
    this.removePreComputedError();
    this.removeRevolvingError();
    this.removeRevolvingwithoutRepayError();

    this.ThresholdDropdownConfig.externalError = false;

    this.splicePreComputedError();
    this.spliceRevolvingwithRepayError();
    this.spliceRevolvingWithoutRepayError();
    this.spliceThresholdError();

    const RemoveLegislationError = [...this.legislationList];

    RemoveLegislationError.map(x => {
      if (x?.country && x.country != null) {
        this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.PeriodExist') + `'${x.country.caption}'`);
        this.RemoveBusinessError(
          this.translate.instant('app-instance.manage-legislation.BusinessError.MultipleLegislation') + `'${x.country.caption}'`
        );
        this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.EndDate') + `'${x.country.caption}'`);
        this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.Overlapping') + `'${x.country.caption}'`);
      }
    });
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.ThresholdBusiness'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.NoRecord'));
    this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.LegislationObject'));
  }

  checkPeriodExist(legislationList: legislationDto[]) {
    let periodReturn = true;
    const cloneLegistationList = legislationList.map(lesigistate => {
      const updateLegistate = { ...lesigistate };
      if (updateLegistate?.precomputedDetails && updateLegistate.precomputedDetails.length > 0) {
        updateLegistate.precomputedDetails = updateLegistate.precomputedDetails.map(x => {
          return { ...x };
        });
      }
      if (updateLegistate?.revolvingDetailsWithRepay && updateLegistate.revolvingDetailsWithRepay.length > 0) {
        updateLegistate.revolvingDetailsWithRepay = updateLegistate.revolvingDetailsWithRepay.map(x => {
          return { ...x };
        });
      }
      if (updateLegistate?.revolvingDetailsWithoutRepay && updateLegistate.revolvingDetailsWithoutRepay.length > 0) {
        updateLegistate.revolvingDetailsWithoutRepay = updateLegistate.revolvingDetailsWithoutRepay.map(x => {
          return { ...x };
        });
      }
      return updateLegistate;
    });

    const CheckLegislationList = [...cloneLegistationList];
    for (let i = 0; i < CheckLegislationList.length; i++) {
      if (
        CheckLegislationList[i].precomputedDetails.length <= 0 &&
        CheckLegislationList[i].revolvingDetailsWithRepay.length <= 0 &&
        CheckLegislationList[i].revolvingDetailsWithoutRepay.length <= 0
      ) {
        this.throwBusinessError(
          this.translate.instant('app-instance.manage-legislation.BusinessError.PeriodExist') + `'${CheckLegislationList[i].country.caption}'`
        );
        periodReturn = false;
        break;
      } else {
        if (CheckLegislationList[i].precomputedDetails.length > 0) {
          const notDeletedPreComputed = CheckLegislationList[i].precomputedDetails.filter(y => y.isDeleted == false);
          CheckLegislationList[i].precomputedDetails = notDeletedPreComputed;
        }

        if (CheckLegislationList[i].revolvingDetailsWithRepay.length > 0) {
          const notDeletedRevolvingwithRepay = CheckLegislationList[i].revolvingDetailsWithRepay.filter(y => y.isDeleted == false);
          CheckLegislationList[i].revolvingDetailsWithRepay = notDeletedRevolvingwithRepay;
        }

        if (CheckLegislationList[i].revolvingDetailsWithoutRepay.length > 0) {
          const notDeletedRevolvingwithoutRepay = CheckLegislationList[i].revolvingDetailsWithoutRepay.filter(y => y.isDeleted == false);
          CheckLegislationList[i].revolvingDetailsWithoutRepay = notDeletedRevolvingwithoutRepay;
        }

        if (
          CheckLegislationList[i].precomputedDetails.length <= 0 &&
          CheckLegislationList[i].revolvingDetailsWithRepay.length <= 0 &&
          CheckLegislationList[i].revolvingDetailsWithoutRepay.length <= 0
        ) {
          this.throwBusinessError(
            this.translate.instant('app-instance.manage-legislation.BusinessError.PeriodExist') + `'${CheckLegislationList[i].country.caption}'`
          );
          periodReturn = false;
          break;
        }
      }
    }
    return periodReturn;
  }

  /*TabFunctionality For PreComputed */

  onAddPrecomputedDetail() {
    if (this.legislationform.valid) {
      this.removePreComputedError();
      this.RemoveErrors();
      if (this.legislationList.length > 0) {
        const updateLegislationList = [...this.legislationList];
        const prevIndex = updateLegislationList.findIndex(x => x.selectedRow);
        this.legislationList[prevIndex].precomputedDetails = this.disableanddeselectPreComputedTextbox(
          updateLegislationList[prevIndex].precomputedDetails
        );

        const precomputed = new preComputedDetailDto();
        precomputed.state = 1;
        precomputed.isDeleted = false;
        precomputed.rowSelected = true;
        precomputed.disableTextbox = false;
        precomputed.randomNumber = this.generateRandomNumber();
        precomputed.consumerProductType = this.consumerProductTypeList[0];

        this.legislationList[prevIndex].precomputedDetails.push({ ...precomputed });
        this.legislationData.precomputedDetails = this.legislationList[prevIndex].precomputedDetails;
        this.legislationData.state = DtoState.Dirty;
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  onPreComputedRowSelect(rowData: preComputedDetailDto) {
    if (rowData) {
      if (this.legislationform.valid || rowData.rowSelected) {
        const precomputedList = this.legislationData.precomputedDetails;
        const prevIndex = precomputedList.findIndex(x => x.rowSelected);
        const deselectedData = this.deSelectPreComputedTextbox(precomputedList);
        this.legislationData.precomputedDetails[prevIndex].rowSelected = deselectedData[prevIndex].rowSelected;

        const Index = this.legislationData.precomputedDetails.findIndex(x => x.randomNumber == rowData.randomNumber);
        this.legislationData.precomputedDetails[Index].rowSelected = true;
        // this.higlightRelatedProduct = this.RelatedProductData[Index];
      } else {
        this.setPreComputedError();
      }
    }
  }

  /* PreComputed Change Events */
  onfinanceAmountMinChange(event: any, rowData: preComputedDetailDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.precomputedDetails[index].state != DtoState.Created) {
        this.legislationData.precomputedDetails[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }
      if (this.legislationform.valid) {
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = false;
        });
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.precomputedDetails[index].financeAmountMin = parseFloat(floatValue);
          if (
            this.legislationData.precomputedDetails[index].financeAmountMin >
            this.legislationData.precomputedDetails[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.precomputedDetails.forEach(x => {
              x.disableTextbox = true;
            });

            this.PreComputedMinAmountConfig.externalError = true;
          } else {
            this.PreComputedMinAmountConfig.externalError = false;
            this.PreComputedMaxAmountConfig.externalError = false;
            this.EnablePreComputedTextbox();
            this.legislationform.form.controls['financeAmountMinPreComputed'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxPreComputed'+index].setErrors(null);
          }
          this.legislationData.precomputedDetails[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.precomputedDetails[index].disableTextbox = false;

        this.legislationData.precomputedDetails[index].financeAmountMin = event;
        if (event == '0,00') {
          this.PreComputedMinAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.precomputedDetails[index].financeAmountMin = null as unknown as number;

            this.PreComputedMinAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onfinanceAmountMaxChange(event: any, rowData: preComputedDetailDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.precomputedDetails[index].state != DtoState.Created) {
        this.legislationData.precomputedDetails[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }
      if (this.legislationform.valid) {
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = false;
        });
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.precomputedDetails[index].financeAmountMax = parseFloat(floatValue);
          if (
            this.legislationData.precomputedDetails[index].financeAmountMin >
            this.legislationData.precomputedDetails[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.precomputedDetails.forEach(x => {
              x.disableTextbox = true;
            });

            this.PreComputedMaxAmountConfig.externalError = true;
          } else {
            this.PreComputedMinAmountConfig.externalError = false;
            this.PreComputedMaxAmountConfig.externalError = false;
            this.EnablePreComputedTextbox();
            this.legislationform.form.controls['financeAmountMinPreComputed'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxPreComputed'+index].setErrors(null);
          }
          this.legislationData.precomputedDetails[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.precomputedDetails[index].disableTextbox = false;

        this.legislationData.precomputedDetails[index].financeAmountMax = event;
        if (event == '0,00') {
          this.PreComputedMinAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.precomputedDetails[index].financeAmountMax = null as unknown as number;

            this.PreComputedMaxAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  creditDurationMinChange(event: any, rowData: preComputedDetailDto, index: number) {
    const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
    if (event != null && event != '' && +event != 0) {
      if (index >= 0) {
        if (+event > this.intMaxValue) {
          const updateData = this.legislationData.precomputedDetails;
          const updategrid = { ...updateData[index] };
          updategrid.creditDurationMinInMonths = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMinInMonths = updategrid.creditDurationMinInMonths;
          this.legislationData.precomputedDetails[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          this.PreComputedMinDurationConfig.externalError = true;

          this.legislationData.precomputedDetails.forEach(x => {
            x.disableTextbox = true;
          });

          this.legislationData.precomputedDetails[index].disableTextbox = false;
        } else {
          const updateData = this.legislationData.precomputedDetails;
          const updategrid = { ...updateData[index] };
          updategrid.creditDurationMinInMonths = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMinInMonths = updategrid.creditDurationMinInMonths;
          this.legislationData.precomputedDetails[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          if (this.legislationform.valid) {
            this.legislationData.precomputedDetails.forEach(x => {
              x.disableTextbox = false;
            });
          }
        }
      }
    } else {
      const updateData = this.legislationData.precomputedDetails;
      const updategrid = { ...updateData[index] };
      updategrid.creditDurationMinInMonths = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMinInMonths = null as unknown as number;
      this.legislationData.precomputedDetails[index].state = updategrid.state;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }

      this.PreComputedMinDurationConfig.externalError = true;

      this.legislationData.precomputedDetails.forEach(x => {
        x.disableTextbox = true;
      });

      this.legislationData.precomputedDetails[index].disableTextbox = false;
    }
  }

  creditDurationMaxChange(event: any, rowData: preComputedDetailDto, index: number) {
    const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
    if (event != null && event != '' && +event != 0) {
      if (index >= 0) {
        if (+event > this.intMaxValue) {
          const updateData = this.legislationData.precomputedDetails;
          const updategrid = { ...updateData[index] };
          updategrid.creditDurationMaxInMonths = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMaxInMonths = updategrid.creditDurationMaxInMonths;
          this.legislationData.precomputedDetails[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          this.PreComputedMaxDurationConfig.externalError = true;
          this.legislationData.precomputedDetails.forEach(x => {
            x.disableTextbox = true;
          });

          this.legislationData.precomputedDetails[index].disableTextbox = false;
        } else {
          const updateData = this.legislationData.precomputedDetails;
          const updategrid = { ...updateData[index] };
          updategrid.creditDurationMaxInMonths = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMaxInMonths = updategrid.creditDurationMaxInMonths;
          this.legislationData.precomputedDetails[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          if (this.legislationform.valid) {
            this.legislationData.precomputedDetails.forEach(x => {
              x.disableTextbox = false;
            });
          }
        }
      }
    } else {
      const updateData = this.legislationData.precomputedDetails;
      const updategrid = { ...updateData[index] };
      updategrid.creditDurationMaxInMonths = +event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].precomputedDetails[index].creditDurationMaxInMonths = null as unknown as number;
      this.legislationData.precomputedDetails[index].state = updategrid.state;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }

      this.PreComputedMaxDurationConfig.externalError = true;
      this.legislationData.precomputedDetails.forEach(x => {
        x.disableTextbox = true;
      });

      this.legislationData.precomputedDetails[index].disableTextbox = false;
    }
  }

  aprMaxChange(event: any, rowData: preComputedDetailDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.precomputedDetails[index].state != DtoState.Created) {
        this.legislationData.precomputedDetails[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.precomputedDetails[index].aprMax = parseFloat(floatValue);
          this.EnablePreComputedTextbox();
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.precomputedDetails[index].disableTextbox = false;

        this.legislationData.precomputedDetails[index].aprMax = event;
        if (event == '0,00') {
          this.PreComputedAprMaxConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.precomputedDetails[index].aprMax = null as unknown as number;

            this.PreComputedAprMaxConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  EnablePreComputedTextbox() {
    setTimeout(() => {
      if (this.legislationform.valid) {
        this.legislationData.precomputedDetails.forEach(x => {
          x.disableTextbox = false;
        });
      }
    }, 10);
  }

  onRowDeletePrecomputed(precomputedData: preComputedDetailDto, precomputedList: preComputedDetailDto[], index: number) {
    if (this.legislationform.valid || precomputedData.rowSelected) {
      const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
      const precomputed = [...precomputedList];
      if (precomputedData.state == DtoState.Created) {
        this.legislationList[SelectedIndex].state = DtoState.Dirty;
        this.removePreComputedError();
        precomputed.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.splicePrecomputed(precomputed, index);
        }, 100);
      } else {
        precomputedData.state = DtoState.Deleted;
        this.legislationList[SelectedIndex].state = DtoState.Dirty;
        this.removePreComputedError();

        precomputed.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.splicePrecomputed(precomputed, index);
        }, 100);
      }
    } else {
      this.setPreComputedError();
    }
  }

  splicePrecomputed(precomputedData: preComputedDetailDto[], deleteindex: number) {
    precomputedData[deleteindex].isDeleted = true;
    if (precomputedData.length > 0) {
      const UpdatedList = this.deSelectPreComputedTextbox(precomputedData);
      this.legislationData.precomputedDetails = UpdatedList;
      this.legislationData.precomputedDetails[0].rowSelected = true;
    } else {
      this.legislationData.precomputedDetails = [];
    }
  }

  /*Common Methods for PreComputed */

  disableanddeselectPreComputedTextbox(relatedProduct: preComputedDetailDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: preComputedDetailDto) => {
            return {
              ...x,
              disableTextbox: true,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  deSelectPreComputedTextbox(relatedProduct: preComputedDetailDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: preComputedDetailDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Tab Functionality for RevolvingWithRepay */
  onAddRevolvingDetail() {
    if (this.legislationform.valid) {
      this.RemoveErrors();
      this.removeRevolvingError();
      if (this.legislationList.length > 0) {
        const updateLegislationList = [...this.legislationList];
        const prevIndex = updateLegislationList.findIndex(x => x.selectedRow);
        this.legislationList[prevIndex].revolvingDetailsWithRepay = this.disableanddeselectRevolvingTextbox(
          updateLegislationList[prevIndex].revolvingDetailsWithRepay
        );

        const revolvingDetailsWithRepay = new revolvingDetailsWithRepayDto();
        revolvingDetailsWithRepay.state = 1;
        revolvingDetailsWithRepay.isInterestOnly = false;
        revolvingDetailsWithRepay.isDeleted = false;
        revolvingDetailsWithRepay.rowSelected = true;
        revolvingDetailsWithRepay.consumerProductType = this.consumerProductTypeList[1];
        revolvingDetailsWithRepay.disableTextbox = false;
        revolvingDetailsWithRepay.randomNumber = this.generateRandomNumber();

        this.legislationList[prevIndex].revolvingDetailsWithRepay.push({ ...revolvingDetailsWithRepay });
        this.legislationData.revolvingDetailsWithRepay = this.legislationList[prevIndex].revolvingDetailsWithRepay;
        this.legislationData.state = DtoState.Dirty;
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  onrevolvingwithRepaySelect(rowData: revolvingDetailsWithRepayDto) {
    if (rowData) {
      if (this.legislationform.valid || rowData.rowSelected) {
        const revolvingDetailsWithRepayList = this.legislationData.revolvingDetailsWithRepay;
        const prevIndex = revolvingDetailsWithRepayList.findIndex(x => x.rowSelected);
        const deselectedData = this.deSelectRevovlingTextbox(revolvingDetailsWithRepayList);
        this.legislationData.revolvingDetailsWithRepay[prevIndex].rowSelected = deselectedData[prevIndex].rowSelected;

        const Index = this.legislationData.revolvingDetailsWithRepay.findIndex(x => x.randomNumber == rowData.randomNumber);
        this.legislationData.revolvingDetailsWithRepay[Index].rowSelected = true;
        // this.higlightRelatedProduct = this.RelatedProductData[Index];
      } else {
        this.setRevolvingError();
      }
    }
  }

  /*RevolvingwithRepay Change Events */
  onfinanceAmountMinRepayChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithRepay[index].financeAmountMin = parseFloat(floatValue);
          if (
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMin >
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.revolvingDetailsWithRepay.forEach(x => {
              x.disableTextbox = true;
            });

            this.RevolvingwithRepayMinAmountConfig.externalError = true;
          } else {
            this.RevolvingwithRepayMinAmountConfig.externalError = false;
            this.RevolvingwithRepayMaxAmountConfig.externalError = false;
            this.EnableRevolvingRepayTextbox();
            this.legislationform.form.controls['financeAmountMinRepay'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxRepay'+index].setErrors(null);
          }
          this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithRepay[index].financeAmountMin = event;
        if (event == '0,00') {
          this.RevolvingwithRepayMinAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMin = null as unknown as number;

            this.RevolvingwithRepayMinAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }
  onfinanceAmountMaxRepayChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (this.legislationform.valid) {
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = false;
        });
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithRepay[index].financeAmountMax = parseFloat(floatValue);
          if (
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMin >
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.revolvingDetailsWithRepay.forEach(x => {
              x.disableTextbox = true;
            });

            this.RevolvingwithRepayMaxAmountConfig.externalError = true;
          } else {
            this.RevolvingwithRepayMinAmountConfig.externalError = false;
            this.RevolvingwithRepayMaxAmountConfig.externalError = false;
            this.EnableRevolvingRepayTextbox();
            this.legislationform.form.controls['financeAmountMinRepay'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxRepay'+index].setErrors(null);
          }
          this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithRepay[index].financeAmountMax = event;
        if (event == '0,00') {
          this.RevolvingwithRepayMaxAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithRepay[index].financeAmountMax = null as unknown as number;

            this.RevolvingwithRepayMaxAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }
  onaprMaxRepayChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithRepay[index].aprMax = parseFloat(floatValue);
          this.EnableRevolvingRepayTextbox();
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithRepay[index].aprMax = event;
        if (event == '0,00') {
          this.RevolvingwithRepayAPRMaxConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithRepay[index].aprMax = null as unknown as number;

            this.RevolvingwithRepayAPRMaxConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onrevPrincipalRepayAbsMinChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayAbsMin = parseFloat(floatValue);
          this.EnableRevolvingRepayTextbox();
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayAbsMin = event;
        if (event == '0,00') {
          this.RevPrincipalRepayAbsConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayAbsMin = null as unknown as number;

            this.RevPrincipalRepayAbsConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onrevPrincipalRepayRelMaxChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayRelMin = parseFloat(floatValue);
          this.EnableRevolvingRepayTextbox();
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayRelMin = event;
        if (event == '0,00') {
          this.RevPrincipalRepayRelConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithRepay[index].revPrincipalRepayRelMin = null as unknown as number;

            this.RevPrincipalRepayRelConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onmaxCalibrationDurationChange(event: any, rowData: revolvingDetailsWithRepayDto, index: number) {
    const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
    if (event != null && event != '' && +event != 0) {
      if (index >= 0) {
        if (+event > this.intMaxValue) {
          const updateData = this.legislationData.revolvingDetailsWithRepay;
          const updategrid = { ...updateData[index] };
          updategrid.maxCalibrationDuration = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].revolvingDetailsWithRepay[index].maxCalibrationDuration = updategrid.maxCalibrationDuration;
          this.legislationData.revolvingDetailsWithRepay[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          this.RevolvingMaxCalibrationConfig.externalError = true;
          this.legislationData.revolvingDetailsWithRepay.forEach(x => {
            x.disableTextbox = true;
          });

          this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;
        } else {
          const updateData = this.legislationData.revolvingDetailsWithRepay;
          const updategrid = { ...updateData[index] };
          updategrid.maxCalibrationDuration = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].revolvingDetailsWithRepay[index].maxCalibrationDuration = updategrid.maxCalibrationDuration;
          this.legislationData.revolvingDetailsWithRepay[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          if (this.legislationform.valid) {
            this.legislationData.revolvingDetailsWithRepay.forEach(x => {
              x.disableTextbox = false;
            });
          }
        }
      }
    } else {
      const updateData = this.legislationData.revolvingDetailsWithRepay;
      const updategrid = { ...updateData[index] };
      updategrid.maxCalibrationDuration = +event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].revolvingDetailsWithRepay[index].maxCalibrationDuration = null as unknown as number;
      this.legislationData.revolvingDetailsWithRepay[index].state = updategrid.state;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }
      this.RevolvingMaxCalibrationConfig.externalError = true;

      this.legislationData.revolvingDetailsWithRepay.forEach(x => {
        x.disableTextbox = true;
      });

      this.legislationData.revolvingDetailsWithRepay[index].disableTextbox = false;
    }
  }

  EnableRevolvingRepayTextbox() {
    setTimeout(() => {
      if (this.legislationform.valid) {
        this.legislationData.revolvingDetailsWithRepay.forEach(x => {
          x.disableTextbox = false;
        });
      }
    }, 10);
  }

  onRowDeleteRevolvingwithRepay(
    revolvingwithrepay: revolvingDetailsWithRepayDto,
    revolvingwithrepayList: revolvingDetailsWithRepayDto[],
    index: number
  ) {
    if (this.legislationform.valid || revolvingwithrepay.rowSelected) {
      const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
      const updaterevolvingwithrepayList = [...revolvingwithrepayList];
      if (revolvingwithrepay.state == DtoState.Created) {
        this.legislationList[SelectedIndex].state = DtoState.Dirty;

        this.removeRevolvingError();
        updaterevolvingwithrepayList.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.spliceRevolvingwithRepay(updaterevolvingwithrepayList, index);
        }, 100);
      } else {
        revolvingwithrepay.state = DtoState.Deleted;
        this.legislationList[SelectedIndex].state = DtoState.Dirty;

        this.removeRevolvingError();
        updaterevolvingwithrepayList.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.spliceRevolvingwithRepay(updaterevolvingwithrepayList, index);
        }, 200);
      }
    } else {
      this.setRevolvingError();
    }
  }

  spliceRevolvingwithRepay(revolvingRepayData: revolvingDetailsWithRepayDto[], deleteindex: number) {
    revolvingRepayData[deleteindex].isDeleted = true;
    if (revolvingRepayData.length > 0) {
      const UpdatedList = this.deSelectRevovlingTextbox(revolvingRepayData);
      this.legislationData.revolvingDetailsWithRepay = UpdatedList;
      this.legislationData.revolvingDetailsWithRepay[0].rowSelected = true;
    } else {
      this.legislationData.revolvingDetailsWithRepay = [];
    }
  }

  /*Common Methods for RevolvingwithRepay */
  disableanddeselectRevolvingTextbox(relatedProduct: revolvingDetailsWithRepayDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: revolvingDetailsWithRepayDto) => {
            return {
              ...x,
              disableTextbox: true,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  deSelectRevovlingTextbox(relatedProduct: revolvingDetailsWithRepayDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: revolvingDetailsWithRepayDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Tab Functionality for RevolvingWithoutRepay */
  onAddRevolvingwithoutRepay() {
    if (this.legislationform.valid) {
      this.RemoveErrors();
      this.removeRevolvingwithoutRepayError();
      if (this.legislationList.length > 0) {
        const updateLegislationList = [...this.legislationList];
        const prevIndex = updateLegislationList.findIndex(x => x.selectedRow);
        this.legislationList[prevIndex].revolvingDetailsWithoutRepay = this.disableanddeselectRevolvingwithoutRepayTextbox(
          updateLegislationList[prevIndex].revolvingDetailsWithoutRepay
        );

        const revolvingDetailsWithoutRepay = new revolvingDetailsWithoutRepayDto();
        revolvingDetailsWithoutRepay.state = 1;
        revolvingDetailsWithoutRepay.isInterestOnly = true;
        revolvingDetailsWithoutRepay.isDeleted = false;
        revolvingDetailsWithoutRepay.consumerProductType = this.consumerProductTypeList[1];
        revolvingDetailsWithoutRepay.rowSelected = true;
        revolvingDetailsWithoutRepay.disableTextbox = false;
        revolvingDetailsWithoutRepay.randomNumber = this.generateRandomNumber();

        this.legislationList[prevIndex].revolvingDetailsWithoutRepay.push({ ...revolvingDetailsWithoutRepay });
        this.legislationData.revolvingDetailsWithoutRepay = this.legislationList[prevIndex].revolvingDetailsWithoutRepay;
        this.legislationData.state = DtoState.Dirty;
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  onRevolvingwithoutRepaySelect(rowData: revolvingDetailsWithoutRepayDto) {
    if (rowData) {
      if (this.legislationform.valid || rowData.rowSelected) {
        const revolvingDetailsWithoutRepayList = this.legislationData.revolvingDetailsWithoutRepay;
        const prevIndex = revolvingDetailsWithoutRepayList.findIndex(x => x.rowSelected);
        const deselectedData = this.deSelectRevovlingwithoutRepayTextbox(revolvingDetailsWithoutRepayList);
        this.legislationData.revolvingDetailsWithoutRepay[prevIndex].rowSelected = deselectedData[prevIndex].rowSelected;

        const Index = this.legislationData.revolvingDetailsWithoutRepay.findIndex(x => x.randomNumber == rowData.randomNumber);
        this.legislationData.revolvingDetailsWithoutRepay[Index].rowSelected = true;
      } else {
        this.setRevolvingwithoutRepayError();
      }
    }
  }

  /*RevolvingwithoutRepay Change Events */
  onfinanceAmountMinwithoutRepayChange(event: any, rowData: revolvingDetailsWithoutRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithoutRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithoutRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (this.legislationform.valid) {
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = false;
        });
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMin = parseFloat(floatValue);
          if (
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMin >
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
              x.disableTextbox = true;
            });

            this.RevolvingwithoutRepayMinAmountConfig.externalError = true;
          } else {
            this.RevolvingwithoutRepayMinAmountConfig.externalError = false;
            this.RevolvingwithoutRepayMaxAmountConfig.externalError = false;
            this.EnableRevolvingWithoutRepayTextbox();
            this.legislationform.form.controls['financeAmountMinwithoutRepay'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxwithoutRepay'+index].setErrors(null);
          }
          this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMin = event;
        if (event == '0,00') {
          this.RevolvingwithoutRepayMinAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMin = null as unknown as number;

            this.RevolvingwithoutRepayMinAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }
  onfinanceAmountMaxwithoutRepayChange(event: any, rowData: revolvingDetailsWithoutRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithoutRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithoutRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }
      if (this.legislationform.valid) {
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = false;
        });
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMax = parseFloat(floatValue);
          if (
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMin >
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMax
          ) {
            /*Disable TextBox */
            this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
              x.disableTextbox = true;
            });

            this.RevolvingwithoutRepayMaxAmountConfig.externalError = true;
          } else {
            this.RevolvingwithoutRepayMinAmountConfig.externalError = false;
            this.RevolvingwithoutRepayMaxAmountConfig.externalError = false;
            this.EnableRevolvingWithoutRepayTextbox();
            this.legislationform.form.controls['financeAmountMinwithoutRepay'+index].setErrors(null);
            this.legislationform.form.controls['financeAmountMaxwithoutRepay'+index].setErrors(null);
          }
          this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMax = event;
        if (event == '0,00') {
          this.RevolvingwithoutRepayMaxAmountConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithoutRepay[index].financeAmountMax = null as unknown as number;

            this.RevolvingwithoutRepayMaxAmountConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onaprMaxwithoutRepayChange(event: any, rowData: revolvingDetailsWithoutRepayDto, index: number, ischanged: boolean) {
    if (index != -1) {
      if (this.legislationData.revolvingDetailsWithoutRepay[index].state != DtoState.Created) {
        this.legislationData.revolvingDetailsWithoutRepay[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.revolvingDetailsWithoutRepay[index].aprMax = parseFloat(floatValue);
          this.EnableRevolvingWithoutRepayTextbox();
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = true;
        });

        this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;

        this.legislationData.revolvingDetailsWithoutRepay[index].aprMax = event;
        if (event == '0,00') {
          this.RevolvingwithoutAprMaxConfig.externalError = true;
        } else {
          setTimeout(() => {
            this.legislationData.revolvingDetailsWithoutRepay[index].aprMax = null as unknown as number;

            this.RevolvingwithoutAprMaxConfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  onmaxCalibrationwithoutRepayChange(event: any, rowData: revolvingDetailsWithoutRepayDto, index: number) {
    const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
    if (event != null && event != '' && +event != 0) {
      if (index >= 0) {
        if (+event > this.intMaxValue) {
          const updateData = this.legislationData.revolvingDetailsWithoutRepay;
          const updategrid = { ...updateData[index] };
          updategrid.maxCalibrationDuration = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].revolvingDetailsWithoutRepay[index].maxCalibrationDuration =
            updategrid.maxCalibrationDuration;
          this.legislationData.revolvingDetailsWithoutRepay[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }
          this.RevolvingwithoutMaxCalibrationConfig.externalError = true;

          this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
            x.disableTextbox = true;
          });

          this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;
        } else {
          const updateData = this.legislationData.revolvingDetailsWithoutRepay;
          const updategrid = { ...updateData[index] };
          updategrid.maxCalibrationDuration = +event;
          if (updategrid.state != DtoState.Created) {
            updategrid.state = DtoState.Dirty;
          }
          this.legislationList[selectedIndex].revolvingDetailsWithoutRepay[index].maxCalibrationDuration =
            updategrid.maxCalibrationDuration;
          this.legislationData.revolvingDetailsWithoutRepay[index].state = updategrid.state;
          if (this.legislationList[selectedIndex].state != DtoState.Created) {
            this.legislationList[selectedIndex].state = DtoState.Dirty;
          }

          if (this.legislationform.valid) {
            this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
              x.disableTextbox = false;
            });
          }
        }
      }
    } else {
      const updateData = this.legislationData.revolvingDetailsWithoutRepay;
      const updategrid = { ...updateData[index] };
      updategrid.maxCalibrationDuration = +event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].revolvingDetailsWithoutRepay[index].maxCalibrationDuration = null as unknown as number;
      this.legislationData.revolvingDetailsWithoutRepay[index].state = updategrid.state;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }
      this.RevolvingwithoutMaxCalibrationConfig.externalError = true;

      this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
        x.disableTextbox = true;
      });

      this.legislationData.revolvingDetailsWithoutRepay[index].disableTextbox = false;
    }
  }

  EnableRevolvingWithoutRepayTextbox() {
    setTimeout(() => {
      if (this.legislationform.valid) {
        this.legislationData.revolvingDetailsWithoutRepay.forEach(x => {
          x.disableTextbox = false;
        });
      }
    }, 10);
  }

  onRowDeleteRevolvingwithoutRepay(
    revolvingwithoutRepayData: revolvingDetailsWithoutRepayDto,
    revolvingwithoutrepayList: revolvingDetailsWithoutRepayDto[],
    index: number
  ) {
    if (this.legislationform.valid || revolvingwithoutRepayData.rowSelected) {
      const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
      const updaterevolvingwithoutrepayList = [...revolvingwithoutrepayList];
      if (revolvingwithoutRepayData.state == DtoState.Created) {
        this.legislationList[SelectedIndex].state = DtoState.Dirty;

        this.removeRevolvingwithoutRepayError();
        updaterevolvingwithoutrepayList.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.spliceRevolvingwithoutRepay(updaterevolvingwithoutrepayList, index);
        }, 100);
      } else {
        revolvingwithoutRepayData.state = DtoState.Deleted;
        this.legislationList[SelectedIndex].state = DtoState.Dirty;

        this.removeRevolvingwithoutRepayError();
        updaterevolvingwithoutrepayList.forEach(x => {
          x.disableTextbox = false;
        });

        setTimeout(() => {
          this.spliceRevolvingwithoutRepay(updaterevolvingwithoutrepayList, index);
        }, 200);
      }
    } else {
      this.setRevolvingwithoutRepayError();
    }
  }

  spliceRevolvingwithoutRepay(revolvingwithoutRepayData: revolvingDetailsWithoutRepayDto[], deleteindex: number) {
    revolvingwithoutRepayData[deleteindex].isDeleted = true;
    if (revolvingwithoutRepayData.length > 0) {
      const UpdatedList = this.deSelectRevovlingwithoutRepayTextbox(revolvingwithoutRepayData);
      this.legislationData.revolvingDetailsWithoutRepay = UpdatedList;
      this.legislationData.revolvingDetailsWithoutRepay[0].rowSelected = true;
    } else {
      this.legislationData.revolvingDetailsWithoutRepay = [];
    }
  }

  /*Common Methods for RevolvingwithoutRepay */

  disableanddeselectRevolvingwithoutRepayTextbox(relatedProduct: revolvingDetailsWithoutRepayDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: revolvingDetailsWithoutRepayDto) => {
            return {
              ...x,
              disableTextbox: true,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  deSelectRevovlingwithoutRepayTextbox(relatedProduct: revolvingDetailsWithoutRepayDto[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: revolvingDetailsWithoutRepayDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Threshold Grid Functionality */
  onAddThreshold() {
    const isDupExist = this.isDuplicateThresholdExists(this.legislationData.thresholdForCreditBureauRegistrationList);
    if (this.legislationform.valid && !isDupExist) {
      if (this.legislationList.length > 0) {
        this.ThresholdDropdownConfig.externalError = false;
        const updateLegislationList = [...this.legislationList];
        const prevIndex = updateLegislationList.findIndex(x => x.selectedRow);
        this.legislationList[prevIndex].thresholdForCreditBureauRegistrationList = this.deSelectThresholdDropdown(
          updateLegislationList[prevIndex].thresholdForCreditBureauRegistrationList
        );

        const thresholdCredit = new thresholdForCreditBureauRegistrationListDto();
        thresholdCredit.state = 1;
        thresholdCredit.isDeleted = false;
        thresholdCredit.thresholdAmount = 0;
        thresholdCredit.rowSelected = true;

        this.legislationList[prevIndex].thresholdForCreditBureauRegistrationList.push({ ...thresholdCredit });
        this.legislationData.thresholdForCreditBureauRegistrationList =
          this.legislationList[prevIndex].thresholdForCreditBureauRegistrationList;
        this.legislationData.state = DtoState.Dirty;
      }
    } else {
      if (isDupExist) {
        this.throwBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.ThresholdBusiness'));
        this.setExternalError();
        this.setRevolvingwithoutRepayError();
        this.setPreComputedError();
        this.setRevolvingError();
        this.ThresholdDropdownConfig.externalError = true;
      } else {
        this.setExternalError();
        this.setRevolvingwithoutRepayError();
        this.setPreComputedError();
        this.setRevolvingError();
        this.ThresholdDropdownConfig.externalError = true;
      }
    }
  }

  onThresholdRowSelect(rowData: thresholdForCreditBureauRegistrationListDto) {
    if (rowData) {
      if (this.legislationform.valid || rowData.rowSelected) {
        const thresholdListList = this.legislationData.thresholdForCreditBureauRegistrationList;
        const prevIndex = thresholdListList.findIndex(x => x.rowSelected);

        const deselectedData = this.deSelectThresholdDropdown(thresholdListList);
        this.legislationData.thresholdForCreditBureauRegistrationList[prevIndex].rowSelected = deselectedData[prevIndex].rowSelected;

        const Index = this.legislationData.thresholdForCreditBureauRegistrationList.findIndex(x => x.randomNumber == rowData.randomNumber);
        this.legislationData.thresholdForCreditBureauRegistrationList[Index].rowSelected = true;
        // this.higlightRelatedProduct = this.RelatedProductData[Index];
      } else {
        this.ThresholdDropdownConfig.externalError = true;
      }
    }
  }

  onretailLendingSubTypeChange(event: any, rowData: thresholdForCreditBureauRegistrationListDto, index: number) {
    const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
    const ThresholdList = this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList;
    const ThresholdSelectedIndex = ThresholdList.findIndex(x => x.rowSelected);
    const updatedThresholdList = this.deSelectThresholdDropdown(
      this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList
    );
    this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[ThresholdSelectedIndex].rowSelected =
      updatedThresholdList[ThresholdSelectedIndex].rowSelected;
    this.legislationData.thresholdForCreditBureauRegistrationList[ThresholdSelectedIndex].rowSelected =
      updatedThresholdList[ThresholdSelectedIndex].rowSelected;

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.legislationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.thresholdForCreditBureauRegistrationList[index].retailLendingSubType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].state != DtoState.Created) {
        this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].retailLendingSubType =
        updategrid.thresholdForCreditBureauRegistrationList[index].retailLendingSubType;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }
      this.legislationData.thresholdForCreditBureauRegistrationList[index].retailLendingSubType = event.value;
      this.legislationData.thresholdForCreditBureauRegistrationList[index].rowSelected = true;
    } else if (event?.value == null) {
      const updateData = this.legislationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.thresholdForCreditBureauRegistrationList[index].retailLendingSubType = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].state != DtoState.Created) {
        this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].state = DtoState.Dirty;
      }
      this.legislationList[selectedIndex].thresholdForCreditBureauRegistrationList[index].retailLendingSubType =
        updategrid.thresholdForCreditBureauRegistrationList[index].retailLendingSubType;
      if (this.legislationList[selectedIndex].state != DtoState.Created) {
        this.legislationList[selectedIndex].state = DtoState.Dirty;
      }
      this.legislationData.thresholdForCreditBureauRegistrationList[index].retailLendingSubType = null;
      this.legislationData.thresholdForCreditBureauRegistrationList[index].rowSelected = true;

      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  onthresholdAmountChange(event: any, rowData: thresholdForCreditBureauRegistrationListDto, index: number, ischanged: boolean) {
    if (index != -1) {
      const selectedIndex = this.legislationList.findIndex((x: legislationDto) => x.selectedRow);
      if (this.legislationData.thresholdForCreditBureauRegistrationList[index].state != DtoState.Created) {
        this.legislationData.thresholdForCreditBureauRegistrationList[index].state = DtoState.Dirty;
      }
      if (this.legislationData.state != DtoState.Created) {
        this.legislationData.state = DtoState.Dirty;
      }

      if (event != null && event != '') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.legislationData.thresholdForCreditBureauRegistrationList[index].thresholdAmount = parseFloat(floatValue);
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        setTimeout(() => {
          this.legislationData.thresholdForCreditBureauRegistrationList[index].thresholdAmount = 0;
        }, 4);
      }
    }
  }

  onThresholdDelete(
    thresholdCreditData: thresholdForCreditBureauRegistrationListDto,
    thresholdCreditList: thresholdForCreditBureauRegistrationListDto[],
    index: number
  ) {
    let isNullCheck = false;
    const thresholdData = [...thresholdCreditList];
    for (let i = 0; i < thresholdData.length; i++) {
      if (!thresholdData[i].retailLendingSubType || thresholdData[i].retailLendingSubType === <codeTable>{}) {
        isNullCheck = true;
        break;
      }
    }

    if (isNullCheck) {
      if (thresholdCreditData.retailLendingSubType) {
        this.ThresholdDropdownConfig.externalError = true;
        return;
      }
    }

    const SelectedIndex = this.legislationList.findIndex(x => x.selectedRow);
    if (thresholdCreditData.state == DtoState.Created) {
      this.legislationList[SelectedIndex].state = DtoState.Dirty;
      thresholdCreditData.retailLendingSubType = <CodeTable>{};

      setTimeout(() => {
        this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.ThresholdBusiness'));
        this.spliceThresholdForCreditBureau(thresholdData, index);
      }, 100);
    } else {
      thresholdCreditData.state = DtoState.Deleted;
      this.legislationList[SelectedIndex].state = DtoState.Dirty;
      thresholdCreditData.retailLendingSubType = <CodeTable>{};
      setTimeout(() => {
        this.RemoveBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.ThresholdBusiness'));
        this.spliceThresholdForCreditBureau(thresholdData, index);
      }, 200);
    }
  }

  spliceThresholdForCreditBureau(thresholdList: thresholdForCreditBureauRegistrationListDto[], deleteIndex: number) {
    thresholdList[deleteIndex].isDeleted = true;

    if (thresholdList.length > 0) {
      const UpdatedList = this.deSelectThresholdDropdown(thresholdList);
      this.legislationData.thresholdForCreditBureauRegistrationList = UpdatedList;
      this.legislationData.thresholdForCreditBureauRegistrationList[0].rowSelected = true;
    } else {
      this.legislationData.thresholdForCreditBureauRegistrationList = [];
    }
    this.ThresholdDropdownConfig.externalError = false;
  }

  /*Validation for Threshold*/
  isDuplicateThresholdExists(newgridDate: thresholdForCreditBureauRegistrationListDto[]) {
    const removeNullDateValue = newgridDate.filter(
      (data: thresholdForCreditBureauRegistrationListDto) => data?.retailLendingSubType && data?.retailLendingSubType != null
    );
    const uniqueValues = [
      ...new Set(removeNullDateValue.map((data: thresholdForCreditBureauRegistrationListDto) => data.retailLendingSubType?.caption))
    ];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  checkThresholdDuplicate(legislationList: legislationDto[]) {
    let periodReturn = true;
    const cloneLegistationList = legislationList.map(lesigistate => {
      const updateLegistate = { ...lesigistate };
      if (
        updateLegistate?.thresholdForCreditBureauRegistrationList &&
        updateLegistate.thresholdForCreditBureauRegistrationList.length > 0
      ) {
        updateLegistate.thresholdForCreditBureauRegistrationList = updateLegistate.thresholdForCreditBureauRegistrationList.map(x => {
          return { ...x };
        });
      }

      return updateLegistate;
    });

    const CheckLegislationList = [...cloneLegistationList];

    for (let i = 0; i < CheckLegislationList.length; i++) {
      if (CheckLegislationList[i].thresholdForCreditBureauRegistrationList.length > 0) {
        const isDupExist = this.isDuplicateThresholdExists(CheckLegislationList[i].thresholdForCreditBureauRegistrationList);
        if (isDupExist) {
          this.throwBusinessError(this.translate.instant('app-instance.manage-legislation.BusinessError.ThresholdBusiness'));
          periodReturn = false;
          break;
        }
      }
    }
    return periodReturn;
  }

  /*Common Method for Threshold */
  deSelectThresholdDropdown(threshold: thresholdForCreditBureauRegistrationListDto[]) {
    const deSelectData = threshold;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: thresholdForCreditBureauRegistrationListDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  /*Save Functionality */
  onSave(legislationList: legislationDto[]) {
    if (this.legislationform.valid) {
      const tabDataExist = this.checkPeriodExist(this.legislationList);
      const isLegislationValid = this.IsLegislationDateRangeValid(this.legislationList);
      const isThreholdCreditValid = this.checkThresholdDuplicate(this.legislationList);

      if (tabDataExist && isLegislationValid && isThreholdCreditValid) {
        this.RemoveErrors()
        /*Filter Deleted Array */
        legislationList.forEach(x => {
          const notDeleted = x.precomputedDetails.filter(y => y.isDeleted == false);

          x.precomputedDetails = notDeleted;
        });

        legislationList.forEach(x => {
          const notDeleted = x.revolvingDetailsWithRepay.filter(y => y.isDeleted == false);
          x.revolvingDetailsWithRepay = notDeleted;
        });

        legislationList.forEach(x => {
          const notDeleted = x.revolvingDetailsWithoutRepay.filter(y => y.isDeleted == false);
          x.revolvingDetailsWithoutRepay = notDeleted;
        });
        legislationList.forEach(x => {
          const notDeleted = x.thresholdForCreditBureauRegistrationList.filter(y => y.isDeleted == false);
          x.thresholdForCreditBureauRegistrationList = notDeleted;
        });

        legislationList.map(legislationData => {
          if (legislationData.state != 0) {
            legislationData.startDate = new Date(
              Date.UTC(
                legislationData.startDate.getFullYear(),
                legislationData.startDate.getMonth(),
                legislationData.startDate.getDate(),
                0,
                0,
                0
              )
            );
            if (legislationData.endDate != null) {
              legislationData.endDate = new Date(
                Date.UTC(
                  legislationData.endDate.getFullYear(),
                  legislationData.endDate.getMonth(),
                  legislationData.endDate.getDate(),
                  0,
                  0,
                  0
                )
              );
            }

            this.deletedLegislationData.push({ ...legislationData });
          }
        });

        this.legislationService.saveLegislation(this.deletedLegislationData).subscribe(
          data => {
            this.spinnerService.setIsLoading(false);
            this.deletedLegislationData = [];
            if (this.searchlegislation.activeDate) {
              this.searchlegislation.activeDate = new Date(
                Date.UTC(
                  this.searchlegislation?.activeDate?.getFullYear(),
                  this.searchlegislation?.activeDate?.getMonth(),
                  this.searchlegislation?.activeDate?.getDate(),
                  0,
                  0,
                  0
                )
              );
            }
            this.legislationService.searchLegislation(this.searchlegislation).subscribe(
              (data: any) => {
                this.spinnerService.setIsLoading(false);
                const updatedResponse = data.items.map((legislationData: legislationDto) => {
                  const updatePreComputed = legislationData.precomputedDetails.map(x => {
                    return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
                  });

                  const updateRevolvingwithRepay = legislationData.revolvingDetailsWithRepay.map(x => {
                    return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
                  });

                  const updateRevolvingwithoutRepay = legislationData.revolvingDetailsWithoutRepay.map(x => {
                    return { ...x, isDeleted: false, rowSelected: false, disableTextbox: false, randomNumber: this.generateRandomNumber() };
                  });

                  const updatethreshold = legislationData.thresholdForCreditBureauRegistrationList.map(x => {
                    return { ...x, isDeleted: false, rowSelected: false, randomNumber: this.generateRandomNumber() };
                  });

                  return {
                    ...legislationData,
                    startDate: new Date(legislationData?.startDate),
                    modifiedStartDate: this.datePipe.transform(legislationData?.startDate, 'dd/MM/yyyy'),
                    endDate: new Date(legislationData.endDate as Date),
                    modifiedEndDate: this.datePipe.transform(legislationData?.endDate, 'dd/MM/yyyy'),
                    randomNumber: this.generateRandomNumber(),
                    precomputedDetails: updatePreComputed,
                    revolvingDetailsWithRepay: updateRevolvingwithRepay,
                    revolvingDetailsWithoutRepay: updateRevolvingwithoutRepay,
                    thresholdForCreditBureauRegistrationList: updatethreshold,
                    selectedRow: false
                  };
                });
                updatedResponse.forEach((x: legislationDto) => {
                  if (x.modifiedEndDate == null) x.endDate = null;
                });
                if (updatedResponse.length > 0) {
                  this.legislationList = updatedResponse;
                  const selectedLegislationIndex = this.legislationList.findIndex(
                    x => x.country?.codeId == this.legislationData.country?.codeId &&
                    x?.modifiedStartDate == this.legislationData?.modifiedStartDate && 
                    x.modifiedEndDate == this.legislationData.modifiedEndDate
                  );
                  this.legislationList[selectedLegislationIndex].selectedRow = true;
                  this.hideCard = true;
                  if (this.legislationList[selectedLegislationIndex].precomputedDetails.length > 0) {
                    this.legislationList[selectedLegislationIndex].precomputedDetails[0].rowSelected = true;
                  }
                  if (this.legislationList[selectedLegislationIndex].revolvingDetailsWithRepay.length > 0) {
                    this.legislationList[selectedLegislationIndex].revolvingDetailsWithRepay[0].rowSelected = true;
                  }
                  if (this.legislationList[selectedLegislationIndex].revolvingDetailsWithoutRepay.length > 0) {
                    this.legislationList[selectedLegislationIndex].revolvingDetailsWithoutRepay[0].rowSelected = true;
                  }
                  if (this.legislationList[selectedLegislationIndex].thresholdForCreditBureauRegistrationList.length > 0) {
                    this.legislationList[selectedLegislationIndex].thresholdForCreditBureauRegistrationList[0].rowSelected = true;
                  }
                  this.legislationData = this.legislationList[selectedLegislationIndex];
                  this.SelectedLegislationDetail = this.legislationList[selectedLegislationIndex];
                }
                this.minDate = new Date(this.legislationData.startDate);
                this.minDate.setDate(this.minDate.getDate() + 1);
              },
              err => {
                this.spinnerService.setIsLoading(false);
                this.deletedLegislationData = [];
                if(err?.error?.errorCode){
                  this.errorCode = err.error.errorCode;
                }else{
                  this.errorCode = 'InternalServiceFault';
                }
                this.exceptionBox = true;
              }
            );
          },
          err => {
            if (err.error.toString().indexOf('legislation object') > -1) {
              this.deletedLegislationData = [];
              this.spinnerService.setIsLoading(false);
              this.throwBusinessError(err.error.split('"')[1]);
            } else {
              this.deletedLegislationData = [];
              if(err?.error?.errorCode){
                this.errorCode = err.error.errorCode;
              }else{
                this.errorCode = 'InternalServiceFault';
              }
              
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            }
          }
        );
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  /*Close Dialog Functionality */
  onClose() {
    const isChangedIndexExist = this.legislationList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedLegislationData.length > 0) {
      this.showDialog = true;
    } else {
      this.RemoveErrors();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(legislationList: legislationDto[]) {
    this.showDialog = false;

    if (this.legislationform.valid) {
      const tabDataExist = this.checkPeriodExist(this.legislationList);
      const isLegislationValid = this.IsLegislationDateRangeValid(this.legislationList);
      const isThreholdCreditValid = this.checkThresholdDuplicate(this.legislationList);
      if (tabDataExist && isLegislationValid && isThreholdCreditValid) {
        this.onSave(legislationList);
        window.location.assign(this.navigateURL);
      }
    } else {
      this.setExternalError();
      this.setRevolvingwithoutRepayError();
      this.setPreComputedError();
      this.setRevolvingError();
      this.ThresholdDropdownConfig.externalError = true;
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.RemoveErrors();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  /*Exception Dialog Functionality */
  onException() {
    this.exceptionBox = false;
    this.onSearch(this.searchlegislation)
  }

  /*Validation*/
  setExternalError() {
    this.RequiredAutoComplete.externalError = true;
    this.RequiredDateConfig.externalError = true;
  }

  setPreComputedError() {
    this.PreComputedMinAmountConfig.externalError = true;
    this.PreComputedMaxAmountConfig.externalError = true;
    this.PreComputedMinDurationConfig.externalError = true;
    this.PreComputedMaxDurationConfig.externalError = true;
    this.PreComputedAprMaxConfig.externalError = true;
  }

  removePreComputedError() {
    this.PreComputedMinAmountConfig.externalError = false;
    this.PreComputedMaxAmountConfig.externalError = false;
    this.PreComputedMinDurationConfig.externalError = false;
    this.PreComputedMaxDurationConfig.externalError = false;
    this.PreComputedAprMaxConfig.externalError = false;
  }

  setRevolvingError() {
    this.RevolvingwithRepayMinAmountConfig.externalError = true;
    this.RevolvingwithRepayMaxAmountConfig.externalError = true;
    this.RevolvingwithRepayAPRMaxConfig.externalError = true;
    this.RevPrincipalRepayAbsConfig.externalError = true;
    this.RevPrincipalRepayRelConfig.externalError = true;
    this.RevolvingMaxCalibrationConfig.externalError = true;
  }

  removeRevolvingError() {
    this.RevolvingwithRepayMinAmountConfig.externalError = false;
    this.RevolvingwithRepayMaxAmountConfig.externalError = false;
    this.RevolvingwithRepayAPRMaxConfig.externalError = false;
    this.RevPrincipalRepayAbsConfig.externalError = false;
    this.RevPrincipalRepayRelConfig.externalError = false;
    this.RevolvingMaxCalibrationConfig.externalError = false;
  }

  removeExternalError() {
    this.RequiredAutoComplete.externalError = false;
    this.RequiredDateConfig.externalError = false;
  }

  setRevolvingwithoutRepayError() {
    this.RevolvingwithoutRepayMinAmountConfig.externalError = true;
    this.RevolvingwithoutRepayMaxAmountConfig.externalError = true;
    this.RevolvingwithoutAprMaxConfig.externalError = true;
    this.RevolvingwithoutMaxCalibrationConfig.externalError = true;
  }

  removeRevolvingwithoutRepayError() {
    this.RevolvingwithoutRepayMinAmountConfig.externalError = false;
    this.RevolvingwithoutRepayMaxAmountConfig.externalError = false;
    this.RevolvingwithoutAprMaxConfig.externalError = false;
    this.RevolvingwithoutMaxCalibrationConfig.externalError = false;
  }

  splicePreComputedError() {
    /*Splice Model Error */
    const PreComputedMinAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (PreComputedMinAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(PreComputedMinAmnt, 1);
    }

    const PreComputedMaxAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (PreComputedMaxAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(PreComputedMaxAmnt, 1);
    }

    const PreComputedMinDuration = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.MinDuration') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (PreComputedMinDuration >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(PreComputedMinDuration, 1);
    }

    const PreComputedMaxDuration = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.MaxDuration') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (PreComputedMaxDuration >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(PreComputedMaxDuration, 1);
    }

    const aprMax = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (aprMax >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(aprMax, 1);
    }

    /*Splice Min Max Error */

    const MinError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Min finance amount should not exceed Max finance amount'
    );
    if (MinError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MinError, 1);
    }

    const MaxError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Max finance amount should not be lesser Min finance amount'
    );
    if (MaxError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MaxError, 1);
    }
    const Int32Error = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check')
    );
    if (Int32Error >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Int32Error, 1);
    }
  }

  spliceRevolvingwithRepayError() {
    /*Splice Model Error */
    const RevMinAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevMinAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevMinAmnt, 1);
    }

    const RevMaxAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevMaxAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevMaxAmnt, 1);
    }

    const RevAbsMinDuration = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalMin') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevAbsMinDuration >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevAbsMinDuration, 1);
    }

    const RevRelMinDuration = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.RevPrincipalRelMin') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevRelMinDuration >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevRelMinDuration, 1);
    }

    const RevMax = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevMax >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevMax, 1);
    }

    const RevAPRMax = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevAPRMax >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevAPRMax, 1);
    }

    /*Splice Min Max Error */

    const MinError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Min finance amount should not exceed Max finance amount'
    );
    if (MinError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MinError, 1);
    }

    const MaxError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Max finance amount should not be lesser Min finance amount'
    );
    if (MaxError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MaxError, 1);
    }

    const Int32Error = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check')
    );
    if (Int32Error >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Int32Error, 1);
    }
  }

  spliceRevolvingWithoutRepayError() {
    /*Splice Model Error */
    const RevwoMinAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMin') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevwoMinAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevwoMinAmnt, 1);
    }

    const RevwoMaxAmnt = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.FinanceMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevwoMaxAmnt >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevwoMaxAmnt, 1);
    }

    const RevwoAPRError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.aprMax') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevwoAPRError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevwoAPRError, 1);
    }

    const RevwoMaxError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.RevMaxDuration') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (RevwoMaxError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(RevwoMaxError, 1);
    }

    /*Splice Min Max Error */

    const MinError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Min finance amount should not exceed Max finance amount'
    );
    if (MinError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MinError, 1);
    }

    const MaxError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == 'Max finance amount should not be lesser Min finance amount'
    );
    if (MaxError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(MaxError, 1);
    }

    const Int32Error = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('app-instance.manage-legislation.ValidationError.numberInt32Check')
    );
    if (Int32Error >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Int32Error, 1);
    }
  }

  spliceThresholdError() {
    const thresholdError = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('app-instance.manage-legislation.ValidationError.retailLending') +
          this.translate.instant('app-instance.manage-legislation.ValidationError.required')
    );
    if (thresholdError >= 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(thresholdError, 1);
    }
  }
}

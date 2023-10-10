import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { codeTable } from './Models/codeTable.model';
import { customerRef } from './Models/customerRef.model';
import { initiatorRef } from './Models/initiatorRef.model';
import { legalEntityRef } from './Models/legalEntityRef.model';
import { paymentPlanReminder } from './Models/paymentPlanReminder.model';
import { planConfigInput } from './Models/planConfigInput.model';
import { planDerivationCriteria } from './Models/planDerivationCriteria.model';
import { planDerivationCriteriaConfigInitialResponse } from './Models/planDerivationCriteriaConfigInitialResponse.model';
import { planType } from './Models/planType.model';
import { stateModel } from './Models/state.model';
import { treatmentPlan } from './Models/treatmentPlan.model';
import { treatmentPlanConfigResponse } from './Models/treatmentPlanConfigResponse.model';
import { treatmentPlanConfiguration } from './Models/treatmentPlanConfiguration.model';
import { TreatmentPlanService } from './Service/treatment-plan.service';

@Component({
  selector: 'mpc-manage-treatment-plan-config',
  templateUrl: './manage-treatment-plan-config.component.html',
  styleUrls: ['./manage-treatment-plan-config.component.scss']
})
export class ManageTreatmentPlanConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CaptionTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxWarningTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public ImportTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinInstallTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AfterPromise1Boxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AfterPromise2TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PriorityTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinAvgTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxAvgTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public TerminateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public FinalizeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ActivateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DeactivateDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public AutoCompleteTextBoxconfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public LegalAutoCompleteTextBoxconfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public ValidFromDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public MinAmtTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxAmtTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public followUpEventName1Dropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public lastPromiseEvent1Dropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public followUpEventName2Dropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public lastPromiseEvent2Dropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  placeholder = 'select';
  Header = this.translate.instant('plan.Validation.Header')
  getInitialData!: planDerivationCriteriaConfigInitialResponse
  treatmentGridData: treatmentPlanConfigResponse = new treatmentPlanConfigResponse
  treatmentPlanCard!: treatmentPlanConfiguration
  planConfigInput: planConfigInput = new planConfigInput
  paymentReminder!: boolean;
  paymentNotification!: boolean;
  paginationContent!: string
  recordsAvailable = 0;
  pageRow = 10;
  resetPagination = 0;
  maxLimitForNumbers = 2147483647;
  minLimitForNumbers = -2147483648;
  dataSelected: any
  index: any
  isErrors!: boolean;
  show!: boolean
  exceptionBox!: boolean
  treat1Header!: any[];
  treat2Header!: any[];
  treat3Header!: any[];
  filteredLegal: legalEntityRef[] = []
  filteredCustomer: customerRef[] = []
  filteredInitiator: initiatorRef[] = []
  numberErrorDto: ErrorDto[] = [];
  minAvgErrorDto: ErrorDto[] = [];
  maxAvgErrorDto: ErrorDto[] = [];
  minAmtErrorDto: ErrorDto[] = [];
  maxAmtErrorDto: ErrorDto[] = [];
  recordsOfPlanRemainder: paymentPlanReminder[] = []
  navigateUrl!: string
  SelectedTabIndex!: number
  errorCode!: string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public treatmentplanService: TreatmentPlanService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService, public datePipe: DatePipe) {

    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {

      this.SelectedTabIndex = selectedTabIndex;

    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl

  }

  settingFalse() {
    if (this.treatmentGridData.treatmentPlanConfigList.items.length > 0) {
      this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  //tab 1

  changeName(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.name = event;
      this.treatmentPlanCard.treatmentPlan.name = event;
    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.name = null as unknown as string;
      this.treatmentPlanCard.treatmentPlan.name = null as unknown as string;
      this.NameTextBoxconfig.externalError = true;

    }
  }

  changeManualFollowUp(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.isRemindedManually = event;
    this.treatmentPlanCard.treatmentPlan.isRemindedManually = event;

  }

  changeManualPayment(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.isPaidOutManually = event;
    this.treatmentPlanCard.treatmentPlan.isPaidOutManually = event;

  }

  changeManualOutgoing(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.isAllocatedManually = event;
    this.treatmentPlanCard.treatmentPlan.isAllocatedManually = event;

  }

  // tab 2

  changeCaptionPayment(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanTerminateDaysAfterLastReminder = parseInt(event);
      this.treatmentPlanCard.treatmentPlan.paymentPlanTerminateDaysAfterLastReminder = parseInt(event);
      if (event > this.maxLimitForNumbers) {
        this.CaptionTextBoxconfig.externalError = true;
      }
      else {
        this.CaptionTextBoxconfig.externalError = false;
      }
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanTerminateDaysAfterLastReminder = event;

      setTimeout(() => {
        this.treatmentPlanCard.treatmentPlan.paymentPlanTerminateDaysAfterLastReminder = 0;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanTerminateDaysAfterLastReminder = 0
      }, 3)

    }

  }

  changeMaxWarning(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanMaxWarnings = parseInt(event);
      this.treatmentPlanCard.treatmentPlan.paymentPlanMaxWarnings = parseInt(event);
      if (event > this.maxLimitForNumbers) {
        this.MaxWarningTextBoxconfig.externalError = true;
      }
      else {
        this.MaxWarningTextBoxconfig.externalError = false;
      }
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanMaxWarnings = event;

      setTimeout(() => {
        this.treatmentPlanCard.treatmentPlan.paymentPlanMaxWarnings = 0;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanMaxWarnings = 0
      }, 3)

    }

  }

  changeGraceAmount(event: any, isChanged: boolean) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanGraceAmount = parseFloat(floatValue);
        this.treatmentPlanCard.treatmentPlan.paymentPlanGraceAmount = parseFloat(floatValue)
      }

    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanGraceAmount = 0.00001;
      setTimeout(() => {
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanGraceAmount = 0;
        this.treatmentPlanCard.treatmentPlan.paymentPlanGraceAmount = 0;

      }, 1)

    }
  }

  changeMinInstallment(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanMinimumInstallmentAmount = parseInt(event);
      this.treatmentPlanCard.treatmentPlan.paymentPlanMinimumInstallmentAmount = parseInt(event);
      if (event > this.maxLimitForNumbers) {
        this.MinInstallTextBoxconfig.externalError = true;
      }
      else {
        this.MinInstallTextBoxconfig.externalError = false;
      }
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanMinimumInstallmentAmount = event;

      setTimeout(() => {
        this.treatmentPlanCard.treatmentPlan.paymentPlanMinimumInstallmentAmount = 0;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanMinimumInstallmentAmount = 0
      }, 3)
    }


  }

  changeImportDays(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanStartDateFromImportDays = parseInt(event);
      this.treatmentPlanCard.treatmentPlan.paymentPlanStartDateFromImportDays = parseInt(event);
      if (event > this.maxLimitForNumbers) {
        this.ImportTextBoxconfig.externalError = true;
      }
      else {
        this.ImportTextBoxconfig.externalError = false;
      }
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanStartDateFromImportDays = event;

      setTimeout(() => {
        this.treatmentPlanCard.treatmentPlan.paymentPlanStartDateFromImportDays = 0;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanStartDateFromImportDays = 0
      }, 3)

    }


  }

  changeEnforceMinDue(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.enforceMinDueAmount = event;
    this.treatmentPlanCard.treatmentPlan.enforceMinDueAmount = event;

  }

  changeEnforceMinPromise(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.enforceMinPromiseAmount = event;
    this.treatmentPlanCard.treatmentPlan.enforceMinPromiseAmount = event;

  }

  changeAutomaticDossier(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.automaticDossierClosureAtPaymentPlanFinalization = event;
    this.treatmentPlanCard.treatmentPlan.automaticDossierClosureAtPaymentPlanFinalization = event;

  }

  changeDossierClosure(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.dossierClosureAllowedWithPreventivePaymentPlan = event;
    this.treatmentPlanCard.treatmentPlan.dossierClosureAllowedWithPreventivePaymentPlan = event;

  }

  // tab 3

  changePRDaysAfterPromise(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state = stateModel.Dirty;
    }
    if (event != null && event <= this.maxLimitForNumbers && event >= this.minLimitForNumbers) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].numberOfDaysAfterPromise = parseInt(event);
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].numberOfDaysAfterPromise = event;
      if (event > this.maxLimitForNumbers || event < this.minLimitForNumbers) {
        this.AfterPromise1Boxconfig.externalError = true;
      }
      else {
        setTimeout(() => {
          this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].numberOfDaysAfterPromise = null as unknown as number;
          this.AfterPromise1Boxconfig.externalError = true;

        }, 3)
      }
    }


  }

  changePRFollowUpEventName(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].followUpEventName = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].followUpEventName = null as unknown as codeTable;
      this.followUpEventName1Dropdown.externalError = true;
    }
  }

  changePRLastPromiseEvent(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].lastPromiseEvent = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].lastPromiseEvent = null as unknown as codeTable;
      this.lastPromiseEvent1Dropdown.externalError = true;
    }
  }

  changePRPaymentMethod(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminder[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].paymentMethod = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder[index].paymentMethod = null as unknown as codeTable;
    }
  }

  changePNDaysBeforePromise(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state = stateModel.Dirty;
    }
    if (event != null && event <= this.maxLimitForNumbers && event >= this.minLimitForNumbers) {

      const beforePromise = this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].numberOfDaysBeforePromise = parseInt(event);
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].numberOfDaysAfterPromise = beforePromise * -1;
    }
    else {

      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].numberOfDaysBeforePromise = event;
      if (event > this.maxLimitForNumbers || event < this.minLimitForNumbers) {
        this.AfterPromise2TextBoxconfig.externalError = true;
      }
      else {
        setTimeout(() => {
          this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].numberOfDaysBeforePromise = null as unknown as number;
          this.AfterPromise2TextBoxconfig.externalError = true;

        }, 3)
      }
    }
  }

  changePNFollowUpEventName(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].followUpEventName = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].followUpEventName = null as unknown as codeTable;
      this.followUpEventName2Dropdown.externalError = true;
    }
  }

  changePNLastPromiseEvent(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].lastPromiseEvent = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].lastPromiseEvent = null as unknown as codeTable;
      this.lastPromiseEvent2Dropdown.externalError = true;
    }
  }

  changePNPaymentMethod(event: any, index: number) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanNotification[index].state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].paymentMethod = event?.value;

    }
    else {
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification[index].paymentMethod = null as unknown as codeTable;
    }
  }

  changeNoMatching(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.noMachtingPaymentAmountEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.noMachtingPaymentAmountEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.noMachtingPaymentAmountEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.noMachtingPaymentAmountEvent = null as unknown as codeTable;
    }
  }

  changeExcessiveAmount(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.remainingPromiseAmountEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.remainingPromiseAmountEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.remainingPromiseAmountEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.remainingPromiseAmountEvent = null as unknown as codeTable;
    }
  }

  changeTerminate(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.terminatePaymentPlanEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.terminatePaymentPlanEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.terminatePaymentPlanEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.terminatePaymentPlanEvent = null as unknown as codeTable;
      this.TerminateDropdownConfig.externalError = true;
    }
  }

  changeFinalize(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.finalizePaymentPlanEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.finalizePaymentPlanEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.finalizePaymentPlanEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.finalizePaymentPlanEvent = null as unknown as codeTable;
      this.FinalizeDropdownConfig.externalError = true;
    }
  }

  changeActivate(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.activatePaymentPlan = event?.value;
      this.treatmentPlanCard.treatmentPlan.activatePaymentPlan = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.activatePaymentPlan = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.activatePaymentPlan = null as unknown as codeTable;
      this.ActivateDropdownConfig.externalError = true;
    }
  }

  changeDeactivate(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.deactivatePaymentPlan = event?.value;
      this.treatmentPlanCard.treatmentPlan.deactivatePaymentPlan = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.deactivatePaymentPlan = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.deactivatePaymentPlan = null as unknown as codeTable;
      this.DeactivateDropdownConfig.externalError = true;
    }
  }

  changePromiseIsmetEvent(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsMetEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.promiseIsMetEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsMetEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.promiseIsMetEvent = null as unknown as codeTable;
    }
  }

  changePromiseIsMetAfterResetEvent(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsMetAfterResetEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.promiseIsMetAfterResetEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsMetAfterResetEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.promiseIsMetAfterResetEvent = null as unknown as codeTable;
    }
  }

  changePromiseIsResetEvent(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsResetEvent = event?.value;
      this.treatmentPlanCard.treatmentPlan.promiseIsResetEvent = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.promiseIsResetEvent = null as unknown as codeTable;
      this.treatmentPlanCard.treatmentPlan.promiseIsResetEvent = null as unknown as codeTable;
    }
  }

  // tab 4

  changeLegal(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const legal = this.getInitialData.legalEntityList.filter(x => {
        return x.hostedOrganizationName == event?.hostedOrganizationName;
      })
      if (legal[0] != null) {

        this.treatmentPlanCard.planDerivationCriteria.legalEntity = legal[0];
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.legalEntity = legal[0];

      }
    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
      this.LegalAutoCompleteTextBoxconfig.externalError = true;
    }
  }

  filterLegal(event: any) {
    if (event) {
      this.filteredLegal = [];

      this.getInitialData.legalEntityList
        .filter(data => {
          if (data.hostedOrganizationName?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredLegal.push(data);
          }

        });
    }
  }

  clearLegal(event: any) {
    setTimeout(() => {
      this.LegalAutoCompleteTextBoxconfig.externalError = true;
    }, 100)
  }

  changeCustomer(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const customer = this.getInitialData.customerList.filter(x => {
        return x.name == event?.name;
      })
      if (customer[0] != null) {

        this.treatmentPlanCard.planDerivationCriteria.customer = customer[0];
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.customer = customer[0];

      }
    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.customer = null as unknown as customerRef
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.customer = null as unknown as customerRef

    }
  }

  filterCustomer(event: any) {
    if (event) {
      this.filteredCustomer = [];

      this.getInitialData.customerList
        .filter(data => {
          if (data.name?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredCustomer.push(data);
          }

        });
    }
  }

  changeInitiator(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const initiator = this.getInitialData.initiatorList.filter(x => {
        return x.name == event?.name;
      })
      if (initiator[0] != null) {

        this.treatmentPlanCard.planDerivationCriteria.initiator = initiator[0];
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.initiator = initiator[0];

      }
    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.initiator = null as unknown as initiatorRef
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.initiator = null as unknown as initiatorRef

    }
  }

  filterInitiator(event: any) {
    if (event) {
      this.filteredInitiator = [];

      this.getInitialData.initiatorList
        .filter(data => {
          if (data.name?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredInitiator.push(data);
          }

        });
    }
  }

  changeLegalCheck(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.isLegalEntityIndependent = event;
    this.treatmentPlanCard.planDerivationCriteria.isLegalEntityIndependent = event;

    if (event) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].isLegalDisable = true
    } else { this.treatmentGridData.treatmentPlanConfigList.items[this.index].isLegalDisable = false }

    this.treatmentPlanCard.planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
    this.LegalAutoCompleteTextBoxconfig.externalError = false;
    this.removeLegalError();
  }

  changeCustomerCheck(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.isCustomerindependent = event;
    this.treatmentPlanCard.planDerivationCriteria.isCustomerindependent = event;

    if (event) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].isCustomerDisable = true
    } else { this.treatmentGridData.treatmentPlanConfigList.items[this.index].isCustomerDisable = false }

    this.treatmentPlanCard.planDerivationCriteria.customer = null as unknown as customerRef
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.customer = null as unknown as customerRef

  }

  changeInitiatorCheck(event: any) {
    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.isInitiatorIndependent = event;
    this.treatmentPlanCard.planDerivationCriteria.isInitiatorIndependent = event;

    if (event) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].isInitiatorDisable = true
    } else { this.treatmentGridData.treatmentPlanConfigList.items[this.index].isInitiatorDisable = false }

    this.treatmentPlanCard.planDerivationCriteria.initiator = null as unknown as initiatorRef
    this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.initiator = null as unknown as initiatorRef

  }

  changeValidFrom(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.validFrom = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.validFrom = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.modifiedvalidFrom = '';
      this.ValidFromDateconfig.externalError = true;
    }
  }

  changeValidTo(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.validTo = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.modifiedvalidTo = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.validTo = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.modifiedvalidTo = '';

    }
  }

  changePriority(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }

    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.priority = parseInt(event);
      this.treatmentPlanCard.planDerivationCriteria.priority = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.PriorityTextBoxconfig.externalError = true;
      }
      else {
        this.PriorityTextBoxconfig.externalError = false;
      }
    }
    else {

      this.treatmentPlanCard.planDerivationCriteria.priority = event;

      setTimeout(() => {
        this.treatmentPlanCard.planDerivationCriteria.priority = null as unknown as number;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.priority = null as unknown as number
        this.PriorityTextBoxconfig.externalError = true;
      }, 3)

    }


  }

  changeDebtorType(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.debtorType = event?.value;
      this.treatmentPlanCard.planDerivationCriteria.debtorType = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.debtorType = null as unknown as codeTable
      this.treatmentPlanCard.planDerivationCriteria.debtorType = null as unknown as codeTable;

    }
  }

  changeDossierType(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.dossierType = event?.value;
      this.treatmentPlanCard.planDerivationCriteria.dossierType = event?.value;

    }
    else {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.dossierType = null as unknown as codeTable
      this.treatmentPlanCard.planDerivationCriteria.dossierType = null as unknown as codeTable;

    }
  }

  changeMinAmount(event: any, isChanged: boolean) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinAmount = parseFloat(floatValue);
        this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount = parseFloat(floatValue)


        if (this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount != null &&
          this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount > this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount) {

          this.MinAmtTextBoxconfig.externalError = true;

        } else {
          this.MinAmtTextBoxconfig.externalError = false;
          setTimeout(() => {
            this.userDetailsform.form.controls['invoiceMinAmount'].setErrors(null);
            this.userDetailsform.form.controls['invoiceMaxAmount'].setErrors(null);
          })
        }
      }

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount = event;

      setTimeout(() => {
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinAmount = null as unknown as number;
        this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount = null as unknown as number;

      }, 4)

    }
  }

  changeMaxAmount(event: any, isChanged: boolean) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxAmount = parseFloat(floatValue);
        this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount = parseFloat(floatValue)

        if (this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount != null && (this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount < this.treatmentPlanCard.planDerivationCriteria.invoiceMinAmount)) {
          this.MaxAmtTextBoxconfig.externalError = true;
        } else {
          this.MaxAmtTextBoxconfig.externalError = false;
          setTimeout(() => {
            this.userDetailsform.form.controls['invoiceMaxAmount'].setErrors(null);
            this.userDetailsform.form.controls['invoiceMinAmount'].setErrors(null);
          }, 1)
        }

      }

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount = event;

      setTimeout(() => {
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxAmount = null as unknown as number;
        this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAmount = null as unknown as number;

      }, 4)

    }
  }

  changeMinOldest(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMinOldestDate = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = event;

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.validFrom = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = null as unknown as Date;

    }
  }

  changemaxOldest(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxOldestDate = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = event;

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxOldestDate = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = null as unknown as Date;

    }
  }

  changeMinNewest(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMinNewestDate = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = event;

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.invoiceMinNewestDate = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = null as unknown as Date;
    }
  }

  changeMaxNewest(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxNewestDate = event;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = event;

    }
    else {
      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxNewestDate = null as unknown as Date;
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = null as unknown as Date;

    }
  }

  changeMinAvg(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinAvgAge = parseInt(event);
      this.treatmentPlanCard.planDerivationCriteria.invoiceMinAvgAge = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.MinAvgTextBoxconfig.externalError = true;

        const MinAvgValidation = new ErrorDto;
        MinAvgValidation.validation = "maxError";
        MinAvgValidation.isModelError = true;
        MinAvgValidation.validationMessage = 'Value was either too large or too small for Int32';
        this.minAvgErrorDto = [MinAvgValidation];
        this.MinAvgTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

      }
      else if (this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAvgAge != null && (event > this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAvgAge)) {
        this.MinAvgTextBoxconfig.externalError = true;

        const MinAvgValidation = new ErrorDto;
        MinAvgValidation.validation = "maxError";
        MinAvgValidation.isModelError = true;
        MinAvgValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minamt');
        this.minAvgErrorDto = [MinAvgValidation];
        this.MinAvgTextBoxconfig.maxValueValidation = this.translate.instant('plan.treatment.mandatory.minamt');

      }

      else {
        this.MinAvgTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.userDetailsform.form.controls['invoiceMinAvgAge'].setErrors(null);
          this.userDetailsform.form.controls['invoiceMaxAvgAge'].setErrors(null);
        }, 1)
      }
    }
    else {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMinAvgAge = event;

      setTimeout(() => {
        this.treatmentPlanCard.planDerivationCriteria.invoiceMinAvgAge = null as unknown as number;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinAvgAge = null as unknown as number
      }, 3)

    }


  }

  changeMaxAvg(event: any) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxAvgAge = parseInt(event);
      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAvgAge = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.MaxAvgTextBoxconfig.externalError = true;
      }
      else if (this.treatmentPlanCard.planDerivationCriteria.invoiceMinAvgAge != null && (event < this.treatmentPlanCard.planDerivationCriteria.invoiceMinAvgAge)) {
        this.MaxAvgTextBoxconfig.externalError = true;
      }
      else {
        this.MaxAvgTextBoxconfig.externalError = false;
        setTimeout(() => {
          this.userDetailsform.form.controls['invoiceMinAvgAge'].setErrors(null);
          this.userDetailsform.form.controls['invoiceMaxAvgAge'].setErrors(null);
        }, 1)
      }
    }
    else {

      this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAvgAge = event;

      setTimeout(() => {
        this.treatmentPlanCard.planDerivationCriteria.invoiceMaxAvgAge = null as unknown as number;
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxAvgAge = null as unknown as number
      }, 3)

    }


  }

  removeLegalError() {
    const removeLegalErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('plan.treatment.mandatory.Legal') + this.translate.instant('plan.treatment.mandatory.required')

    );

    if (removeLegalErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeLegalErrors, 1);

    }
  }

  removeValidError() {
    const removeValidErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('plan.treatment.mandatory.ValidFor') + this.translate.instant('plan.treatment.mandatory.required')

    );

    if (removeValidErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeValidErrors, 1);

    }
  }

  removePriorityError() {
    const removePriorityErrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == this.translate.instant('plan.treatment.mandatory.priority') + this.translate.instant('plan.treatment.mandatory.required')

    );

    if (removePriorityErrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removePriorityErrors, 1);

    }

    const removeNumberrrors = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(

      x => x.ErrorMessage == 'Value was either too large or too small for Int32'

    );

    if (removeNumberrrors >= 0) {

      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(removeNumberrrors, 1);

    }
  }
  //

  PNPRFilteredData() {
    this.treatmentPlanCard.treatmentPlan.paymentPlanReminder = this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminderList.filter(x => {
      if (!x.isDelete) {
        return !x.isNotification;
      }
      return false;
    })
    this.treatmentPlanCard.treatmentPlan.paymentPlanNotification = this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminderList.filter(x => {
      if (!x.isDelete) {
        return x.isNotification;
      }
      return false;
    })

    if (this.treatmentPlanCard.treatmentPlan.paymentPlanReminder.length > 0) {
      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder.forEach(x => {
        if (x.numberOfDaysAfterPromise == null) {
          x.numberOfDaysAfterPromise = 0;
        }
      })
    }

    if (this.treatmentPlanCard.treatmentPlan.paymentPlanNotification.length > 0) {
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification.forEach(x => {
        if (x.numberOfDaysAfterPromise != null) {
          x.numberOfDaysBeforePromise = -1 * x.numberOfDaysAfterPromise;
        } else { x.numberOfDaysBeforePromise = 0 }
      })
    }
  }

  addRow() {

    if (this.userDetailsform.valid) {

      this.settingFalse();
      const treatmentPlanObj = new treatmentPlanConfiguration();
      treatmentPlanObj.planDerivationCriteria = { ...new planDerivationCriteria() };
      treatmentPlanObj.treatmentPlan = { ...new treatmentPlan() };
      treatmentPlanObj.validToDisable = true;
      treatmentPlanObj.validFromDisable = false;
      treatmentPlanObj.state = stateModel.Created;
      treatmentPlanObj.planDerivationCriteria.state = stateModel.Created;
      treatmentPlanObj.treatmentPlan.state = stateModel.Created;
      treatmentPlanObj.isEntered = true;
      treatmentPlanObj.treatmentPlan.paymentPlanMaxWarnings = 0;
      treatmentPlanObj.treatmentPlan.paymentPlanGraceAmount = 0;
      treatmentPlanObj.treatmentPlan.paymentPlanMinimumInstallmentAmount = 0;
      treatmentPlanObj.treatmentPlan.paymentPlanStartDateFromImportDays = 0;
      const newlist = this.treatmentGridData.treatmentPlanConfigList.items;
      newlist.push({ ...treatmentPlanObj });
      this.treatmentGridData.treatmentPlanConfigList.items = [...newlist];
      this.treatmentPlanCard = new treatmentPlanConfiguration();
      this.treatmentPlanCard = this.treatmentGridData.treatmentPlanConfigList.items[this.treatmentGridData.treatmentPlanConfigList.items.length - 1]
      this.setExternalErrorFalse();
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  clickTreatmentPlanList(dataselected: treatmentPlanConfiguration) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        this.settingFalse();
        this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(item => {
          return item == dataselected
        })
        this.treatmentGridData.treatmentPlanConfigList.items[this.index].isEntered = true;
        this.treatmentPlanCard = dataselected;
        this.PNPRFilteredData();

      }
      else {

        this.setExternalErrorTrue();

      }
    }

  }

  addPR() {
    this.paymentReminder = true;
    this.paymentNotification = false;
    this.addPaymentReminderRow();
  }

  addPN() {
    this.paymentReminder = false;
    this.paymentNotification = true;
    this.addPaymentReminderRow();
  }

  addPaymentReminderRow() {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (this.userDetailsform.valid) {

      // this.settingFalse();
      const paymentPlanReminderObj = new paymentPlanReminder();
      paymentPlanReminderObj.state = stateModel.Created;
      paymentPlanReminderObj.pKey = 0;
      paymentPlanReminderObj.canValidate = false;
      paymentPlanReminderObj.isDelete = false;
      paymentPlanReminderObj.rowVersion = 0;
      if (this.paymentReminder) {
        paymentPlanReminderObj.isNotification = false;
      }
      else if (this.paymentNotification) {
        paymentPlanReminderObj.isNotification = true;

      }
      const newlist = this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminderList;
      newlist.push({ ...paymentPlanReminderObj });
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.paymentPlanReminderList = [...newlist];
      this.PNPRFilteredData();

      this.setExternalErrorFalse();
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  deletepaymentPlanReminderList(event: paymentPlanReminder, griddata: paymentPlanReminder[]) {

    this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].state = stateModel.Dirty;
    }
    if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state == stateModel.Unknown) {
      this.treatmentGridData.treatmentPlanConfigList.items[this.index].treatmentPlan.state = stateModel.Dirty;
    }
    if (this.userDetailsform.valid || (event.numberOfDaysBeforePromise == null || event.numberOfDaysAfterPromise == null)) {

      this.setExternalErrorFalse();

      const deletedata = griddata.findIndex(data => {
        return data == event;
      });

      event.state = stateModel.Deleted;

      setTimeout(() => {
        this.deletepaymentPlanReminder(deletedata, griddata);
      }, 100);

    }
    else {
      this.setExternalErrorTrue();
    }
  }

  deletepaymentPlanReminder(deletedata: number, Data: paymentPlanReminder[]) {
    Data[deletedata].isDelete = true;

    if (!Data[deletedata].isNotification) {
      this.treatmentPlanCard.treatmentPlan.paymentPlanReminder = [...Data];
    }
    else if (Data[deletedata].isNotification) {
      this.treatmentPlanCard.treatmentPlan.paymentPlanNotification = [...Data];
    }
  }

  setExternalErrorTrue() {
    this.NameTextBoxconfig.externalError = true;
    this.AfterPromise1Boxconfig.externalError = true;
    this.followUpEventName1Dropdown.externalError = true;
    this.lastPromiseEvent1Dropdown.externalError = true;
    this.followUpEventName2Dropdown.externalError = true;
    this.lastPromiseEvent2Dropdown.externalError = true;
    this.AfterPromise2TextBoxconfig.externalError = true;
    this.PriorityTextBoxconfig.externalError = true;
    this.TerminateDropdownConfig.externalError = true;
    this.FinalizeDropdownConfig.externalError = true;
    this.ActivateDropdownConfig.externalError = true;
    this.DeactivateDropdownConfig.externalError = true;
    this.LegalAutoCompleteTextBoxconfig.externalError = true;
    this.ValidFromDateconfig.externalError = true;
    this.CaptionTextBoxconfig.externalError = true;
  }

  setExternalErrorFalse() {
    this.NameTextBoxconfig.externalError = false;
    this.AfterPromise1Boxconfig.externalError = false;
    this.followUpEventName1Dropdown.externalError = false;
    this.lastPromiseEvent1Dropdown.externalError = false;
    this.followUpEventName2Dropdown.externalError = false;
    this.lastPromiseEvent2Dropdown.externalError = false;
    this.AfterPromise2TextBoxconfig.externalError = false;
    this.PriorityTextBoxconfig.externalError = false;
    this.TerminateDropdownConfig.externalError = false;
    this.FinalizeDropdownConfig.externalError = false;
    this.ActivateDropdownConfig.externalError = false;
    this.DeactivateDropdownConfig.externalError = false;
    this.LegalAutoCompleteTextBoxconfig.externalError = false;
    this.ValidFromDateconfig.externalError = false;
    this.CaptionTextBoxconfig.externalError = false;

  }

  onclose() {
    const unsaved = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: treatmentPlanConfiguration[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.setExternalErrorFalse();
    this.removeValidError();
    this.removePriorityError();
    this.removeLegalError();
    //navigate
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  ngOnInit(): void {

    this.buildConfiguration();



    this.treat2Header = [
      { header: this.translate.instant('plan.treatment.tabel.NoOfDays'), field: 'numberOfDaysAfterPromise', width: '20%', property: 'textbox' },
      { header: this.translate.instant('plan.treatment.tabel.FollowUp'), field: 'followUpEventName.caption', width: '25%', property: 'dropdown1' },
      { header: this.translate.instant('plan.treatment.tabel.LastPromise'), field: 'lastPromiseEvent.caption', width: '25%', property: 'dropdown2' },
      { header: this.translate.instant('plan.treatment.tabel.Payment'), field: 'paymentMethod.caption', width: '25%', property: 'dropdown3' },
      { field: '', width: '5%', property: 'Delete' }];


    this.treat3Header = [
      { header: this.translate.instant('plan.treatment.tabel.before'), field: 'numberOfDaysBeforePromise', width: '20%', property: 'textbox1' },
      { header: this.translate.instant('plan.treatment.tabel.FollowUp'), field: 'followUpEventName.caption', width: '25%', property: 'dropdown11' },
      { header: this.translate.instant('plan.treatment.tabel.LastPromise'), field: 'lastPromiseEvent.caption', width: '25%', property: 'dropdown12' },
      { header: this.translate.instant('plan.treatment.tabel.Payment'), field: 'paymentMethod.caption', width: '25%', property: 'dropdown13' },
      { field: '', width: '5%', property: 'Delete1' }];


    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      const getResponse = res.TreatmentPlanData
      this.getInitialData = { ...getResponse };

    },
    );

    this.planConfigInput.planConfigCriteria.pageIndex = 0;
    this.planConfigInput.planConfigCriteria.planDerivationCriteriaPKey = 0;
    this.planConfigInput.planType = planType.TreatmentPlan;
    this.onTreatmentPlanGridCall(this.planConfigInput);
  }

  onPagination(event: any) {
    if (event) {
      this.planConfigInput.planConfigCriteria.pageSize = event.rows;
      this.planConfigInput.planConfigCriteria.pageIndex = event.first / event.rows;
      this.planConfigInput.planType = planType.TreatmentPlan;

      if (event?.sortOrder && event?.sortField) {
        this.planConfigInput.planConfigCriteria.sortColumn = event.sortField;
        if (event.sortOrder == 1) {
          this.planConfigInput.planConfigCriteria.sortMode = 'desc';
          this.onTreatmentPlanGridCall(this.planConfigInput);
        } else if (event.sortOrder == -1) {
          this.planConfigInput.planConfigCriteria.sortMode = 'asc';
          this.onTreatmentPlanGridCall(this.planConfigInput);
        }
      } else {
        this.planConfigInput.planConfigCriteria.sortColumn = null as unknown as string;
        this.planConfigInput.planConfigCriteria.sortMode = null as unknown as string;
        this.onTreatmentPlanGridCall(this.planConfigInput);

      }
    }
  }

  sortingColumns() {

    if (this.planConfigInput.planConfigCriteria.sortColumn != null && this.planConfigInput.planConfigCriteria.sortColumn != '') {
      const sortcolumn = this.planConfigInput.planConfigCriteria.sortColumn;

      if (sortcolumn == 'treatmentPlan.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.treatmentPlan?.name > b.treatmentPlan?.name ? -1 : 1)
      } else if (sortcolumn == 'treatmentPlan.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.treatmentPlan?.name > b.treatmentPlan?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.modifiedvalidFrom' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.planDerivationCriteria?.validFrom > b.planDerivationCriteria?.validFrom ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.modifiedvalidFrom' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.planDerivationCriteria?.validFrom > b.planDerivationCriteria?.validFrom) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.modifiedvalidTo' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.planDerivationCriteria?.validTo > b.planDerivationCriteria?.validTo ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.modifiedvalidTo' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.planDerivationCriteria?.validTo > b.planDerivationCriteria?.validTo) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.customer.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.planDerivationCriteria?.customer?.name > b.planDerivationCriteria?.customer?.name ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.customer.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.planDerivationCriteria?.customer?.name > b.planDerivationCriteria?.customer?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.initiator.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.planDerivationCriteria?.initiator?.name > b.planDerivationCriteria?.initiator?.name ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.initiator.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.planDerivationCriteria?.initiator?.name > b.planDerivationCriteria?.initiator?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.legalEntity.hostedOrganizationName' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => a.planDerivationCriteria?.legalEntity?.hostedOrganizationName > b.planDerivationCriteria?.legalEntity?.hostedOrganizationName ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.legalEntity.hostedOrganizationName' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.treatmentGridData?.treatmentPlanConfigList?.items.sort((a, b) => (a.planDerivationCriteria?.legalEntity?.hostedOrganizationName > b.planDerivationCriteria?.legalEntity?.hostedOrganizationName) ? 1 : -1);
      }

    }
  }

  onTreatmentPlanGridCall(planConfigInput: planConfigInput) {
    planConfigInput.planConfigCriteria.pageSize = 10;

    this.spinnerService.setIsLoading(true);
    this.treatmentplanService.GetTreatmentPlanConfigList(planConfigInput).subscribe(
      res => {
        this.spinnerService.setIsLoading(false);
        const getResponse = res as treatmentPlanConfigResponse
        this.treatmentGridData = { ...getResponse }

        this.setExternalErrorFalse();
        this.removeLegalError();
        this.removePriorityError();
        this.removeValidError();

        if (this.treatmentGridData.isPlanDerivationConfigExists) {
          this.treat1Header = [
            { header: this.translate.instant('plan.treatment.tabel.TreatmentPlan'), field: 'treatmentPlan.name', width: '' }];
        }
        else {
          this.treat1Header = [
            { header: this.translate.instant('plan.treatment.tabel.TreatmentPlan'), field: 'treatmentPlan.name', width: '' },
            { header: this.translate.instant('plan.treatment.tabel.ValidFor'), field: 'planDerivationCriteria.modifiedvalidFrom', width: '' },
            { header: this.translate.instant('plan.treatment.tabel.ValidTo'), field: 'planDerivationCriteria.modifiedvalidTo', width: '' },
            { header: this.translate.instant('plan.treatment.tabel.Customer'), field: 'planDerivationCriteria.customer.name', width: '' },
            { header: this.translate.instant('plan.treatment.tabel.Initiator'), field: 'planDerivationCriteria.initiator.name', width: '' },
            { header: this.translate.instant('plan.treatment.tabel.HostedOrg'), field: 'planDerivationCriteria.legalEntity.hostedOrganizationName', width: '' }];
        }
        if (!this.treatmentGridData.isPlanDerivationConfigExists) {
          this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {

            x.validFromDisable = true;
            x.validToDisable = false;

            if (x.planDerivationCriteria.isLegalEntityIndependent) {
              x.isLegalDisable = true
            } else { x.isLegalDisable = false }

            if (x.planDerivationCriteria.isCustomerindependent) {
              x.isCustomerDisable = true
            } else { x.isCustomerDisable = false }

            if (x.planDerivationCriteria.isInitiatorIndependent) {
              x.isInitiatorDisable = true
            } else { x.isInitiatorDisable = false }

          })
        }
        else {
          this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {
            x.validFromDisable = false;
            x.validToDisable = false;
            x.isLegalDisable = false
            x.isCustomerDisable = false
            x.isInitiatorDisable = false
          })
        }

        this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {
          if (x.planDerivationCriteria.validFrom != null) {
            x.planDerivationCriteria.validFrom = new Date(x.planDerivationCriteria.validFrom)
            x.planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(x.planDerivationCriteria.validFrom, 'dd/MM/yyyy')
          }
          else {
            x.planDerivationCriteria.modifiedvalidFrom = null;
          }

          if (x.planDerivationCriteria.validTo != null) {
            x.planDerivationCriteria.validTo = new Date(x.planDerivationCriteria.validTo)
            x.planDerivationCriteria.modifiedvalidTo = this.datePipe.transform(x.planDerivationCriteria.validTo, 'dd/MM/yyyy')
          }
          else {
            x.planDerivationCriteria.modifiedvalidTo = null;
          }

          if (x.planDerivationCriteria.invoiceMaxNewestDate != null) {
            x.planDerivationCriteria.invoiceMaxNewestDate = new Date(x.planDerivationCriteria.invoiceMaxNewestDate)
          }

          if (x.planDerivationCriteria.invoiceMaxOldestDate != null) {
            x.planDerivationCriteria.invoiceMaxOldestDate = new Date(x.planDerivationCriteria.invoiceMaxOldestDate)
          }

          if (x.planDerivationCriteria.invoiceMinNewestDate != null) {
            x.planDerivationCriteria.invoiceMinNewestDate = new Date(x.planDerivationCriteria.invoiceMinNewestDate)
          }

          if (x.planDerivationCriteria.invoiceMinOldestDate != null) {
            x.planDerivationCriteria.invoiceMinOldestDate = new Date(x.planDerivationCriteria.invoiceMinOldestDate)
          }

        })


        this.paginationContent = 'Total Records : ' + this.treatmentGridData.treatmentPlanConfigList.totalItemCount;
        // this.treatmentGridData.treatmentPlanConfigList.pageIndex = getResponse.treatmentPlanConfigList.pageIndex;
        this.recordsAvailable = this.treatmentGridData.treatmentPlanConfigList.totalItemCount;
        this.resetPagination = this.treatmentGridData.treatmentPlanConfigList.pageIndex * this.pageRow
        this.index = 0;
        if (this.treatmentGridData.treatmentPlanConfigList.items.length > 0) {
          this.settingFalse();
          this.treatmentPlanCard = this.treatmentGridData.treatmentPlanConfigList.items[this.index]
          this.treatmentGridData.treatmentPlanConfigList.items[this.index].isEntered = true;
          this.PNPRFilteredData();

          //this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {
          //  if (x.planDerivationCriteria.invoiceMaxAmount == null &&
          //    x.planDerivationCriteria.invoiceMinAmount == null) {
          //    x.planDerivationCriteria.invoiceMaxAmount = 0;
          //    x.planDerivationCriteria.invoiceMinAmount = 0;
          //  }

          //})
        }
        this.sortingColumns();
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
    );
  }

  copy() {

    if (this.userDetailsform.valid) {
      this.isErrors = false;
      this.index = this.treatmentGridData.treatmentPlanConfigList.items.findIndex(get => {
        return get.isEntered == true;
      })

      if (this.treatmentGridData.treatmentPlanConfigList.items.length > 0) {
        const date = new Date()
        const defaultDate = new Date(date.setFullYear(1))

        if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom != null) {
          if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom.getFullYear() == defaultDate.getFullYear()) {

            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom = null as unknown as Date
          }

          else {
            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom = new Date(
              Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom.getFullYear(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom.getMonth(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validFrom.getDate(), 0, 0, 0)
            );
          }
        }

        if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo != null) {
          this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo = new Date(
            Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo.getFullYear(),
              this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo.getMonth(),
              this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.validTo.getDate(), 0, 0, 0)
          );
        }

        if (!this.treatmentGridData.isPlanDerivationConfigExists) {

          if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate != null) {
            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = new Date(
              Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getFullYear(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getMonth(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate != null) {
            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = new Date(
              Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getFullYear(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getMonth(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate != null) {
            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = new Date(
              Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getFullYear(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getMonth(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate != null) {
            this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = new Date(
              Date.UTC(this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getFullYear(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getMonth(),
                this.treatmentGridData.treatmentPlanConfigList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getDate(), 0, 0, 0)
            );
          }
        }

      }

      this.spinnerService.setIsLoading(true);
      this.treatmentplanService.CopyTreatmentPlan(this.treatmentGridData.treatmentPlanConfigList.items[this.index]).subscribe(
        res => {
          this.spinnerService.setIsLoading(false);

          const getResponse = { ...res as treatmentPlanConfiguration }
          if (getResponse) {

            this.setExternalErrorFalse();
            this.removeLegalError();
            this.removePriorityError();
            this.removeValidError();

            if (getResponse.planDerivationCriteria.validFrom != null) {
              getResponse.planDerivationCriteria.validFrom = new Date(getResponse.planDerivationCriteria.validFrom)
              getResponse.planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(getResponse.planDerivationCriteria.validFrom, 'dd/MM/yyyy')
            }
            else {
              if (getResponse.treatmentPlan.name != null) {
                getResponse.planDerivationCriteria.validFrom = new Date('jan 1 0001');
                getResponse.planDerivationCriteria.validFrom = new Date(getResponse.planDerivationCriteria.validFrom.setFullYear(1))
                getResponse.planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(getResponse.planDerivationCriteria.validFrom, 'dd/MM/yyyy');
              }
              else {
                getResponse.planDerivationCriteria.modifiedvalidFrom = '';
              }
            }

            if (getResponse.planDerivationCriteria.validTo != null) {
              getResponse.planDerivationCriteria.validTo = new Date(getResponse.planDerivationCriteria.validTo)
              getResponse.planDerivationCriteria.modifiedvalidTo = this.datePipe.transform(getResponse.planDerivationCriteria.validTo, 'dd/MM/yyyy')
            }
            else {
              getResponse.planDerivationCriteria.modifiedvalidTo = null;
            }

            if (getResponse.planDerivationCriteria.invoiceMaxNewestDate != null) {
              getResponse.planDerivationCriteria.invoiceMaxNewestDate = new Date(getResponse.planDerivationCriteria.invoiceMaxNewestDate)
            }

            if (getResponse.planDerivationCriteria.invoiceMaxOldestDate != null) {
              getResponse.planDerivationCriteria.invoiceMaxOldestDate = new Date(getResponse.planDerivationCriteria.invoiceMaxOldestDate)
            }

            if (getResponse.planDerivationCriteria.invoiceMinNewestDate != null) {
              getResponse.planDerivationCriteria.invoiceMinNewestDate = new Date(getResponse.planDerivationCriteria.invoiceMinNewestDate)
            }

            if (getResponse.planDerivationCriteria.invoiceMinOldestDate != null) {
              getResponse.planDerivationCriteria.invoiceMinOldestDate = new Date(getResponse.planDerivationCriteria.invoiceMinOldestDate)
            }

            this.settingFalse();
            getResponse.isEntered = true;
            getResponse.state = stateModel.Created;
            getResponse.planDerivationCriteria.state = stateModel.Created;
            getResponse.treatmentPlan.state = stateModel.Created;
            if (getResponse.treatmentPlan.paymentPlanReminderList.length > 0) {
              getResponse.treatmentPlan.paymentPlanReminderList.forEach(x => {
                x.state = stateModel.Created;
                x.isDelete = false;
                x.rowVersion = 0;
                x.pKey = 0;
              })
            }
            getResponse.validFromDisable = false
            getResponse.validToDisable = true;
            const newlist = this.treatmentGridData.treatmentPlanConfigList.items;
            newlist.push({ ...getResponse });
            this.treatmentGridData.treatmentPlanConfigList.items = [...newlist];
            this.treatmentPlanCard = this.treatmentGridData.treatmentPlanConfigList.items[this.treatmentGridData.treatmentPlanConfigList.items.length - 1]
            this.PNPRFilteredData();

            if (!this.treatmentGridData.isPlanDerivationConfigExists) {
              this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {

                if (x.planDerivationCriteria.isLegalEntityIndependent) {
                  x.isLegalDisable = true
                } else { x.isLegalDisable = false }

                if (x.planDerivationCriteria.isCustomerindependent) {
                  x.isCustomerDisable = true
                } else { x.isCustomerDisable = false }

                if (x.planDerivationCriteria.isInitiatorIndependent) {
                  x.isInitiatorDisable = true
                } else { x.isInitiatorDisable = false }

              })
            }
            else {
              this.treatmentGridData.treatmentPlanConfigList.items.forEach(x => {
                x.validFromDisable = false;
                x.validToDisable = false;
                x.isLegalDisable = false
                x.isCustomerDisable = false
                x.isInitiatorDisable = false
              })
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
      this.isErrors = true;
      this.setExternalErrorTrue();

    }

  }

  onSave(GridData: treatmentPlanConfiguration[]) {

    if (this.userDetailsform.valid) {

      this.isErrors = false;

      const saveData = [...GridData];

      saveData.forEach(x => {

        this.recordsOfPlanRemainder = [...new Array<paymentPlanReminder>()];

        x.treatmentPlan.paymentPlanReminderList.forEach(x => {
          if (x.state != stateModel.Deleted && !x.isDelete) {
            this.recordsOfPlanRemainder.push(x)
          }
        })
        x.treatmentPlan.paymentPlanNotificationList = null as unknown as paymentPlanReminder[]
        x.treatmentPlan.paymentPlanReminderList = this.recordsOfPlanRemainder;

        if (x.planDerivationCriteria.validFrom != null) {

          const date = new Date()
          const defaultDate = new Date(date.setFullYear(1));

          if (x.planDerivationCriteria.validFrom.getFullYear() == defaultDate.getFullYear()) {

            x.planDerivationCriteria.validFrom = null as unknown as Date
          }
          else {
            x.planDerivationCriteria.validFrom = new Date(
              Date.UTC(x.planDerivationCriteria.validFrom.getFullYear(), x.planDerivationCriteria.validFrom.getMonth(), x.planDerivationCriteria.validFrom.getDate(), 0, 0, 0)
            );
          }
        }

        if (x.planDerivationCriteria.validTo != null) {
          x.planDerivationCriteria.validTo = new Date(
            Date.UTC(x.planDerivationCriteria.validTo.getFullYear(), x.planDerivationCriteria.validTo.getMonth(), x.planDerivationCriteria.validTo.getDate(), 0, 0, 0)
          );
        }

        if (!this.treatmentGridData.isPlanDerivationConfigExists) {

          if (x.planDerivationCriteria.invoiceMinOldestDate != null) {
            x.planDerivationCriteria.invoiceMinOldestDate = new Date(
              Date.UTC(x.planDerivationCriteria.invoiceMinOldestDate.getFullYear(), x.planDerivationCriteria.invoiceMinOldestDate.getMonth(), x.planDerivationCriteria.invoiceMinOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (x.planDerivationCriteria.invoiceMaxOldestDate != null) {
            x.planDerivationCriteria.invoiceMaxOldestDate = new Date(
              Date.UTC(x.planDerivationCriteria.invoiceMaxOldestDate.getFullYear(), x.planDerivationCriteria.invoiceMaxOldestDate.getMonth(), x.planDerivationCriteria.invoiceMaxOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (x.planDerivationCriteria.invoiceMinNewestDate != null) {
            x.planDerivationCriteria.invoiceMinNewestDate = new Date(
              Date.UTC(x.planDerivationCriteria.invoiceMinNewestDate.getFullYear(), x.planDerivationCriteria.invoiceMinNewestDate.getMonth(), x.planDerivationCriteria.invoiceMinNewestDate.getDate(), 0, 0, 0)
            );
          }

          if (x.planDerivationCriteria.invoiceMaxNewestDate != null) {
            x.planDerivationCriteria.invoiceMaxNewestDate = new Date(
              Date.UTC(x.planDerivationCriteria.invoiceMaxNewestDate.getFullYear(), x.planDerivationCriteria.invoiceMaxNewestDate.getMonth(), x.planDerivationCriteria.invoiceMaxNewestDate.getDate(), 0, 0, 0)
            );
          }
        }

      })


      this.spinnerService.setIsLoading(true);
      this.treatmentplanService.SaveTreatmentPlan(saveData).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.onTreatmentPlanGridCall(this.planConfigInput);
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
      this.isErrors = true;
      this.setExternalErrorTrue();

    }
  }

  buildConfiguration() {
    const captionValidation = new ErrorDto;
    captionValidation.validation = "maxError";
    captionValidation.isModelError = true;
    captionValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [captionValidation];
    const captionError = new ErrorDto;
    captionError.validation = "required";
    captionError.isModelError = true;
    captionError.validationMessage = this.translate.instant('plan.treatment.mandatory.caption') + this.translate.instant('plan.treatment.mandatory.required');
    this.CaptionTextBoxconfig.Errors = [captionError];
    this.CaptionTextBoxconfig.required = true;
    this.CaptionTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

    const MaxValidation = new ErrorDto;
    MaxValidation.validation = "maxError";
    MaxValidation.isModelError = true;
    MaxValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [MaxValidation];
    this.MaxWarningTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

    const MaxAmtValidation = new ErrorDto;
    MaxAmtValidation.validation = "maxError";
    MaxAmtValidation.isModelError = true;
    MaxAmtValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.maxamt')
    this.maxAmtErrorDto = [MaxAmtValidation];
    this.MaxAmtTextBoxconfig.minValueValidation = this.translate.instant('plan.treatment.mandatory.maxamt')

    const MinAmtValidation = new ErrorDto;
    MinAmtValidation.validation = "maxError";
    MinAmtValidation.isModelError = true;
    MinAmtValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minamt');
    this.minAmtErrorDto = [MinAmtValidation];
    this.MinAmtTextBoxconfig.maxValueValidation = this.translate.instant('plan.treatment.mandatory.minamt');

    const ImportValidation = new ErrorDto;
    ImportValidation.validation = "maxError";
    ImportValidation.isModelError = true;
    ImportValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [ImportValidation];
    this.ImportTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

    const MinInstallValidation = new ErrorDto;
    MinInstallValidation.validation = "maxError";
    MinInstallValidation.isModelError = true;
    MinInstallValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [MinInstallValidation];
    this.MinInstallTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

    const followUpEvent1Error = new ErrorDto;
    followUpEvent1Error.validation = "required";
    followUpEvent1Error.isModelError = true;
    followUpEvent1Error.validationMessage = this.translate.instant('plan.treatment.mandatory.followUpEvent') + this.translate.instant('plan.treatment.mandatory.required');
    this.followUpEventName1Dropdown.Errors = [followUpEvent1Error];
    this.followUpEventName1Dropdown.required = true;


    const lastPromiseEvent1Error = new ErrorDto;
    lastPromiseEvent1Error.validation = "required";
    lastPromiseEvent1Error.isModelError = true;
    lastPromiseEvent1Error.validationMessage = this.translate.instant('plan.treatment.mandatory.lastPromiseEvent') + this.translate.instant('plan.treatment.mandatory.required');
    this.lastPromiseEvent1Dropdown.Errors = [lastPromiseEvent1Error];
    this.lastPromiseEvent1Dropdown.required = true;

    const followUpEvent2Error = new ErrorDto;
    followUpEvent2Error.validation = "required";
    followUpEvent2Error.isModelError = true;
    followUpEvent2Error.validationMessage = this.translate.instant('plan.treatment.mandatory.followUpEvent') + this.translate.instant('plan.treatment.mandatory.required');
    this.followUpEventName2Dropdown.Errors = [followUpEvent2Error];
    this.followUpEventName2Dropdown.required = true;


    const lastPromiseEvent2Error = new ErrorDto;
    lastPromiseEvent2Error.validation = "required";
    lastPromiseEvent2Error.isModelError = true;
    lastPromiseEvent2Error.validationMessage = this.translate.instant('plan.treatment.mandatory.lastPromiseEvent') + this.translate.instant('plan.treatment.mandatory.required');
    this.lastPromiseEvent2Dropdown.Errors = [lastPromiseEvent2Error];
    this.lastPromiseEvent2Dropdown.required = true;

    const AP1Validation = new ErrorDto;
    AP1Validation.validation = "maxError";
    AP1Validation.isModelError = true;
    AP1Validation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [AP1Validation];
    const AP1Error = new ErrorDto;
    AP1Error.validation = "required";
    AP1Error.isModelError = true;
    AP1Error.validationMessage = this.translate.instant('plan.treatment.mandatory.NoOfDays') + this.translate.instant('plan.treatment.mandatory.required');
    this.AfterPromise1Boxconfig.Errors = [AP1Error];
    this.AfterPromise1Boxconfig.required = true;
    this.AfterPromise1Boxconfig.maxValueValidation = 'Input is not in a correct format'
    this.AfterPromise1Boxconfig.minValueValidation = 'Input is not in a correct format'

    const AP2Validation = new ErrorDto;
    AP2Validation.validation = "maxError";
    AP2Validation.isModelError = true;
    AP2Validation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [AP2Validation];
    const AP2Error = new ErrorDto;
    AP2Error.validation = "required";
    AP2Error.isModelError = true;
    AP2Error.validationMessage = this.translate.instant('plan.treatment.mandatory.before') + this.translate.instant('plan.treatment.mandatory.required');
    this.AfterPromise2TextBoxconfig.Errors = [AP2Error];
    this.AfterPromise2TextBoxconfig.required = true;
    this.AfterPromise2TextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.AfterPromise2TextBoxconfig.minValueValidation = 'Input is not in a correct format'

    const PriorityValidation = new ErrorDto;
    PriorityValidation.validation = "maxError";
    PriorityValidation.isModelError = true;
    PriorityValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [PriorityValidation];
    const PriorityError = new ErrorDto;
    PriorityError.validation = "required";
    PriorityError.isModelError = true;
    PriorityError.validationMessage = this.translate.instant('plan.treatment.mandatory.priority') + this.translate.instant('plan.treatment.mandatory.required');
    this.PriorityTextBoxconfig.Errors = [PriorityError];
    this.PriorityTextBoxconfig.required = true;
    this.PriorityTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

    const MinAvgValidation = new ErrorDto;
    MinAvgValidation.validation = "maxError";
    MinAvgValidation.isModelError = true;
    MinAvgValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minavg')
    this.minAvgErrorDto = [MinAvgValidation];
    this.MinAvgTextBoxconfig.maxValueValidation = this.translate.instant('plan.treatment.mandatory.minavg')

    const maxAvgValidation = new ErrorDto;
    maxAvgValidation.validation = "maxError";
    maxAvgValidation.isModelError = true;
    maxAvgValidation.validationMessage = 'Value was either too large or too small for Int32';
    this.numberErrorDto = [maxAvgValidation];
    const maxAvgValidationMinError = new ErrorDto;
    maxAvgValidationMinError.validation = "maxError";
    maxAvgValidationMinError.isModelError = true;
    maxAvgValidationMinError.validationMessage = this.translate.instant('plan.treatment.mandatory.maxavg')
    this.maxAvgErrorDto = [maxAvgValidationMinError];
    this.MaxAvgTextBoxconfig.maxValueValidation = 'Input is not in a correct format'
    this.MaxAvgTextBoxconfig.minValueValidation = this.translate.instant('plan.treatment.mandatory.maxavg')


    const NameError = new ErrorDto;
    NameError.validation = "required";
    NameError.isModelError = true;
    NameError.validationMessage = this.translate.instant('plan.treatment.mandatory.name') + this.translate.instant('plan.treatment.mandatory.required');
    this.NameTextBoxconfig.Errors = [NameError];
    this.NameTextBoxconfig.required = true;

    const ValidFromError = new ErrorDto;
    ValidFromError.validation = "required";
    ValidFromError.isModelError = true;
    ValidFromError.validationMessage = this.translate.instant('plan.treatment.mandatory.ValidFor') + this.translate.instant('plan.treatment.mandatory.required');
    this.ValidFromDateconfig.Errors = [ValidFromError];
    this.ValidFromDateconfig.required = true;

    const TerminateBorrowerError = new ErrorDto;
    TerminateBorrowerError.validation = "required";
    TerminateBorrowerError.isModelError = true;
    TerminateBorrowerError.validationMessage = this.translate.instant('plan.treatment.mandatory.terminate') + this.translate.instant('plan.treatment.mandatory.required');
    this.TerminateDropdownConfig.Errors = [TerminateBorrowerError];
    this.TerminateDropdownConfig.required = true;

    const FinalizeBorrowerError = new ErrorDto;
    FinalizeBorrowerError.validation = "required";
    FinalizeBorrowerError.isModelError = true;
    FinalizeBorrowerError.validationMessage = this.translate.instant('plan.treatment.mandatory.finalize') + this.translate.instant('plan.treatment.mandatory.required');
    this.FinalizeDropdownConfig.Errors = [FinalizeBorrowerError];
    this.FinalizeDropdownConfig.required = true;

    const ActivateError = new ErrorDto;
    ActivateError.validation = "required";
    ActivateError.isModelError = true;
    ActivateError.validationMessage = this.translate.instant('plan.treatment.mandatory.activate') + this.translate.instant('plan.treatment.mandatory.required');
    this.ActivateDropdownConfig.Errors = [ActivateError];
    this.ActivateDropdownConfig.required = true;

    const DeactivateError = new ErrorDto;
    DeactivateError.validation = "required";
    DeactivateError.isModelError = true;
    DeactivateError.validationMessage = this.translate.instant('plan.treatment.mandatory.deactivate') + this.translate.instant('plan.treatment.mandatory.required');
    this.DeactivateDropdownConfig.Errors = [DeactivateError];
    this.DeactivateDropdownConfig.required = true;

    const LegalError = new ErrorDto;
    LegalError.validation = "required";
    LegalError.isModelError = true;
    LegalError.validationMessage = this.translate.instant('plan.treatment.mandatory.Legal') + this.translate.instant('plan.treatment.mandatory.required');
    this.LegalAutoCompleteTextBoxconfig.Errors = [LegalError];
    this.LegalAutoCompleteTextBoxconfig.required = true;

  }
}

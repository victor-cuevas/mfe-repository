import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-plan-config/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { DatePipe } from '@angular/common';
import { ReminderPlanService } from './Service/reminder-plan.service';
import { planType } from './Models/planType.model';
import { reminderPlanConfigurationResponse } from './Models/reminderPlanConfigurationResponse.model';
import { reminderPlanConfiguration } from './Models/reminderPlanConfiguration.model';
import { planDerivationCriteriaConfigInitialResponse } from './Models/planDerivationCriteriaConfigInitialResponse.model';
import { planConfigInput } from './Models/planConfigInput.model';
import { stateModel } from './Models/state.model';
import { legalEntityRef } from './Models/legalEntityRef.model';
import { initiatorRef } from './Models/initiatorRef.model';
import { customerRef } from './Models/customerRef.model';
import { codeTable } from './Models/codeTable.model';
import { reminderPlan } from './Models/reminderPlan.model';
import { planDerivationCriteria } from './Models/planDerivationCriteria.model';
import { reminderPlan2ReminderScenario } from './Models/reminderPlan2ReminderScenario.model';
import { reminderScenarioRef } from './Models/reminderScenarioRef.model';


@Component({
  selector: 'mpc-manage-remainder-plan-config',
  templateUrl: './manage-remainder-plan-config.component.html',
  styleUrls: ['./manage-remainder-plan-config.component.scss']
})
export class ManageRemainderPlanConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PriorityTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MinAvgTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxAvgTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AutoCompleteTextBoxconfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public LegalAutoCompleteTextBoxconfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public ValidFromDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public MinAmtTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MaxAmtTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DossierDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ScenarioDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  

  placeholder = 'select';
  Header = this.translate.instant('plan.Validation.Header')
  SelectedTabIndex!: number;
  navigateUrl!:string
  getInitialData!: planDerivationCriteriaConfigInitialResponse
  reminderGridData: reminderPlanConfigurationResponse = new reminderPlanConfigurationResponse
  reminderPlanCard!: reminderPlanConfiguration
  planConfigInput: planConfigInput = new planConfigInput
  paginationContent!: string
  recordsAvailable = 0;
  pageRow = 10;
  resetPagination = 0;
  maxLimitForNumbers = 2147483647;
  minLimitForNumbers = -2147483648;
  dataSelected: any
  index: any
  filteredLegal: legalEntityRef[] = []
  filteredCustomer: customerRef[] = []
  filteredInitiator: initiatorRef[] = []
  numberErrorDto: ErrorDto[] = [];
  minAvgErrorDto: ErrorDto[] = [];
  maxAvgErrorDto: ErrorDto[] = [];
  minAmtErrorDto: ErrorDto[] = [];
  maxAmtErrorDto: ErrorDto[] = [];
  recordsOfReminderScenario: reminderPlan2ReminderScenario[] = [];
  reminderHeader!: any[];
  reminder1Header!: any[];
  isErrors!: boolean;
  show!: boolean
  exceptionBox!: boolean
  errorCode!: string
  businessError = this.translate.instant('plan.reminder.mandatory.businessErr');

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public reminderplanService: ReminderPlanService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService, public datePipe: DatePipe) {

    this.fluidValidation.ActivateTabEvent.subscribe((selectedTabIndex: number) => {

      this.SelectedTabIndex = selectedTabIndex;

    });
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl

  }

  settingFalse() {
    if (this.reminderGridData.reminderPlanConfigurationList.items.length > 0) {
      this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  isBusinessError(): boolean {

   let ReminderScenarioDup : reminderPlan2ReminderScenario[]=[]

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })

    ReminderScenarioDup = this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList.reduce((accumalator: reminderPlan2ReminderScenario[], current) => {
      if ((
        !accumalator.some(
          (item: reminderPlan2ReminderScenario) => item.dossierStatus?.caption == current.dossierStatus?.caption) && (!current.isDelete))
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);

    const compareArray: reminderPlan2ReminderScenario[] = []
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList.forEach(x => {
      if (!x.isDelete) {
        compareArray.push(x);
      }
    })
    
    if (ReminderScenarioDup.length != compareArray.length) {
      return true;
    }
    else {
      ReminderScenarioDup = [];
      return false;
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

      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);

      }

    })

  }

  //tab 1

  changeName(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }

    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state = stateModel.Dirty;
    }

    if (event != null) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.name = event;
      this.reminderPlanCard.reminderPlan.name = event;
    }
    else {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.name = null as unknown as string;
      this.reminderPlanCard.reminderPlan.name = null as unknown as string;
      this.NameTextBoxconfig.externalError = true;

    }
  }

  changeDossierStatus(event: any,index:number) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state = stateModel.Dirty;
    }

    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].dossierStatus = event?.value;
      this.reminderPlanCard.reminderPlan.reminderPlan2ReminderScenarioList[index].dossierStatus = event?.value;

    }
    else {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].dossierStatus = null as unknown as codeTable
      this.reminderPlanCard.reminderPlan.reminderPlan2ReminderScenarioList[index].dossierStatus = null as unknown as codeTable;
      this.DossierDropdownConfig.externalError = true;

    }
  }

  changeScenario(event: any,index:number) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state = stateModel.Dirty;
    }

    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].reminderScenarioRef = event?.value;
      this.reminderPlanCard.reminderPlan.reminderPlan2ReminderScenarioList[index].reminderScenarioRef = event?.value;

    }
    else {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList[index].reminderScenarioRef = null as unknown as reminderScenarioRef
      this.reminderPlanCard.reminderPlan.reminderPlan2ReminderScenarioList[index].reminderScenarioRef = null as unknown as reminderScenarioRef;
      this.ScenarioDropdownConfig.externalError = true;

    }
  }

  addRow() {

    if (this.userDetailsform.valid) {
      if (!this.isBusinessError()) {
        this.settingFalse();
        const reminderPlanObj = new reminderPlanConfiguration();
        reminderPlanObj.planDerivationCriteria = { ...new planDerivationCriteria() };
        reminderPlanObj.reminderPlan = { ...new reminderPlan() };
        reminderPlanObj.validToDisable = true;
        reminderPlanObj.validFromDisable = false;
        reminderPlanObj.state = stateModel.Created;
        reminderPlanObj.planDerivationCriteria.state = stateModel.Created;
        reminderPlanObj.reminderPlan.state = stateModel.Created;
        reminderPlanObj.isEntered = true;
        const newlist = this.reminderGridData.reminderPlanConfigurationList.items;
        newlist.push({ ...reminderPlanObj });
        this.reminderGridData.reminderPlanConfigurationList.items = [...newlist];
        this.reminderPlanCard = new reminderPlanConfiguration();
        this.reminderPlanCard = this.reminderGridData.reminderPlanConfigurationList.items[this.reminderGridData.reminderPlanConfigurationList.items.length - 1]
        this.setExternalErrorFalse();
        this.RemoveBusinessError(this.businessError)
      }
      else {
        this.throwBusinessError(this.businessError);
      }
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  clickReminderPlanList(dataselected: reminderPlanConfiguration) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {
        if (!this.isBusinessError()) {
          this.settingFalse();
          this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(item => {
            return item == dataselected
          })
          this.reminderGridData.reminderPlanConfigurationList.items[this.index].isEntered = true;
          this.reminderPlanCard = dataselected;
          this.RemoveBusinessError(this.businessError);
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {

        this.setExternalErrorTrue();

      }
    }

  }

  addReminderScenarioRow() {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state = stateModel.Dirty;
    }
    if (this.userDetailsform.valid) {

      if (!this.isBusinessError()) {
        const reminderPlan2ScenarioObj = new reminderPlan2ReminderScenario();
        reminderPlan2ScenarioObj.state = stateModel.Created;
        reminderPlan2ScenarioObj.pKey = 0;
        reminderPlan2ScenarioObj.canValidate = false;
        reminderPlan2ScenarioObj.isDelete = false;
        reminderPlan2ScenarioObj.rowVersion = 0;
        const newlist = this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList;
        newlist.push({ ...reminderPlan2ScenarioObj });
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.reminderPlan2ReminderScenarioList = [...newlist];
        this.setExternalErrorFalse();
        this.RemoveBusinessError(this.businessError);
      }
      else {
        this.throwBusinessError(this.businessError);
      }
      
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  deleteReminderScenarioList(event: reminderPlan2ReminderScenario, griddata: reminderPlan2ReminderScenario[]) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].reminderPlan.state = stateModel.Dirty;
    }
    if (this.userDetailsform.valid || (event.dossierStatus == null || event.reminderScenarioRef == null)) {

      this.setExternalErrorFalse();
      this.RemoveBusinessError(this.businessError);

      const deletedata = griddata.findIndex(data => {
        return data == event;
      });

      event.state = stateModel.Deleted;

      setTimeout(() => {
        this.deleteReminderScenario(deletedata, griddata);
      }, 100);

    }
    else {
      this.setExternalErrorTrue();
    }
  }

  deleteReminderScenario(deletedata: number, Data: reminderPlan2ReminderScenario[]) {

    Data[deletedata].isDelete = true;
    this.reminderPlanCard.reminderPlan.reminderPlan2ReminderScenarioList = [...Data];
  }

  //tab 2
  changeLegal(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const legal = this.getInitialData.legalEntityList.filter(x => {
        return x.hostedOrganizationName == event?.hostedOrganizationName;
      })
      if (legal[0] != null) {

        this.reminderPlanCard.planDerivationCriteria.legalEntity = legal[0];
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.legalEntity = legal[0];

      }
    }
    else {
      this.reminderPlanCard.planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
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
    //console.log(event);
    setTimeout(() => {
      //this.productInfo.country = null as unknown as countryList;
      this.LegalAutoCompleteTextBoxconfig.externalError = true;
    }, 100)
  }

  changeCustomer(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const customer = this.getInitialData.customerList.filter(x => {
        return x.name == event?.name;
      })
      if (customer[0] != null) {

        this.reminderPlanCard.planDerivationCriteria.customer = customer[0];
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.customer = customer[0];

      }
    }
    else {
      this.reminderPlanCard.planDerivationCriteria.customer = null as unknown as customerRef
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.customer = null as unknown as customerRef

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

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {


      const initiator = this.getInitialData.initiatorList.filter(x => {
        return x.name == event?.name;
      })
      if (initiator[0] != null) {

        this.reminderPlanCard.planDerivationCriteria.initiator = initiator[0];
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.initiator = initiator[0];

      }
    }
    else {
      this.reminderPlanCard.planDerivationCriteria.initiator = null as unknown as initiatorRef
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.initiator = null as unknown as initiatorRef

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
    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.isLegalEntityIndependent = event;
    this.reminderPlanCard.planDerivationCriteria.isLegalEntityIndependent = event;

    if (event) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].isLegalDisable = true
    } else { this.reminderGridData.reminderPlanConfigurationList.items[this.index].isLegalDisable = false }

    this.reminderPlanCard.planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.legalEntity = null as unknown as legalEntityRef
    this.LegalAutoCompleteTextBoxconfig.externalError = false;
    this.removeLegalError();
  }

  changeCustomerCheck(event: any) {
    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.isCustomerindependent = event;
    this.reminderPlanCard.planDerivationCriteria.isCustomerindependent = event;

    if (event) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].isCustomerDisable = true
    } else { this.reminderGridData.reminderPlanConfigurationList.items[this.index].isCustomerDisable = false }

    this.reminderPlanCard.planDerivationCriteria.customer = null as unknown as customerRef
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.customer = null as unknown as customerRef

  }

  changeInitiatorCheck(event: any) {
    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.isInitiatorIndependent = event;
    this.reminderPlanCard.planDerivationCriteria.isInitiatorIndependent = event;

    if (event) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].isInitiatorDisable = true
    } else { this.reminderGridData.reminderPlanConfigurationList.items[this.index].isInitiatorDisable = false }

    this.reminderPlanCard.planDerivationCriteria.initiator = null as unknown as initiatorRef
    this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.initiator = null as unknown as initiatorRef

  }

  changeValidFrom(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.validFrom = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.validFrom = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.modifiedvalidFrom = '';
      this.ValidFromDateconfig.externalError = true;
    }
  }

  changeValidTo(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.validTo = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.modifiedvalidTo = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.validTo = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.modifiedvalidTo = '';

    }
  }

  changePriority(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }

    if (event != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.priority = parseInt(event);
      this.reminderPlanCard.planDerivationCriteria.priority = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.PriorityTextBoxconfig.externalError = true;
      }
      else {
        this.PriorityTextBoxconfig.externalError = false;
      }
    }
    else {

      this.reminderPlanCard.planDerivationCriteria.priority = event;

      setTimeout(() => {
        this.reminderPlanCard.planDerivationCriteria.priority = null as unknown as number;
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.priority = null as unknown as number
        this.PriorityTextBoxconfig.externalError = true;
      }, 3)

    }


  }

  changeDebtorType(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.debtorType = event?.value;
      this.reminderPlanCard.planDerivationCriteria.debtorType = event?.value;

    }
    else {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.debtorType = null as unknown as codeTable
      this.reminderPlanCard.planDerivationCriteria.debtorType = null as unknown as codeTable;

    }
  }

  changeDossierType(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event?.value != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.dossierType = event?.value;
      this.reminderPlanCard.planDerivationCriteria.dossierType = event?.value;

    }
    else {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.dossierType = null as unknown as codeTable
      this.reminderPlanCard.planDerivationCriteria.dossierType = null as unknown as codeTable;

    }
  }

  changeMinAmount(event: any, isChanged: boolean) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinAmount = parseFloat(floatValue);
        this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount = parseFloat(floatValue)


        if (this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount != null &&
          this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount > this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount) {

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
      this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount = event;

      setTimeout(() => {
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinAmount = null as unknown as number;
        this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount = null as unknown as number;

      }, 4)

    }
  }

  changeMaxAmount(event: any, isChanged: boolean) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null && event != '0,00') {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxAmount = parseFloat(floatValue);
        this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount = parseFloat(floatValue)

        if (this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount != null && (this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount < this.reminderPlanCard.planDerivationCriteria.invoiceMinAmount)) {
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
      this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount = event;

      setTimeout(() => {
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxAmount = null as unknown as number;
        this.reminderPlanCard.planDerivationCriteria.invoiceMaxAmount = null as unknown as number;

      }, 4)

    }
  }

  changeMinOldest(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.invoiceMinOldestDate = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = event;

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.validFrom = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = null as unknown as Date;

    }
  }

  changemaxOldest(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.invoiceMaxOldestDate = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = event;

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.invoiceMaxOldestDate = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = null as unknown as Date;

    }
  }

  changeMinNewest(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.invoiceMinNewestDate = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = event;

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.invoiceMinNewestDate = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = null as unknown as Date;
    }
  }

  changeMaxNewest(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderPlanCard.planDerivationCriteria.invoiceMaxNewestDate = event;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = event;

    }
    else {
      this.reminderPlanCard.planDerivationCriteria.invoiceMaxNewestDate = null as unknown as Date;
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = null as unknown as Date;

    }
  }

  changeMinAvg(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinAvgAge = parseInt(event);
      this.reminderPlanCard.planDerivationCriteria.invoiceMinAvgAge = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.MinAvgTextBoxconfig.externalError = true;

        const MinAvgValidation = new ErrorDto;
        MinAvgValidation.validation = "maxError";
        MinAvgValidation.isModelError = true;
        MinAvgValidation.validationMessage = 'Value was either too large or too small for Int32';
        this.minAvgErrorDto = [MinAvgValidation];
        this.MinAvgTextBoxconfig.maxValueValidation = 'Input is not in a correct format'

      }
      else if (this.reminderPlanCard.planDerivationCriteria.invoiceMaxAvgAge != null && (event > this.reminderPlanCard.planDerivationCriteria.invoiceMaxAvgAge)) {
        this.MinAvgTextBoxconfig.externalError = true;

        const MinAvgValidation = new ErrorDto;
        MinAvgValidation.validation = "maxError";
        MinAvgValidation.isModelError = true;
        MinAvgValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minavg');
        this.minAvgErrorDto = [MinAvgValidation];
        this.MinAvgTextBoxconfig.maxValueValidation = this.translate.instant('plan.treatment.mandatory.minavg');

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

      this.reminderPlanCard.planDerivationCriteria.invoiceMinAvgAge = event;

      setTimeout(() => {
        this.reminderPlanCard.planDerivationCriteria.invoiceMinAvgAge = null as unknown as number;
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinAvgAge = null as unknown as number
      }, 3)

    }


  }

  changeMaxAvg(event: any) {

    this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].state = stateModel.Dirty;
    }
    if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state == stateModel.Unknown) {
      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.state = stateModel.Dirty;
    }
    if (event != null) {

      this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxAvgAge = parseInt(event);
      this.reminderPlanCard.planDerivationCriteria.invoiceMaxAvgAge = parseInt(event);

      if (event > this.maxLimitForNumbers) {
        this.MaxAvgTextBoxconfig.externalError = true;
      }
      else if (this.reminderPlanCard.planDerivationCriteria.invoiceMinAvgAge != null && (event < this.reminderPlanCard.planDerivationCriteria.invoiceMinAvgAge)) {
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

      this.reminderPlanCard.planDerivationCriteria.invoiceMaxAvgAge = event;

      setTimeout(() => {
        this.reminderPlanCard.planDerivationCriteria.invoiceMaxAvgAge = null as unknown as number;
        this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxAvgAge = null as unknown as number
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

  setExternalErrorTrue() {
    this.NameTextBoxconfig.externalError = true;
    this.PriorityTextBoxconfig.externalError = true;
    this.LegalAutoCompleteTextBoxconfig.externalError = true;
    this.ValidFromDateconfig.externalError = true;
    this.DossierDropdownConfig.externalError = true;
    this.ScenarioDropdownConfig.externalError = true;
  }

  setExternalErrorFalse() {
    this.NameTextBoxconfig.externalError = false;
    this.PriorityTextBoxconfig.externalError = false;
    this.LegalAutoCompleteTextBoxconfig.externalError = false;
    this.ValidFromDateconfig.externalError = false;
    this.DossierDropdownConfig.externalError = false;
    this.ScenarioDropdownConfig.externalError = false;
  }

  onclose() {
    const unsaved = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(x => {
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
  onYes(GridData: reminderPlanConfiguration[]) {
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
    this.RemoveBusinessError(this.businessError);
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
  
    this.reminder1Header = [
      { header: this.translate.instant('plan.reminder.tabel.dossierstatus'), field: 'dossierstatus', width: '50%', property: 'dropdown1' },
      { header: this.translate.instant('plan.reminder.tabel.Remindersenario'), field: 'Remindersenario', width: '45%', property: 'dropdown2' },
      { field: '', width: '5%',property:'Delete' }
    ];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      const getResponse = res.ReminderPlanData
      this.getInitialData = { ...getResponse };
      console.log(this.getInitialData)

    },
    );

    this.planConfigInput.planConfigCriteria.pageIndex = 0;
    this.planConfigInput.planConfigCriteria.planDerivationCriteriaPKey = 0;
    this.planConfigInput.planType = planType.ReminderPlan;
    this.onReminderPlanGridCall(this.planConfigInput);
  }

  onPagination(event: any) {
    if (event) {
      console.log(event)
      this.planConfigInput.planConfigCriteria.pageSize = event.rows;
      this.planConfigInput.planConfigCriteria.pageIndex = event.first / event.rows;
      this.planConfigInput.planType = planType.ReminderPlan;

      if (event?.sortOrder && event?.sortField) {
        this.planConfigInput.planConfigCriteria.sortColumn = event.sortField;
        if (event.sortOrder == 1) {
          this.planConfigInput.planConfigCriteria.sortMode = 'desc';
          this.onReminderPlanGridCall(this.planConfigInput);
        } else if (event.sortOrder == -1) {
          this.planConfigInput.planConfigCriteria.sortMode = 'asc';
          this.onReminderPlanGridCall(this.planConfigInput);
        }
      } else {
        this.planConfigInput.planConfigCriteria.sortColumn = null as unknown as string;
        this.planConfigInput.planConfigCriteria.sortMode = null as unknown as string;
        this.onReminderPlanGridCall(this.planConfigInput);

      }
    }
  }

  sortingColumns() {

    if (this.planConfigInput.planConfigCriteria.sortColumn != null && this.planConfigInput.planConfigCriteria.sortColumn != '') {
      const sortcolumn = this.planConfigInput.planConfigCriteria.sortColumn;

      if (sortcolumn == 'reminderPlan.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.reminderPlan?.name > b.reminderPlan?.name ? -1 : 1)
      } else if (sortcolumn == 'reminderPlan.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.reminderPlan?.name > b.reminderPlan?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.modifiedvalidFrom' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.planDerivationCriteria?.validFrom > b.planDerivationCriteria?.validFrom ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.modifiedvalidFrom' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.planDerivationCriteria?.validFrom > b.planDerivationCriteria?.validFrom) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.modifiedvalidTo' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.planDerivationCriteria?.validTo > b.planDerivationCriteria?.validTo ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.modifiedvalidTo' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.planDerivationCriteria?.validTo > b.planDerivationCriteria?.validTo) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.customer.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.planDerivationCriteria?.customer?.name > b.planDerivationCriteria?.customer?.name ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.customer.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.planDerivationCriteria?.customer?.name > b.planDerivationCriteria?.customer?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.initiator.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.planDerivationCriteria?.initiator?.name > b.planDerivationCriteria?.initiator?.name ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.initiator.name' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.planDerivationCriteria?.initiator?.name > b.planDerivationCriteria?.initiator?.name) ? 1 : -1);
      }

      if (sortcolumn == 'planDerivationCriteria.legalEntity.hostedOrganizationName' && this.planConfigInput?.planConfigCriteria?.sortMode == 'asc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => a.planDerivationCriteria?.legalEntity?.hostedOrganizationName > b.planDerivationCriteria?.legalEntity?.hostedOrganizationName ? -1 : 1)
      } else if (sortcolumn == 'planDerivationCriteria.legalEntity.hostedOrganizationName' && this.planConfigInput?.planConfigCriteria?.sortMode == 'desc') {
        this.reminderGridData?.reminderPlanConfigurationList?.items.sort((a, b) => (a.planDerivationCriteria?.legalEntity?.hostedOrganizationName > b.planDerivationCriteria?.legalEntity?.hostedOrganizationName) ? 1 : -1);
      }

    }
  }

  onReminderPlanGridCall(planConfigInput: planConfigInput) {
    planConfigInput.planConfigCriteria.pageSize = 10;
    this.spinnerService.setIsLoading(true);
    this.reminderplanService.GetReminderPlanConfigList(planConfigInput).subscribe(
      res => {
        this.spinnerService.setIsLoading(false);
        console.log(res)
        const getResponse = res as reminderPlanConfigurationResponse
        this.reminderGridData = { ...getResponse }

        this.setExternalErrorFalse();
        this.removeLegalError();
        this.removePriorityError();
        this.removeValidError();
        this.RemoveBusinessError(this.businessError);

        if (this.reminderGridData.isPlanDerivationConfigExists) {
          this.reminderHeader = [
            { header: this.translate.instant('plan.reminder.tabel.reminderplan'), field: 'reminderPlan.name', width: '' }
          ];
        }
        else {
          this.reminderHeader = [
            { header: this.translate.instant('plan.reminder.tabel.reminderplan'), field: 'reminderPlan.name', width: '' },
            { header: this.translate.instant('plan.reminder.tabel.validfrom'), field: 'planDerivationCriteria.modifiedvalidFrom', width: '' },
            { header: this.translate.instant('plan.reminder.tabel.validto'), field: 'planDerivationCriteria.modifiedvalidTo', width: '' },
            { header: this.translate.instant('plan.reminder.tabel.customer'), field: 'planDerivationCriteria.customer.name', width: '' },
            { header: this.translate.instant('plan.reminder.tabel.Initiator'), field: 'planDerivationCriteria.initiator.name', width: '' },
            { header: this.translate.instant('plan.reminder.tabel.hostedorg'), field: 'planDerivationCriteria.legalEntity.hostedOrganizationName', width: '' }
          ];
        }

        

        if (!this.reminderGridData.isPlanDerivationConfigExists) {
          this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {

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
          this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {
            x.validFromDisable = false;
            x.validToDisable = false;
            x.isLegalDisable = false
            x.isCustomerDisable = false
            x.isInitiatorDisable = false
          })
        }

        this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {
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

          if (x.planDerivationCriteria.invoiceMaxNewestDate != null)
          {
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


        this.paginationContent = 'Total Records : ' + this.reminderGridData.reminderPlanConfigurationList.totalItemCount;
        this.recordsAvailable = this.reminderGridData.reminderPlanConfigurationList.totalItemCount;
        this.resetPagination = this.reminderGridData.reminderPlanConfigurationList.pageIndex * this.pageRow
        this.index = 0;
        if (this.reminderGridData.reminderPlanConfigurationList.items.length > 0) {
          this.settingFalse();
          this.reminderPlanCard = this.reminderGridData.reminderPlanConfigurationList.items[this.index]
          this.reminderGridData.reminderPlanConfigurationList.items[this.index].isEntered = true;
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

    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError);
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {
      this.isErrors = false;

      this.index = this.reminderGridData.reminderPlanConfigurationList.items.findIndex(get => {
        return get.isEntered == true;
      })
      console.log(this.reminderGridData.reminderPlanConfigurationList.items[this.index]);

      if (this.reminderGridData.reminderPlanConfigurationList.items.length > 0) {
        const date = new Date()
        const defaultDate = new Date(date.setFullYear(1))

        if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom != null) {
          if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom.getFullYear() == defaultDate.getFullYear()) {

            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom = null as unknown as Date
          }

          else {
            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom = new Date(
              Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom.getFullYear(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom.getMonth(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validFrom.getDate(), 0, 0, 0)
            );
          }
        }

        if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo != null) {
          this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo = new Date(
            Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo.getFullYear(),
              this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo.getMonth(),
              this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.validTo.getDate(), 0, 0, 0)
          );
        }

        if (!this.reminderGridData.isPlanDerivationConfigExists) {

          if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate != null) {
            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate = new Date(
              Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getFullYear(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getMonth(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate != null) {
            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate = new Date(
              Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getFullYear(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getMonth(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxOldestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate != null) {
            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate = new Date(
              Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getFullYear(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getMonth(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMinNewestDate.getDate(), 0, 0, 0)
            );
          }

          if (this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate != null) {
            this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate = new Date(
              Date.UTC(this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getFullYear(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getMonth(),
                this.reminderGridData.reminderPlanConfigurationList.items[this.index].planDerivationCriteria.invoiceMaxNewestDate.getDate(), 0, 0, 0)
            );
          }
        }

      }

      this.spinnerService.setIsLoading(true);
      this.reminderplanService.CopyReminderPlan(this.reminderGridData.reminderPlanConfigurationList.items[this.index]).subscribe(
        res => {
          this.spinnerService.setIsLoading(false);
          console.log(res);

          const getResponse = { ...res as reminderPlanConfiguration }
          if (getResponse) {

            this.setExternalErrorFalse();
            this.removeLegalError();
            this.removePriorityError();
            this.removeValidError();
            this.RemoveBusinessError(this.businessError);
            if (getResponse.planDerivationCriteria.validFrom != null) {
              getResponse.planDerivationCriteria.validFrom = new Date(getResponse.planDerivationCriteria.validFrom)
              getResponse.planDerivationCriteria.modifiedvalidFrom = this.datePipe.transform(getResponse.planDerivationCriteria.validFrom, 'dd/MM/yyyy')
            }
            else {
              if (getResponse.reminderPlan.name != null) {
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
            getResponse.reminderPlan.state = stateModel.Created;
            if (getResponse.reminderPlan.reminderPlan2ReminderScenarioList.length > 0) {
              getResponse.reminderPlan.reminderPlan2ReminderScenarioList.forEach(x => {
                x.state = stateModel.Created;
                x.isDelete = false;
                x.rowVersion = 0;
                x.pKey = 0;
              })
            }
            getResponse.validFromDisable = false
            getResponse.validToDisable = true;
            const newlist = this.reminderGridData.reminderPlanConfigurationList.items;
            newlist.push({ ...getResponse });
            this.reminderGridData.reminderPlanConfigurationList.items = [...newlist];
            this.reminderPlanCard = this.reminderGridData.reminderPlanConfigurationList.items[this.reminderGridData.reminderPlanConfigurationList.items.length - 1]

            if (!this.reminderGridData.isPlanDerivationConfigExists) {
              this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {

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
              this.reminderGridData.reminderPlanConfigurationList.items.forEach(x => {
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

  onSave(GridData: reminderPlanConfiguration[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError);
      this.isErrors = true;
    }

   else if (this.userDetailsform.valid) {

      this.isErrors = false;

      const saveData = [...GridData];

      saveData.forEach(x => {

        this.recordsOfReminderScenario = [...new Array<reminderPlan2ReminderScenario>()];

        x.reminderPlan.reminderPlan2ReminderScenarioList.forEach(x => {
          if (x.state != stateModel.Deleted && !x.isDelete) {
            this.recordsOfReminderScenario.push(x)
          }
        })
        x.reminderPlan.reminderPlan2ReminderScenarioList = this.recordsOfReminderScenario;

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

        if (!this.reminderGridData.isPlanDerivationConfigExists) {

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

      console.log(saveData)

      this.spinnerService.setIsLoading(true);
      this.reminderplanService.SaveReminderPlan(saveData).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.onReminderPlanGridCall(this.planConfigInput);
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
   
    const MaxAmtValidation = new ErrorDto;
    MaxAmtValidation.validation = "maxError";
    MaxAmtValidation.isModelError = true;
    MaxAmtValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.maxamt');
    this.maxAmtErrorDto = [MaxAmtValidation];
    this.MaxAmtTextBoxconfig.minValueValidation = this.translate.instant('plan.treatment.mandatory.maxamt')

    const MinAmtValidation = new ErrorDto;
    MinAmtValidation.validation = "maxError";
    MinAmtValidation.isModelError = true;
    MinAmtValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minamt');
    this.minAmtErrorDto = [MinAmtValidation];
    this.MinAmtTextBoxconfig.maxValueValidation = this.translate.instant('plan.treatment.mandatory.minamt');


    
    
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
    MinAvgValidation.validationMessage = this.translate.instant('plan.treatment.mandatory.minavg');
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

    const DossierError = new ErrorDto;
    DossierError.validation = "required";
    DossierError.isModelError = true;
    DossierError.validationMessage = this.translate.instant('plan.reminder.mandatory.dossierstatus') + this.translate.instant('plan.treatment.mandatory.required');
    this.DossierDropdownConfig.Errors = [DossierError];
    this.DossierDropdownConfig.required = true;

    const ScenarioError = new ErrorDto;
    ScenarioError.validation = "required";
    ScenarioError.isModelError = true;
    ScenarioError.validationMessage = this.translate.instant('plan.reminder.mandatory.Remindersenario') + this.translate.instant('plan.treatment.mandatory.required');
    this.ScenarioDropdownConfig.Errors = [ScenarioError];
    this.ScenarioDropdownConfig.required = true;

    const ValidFromError = new ErrorDto;
    ValidFromError.validation = "required";
    ValidFromError.isModelError = true;
    ValidFromError.validationMessage = this.translate.instant('plan.treatment.mandatory.ValidFor') + this.translate.instant('plan.treatment.mandatory.required');
    this.ValidFromDateconfig.Errors = [ValidFromError];
    this.ValidFromDateconfig.required = true;

    const LegalError = new ErrorDto;
    LegalError.validation = "required";
    LegalError.isModelError = true;
    LegalError.validationMessage = this.translate.instant('plan.treatment.mandatory.Legal') + this.translate.instant('plan.treatment.mandatory.required');
    this.LegalAutoCompleteTextBoxconfig.Errors = [LegalError];
    this.LegalAutoCompleteTextBoxconfig.required = true;

  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidControlsBaseService, FluidButtonConfig, FluidControlTextBoxConfig, FluidDropDownConfig } from '@close-front-office/shared/fluid-controls';
import { FluidAutoCompleteConfig } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { AgendaType } from './Model/agendaType.model';
import { MasterAgenda } from './Model/masterAgenda.model';
import { ResponseMasterAgenda } from './Model/responseMasterAgenda.model';
import { ServicingCustomer } from './Model/servicingCustomer.model';
import { User } from './Model/user.model';
import { MasterAgendaService } from './Service/masterAgenda.service';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { State } from '../action-receiver/Model/modelState';
import { CreditProviderName } from './Model/creditproviderName.model';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';



@Component({
  selector: 'magenda-master-agenda',
  templateUrl: './master-agenda.component.html',
  styleUrls: ['./master-agenda.component.scss']
})
export class MasterAgendaComponent implements OnInit {
  @ViewChild("masterAgendaform", { static: true }) masterAgendaform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public CustomerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;

  dataSelected: any;
  show!: boolean
  isErrors!:boolean
  index: any;
  placeholder = "select";
  Header = this.translate.instant('agenda.Validation.Header')
  exceptionBox!: boolean
  exception!: string
  isClicked!: boolean;
  clearIcon = true;
  customerDeselect: ServicingCustomer = { ... new ServicingCustomer() }
  typeDeselect: AgendaType = { ... new AgendaType() }
  Response: ResponseMasterAgenda = new ResponseMasterAgenda();
  formDetails: MasterAgenda = { ...new MasterAgenda() };
  selectedDetails: MasterAgenda = { ...new MasterAgenda() };
  deletedRecords: MasterAgenda[] = [];
  filteredUsers: User[] = []
  Nothide!: boolean
  navigateUrl!: string
  errorCode!:string

  overviewHeader = [{ header: this.translate.instant('agenda.masterAgenda.gridname'), field: 'name', width: '33%' }, { header: this.translate.instant('agenda.masterAgenda.commercialOwner'), field: 'servicingCustomer.name.caption', width: '21%' }, { header: this.translate.instant('agenda.masterAgenda.mainOwner'), field: 'masterUser.name', width: '21%' }, { header: this.translate.instant('agenda.masterAgenda.type'), field: 'agendaTypeName.caption', width: '20%' }, { header: '', field: 'deleteButton', width: '5%', fieldType: 'deleteButton' }];

  constructor(public commonService: ConfigContextService,public fluidService: FluidControlsBaseService, public route: ActivatedRoute, public spinnerService: SpinnerService, public agendaService: MasterAgendaService, public translate: TranslateService, public fluidValidation: fluidValidationService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  SettingFalse() {
    this.Response.agendaMasterList.forEach(set => {
      set.isEntered = false;
    })
  }

  clickGrid(dataselected: MasterAgenda) {
    if (dataselected) {
      if (this.masterAgendaform.valid || dataselected.isEntered) {
  
        this.SettingFalse();
        this.index = this.Response.agendaMasterList.findIndex(item => {
          return item == dataselected
        })
        this.Response.agendaMasterList[this.index].isEntered = true;
        this.formDetails = { ...dataselected };
        this.selectedDetails = dataselected;
        this.dataSelected = null;
        this.isClicked = true;
      }
      else {
        this.RequiredTextBoxconfig.externalError = true;
        this.AutoCompleteConfig.externalError = true;
        this.TypeDropdownConfig.externalError = true;
        this.CustomerDropdownConfig.externalError = true;
      }
    }
  }

  addRow() {
    if ((this.masterAgendaform.valid) ||
      this.Response.agendaMasterList.length == 0) {

      const masterAgendaObj = new MasterAgenda();
      this.SettingFalse();
      masterAgendaObj.isEntered = true;
      masterAgendaObj.state = State.created;
      masterAgendaObj.pKey = 0;
      masterAgendaObj.canValidate = false;
      masterAgendaObj.rowVersion = 0;
      const servicingCustomer = { ... new ServicingCustomer() };
      const agendaType = { ... new AgendaType() };
      const userObj = { ... new User() };
      userObj.name = '';
      masterAgendaObj.agendaTypeName = agendaType
      masterAgendaObj.masterUser = userObj
      masterAgendaObj.servicingCustomer = servicingCustomer
      masterAgendaObj.name = '';
      const newlist = this.Response.agendaMasterList;
      newlist.push({ ...masterAgendaObj });
      this.Response.agendaMasterList = [...newlist];
      this.masterAgendaform.resetForm();
      this.formDetails = { ...new MasterAgenda() };
      this.selectedDetails = new MasterAgenda()
      this.selectedDetails = this.Response.agendaMasterList[this.Response.agendaMasterList.length - 1];
      this.isClicked = false;
      this.Nothide = true;
      this.RequiredTextBoxconfig.externalError = false;
      this.AutoCompleteConfig.externalError = false;
      this.TypeDropdownConfig.externalError = false;
      this.CustomerDropdownConfig.externalError = false;
    }
    else {
      this.RequiredTextBoxconfig.externalError = true;
      this.AutoCompleteConfig.externalError = true;
      this.TypeDropdownConfig.externalError = true;
      this.CustomerDropdownConfig.externalError = true;
    }
  }

  onRowDelete(event: MasterAgenda, array: MasterAgenda[]) {
    if (this.masterAgendaform.valid || (((event.agendaTypeName == null || event.agendaTypeName?.caption == null) ||
      (event.masterUser?.name == '' || event.masterUser?.name == null) || (event.name == '' || event.name == null) ||
      (event.servicingCustomer?.name == null || event.servicingCustomer?.name.caption == null)) && event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
     

      if (event.state != State.created) {
        event.state = State.deleted;
        this.deletedRecords.push({ ...event })
      }
      array.splice(deletedata, 1);
      this.Response.agendaMasterList = [...array];
      if (this.Response.agendaMasterList.length == 0) {
        setTimeout(() => {
          this.Nothide = false;
        }, 5);
      }
      if (this.Response.agendaMasterList.length > 0) {
        this.SettingFalse();
        this.formDetails = { ...this.Response.agendaMasterList[this.Response.agendaMasterList.length - 1] }
        this.selectedDetails = this.Response.agendaMasterList[this.Response.agendaMasterList.length - 1]
        this.Response.agendaMasterList[this.Response.agendaMasterList.length - 1].isEntered = true;
      }
      
      this.RequiredTextBoxconfig.externalError = false;
      this.AutoCompleteConfig.externalError = false;
      this.TypeDropdownConfig.externalError = false;
      this.CustomerDropdownConfig.externalError = false;
    }
    else {
      this.RequiredTextBoxconfig.externalError = true;
      this.AutoCompleteConfig.externalError = true;
      this.TypeDropdownConfig.externalError = true;
      this.CustomerDropdownConfig.externalError = true;
    }

  }
  changeNameData(event: any) {
    if (event) {

      if (!this.isClicked) {
        this.index = this.Response.agendaMasterList.findIndex(get => {
          return get.isEntered == true;
        })
      }

      if (this.Response.agendaMasterList[this.index].state == State.unknown) {
        this.Response.agendaMasterList[this.index].state = State.dirty;
      }
      if (event.target?.value != '') {
        this.Response.agendaMasterList[this.index].name = event.target?.value;
        this.formDetails.name = event.target?.value;

      }
      else {
        this.Response.agendaMasterList[this.index].name = '';
        this.formDetails.name = '';
        
      }
    }
  }
  changeServicingCustomerData(event: any) {
    if (event) {

      if (!this.isClicked) {
        this.index = this.Response.agendaMasterList.findIndex(get => {
          return get.isEntered == true;
        })
      }
      if (this.Response.agendaMasterList[this.index].state == State.unknown) {
        this.Response.agendaMasterList[this.index].state = State.dirty;
      }
      if (event?.value != null) {
        this.Response.agendaMasterList[this.index].servicingCustomer = event?.value;
        this.formDetails.servicingCustomer = event?.value

      }
      else {
        this.Response.agendaMasterList[this.index].servicingCustomer = new ServicingCustomer();
        this.formDetails.servicingCustomer = null
      }
    }
  }
  changeMainOwnerData(event: any) {
    if (event) {
      if (!this.isClicked) {
        this.index = this.Response.agendaMasterList.findIndex(get => {
          return get.isEntered == true;
        })
      }
      if (this.Response.agendaMasterList[this.index].state == State.unknown) {
        this.Response.agendaMasterList[this.index].state = State.dirty;
      }
      const user = this.Response.agendaMasterCodeTables.usersList.filter(x => {
        return x.name == event.target?.value;
      })
    
      if (user[0] != null) {
        this.Response.agendaMasterList[this.index].masterUser = user[0];
        this.formDetails.masterUser = user[0];
      }
      else {
        this.Response.agendaMasterList[this.index].masterUser = new User();
        this.formDetails.masterUser = undefined
        
      }

    }

  }


  filterUsers(event: any) {
    if (event) {
      this.filteredUsers = [];

      this.Response.agendaMasterCodeTables.usersList
        .filter(data => {
          if (data.name?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredUsers.push(data);
          }

        });
    }
  }

  changeTypeData(event: any) {
    if (event) {

      if (!this.isClicked) {
        this.index = this.Response.agendaMasterList.findIndex(get => {
          return get.isEntered == true;
        })
      }
      if (this.Response.agendaMasterList[this.index].state == State.unknown) {
        this.Response.agendaMasterList[this.index].state = State.dirty;
      }
      if (event?.value != null) {
        this.Response.agendaMasterList[this.index].agendaTypeName = event?.value;
        this.formDetails.agendaTypeName = event?.value
      }
      else {
        this.Response.agendaMasterList[this.index].agendaTypeName = new AgendaType() ;
        this.formDetails.agendaTypeName = null;
        
      }
    }
  }


  onSave(GridData: MasterAgenda[]) {

    if (this.masterAgendaform.valid) {

      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != State.unknown) {
          this.deletedRecords.push({ ...x })
        }
        this.deletedRecords.forEach(y => {
          if (y.state == State.deleted && y.agendaTypeName?.caption == null) {
            y.agendaTypeName = null;
          }
          if (y.state == State.deleted && y.servicingCustomer?.name?.caption == null) {
            y.servicingCustomer = null;
          }
          if (y.state == State.deleted && y.masterUser?.name == '') {
            y.masterUser = null;
          }
          if (y.state == State.deleted && y.name == '') {
            y.name = null;
          }
        })
      })
      this.spinnerService.setIsLoading(true);
      this.agendaService.PostResponse(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        if (res) {
          this.show = false;
          this.deletedRecords = [...new Array<MasterAgenda>()];

          this.agendaService.GetResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = { ...res as ResponseMasterAgenda }
            this.Response.agendaMasterList = [...getResponse.agendaMasterList];

            this.RequiredTextBoxconfig.externalError = false;
            this.AutoCompleteConfig.externalError = false;
            this.TypeDropdownConfig.externalError = false;
            this.CustomerDropdownConfig.externalError = false;

            if (this.Response.agendaMasterList.length > 0) {
               this.SettingFalse();
              this.index = this.Response.agendaMasterList.findIndex(i => {
                return ((i.agendaTypeName?.caption == this.formDetails.agendaTypeName?.caption) && (i.masterUser?.name == this.formDetails.masterUser?.name) &&
                  (i.name == this.formDetails.name) && (i.servicingCustomer?.name?.caption == this.formDetails.servicingCustomer?.name?.caption))
              })
              this.Response.agendaMasterList[this.index].isEntered = true;
              this.formDetails = { ...this.Response.agendaMasterList[this.index] }
              this.selectedDetails = this.Response.agendaMasterList[this.index]

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
              this.deletedRecords = [...new Array<MasterAgenda>()];
              this.exceptionBox = true;
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
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<MasterAgenda>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.RequiredTextBoxconfig.externalError = true;
      this.AutoCompleteConfig.externalError = true;
      this.TypeDropdownConfig.externalError = true;
      this.CustomerDropdownConfig.externalError = true;
    }
  }


  onclose() {
    const unsaved = this.Response.agendaMasterList.findIndex(x => {
      return x.state == State.created || x.state == State.dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: MasterAgenda[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RequiredTextBoxconfig.externalError = false;
    this.AutoCompleteConfig.externalError = false;
    this.TypeDropdownConfig.externalError = false;
    this.CustomerDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }
  clearUser(event: any) {

    this.formDetails.masterUser = null;
  }
  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe((res:any) => {
      if(res.masteragendaData != null){
        this.spinnerService.setIsLoading(false);
        if (res) {
          this.Response = { ...res.masteragendaData as ResponseMasterAgenda };
          this.deletedRecords = [...new Array<MasterAgenda>()];
          this.index = 0;
          if (this.Response.agendaMasterList.length > 0) {
            this.Nothide = true;
            this.SettingFalse();
            this.Response.agendaMasterList[this.index].isEntered = true;
            this.formDetails = { ...this.Response.agendaMasterList[this.index] };
            this.selectedDetails = this.Response.agendaMasterList[this.index] ;
          }
        }
      }
     
    });
  }

  buildConfiguration() {
    const nameRequired = new ErrorDto;
    nameRequired.validation = "required";
    nameRequired.isModelError = true;
    nameRequired.validationMessage =  this.translate.instant('agenda.masterAgenda.ValidationError.name') +
    this.translate.instant('agenda.masterAgenda.ValidationError.required');
    this.RequiredTextBoxconfig.Errors = [nameRequired];
    this.RequiredTextBoxconfig.required = true

    const typeRequired = new ErrorDto;
    typeRequired.validation = "required";
    typeRequired.isModelError = true;
    typeRequired.validationMessage = this.translate.instant('agenda.masterAgenda.ValidationError.type') +
    this.translate.instant('agenda.masterAgenda.ValidationError.required');
    this.TypeDropdownConfig.Errors = [typeRequired];
    this.TypeDropdownConfig.required = true

    const customerRequired = new ErrorDto;
    customerRequired.validation = "required";
    customerRequired.isModelError = true;
    customerRequired.validationMessage =  this.translate.instant('agenda.masterAgenda.ValidationError.commercialOwner') +
    this.translate.instant('agenda.masterAgenda.ValidationError.required');
    this.CustomerDropdownConfig.Errors = [customerRequired];
    this.CustomerDropdownConfig.required = true

    const userRequired = new ErrorDto;
    userRequired.validation = "required";
    userRequired.isModelError = true;
    userRequired.validationMessage = this.translate.instant('agenda.masterAgenda.ValidationError.mainOwner') +
    this.translate.instant('agenda.masterAgenda.ValidationError.required');
    this.AutoCompleteConfig.Errors = [userRequired];
    this.AutoCompleteConfig.required = true
  }

}

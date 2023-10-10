import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidDropDownConfig,
  FluidPickListConfig,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { MasterAgenda } from '../master-agenda/Model/masterAgenda.model';
import { User } from '../master-agenda/Model/user.model';
import { ActionReceiver } from './Model/actionReceiver.model';
import { ActionReceiverType } from './Model/actionReceiverType.model';
import { ResponseActionReceiver } from './Model/responseActionReceiver';
import { ActionReceiverService } from './Service/actionReceiver.service';
import { State } from './Model/modelState';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { ActionReceiver2User } from './Model/actionReceiver2User.model';
import { empty } from 'rxjs';

@Component({
  selector: 'magenda-action-receiver',
  templateUrl: './action-receiver.component.html',
  styleUrls: ['./action-receiver.component.scss']
})
export class ActionReceiverComponent implements OnInit {
  @ViewChild('ActionReceiver', { static: true }) ActionReceiver!: NgForm;
  @ViewChild('ActionReceiver2User', { static: true }) ActionReceiver2User!: NgForm;
  public SectionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public AgendaDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ActionRecieverDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  dataSelected: any;
  actionDeselect: ActionReceiverType = { ...new ActionReceiverType() };
  agendaDeselect: any;
  section!: ActionReceiver;
  sectionForActionReceiver2User: ActionReceiver2User[] = [];
  selectedDetails!: ActionReceiver;
  actionReceiverUserDetailsNotHide!: boolean ;
  selectedactionReceiver2User!: any;
  actionReceiver2User: ActionReceiver2User[] = [];
  username: User[] = [];
  deletedRecords: ActionReceiver[] = [];
  targetList: User[] = [];
  source: User[] = [];
  target: User[] = [];
  users: string[] = [];
  existingUsers : string[] = [];
  placeholder = 'select';
  businessError!: string;
  index: any;
  isClicked!: boolean;
  exceptionBox!: boolean;
  exception!: string;
  show!: boolean;
  rowAdded!: boolean;
  Nothide!: boolean;
  isErrors!:boolean
  clearIcon = true;
  selectUserHeader = [
    { header: this.translate.instant('agenda.actionReceiver.section'), field: 'actionReceiverType.caption', width: '95%' },
    { header: '', field: '1', width: '5%', fieldType: 'deleteButton' }
  ];
  selectActionReciever = [
    { header: this.translate.instant('agenda.actionReceiver.user'), field: 'userName', width: '50%' },
    { header: this.translate.instant('agenda.actionReceiver.isonlyfortaskcreation'), field: 'isOnlyForTaskCreation', fieldType: 'checkbox', width: '50%', isReadOnly: 'isReadOnly'},
    { header: '', field: '1', width: '5%', fieldType: 'deleteButton' },
  ];

  Response: ResponseActionReceiver = new ResponseActionReceiver();
  
  Header = this.translate.instant('agenda.Validation.Header');
  navigateUrl!: string
  errorCode!:string

  constructor(
    public fluidService: FluidControlsBaseService,
    public spinnerService: SpinnerService,
    public actionService: ActionReceiverService,
    public translate: TranslateService,
    public fluidValidation: fluidValidationService,
    public route: ActivatedRoute,
    public commonService: ConfigContextService
   ) {
    this.businessError = this.translate.instant('agenda.actionReceiver.ValidationError.buisnessError');
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe(
      (res: any) => {
        if(res.actionReciverData != null){
          this.spinnerService.setIsLoading(false);
          this.Response = { ...(res.actionReciverData as ResponseActionReceiver) };
  
          this.SectionDropdownConfig.externalError = false;
          this.AgendaDropdownConfig.externalError = false;
          this.ActionRecieverDropdownConfig.externalError = false;
  
          this.index = 0;
          this.deletedRecords = [...new Array<ActionReceiver>()];
          if (this.Response.actionReceivers.length > 0) {
            this.Nothide = true;
            this.SettingFalse();
            this.Response.actionReceivers[this.index].isEntered = true;
            this.section = this.Response.actionReceivers[this.index];
            if (this.section?.actionReceiver2user[this.index]) {
              this.selectedactionReceiver2User = this.section?.actionReceiver2user[this.index];
            }
            this.selectedDetails = this.Response.actionReceivers[this.index];
            this.selectedDetails.actionReceiver2user.length > 0 ? this.actionReceiverUserDetailsNotHide = true : this.actionReceiverUserDetailsNotHide = false;
            this.assigningSourceTarget(this.index);
            this.selectedDetails?.actionReceiver2user.forEach(x => x.isReadOnly = true);
            this.section?.actionReceiver2user.forEach(x => {
              this.existingUsers.push(x.userName)
            });
            this.username = this.Response.actionReceiversCodeTablesList.userList;
          }
        }
      }
    );
  }

  SettingFalse() {
    this.Response.actionReceivers.forEach(set => {
      set.isEntered = false;
    });
  }

  click(data: ActionReceiver) {
    if (data) {
      const filteredData = this.Response.actionReceivers.map(item => {
        return item.actionReceiverType?.caption;
      });
      const hasValue = filteredData.some(function (item, index) {
        return filteredData.indexOf(item) != index;
      });
      if (this.ActionReceiver.valid || data.isEntered) {
        if (!hasValue) {
          this.SettingFalse();
          this.index = this.Response.actionReceivers.findIndex(item => {
            return item == data;
          });
          this.Response.actionReceivers[this.index].isEntered = true;
          this.section = data;
          this.selectedDetails = data;
          this.existingUsers = [];
          this.section?.actionReceiver2user.forEach(x => {
            this.existingUsers.push(x.userName)
          });
          this.assigningSourceTarget(this.index);
          this.dataSelected = null;
          this.isClicked = true;
          this.selectedactionReceiver2User = null;
          if (this.section?.actionReceiver2user.length > 0) {
            this.selectedactionReceiver2User = this.section?.actionReceiver2user[0];
          }
          data.actionReceiver2user.length > 0 ? this.actionReceiverUserDetailsNotHide = true : this.actionReceiverUserDetailsNotHide = false;
          this.selectedDetails?.actionReceiver2user.forEach(x => x.isReadOnly = true);
        } else {
          this.throwBusinessError(this.businessError);
        }
      } else {
        this.AgendaDropdownConfig.externalError = true;
        this.SectionDropdownConfig.externalError = true;
        if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }
  clickselect(data: ActionReceiver2User) {
    
      this.selectedactionReceiver2User = data;
  }
  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.Response.actionReceivers[index].users.forEach(user => {
      const filter = this.Response.actionReceiversCodeTablesList.userList.findIndex(y => {
        return user == y.userName;
      });
      if (filter != -1) {
        this.targetList.push(this.Response.actionReceiversCodeTablesList.userList[filter]);
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.Response.actionReceiversCodeTablesList.userList];
    this.target.forEach(user => {
      const index = sourcelist.findIndex(value => {
        return value.userName == user.userName;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];
  }
  onRowDeleteactionRecieverUser(data: ActionReceiver2User, array: ActionReceiver2User[]) {
    const deleteactionreciever = array;
    if (data.state != State.created) {
      this.Response.actionReceivers[this.Response.actionReceivers.findIndex(x => x.pKey == this.selectedDetails?.pKey)].state = State.dirty;
      this.Response.actionReceivers[this.Response.actionReceivers.findIndex(x => x.pKey == this.selectedDetails?.pKey)].
        actionReceiver2user[array.findIndex(x => x.pKey == data.pKey)].state = State.deleted;
      
    }
    const deletedata = this.Response.actionReceivers[this.Response.actionReceivers.findIndex(x => x.pKey == this.selectedDetails.pKey)].
      actionReceiver2user.findIndex(x => x.userName == data.userName);
    this.removeBusinessErrorCall();
    this.ActionRecieverDropdownConfig.externalError = false;
    this.assigningSourceTarget(this.Response.actionReceivers.length - 1);
    this.existingUsers.splice(deletedata, 1);
    array.splice(deletedata, 1);
    if (this.selectedDetails) {
      this.selectedDetails.actionReceiver2user = [...array];
    }
    if (deleteactionreciever.length == 0) {
      setTimeout(() => {
        this.actionReceiverUserDetailsNotHide = false;
      }, 5);

    }
    this.selectedactionReceiver2User = this.selectedDetails?.actionReceiver2user[this.selectedDetails?.actionReceiver2user.length - 1];

  }
  onRowDelete(dataselect: ActionReceiver, array: ActionReceiver[]) {
    const mappedData = this.Response.actionReceivers.map(item => {
      return item.actionReceiverType?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (
      ((dataselect.actionReceiverType?.caption == null || dataselect.agendaMaster?.name == '' || dataselect.agendaMaster == null) &&
        dataselect.isEntered) ||
      this.ActionReceiver.valid
    ) {
      const deletedata = array.findIndex(data => {
        return data == dataselect;
      });

      if (!hasValue || (hasValue && dataselect.isEntered)) {
        if (dataselect.state != State.created) {
          dataselect.state = State.deleted;
          this.deletedRecords.push({ ...dataselect });
        }
        
        array.splice(deletedata, 1);

        this.actionReceiverUserDetailsNotHide = false;
        this.removeBusinessErrorCall();
        this.AgendaDropdownConfig.externalError = false;
        this.SectionDropdownConfig.externalError = false;

        this.Response.actionReceivers = [...array];
        if (this.Response.actionReceivers.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);  
        }
        this.section = new ActionReceiver() ;
        if (this.Response.actionReceivers.length > 0) {
          this.section.actionReceiverType = 
          this.Response.actionReceivers[this.Response.actionReceivers.length - 1].actionReceiverType
          this.section.agendaMaster = this.Response.actionReceivers[this.Response.actionReceivers.length - 1].agendaMaster
          this.section = this.Response.actionReceivers[this.Response.actionReceivers.length - 1]
          this.selectedDetails = this.Response.actionReceivers[this.Response.actionReceivers.length - 1]
          this.SettingFalse();
          this.Response.actionReceivers[this.Response.actionReceivers.length - 1].isEntered = true;
          this.assigningSourceTarget(this.Response.actionReceivers.length - 1);
        }
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      this.AgendaDropdownConfig.externalError = true;
      this.SectionDropdownConfig.externalError = true;
      if (hasValue) {
        this.throwBusinessError(this.businessError);
      }
    }
  }

  addRow() {
    const mappedData = this.Response.actionReceivers.map(item => {
      return item.actionReceiverType?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    if (this.ActionReceiver.valid || this.Response.actionReceivers.length == 0) {
      if (!hasValue) {
        this.SettingFalse();
        const addRow = new ActionReceiver();
        addRow.state = State.created;
        addRow.pKey = 0;
        addRow.canValidate = false;
        addRow.isEntered = true;
        addRow.rowVersion = 0;
        addRow.users = [];
        this.target = [];
        this.users = [];
        this.source = [...this.Response.actionReceiversCodeTablesList.userList];
        const codetable = { ...new ActionReceiverType() };
        const masterAgenda = { ...new MasterAgenda() };
        masterAgenda.name = '';
        addRow.actionReceiverType = codetable;
        addRow.agendaMaster = masterAgenda;
        const newlist = this.Response.actionReceivers;
        newlist.push({ ...addRow });
        this.Response.actionReceivers = [...newlist];
        this.isClicked = false;
        this.Nothide = true;
        this.actionReceiverUserDetailsNotHide = false;
        this.ActionReceiver.resetForm();
        this.section = new ActionReceiver();
        this.selectedDetails = this.Response.actionReceivers[this.Response.actionReceivers.length - 1]
        this.removeBusinessErrorCall();
        this.AgendaDropdownConfig.externalError = false;
        this.SectionDropdownConfig.externalError = false;
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      this.AgendaDropdownConfig.externalError = true;
      this.SectionDropdownConfig.externalError = true;
      if (hasValue) {
        this.throwBusinessError(this.businessError);
      }
    }
  }


  addRowForActionreceiver2User() {
    
      const mappedData = this.selectedDetails?.actionReceiver2user.map(item => {
        return item.userName;
      });
      const hasValue = mappedData.some((item, index) => {
        return mappedData.indexOf(item) != index;
      });

      let isValid = true;
      isValid = this.selectedDetails?.actionReceiver2user.length >= 1 ?
        !(mappedData.some(item => {
          return item == undefined;
        })) : true;
      this.actionReceiverUserDetailsNotHide = true
      if (isValid && (this.ActionReceiver.valid || this.selectedDetails?.actionReceiver2user.length == 0)) {
        if (!hasValue) {
          
          const addRow = new ActionReceiver2User();
          addRow.state = State.created;
          addRow.pKey = 0;
          addRow.canValidate = false;
          addRow.rowVersion = 0;
          addRow.isEntered = true;
          const newlist = this.selectedDetails?.actionReceiver2user;
          newlist.push({ ...addRow });
          if (this.selectedDetails) {
            this.selectedDetails.actionReceiver2user = [...newlist];
          }
          this.isClicked = false;
          this.Nothide = true;
          this.selectedactionReceiver2User = new ActionReceiver2User();
          this.selectedactionReceiver2User = this.selectedDetails?.actionReceiver2user[this.selectedDetails?.actionReceiver2user.length - 1];

          if (this.selectedDetails) {
            this.selectedDetails.state = State.dirty;
          }
          this.selectedactionReceiver2User.isReadOnly = true;
          this.removeBusinessErrorCall();
          this.ActionRecieverDropdownConfig.externalError = false;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.AgendaDropdownConfig.externalError = true;
        this.ActionRecieverDropdownConfig.externalError = true;
        if (hasValue) {
          this.throwBusinessError(this.businessError);
        }
      }
    
  }
  changeSectionGridData(event: any) {
    if (event != undefined) {
   
      if (!this.isClicked) {
        this.index = this.Response.actionReceivers.findIndex(get => {
          return get.isEntered == true;
        });
      }
      if (this.Response.actionReceivers[this.index].state == State.unknown) {
        this.Response.actionReceivers[this.index].state = State.dirty;
      }
      if (event?.value != null) {
        this.Response.actionReceivers[this.index].actionReceiverType = event?.value;
        this.section.actionReceiverType = event?.value;
        this.SectionDropdownConfig.externalError = false;
        this.removeBusinessErrorCall();
      } else {
        this.Response.actionReceivers[this.index].actionReceiverType = null;
        this.section.actionReceiverType = null;
        this.RemoveBusinessError(this.businessError)
        this.SectionDropdownConfig.externalError = true;
      }
    }
  }

  changeAgendaGridData(event: any) {
    if (event != undefined) {
      
      if (!this.isClicked) {
        this.index = this.Response.actionReceivers.findIndex(get => {
          return get.isEntered == true;
        });
      }
      if (this.Response.actionReceivers[this.index].state == State.unknown) {
        this.Response.actionReceivers[this.index].state = State.dirty;
      }
      if (event?.value != null) {
        this.Response.actionReceivers[this.index].agendaMaster = event?.value;
        this.section.agendaMaster = event?.value;
        this.AgendaDropdownConfig.externalError = false;
      } else {
        this.section.agendaMaster = null;
        this.Response.actionReceivers[this.index].agendaMaster = null;
        this.AgendaDropdownConfig.externalError = true;
      }
    }
  }

  changeActionReciever2UserGridData(event: any) {
    if (event != undefined) {
      if (this.selectedactionReceiver2User.state == State.unknown || this.selectedDetails?.state == State.unknown) {
        if (this.selectedDetails) {
          this.selectedDetails.state = State.dirty
        }
        this.selectedactionReceiver2User.state = State.dirty;
      }
      if (event?.value != null) {
       
        this.selectedactionReceiver2User.userName = event.value.userName;
        this.sectionForActionReceiver2User.push(this.selectedactionReceiver2User);
        const hasValueActionReceiver2User = this.existingUsers.filter(x => x == this.selectedactionReceiver2User.userName);
        if (hasValueActionReceiver2User.length > 0) {
          this.throwBusinessError(this.businessError);
          this.isErrors = true;
        }
        else {
          this.RemoveBusinessError(this.businessError);
        }
        
        this.ActionRecieverDropdownConfig.externalError = false;
      } else {
        this.RemoveBusinessError(this.businessError);
        this.selectedactionReceiver2User.userName == null;
        this.ActionRecieverDropdownConfig.externalError = true;
      }
    }
  }

  changeisOnlyForTaskCreation(event: any) {
    if (event != undefined) {
      if (this.selectedactionReceiver2User.state == State.unknown || this.selectedDetails?.state == State.unknown) {
        if (this.selectedDetails) {
          this.selectedDetails.state = State.dirty
        }
        this.selectedactionReceiver2User.state = State.dirty;
      }
      if (event != null) {
        
        this.selectedactionReceiver2User.isOnlyForTaskCreation = event;
      } else {
        this.selectedDetails?.actionReceiver2user[this.index].isOnlyForTaskCreation == null;
      }
    }
  }
  changeTarget(event: User[]) {
    if (event != undefined) {
      if (!this.isClicked) {
        this.index = this.Response.actionReceivers.findIndex(get => {
          return get.isEntered == true;
        });
      }
      if (this.Response.actionReceivers[this.index].state == State.unknown) {
        this.Response.actionReceivers[this.index].state = State.dirty;
      }
      this.users = [];
      event.forEach(x => {
        const dupIndex = this.users.findIndex(y => {
          return y == x.userName;
        });
        if (dupIndex == -1) {
          this.users.push(x.userName);
        }
      });
      this.Response.actionReceivers[this.index].users = this.users;
    }
  }
  onclose() {
    const unsaved = this.Response.actionReceivers.findIndex(x => {
      return x.state == State.created || x.state == State.dirty;
    });
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: ActionReceiver[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.removeBusinessErrorCall();
    this.AgendaDropdownConfig.externalError = false;
    this.SectionDropdownConfig.externalError = false;
    this.ActionRecieverDropdownConfig.externalError = false;
    //navigate
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  removeBusinessErrorCall() {
    const mappedData = this.Response.actionReceivers.map(item => {
      return item.actionReceiverType?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });

    if (!hasValue) {
      this.RemoveBusinessError(this.businessError);
    }
  }

  onSave(GridData: ActionReceiver[]) {
    const mappedData = GridData.map(item => {
      return item.actionReceiverType?.caption;
    });
    const hasValue = mappedData.some((item, index) => {
      return mappedData.indexOf(item) != index;
    });
    const actionReceiver2users : string[] = [];
    this.selectedDetails.actionReceiver2user.forEach(x => {
      actionReceiver2users.push(x.userName);
    });
    const hasValueActionReceiver2User = actionReceiver2users.some((item, index) => actionReceiver2users.indexOf(item) !== index)
    this.isErrors = false;
    if (hasValue || hasValueActionReceiver2User) {
      this.throwBusinessError(this.businessError);
      this.isErrors = true;
    } else if (this.ActionReceiver.valid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != State.unknown) {
          this.deletedRecords.push({ ...x });
        }
        this.deletedRecords.forEach(y => {
          if (y.state == State.deleted && y.actionReceiverType?.caption == null) {
            y.actionReceiverType = null;
          }
          if (y.state == State.deleted && y.agendaMaster?.name == null) {
            y.agendaMaster = null;
          }
        });
      });


      this.spinnerService.setIsLoading(true);
      this.actionService.PostResponse(this.deletedRecords).subscribe(
        res => {
          this.spinnerService.setIsLoading(false);
            this.deletedRecords = [...new Array<ActionReceiver>()];

            this.actionService.GetResponse().subscribe(res => {
              this.spinnerService.setIsLoading(false);
              this.users = [];
              const getResponse = { ...(res as ResponseActionReceiver) };
              this.Response.actionReceivers = [...getResponse.actionReceivers];

              this.AgendaDropdownConfig.externalError = false;
              this.SectionDropdownConfig.externalError = false;
              this.ActionRecieverDropdownConfig.externalError = false;
             
            
              if (this.Response.actionReceivers.length > 0) {
                this.SettingFalse();
                this.target.forEach(x => {
                  this.users.push(x.userName);
                });
                this.index = this.Response.actionReceivers.findIndex(section => {
                  return (
                    section.actionReceiverType?.caption == this.section.actionReceiverType?.caption &&
                    section.agendaMaster?.name == this.section.agendaMaster?.name
                  );
                });

                this.Response.actionReceivers[this.index].isEntered = true;
                this.section = this.Response.actionReceivers[this.index];
                this.selectedDetails = this.Response.actionReceivers[this.index]
                this.selectedactionReceiver2User = this.selectedDetails?.actionReceiver2user[0];
                this.existingUsers=[]
                this.selectedDetails?.actionReceiver2user.forEach(x => {
                  this.existingUsers.push(x.userName),
                  x.isReadOnly = true
                });
                this.assigningSourceTarget(this.index);

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
                this.deletedRecords = [...new Array<ActionReceiver>()];
                this.exceptionBox = true;
              });
        },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<ActionReceiver>()];
          this.exceptionBox = true;
        }
      );
    
    }
    else {
      this.isErrors = true;
      this.AgendaDropdownConfig.externalError = true;
      this.SectionDropdownConfig.externalError = true;
      this.ActionRecieverDropdownConfig.externalError = true;
    }
   
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
  buildConfiguration() {
    const sectionRequired = new ErrorDto();
    sectionRequired.validation = 'required';
    sectionRequired.isModelError = true;
    sectionRequired.validationMessage =
      this.translate.instant('agenda.actionReceiver.ValidationError.generalAgenda') +
      this.translate.instant('agenda.actionReceiver.ValidationError.required');
    this.AgendaDropdownConfig.Errors = [sectionRequired];
    this.AgendaDropdownConfig.required = true;

    const agendaRequired = new ErrorDto();
    agendaRequired.validation = 'required';
    agendaRequired.isModelError = true;
    agendaRequired.validationMessage =
      this.translate.instant('agenda.actionReceiver.ValidationError.section') +
      this.translate.instant('agenda.actionReceiver.ValidationError.required');
    this.SectionDropdownConfig.Errors = [agendaRequired];
    this.SectionDropdownConfig.required = true;

   
  }
}

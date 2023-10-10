import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidControlsBaseService, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { TranslateService } from '@ngx-translate/core';
import { Owner2participantService } from './Service/owner2participant.service';
import { getOwner2ParticipantMappingList } from './Models/getOwner2participant.model';
import { owner2Participant } from './Models/owner2participant.model';
import { stateModel } from './Models/state.model';
import { creditProvider } from './Models/creditProvider.model';

@Component({
  selector: 'mracs-runningaccount-owner2participant-mapping',
  templateUrl: './runningaccount-owner2participant-mapping.component.html',
  styleUrls: ['./runningaccount-owner2participant-mapping.component.scss']
})
export class RunningaccountOwner2participantMappingComponent implements OnInit {
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public OwnerRefDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public BookingOwnerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ParticipantFromDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ParticipantToDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  placeholder = 'select';
  responseOwner2Participant!: getOwner2ParticipantMappingList;
  deletedRecords: owner2Participant[] = []
  owner2participantDup: owner2Participant[] = []
  index: any
  Nothide!: boolean;
  owner2participantCard!: owner2Participant;
  ownersHeader!: any[];
  Header = this.translate.instant('runningAccount.validation.validationHeader');
  businessError = this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.buisnessError');
  show!: boolean;
  isErrors!: boolean;
  exceptionBox!: boolean;
  navigateUrl!: string;
  errorCode!: string;

  
  constructor(public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public Owner2participantService: Owner2participantService,
    public fluidValidation: fluidValidationService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  isBusinessError(): boolean {

    this.owner2participantDup = this.responseOwner2Participant.owner2ParticipantMappingList.reduce((array: owner2Participant[], current) => {
      if ((
        !array.some(
          (item: owner2Participant) => item.ownerReferenceType?.name?.caption == current.ownerReferenceType?.name?.caption &&
            item.bookingOwnerReferenceType?.name?.caption == current.bookingOwnerReferenceType?.name?.caption &&
            item.participantReferenceFromType?.name?.caption == current.participantReferenceFromType?.name?.caption &&
            item.participantReferenceToType?.name?.caption == current.participantReferenceToType?.name?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.owner2participantDup.length != this.responseOwner2Participant.owner2ParticipantMappingList.length) {

      return true;
    }
    else {

      this.owner2participantDup = [];
      return false;
    }

  }

  SettingFalse() {
    if (this.responseOwner2Participant.owner2ParticipantMappingList.length > 0) {
      this.responseOwner2Participant.owner2ParticipantMappingList.forEach(x => {
        x.isEntered = false;
      })
    }
  }

  clickGrid(dataselected: owner2Participant) {
    if (dataselected) {
      if (!this.userDetailsform.invalid || dataselected.isEntered) {
        if (!this.isBusinessError()) {
          this.SettingFalse();
          this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(item => {
            return item == dataselected
          })
        this.responseOwner2Participant.owner2ParticipantMappingList[this.index].isEntered = true;
          this.owner2participantCard = dataselected;
        }
        else {
          this.throwBusinessError(this.businessError);
        }
      }
      else {
        this.OwnerRefDropdownConfig.externalError = true;
        this.BookingOwnerDropdownConfig.externalError = true;
        this.ParticipantFromDropdownConfig.externalError = true;
        this.ParticipantToDropdownConfig.externalError = true;
        if (this.isBusinessError()) {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  addRow() {
    if ((!this.userDetailsform.invalid) ||
      this.responseOwner2Participant.owner2ParticipantMappingList.length == 0) {

      if (!this.isBusinessError()) {
      const owner2ParticipantObj = new owner2Participant();
        this.SettingFalse();
      owner2ParticipantObj.isEntered = true;
      owner2ParticipantObj.state = stateModel.Created;
      owner2ParticipantObj.pKey = 0;
      owner2ParticipantObj.canValidate = false;
      owner2ParticipantObj.rowVersion = 0;
      const newlist = this.responseOwner2Participant.owner2ParticipantMappingList;
      newlist.push({ ...owner2ParticipantObj });
      this.responseOwner2Participant.owner2ParticipantMappingList = [...newlist];
      this.owner2participantCard = new owner2Participant();
      this.owner2participantCard = this.responseOwner2Participant.owner2ParticipantMappingList[this.responseOwner2Participant.owner2ParticipantMappingList.length - 1]
       this.Nothide = true;
       this.RemoveBusinessError(this.businessError)
      this.OwnerRefDropdownConfig.externalError = false;
      this.BookingOwnerDropdownConfig.externalError = false;
      this.ParticipantFromDropdownConfig.externalError = false;
      this.ParticipantToDropdownConfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.OwnerRefDropdownConfig.externalError = true;
      this.BookingOwnerDropdownConfig.externalError = true;
      this.ParticipantFromDropdownConfig.externalError = true;
      this.ParticipantToDropdownConfig.externalError = true;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
    }
  }

  onRowDelete(event: owner2Participant, array: owner2Participant[]) {
    if (!this.userDetailsform.invalid || ((event.bookingOwnerReferenceType?.name?.caption == null ||
      event.ownerReferenceType?.name?.caption == null || event.participantReferenceFromType?.name?.caption == null ||
      event.participantReferenceToType?.name?.caption == null) && event.isEntered)) {
      if (!this.isBusinessError() || (this.isBusinessError() && event.isEntered)) {
        const deletedata = array.findIndex(data => {
          return data == event;
        })
        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.responseOwner2Participant.owner2ParticipantMappingList = [...array];
      if (this.responseOwner2Participant.owner2ParticipantMappingList.length == 0) {
          setTimeout(() => {
            this.Nothide = false;
          }, 5);
        }
      if (this.responseOwner2Participant.owner2ParticipantMappingList.length > 0) {
          this.SettingFalse();
        this.owner2participantCard = this.responseOwner2Participant.owner2ParticipantMappingList[0]
        this.responseOwner2Participant.owner2ParticipantMappingList[0].isEntered = true;
        }
        this.RemoveBusinessError(this.businessError);
      this.OwnerRefDropdownConfig.externalError = false;
      this.BookingOwnerDropdownConfig.externalError = false;
      this.ParticipantFromDropdownConfig.externalError = false;
      this.ParticipantToDropdownConfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.businessError)
      }
    }
    else {
      this.OwnerRefDropdownConfig.externalError = true;
      this.BookingOwnerDropdownConfig.externalError = true;
      this.ParticipantFromDropdownConfig.externalError = true;
      this.ParticipantToDropdownConfig.externalError = true;
    }
  }

  changeBookingOwnerReference(event: any) {
   
    this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state == stateModel.Unknown) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].bookingOwnerReferenceType = event?.value;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].bookingOwnerReference = event?.value?.pKey;
      this.owner2participantCard.bookingOwnerReferenceType = event?.value;
      
    }
    else {

      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].bookingOwnerReferenceType = null as unknown as creditProvider;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].bookingOwnerReference = null as unknown as number;
      this.owner2participantCard.bookingOwnerReferenceType = null as unknown as creditProvider;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
      this.BookingOwnerDropdownConfig.externalError = true;
    }
  }

  changeOwnerReference(event: any) {

    this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state == stateModel.Unknown) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].ownerReferenceType = event?.value;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].ownerReference = event?.value?.pKey;
      this.owner2participantCard.ownerReferenceType = event?.value;
      
    }
    else {

      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].ownerReferenceType = null as unknown as creditProvider;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].ownerReference = null as unknown as number;
      this.owner2participantCard.ownerReferenceType = null as unknown as creditProvider;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
      this.OwnerRefDropdownConfig.externalError = true;
    }
  }

  changeParticipantFromReference(event: any) {

    this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state == stateModel.Unknown) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceFromType = event?.value;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceFrom = event?.value?.pKey;
      this.owner2participantCard.participantReferenceFromType = event?.value;
     
    }
    else {

      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceFromType = null as unknown as creditProvider;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceFrom = null as unknown as number;
      this.owner2participantCard.participantReferenceFromType = null as unknown as creditProvider;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
      this.ParticipantFromDropdownConfig.externalError = true;
    }
  }

  changeParticipantToReference(event: any) {

    this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state == stateModel.Unknown) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceToType = event?.value;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceTo = event?.value?.pKey;
      this.owner2participantCard.participantReferenceToType = event?.value;
      
    }
    else {

      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceToType = null as unknown as creditProvider;
      this.responseOwner2Participant.owner2ParticipantMappingList[this.index].participantReferenceTo = null as unknown as number;
      this.owner2participantCard.participantReferenceToType = null as unknown as creditProvider;
      if (this.isBusinessError()) {
        this.throwBusinessError(this.businessError)
      }
      else {
        this.RemoveBusinessError(this.businessError)
      }
      this.ParticipantToDropdownConfig.externalError = true;
    }
  }

  ngOnInit(): void {

    this.buildConfiguration();
    this.ownersHeader = [
      { header: this.translate.instant('runningAccount.Owner2ParticipantMapping.tabel.OwnerReference'), field: 'ownerReferenceType.name.caption', width: '25%' },
      { header: this.translate.instant('runningAccount.Owner2ParticipantMapping.tabel.BookingOwnerReference'), field: 'bookingOwnerReferenceType.name.caption', width: '25%' },
      { header: this.translate.instant('runningAccount.Owner2ParticipantMapping.tabel.ParticipantReferenceFrom'), field: 'participantReferenceFromType.name.caption', width: '22%' },
      { header: this.translate.instant('runningAccount.Owner2ParticipantMapping.tabel.ParticipantReferenceTo'), field: 'participantReferenceToType.name.caption', width: '20%' },
      { field: 'delete', width: '8%',fieldType:'deleteButton' }];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)

      const getResponse = res.owner2participantData

      console.log(getResponse)
      this.responseOwner2Participant = { ...getResponse };
      this.deletedRecords = [...new Array<owner2Participant>()];
      this.index = 0;

     
      if (this.responseOwner2Participant.owner2ParticipantMappingList.length > 0) {

        this.responseOwner2Participant.owner2ParticipantMappingList.forEach(x => {
         const bookingOwnerIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
            return x.bookingOwnerReference == y.pKey
         })

          const OwnerRefIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
            return x.ownerReference == y.pKey
          })

          const participantFromIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
            return x.participantReferenceFrom == y.pKey
          })

          const participantToIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
            return x.participantReferenceTo == y.pKey
          })
          x.bookingOwnerReferenceType = this.responseOwner2Participant.creditProviderList[bookingOwnerIndex]
          x.ownerReferenceType = this.responseOwner2Participant.creditProviderList[OwnerRefIndex]
          x.participantReferenceFromType = this.responseOwner2Participant.creditProviderList[participantFromIndex]
          x.participantReferenceToType = this.responseOwner2Participant.creditProviderList[participantToIndex]

        })

        this.Nothide = true;
        this.SettingFalse();
        this.responseOwner2Participant.owner2ParticipantMappingList[this.index].isEntered = true;
        this.owner2participantCard = this.responseOwner2Participant.owner2ParticipantMappingList[this.index];
      }
    }
    )

  }

  onSave(GridData: owner2Participant[]) {
    if (this.isBusinessError()) {
      this.throwBusinessError(this.businessError)
      this.isErrors = true;
    }
    else if (!this.userDetailsform.invalid) {
      this.isErrors = false;
      const saveData = [...GridData];
      saveData.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.spinnerService.setIsLoading(true);
      this.Owner2participantService.saveOwner2Participant(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.deletedRecords = [...new Array<owner2Participant>()];

        this.Owner2participantService.getOwner2ParticipantList().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as getOwner2ParticipantMappingList
          this.responseOwner2Participant = { ...getResponse };

          this.RemoveBusinessError(this.businessError)
          this.OwnerRefDropdownConfig.externalError = false;
          this.BookingOwnerDropdownConfig.externalError = false;
          this.ParticipantFromDropdownConfig.externalError = false;
          this.ParticipantToDropdownConfig.externalError = false;

          if (this.responseOwner2Participant.owner2ParticipantMappingList.length > 0) {

            this.responseOwner2Participant.owner2ParticipantMappingList.forEach(x => {
              const bookingOwnerIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
                return x.bookingOwnerReference == y.pKey
              })

              const OwnerRefIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
                return x.ownerReference == y.pKey
              })

              const participantFromIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
                return x.participantReferenceFrom == y.pKey
              })

              const participantToIndex = this.responseOwner2Participant.creditProviderList.findIndex(y => {
                return x.participantReferenceTo == y.pKey
              })
              x.bookingOwnerReferenceType = this.responseOwner2Participant.creditProviderList[bookingOwnerIndex]
              x.ownerReferenceType = this.responseOwner2Participant.creditProviderList[OwnerRefIndex]
              x.participantReferenceFromType = this.responseOwner2Participant.creditProviderList[participantFromIndex]
              x.participantReferenceToType = this.responseOwner2Participant.creditProviderList[participantToIndex]

            })
            this.Nothide = true;
            this.SettingFalse();
            this.index = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(i => {
              return ((i.ownerReferenceType?.name?.caption == this.owner2participantCard.ownerReferenceType?.name?.caption) &&
                (i.bookingOwnerReferenceType?.name?.caption == this.owner2participantCard.bookingOwnerReferenceType?.name?.caption) &&
                (i.participantReferenceFromType?.name?.caption == this.owner2participantCard.participantReferenceFromType?.name?.caption) &&
                (i.participantReferenceToType?.name?.caption == this.owner2participantCard.participantReferenceToType?.name?.caption))
            })
            this.responseOwner2Participant.owner2ParticipantMappingList[this.index].isEntered = true;
            this.owner2participantCard = this.responseOwner2Participant.owner2ParticipantMappingList[this.index]
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
            this.deletedRecords = [...new Array<owner2Participant>()];
            this.exceptionBox = true;
          })

      },
        err => {

          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          }
          else {
            this.errorCode = "InternalServiceFault"
          }
          this.spinnerService.setIsLoading(false);
          this.deletedRecords = [...new Array<owner2Participant>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.OwnerRefDropdownConfig.externalError = true;
      this.BookingOwnerDropdownConfig.externalError = true;
      this.ParticipantFromDropdownConfig.externalError = true;
      this.ParticipantToDropdownConfig.externalError = true;

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

  onclose() {
    const unsaved = this.responseOwner2Participant.owner2ParticipantMappingList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (this.deletedRecords.length > 0 || unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);
    }
  }
  onYes(GridData: owner2Participant[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);
    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.businessError)
    this.OwnerRefDropdownConfig.externalError = false;
    this.BookingOwnerDropdownConfig.externalError = false;
    this.ParticipantFromDropdownConfig.externalError = false;
    this.ParticipantToDropdownConfig.externalError = false;

    window.location.assign(this.navigateUrl);

  }
  onCancel() {
    this.show = false;
  }
  onException() {
    this.exceptionBox = false;
  }

  buildConfiguration() {
    const ownerRefRequired = new ErrorDto();
    ownerRefRequired.validation = 'required';
    ownerRefRequired.isModelError = true;
    ownerRefRequired.validationMessage =
      this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.OwnerReference') +
    this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.required');
    this.OwnerRefDropdownConfig.Errors = [ownerRefRequired];
    this.OwnerRefDropdownConfig.required = true;

    const bookingOwnerRequired = new ErrorDto();
    bookingOwnerRequired.validation = 'required';
    bookingOwnerRequired.isModelError = true;
    bookingOwnerRequired.validationMessage =
      this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.BookingOwnerReference') +
    this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.required');
    this.BookingOwnerDropdownConfig.Errors = [bookingOwnerRequired];
    this.BookingOwnerDropdownConfig.required = true;

    const participantFromRequired = new ErrorDto();
    participantFromRequired.validation = 'required';
    participantFromRequired.isModelError = true;
    participantFromRequired.validationMessage =
      this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.ParticipantReferenceFrom') +
    this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.required');
    this.ParticipantFromDropdownConfig.Errors = [participantFromRequired];
    this.ParticipantFromDropdownConfig.required = true;

    const participantToRequired = new ErrorDto();
    participantToRequired.validation = 'required';
    participantToRequired.isModelError = true;
    participantToRequired.validationMessage =
      this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.ParticipantReferenceTo') +
    this.translate.instant('runningAccount.Owner2ParticipantMapping.mandatory.required');
    this.ParticipantToDropdownConfig.Errors = [participantToRequired];
    this.ParticipantToDropdownConfig.required = true;
  }
}

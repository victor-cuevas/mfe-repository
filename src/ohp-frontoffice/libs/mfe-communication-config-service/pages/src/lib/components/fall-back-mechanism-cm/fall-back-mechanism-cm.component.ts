import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidButtonConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { CommunicationMediumNameDto } from './Models/communication-mediumDto.model';
import { FallbackCommunicationDto } from './Models/fallback-communication-dto.model';
import { FallbackMechanismDto } from './Models/fallback-mechanism-dto.model';
import { FollowUpEventNameDto } from './Models/fallbackName.model';
import { DtoState } from './Models/dtoBase.model';
import { CmFallbackMechanismService } from './Service/fallback-mechanism.service';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { stateModel } from '../default-reference-type/Models/state.model';

@Component({
  selector: 'mccs-fall-back-mechanism-cm',
  templateUrl: './fall-back-mechanism-cm.component.html',
  styleUrls: ['./fall-back-mechanism-cm.component.scss']
})
export class FallBackMechanismCmComponent implements OnInit {
  @ViewChild('fallBackform', { static: true }) fallBackform!: NgForm;

  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredName: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredSeqNr: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredFollowUp: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredCommunication: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  intMaxValue = 2147483647;
  fallbackHeader!: any[];
  validationHeader!: string;
  fallupHeader!: any[];
  seqNrDto: ErrorDto[] = [];

  hideCommCard = true;
  hideFallBack = true;
  readonlyName = true;
  showDialog = false;
  exceptionBox = false;
  isMedium = false;
  isEventName = false;

  followUpNameList: FollowUpEventNameDto[] = [];
  communicationList: CommunicationMediumNameDto[] = [];
  fallbackMechanismList: FallbackMechanismDto[] = [];
  fallbackMechanismData: FallbackMechanismDto = new FallbackMechanismDto();
  fallbackCommunicationData: FallbackCommunicationDto = new FallbackCommunicationDto();

  highlightMechanismData: FallbackMechanismDto = new FallbackMechanismDto();
  highlightCommunicationData: FallbackCommunicationDto = new FallbackCommunicationDto();

  deletedArray: FallbackMechanismDto[] = [];
  duplicateBusinessError!: string;
  navigateURL: any;
  nullCheckError!: string;
  internaldrop!: any;
  Name!: any;
  FollowupEventName!: any;
  CommunicationMedium!: any;
  Seqnr!:any;
  follow!: any[];
  followHeader!: any[];
  follow1!: any[];
  follow1Header!: any[];
  isSeqNo = false;
  seqNoError!: string
  mediumError!: string
  eventNameError!: string




  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public fallbackService: CmFallbackMechanismService,
    public fluidValidation: fluidValidationService,
    public commonService: ConfigContextService,
    public spinnerService: SpinnerService  ) {
    this.validationHeader = this.translate.instant('communication.Validation.validationHeader');
    this.duplicateBusinessError = this.translate.instant('communication.FallbackMechanism.ValidationError.DuplicateBusiness');
    this.nullCheckError = this.translate.instant('communication.FallbackMechanism.ValidationError.nullCheckError');
    this.seqNoError = this.translate.instant('communication.FallbackMechanism.ValidationError.seqNoError');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.eventNameError = this.translate.instant('communication.FallbackMechanism.ValidationError.eventNameError');
    this.mediumError = this.translate.instant('communication.FallbackMechanism.ValidationError.mediumError');
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);

      this.followUpNameList = data.followupNameList;
      this.communicationList = data.getCommunicationList;
      console.log(data);
      const updateFallback = data.fallBackData.map((data: FallbackMechanismDto) => {

        data.hasNoProductCopy = !data.isLinkedwithCommunication;
        const fallbackCommunication = data.fallbackCommunicationList.map((commData: FallbackCommunicationDto) => {
          return { ...commData, commrandomNumber: this.generateRandomNumber(), commrowSelected: false, isDeleted: false };
        });
        return { ...data, randomNumber: this.generateRandomNumber(), rowSelected: false, fallbackCommunicationList: fallbackCommunication };
      });

      if (updateFallback.length > 0) {
        this.fallbackMechanismList = updateFallback;
        console.log(this.fallbackMechanismList);
        this.fallbackMechanismList[0].rowSelected = true;
        if (this.fallbackMechanismList[0].fallbackCommunicationList.length > 0) {
          this.fallbackMechanismList[0].fallbackCommunicationList[0].commrowSelected = true;
          this.fallbackCommunicationData = this.fallbackMechanismList[0].fallbackCommunicationList[0];
        } else {
          //Hide Communication Card When no data exist
          this.hideCommCard = false;
        }
        this.fallbackMechanismData = this.fallbackMechanismList[0];
        this.highlightMechanismData = this.fallbackMechanismList[0];
      } else {
        //Hide Fallback Card When no data exist
        this.hideFallBack = false;
      }
    });

    this.fallbackHeader = [
      { header: this.translate.instant('communication.FallbackMechanism.tabel.Name'), field: 'name', width: '93%' },
      { header: this.translate.instant('communication.FallbackMechanism.tabel.Delete'), field: 'delete', fieldType: 'customizeDeleteButton', width: '8%' }
    ];

    this.fallupHeader = [
      {
        header: this.translate.instant('communication.FallbackMechanism.tabel.FollowupEventName'),
        field: 'followUpEventName.caption',
        property: 'followUpEventName',
        width: '50%'
      },
      {
        header: this.translate.instant('communication.FallbackMechanism.tabel.CommunicationMedium'),
        field: 'communicationMedium.caption',
        property: 'communicationMedium',
        width: '25%'
      },
      { header: this.translate.instant('communication.FallbackMechanism.tabel.Seqnr'), field: 'seqNr', property: 'seqNr', width: '17%' },
      { header: this.translate.instant('communication.FallbackMechanism.tabel.Delete1'), field: 'delete', property: 'deleteButton', width: '8%', pSortableColumnDisabled: true }
    ];

  }

  onRowselect(event: FallbackMechanismDto) {

    if (event) {

      if (this.fallBackform.valid) {

        this.RemoveFallBackError();
        //Check Duplicate in FallBackName and FallBackCommunication.
        const selectedFallbackIndex = this.fallbackMechanismList.findIndex(x => x.rowSelected);
        let isDupExist = false;
        if (this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList.length > 0) {
          isDupExist = this.isDuplicateCommunicationExist(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList);
        }

        const DupNameExist = this.isDuplicateNameExists(this.fallbackMechanismList);
        if (!isDupExist && !DupNameExist && !this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) {
          //Remove Business Error
          this.RemoveBusinessError(this.duplicateBusinessError);
          this.RemoveBusinessError(this.nullCheckError);
          this.RemoveBusinessError(this.seqNoError);
          this.RemoveBusinessError(this.eventNameError);
          this.RemoveBusinessError(this.mediumError);
          //Disable FallBackName Textbox
          this.readonlyName = true;

          //Deselect Selected Row in FallBack Grid
          let updateFallBackData = this.fallbackMechanismList;
          const eventIndex = updateFallBackData.findIndex(x => x.rowSelected);
          updateFallBackData = this.rowDeselectFallBackData(updateFallBackData);

          this.fallbackMechanismList[eventIndex].rowSelected = updateFallBackData[eventIndex].rowSelected;

          //Deselect Selected Row in FallBackCommunication
          if (updateFallBackData[eventIndex].fallbackCommunicationList.length > 0) {
            const commIndex = updateFallBackData[eventIndex].fallbackCommunicationList.findIndex(x => x.commrowSelected);
            updateFallBackData[eventIndex].fallbackCommunicationList = this.deselectCommunicationData(
              updateFallBackData[eventIndex].fallbackCommunicationList
            );

            this.fallbackMechanismList[eventIndex].fallbackCommunicationList[commIndex].commrowSelected =
              updateFallBackData[eventIndex].fallbackCommunicationList[commIndex].commrowSelected;
          }

          //Select Row in FallBackGrid
          const selectedIndex = updateFallBackData.findIndex(x => x.randomNumber == event.randomNumber);

          this.fallbackMechanismList[selectedIndex].rowSelected = true;
          this.highlightMechanismData = this.fallbackMechanismList[selectedIndex];

          this.fallbackMechanismData = event;

          //Select FirstRow in FallBackCommunication
          if (this.fallbackMechanismList[selectedIndex].fallbackCommunicationList.length > 0) {
            this.hideCommCard = true;

            let rowassigned = false;
              for (let i = 0; i < this.fallbackMechanismList[selectedIndex].fallbackCommunicationList.length; i++) {
                if (this.fallbackMechanismList[selectedIndex].fallbackCommunicationList[i].state != 4) {
                  this.fallbackMechanismList[selectedIndex].fallbackCommunicationList[i].commrowSelected = true;
                  this.fallbackCommunicationData = this.fallbackMechanismList[selectedIndex].fallbackCommunicationList[i];
                  rowassigned = true;
                }
                if (rowassigned) break;
              }

          } else {
            this.hideCommCard = false;
          }
        } else {
          if (this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) {
            this.throwBusinessError(this.nullCheckError)
          }
          else if (this.isSeqNo) {
            this.throwBusinessError(this.seqNoError)

          }
          else if (this.isEventName) {

            this.throwBusinessError(this.eventNameError)
          }

          else if (this.isMedium) {

            this.throwBusinessError(this.mediumError)
          }
          else this.throwBusinessError(this.duplicateBusinessError);
        }
      } else {
        this.throwFallBackError();
      }
    }

    // this.highlightTypeMapping = this.typemappingList[selectedIndex];
  }

  onFallBackDelete(event: FallbackMechanismDto) {
    if (this.fallBackform.valid || event.rowSelected) {
      //Remove Business Error
      this.RemoveFallBackError();

      // Business Erro Validation
      const selectedFallbackIndex = this.fallbackMechanismList.findIndex(x => x.rowSelected);
      let isDupExist = false;
      if (this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList.length > 0) {
        isDupExist = this.isDuplicateCommunicationExist(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList);
      }

      const DupNameExist = this.isDuplicateNameExists(this.fallbackMechanismList);
      if ((!isDupExist && !DupNameExist && !this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) || event.rowSelected) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);
        this.RemoveBusinessError(this.seqNoError);
        this.RemoveBusinessError(this.eventNameError);
        this.RemoveBusinessError(this.mediumError);

        this.readonlyName = true;

        const fallbackMechanismListData = [...this.fallbackMechanismList];

        const todeleteIndex = fallbackMechanismListData.findIndex((data: FallbackMechanismDto) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != fallbackMechanismListData.length - 1) {
          if (fallbackMechanismListData[todeleteIndex].state == 1) {
            fallbackMechanismListData.splice(todeleteIndex, 1);
            this.RemoveFallBackError();
          } else {
            fallbackMechanismListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...fallbackMechanismListData[todeleteIndex] });
            fallbackMechanismListData.splice(todeleteIndex, 1);
            this.RemoveFallBackError();
          }

          if (fallbackMechanismListData.length > 0) {
            this.fallbackMechanismList = this.rowDeselectFallBackData(fallbackMechanismListData);
            this.fallbackMechanismList[0].rowSelected = true;
            this.fallbackMechanismData = this.fallbackMechanismList[0];
            this.highlightMechanismData = this.fallbackMechanismList[0];

            if (this.fallbackMechanismList[0].fallbackCommunicationList.length > 0) {
              this.hideCommCard = true;
              let rowassigned = false;
              for (let i = 0; i < this.fallbackMechanismList[0].fallbackCommunicationList.length; i++) {
                if (this.fallbackMechanismList[0].fallbackCommunicationList[i].state != 4) {
                  this.fallbackMechanismList[0].fallbackCommunicationList[i].commrowSelected = true;
                  this.fallbackCommunicationData = this.fallbackMechanismList[0].fallbackCommunicationList[i];
                  rowassigned = true;
                }
                if (rowassigned) break;
              }
              if (!rowassigned) {
                this.hideCommCard = false;
              }
            } else {
              this.hideCommCard = false;
            }
            //this.highlightGenericData = this.genericMappingList[0];
          } else {
            this.fallbackMechanismList = [];
            this.fallbackMechanismData = new FallbackMechanismDto();
            setTimeout(() => {
              this.hideFallBack = false;
            }, 100);
          }
        } else {
          if (fallbackMechanismListData[todeleteIndex].state == 1) {
            fallbackMechanismListData.splice(todeleteIndex, 1);
            this.RemoveFallBackError();
          } else {
            fallbackMechanismListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...fallbackMechanismListData[todeleteIndex] });
            fallbackMechanismListData.splice(todeleteIndex, 1);
            this.RemoveFallBackError();
          }

          if (fallbackMechanismListData.length > 0) {
            this.fallbackMechanismList = this.rowDeselectFallBackData(fallbackMechanismListData);
            this.fallbackMechanismList[this.fallbackMechanismList?.length - 1].rowSelected = true;
            const lastIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);

            this.fallbackMechanismData = this.fallbackMechanismList[lastIndex];
            this.highlightMechanismData = this.fallbackMechanismList[lastIndex];

            if (this.fallbackMechanismList[lastIndex].fallbackCommunicationList.length > 0) {
              this.hideCommCard = true;
              let rowassigned = false;
              for (let i = 0; i < this.fallbackMechanismList[lastIndex].fallbackCommunicationList.length; i++) {
                if (this.fallbackMechanismList[lastIndex].fallbackCommunicationList[i].state != 4) {
                  this.fallbackMechanismList[lastIndex].fallbackCommunicationList[i].commrowSelected = true;
                  this.fallbackCommunicationData = this.fallbackMechanismList[lastIndex].fallbackCommunicationList[i];
                  rowassigned = true;
                }
                if (rowassigned) break;
              }
              if (!rowassigned) {
                this.hideCommCard = false;
              }
            } else {
              this.hideCommCard = false;
            }

          } else {
            this.fallbackMechanismList = [];
            this.fallbackMechanismData = new FallbackMechanismDto();
            setTimeout(() => {
              this.hideFallBack = false;
            }, 100);
          }
        }
      } else {
        if (this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) {
          this.throwBusinessError(this.nullCheckError)
        }
        else if (this.isSeqNo) {
          this.throwBusinessError(this.seqNoError)
        }
        else if (this.isEventName) {

          this.throwBusinessError(this.eventNameError)
        }

        else if (this.isMedium) {

          this.throwBusinessError(this.mediumError)
        }
        else this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwFallBackError();
    }
  }

  buildConfiguration() {
    const nameError = new ErrorDto();
    nameError.validation = 'required';
    nameError.isModelError = true;
    nameError.validationMessage =
      this.translate.instant('communication.FallbackMechanism.ValidationError.name') +
      this.translate.instant('communication.FallbackMechanism.ValidationError.required');
    this.RequiredName.required = true;
    this.RequiredName.Errors = [nameError];

    const maxValValidation = new ErrorDto();
    maxValValidation.validation = 'maxError';
    maxValValidation.isModelError = true;
    maxValValidation.validationMessage = this.translate.instant('communication.FallbackMechanism.ValidationError.numberInt32Check');
    this.seqNrDto = [maxValValidation];
    const SeqNrError = new ErrorDto();
    SeqNrError.validation = 'required';
    SeqNrError.isModelError = true;
    SeqNrError.validationMessage =
      this.translate.instant('communication.FallbackMechanism.ValidationError.Seqnr') +
      this.translate.instant('communication.FallbackMechanism.ValidationError.required');
    this.RequiredSeqNr.required = true;
    this.RequiredSeqNr.Errors = [SeqNrError];
    this.RequiredSeqNr.maxValueValidation = this.translate.instant('communication.FallbackMechanism.ValidationError.InputIncorrect');

    
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onNameChange(event: any) {
    const selectedIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.fallbackMechanismList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.name = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.fallbackMechanismList[selectedIndex].name = updategrid.name;
      this.fallbackMechanismList[selectedIndex].state = updategrid.state;
      this.fallbackMechanismData.name = event;
    } else {
      const updateData = this.fallbackMechanismList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.name = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.fallbackMechanismList[selectedIndex].name = updategrid.name;
      this.fallbackMechanismList[selectedIndex].state = updategrid.state;
      this.fallbackMechanismData.name = null;
      this.RequiredName.externalError = true;
    }
  }

  onCommunicationDelete(event: FallbackCommunicationDto, deleteindex: number) {
    if (this.fallBackform.valid || event.commrowSelected) {
      const fallBackselectedIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);
      const fallCommunicationList = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList;

      let isDupExist = false;
      if (fallCommunicationList.length > 0) {
        isDupExist = this.isDuplicateCommunicationExist(fallCommunicationList);
      }

      if ((!isDupExist && !this.nullCheck(this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList)) || event.commrowSelected) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);
        this.RemoveBusinessError(this.seqNoError);
        this.RemoveBusinessError(this.eventNameError);
        this.RemoveBusinessError(this.mediumError);


        // const todeleteIndex = fallCommunicationList.findIndex((data: FallbackCommunicationDto) => {
        //   return data?.commrandomNumber === event?.commrandomNumber;
        // });

        if (deleteindex != fallCommunicationList.length - 1) {
          if (fallCommunicationList[deleteindex].state == 1) {
            fallCommunicationList.splice(deleteindex, 1);
            this.RemoveFallBackError();
            this.fallbackMechanismList[fallBackselectedIndex].state = 3;
            this.RequiredSeqNr.externalError = false;
          } else {
            fallCommunicationList[deleteindex].state = 4;
            fallCommunicationList[deleteindex].isDeleted = true;
            fallCommunicationList[deleteindex].seqNr =0;
            this.RemoveFallBackError();
            this.fallbackMechanismList[fallBackselectedIndex].state = 3;
            this.RequiredSeqNr.externalError = false;
          }

          if (!this.checkCommDataExist(fallCommunicationList)) {
            this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList =
              this.deselectCommunicationData(fallCommunicationList);
            this.fallbackMechanismData.fallbackCommunicationList = this.deselectCommunicationData(fallCommunicationList);
            let rowassigned = false;
            this.hideCommCard = true;
              for (let i = 0; i < this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList.length; i++) {
                if (this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i].state != 4) {
                  this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i].commrowSelected = true;
                  this.fallbackCommunicationData = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i];
                  rowassigned = true;
                }
                if (rowassigned) break;
              }
          } else {
            this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList =
              this.deselectCommunicationData(fallCommunicationList);
            this.fallbackMechanismData.fallbackCommunicationList = this.deselectCommunicationData(fallCommunicationList);

            this.fallbackCommunicationData = new FallbackCommunicationDto();
            setTimeout(() => {
              this.hideCommCard = false;
            }, 100);
          }
        } else {
          if (fallCommunicationList[deleteindex].state == 1) {
            fallCommunicationList.splice(deleteindex, 1);
            this.fallbackMechanismList[fallBackselectedIndex].state = 3;
            this.RequiredSeqNr.externalError = false;
            this.RemoveFallBackError();
          } else {
            fallCommunicationList[deleteindex].state = 4;
            fallCommunicationList[deleteindex].isDeleted = true;
            fallCommunicationList[deleteindex].seqNr =0;
            this.fallbackMechanismList[fallBackselectedIndex].state = 3;
            this.RequiredSeqNr.externalError = false;
            this.RemoveFallBackError();
          }

          if (!this.checkCommDataExist(fallCommunicationList)) {
            this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList =
              this.deselectCommunicationData(fallCommunicationList);
            this.fallbackMechanismData.fallbackCommunicationList = this.deselectCommunicationData(fallCommunicationList);
            this.hideCommCard = true;
            let rowassigned = false;
            for (let i = 0; i < this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList.length; i++) {
              if (this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i].state != 4) {
                this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i].commrowSelected = true;
                this.fallbackCommunicationData = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[i];
                rowassigned = true;
              }
              if (rowassigned) break;
            }

            //this.highlightGenericData = this.genericMappingList[lastIndex];
          } else {
            this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList =
              this.deselectCommunicationData(fallCommunicationList);
            this.fallbackMechanismData.fallbackCommunicationList = this.deselectCommunicationData(fallCommunicationList);

            this.fallbackCommunicationData = new FallbackCommunicationDto();
            setTimeout(() => {
              this.hideCommCard = false;
            }, 100);
          }
        }
      } else {
        if (this.nullCheck(this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList)) {
          this.throwBusinessError(this.nullCheckError)
        }
        else if (this.isSeqNo) {
          this.throwBusinessError(this.seqNoError)

        }
        else if (this.isEventName) {

          this.throwBusinessError(this.eventNameError)
        }

        else if (this.isMedium) {

          this.throwBusinessError(this.mediumError)
        }
        else this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwFallBackError();
    }
  }

  checkCommDataExist(fallbackCommData: FallbackCommunicationDto[]) {
    let isEmpty = false;
    if (fallbackCommData.length > 0) {
      for (let i = 0; i < fallbackCommData.length; i++) {
        if (fallbackCommData[i].state == 4) {
          isEmpty = true;
        } else {
          isEmpty = false;
          break;
        }
      }
    } else {
      isEmpty = true;
    }

    return isEmpty;
  }

  onCommunicationselect(event: FallbackCommunicationDto, selectedCommIndex: number) {
    if (event) {
      if (this.fallBackform.valid || event.commrowSelected) {
        const updatefallbackMechanismList = [...this.fallbackMechanismList];
        //Validate Duplicate Communication Exist
        const eventIndex = updatefallbackMechanismList.findIndex(x => x.rowSelected);
        let fallbackMechanism = updatefallbackMechanismList[eventIndex].fallbackCommunicationList;

        let isDupExist = false;
        if (fallbackMechanism.length > 0) {
          isDupExist = this.isDuplicateCommunicationExist(fallbackMechanism);
        }

        if (!isDupExist && !this.nullCheck(this.fallbackMechanismList[eventIndex].fallbackCommunicationList)) {
          const commIndex = fallbackMechanism.findIndex(x => x.commrowSelected);
          if (commIndex >= 0) {
            fallbackMechanism = this.deselectCommunicationData(fallbackMechanism);
            updatefallbackMechanismList[eventIndex].fallbackCommunicationList[commIndex].commrowSelected =
              fallbackMechanism[commIndex].commrowSelected;
            this.fallbackMechanismList[eventIndex].fallbackCommunicationList[commIndex].commrowSelected =
              updatefallbackMechanismList[eventIndex].fallbackCommunicationList[commIndex].commrowSelected;

            // const selectedCommIndex = updatefallbackMechanismList[eventIndex].fallbackCommunicationList.findIndex(
            //   x => x.commrandomNumber === event.commrandomNumber
            // );
            updatefallbackMechanismList[eventIndex].fallbackCommunicationList[selectedCommIndex].commrowSelected = true;

            this.fallbackMechanismList[eventIndex].fallbackCommunicationList[selectedCommIndex].commrowSelected = true;

            this.fallbackCommunicationData = this.fallbackMechanismList[eventIndex].fallbackCommunicationList[selectedCommIndex];
            this.RemoveBusinessError(this.duplicateBusinessError);
            this.RemoveBusinessError(this.nullCheckError);
            this.RemoveBusinessError(this.seqNoError);
            this.RemoveBusinessError(this.eventNameError);
            this.RemoveBusinessError(this.mediumError);

          }

        } else {
          if (this.nullCheck(this.fallbackMechanismList[eventIndex].fallbackCommunicationList)) {
            this.throwBusinessError(this.nullCheckError)
          }
          else if (this.isSeqNo) {
            this.throwBusinessError(this.seqNoError)

          }
          else if (this.isEventName) {

            this.throwBusinessError(this.eventNameError)
          }

          else if (this.isMedium) {

            this.throwBusinessError(this.mediumError)
          }
          else this.throwBusinessError(this.duplicateBusinessError);
        }

      } else {
        this.throwFallBackError();
      }
    }
  }

  onfollowupNameChange(event: any) {
    const fallBackselectedIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);
    const fallCommunicationList = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList;
    const fallbackCommIndex = fallCommunicationList.findIndex((x: FallbackCommunicationDto) => x.commrowSelected);

    if (fallBackselectedIndex >= 0 && fallbackCommIndex >= 0 && event?.value != null) {
      const updateData = fallCommunicationList;
      const updategrid = { ...updateData[fallbackCommIndex] };
      updategrid.followUpEventName = event.value;

      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      fallCommunicationList[fallbackCommIndex].followUpEventName = updategrid.followUpEventName;
      fallCommunicationList[fallbackCommIndex].state = updategrid.state;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].followUpEventName =
        fallCommunicationList[fallbackCommIndex].followUpEventName;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
        fallCommunicationList[fallbackCommIndex].state;

      if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
        this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
      }

      this.fallbackCommunicationData.followUpEventName = event.value;
    } else {
      const updateData = fallCommunicationList;
      const updategrid = { ...updateData[fallbackCommIndex] };
      updategrid.followUpEventName = null;

      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      fallCommunicationList[fallbackCommIndex].followUpEventName = null;
      fallCommunicationList[fallbackCommIndex].state = updategrid.state;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].followUpEventName = null;
      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
        fallCommunicationList[fallbackCommIndex].state;

      if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
        this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
      }

      this.fallbackCommunicationData.followUpEventName = null;
    }
  }

  oncommunicationChange(event: any) {
    const fallBackselectedIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);
    const fallCommunicationList = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList;
    const fallbackCommIndex = fallCommunicationList.findIndex((x: FallbackCommunicationDto) => x.commrowSelected);

    if (fallBackselectedIndex >= 0 && fallbackCommIndex >= 0 && event?.value != null) {
      const updateData = fallCommunicationList;
      const updategrid = { ...updateData[fallbackCommIndex] };
      updategrid.communicationMedium = event.value;

      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      fallCommunicationList[fallbackCommIndex].communicationMedium = updategrid.communicationMedium;
      fallCommunicationList[fallbackCommIndex].state = updategrid.state;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].communicationMedium =
        fallCommunicationList[fallbackCommIndex].communicationMedium;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
        fallCommunicationList[fallbackCommIndex].state;

      if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
        this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
      }

      this.fallbackCommunicationData.communicationMedium = event.value;
    } else {
      const updateData = fallCommunicationList;
      const updategrid = { ...updateData[fallbackCommIndex] };
      updategrid.communicationMedium = null;

      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      fallCommunicationList[fallbackCommIndex].communicationMedium = null;
      fallCommunicationList[fallbackCommIndex].state = updategrid.state;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].communicationMedium = null;
      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
        fallCommunicationList[fallbackCommIndex].state;

      if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
        this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
      }

      this.fallbackCommunicationData.communicationMedium = null;
    }
  }

  onSeqNrChange(event: any) {
    const fallBackselectedIndex = this.fallbackMechanismList.findIndex((x: FallbackMechanismDto) => x.rowSelected);
    const fallCommunicationList = this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList;
    const fallbackCommIndex = fallCommunicationList.findIndex((x: FallbackCommunicationDto) => x.commrowSelected);

    if (fallBackselectedIndex >= 0 && fallbackCommIndex >= 0 && event != null && event != '') {
      if (+event > this.intMaxValue) {
        const updateData = fallCommunicationList;
        const updategrid = { ...updateData[fallbackCommIndex] };
        updategrid.seqNr = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        fallCommunicationList[fallbackCommIndex].seqNr = updategrid.seqNr;
        fallCommunicationList[fallbackCommIndex].state = updategrid.state;

        this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].seqNr =
          fallCommunicationList[fallbackCommIndex].seqNr;

        this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
          fallCommunicationList[fallbackCommIndex].state;

        if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
          this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
        }
        this.RequiredSeqNr.externalError = true;
      } else {
        const updateData = fallCommunicationList;
        const updategrid = { ...updateData[fallbackCommIndex] };
        updategrid.seqNr = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        fallCommunicationList[fallbackCommIndex].seqNr = updategrid.seqNr;
        fallCommunicationList[fallbackCommIndex].state = updategrid.state;

        this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].seqNr =
          fallCommunicationList[fallbackCommIndex].seqNr;

        this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
          fallCommunicationList[fallbackCommIndex].state;

        if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
          this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
        }
      }
    } else {
      const updateData = fallCommunicationList;
      const updategrid = { ...updateData[fallbackCommIndex] };
      updategrid.seqNr = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      fallCommunicationList[fallbackCommIndex].seqNr = null;
      fallCommunicationList[fallbackCommIndex].state = updategrid.state;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].seqNr = null;

      this.fallbackMechanismList[fallBackselectedIndex].fallbackCommunicationList[fallbackCommIndex].state =
        fallCommunicationList[fallbackCommIndex].state;

      if (this.fallbackMechanismList[fallBackselectedIndex].state != DtoState.Created) {
        this.fallbackMechanismList[fallBackselectedIndex].state = DtoState.Dirty;
      }

      this.RequiredSeqNr.externalError = true;
    }
  }

  onClose() {
    const isChangedIndexExist = this.fallbackMechanismList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      //this.typeMappingform.resetForm();
      this.RemoveFallBackError();
      this.RemoveBusinessError(this.duplicateBusinessError);
      this.RemoveBusinessError(this.nullCheckError);

      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(fallbackList: FallbackMechanismDto[]) {
    this.showDialog = false;

    if (this.fallBackform.valid) {
      if (!this.checkDuplicateExist()) {
        this.onSave(fallbackList);

        this.RemoveFallBackError();
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);

        window.location.assign(this.navigateURL);
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwFallBackError();
    }
  }

  onSave(fallbackMechanismList: FallbackMechanismDto[]) {
    if (this.fallBackform.valid) {
      this.RemoveFallBackError();

      const DupNameExist = this.isDuplicateNameExists(fallbackMechanismList);

      if (!this.checkDuplicateExist() && !DupNameExist) {

        if (this.fallbackMechanismList.length > 0) {

          const fallbackMechanismIndex = this.fallbackMechanismList.findIndex(x => x.rowSelected);

          if (this.nullCheck(this.fallbackMechanismList[fallbackMechanismIndex].fallbackCommunicationList)) {

            return this.throwBusinessError(this.nullCheckError)
          }
        }

        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);
        this.RemoveBusinessError(this.seqNoError)
        this.RemoveBusinessError(this.eventNameError);
        this.RemoveBusinessError(this.mediumError);


        fallbackMechanismList.map(fallbackData => {
          if (fallbackData.state != 0) {
            this.deletedArray.push({ ...fallbackData });
          }
        });

        this.fallbackService.saveFallBackData(this.deletedArray).subscribe(
          data => {
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            if (data) {
              this.fallbackService.getFallBackData().subscribe(
                (responseData: any) => {
                  this.hideCommCard = true;
                  this.hideFallBack = true;
                  this.spinnerService.setIsLoading(false);
                  const updateFallback = responseData.map((data: FallbackMechanismDto) => {
                    const fallbackCommunication = data.fallbackCommunicationList.map((commData: FallbackCommunicationDto) => {
                      return { ...commData, commrandomNumber: this.generateRandomNumber(), commrowSelected: false, isDeleted: false };
                    });
                    return {
                      ...data,
                      randomNumber: this.generateRandomNumber(),
                      rowSelected: false,
                      fallbackCommunicationList: fallbackCommunication
                    };
                  });

                  if (updateFallback.length > 0) {
                    this.fallbackMechanismList = updateFallback;
                    this.fallbackMechanismList.forEach(x => {
                      x.hasNoProductCopy = !x.isLinkedwithCommunication
                    })
                    const fallbackMechanismIndex= this.fallbackMechanismList.findIndex(x=>x.name == this.fallbackMechanismData.name);
                    this.fallbackMechanismList[fallbackMechanismIndex].rowSelected = true;
                    if (this.fallbackMechanismList[fallbackMechanismIndex].fallbackCommunicationList.length > 0) {
                      const CommuicationIndex = this.fallbackMechanismList[fallbackMechanismIndex].fallbackCommunicationList.findIndex(
                        x =>
                          x.communicationMedium?.codeId == this.fallbackCommunicationData.communicationMedium?.codeId &&
                          x.followUpEventName?.codeId == this.fallbackCommunicationData.followUpEventName?.codeId
                      );
                      this.fallbackMechanismList[fallbackMechanismIndex].fallbackCommunicationList[CommuicationIndex].commrowSelected = true;
                      this.fallbackCommunicationData = this.fallbackMechanismList[fallbackMechanismIndex].fallbackCommunicationList[CommuicationIndex];
                    } else {
                      this.hideCommCard = false;
                    }
                    this.readonlyName = true;
                    this.fallbackMechanismData = this.fallbackMechanismList[fallbackMechanismIndex];
                    this.highlightMechanismData = this.fallbackMechanismList[fallbackMechanismIndex];
                  } else {
                    this.hideFallBack = false;
                  }
                },
                err => {
                  this.deletedArray = [];
                  this.spinnerService.setIsLoading(false);
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );
      } else {
        if (this.isSeqNo) {
          this.throwBusinessError(this.seqNoError)
        }

        else if (this.isEventName) {

          this.throwBusinessError(this.eventNameError)
        }

        else if (this.isMedium) {

          this.throwBusinessError(this.mediumError)
        }

       else this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwFallBackError();
    }
  }

  isDuplicateNameExists(newgridDate: FallbackMechanismDto[]) {
    const removeNullDateValue = newgridDate.filter((date: FallbackMechanismDto) => date.name && date?.name !== '');
    const uniqueValues = [...new Set(removeNullDateValue.map((date: FallbackMechanismDto) => date?.name))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  onDialogNo() {
    this.showDialog = false;
    // this.typeMappingform.resetForm();
    this.RemoveFallBackError();
    this.RemoveBusinessError(this.duplicateBusinessError);
    this.RemoveBusinessError(this.nullCheckError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
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

  RemoveFallBackError() {
    this.RequiredName.externalError = false;
    this.RequiredSeqNr.externalError = false;
  }

  throwFallBackError() {
    this.RequiredName.externalError = true;
    this.RequiredSeqNr.externalError = true;
  }

  checkDuplicateExist() {
    for (let i = 0; i < this.fallbackMechanismList.length; i++) {
      for (let j = 0; j < this.fallbackMechanismList[i].fallbackCommunicationList.length; j++) {
        const isDupExist = this.isDuplicateCommunicationExist(this.fallbackMechanismList[i].fallbackCommunicationList);
        if (isDupExist) {
          return true;
        }
      }
    }
    return false;
  }

  isDuplicateCommunicationExist(FallbackCommunication: FallbackCommunicationDto[]): boolean {

    if (FallbackCommunication.length > 0) {

      let CommunicationListDup: FallbackCommunicationDto[] = []

      CommunicationListDup = FallbackCommunication.filter(x => {
        if (!(x.state == 4)) {
          return x
        }
        else return false;
      })

      let eventCommunicationListDup: FallbackCommunicationDto[] = []

      eventCommunicationListDup = CommunicationListDup.filter(x => {
        if (x.followUpEventName?.caption != null ) {
          return x
        }
        else return false;
      })

      let mediumCommunicationListDup: FallbackCommunicationDto[] = []

      mediumCommunicationListDup = CommunicationListDup.filter(x => {
        if ( x.communicationMedium?.caption != null) {
          return x
        }
        else return false;
      })

      if (CommunicationListDup.length > 0 || eventCommunicationListDup.length > 0 ||
        mediumCommunicationListDup.length > 0) {

        const seqnoDup = CommunicationListDup.map(item => {
          return item.seqNr;
        });
        const hasValue = seqnoDup.some((item, index) => {
          return seqnoDup.indexOf(item) != index;
        });
      
        const followUpNameDup = eventCommunicationListDup.map(item => {
          return item.followUpEventName?.codeId;
        });
        const hasNameValue = followUpNameDup.some((item, index) => {
          return followUpNameDup.indexOf(item) != index;
        });

        const mediumDup = mediumCommunicationListDup.map(item => {
          return item.communicationMedium?.codeId;
        });
        const hasMediumValue = mediumDup.some((item, index) => {
          return mediumDup.indexOf(item) != index;
        });

        if (hasValue) {
          this.isSeqNo = true
        } else this.isSeqNo = false;

        if (hasNameValue) {
          this.isEventName = true
        } else this.isEventName = false;

        if (hasMediumValue) {
          this.isMedium = true
        } else this.isMedium = false;

        if ((hasValue) || (hasNameValue) || (hasMediumValue)) {
          return true;
        } else {
          return false;
        }
      }
      else return false;
    }
    else return false;
  }

  nullCheck(FallbackCommunication: FallbackCommunicationDto[]): boolean {

    if (FallbackCommunication.length > 0) {

      let CommunicationListDup: FallbackCommunicationDto[] = []

      CommunicationListDup = FallbackCommunication.filter(x => {
        if (!(x.state == 4)) {
          return x
        }
        else return false;
      })

      if (CommunicationListDup.length > 0) {
        const nullIndex = CommunicationListDup.findIndex(x => {
          return x.communicationMedium?.caption == null && x.followUpEventName?.caption == null
        })

        const notNullIndex = CommunicationListDup.findIndex(x => {
          return x.communicationMedium?.caption != null && x.followUpEventName?.caption != null
        })

        if (nullIndex != -1 || notNullIndex != -1) {
          return true;
        } else return false;
      }
      else return false;
     
    } else return false;
  }

  AddFallback() {
    if (this.fallBackform.valid) {
      //Add data when list is not Empty
      if (this.fallbackMechanismList.length > 0) {
        const selectedFallbackIndex = this.fallbackMechanismList.findIndex(x => x.rowSelected);

        //Duplicate Check in FallbackName and FallbackCommunication
        let isDupExist = false;
        if (this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList.length > 0) {
          isDupExist = this.isDuplicateCommunicationExist(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList);
        }
        const DupNameExist = this.isDuplicateNameExists(this.fallbackMechanismList);

        if (!isDupExist && !DupNameExist && !this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) {
          if (this.fallbackMechanismList.length == 0) {
            this.hideFallBack = true;
          }
          let updatefallbackMechanismList = [...this.fallbackMechanismList];

          if (updatefallbackMechanismList.length > 0) {
            const eventIndex = updatefallbackMechanismList.findIndex(x => x.rowSelected);

            updatefallbackMechanismList = this.rowDeselectFallBackData(updatefallbackMechanismList);
            if (updatefallbackMechanismList[eventIndex].fallbackCommunicationList.length > 0) {
              updatefallbackMechanismList[eventIndex].fallbackCommunicationList = this.deselectCommunicationData(
                updatefallbackMechanismList[eventIndex].fallbackCommunicationList
              );
            }
          }

          this.fallbackMechanismData = new FallbackMechanismDto();
          this.fallbackMechanismData.fallbackCommunicationList = [];
          this.hideCommCard = false;
          this.readonlyName = false;
          this.fallbackCommunicationData = new FallbackCommunicationDto();

          updatefallbackMechanismList.push({
            ...this.fallbackMechanismData,
            randomNumber: this.generateRandomNumber(),
            rowSelected: true,
            hasNoProductCopy:true,
            state: 1
          });
          this.fallbackMechanismList = [...updatefallbackMechanismList];
          this.highlightMechanismData = this.fallbackMechanismList[this.fallbackMechanismList?.length - 1];
          this.fallBackform.resetForm();
          this.RemoveFallBackError();
          this.RemoveBusinessError(this.duplicateBusinessError);
          this.RemoveBusinessError(this.nullCheckError);
          this.RemoveBusinessError(this.seqNoError)
          this.RemoveBusinessError(this.eventNameError);
          this.RemoveBusinessError(this.mediumError);


        } else {
          if (this.nullCheck(this.fallbackMechanismList[selectedFallbackIndex].fallbackCommunicationList)) {
            this.throwBusinessError(this.nullCheckError)
          }
         else if (this.isSeqNo) {
            this.throwBusinessError(this.seqNoError)
          }
          else if (this.isEventName) {

            this.throwBusinessError(this.eventNameError)
          }

          else if (this.isMedium) {

            this.throwBusinessError(this.mediumError)
          }
          else this.throwBusinessError(this.duplicateBusinessError);
        }
      } else {
        //Add When List is Empty
        const updatefallbackMechanismList = [...this.fallbackMechanismList];

        this.fallbackMechanismData = new FallbackMechanismDto();
        this.fallbackMechanismData.fallbackCommunicationList = [];
        this.hideFallBack = true;
        this.hideCommCard = false;
        this.readonlyName = false;
        this.fallbackCommunicationData = new FallbackCommunicationDto();

        updatefallbackMechanismList.push({
          ...this.fallbackMechanismData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.fallbackMechanismList = [...updatefallbackMechanismList];
        this.highlightMechanismData = this.fallbackMechanismList[this.fallbackMechanismList?.length - 1];
        this.fallBackform.resetForm();
        this.RemoveFallBackError();
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);


      }
    } else {
      this.throwFallBackError();
    }
  }

  onAddFallbackCommunication() {
    if (this.fallBackform.valid) {
      this.RemoveFallBackError();
      const updatefallbackMechanismList = [...this.fallbackMechanismList];

      const eventIndex = updatefallbackMechanismList.findIndex(x => x.rowSelected);

      let fallbackCommunication = updatefallbackMechanismList[eventIndex].fallbackCommunicationList;

      let isDupExist = false;
      if (fallbackCommunication.length > 0) {
        isDupExist = this.isDuplicateCommunicationExist(fallbackCommunication);
      }

      const DupNameExist = this.isDuplicateNameExists(this.fallbackMechanismList);
      if (!isDupExist && !DupNameExist && !this.nullCheck(this.fallbackMechanismList[eventIndex].fallbackCommunicationList)) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        this.RemoveBusinessError(this.nullCheckError);
        this.RemoveBusinessError(this.seqNoError);
        this.RemoveBusinessError(this.eventNameError);
        this.RemoveBusinessError(this.mediumError);


        if (fallbackCommunication.length > 0) {
          fallbackCommunication = this.deselectCommunicationData(fallbackCommunication);
        }

        this.hideCommCard = true;
        this.fallbackCommunicationData = new FallbackCommunicationDto();
        fallbackCommunication.push({
          ...this.fallbackCommunicationData,
          commrandomNumber: this.generateRandomNumber(),
          commrowSelected: true,
          state: 1
        });
        if(this.fallbackMechanismList[eventIndex].state == DtoState.Created){
          this.fallbackMechanismList[eventIndex].state = DtoState.Created;
        }else{
          this.fallbackMechanismList[eventIndex].state = DtoState.Dirty;
        }
     
        updatefallbackMechanismList[eventIndex].fallbackCommunicationList = [...fallbackCommunication];

        this.fallbackMechanismList[eventIndex].fallbackCommunicationList =
          updatefallbackMechanismList[eventIndex].fallbackCommunicationList;

        //Assigning Data to Communication Table
        this.fallbackMechanismData.fallbackCommunicationList = updatefallbackMechanismList[eventIndex].fallbackCommunicationList;

        //Assign Data to Communication Card
        this.fallbackCommunicationData =
          updatefallbackMechanismList[eventIndex].fallbackCommunicationList[
          updatefallbackMechanismList[eventIndex].fallbackCommunicationList.length - 1
          ];
        this.RemoveFallBackError();

      } else {
        if (this.nullCheck(this.fallbackMechanismList[eventIndex].fallbackCommunicationList)) {
          this.throwBusinessError(this.nullCheckError)
        }
        else if (this.isSeqNo) {
          this.throwBusinessError(this.seqNoError)
        }
        else if (this.isEventName) {

          this.throwBusinessError(this.eventNameError)
        }

        else if (this.isMedium) {

          this.throwBusinessError(this.mediumError)
        }
        else this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwFallBackError();
    }
  }

  rowDeselectFallBackData(FallbackData: FallbackMechanismDto[]) {
    const deSelectData = FallbackData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: FallbackMechanismDto) => {
          return {
            ...x,
            rowSelected: false
          };
        })
        : [];
    return updateDeselect;
  }

  deselectCommunicationData(FallBackCommunication: FallbackCommunicationDto[]) {
    const deSelectData = FallBackCommunication;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: FallbackCommunicationDto) => {
          return {
            ...x,
            commrowSelected: false
          };
        })
        : [];
    return updateDeselect;
  }

}

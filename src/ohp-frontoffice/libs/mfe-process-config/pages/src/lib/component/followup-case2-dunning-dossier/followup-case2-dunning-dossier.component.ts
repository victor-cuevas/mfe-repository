import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { DossierStatusDto } from './Models/dossier-status.model';
import { FollowUpCaseStatus2DunningDossierStatusConfigDto } from './Models/followUp-caseStatus-dunningDossierStatusDto.model';
import { FollowUpCaseStatusDto } from './Models/followUp-caseStatusDto.model';
import { Dtostate } from './Models/dtobase.model';
import { FollowupCase2DunningDossierService } from './Services/followup-case2-dunning-dossier.service';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mprsc-followup-case2-dunning-dossier',
  templateUrl: './followup-case2-dunning-dossier.component.html',
  styleUrls: ['./followup-case2-dunning-dossier.component.scss']
})
export class FollowupCase2DunningDossierComponent implements OnInit {
  @ViewChild('followupDunningForm', { static: true }) followupDunningForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public RequiredFollowUpCaseConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredDossierStatusConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  internaldrop!: any;
  FollowupCaseStatus!: any;
  DossierStatus!: any;
  dossier!: any[];
  dossierHeader!: any[];
  validationHeader!: any;
  errorCode !:string

  dossierList!: DossierStatusDto[];
  followUpCaseStatusList!: FollowUpCaseStatusDto[];
  followUpCaseDunningList: FollowUpCaseStatus2DunningDossierStatusConfigDto[] = [];
  followUpCaseDunningData: FollowUpCaseStatus2DunningDossierStatusConfigDto = new FollowUpCaseStatus2DunningDossierStatusConfigDto();
  businessValidationError!: any;
  deletedArray: FollowUpCaseStatus2DunningDossierStatusConfigDto[] = [];
  highlightFollowupCase : FollowUpCaseStatus2DunningDossierStatusConfigDto = new FollowUpCaseStatus2DunningDossierStatusConfigDto();

  exceptionBox!: boolean;
  showDialog = false;
  hideCard = true;
  navigateURL !: any;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public followupcaseDunningService: FollowupCase2DunningDossierService,
    public spinnerService: SpinnerService,
    public fluidValidation: fluidValidationService,
    public commonService:ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('process.Validation.Header');
    this.businessValidationError = this.translate.instant('process.cm-dossier.ValidationError.businessError');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      console.log(data);
      this.dossierList = data.dossierStatusList;
      this.followUpCaseStatusList = data.followupCaseStatus;
      const updateDunningList = data.followupDunningList.map((x: FollowUpCaseStatus2DunningDossierStatusConfigDto) => {
        return { ...x, isSelected: false, randomNumber: this.generateRandomNumber() };
      });

      if (updateDunningList.length > 0) {
        updateDunningList[0].isSelected = true;
        this.followUpCaseDunningList = [...updateDunningList];
        this.followUpCaseDunningData = this.followUpCaseDunningList[0];
        this.highlightFollowupCase = this.followUpCaseDunningList[0];
      } else {
        this.hideCard = false;
      }
    });

    this.dossierHeader = [
      { header: this.translate.instant('process.cm-dossier.tabel.FollowupCaseStatus'), field: 'followUpCaseStatus.caption', width: '50%' },
      { header: this.translate.instant('process.cm-dossier.tabel.DossierStatus'), field: 'dossierStatus.caption', width: '45%' },
      { header: this.translate.instant('process.cm-dossier.tabel.Delete'), field: 'delete', fieldType: 'deleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const followUpCaseError = new ErrorDto();
    followUpCaseError.validation = 'required';
    followUpCaseError.isModelError = true;
    followUpCaseError.validationMessage =
      this.translate.instant('process.cm-dossier.ValidationError.FollowupCaseStatus') +
      this.translate.instant('process.cm-dossier.ValidationError.required');
    this.RequiredFollowUpCaseConfig.required = true;
    this.RequiredFollowUpCaseConfig.Errors = [followUpCaseError];

    const dossierStatusError = new ErrorDto();
    dossierStatusError.validation = 'required';
    dossierStatusError.isModelError = true;
    dossierStatusError.validationMessage =
      this.translate.instant('process.cm-dossier.ValidationError.DossierStatus') +
      this.translate.instant('process.cm-dossier.ValidationError.required');
    this.RequiredDossierStatusConfig.required = true;
    this.RequiredDossierStatusConfig.Errors = [dossierStatusError];
  }

  addNewRow() {
    if (this.followupDunningForm.valid) {
      if (!this.isDuplicateFollowUpExists()) {
        if (this.followUpCaseDunningList.length == 0) {
          this.hideCard = true;
        }

        this.RemoveBusinessError(this.businessValidationError);
        let updatefollowUpDunningList = [...this.followUpCaseDunningList];
        updatefollowUpDunningList = this.rowDeselectData(updatefollowUpDunningList);
        this.followUpCaseDunningData = new FollowUpCaseStatus2DunningDossierStatusConfigDto();

        updatefollowUpDunningList.push({
          ...this.followUpCaseDunningData,
          randomNumber: this.generateRandomNumber(),
          isSelected: true,
          state: 1
        });
        this.followUpCaseDunningList = [...updatefollowUpDunningList];

          this.highlightFollowupCase = this.followUpCaseDunningList[this.followUpCaseDunningList.length - 1];
        this.followupDunningForm.resetForm();
        this.removeDunningDossierError();
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwDunningDossierError();
    }
  }

  onRowselect(event: FollowUpCaseStatus2DunningDossierStatusConfigDto) {
    if (this.followupDunningForm.valid || event.isSelected) {
      if (!this.isDuplicateFollowUpExists() || event.isSelected) {
        this.RemoveBusinessError(this.businessValidationError);
        let updateFollowUpDunningListData = this.followUpCaseDunningList;
        const eventIndex = updateFollowUpDunningListData.findIndex(x => x.isSelected);

        updateFollowUpDunningListData = this.rowDeselectData(updateFollowUpDunningListData);

        this.followUpCaseDunningList[eventIndex].isSelected = updateFollowUpDunningListData[eventIndex].isSelected;

        const selectedIndex = updateFollowUpDunningListData.findIndex(x => x.randomNumber == event.randomNumber);

        this.followUpCaseDunningList[selectedIndex].isSelected = true;
        this.highlightFollowupCase = this.followUpCaseDunningList[selectedIndex];
        this.followUpCaseDunningData = event;
        this.removeDunningDossierError();
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwDunningDossierError();
    }
  }

  rowDeselectData(genericData: FollowUpCaseStatus2DunningDossierStatusConfigDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: FollowUpCaseStatus2DunningDossierStatusConfigDto) => {
            return {
              ...x,
              isSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onRowDelete(event: FollowUpCaseStatus2DunningDossierStatusConfigDto) {
    if ((this.followupDunningForm.valid && !this.isDuplicateFollowUpExists()) || event.isSelected) {
      const followUpDunningListData = [...this.followUpCaseDunningList];

      const todeleteIndex = followUpDunningListData.findIndex((data: FollowUpCaseStatus2DunningDossierStatusConfigDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != followUpDunningListData.length - 1) {
        if (followUpDunningListData[todeleteIndex].state == 1) {
          followUpDunningListData.splice(todeleteIndex, 1);
          this.removeDunningDossierError();
          this.RemoveBusinessError(this.businessValidationError);
        } else {
          followUpDunningListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...followUpDunningListData[todeleteIndex] });
          followUpDunningListData.splice(todeleteIndex, 1);
          this.removeDunningDossierError();
          this.RemoveBusinessError(this.businessValidationError);
        }

        if (followUpDunningListData.length > 0) {
          this.followUpCaseDunningList = this.rowDeselectData(followUpDunningListData);
          this.followUpCaseDunningList[0].isSelected = true;
          this.followUpCaseDunningData = this.followUpCaseDunningList[0];
          this.highlightFollowupCase = this.followUpCaseDunningList[0];
        } else {
          this.followUpCaseDunningList = [];
          this.followUpCaseDunningData = new FollowUpCaseStatus2DunningDossierStatusConfigDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (followUpDunningListData[todeleteIndex].state == 1) {
          followUpDunningListData.splice(todeleteIndex, 1);
          this.removeDunningDossierError();
          this.RemoveBusinessError(this.businessValidationError);
        } else {
          followUpDunningListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...followUpDunningListData[todeleteIndex] });
          followUpDunningListData.splice(todeleteIndex, 1);
          this.removeDunningDossierError();
          this.RemoveBusinessError(this.businessValidationError);
        }

        if (followUpDunningListData.length > 0) {
          this.followUpCaseDunningList = this.rowDeselectData(followUpDunningListData);
          this.followUpCaseDunningList[this.followUpCaseDunningList?.length - 1].isSelected = true;
          const lastIndex = this.followUpCaseDunningList.findIndex((x: FollowUpCaseStatus2DunningDossierStatusConfigDto) => x.isSelected);

          this.followUpCaseDunningData = this.followUpCaseDunningList[lastIndex];
          this.highlightFollowupCase = this.followUpCaseDunningList[lastIndex];
        } else {
          this.followUpCaseDunningList = [];
          this.followUpCaseDunningData = new FollowUpCaseStatus2DunningDossierStatusConfigDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateFollowUpExists()) {
        this.throwBusinessError(this.businessValidationError);
      } else {
        this.throwDunningDossierError();
      }
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onfollowUpCaseStatusChange(event: any) {
    const selectedIndex = this.followUpCaseDunningList.findIndex((x: FollowUpCaseStatus2DunningDossierStatusConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.followUpCaseDunningList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpCaseStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpCaseDunningList[selectedIndex].followUpCaseStatus = updategrid.followUpCaseStatus;
      this.followUpCaseDunningList[selectedIndex].state = updategrid.state;
      this.followUpCaseDunningData.followUpCaseStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.followUpCaseDunningList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpCaseStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpCaseDunningList[selectedIndex].followUpCaseStatus = null;
      this.followUpCaseDunningList[selectedIndex].state = updategrid.state;
      this.followUpCaseDunningData.followUpCaseStatus = null;
      this.RequiredFollowUpCaseConfig.externalError = true;
    }
  }

  ondossierStatusChange(event: any) {
    const selectedIndex = this.followUpCaseDunningList.findIndex((x: FollowUpCaseStatus2DunningDossierStatusConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.followUpCaseDunningList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpCaseDunningList[selectedIndex].dossierStatus = updategrid.dossierStatus;
      this.followUpCaseDunningList[selectedIndex].state = updategrid.state;
      this.followUpCaseDunningData.dossierStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.followUpCaseDunningList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.followUpCaseDunningList[selectedIndex].dossierStatus = null;
      this.followUpCaseDunningList[selectedIndex].state = updategrid.state;
      this.followUpCaseDunningData.dossierStatus = null;
      this.RequiredDossierStatusConfig.externalError = true;
    }
  }

  onSave(followUpCaseDunningList: FollowUpCaseStatus2DunningDossierStatusConfigDto[]) {
    if (this.followupDunningForm.valid) {
      if (!this.isDuplicateFollowUpExists()) {
        this.removeDunningDossierError();
        this.RemoveBusinessError(this.businessValidationError);
        followUpCaseDunningList.map(data => {
          if (data.state != 0) {
            this.deletedArray.push({ ...data });
          }
        });

        this.followupcaseDunningService.saveFollowUpCaseStatusDunningDossierStatus(this.deletedArray).subscribe(
          responseData => {
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];
            if (responseData) {
              this.followupcaseDunningService.getFollowUpCaseStatusDunningDossierStatus().subscribe(
                (data: any) => {
                  this.deletedArray = [];
                  this.spinnerService.setIsLoading(false);

                  const UpdateFollowUpDunningList = data.map((followUpDunning: FollowUpCaseStatus2DunningDossierStatusConfigDto) => {
                    return { ...followUpDunning, isSelected: false, randomNumber: this.generateRandomNumber() };
                  });

                  if (UpdateFollowUpDunningList.length > 0) {
                    this.followUpCaseDunningList = [...UpdateFollowUpDunningList];
                    const selectedIndex = this.followUpCaseDunningList.findIndex(
                      x => x.followUpCaseStatus?.codeId === this.followUpCaseDunningData.followUpCaseStatus?.codeId &&
                      x.dossierStatus?.codeId === this.followUpCaseDunningData.dossierStatus?.codeId
  
                      );
                    this.followUpCaseDunningList[selectedIndex].isSelected = true;
                    this.followUpCaseDunningData = this.followUpCaseDunningList[selectedIndex];
                    this.highlightFollowupCase = this.followUpCaseDunningList[selectedIndex];
                  } else {
                    this.hideCard = false;
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.deletedArray = [];
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            if(err?.error?.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];
            this.exceptionBox = true;
          }
        );
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    }else{
      this.throwDunningDossierError();
    }
  }

  isDuplicateFollowUpExists(): boolean {
    let followUpCaseDunningDup = this.followUpCaseDunningList.reduce(
      (array: FollowUpCaseStatus2DunningDossierStatusConfigDto[], current) => {
        if (
          !array.some(
            (item: FollowUpCaseStatus2DunningDossierStatusConfigDto) =>
              item.followUpCaseStatus?.caption == current.followUpCaseStatus?.caption &&
              item.dossierStatus?.caption == current.dossierStatus?.caption
          )
        ) {
          array.push(current);
        }
        return array;
      },
      []
    );

    if (followUpCaseDunningDup.length != this.followUpCaseDunningList.length) {
      return true;
    } else {
      followUpCaseDunningDup = [];
      return false;
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

  throwDunningDossierError() {
    this.RequiredDossierStatusConfig.externalError = true;
    this.RequiredFollowUpCaseConfig.externalError = true;
  }

  removeDunningDossierError() {
    this.RequiredDossierStatusConfig.externalError = false;
    this.RequiredFollowUpCaseConfig.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  onClose() {
    const isChangedIndexExist = this.followUpCaseDunningList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeDunningDossierError();
      this.RemoveBusinessError(this.businessValidationError);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(followUpCaseDunningList: FollowUpCaseStatus2DunningDossierStatusConfigDto[]) {
    this.showDialog = false;

    if (this.followupDunningForm.valid) {
      if (!this.isDuplicateFollowUpExists()) {
        this.onSave(followUpCaseDunningList);
        this.removeDunningDossierError();
        this.RemoveBusinessError(this.businessValidationError);
        window.location.assign(this.navigateURL);
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwDunningDossierError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeDunningDossierError();
    this.RemoveBusinessError(this.businessValidationError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }
}

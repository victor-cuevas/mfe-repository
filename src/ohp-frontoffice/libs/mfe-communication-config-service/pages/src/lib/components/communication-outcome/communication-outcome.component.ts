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
import { CommunicationOutcome2DossierStatusDto } from './Models/communication- outcome2-dossierStatusDto.model';
import { CommunicationOutcome2DossierStatusListDto } from './Models/communication-outcome2-dossierStatusListDto.model';
import { CommunicationOutcomeDto } from './Models/communication-outcomeDto.model';
import { DossierPhaseDto } from './Models/dossier-phaseDto.model';
import { DossierStatus2DossierPhaseDto } from './Models/dossierStatus2-dossierPhaseDto.model';
import { DossierStatus2PossibleOutcomeDto } from './Models/dossierStatus2-possible-outcomeDto.model';
import { DossierStatusDto } from './Models/dossierStatusDto.model';
import { SubStatusDto } from './Models/sub-statusDto.model';
import { DtoState } from './Models/dtoBase.model';
import { CommunicationOutcomeService } from './Services/communication-outcome.service';
import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mccs-communication-outcome',
  templateUrl: './communication-outcome.component.html',
  styleUrls: ['./communication-outcome.component.scss']
})
export class CommunicationOutcomeComponent implements OnInit {
  @ViewChild('communicationoutcomeform', { static: true }) communicationoutComeform!: NgForm;
  @ViewChild('dossierpossibleform', { static: true }) dossierpossibleform!: NgForm;
  @ViewChild('dossierphaseform', { static: true }) dossierphaseform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  RequiredOutcome: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  RequiredDossierStatus: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  RequiredDossierStatusPhase: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  RequiredDossierPhase: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  RequiredPossibleOutcomeStatus: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';

  commOutHeader!: any[];

  dossierHeader!: any[];

  dossier1Header!: any[];

  targetList: CommunicationOutcomeDto[] = [];
  source: CommunicationOutcomeDto[] = [];
  target: CommunicationOutcomeDto[] = [];

  communicationOutcomeList: CommunicationOutcomeDto[] = [];
  dossierStatusList: DossierStatusDto[] = [];
  dossierPhaseList: DossierPhaseDto[] = [];
  subStatusList: SubStatusDto[] = [];

  commDossierStatusList: CommunicationOutcome2DossierStatusDto[] = [];
  commDossierStatusData: CommunicationOutcome2DossierStatusDto = new CommunicationOutcome2DossierStatusDto();

  commDossierPhaseList: DossierStatus2DossierPhaseDto[] = [];
  commDossierPhaseData: DossierStatus2DossierPhaseDto = new DossierStatus2DossierPhaseDto();

  commOutcomePossibleList: DossierStatus2PossibleOutcomeDto[] = [];
  commOutcomePossibleData: DossierStatus2PossibleOutcomeDto = new DossierStatus2PossibleOutcomeDto();

  deletedDossierStatusArray: CommunicationOutcome2DossierStatusDto[] = [];
  deletedDossierPhaseStatusArray: DossierStatus2DossierPhaseDto[] = [];
  deletedDossierPossibleArray: DossierStatus2PossibleOutcomeDto[] = [];

  validationHeader!: any;
  dossierstatusBusinessError!: string;
  dossierPhaseBusinesError!: string;
  dossierpossibleoutcomeBusinessError!: string;
  possibleOutcomeError!: string;

  showDialog = false;
  hideDossierStatusCard = true;
  hideDossierPhaseCard = true;
  hideDossierPossibleOutCard = true;
  exceptionBox!: boolean;
  navigateURL: any;
  errorCode !: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public fluidValidation: fluidValidationService,
    public commOutcomeService: CommunicationOutcomeService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('communication.Validation.validationHeader');
    this.dossierstatusBusinessError = this.translate.instant('communication.CommunicationOutcome.ValidationError.OutcomeBusinessError');
    this.dossierPhaseBusinesError = this.translate.instant('communication.CommunicationOutcome.ValidationError.DossierPhaseBusinessError');
    this.dossierpossibleoutcomeBusinessError = this.translate.instant(
      'communication.CommunicationOutcome.ValidationError.PossibleOutcomeBusinessError'
    );
    this.possibleOutcomeError = this.translate.instant('communication.CommunicationOutcome.ValidationError.SelectedOutcomeList');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.communicationOutcomeList = data.communicationOutcomeList;
      this.dossierStatusList = data.dossierStatusList;
      this.dossierPhaseList = data.dossierPhaseList;
      this.subStatusList = data.subStatusList;
      /*Dossier Status */
      const UpdateDossierStatus = data.communicationoutcome2dossierList.communicationOutcome2DossierStatusList.map(
        (data: CommunicationOutcome2DossierStatusDto) => {
          return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
        }
      );

      if (UpdateDossierStatus.length > 0) {
        this.commDossierStatusList = UpdateDossierStatus;
        this.commDossierStatusList[0].rowSelected = true;
        this.commDossierStatusData = this.commDossierStatusList[0];
      }else{
        this.hideDossierStatusCard = false;
      }

      /*Dossier Phase */
      const UpdateDossierPhase = data.communicationoutcome2dossierList.dossierStatus2DossierPhaseList.map(
        (data: DossierStatus2DossierPhaseDto) => {
          return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
        }
      );

      if (UpdateDossierPhase.length > 0) {
        this.commDossierPhaseList = UpdateDossierPhase;
        this.commDossierPhaseList[0].rowSelected = true;
        this.commDossierPhaseData = this.commDossierPhaseList[0];
      }else{
        this.hideDossierPhaseCard = false;
      }

      /*DossierPossibleOutcome */
      const UpdatePossibleOutcome = data.communicationoutcome2dossierList.dossierStatus2PossibleOutcomeList.map(
        (data: DossierStatus2PossibleOutcomeDto) => {
          return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
        }
      );

      if (UpdatePossibleOutcome.length > 0) {
        this.commOutcomePossibleList = UpdatePossibleOutcome;
        this.commOutcomePossibleList[0].rowSelected = true;
        this.commOutcomePossibleData = this.commOutcomePossibleList[0];
        this.assigningSourceTarget(0);
      }else{
        this.hideDossierPossibleOutCard = false;
      }
    });

    this.commOutHeader = [
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.CommunicationOutcome'),
        field: 'outcome.caption',
        width: '25%'
      },
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.DossierStatus'),
        field: 'dossierStatus.caption',
        width: '25%'
      },
      { header: this.translate.instant('communication.CommunicationOutcome.tabel.SubStatus'), field: 'subStatus.caption', width: '45%' },
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.Delete'),
        field: 'Delete',
        fieldType: 'deleteButton',
        width: '5%'
      }
    ];

    this.dossierHeader = [
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.DossierStatus1'),
        field: 'dossierStatus.caption',
        width: '50%'
      },
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.DossierPhase'),
        field: 'dossierPhase.caption',
        width: '45%'
      },
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.Delete'),
        field: 'Delete',
        fieldType: 'deleteButton',
        width: '5%'
      }
    ];

    this.dossier1Header = [
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.DossierStatus2'),
        field: 'dossierStatus.caption',
        width: '95%'
      },
      {
        header: this.translate.instant('communication.CommunicationOutcome.tabel.Delete2'),
        field: 'Delete2',
        fieldType: 'deleteButton',
        width: '5%'
      }
    ];
  }

  buildConfiguration() {
    const outcomesError = new ErrorDto();
    outcomesError.validation = 'required';
    outcomesError.isModelError = true;
    outcomesError.validationMessage =
      this.translate.instant('communication.CommunicationOutcome.ValidationError.CommunicationOutcome') +
      this.translate.instant('communication.CommunicationOutcome.ValidationError.required');
    this.RequiredOutcome.required = true;
    this.RequiredOutcome.Errors = [outcomesError];

    const dossierStatusError = new ErrorDto();
    dossierStatusError.validation = 'required';
    dossierStatusError.isModelError = true;
    dossierStatusError.validationMessage =
      this.translate.instant('communication.CommunicationOutcome.ValidationError.DossierStatus') +
      this.translate.instant('communication.CommunicationOutcome.ValidationError.required');
    this.RequiredDossierStatus.required = true;
    this.RequiredDossierStatus.Errors = [dossierStatusError];

    const dossierStatusPhaseError = new ErrorDto();
    dossierStatusPhaseError.validation = 'required';
    dossierStatusPhaseError.isModelError = true;
    dossierStatusPhaseError.validationMessage =
      this.translate.instant('communication.CommunicationOutcome.ValidationError.DossierPhaseStatus') +
      this.translate.instant('communication.CommunicationOutcome.ValidationError.required');
    this.RequiredDossierStatusPhase.required = true;
    this.RequiredDossierStatusPhase.Errors = [dossierStatusPhaseError];

    const dossierPhaseError = new ErrorDto();
    dossierPhaseError.validation = 'required';
    dossierPhaseError.isModelError = true;
    dossierPhaseError.validationMessage =
      this.translate.instant('communication.CommunicationOutcome.ValidationError.DossierPhase') +
      this.translate.instant('communication.CommunicationOutcome.ValidationError.required');
    this.RequiredDossierPhase.required = true;
    this.RequiredDossierPhase.Errors = [dossierPhaseError];

    const dossierstatusPossibleError = new ErrorDto();
    dossierstatusPossibleError.validation = 'required';
    dossierstatusPossibleError.isModelError = true;
    dossierstatusPossibleError.validationMessage =
      this.translate.instant('communication.CommunicationOutcome.ValidationError.PossibleOutcomeDosStatus') +
      this.translate.instant('communication.CommunicationOutcome.ValidationError.required');
    this.RequiredPossibleOutcomeStatus.required = true;
    this.RequiredPossibleOutcomeStatus.Errors = [dossierstatusPossibleError];
  }

  onRowDeleteDossierStatus(event: CommunicationOutcome2DossierStatusDto) {
    if ((this.communicationoutComeform.valid && !this.isDuplicateCommOutComeExists(this.commDossierStatusList)) || event.rowSelected) {
      const commDossierStatusListData = [...this.commDossierStatusList];

      const todeleteIndex = commDossierStatusListData.findIndex((data: CommunicationOutcome2DossierStatusDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != commDossierStatusListData.length - 1) {
        if (commDossierStatusListData[todeleteIndex].state == 1) {
          commDossierStatusListData.splice(todeleteIndex, 1);
          this.removeDossierStatusError();
          this.RemoveBusinessError(this.dossierstatusBusinessError);
        } else {
          commDossierStatusListData[todeleteIndex].state = 4;
          this.deletedDossierStatusArray.push({ ...commDossierStatusListData[todeleteIndex] });
          commDossierStatusListData.splice(todeleteIndex, 1);
          this.removeDossierStatusError();
          this.RemoveBusinessError(this.dossierstatusBusinessError);
        }

        if (commDossierStatusListData.length > 0) {
          this.commDossierStatusList = this.rowDeselectDossierStatus(commDossierStatusListData);
          this.commDossierStatusList[0].rowSelected = true;
          this.commDossierStatusData = this.commDossierStatusList[0];
        } else {
          this.commDossierStatusList = [];
          this.commDossierStatusData = new CommunicationOutcome2DossierStatusDto();
          setTimeout(() => {
            this.hideDossierStatusCard = false;
          }, 100);
        }
      } else {
        if (commDossierStatusListData[todeleteIndex].state == 1) {
          commDossierStatusListData.splice(todeleteIndex, 1);
          this.removeDossierStatusError();
          this.RemoveBusinessError(this.dossierstatusBusinessError);
        } else {
          commDossierStatusListData[todeleteIndex].state = 4;
          this.deletedDossierStatusArray.push({ ...commDossierStatusListData[todeleteIndex] });
          commDossierStatusListData.splice(todeleteIndex, 1);
          this.removeDossierStatusError();
          this.RemoveBusinessError(this.dossierstatusBusinessError);
        }

        if (commDossierStatusListData.length > 0) {
          this.commDossierStatusList = this.rowDeselectDossierStatus(commDossierStatusListData);
          this.commDossierStatusList[this.commDossierStatusList?.length - 1].rowSelected = true;
          const lastIndex = this.commDossierStatusList.findIndex((x: CommunicationOutcome2DossierStatusDto) => x.rowSelected);

          this.commDossierStatusData = this.commDossierStatusList[lastIndex];
          //this.highlightFollowUpData = this.followUpEventConfigList[lastIndex];
        } else {
          this.commDossierStatusList = [];
          this.commDossierStatusData = new CommunicationOutcome2DossierStatusDto();
          setTimeout(() => {
            this.hideDossierStatusCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateCommOutComeExists(this.commDossierStatusList)) {
        this.throwBusinessError(this.dossierstatusBusinessError);
      } else {
        this.throwDossierStatusError();
      }
    }
  }

  onAddDossierStatus() {
    if (this.communicationoutComeform.valid) {
      if (!this.isDuplicateCommOutComeExists(this.commDossierStatusList)) {
        if (this.commDossierStatusList.length == 0) {
          this.hideDossierStatusCard = true;
        }

        this.RemoveBusinessError(this.dossierstatusBusinessError);
        let updatecommDossierStatusList = [...this.commDossierStatusList];
        updatecommDossierStatusList = this.rowDeselectDossierStatus(updatecommDossierStatusList);
        this.commDossierStatusData = new CommunicationOutcome2DossierStatusDto();

        updatecommDossierStatusList.push({
          ...this.commDossierStatusData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.commDossierStatusList = [...updatecommDossierStatusList];
        const newRowIndex = this.commDossierStatusList.findIndex(x => x.rowSelected);
        if (newRowIndex >= 0) {
          this.commDossierStatusData = this.commDossierStatusList[newRowIndex];
        }

        this.communicationoutComeform.resetForm();
        this.removeDossierStatusError();
      } else {
        this.throwBusinessError(this.dossierstatusBusinessError);
      }
    } else {
      this.throwDossierStatusError();
    }
  }

  onDossierstsRowselect(event: CommunicationOutcome2DossierStatusDto) {
    if (this.communicationoutComeform.valid || event.rowSelected) {
      if (!this.isDuplicateCommOutComeExists(this.commDossierStatusList) || event.rowSelected) {
        this.RemoveBusinessError(this.dossierstatusBusinessError);
        let updatecommDossierList = this.commDossierStatusList;
        const eventIndex = updatecommDossierList.findIndex(x => x.rowSelected);

        updatecommDossierList = this.rowDeselectDossierStatus(updatecommDossierList);

        this.commDossierStatusList[eventIndex].rowSelected = updatecommDossierList[eventIndex].rowSelected;

        const selectedIndex = updatecommDossierList.findIndex(x => x.randomNumber == event.randomNumber);

        this.commDossierStatusList[selectedIndex].rowSelected = true;
        // this.highlightFollowUpData = this.commDossierStatusList[selectedIndex];
        this.commDossierStatusData = event;
        this.removeDossierStatusError();
      } else {
        this.throwBusinessError(this.dossierstatusBusinessError);
      }
    } else {
      this.throwDossierStatusError();
    }
  }

  onOutcomeChange(event: any) {
    const selectedIndex = this.commDossierStatusList.findIndex((x: CommunicationOutcome2DossierStatusDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.outcome = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].outcome = updategrid.outcome;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.outcome = event.value;
    } else if (event?.value == null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.outcome = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].outcome = null;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.outcome = null;
      this.RequiredOutcome.externalError = true;
    }
  }

  ondossierStatusChange(event: any) {
    const selectedIndex = this.commDossierStatusList.findIndex((x: CommunicationOutcome2DossierStatusDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].dossierStatus = updategrid.dossierStatus;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.dossierStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].dossierStatus = null;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.dossierStatus = null;
      this.RequiredDossierStatus.externalError = true;
    }
  }

  onsubStatusChange(event: any) {
    const selectedIndex = this.commDossierStatusList.findIndex((x: CommunicationOutcome2DossierStatusDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.subStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].subStatus = updategrid.subStatus;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.subStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.commDossierStatusList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.subStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierStatusList[selectedIndex].subStatus = null;
      this.commDossierStatusList[selectedIndex].state = updategrid.state;
      this.commDossierStatusData.subStatus = null;
      //this.RequiredFollowUp.externalError = true;
    }
  }

  rowDeselectDossierStatus(genericData: CommunicationOutcome2DossierStatusDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: CommunicationOutcome2DossierStatusDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  throwDossierStatusError() {
    this.RequiredOutcome.externalError = true;
    this.RequiredDossierStatus.externalError = true;
  }

  removeDossierStatusError() {
    this.RequiredOutcome.externalError = false;
    this.RequiredDossierStatus.externalError = false;
  }

  isDuplicateCommOutComeExists(newgridDate: CommunicationOutcome2DossierStatusDto[]) {
    const removeNullDateValue = newgridDate.filter((date: CommunicationOutcome2DossierStatusDto) => date.outcome?.codeId);
    const uniqueValues = [...new Set(removeNullDateValue.map((date: CommunicationOutcome2DossierStatusDto) => date.outcome?.codeId))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  /*Dossier Phase Change Event*/

  onDossierPhaseAdd() {
    if (this.dossierphaseform.valid) {
      if (!this.isDuplicateDossierStatusPhaseExists(this.commDossierPhaseList)) {
        if (this.commDossierPhaseList.length == 0) {
          this.hideDossierPhaseCard = true;
        }

        this.RemoveBusinessError(this.dossierPhaseBusinesError);
        let updatecommDossierPhaseList = [...this.commDossierPhaseList];
        updatecommDossierPhaseList = this.rowDeselectDossierPhase(updatecommDossierPhaseList);
        this.commDossierPhaseData = new DossierStatus2DossierPhaseDto();

        updatecommDossierPhaseList.push({
          ...this.commDossierPhaseData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.commDossierPhaseList = [...updatecommDossierPhaseList];
        //this.highlightFollowUpData = this.commDossierStatusList[this.commDossierStatusList.length - 1];
        const newRowIndex = this.commDossierPhaseList.findIndex(x => x.rowSelected);
        if (newRowIndex >= 0) {
          this.commDossierPhaseData = this.commDossierPhaseList[newRowIndex];
        }
        this.dossierphaseform.resetForm();
        this.removeDossierPhaseError();
      } else {
        this.throwBusinessError(this.dossierPhaseBusinesError);
      }
    } else {
      this.throwDossierPhaseError();
    }
  }

  onDossierPhaseRowDelete(event: DossierStatus2DossierPhaseDto) {
    if ((this.dossierphaseform.valid && !this.isDuplicateDossierStatusPhaseExists(this.commDossierPhaseList)) || event.rowSelected) {
      const commDossierPhaseListData = [...this.commDossierPhaseList];

      const todeleteIndex = commDossierPhaseListData.findIndex((data: DossierStatus2DossierPhaseDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != commDossierPhaseListData.length - 1) {
        if (commDossierPhaseListData[todeleteIndex].state == 1) {
          commDossierPhaseListData.splice(todeleteIndex, 1);
          this.removeDossierPhaseError();
          this.RemoveBusinessError(this.dossierPhaseBusinesError);
        } else {
          commDossierPhaseListData[todeleteIndex].state = 4;
          this.deletedDossierPhaseStatusArray.push({ ...commDossierPhaseListData[todeleteIndex] });
          commDossierPhaseListData.splice(todeleteIndex, 1);
          this.removeDossierPhaseError();
          this.RemoveBusinessError(this.dossierPhaseBusinesError);
        }

        if (commDossierPhaseListData.length > 0) {
          this.commDossierPhaseList = this.rowDeselectDossierPhase(commDossierPhaseListData);
          this.commDossierPhaseList[0].rowSelected = true;
          this.commDossierPhaseData = this.commDossierPhaseList[0];
          //this.highlightFollowUpData = this.followUpEventConfigList[0];
        } else {
          this.commDossierPhaseList = [];
          this.commDossierPhaseData = new DossierStatus2DossierPhaseDto();
          setTimeout(() => {
             this.hideDossierPhaseCard = false;
          }, 100);
        }
      } else {
        if (commDossierPhaseListData[todeleteIndex].state == 1) {
          commDossierPhaseListData.splice(todeleteIndex, 1);
          this.removeDossierPhaseError();
          this.RemoveBusinessError(this.dossierPhaseBusinesError);
        } else {
          commDossierPhaseListData[todeleteIndex].state = 4;
          this.deletedDossierPhaseStatusArray.push({ ...commDossierPhaseListData[todeleteIndex] });
          commDossierPhaseListData.splice(todeleteIndex, 1);
          this.removeDossierPhaseError();
          this.RemoveBusinessError(this.dossierPhaseBusinesError);
        }

        if (commDossierPhaseListData.length > 0) {
          this.commDossierPhaseList = this.rowDeselectDossierPhase(commDossierPhaseListData);
          this.commDossierPhaseList[this.commDossierPhaseList?.length - 1].rowSelected = true;
          const lastIndex = this.commDossierPhaseList.findIndex((x: DossierStatus2DossierPhaseDto) => x.rowSelected);

          this.commDossierPhaseData = this.commDossierPhaseList[lastIndex];
          //this.highlightFollowUpData = this.followUpEventConfigList[lastIndex];
        } else {
          this.commDossierPhaseList = [];
          this.commDossierPhaseData = new DossierStatus2DossierPhaseDto();
          setTimeout(() => {
            this.hideDossierPhaseCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateDossierStatusPhaseExists(this.commDossierPhaseList)) {
        this.throwBusinessError(this.dossierPhaseBusinesError);
      } else {
        this.throwDossierPhaseError();
      }
    }
  }

  onDossierPhaseRowselect(event: DossierStatus2DossierPhaseDto) {
    if (this.dossierphaseform.valid || event.rowSelected) {
      if (!this.isDuplicateDossierStatusPhaseExists(this.commDossierPhaseList) || event.rowSelected) {
        this.RemoveBusinessError(this.dossierPhaseBusinesError);
        let updatecommDossierPhaseList = this.commDossierPhaseList;
        const eventIndex = updatecommDossierPhaseList.findIndex(x => x.rowSelected);

        updatecommDossierPhaseList = this.rowDeselectDossierPhase(updatecommDossierPhaseList);

        this.commDossierPhaseList[eventIndex].rowSelected = updatecommDossierPhaseList[eventIndex].rowSelected;

        const selectedIndex = updatecommDossierPhaseList.findIndex(x => x.randomNumber == event.randomNumber);

        this.commDossierPhaseList[selectedIndex].rowSelected = true;
        // this.highlightFollowUpData = this.commDossierStatusList[selectedIndex];
        this.commDossierPhaseData = event;
        this.removeDossierPhaseError();
      } else {
        this.throwBusinessError(this.dossierPhaseBusinesError);
      }
    } else {
      this.throwDossierPhaseError();
    }
  }

  ondossierPhaseStatusChange(event: any) {
    const selectedIndex = this.commDossierPhaseList.findIndex((x: DossierStatus2DossierPhaseDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commDossierPhaseList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierPhaseList[selectedIndex].dossierStatus = updategrid.dossierStatus;
      this.commDossierPhaseList[selectedIndex].state = updategrid.state;
      this.commDossierPhaseData.dossierStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.commDossierPhaseList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierPhaseList[selectedIndex].dossierStatus = null;
      this.commDossierPhaseList[selectedIndex].state = updategrid.state;
      this.commDossierPhaseData.dossierStatus = null;
      this.RequiredDossierStatusPhase.externalError = true;
    }
  }

  ondossierPhaseChange(event: any) {
    const selectedIndex = this.commDossierPhaseList.findIndex((x: DossierStatus2DossierPhaseDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commDossierPhaseList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierPhase = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierPhaseList[selectedIndex].dossierPhase = updategrid.dossierPhase;
      this.commDossierPhaseList[selectedIndex].state = updategrid.state;
      this.commDossierPhaseData.dossierPhase = event.value;
    } else if (event?.value == null) {
      const updateData = this.commDossierPhaseList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierPhase = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commDossierPhaseList[selectedIndex].dossierPhase = null;
      this.commDossierPhaseList[selectedIndex].state = updategrid.state;
      this.commDossierPhaseData.dossierPhase = null;
      this.RequiredDossierPhase.externalError = true;
    }
  }

  rowDeselectDossierPhase(dossierPhase: DossierStatus2DossierPhaseDto[]) {
    const deSelectData = dossierPhase;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: DossierStatus2DossierPhaseDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  throwDossierPhaseError() {
    this.RequiredDossierStatusPhase.externalError = true;
    this.RequiredDossierPhase.externalError = true;
  }

  removeDossierPhaseError() {
    this.RequiredDossierStatusPhase.externalError = false;
    this.RequiredDossierPhase.externalError = false;
  }

  isDuplicateDossierStatusPhaseExists(newgridDate: DossierStatus2DossierPhaseDto[]) {
    const removeNullDateValue = newgridDate.filter((date: DossierStatus2DossierPhaseDto) => date.dossierStatus?.codeId);
    const uniqueValues = [...new Set(removeNullDateValue.map((date: DossierStatus2DossierPhaseDto) => date.dossierStatus?.codeId))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  /*Dossier Possible Outcome */

  onDossierPossibleOutcomeAdd() {
    if (this.dossierpossibleform.valid) {
      if (!this.isDuplicateDossierStatusPossibleOutcomeExists(this.commOutcomePossibleList) && !this.emptyPossibleOutcomeExist()) {
        if (this.commOutcomePossibleList.length == 0) {
          this.hideDossierPossibleOutCard = true;
        }

        // this.RemoveBusinessError(this.businessValidationError);
        let updatecommOutcomePossibleListData = [...this.commOutcomePossibleList];
        updatecommOutcomePossibleListData = this.rowDeselectDossierStatusPossibleout(updatecommOutcomePossibleListData);
        this.commOutcomePossibleData = new DossierStatus2PossibleOutcomeDto();
        this.commOutcomePossibleData.outcomeList = [];

        updatecommOutcomePossibleListData.push({
          ...this.commOutcomePossibleData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.commOutcomePossibleList = [...updatecommOutcomePossibleListData];
        this.source = [...this.communicationOutcomeList];
        this.target = [];

        const newRowIndex = this.commOutcomePossibleList.findIndex(x => x.rowSelected);
        if (newRowIndex >= 0) {
          this.commOutcomePossibleData = this.commOutcomePossibleList[newRowIndex];
        }

        this.dossierpossibleform.resetForm();
        this.removePossibleOutcomeError();
      } else {
        if (this.emptyPossibleOutcomeExist()) {
          this.throwBusinessError(this.possibleOutcomeError);
        } else {
          this.throwBusinessError(this.dossierpossibleoutcomeBusinessError);
        }
      }
    } else {
      this.throwPossibleOutcomeError();
    }
  }

  onDossierPossibleOutcomeRowselect(event: DossierStatus2PossibleOutcomeDto) {
    if (this.dossierpossibleform.valid || event.rowSelected) {
      if (
        (!this.isDuplicateDossierStatusPossibleOutcomeExists(this.commOutcomePossibleList) && !this.emptyPossibleOutcomeExist()) ||
        event.rowSelected
      ) {
        this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
        let updatecommOutcomePossibleList = this.commOutcomePossibleList;
        const eventIndex = updatecommOutcomePossibleList.findIndex(x => x.rowSelected);

        updatecommOutcomePossibleList = this.rowDeselectDossierStatusPossibleout(updatecommOutcomePossibleList);

        this.commOutcomePossibleList[eventIndex].rowSelected = updatecommOutcomePossibleList[eventIndex].rowSelected;

        const selectedIndex = updatecommOutcomePossibleList.findIndex(x => x.randomNumber == event.randomNumber);

        this.commOutcomePossibleList[selectedIndex].rowSelected = true;

        // this.highlightFollowUpData = this.commDossierStatusList[selectedIndex];
        this.commOutcomePossibleData = event;
        this.assigningSourceTarget(selectedIndex);
        this.removePossibleOutcomeError();
      } else {
        if (this.emptyPossibleOutcomeExist()) {
          this.throwBusinessError(this.possibleOutcomeError);
        } else {
          this.throwBusinessError(this.dossierpossibleoutcomeBusinessError);
        }
      }
    } else {
      this.throwPossibleOutcomeError();
    }
  }

  onDossierPossibleOutcomeRowDelete(event: DossierStatus2PossibleOutcomeDto) {
    if (
      (this.dossierpossibleform.valid &&
        !this.isDuplicateDossierStatusPossibleOutcomeExists(this.commOutcomePossibleList) &&
        !this.emptyPossibleOutcomeExist()) ||
      event.rowSelected
    ) {
      const commOutcomePossibleListData = [...this.commOutcomePossibleList];

      const todeleteIndex = commOutcomePossibleListData.findIndex((data: DossierStatus2PossibleOutcomeDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != commOutcomePossibleListData.length - 1) {
        if (commOutcomePossibleListData[todeleteIndex].state == 1) {
          commOutcomePossibleListData.splice(todeleteIndex, 1);
          this.removePossibleOutcomeError();
          this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
          this.RemoveBusinessError(this.possibleOutcomeError);
        } else {
          commOutcomePossibleListData[todeleteIndex].state = 4;
          this.deletedDossierPossibleArray.push({ ...commOutcomePossibleListData[todeleteIndex] });
          commOutcomePossibleListData.splice(todeleteIndex, 1);
          this.removePossibleOutcomeError();
          this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
          this.RemoveBusinessError(this.possibleOutcomeError);
        }

        if (commOutcomePossibleListData.length > 0) {
          this.commOutcomePossibleList = this.rowDeselectDossierStatusPossibleout(commOutcomePossibleListData);
          this.commOutcomePossibleList[0].rowSelected = true;
          this.commOutcomePossibleData = this.commOutcomePossibleList[0];
          this.assigningSourceTarget(0);
          //this.highlightFollowUpData = this.followUpEventConfigList[0];
        } else {
          this.commOutcomePossibleList = [];
          this.commOutcomePossibleData = new DossierStatus2PossibleOutcomeDto();
          setTimeout(() => {
             this.hideDossierPossibleOutCard = false;
          }, 100);
        }
      } else {
        if (commOutcomePossibleListData[todeleteIndex].state == 1) {
          commOutcomePossibleListData.splice(todeleteIndex, 1);
          this.removePossibleOutcomeError();
          this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
          this.RemoveBusinessError(this.possibleOutcomeError);
        } else {
          commOutcomePossibleListData[todeleteIndex].state = 4;
          this.deletedDossierPossibleArray.push({ ...commOutcomePossibleListData[todeleteIndex] });
          commOutcomePossibleListData.splice(todeleteIndex, 1);
          this.removePossibleOutcomeError();
          this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
          this.RemoveBusinessError(this.possibleOutcomeError);
        }

        if (commOutcomePossibleListData.length > 0) {
          this.commOutcomePossibleList = this.rowDeselectDossierStatusPossibleout(commOutcomePossibleListData);
          this.commOutcomePossibleList[this.commOutcomePossibleList?.length - 1].rowSelected = true;
          const lastIndex = this.commOutcomePossibleList.findIndex((x: DossierStatus2PossibleOutcomeDto) => x.rowSelected);

          this.commOutcomePossibleData = this.commOutcomePossibleList[lastIndex];
          this.assigningSourceTarget(lastIndex);
          //this.highlightFollowUpData = this.followUpEventConfigList[lastIndex];
        } else {
          this.commOutcomePossibleList = [];
          this.commOutcomePossibleData = new DossierStatus2PossibleOutcomeDto();
          setTimeout(() => {
            this.hideDossierPossibleOutCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateDossierStatusPossibleOutcomeExists(this.commOutcomePossibleList)) {
        this.throwBusinessError(this.dossierpossibleoutcomeBusinessError);
      } else {
        this.throwPossibleOutcomeError();
        if (this.emptyPossibleOutcomeExist()) {
          this.throwBusinessError(this.possibleOutcomeError);
        }
      }
    }
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.commOutcomePossibleList[index].outcomeList.forEach(outcome => {
      const filter = this.communicationOutcomeList.findIndex(y => {
        return outcome.codeId == y.codeId;
      });
      if (filter != -1) {
        this.targetList.push(this.communicationOutcomeList[filter]);
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.communicationOutcomeList];
    this.target.forEach(outcome => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == outcome.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];
  }

  changeTarget(event: CommunicationOutcomeDto[]) {
    if (event != undefined) {
      const SelectedIndex = this.commOutcomePossibleList.findIndex(get => {
        return get.rowSelected == true;
      });

      if (SelectedIndex >= 0) {
        this.RemoveBusinessError(this.possibleOutcomeError);
        if (this.commOutcomePossibleList[SelectedIndex].state == DtoState.Unknown) {
          this.commOutcomePossibleList[SelectedIndex].state = DtoState.Dirty;
        }
        const outcomeList: CommunicationOutcomeDto[] = [];
        event.forEach(x => {
          const dupIndex = outcomeList.findIndex(y => {
            return y.codeId == x.codeId;
          });
          if (dupIndex == -1) {
            outcomeList.push(x);
          }
        });
        this.commOutcomePossibleList[SelectedIndex].outcomeList = outcomeList;
      }
    }
  }

  ondossierStatusPossibeChange(event: any) {
    const selectedIndex = this.commOutcomePossibleList.findIndex((x: DossierStatus2PossibleOutcomeDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.commOutcomePossibleList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commOutcomePossibleList[selectedIndex].dossierStatus = updategrid.dossierStatus;
      this.commOutcomePossibleList[selectedIndex].state = updategrid.state;
      this.commOutcomePossibleData.dossierStatus = event.value;
    } else if (event?.value == null) {
      const updateData = this.commOutcomePossibleList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.dossierStatus = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.commOutcomePossibleList[selectedIndex].dossierStatus = null;
      this.commOutcomePossibleList[selectedIndex].state = updategrid.state;
      this.commOutcomePossibleData.dossierStatus = null;
      this.RequiredPossibleOutcomeStatus.externalError = true;
    }
  }

  rowDeselectDossierStatusPossibleout(dossierPhase: DossierStatus2PossibleOutcomeDto[]) {
    const deSelectData = dossierPhase;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: DossierStatus2PossibleOutcomeDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  emptyPossibleOutcomeExist() {
    let isEmpty = false;
    const validateCommPossibleList = this.commOutcomePossibleList;
    for (let i = 0; i < validateCommPossibleList.length; i++) {
      if (validateCommPossibleList[i].outcomeList.length == 0) {
        isEmpty = true;
        break;
      }
    }
    return isEmpty;
  }

  isDuplicateDossierStatusPossibleOutcomeExists(newgridDate: DossierStatus2PossibleOutcomeDto[]) {
    const removeNullDateValue = newgridDate.filter((date: DossierStatus2PossibleOutcomeDto) => date.dossierStatus?.codeId);
    const uniqueValues = [...new Set(removeNullDateValue.map((date: DossierStatus2PossibleOutcomeDto) => date.dossierStatus?.codeId))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  throwPossibleOutcomeError() {
    this.RequiredPossibleOutcomeStatus.externalError = true;
  }

  removePossibleOutcomeError() {
    this.RequiredPossibleOutcomeStatus.externalError = false;
  }

  /*Save Call */
  onSave(
    commDossierStatusList: CommunicationOutcome2DossierStatusDto[],
    commPhaseList: DossierStatus2DossierPhaseDto[],
    commPossibleList: DossierStatus2PossibleOutcomeDto[]
  ) {
    if (this.communicationoutComeform.valid && this.dossierphaseform.valid && this.dossierpossibleform.valid) {
      if (
        !this.isDuplicateCommOutComeExists(commDossierStatusList) &&
        !this.isDuplicateDossierStatusPhaseExists(commPhaseList) &&
        !this.isDuplicateDossierStatusPossibleOutcomeExists(commPossibleList) &&
        !this.emptyPossibleOutcomeExist()
      ) {
        this.RemoveBusinessError(this.dossierstatusBusinessError);
        this.RemoveBusinessError(this.dossierPhaseBusinesError);
        this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
        this.RemoveBusinessError(this.possibleOutcomeError);
        this.removeDossierPhaseError();
        this.removeDossierStatusError();
        this.removePossibleOutcomeError();

        commDossierStatusList.map(dossierstsData => {
          if (dossierstsData.state != 0) {
            this.deletedDossierStatusArray.push({ ...dossierstsData });
          }
        });

        commPhaseList.map(phaseData => {
          if (phaseData.state != 0) {
            this.deletedDossierPhaseStatusArray.push({ ...phaseData });
          }
        });

        commPossibleList.map(possibleData => {
          if (possibleData.state != 0) {
            this.deletedDossierPossibleArray.push({ ...possibleData });
          }
        });

        const saveDossierOutComeList: CommunicationOutcome2DossierStatusListDto = new CommunicationOutcome2DossierStatusListDto();
        saveDossierOutComeList.communicationOutcome2DossierStatusList = this.deletedDossierStatusArray;
        saveDossierOutComeList.DossierStatus2DossierPhaseList = this.deletedDossierPhaseStatusArray;
        saveDossierOutComeList.DossierStatus2PossibleOutcomeList = this.deletedDossierPossibleArray;


        this.commOutcomeService.saveCommunicationOutcome2DossierStatusList(saveDossierOutComeList).subscribe(
          data => {
            this.spinnerService.setIsLoading(false);

            this.deletedDossierPossibleArray = [];
            this.deletedDossierStatusArray = [];
            this.deletedDossierPhaseStatusArray = [];

            if (data) {
              this.commOutcomeService.getCommunicationOutcome2DossierStatusList().subscribe(
                (responseData: any) => {
                  this.spinnerService.setIsLoading(false);
                  this.deletedDossierPossibleArray = [];
                  this.deletedDossierStatusArray = [];
                  this.deletedDossierPhaseStatusArray = [];

                  const UpdateDossierStatus = responseData.communicationOutcome2DossierStatusList.map(
                    (data: CommunicationOutcome2DossierStatusDto) => {
                      return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
                    }
                  );

                  if (UpdateDossierStatus.length > 0) {
                    this.commDossierStatusList = UpdateDossierStatus;
                    const selectedDossierIndex = this.commDossierStatusList.findIndex(
                      x => x.outcome?.codeId == this.commDossierStatusData.outcome?.codeId
                    );
                    this.commDossierStatusList[selectedDossierIndex].rowSelected = true;
                    this.commDossierStatusData = this.commDossierStatusList[selectedDossierIndex];
                  }else{
                    this.hideDossierStatusCard = false;
                  }

                  /*Dossier Phase */
                  const UpdateDossierPhase = responseData.dossierStatus2DossierPhaseList.map((data: DossierStatus2DossierPhaseDto) => {
                    return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
                  });

                  if (UpdateDossierPhase.length > 0) {
                    this.commDossierPhaseList = UpdateDossierPhase;
                    const selectedPhaseIndex = this.commDossierPhaseList.findIndex(
                      x => x.dossierStatus?.codeId == this.commDossierPhaseData.dossierStatus?.codeId
                    );
                    this.commDossierPhaseList[selectedPhaseIndex].rowSelected = true;
                    this.commDossierPhaseData = this.commDossierPhaseList[selectedPhaseIndex];
                  }else{
                    this.hideDossierPhaseCard = false;
                  }

                  /*DossierPossibleOutcome */
                  const UpdatePossibleOutcome = responseData.dossierStatus2PossibleOutcomeList.map(
                    (data: DossierStatus2PossibleOutcomeDto) => {
                      return { ...data, rowSelected: false, randomNumber: this.generateRandomNumber() };
                    }
                  );

                  if (UpdatePossibleOutcome.length > 0) {
                    this.commOutcomePossibleList = UpdatePossibleOutcome;
                    const selectedPossibleIndex = this.commOutcomePossibleList.findIndex(
                      x => x.dossierStatus?.codeId == this.commOutcomePossibleData.dossierStatus?.codeId
                    );
                    this.commOutcomePossibleList[selectedPossibleIndex].rowSelected = true;
                    this.commOutcomePossibleData = this.commOutcomePossibleList[selectedPossibleIndex];
                    this.assigningSourceTarget(selectedPossibleIndex);
                  }else{
                    this.hideDossierPossibleOutCard = false;
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.deletedDossierPossibleArray = [];
                  this.deletedDossierStatusArray = [];
                  this.deletedDossierPhaseStatusArray = [];

                  this.spinnerService.setIsLoading(false);
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

            this.deletedDossierPossibleArray = [];
            this.deletedDossierStatusArray = [];
            this.deletedDossierPhaseStatusArray = [];

            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );
      } else {
        if (this.isDuplicateCommOutComeExists(commDossierStatusList)) {
          this.throwBusinessError(this.dossierstatusBusinessError);
        } else if (this.isDuplicateDossierStatusPhaseExists(commPhaseList)) {
          this.throwBusinessError(this.dossierPhaseBusinesError);
        } else if (this.emptyPossibleOutcomeExist()) {
          this.throwBusinessError(this.possibleOutcomeError);
        } else {
          this.throwBusinessError(this.dossierpossibleoutcomeBusinessError);
        }
      }
    } else {
      if (this.dossierphaseform.invalid) {
        this.throwDossierPhaseError();
      } else if (this.dossierpossibleform.invalid) {
        this.throwPossibleOutcomeError();
      } else {
        this.throwDossierStatusError();
      }
    }
  }

  /*Common Methods */
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

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onClose() {
    const isChangedDossierStatusExist = this.commDossierStatusList.findIndex(x => x.state == 3 || x.state == 1);
    const isChangedDossierPhaseList = this.commDossierPhaseList.findIndex(x => x.state == 3 || x.state == 1);
    const isChangedDossierPossibleList = this.commOutcomePossibleList.findIndex(x => x.state == 3 || x.state == 1);

    if (
      isChangedDossierStatusExist >= 0 ||
      isChangedDossierPhaseList ||
      isChangedDossierPossibleList ||
      this.deletedDossierPossibleArray.length > 0 ||
      this.deletedDossierStatusArray.length > 0 ||
      this.deletedDossierPhaseStatusArray.length > 0
    ) {
      this.showDialog = true;
    } else {
      //this.typeMappingform.resetForm();
      this.RemoveBusinessError(this.dossierstatusBusinessError);
      this.RemoveBusinessError(this.dossierPhaseBusinesError);
      this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
      this.RemoveBusinessError(this.possibleOutcomeError);
      this.removeDossierPhaseError();
      this.removeDossierStatusError();
      this.removePossibleOutcomeError();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(
    commDossierStatusList: CommunicationOutcome2DossierStatusDto[],
    commPhaseList: DossierStatus2DossierPhaseDto[],
    commPossibleList: DossierStatus2PossibleOutcomeDto[]
  ) {
    this.showDialog = false;

    if (this.communicationoutComeform.valid && this.dossierphaseform.valid && this.dossierpossibleform.valid) {
      if (
        !this.isDuplicateCommOutComeExists(commDossierStatusList) &&
        !this.isDuplicateDossierStatusPhaseExists(commPhaseList) &&
        !this.isDuplicateDossierStatusPossibleOutcomeExists(commPossibleList) &&
        !this.emptyPossibleOutcomeExist()
      ) {
        this.onSave(commDossierStatusList, commPhaseList, commPossibleList);

        this.RemoveBusinessError(this.dossierstatusBusinessError);
        this.RemoveBusinessError(this.dossierPhaseBusinesError);
        this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
        this.RemoveBusinessError(this.possibleOutcomeError);
        this.removeDossierPhaseError();
        this.removeDossierStatusError();
        this.removePossibleOutcomeError();
        window.location.assign(this.navigateURL);
      } else {
        if (this.isDuplicateCommOutComeExists(commDossierStatusList)) {
          this.throwBusinessError(this.dossierstatusBusinessError);
        } else if (this.isDuplicateDossierStatusPhaseExists(commPhaseList)) {
          this.throwBusinessError(this.dossierPhaseBusinesError);
        } else if (this.emptyPossibleOutcomeExist()) {
          this.throwBusinessError(this.possibleOutcomeError);
        } else {
          this.throwBusinessError(this.dossierpossibleoutcomeBusinessError);
        }
      }
    } else {
      if (this.dossierphaseform.invalid) {
        this.throwDossierPhaseError();
      } else if (this.dossierpossibleform.invalid) {
        this.throwPossibleOutcomeError();
      } else {
        this.throwDossierStatusError();
      }
    }
  }

  onDialogNo() {
    this.showDialog = false;
    // this.typeMappingform.resetForm();
    this.RemoveBusinessError(this.dossierstatusBusinessError);
    this.RemoveBusinessError(this.dossierPhaseBusinesError);
    this.RemoveBusinessError(this.dossierpossibleoutcomeBusinessError);
    this.RemoveBusinessError(this.possibleOutcomeError);
    this.removeDossierPhaseError();
    this.removeDossierStatusError();
    this.removePossibleOutcomeError();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }
}

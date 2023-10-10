import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDto, FluidButtonConfig, FluidControlsBaseService, fluidValidationService, FluidDropDownConfig } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { DtoState, GetTxEl2BalMoveTypeMappingListDto, TxEl2BalMovTypeMappingDto } from './model/tx-el2-bal-mov-type-mapping.model';
import { TxEl2BalMovTypeService } from './service/tx-el2-bal-mov-type.service';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mracs-runningaccount-tx-el2-bal-mov-type-mapping',
  templateUrl: './runningaccount-tx-el2-bal-mov-type-mapping.component.html',
  styleUrls: ['./runningaccount-tx-el2-bal-mov-type-mapping.component.scss']
})

export class RunningaccountTxEl2BalMovTypeMappingComponent implements OnInit {

  @ViewChild("txEl2BalMovTypeform", { static: true }) txEl2BalMovTypeform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;

  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TxElTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public BalanceMovementTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  placeholder = 'select';
  internaldrop!: any;
  TxelType!: any;
  BalancemovementType!: any;
  typeMappingHeader!: any[];
  txEl2BalMovTypeList!: GetTxEl2BalMoveTypeMappingListDto
  txEl2MovTypeDetail!: TxEl2BalMovTypeMappingDto
  saveTxEl2BalMovTypeList: TxEl2BalMovTypeMappingDto[] = [];
  showDetails!: boolean
  editable!: boolean
  exceptionBox!: boolean
  errorCode!: string
  showDialog!: boolean
  navigateUrl!:string
  validationHeader = this.translate.instant('runningAccount.validation.validationHeader');

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public route: ActivatedRoute,
    private spinnerservice: SpinnerService, private service: TxEl2BalMovTypeService, private fluidValidation: fluidValidationService,
    private commonService: ConfigContextService, public router: Router  ) {
    this.editable = false;
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.route.data.subscribe((res:any) => {
      this.spinnerservice.setIsLoading(false);
      this.txEl2BalMovTypeList = res.txEl2BalMovTypeData;
      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.forEach(x => {
        const txelIndex = this.txEl2BalMovTypeList.txElTypeList.findIndex(y => y.codeId == x.txElTypeCd);
        const balMoveIndex = this.txEl2BalMovTypeList.balanceMovementTypeList.findIndex(y => y.codeId == x.balanceMovementTypeCd);
        x.txElType = this.txEl2BalMovTypeList.txElTypeList[txelIndex];
        x.balanceMovementType = this.txEl2BalMovTypeList.balanceMovementTypeList[balMoveIndex];
      })

      if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length > 0) {
        this.showDetails = true;
        this.settingIsSelectedFalse();
        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[0].isSelected = true;
        this.txEl2MovTypeDetail = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[0];

        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.forEach(x => {
          x.txElTypeList = this.txEl2BalMovTypeList.txElTypeList;
        })
      }
    })

    this.typeMappingHeader = [
      { header: this.translate.instant('runningAccount.type-mapping.tabel.TxelType'), field: 'txElType.caption', width: '47%' },
      { header: this.translate.instant('runningAccount.type-mapping.tabel.BalancemovementType'), field: 'balanceMovementType.caption', width: '48%' },
      { header:'', field: 'delete', fieldType: 'deleteButton', width: '5%' }];
  }

  onSave(txEl2BalMovTypeData: TxEl2BalMovTypeMappingDto[]) {
    if (this.txEl2BalMovTypeform.valid) {

      txEl2BalMovTypeData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveTxEl2BalMovTypeList.push({ ...x });
        }
      })

      this.spinnerservice.setIsLoading(true);
      this.service.saveTxEl2BalMovType(this.saveTxEl2BalMovTypeList).subscribe(res => {
        this.spinnerservice.setIsLoading(false);

        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList = res as TxEl2BalMovTypeMappingDto[];

        if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length > 0) {

          this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.forEach(x => {
            x.state = DtoState.Unknown;
            const txelIndex = this.txEl2BalMovTypeList.txElTypeList.findIndex(y => y.codeId == x.txElTypeCd);
            const balMoveIndex = this.txEl2BalMovTypeList.balanceMovementTypeList.findIndex(y => y.codeId == x.balanceMovementTypeCd);
            x.txElType = this.txEl2BalMovTypeList.txElTypeList[txelIndex];
            x.balanceMovementType = this.txEl2BalMovTypeList.balanceMovementTypeList[balMoveIndex];
          })

          this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.forEach(x => {
            x.txElTypeList = this.txEl2BalMovTypeList.txElTypeList;
          })

          this.settingIsSelectedFalse();

          const index = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.findIndex(x => x.txElTypeCd == this.txEl2MovTypeDetail.txElTypeCd);
          this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].isSelected = true;
          this.txEl2MovTypeDetail = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index];

          this.editable = false;
        }
        this.saveTxEl2BalMovTypeList = [];
      }, err => {
        this.spinnerservice.setIsLoading(false);
        this.exceptionBox = true;
        this.saveTxEl2BalMovTypeList = [];
        if (err?.error?.errorCode) {
          this.errorCode = err?.error?.errorCode;
        }
        else {
          this.errorCode = 'InternalServiceFault';
        }
      })
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  dataSelection(event: TxEl2BalMovTypeMappingDto) {
    if (this.txEl2BalMovTypeform.valid) {
      this.settingIsSelectedFalse();
      this.txEl2MovTypeDetail = event;
      this.editable = false;
      this.txEl2MovTypeDetail.isSelected = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addtxEl2MovType() {
    if (this.txEl2BalMovTypeform.valid) {

      this.settingExternalErrorFalse();

      this.settingIsSelectedFalse();
      this.showDetails = true;
      const newRow = new TxEl2BalMovTypeMappingDto;
      newRow.isSelected = true;
      const newuserList = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList;
      newuserList.push({ ...newRow });
      this.txEl2MovTypeDetail = new TxEl2BalMovTypeMappingDto();
      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList = [...newuserList];

      this.editable = true;
      if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length > 0) {
        this.txEl2MovTypeDetail.txElTypeList = this.txEl2BalMovTypeList.txElTypeList.filter(val => {
          return !this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.find(x => {
            return x.txElTypeCd == val.codeId;
          })
        })
      }
      this.txEl2MovTypeDetail.state = DtoState.Created;
      this.txEl2MovTypeDetail.pKey = 0;
      this.txEl2MovTypeDetail.isSelected = true;

      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length - 1] = this.txEl2MovTypeDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRowDelete(event: TxEl2BalMovTypeMappingDto, gridData: TxEl2BalMovTypeMappingDto[]) {
    if (this.txEl2BalMovTypeform.valid || event.txElType == null || event.balanceMovementType == null) {

      this.editable = false;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveTxEl2BalMovTypeList.push({ ...event });
      }

      gridData.splice(deletedata, 1);
      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList = [...gridData]
      if (gridData.length > 0) {
        this.settingIsSelectedFalse();
        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length - 1].isSelected = true;
        this.txEl2MovTypeDetail = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.length - 1];
      }
      else {
        this.settingExternalErrorFalse()
        setTimeout(() => {
          this.showDetails = false;
        }, 2)
      }
    }
  }

  settingIsSelectedFalse() {
    this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.forEach(x => x.isSelected = false);
  }

  onChangeTxElType(event: any) {
    const index = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.findIndex(x => x.isSelected);
    if (index != -1) {

      if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].state != DtoState.Created) {
        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].state = DtoState.Dirty;
      }

      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].txElType = event?.value;
      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].txElTypeCd = event?.value?.codeId;
    }
    this.txEl2MovTypeDetail.txElType = event?.value;
    this.txEl2MovTypeDetail.txElTypeCd = event?.value?.codeId;
    if (event?.value == null) {
      this.TxElTypeDropdownConfig.externalError = true;
    }
  }

  onChangeBalanceMovementType(event: any) {
    const index = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.findIndex(x => x.isSelected);
    if (index != -1) {

      if (this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].state != DtoState.Created) {
        this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].state = DtoState.Dirty;
      }

      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].balanceMovementType = event?.value;
      this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList[index].balanceMovementTypeCd = event?.value?.codeId;
    }
    this.txEl2MovTypeDetail.balanceMovementType = event?.value;
    this.txEl2MovTypeDetail.balanceMovementTypeCd = event?.value?.codeId;
    if (event?.value == null) {
      this.BalanceMovementTypeDropdownConfig.externalError = true;
    }
  }

  settingExternalErrorTrue() {
    this.TxElTypeDropdownConfig.externalError = true;
    this.BalanceMovementTypeDropdownConfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.TxElTypeDropdownConfig.externalError = false;
    this.BalanceMovementTypeDropdownConfig.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.txEl2BalMovTypeList.txEl2BalMovTypeMappingList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveTxEl2BalMovTypeList.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(txEl2BalMovtypeList: TxEl2BalMovTypeMappingDto[]) {
    this.showDialog = false;
    this.onSave(txEl2BalMovtypeList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.settingExternalErrorFalse()

    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onClickCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const txElTypeError = new ErrorDto;
    txElTypeError.validation = "required";
    txElTypeError.isModelError = true;
    txElTypeError.validationMessage = this.translate.instant('runningAccount.type-mapping.validation.TxElType');
    this.TxElTypeDropdownConfig.required = true;
    this.TxElTypeDropdownConfig.Errors = [txElTypeError];

    const balanceMovementTypeError = new ErrorDto;
    balanceMovementTypeError.validation = "required";
    balanceMovementTypeError.isModelError = true;
    balanceMovementTypeError.validationMessage = this.translate.instant('runningAccount.type-mapping.validation.BalMovType');
    this.BalanceMovementTypeDropdownConfig.required = true;
    this.BalanceMovementTypeDropdownConfig.Errors = [balanceMovementTypeError];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FluidButtonConfig, FluidControlsBaseService, ErrorDto, FluidDropDownConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { BalMovementType2DistTypeDto, DtoState, GetBalMovementType2DistTypeListDto } from './models/bal-mov2-dis-type.model';
import { BalMov2DisTypeService } from './service/bal-mov2-dis-type.service';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mracs-runningaccount-balancemovementtype2distributiontype',
  templateUrl: './runningaccount-balancemovementtype2distributiontype.component.html',
  styleUrls: ['./runningaccount-balancemovementtype2distributiontype.component.scss']
})
  
export class RunningaccountBalancemovementtype2distributiontypeComponent implements OnInit {
  @ViewChild("balMov2DisTypeform", { static: true }) balMov2DisTypeform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public BalanceMovementTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public DistributionTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  balMov2DisTypeList!: GetBalMovementType2DistTypeListDto
  balMov2DisTypeDetail!: BalMovementType2DistTypeDto
  showDetails!: boolean
  showDialog!: boolean
  editable!: boolean
  saveBalMov2DisTypeList: BalMovementType2DistTypeDto[] = []
  exceptionBox!: boolean;
  placeholder = 'select';
  distributedHeader!: any[];
  navigateUrl!: string
  errorCode!:string
  validationHeader = this.translate.instant('runningAccount.validation.validationHeader');

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public route: ActivatedRoute,
    private spinnerservice: SpinnerService, private service: BalMov2DisTypeService, private fluidValidation: fluidValidationService,
    private commonService: ConfigContextService, public router: Router) {
    this.editable = false;
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {

    this.buildConfiguration()

    this.route.data.subscribe((res:any) => {
      this.spinnerservice.setIsLoading(false);
      this.balMov2DisTypeList = res.balMov2DisTypeData;
      this.balMov2DisTypeList.balanceMovementType2DistTypeList.forEach(x => {
        const balMovIndex = this.balMov2DisTypeList.balanceMovementTypeList.findIndex(y => y.codeId == x.balanceMovementTypeCd);
        const disTypeIndex = this.balMov2DisTypeList.distributionTypeList.findIndex(y => y.codeId == x.distributionTypeCd);
        x.balanceMovementType = this.balMov2DisTypeList.balanceMovementTypeList[balMovIndex];
        x.distributionType = this.balMov2DisTypeList.distributionTypeList[disTypeIndex];
      })

      if (this.balMov2DisTypeList.balanceMovementType2DistTypeList.length > 0) {
        this.showDetails = true;
        this.settingIsSelectedFalse();
        this.balMov2DisTypeList.balanceMovementType2DistTypeList[0].isSelected = true;
        this.balMov2DisTypeDetail = this.balMov2DisTypeList.balanceMovementType2DistTypeList[0];

        this.balMov2DisTypeList.balanceMovementType2DistTypeList.forEach(x => {
          x.balanceMovementTypeList = this.balMov2DisTypeList.balanceMovementTypeList;
        })
      }
    })
    this.distributedHeader = [
      { header: this.translate.instant('runningAccount.distributiontype.tabel.BalancemovementType'), field: 'balanceMovementType.caption', width: '47%' },
      { header: this.translate.instant('runningAccount.distributiontype.tabel.DistributionType'), field: 'distributionType.caption', width: '48%' },
      { header: '', field: 'delete', fieldType:'deleteButton', width: '5%' }];
  }

  onSave(balMov2DisTypeData: BalMovementType2DistTypeDto[]) {
    if (this.balMov2DisTypeform.valid) {

      balMov2DisTypeData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          this.saveBalMov2DisTypeList.push({ ...x });
        }
      })

      this.spinnerservice.setIsLoading(true);
      this.service.saveBalMov2DisType(this.saveBalMov2DisTypeList).subscribe(res => {
        this.spinnerservice.setIsLoading(false);

        this.balMov2DisTypeList.balanceMovementType2DistTypeList = res as BalMovementType2DistTypeDto[];

        if (this.balMov2DisTypeList.balanceMovementType2DistTypeList.length > 0) {

          this.balMov2DisTypeList.balanceMovementType2DistTypeList.forEach(x => {
            x.state = DtoState.Unknown;
            const balMovIndex = this.balMov2DisTypeList.balanceMovementTypeList.findIndex(y => y.codeId == x.balanceMovementTypeCd);
            const disIndex = this.balMov2DisTypeList.distributionTypeList.findIndex(y => y.codeId == x.distributionTypeCd);
            x.balanceMovementType = this.balMov2DisTypeList.balanceMovementTypeList[balMovIndex];
            x.distributionType = this.balMov2DisTypeList.distributionTypeList[disIndex];
          })

          this.balMov2DisTypeList.balanceMovementType2DistTypeList.forEach(x => {
            x.balanceMovementTypeList = this.balMov2DisTypeList.balanceMovementTypeList;
          })

          this.settingIsSelectedFalse();

          const index = this.balMov2DisTypeList.balanceMovementType2DistTypeList.findIndex(x => x.balanceMovementTypeCd == this.balMov2DisTypeDetail.balanceMovementTypeCd);
          this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].isSelected = true;
          this.balMov2DisTypeDetail = this.balMov2DisTypeList.balanceMovementType2DistTypeList[index];

          this.editable = false;
        }
        this.saveBalMov2DisTypeList = [];
      }, err => {
        this.spinnerservice.setIsLoading(false);
        this.exceptionBox = true;
        this.saveBalMov2DisTypeList = [];
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

  dataSelection(event: BalMovementType2DistTypeDto) {
    if (this.balMov2DisTypeform.valid) {
      this.settingIsSelectedFalse();
      this.balMov2DisTypeDetail = event;
      this.editable = false;
      this.balMov2DisTypeDetail.isSelected = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addBalMov2DisType() {
    if (this.balMov2DisTypeform.valid) {

      this.settingExternalErrorFalse();

      this.settingIsSelectedFalse();
      this.showDetails = true;
      const newRow = new BalMovementType2DistTypeDto;
      newRow.isSelected = true;
      const newuserList = this.balMov2DisTypeList.balanceMovementType2DistTypeList;
      newuserList.push({ ...newRow });
      this.balMov2DisTypeDetail = new BalMovementType2DistTypeDto();
      this.balMov2DisTypeList.balanceMovementType2DistTypeList = [...newuserList];

      this.editable = true;
      if (this.balMov2DisTypeList.balanceMovementType2DistTypeList.length > 0) {
        this.balMov2DisTypeDetail.balanceMovementTypeList = this.balMov2DisTypeList.balanceMovementTypeList.filter(val => {
          return !this.balMov2DisTypeList.balanceMovementType2DistTypeList.find(x => {
            return x.balanceMovementTypeCd == val.codeId;
          })
        })
      }
      this.balMov2DisTypeDetail.state = DtoState.Created;
      this.balMov2DisTypeDetail.pKey = 0;
      this.balMov2DisTypeDetail.isSelected = true;

      this.balMov2DisTypeList.balanceMovementType2DistTypeList[this.balMov2DisTypeList.balanceMovementType2DistTypeList.length - 1] = this.balMov2DisTypeDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onRowDelete(event: BalMovementType2DistTypeDto, gridData: BalMovementType2DistTypeDto[]) {
    if (this.balMov2DisTypeform.valid || event.balanceMovementType == null || event.distributionType == null) {

      this.editable = false;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.balMov2DisTypeList.balanceMovementType2DistTypeList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveBalMov2DisTypeList.push({ ...event });
      }

      gridData.splice(deletedata, 1);
      this.balMov2DisTypeList.balanceMovementType2DistTypeList = [...gridData]
      if (gridData.length > 0) {
        this.settingIsSelectedFalse();
        this.balMov2DisTypeList.balanceMovementType2DistTypeList[this.balMov2DisTypeList.balanceMovementType2DistTypeList.length - 1].isSelected = true;
        this.balMov2DisTypeDetail = this.balMov2DisTypeList.balanceMovementType2DistTypeList[this.balMov2DisTypeList.balanceMovementType2DistTypeList.length - 1];
      }
      else {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showDetails = false;
        }, 2)
      }
    }
  }

  settingIsSelectedFalse() {
    this.balMov2DisTypeList.balanceMovementType2DistTypeList.forEach(x => x.isSelected = false)
  }

  onChangeBalanceMovement(event: any) {
    const index = this.balMov2DisTypeList.balanceMovementType2DistTypeList.findIndex(x => x.isSelected);
    if (index != -1) {

      if (this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].state != DtoState.Created) {
        this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].state = DtoState.Dirty;
      }

      this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].balanceMovementType = event?.value;
      this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].balanceMovementTypeCd = event?.value?.codeId;
    }
    this.balMov2DisTypeDetail.balanceMovementType = event?.value;
    this.balMov2DisTypeDetail.balanceMovementTypeCd = event?.value?.codeId;
    if (event?.value == null) {
      this.BalanceMovementTypeDropdownConfig.externalError = true;
    }
  }

  onChangeDistribution(event: any) {
    const index = this.balMov2DisTypeList.balanceMovementType2DistTypeList.findIndex(x => x.isSelected);
    if (index != -1) {

      if (this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].state != DtoState.Created) {
        this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].state = DtoState.Dirty;
      }

      this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].distributionType = event?.value;
      this.balMov2DisTypeList.balanceMovementType2DistTypeList[index].distributionTypeCd = event?.value.codeId;
    }
    this.balMov2DisTypeDetail.distributionType = event?.value;
    this.balMov2DisTypeDetail.distributionTypeCd = event?.value?.codeId;
    if (event?.value == null) {
      this.DistributionTypeDropdownConfig.externalError = true;
    }
  }

  settingExternalErrorTrue() {
    this.DistributionTypeDropdownConfig.externalError = true;
    this.BalanceMovementTypeDropdownConfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.DistributionTypeDropdownConfig.externalError = false;
    this.BalanceMovementTypeDropdownConfig.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.balMov2DisTypeList.balanceMovementType2DistTypeList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveBalMov2DisTypeList.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(balMov2DistypeList: BalMovementType2DistTypeDto[]) {
    this.showDialog = false;
    this.onSave(balMov2DistypeList);
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
    const balanceMovementTypeError = new ErrorDto;
    balanceMovementTypeError.validation = "required";
    balanceMovementTypeError.isModelError = true;
    balanceMovementTypeError.validationMessage = this.translate.instant('runningAccount.distributiontype.validation.BalMovType');
    this.BalanceMovementTypeDropdownConfig.required = true;
    this.BalanceMovementTypeDropdownConfig.Errors = [balanceMovementTypeError];

    const distributionTypeTypeError = new ErrorDto;
    distributionTypeTypeError.validation = "required";
    distributionTypeTypeError.isModelError = true;
    distributionTypeTypeError.validationMessage = this.translate.instant('runningAccount.distributiontype.validation.DisType');
    this.DistributionTypeDropdownConfig.required = true;
    this.DistributionTypeDropdownConfig.Errors = [distributionTypeTypeError];
  }
}

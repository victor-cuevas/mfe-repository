import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { TranslateService } from '@ngx-translate/core';
import { FeeConfigService } from './Service/fee-config.service';
import { getManageFeeConfigScreenDataResponse } from './Models/getFeeConfig.model';
import { feeConfig } from './Models/feeConfig.model';
import { stateModel } from './Models/state.model';
import { codeTable } from './Models/codeTable.model';
import { txElType } from './Models/txElType.model';
import { manageFeeConfigInitialData } from './Models/manageFeeConfigInitialData.model';
import { txElTypeConversionConfig } from './Models/txELTypeConversionConfig.model';

@Component({
  selector: 'mfcs-manage-fee-config',
  templateUrl: './manage-fee-config.component.html',
  styleUrls: ['./manage-fee-config.component.scss']
})
export class ManageFeeConfigComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public feeTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public chargingOfDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedChargingOfDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public allocationToDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedAllocationToDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public bonusAllocationToDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedBonusAllocationToDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public lossOnDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedLossOnDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public collectionsBookingOfDueDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedCollectionsDueDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public accountingWriteOffOnDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedAccountingWriteOffOnDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public remissionOfNonPaidDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public reversedRemissionOfNonPaidDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public transferInOnDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public increaseOfDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public decreaseOfDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public initialBookingDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  

  placeholder = 'select';
  getFeeConfig!: getManageFeeConfigScreenDataResponse;
  index: any;
  feeConfigCard!: feeConfig;
  codeTableFeeConfig: codeTable[] = [];
  feeTypeHeader!: any[];
  deletedRecords: feeConfig[]=[]
  Header = this.translate.instant('financial.validations.Header');
  show!: boolean;
  isErrors!: boolean;
  exceptionBox!: boolean;
  navigateUrl!: string;
  notHide!: boolean;
  errorCode!: string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public feeConfigService: FeeConfigService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl
  }

  settingFalse() {
    this.getFeeConfig.feeConfigList.forEach(set => {
      set.isEntered = false;
    })
  }

  changeChargingof(event:any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.chargingOf = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.chargingOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.chargingOf = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.chargingOf = null as unknown as txElType;
      this.chargingOfDropdownConfig.externalError = true;
    }
  }

  changeReversedCharging(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedChargingOf = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedChargingOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedChargingOf = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedChargingOf = null as unknown as txElType;
      this.reversedChargingOfDropdownConfig.externalError = true;
    }
  }

  changeAllocation(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.allocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.allocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.allocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.allocationTo = null as unknown as txElType;
      this.allocationToDropdownConfig.externalError = true;
    }
  }

  changeReversedAllocation(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedAllocationTo = null as unknown as txElType;
      this.reversedAllocationToDropdownConfig.externalError = true;
    }
  }

  changeBonusAllocation(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.bonusAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.bonusAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.bonusAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.bonusAllocationTo = null as unknown as txElType;
      this.bonusAllocationToDropdownConfig.externalError = true;
    }
  }

  changeReversedBonusAllocation(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedBonusAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedBonusAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedBonusAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedBonusAllocationTo = null as unknown as txElType;
      this.reversedBonusAllocationToDropdownConfig.externalError = true;
    }
  }

  changeConstruction(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.constructionDepotAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.constructionDepotAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.constructionDepotAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.constructionDepotAllocationTo = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  changeReversedConstruction(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedConstructionDepotAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedConstructionDepotAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedConstructionDepotAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedConstructionDepotAllocationTo = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  changeDueDate(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.dueDateDepotAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.dueDateDepotAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.dueDateDepotAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.dueDateDepotAllocationTo = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  changeReversedDueDate(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedDueDateDepotAllocationTo = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedDueDateDepotAllocationTo = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedDueDateDepotAllocationTo = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedDueDateDepotAllocationTo = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  changeLoss(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.lossOn = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.lossOn = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.lossOn = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.lossOn = null as unknown as txElType;
      this.lossOnDropdownConfig.externalError = true;
    }
  }

  changeReversedLoss(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedLossOn = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedLossOn = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedLossOn = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedLossOn = null as unknown as txElType;
      this.reversedLossOnDropdownConfig.externalError = true;
    }
  }

  changeCollections(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.collectionsBookingOfDue = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.collectionsBookingOfDue = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.collectionsBookingOfDue = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.collectionsBookingOfDue = null as unknown as txElType;
      this.collectionsBookingOfDueDropdownConfig.externalError = true;
    }
  }

  changeReversedCollections(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedCollectionsDue = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedCollectionsDue = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedCollectionsDue = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedCollectionsDue = null as unknown as txElType;
      this.reversedCollectionsDueDropdownConfig.externalError = true;
    }
  }

  changeAccounting(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.accountingWriteOffOn = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.chargingOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.accountingWriteOffOn = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.accountingWriteOffOn = null as unknown as txElType;
      this.accountingWriteOffOnDropdownConfig.externalError = true;
    }
  }

  changeReversedAccounting(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedAccountingWriteOffOn = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedAccountingWriteOffOn = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedAccountingWriteOffOn = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedAccountingWriteOffOn = null as unknown as txElType;
      this.reversedAccountingWriteOffOnDropdownConfig.externalError = true;
    }
  }

  changeRemission(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.remissionOfNonPaid = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.chargingOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.remissionOfNonPaid = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.remissionOfNonPaid = null as unknown as txElType;
      this.remissionOfNonPaidDropdownConfig.externalError = true;
    }
  }

  changeReversedRemission(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedRemissionOfNonPaid = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.reversedRemissionOfNonPaid = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.reversedRemissionOfNonPaid = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.reversedRemissionOfNonPaid = null as unknown as txElType;
      this.reversedRemissionOfNonPaidDropdownConfig.externalError = true;
    }
  }

  changeTransfer(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.transferInOn = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.transferInOn = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.transferInOn = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.transferInOn = null as unknown as txElType;
      this.transferInOnDropdownConfig.externalError = true;
    }
  }

  changeIncrease(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.increaseOf = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.increaseOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.increaseOf = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.increaseOf = null as unknown as txElType;
      this.increaseOfDropdownConfig.externalError = true;
    }
  }

  changeDecrease(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.decreaseOf = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.decreaseOf = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.decreaseOf = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.decreaseOf = null as unknown as txElType;
      this.decreaseOfDropdownConfig.externalError = true;
    }
  }

  changeInitialBooking(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.initialBooking = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.initialBooking = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.initialBooking = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.initialBooking = null as unknown as txElType;
      this.initialBookingDropdownConfig.externalError = true;
    }
  }

  changeCloseDue(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.closeDue = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.closeDue = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.closeDue = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.closeDue = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  changeOpenDue(event: any) {
    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state == stateModel.Unknown) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.state = stateModel.Dirty;

    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.openDue = event?.value;
      this.feeConfigCard.txElTypeConversionConfig.openDue = event?.value;

    }
    else {
      this.getFeeConfig.feeConfigList[this.index].txElTypeConversionConfig.openDue = null as unknown as txElType;
      this.feeConfigCard.txElTypeConversionConfig.openDue = null as unknown as txElType;
      //this.EventNameDropdownConfig.externalError = true;
    }
  }

  addRow() {
    if (this.userDetailsform.valid) {

      this.codeTableFeeConfig = this.getFeeConfig.manageFeeConfigInitialData.feeTypeList.filter(val => {
        return !this.getFeeConfig.feeConfigList.find(x => {
          if (!x.isDelete) {
            return x.feeType?.codeId == val.codeId;
          }
          return false;

        });
      })
      this.settingFalse();
    const feeConfigObj = new feeConfig();
    feeConfigObj.txElTypeConversionConfig = { ... new txElTypeConversionConfig() }
      feeConfigObj.state = stateModel.Created;
      feeConfigObj.pKey = 0;
      feeConfigObj.canValidate = false;
      feeConfigObj.isRead = false;
      feeConfigObj.isEntered = true;
      feeConfigObj.isDelete = false;
      feeConfigObj.feeConfigListDropdownDisable = false;
      feeConfigObj.rowVersion = 0;
      feeConfigObj.feeTypeList = this.codeTableFeeConfig;
      const newlist = this.getFeeConfig.feeConfigList;
      newlist.push({ ...feeConfigObj });
      this.getFeeConfig.feeConfigList = [...newlist];
     this.feeConfigCard = new feeConfig();
    this.feeConfigCard = this.getFeeConfig.feeConfigList[this.getFeeConfig.feeConfigList.length - 1]
    this.notHide = true;
      this.setExternalErrorFalse();
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  clickFeeConfigList(dataselected: feeConfig) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

          this.settingFalse();
          this.index = this.getFeeConfig.feeConfigList.findIndex(item => {
            return item == dataselected
          })
        this.getFeeConfig.feeConfigList[this.index].isEntered = true;
          this.feeConfigCard = dataselected;
        
      }
      else {
        
          this.setExternalErrorTrue();

      }
    }
   
  }

  changeFeeConfigList(event:any, index:number) {

    this.index = this.getFeeConfig.feeConfigList.findIndex(get => {
      return get.isEntered == true;
    })
    if (this.getFeeConfig.feeConfigList[this.index].state != stateModel.Created) {
      this.getFeeConfig.feeConfigList[this.index].state = stateModel.Dirty;
    }

    if (event?.value != null) {

      this.getFeeConfig.feeConfigList[this.index].feeType = event?.value;
      this.feeConfigCard.feeType = event?.value;
      this.getFeeConfig.feeConfigList[this.index].feeConfigListDropdownDisable = true;
    }
    else {
      this.getFeeConfig.feeConfigList[this.index].feeType = null as unknown as codeTable;
      this.feeConfigCard.feeType = null as unknown as codeTable;
      this.feeTypeDropdownConfig.externalError = true;
    }
  }

  deleteFeeConfigList(event: feeConfig, griddata: feeConfig[]) {
    if (this.userDetailsform.valid || ((event.feeType == null || event.txElTypeConversionConfig?.accountingWriteOffOn == null || event.txElTypeConversionConfig?.allocationTo == null ||
      event.txElTypeConversionConfig?.bonusAllocationTo == null || event.txElTypeConversionConfig?.transferInOn == null || event.txElTypeConversionConfig?.remissionOfNonPaid == null || event.txElTypeConversionConfig?.reversedChargingOf == null ||
      event.txElTypeConversionConfig?.chargingOf == null || event.txElTypeConversionConfig?.increaseOf == null || event.txElTypeConversionConfig?.reversedAccountingWriteOffOn == null || event.txElTypeConversionConfig?.reversedCollectionsDue == null ||
      event.txElTypeConversionConfig?.collectionsBookingOfDue == null || event.txElTypeConversionConfig?.initialBooking == null || event.txElTypeConversionConfig?.reversedAllocationTo == null || event.txElTypeConversionConfig?.reversedLossOn == null ||
      event.txElTypeConversionConfig?.decreaseOf == null || event.txElTypeConversionConfig?.lossOn == null || event.txElTypeConversionConfig?.reversedBonusAllocationTo == null || event.txElTypeConversionConfig?.reversedRemissionOfNonPaid == null) && event.isEntered)) {

      this.setExternalErrorFalse();

      const deletedata = griddata.findIndex(data => {
        return data == event;
      });

        event.state = stateModel.Deleted;
      

      event.feeType = <codeTable>{}
      setTimeout(() => {
        this.deleteFeeConfig(deletedata, this.getFeeConfig.feeConfigList);
      }, 100);
     
    }
    else {
      this.setExternalErrorTrue();
    }
  }

  deleteFeeConfig(deletedata: number, feeType: feeConfig[]) {
    feeType[deletedata].isDelete = true;

    this.getFeeConfig.feeConfigList = [...feeType];

    if (this.getFeeConfig.feeConfigList.length == 0) {
      setTimeout(() => {
        this.notHide = false;
      }, 5);
    }
    if (this.getFeeConfig.feeConfigList.length > 0) {

      const firstIndex = this.getFeeConfig.feeConfigList.findIndex(x => {
        return !x.isDelete
      })
      this.settingFalse();
      this.feeConfigCard = this.getFeeConfig.feeConfigList[firstIndex]
      this.getFeeConfig.feeConfigList[firstIndex].isEntered = true;
    }

  }

  onclose() {
    const unsaved = this.getFeeConfig.feeConfigList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty || x.state == stateModel.Deleted
    })
    if (unsaved != -1) {
      this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: feeConfig[]) {
    this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.setExternalErrorFalse();
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

    this.buildConfiguration()

    this.feeTypeHeader = [
      { header: this.translate.instant('financial.manageFee.tabel.FeeType'), field: 'FeeType', width: '93%', property: 'feeConfigdropdownList'},
      { header: this.translate.instant('financial.manageFee.tabel.Delete'), field: 'Delete', width: '8%', property: 'Delete' }
    ];

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
     
        const getResponse = res.feeConfigData
        this.getFeeConfig = { ...getResponse };
        console.log(this.getFeeConfig)
      this.deletedRecords = [...new Array<feeConfig>()];

        this.index = 0;

        if (this.getFeeConfig.feeConfigList.length > 0) {
          this.getFeeConfig.feeConfigList.forEach(x => {
            x.isDelete = false;
            x.isRead = true;
          })

          this.notHide = true;
      
          this.settingFalse();
          this.getFeeConfig.feeConfigList[this.index].isEntered = true;
          this.feeConfigCard = this.getFeeConfig.feeConfigList[this.index];
        }
        
    }
    );

  }


  onSave(GridData: feeConfig[]) {

    if (this.userDetailsform.valid) {
      this.deletedRecords = [...new Array<feeConfig>()];

      this.isErrors = false;
      const saveData = [...GridData];

      saveData.forEach(x => {
        if (!(x.state == stateModel.Deleted && x.isDelete && x.pKey == 0)) {
          this.deletedRecords.push({ ...x })
        }
      })

      this.deletedRecords.forEach(x => {
        if (x.state == stateModel.Deleted) {
          x.feeType = null as unknown as codeTable;
        }
      })
      console.log(this.deletedRecords)

      this.spinnerService.setIsLoading(true);
      this.feeConfigService.PostFeeConfigResponse(this.deletedRecords).subscribe(res => {
        this.spinnerService.setIsLoading(false);

        this.show = false;
        this.deletedRecords = [...new Array<feeConfig>()];

        this.feeConfigService.GetFeeConfigResponse().subscribe(res => {
          this.spinnerService.setIsLoading(false);
          const getResponse = res as getManageFeeConfigScreenDataResponse
          this.getFeeConfig = { ...getResponse };

          this.setExternalErrorFalse();

          if (this.getFeeConfig.feeConfigList.length > 0) {
            this.getFeeConfig.feeConfigList.forEach(x => {
              x.isDelete = false;
              x.isRead = true;
            })
            this.settingFalse();
            this.notHide = true;
            this.index = this.getFeeConfig.feeConfigList.findIndex(i => {
              return (i.feeType?.caption == this.feeConfigCard.feeType?.caption)
            });
            this.getFeeConfig.feeConfigList[this.index].isEntered = true;
            this.feeConfigCard = this.getFeeConfig.feeConfigList[this.index]
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
            this.deletedRecords = [...new Array<feeConfig>()];
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
          this.deletedRecords = [...new Array<feeConfig>()];
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.setExternalErrorTrue();

    }
  }

  setExternalErrorTrue() {
    this.feeTypeDropdownConfig.externalError = true;
    this.chargingOfDropdownConfig.externalError = true;
    this.reversedChargingOfDropdownConfig.externalError = true;
    this.allocationToDropdownConfig.externalError = true;
    this.reversedAllocationToDropdownConfig.externalError = true;
    this.bonusAllocationToDropdownConfig.externalError = true;
    this.reversedBonusAllocationToDropdownConfig.externalError = true;
    this.lossOnDropdownConfig.externalError = true;
    this.reversedLossOnDropdownConfig.externalError = true;
    this.collectionsBookingOfDueDropdownConfig.externalError = true;
    this.reversedCollectionsDueDropdownConfig.externalError = true;
    this.accountingWriteOffOnDropdownConfig.externalError = true;
    this.reversedAccountingWriteOffOnDropdownConfig.externalError = true;
    this.remissionOfNonPaidDropdownConfig.externalError = true;
    this.reversedRemissionOfNonPaidDropdownConfig.externalError = true;
    this.transferInOnDropdownConfig.externalError = true;
    this.increaseOfDropdownConfig.externalError = true;
    this.decreaseOfDropdownConfig.externalError = true;
    this.initialBookingDropdownConfig.externalError = true;

  }

  setExternalErrorFalse() {
    this.feeTypeDropdownConfig.externalError = false;
    this.chargingOfDropdownConfig.externalError = false;
    this.reversedChargingOfDropdownConfig.externalError = false;
    this.allocationToDropdownConfig.externalError = false;
    this.reversedAllocationToDropdownConfig.externalError = false;
    this.bonusAllocationToDropdownConfig.externalError = false;
    this.reversedBonusAllocationToDropdownConfig.externalError = false;
    this.lossOnDropdownConfig.externalError = false;
    this.reversedLossOnDropdownConfig.externalError = false;
    this.collectionsBookingOfDueDropdownConfig.externalError = false;
    this.reversedCollectionsDueDropdownConfig.externalError = false;
    this.accountingWriteOffOnDropdownConfig.externalError = false;
    this.reversedAccountingWriteOffOnDropdownConfig.externalError = false;
    this.remissionOfNonPaidDropdownConfig.externalError = false;
    this.reversedRemissionOfNonPaidDropdownConfig.externalError = false;
    this.transferInOnDropdownConfig.externalError = false;
    this.increaseOfDropdownConfig.externalError = false;
    this.decreaseOfDropdownConfig.externalError = false;
    this.initialBookingDropdownConfig.externalError = false;

  }

 
  buildConfiguration() {
    const ChargingofError = new ErrorDto;
    ChargingofError.validation = "required";
    ChargingofError.isModelError = true;
    ChargingofError.validationMessage = this.translate.instant('financial.manageFee.mandatory.charging') + this.translate.instant('financial.manageFee.mandatory.required');
    this.chargingOfDropdownConfig.Errors = [ChargingofError];
    this.chargingOfDropdownConfig.required = true;

    const ReversedChargingError = new ErrorDto;
    ReversedChargingError.validation = "required";
    ReversedChargingError.isModelError = true;
    ReversedChargingError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedCharging') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedChargingOfDropdownConfig.Errors = [ReversedChargingError];
    this.reversedChargingOfDropdownConfig.required = true;

    const AllocationError = new ErrorDto;
    AllocationError.validation = "required";
    AllocationError.isModelError = true;
    AllocationError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Allocation') + this.translate.instant('financial.manageFee.mandatory.required');
    this.allocationToDropdownConfig.Errors = [AllocationError];
    this.allocationToDropdownConfig.required = true;

    const ReversedAllocationError = new ErrorDto;
    ReversedAllocationError.validation = "required";
    ReversedAllocationError.isModelError = true;
    ReversedAllocationError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedAllocation') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedAllocationToDropdownConfig.Errors = [ReversedAllocationError];
    this.reversedAllocationToDropdownConfig.required = true;

    const BonusAllocationError = new ErrorDto;
    BonusAllocationError.validation = "required";
    BonusAllocationError.isModelError = true;
    BonusAllocationError.validationMessage = this.translate.instant('financial.manageFee.mandatory.BonusAllocation') + this.translate.instant('financial.manageFee.mandatory.required');
    this.bonusAllocationToDropdownConfig.Errors = [BonusAllocationError];
    this.bonusAllocationToDropdownConfig.required = true;

    const ReversedBonusAllocationError = new ErrorDto;
    ReversedBonusAllocationError.validation = "required";
    ReversedBonusAllocationError.isModelError = true;
    ReversedBonusAllocationError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedBonusAllocation') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedBonusAllocationToDropdownConfig.Errors = [ReversedBonusAllocationError];
    this.reversedBonusAllocationToDropdownConfig.required = true;

    const LossError = new ErrorDto;
    LossError.validation = "required";
    LossError.isModelError = true;
    LossError.validationMessage = this.translate.instant('financial.manageFee.mandatory.LossOn') + this.translate.instant('financial.manageFee.mandatory.required');
    this.lossOnDropdownConfig.Errors = [LossError];
    this.lossOnDropdownConfig.required = true;

    const ReversedLossError = new ErrorDto;
    ReversedLossError.validation = "required";
    ReversedLossError.isModelError = true;
    ReversedLossError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedLossOn') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedLossOnDropdownConfig.Errors = [ReversedLossError];
    this.reversedLossOnDropdownConfig.required = true;

    const CollectionsError = new ErrorDto;
    CollectionsError.validation = "required";
    CollectionsError.isModelError = true;
    CollectionsError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Collections') + this.translate.instant('financial.manageFee.mandatory.required');
    this.collectionsBookingOfDueDropdownConfig.Errors = [CollectionsError];
    this.collectionsBookingOfDueDropdownConfig.required = true;

    const ReversedCollectionsError = new ErrorDto;
    ReversedCollectionsError.validation = "required";
    ReversedCollectionsError.isModelError = true;
    ReversedCollectionsError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedCollections') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedCollectionsDueDropdownConfig.Errors = [ReversedCollectionsError];
    this.reversedCollectionsDueDropdownConfig.required = true;

    const AccountingError = new ErrorDto;
    AccountingError.validation = "required";
    AccountingError.isModelError = true;
    AccountingError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Accounting') + this.translate.instant('financial.manageFee.mandatory.required');
    this.accountingWriteOffOnDropdownConfig.Errors = [AccountingError];
    this.accountingWriteOffOnDropdownConfig.required = true;

    const ReversedAccountingError = new ErrorDto;
    ReversedAccountingError.validation = "required";
    ReversedAccountingError.isModelError = true;
    ReversedAccountingError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedAccounting') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedAccountingWriteOffOnDropdownConfig.Errors = [ReversedAccountingError];
    this.reversedAccountingWriteOffOnDropdownConfig.required = true;

    const RemissionError = new ErrorDto;
    RemissionError.validation = "required";
    RemissionError.isModelError = true;
    RemissionError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Remission') + this.translate.instant('financial.manageFee.mandatory.required');
    this.remissionOfNonPaidDropdownConfig.Errors = [RemissionError];
    this.remissionOfNonPaidDropdownConfig.required = true;

    const ReversedRemissionError = new ErrorDto;
    ReversedRemissionError.validation = "required";
    ReversedRemissionError.isModelError = true;
    ReversedRemissionError.validationMessage = this.translate.instant('financial.manageFee.mandatory.ReversedRemission') + this.translate.instant('financial.manageFee.mandatory.required');
    this.reversedRemissionOfNonPaidDropdownConfig.Errors = [ReversedRemissionError];
    this.reversedRemissionOfNonPaidDropdownConfig.required = true;

    const TransferError = new ErrorDto;
    TransferError.validation = "required";
    TransferError.isModelError = true;
    TransferError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Transfer') + this.translate.instant('financial.manageFee.mandatory.required');
    this.transferInOnDropdownConfig.Errors = [TransferError];
    this.transferInOnDropdownConfig.required = true;

    const IncreaseError = new ErrorDto;
    IncreaseError.validation = "required";
    IncreaseError.isModelError = true;
    IncreaseError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Increase') + this.translate.instant('financial.manageFee.mandatory.required');
    this.increaseOfDropdownConfig.Errors = [IncreaseError];
    this.increaseOfDropdownConfig.required = true;

    const DecreaseError = new ErrorDto;
    DecreaseError.validation = "required";
    DecreaseError.isModelError = true;
    DecreaseError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Decrease') + this.translate.instant('financial.manageFee.mandatory.required');
    this.decreaseOfDropdownConfig.Errors = [DecreaseError];
    this.decreaseOfDropdownConfig.required = true;

    const InitialBookingError = new ErrorDto;
    InitialBookingError.validation = "required";
    InitialBookingError.isModelError = true;
    InitialBookingError.validationMessage = this.translate.instant('financial.manageFee.mandatory.Initial') + this.translate.instant('financial.manageFee.mandatory.required');
    this.initialBookingDropdownConfig.Errors = [InitialBookingError];
    this.initialBookingDropdownConfig.required = true;

    const feeTypeError = new ErrorDto;
    feeTypeError.validation = "required";
    feeTypeError.isModelError = true;
    feeTypeError.validationMessage = this.translate.instant('financial.manageFee.mandatory.FeeType') + this.translate.instant('financial.manageFee.mandatory.required');
    this.feeTypeDropdownConfig.Errors = [feeTypeError];
    this.feeTypeDropdownConfig.required = true;
  }
}

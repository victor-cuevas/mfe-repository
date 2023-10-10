import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidButtonConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidTextAreaConfig,
  fluidValidationService
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { PaymentAllocationBlockDto } from './Models/paymentAllocationBlock.model';
import { PaymentAllocationDto } from './Models/paymentAllocationDto.model';
import { SortDueAmountCodeTablesDto } from './Models/sortDueAmount-CodeTablesDto.model';
import { DtoState } from './Models/dtoBase.model';
import { codeTable } from './Models/codeTable.model';
import { PaymentAllocationItemDto } from './Models/paymentAllocationItem.model';
import { TxElTypeDto } from './Models/txElType.model';
import { ManageDueAmountSortingService } from './Services/manage-due-amount-sorting.service';
import { ConfigContextService } from '@close-front-office/shared/config';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';

@Component({
  selector: 'mfcs-manage-due-amount-sorting',
  templateUrl: './manage-due-amount-sorting.component.html',
  styleUrls: ['./manage-due-amount-sorting.component.scss']
})
export class ManageDueAmountSortingComponent implements OnInit {
  @ViewChild('dueAmountform', { static: true }) dueAmountform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TextAreaConfig: FluidTextAreaConfig = this.fluidService.FluidTextAreaConfig;

  public PaymentAllocationDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TimeSortingDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public TxElDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';

  paymentHeader!: any[];

  paymentAllocationList!: PaymentAllocationDto[];
  sortDueAmountCodeTables: SortDueAmountCodeTablesDto = new SortDueAmountCodeTablesDto();
  paymentAllocationData = new PaymentAllocationDto();
  modifiedPaymentAllocationList: PaymentAllocationDto[] = [];

  highlightPaymentData = new PaymentAllocationDto()

  productText = true;
  validationHeader!: string;
  disableAddPayment = false;
  showDialog = false;
  navigateUrl!: string;
  exceptionBox!: boolean;
  errorCode!: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public validationService: fluidValidationService,
    public dueamntService: ManageDueAmountSortingService,
    public commonService: ConfigContextService,
    public spinnerService: SpinnerService
  ) {
    this.validationHeader = this.translate.instant('financial.validations.Header');
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);

      this.sortDueAmountCodeTables.creditStatus = data.DueAmntSortingData.sortDueAmountCodeTables.creditStatus;
      this.sortDueAmountCodeTables.paymentAllocationTypes = data.DueAmntSortingData.sortDueAmountCodeTables.paymentAllocationTypes;
      this.sortDueAmountCodeTables.timingSortings = data.DueAmntSortingData.sortDueAmountCodeTables.timingSortings;
      this.sortDueAmountCodeTables.txElTypes = data.DueAmntSortingData.sortDueAmountCodeTables.txElTypes;

      const UpdateDueAmount = data.DueAmntSortingData.paymentAllocations.map((dueAmountData: PaymentAllocationDto) => {
        dueAmountData.rowSelected;
        return { ...dueAmountData, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (UpdateDueAmount.length > 0) {
        this.paymentAllocationList = [...UpdateDueAmount];
        this.paymentAllocationList[0].rowSelected = true;
        this.paymentAllocationData = this.paymentAllocationList[0];
        this.highlightPaymentData = this.paymentAllocationList[0];
        if (this.sortDueAmountCodeTables.paymentAllocationTypes.length == this.paymentAllocationList.length) {
          this.disableAddPayment = true;
        }
      }
    });

    this.paymentHeader = [
      { header: this.translate.instant('financial.manageDue.tabel.payment'), field: 'paymentAllocationType.caption', width: '95%' },
      {
        header: this.translate.instant('financial.manageDue.tabel.'),
        field: 'dueamountDeleteButton',
        width: '5%',
        fieldType: 'dueamountDeleteButton',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const paymentAllocationError = new ErrorDto();
    paymentAllocationError.validation = 'required';
    paymentAllocationError.isModelError = true;
    paymentAllocationError.validationMessage =
      this.translate.instant('financial.manageDue.ValidationError.paymentAllocation') +
      this.translate.instant('financial.manageDue.ValidationError.required');
    this.PaymentAllocationDropdownConfig.required = true;
    this.PaymentAllocationDropdownConfig.Errors = [paymentAllocationError];

    const timesortingError = new ErrorDto();
    timesortingError.validation = 'required';
    timesortingError.isModelError = true;
    timesortingError.validationMessage =
      this.translate.instant('financial.manageDue.ValidationError.timeSorting') +
      this.translate.instant('financial.manageDue.ValidationError.required');
    this.TimeSortingDropdownConfig.required = true;
    this.TimeSortingDropdownConfig.Errors = [timesortingError];

    const txelTypeError = new ErrorDto();
    txelTypeError.validation = 'required';
    txelTypeError.isModelError = true;
    txelTypeError.validationMessage =
      this.translate.instant('financial.manageDue.ValidationError.TxElTypeCd') +
      this.translate.instant('financial.manageDue.ValidationError.required');
    this.TxElDropdownConfig.required = true;
    this.TxElDropdownConfig.Errors = [txelTypeError];
  }

  onAddPaymentAllocation() {
    if (this.dueAmountform.valid) {
      this.removeDueamountError();
      let updatePaymentAllocationData = [...this.paymentAllocationList];
      updatePaymentAllocationData = this.rowDeselectData(updatePaymentAllocationData);
      this.paymentAllocationData = new PaymentAllocationDto();
      this.paymentAllocationData.paymentAllocationBlocks = [];

      updatePaymentAllocationData.push({
        ...this.paymentAllocationData,
        randomNumber: this.generateRandomNumber(),
        rowSelected: true,
        state: 1
      });
      this.paymentAllocationList = [...updatePaymentAllocationData];
      this.highlightPaymentData = this.paymentAllocationList[this.paymentAllocationList.length - 1];
      if (this.sortDueAmountCodeTables.paymentAllocationTypes.length == this.paymentAllocationList.length) {
        this.disableAddPayment = true;
      }
    }
  }

  onPaymentAllocationRowSelect(event: any) {
    if (this.dueAmountform.valid) {
      let updatePaymentAllocationData = this.paymentAllocationList;
      const eventIndex = updatePaymentAllocationData.findIndex(x => x.rowSelected);

      updatePaymentAllocationData = this.rowDeselectData(updatePaymentAllocationData);

      this.paymentAllocationList[eventIndex].rowSelected = updatePaymentAllocationData[eventIndex].rowSelected;

      const selectedIndex = this.paymentAllocationList.findIndex(x => x.randomNumber == event.randomNumber);

      this.paymentAllocationList[selectedIndex].rowSelected = true;
      //  this.highlightGenericData = this.genericMappingList[selectedIndex];
      this.paymentAllocationData = event;
      this.highlightPaymentData = this.paymentAllocationList[selectedIndex];
    } else {
      this.throwDueamountError();
    }

  }

  OnAddBlock() {
    if (this.dueAmountform.valid) {
      if (this.paymentAllocationList.length > 0) {
        const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);

        if (!this.paymentAllocationList[selectedIndex].sortNoDueAmounts) {
          this.removeDueamountError();
          const paymentAllocationBlock = new PaymentAllocationBlockDto();
          paymentAllocationBlock.paymentAllocationItems = [];
          paymentAllocationBlock.sortingSeqNr = this.paymentAllocationList[selectedIndex].paymentAllocationBlocks.length + 1;
          paymentAllocationBlock.state = 1;

          this.paymentAllocationList[selectedIndex].paymentAllocationBlocks.push({ ...paymentAllocationBlock });
        }
      }
    } else {
      this.throwDueamountError();
    }
  }

  onRowDeletePaymentAllocation(event: PaymentAllocationDto) {
    if (this.dueAmountform.valid || event.rowSelected) {
      const paymentAllocationListData = [...this.paymentAllocationList];

      const todeleteIndex = paymentAllocationListData.findIndex((data: PaymentAllocationDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != paymentAllocationListData.length - 1) {
        if (paymentAllocationListData[todeleteIndex].state == 1) {
          paymentAllocationListData.splice(todeleteIndex, 1);
        } else {
          paymentAllocationListData[todeleteIndex].state = 4;
          this.modifiedPaymentAllocationList.push({ ...paymentAllocationListData[todeleteIndex] });
          paymentAllocationListData.splice(todeleteIndex, 1);
        }

        if (paymentAllocationListData.length > 0) {
          this.paymentAllocationList = this.rowDeselectData(paymentAllocationListData);
          this.paymentAllocationList[0].rowSelected = true;
          this.paymentAllocationData = this.paymentAllocationList[0];
          this.highlightPaymentData = this.paymentAllocationList[0];
        } else {
          this.paymentAllocationList = [];
          this.paymentAllocationData = new PaymentAllocationDto();
          this.paymentAllocationData.paymentAllocationBlocks = []

        }
      } else {
        if (paymentAllocationListData[todeleteIndex].state == 1) {
          paymentAllocationListData.splice(todeleteIndex, 1);
        } else {
          paymentAllocationListData[todeleteIndex].state = 4;
          this.modifiedPaymentAllocationList.push({ ...paymentAllocationListData[todeleteIndex] });
          paymentAllocationListData.splice(todeleteIndex, 1);
        }

        if (paymentAllocationListData.length > 0) {
          this.paymentAllocationList = this.rowDeselectData(paymentAllocationListData);
          this.paymentAllocationList[this.paymentAllocationList?.length - 1].rowSelected = true;
          const lastIndex = this.paymentAllocationList.findIndex((x: PaymentAllocationDto) => x.rowSelected);

          this.paymentAllocationData = this.paymentAllocationList[lastIndex];
          this.highlightPaymentData = this.paymentAllocationList[lastIndex];
        } else {
          this.paymentAllocationList = [];
          this.paymentAllocationData = new PaymentAllocationDto();
          this.paymentAllocationData.paymentAllocationBlocks = []
        }
      }
    } else {
      this.throwDueamountError();
    }
  }

  rowDeselectData(paymentAllocationData: PaymentAllocationDto[]) {
    const deSelectData = paymentAllocationData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: PaymentAllocationDto) => {
          return {
            ...x,
            rowSelected: false
          };
        })
        : [];
    return updateDeselect;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onPaymentAllocationChanged(event: any) {
    const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationType = updategrid.paymentAllocationType;
      this.paymentAllocationList[selectedIndex].state = updategrid.state;
      this.paymentAllocationData.paymentAllocationType = event.value;
    } else if (event?.value == null) {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationType = null;
      this.paymentAllocationList[selectedIndex].state = updategrid.state;
      this.paymentAllocationData.paymentAllocationType = null;
      this.PaymentAllocationDropdownConfig.externalError = true;
    }

  }

  onTimeSortingChange(event: any, index: number) {

    const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationBlocks[index].timingSorting = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (updategrid.paymentAllocationBlocks[index].state != DtoState.Created) {
        updategrid.paymentAllocationBlocks[index].state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[index].timingSorting =
        updategrid.paymentAllocationBlocks[index].timingSorting;

      this.paymentAllocationList[selectedIndex].state = updategrid.state;

      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[index].state = updategrid.paymentAllocationBlocks[index].state;
      this.paymentAllocationData.paymentAllocationBlocks[index].timingSorting = event.value;
    } else {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationBlocks[index].timingSorting = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (updategrid.paymentAllocationBlocks[index].state != DtoState.Created) {
        updategrid.paymentAllocationBlocks[index].state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[index].timingSorting =
        updategrid.paymentAllocationBlocks[index].timingSorting;

      this.paymentAllocationList[selectedIndex].state = updategrid.state;

      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[index].state = updategrid.paymentAllocationBlocks[index].state;
      this.paymentAllocationData.paymentAllocationBlocks[index].timingSorting = null;
      this.TimeSortingDropdownConfig.externalError = true;
    }
  }

  onTimeSortingDelete(paymentblocks: PaymentAllocationBlockDto, index: number) {

    const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);
    let sortingSeqNr = 0;
    const updatePaymentBlock = this.paymentAllocationList[selectedIndex].paymentAllocationBlocks;

    this.paymentAllocationList[selectedIndex].state = DtoState.Dirty;
    paymentblocks.timingSorting = <codeTable>{};
    this.removeDueamountError();
    setTimeout(() => {
      updatePaymentBlock.splice(index, 1);

      updatePaymentBlock.forEach(x => {
        sortingSeqNr += 1;
        x.sortingSeqNr = sortingSeqNr;
      });
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks = updatePaymentBlock;
      this.paymentAllocationData.paymentAllocationBlocks = updatePaymentBlock;
    }, 10);

  }

  onAddPaymentAllocationItem(blockIndex: number) {
    if (this.dueAmountform.valid) {
      this.removeDueamountError();
      if (this.paymentAllocationList.length > 0) {
        const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);

        const paymentAllocationItem = new PaymentAllocationItemDto();
        paymentAllocationItem.equalDateSortingNr =
          this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems.length + 1;
        paymentAllocationItem.state = 1;

        this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems.push({
          ...paymentAllocationItem
        });
      }
    } else {
      this.throwDueamountError();
    }
  }

  onTxelChange(event: any, blockIndex: number, ItemIndex: number) {

    const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null && blockIndex >= 0 && ItemIndex >= 0) {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (updategrid.paymentAllocationBlocks[blockIndex].state != DtoState.Created) {
        updategrid.paymentAllocationBlocks[blockIndex].state = DtoState.Dirty;
      }
      if (updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].state != DtoState.Created) {
        updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType =
        updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType;

      this.paymentAllocationList[selectedIndex].state = updategrid.state;

      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].state =
        updategrid.paymentAllocationBlocks[blockIndex].state;
      this.paymentAllocationData.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType = event.value;
    } else {
      const updateData = this.paymentAllocationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      if (updategrid.paymentAllocationBlocks[blockIndex].state != DtoState.Created) {
        updategrid.paymentAllocationBlocks[blockIndex].state = DtoState.Dirty;
      }
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType =
        updategrid.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType;

      this.paymentAllocationList[selectedIndex].state = updategrid.state;

      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].state =
        updategrid.paymentAllocationBlocks[blockIndex].state;
      this.paymentAllocationData.paymentAllocationBlocks[blockIndex].paymentAllocationItems[ItemIndex].txElType = null;

      this.TxElDropdownConfig.externalError = true;
    }
  }

  ontxelDelete(paymentItem: PaymentAllocationItemDto, blockIndex: number, ItemIndex: number) {
    const selectedIndex = this.paymentAllocationList.findIndex(x => x.rowSelected);
    let sortingSeqNr = 0;
    const updatePaymentIndex = this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems;
    this.paymentAllocationList[selectedIndex].state = DtoState.Dirty;
    this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].state = DtoState.Dirty;
    paymentItem.txElType = <TxElTypeDto>{};

    this.removeDueamountError();

    setTimeout(() => {
      updatePaymentIndex.splice(ItemIndex, 1);
      updatePaymentIndex.forEach((x: any) => {
        sortingSeqNr += 1;
        x.equalDateSortingNr = sortingSeqNr;
      });
      console.log(updatePaymentIndex)
      this.paymentAllocationList[selectedIndex].paymentAllocationBlocks[blockIndex].paymentAllocationItems = updatePaymentIndex;
      this.paymentAllocationData.paymentAllocationBlocks[blockIndex].paymentAllocationItems = updatePaymentIndex;
    }, 10);
  }

  onSave(paymentAllocationList: PaymentAllocationDto[]) {

    if (this.dueAmountform.valid) {
      paymentAllocationList.map(paymentAllocationData => {
        if (paymentAllocationData.state != 0) {
          this.modifiedPaymentAllocationList.push({ ...paymentAllocationData });
        }
      });


      this.dueamntService.savePaymentAllocation(this.modifiedPaymentAllocationList).subscribe(
        responseData => {
          this.spinnerService.setIsLoading(false);
          this.modifiedPaymentAllocationList = [];
          this.removeDueamountError();

          this.dueamntService.getPaymentAllocation().subscribe((data: any) => {
            this.spinnerService.setIsLoading(false);

            const UpdateDueAmount = data.paymentAllocations.map((dueAmountData: PaymentAllocationDto) => {
              dueAmountData.rowSelected;
              return { ...dueAmountData, randomNumber: this.generateRandomNumber(), rowSelected: false };
            });

            if (UpdateDueAmount.length > 0) {
              this.paymentAllocationList = [...UpdateDueAmount];
              const savedIndex = this.paymentAllocationList.findIndex(x => x.paymentAllocationType?.codeId == this.paymentAllocationData.paymentAllocationType?.codeId)
              this.paymentAllocationList[savedIndex].rowSelected = true;
              this.paymentAllocationData = this.paymentAllocationList[savedIndex];
              this.highlightPaymentData = this.paymentAllocationList[savedIndex];
              if (this.sortDueAmountCodeTables.paymentAllocationTypes.length == this.paymentAllocationList.length) {
                this.disableAddPayment = true;
              }
            }
          },
            err => {
              if (err?.error?.errorCode) {
                this.errorCode = err.error.errorCode;
              } else {
                this.errorCode = 'InternalServiceFault';
              }
              this.modifiedPaymentAllocationList = [];
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
            });
        },
        err => {
          if (err?.error?.errorCode) {
            this.errorCode = err.error.errorCode;
          } else {
            this.errorCode = 'InternalServiceFault';
          }
          this.modifiedPaymentAllocationList = [];
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
        }
      );
    } else {
      this.throwDueamountError();
    }
  }

  throwDueamountError() {
    this.TxElDropdownConfig.externalError = true;
    this.TimeSortingDropdownConfig.externalError = true;
    this.PaymentAllocationDropdownConfig.externalError = true;
  }

  removeDueamountError() {
    this.TxElDropdownConfig.externalError = false;
    this.TimeSortingDropdownConfig.externalError = false;
    this.PaymentAllocationDropdownConfig.externalError = false;
  }

  spliceDueamountError() {
    const paymentAllocation = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('financial.manageDue.ValidationError.paymentAllocation') +
        this.translate.instant('financial.manageDue.ValidationError.required')
    );
    if (paymentAllocation >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(paymentAllocation, 1);
    }

    const TimingError = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('financial.manageDue.ValidationError.timeSorting') +
        this.translate.instant('financial.manageDue.ValidationError.required')
    );
    if (TimingError >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(TimingError, 1);
    }

    const TxElTypeCd = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('financial.manageDue.ValidationError.TxElTypeCd') +
        this.translate.instant('financial.manageDue.ValidationError.required')
    );
    if (TxElTypeCd >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(TxElTypeCd, 1);
    }
  }

  onClose() {
    const isChangedIndexExist = this.paymentAllocationList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.modifiedPaymentAllocationList.length > 0) {
      this.showDialog = true;
    } else {
      this.removeDueamountError();
      window.location.assign(this.navigateUrl);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(paymentAllocationList: PaymentAllocationDto[]) {
    this.showDialog = false;

    if (this.dueAmountform.valid) {
      this.onSave(paymentAllocationList);
      window.location.assign(this.navigateUrl);
    } else {
      this.throwDueamountError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeDueamountError();
    window.location.assign(this.navigateUrl);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }
}

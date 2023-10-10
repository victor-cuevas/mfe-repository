import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FluidButtonConfig, ErrorDto, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, FluidCheckBoxConfig, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-runningaccount-config-service/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { DtoState, GetCodeTablesOfRunAccBookingPlanDto, RunnAccBookingDto, RunnAccBookingPlanDto, RunnAccGLDto } from './models/runn-acc-booking-plan.model';
import { DatePipe } from '@angular/common';
import { RunnAccBookingPlanService } from './service/runn-acc-booking-plan.service';

@Component({
  selector: 'mracs-runningaccount-runn-acc-booking-plan',
  templateUrl: './runningaccount-runn-acc-booking-plan.component.html',
  styleUrls: ['./runningaccount-runn-acc-booking-plan.component.scss']
})
export class RunningaccountRunnAccBookingPlanComponent implements OnInit {
  @ViewChild("bookingPlanform", { static: true }) bookingPlanform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public NameTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public StartDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public SeqNtTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public OwnerTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ProductNbrDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public BalanceMovementTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public JournalNrTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AccountNrTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PostingKeyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CurrencyDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MinDurationTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public OwnerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;


  bookingPlanList!: RunnAccBookingPlanDto[]
  bookingPlanCodeTable!: GetCodeTablesOfRunAccBookingPlanDto
  bookingPlanDetail!: RunnAccBookingPlanDto
  bookingDetail!: RunnAccBookingDto
  gLDetail!: RunnAccGLDto
  saveBookingPlanData: RunnAccBookingPlanDto[] = []
  showBookingPlanDetail!: boolean
  showBookingDetail!: boolean
  showGLDetail!: boolean
  showGL!: boolean
  navigateUrl!: string
  exceptionBox!: boolean
  errorCode!: string
  showDialog!: boolean
  isValid!: boolean
  balMovEditable!: boolean
  placeholder = 'select';
  accountHeader!: any[];
  balanceHeader!: any[];
  ownersHeader!: any[];
  intMaxValue = 2147483647;
  maxErrorDto: ErrorDto[]=[]
  validationHeader = this.translate.instant('runningAccount.validation.validationHeader');

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public route: ActivatedRoute,
    private spinnerservice: SpinnerService, private service: RunnAccBookingPlanService, private fluidValidation: fluidValidationService,
    private commonService: ConfigContextService, public router: Router, public datePipe: DatePipe) {
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateUrl = mfeConfig?.remoteUrl;

  }

  ngOnInit(): void {

    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerservice.setIsLoading(false);
      this.bookingPlanCodeTable = res.bookingPlanCodeTableData
    })

    this.route.data.subscribe((res: any) => {
      this.spinnerservice.setIsLoading(false);
      this.bookingPlanList = res.bookingPlanData
    })

    const updatedList = this.bookingPlanList?.map(x => {
      return {
        ...x,
        startDate: new Date(x?.startDate),
        endDate: new Date(x?.endDate as Date),
        modifiedStartDate: this.datePipe.transform(x?.startDate, 'dd/MM/yyyy'),
        modifiedEndDate: this.datePipe.transform(x?.endDate, 'dd/MM/yyyy'),
      }
    })
    this.bookingPlanList = updatedList;
    this.bookingPlanList?.forEach(x => {
      if (x.modifiedEndDate == null)
        x.endDate = null as unknown as Date;
    })
    this.balMovEditable = true;

    this.bookingPlanList?.forEach(x => {
      x.isNameReadOnly = true;
      const ProductNameIndex = this.bookingPlanCodeTable.productNameList.findIndex(y => y.codeId == x.productNbr)
      x.modifiedProductNbr = this.bookingPlanCodeTable.productNameList[ProductNameIndex];
      const ownerIndex = this.bookingPlanCodeTable.creditProviderList.findIndex(y => y.pKey == x.owner)
      x.modifiedowner = { ...this.bookingPlanCodeTable.creditProviderList[ownerIndex] };
    })

    if (this.bookingPlanList?.length > 0) {
      this.showBookingPlanDetail = true;
      this.showGL = false;
      this.showGLDetail = false;
      this.settingIsSelectedFalse();
      this.bookingPlanList[0].isSelected = true;
      this.bookingPlanDetail = this.bookingPlanList[0];
      this.bookingPlanList.forEach(x => x.runnAccBookingList?.forEach(y => {
        y.balanceMovementTypeList = this.bookingPlanCodeTable.balanceMovementTypeList
        y.modifiedAggregate = y.aggregate.toString();
        y.modifiedGL = y.isExcludedFromGL.toString();
      }))
      if (this.bookingPlanDetail.runnAccBookingList.length > 0) {

        this.showBookingDetail = true;
        this.settingIsBookingSelectedFalse();
        this.bookingPlanList[0].runnAccBookingList[0].isBookingSelected = true;
        this.bookingDetail = this.bookingPlanList[0].runnAccBookingList[0];
       
      }
      else {
        this.showBookingDetail = false;
      }    
    }
    else {
      this.showBookingPlanDetail = false;
    }

    this.ownersHeader = [
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Name'), field: 'name', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Owner'), field: 'modifiedowner.name.caption', width: '8%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.StartDate'), field: 'modifiedStartDate', dateSort:'startDate', width: '9%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.EndDate'), field: 'modifiedEndDate', dateSort: 'endDate', width: '9%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Seqnt'), field: 'seqNt', width: '6%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.RunningAccountStatus'), field: 'runnAccAccountStatus.caption', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.RunningAccountAmortizationSchedule'), field: 'runnAccAmortizationSchedule.caption', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.ConsumerProductType'), field: 'consumerProductType.caption', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.RunningAcountOwnerType'), field: 'ownerType.caption', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.RunningAcountType'), field: 'runnAccAccountType.caption', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.MinDuration'), field: 'minDuration', width: '6%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Country'), field: 'country', width: '7%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Productnbr'), field: 'modifiedProductNbr.caption', width: '8%' },
      { header: '', field: null, fieldType: 'deleteButton', width: '5%' }];

    this.balanceHeader = [
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.BalanceMovementType'), field: 'balanceMovementType.caption', width: '32%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.aggregate'), field: 'modifiedAggregate', width: '21%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Journalnr'), field: 'journalNr', width: '21%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.isExcludedFromGL'), field: 'modifiedGL', width: '21%' },
      { header: '', field: null, fieldType: 'deleteButton', width: '5%' }];

    this.accountHeader = [
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Accountnr'), field: 'accountNr', width: '32%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.PostingKey'), field: 'postingKey.caption', width: '31%' },
      { header: this.translate.instant('runningAccount.RunnAccBookingPlan.tabel.Currency'), field: 'currency.caption', width: '32%' },
      { header: '', field: null, fieldType: 'deleteButton', width: '5%' }];
  }

  onValidate(bookingPlanData: RunnAccBookingPlanDto[]):boolean {
    this.isValid = true;
    let debit: any[] = [];
    let credit: any[] = [];
      this.bookingPlanDetail.runnAccBookingList.forEach(x => {
        if (x.isExcludedFromGL == false) {
          debit = x.runnAccGLList.filter(y => y.postingKey.codeId == 1);
          credit = x.runnAccGLList.filter(y => y.postingKey.codeId == 2);
          if ((debit.length != 0 && debit.length >= 1 && (credit.length == 0 || credit.length > 1)) || (credit.length != 0 && credit.length >= 1 && (debit.length == 0 || debit.length > 1))) {
            this.isValid = false;
            this.throwBusinessError(this.translate.instant('runningAccount.RunnAccBookingPlan.validation.isExcludedFromGL'));
          }
        }
      });
    return (this.isValid);
  }

  onSave(bookingPlanData: RunnAccBookingPlanDto[]) {
    if (this.bookingPlanform.valid && this.onValidate(bookingPlanData)) {

      bookingPlanData.forEach(x => {
        if (x.state != DtoState.Unknown) {
          if (x.startDate != null || x.startDate != undefined) {
            x.startDate = new Date(Date.UTC(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate(), 0, 0, 0));
          }
          if (x.endDate != null || x.endDate != undefined) {
            x.endDate = new Date(Date.UTC(x.endDate.getFullYear(), x.endDate.getMonth(), x.endDate.getDate(), 0, 0, 0));
          }
          this.saveBookingPlanData.push({ ...x });
        }
      })
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length = 0;
      this.spinnerservice.setIsLoading(true);
      this.service.saveBookingPlanData(this.saveBookingPlanData).subscribe(res => {
        this.spinnerservice.setIsLoading(false);
        this.bookingPlanList = res as RunnAccBookingPlanDto[];

        const updatedList = this.bookingPlanList?.map(x => {
          return {
            ...x,
            startDate: new Date(x?.startDate),
            endDate: new Date(x?.endDate as Date),
            modifiedStartDate: this.datePipe.transform(x?.startDate, 'dd/MM/yyyy'),
            modifiedEndDate: this.datePipe.transform(x?.endDate, 'dd/MM/yyyy'),       
          }
        })
        this.bookingPlanList = updatedList;
        this.bookingPlanList?.forEach(x => {
          if (x.modifiedEndDate == null)
            x.endDate = null as unknown as Date;
        })
        this.balMovEditable = true;
        this.bookingPlanList?.forEach(x => {
          x.state = DtoState.Unknown;
          x.isNameReadOnly = true;
          const ProductNameIndex = this.bookingPlanCodeTable.productNameList.findIndex(y => y.codeId == x.productNbr)
          x.modifiedProductNbr = this.bookingPlanCodeTable.productNameList[ProductNameIndex];
          const ownerIndex = this.bookingPlanCodeTable.creditProviderList.findIndex(y => y.pKey == x.owner)
          x.modifiedowner = { ...this.bookingPlanCodeTable.creditProviderList[ownerIndex] };
        })

        if (this.bookingPlanList?.length > 0) {
          this.showBookingPlanDetail = true;
          this.showGL = false;
          this.showGLDetail = false;
          this.settingIsSelectedFalse();
          const SelectedBookingIndex = this.bookingPlanList.findIndex(
            x =>
              x.name == this.bookingPlanDetail?.name &&
              x.owner == this.bookingPlanDetail?.owner &&
              x.modifiedStartDate == this.bookingPlanDetail.modifiedStartDate &&
              x.modifiedEndDate == this.bookingPlanDetail.modifiedEndDate &&
              x.seqNt == this.bookingPlanDetail.seqNt &&
              x.runnAccAccountStatus?.codeId == this.bookingPlanDetail.runnAccAccountStatus?.codeId &&
              x.runnAccAmortizationSchedule?.codeId == this.bookingPlanDetail.runnAccAmortizationSchedule?.codeId &&
              x.runnAccAccountType?.codeId == this.bookingPlanDetail.runnAccAccountType?.codeId &&
              x.ownerType?.codeId == this.bookingPlanDetail.ownerType?.codeId &&
              x.consumerProductType?.codeId == this.bookingPlanDetail.consumerProductType?.codeId &&
              x.country?.codeId == this.bookingPlanDetail.country?.codeId &&
              x.minDuration == this.bookingPlanDetail.minDuration &&
              x.modifiedProductNbr == this.bookingPlanDetail.modifiedProductNbr 
          );
          this.bookingPlanList[SelectedBookingIndex].isSelected = true;
          this.bookingPlanDetail = this.bookingPlanList[SelectedBookingIndex];
          this.bookingPlanList.forEach(x => x.runnAccBookingList?.forEach(y => {
            y.balanceMovementTypeList = this.bookingPlanCodeTable.balanceMovementTypeList;
            y.modifiedAggregate = y.aggregate.toString();
            y.modifiedGL = y.isExcludedFromGL.toString();
          }))

          if (this.bookingPlanDetail.runnAccBookingList.length > 0) {
            this.showBookingDetail = true;
            this.settingIsBookingSelectedFalse();
            this.bookingPlanList[SelectedBookingIndex].runnAccBookingList[0].isBookingSelected = true;
            this.bookingDetail = this.bookingPlanList[SelectedBookingIndex].runnAccBookingList[0];
          }
          else {
            this.showBookingDetail = false;
          }
        }
        else {
          this.showBookingPlanDetail = false;
        }
        this.saveBookingPlanData = [];
      }, err => {
        this.spinnerservice.setIsLoading(false);
        this.exceptionBox = true;
        this.saveBookingPlanData = [];
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

  dataSelection(event: RunnAccBookingPlanDto) {
    if (this.bookingPlanform.valid) {
      this.balMovEditable = true;
      this.settingIsSelectedFalse();
      this.bookingPlanDetail = event;
      this.bookingPlanDetail.isSelected = true;
      if (this.bookingPlanDetail.runnAccBookingList.length > 0) {
        this.showBookingDetail = true;
        this.showGL = false;
        this.showGLDetail = false;
        this.settingIsBookingSelectedFalse();
        this.bookingDetail = this.bookingPlanDetail.runnAccBookingList[0];
        this.bookingDetail.isBookingSelected = true;
      }
      else {
        this.showBookingDetail = false;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addBookingPlan() {
    if (this.bookingPlanform.valid) {
      this.settingExternalErrorFalse();
      this.balMovEditable = true;
      this.settingIsSelectedFalse();
      this.showBookingPlanDetail = true;
      this.showBookingDetail = false;
      const newRow = new RunnAccBookingPlanDto;
      newRow.isSelected = true;
      const newuserList = this.bookingPlanList;
      newuserList.push({ ...newRow });
      this.bookingPlanDetail = new RunnAccBookingPlanDto();
      this.bookingPlanList = [...newuserList];

      this.bookingPlanDetail.state = DtoState.Created;
      this.bookingPlanDetail.pKey = 0;
      this.bookingPlanDetail.isSelected = true;
      this.bookingPlanDetail.isNameReadOnly = false;

      this.bookingPlanList[this.bookingPlanList.length - 1] = this.bookingPlanDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onBookingPlanRowDelete(event: RunnAccBookingPlanDto, gridData: RunnAccBookingPlanDto[]) {

    let accNrIndex = -1;
    let postalKeyIndex = -1;
    let currency = -1;

    event.runnAccBookingList.forEach(x => {
      if (x.runnAccGLList.length > 0)
        accNrIndex = x.runnAccGLList.findIndex(y => { return y.accountNr == null })
    });

    event.runnAccBookingList.forEach(x => {
      if (x.runnAccGLList.length > 0)
        postalKeyIndex = x.runnAccGLList.findIndex(y => { return y.postingKey == null })
    });

    event.runnAccBookingList.forEach(x => {
      if (x.runnAccGLList.length > 0)
        currency = x.runnAccGLList.findIndex(y => { return y.currency == null })
    });

    const balMovIndex = event.runnAccBookingList.findIndex(x => x?.balanceMovementType == null);
    const journalIndex = event.runnAccBookingList.findIndex(x => x?.journalNr == null);

    if (this.bookingPlanform.valid || event.name == "" || event.seqNt == null || event.productNbr == null || event.ownerType == null || event.startDate == null
      || balMovIndex != -1 || journalIndex != -1 || accNrIndex != -1 || postalKeyIndex != -1 || currency != -1 ) {
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      if (this.bookingPlanList[deletedata].state != DtoState.Created) {
        event.state = DtoState.Deleted;
        this.saveBookingPlanData.push({ ...event });
      }

      gridData.splice(deletedata, 1);
      this.bookingPlanList = [...gridData]
      if (gridData.length > 0) {
        this.balMovEditable = true;
        this.settingIsSelectedFalse();
        this.bookingPlanList[this.bookingPlanList.length - 1].isSelected = true;
        this.bookingPlanDetail = this.bookingPlanList[this.bookingPlanList.length - 1];
        if (this.bookingPlanList[this.bookingPlanList.length - 1].runnAccBookingList.length > 0) {
          this.settingIsBookingSelectedFalse();
          this.bookingPlanList[this.bookingPlanList.length - 1].runnAccBookingList[0].isBookingSelected = true;
          this.bookingDetail = this.bookingPlanList[this.bookingPlanList.length - 1].runnAccBookingList[0];
          this.showBookingDetail = true;
          this.showGL = false;
        }
        else {
          this.showBookingDetail = false;
        }
      }
      else {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showBookingPlanDetail = false;
        }, 2)
      }
    }
  }

  bookingDataSelection(event: RunnAccBookingDto) {
    if (this.bookingPlanform.valid) {
      this.balMovEditable = true;
      this.settingIsBookingSelectedFalse();
      this.bookingDetail = event;
      this.bookingDetail.isBookingSelected = true;
      this.showGL = true;
      if (this.bookingDetail.runnAccGLList.length > 0) {
        this.settingIsGlSelectedFalse();
        this.gLDetail = this.bookingDetail.runnAccGLList[0];
        this.gLDetail.isGLSelected = true;
        this.showGLDetail = true;
      }
      else {
        this.showGLDetail = false;
      }
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addBooking() {
    if (this.bookingPlanform.valid) {
      this.settingExternalErrorFalse();
      const index = this.bookingPlanList.findIndex(x => x.isSelected)
      this.settingIsBookingSelectedFalse();
      this.showBookingDetail = true
      this.balMovEditable = false;
      this.showGL = false;

      const newRow = new RunnAccBookingDto;
      newRow.isBookingSelected = true;
      const newuserList = this.bookingPlanList[index].runnAccBookingList;
      newuserList.push({ ...newRow });
      this.bookingDetail = new RunnAccBookingDto();     
      this.bookingPlanList[index].runnAccBookingList = [...newuserList];

      if (this.bookingPlanList[index].runnAccBookingList.length > 0) {
        this.bookingDetail.balanceMovementTypeList = this.bookingPlanCodeTable.balanceMovementTypeList.filter(val => {
          return !this.bookingPlanList[index].runnAccBookingList.find(x => {
            return x?.balanceMovementType?.codeId == val?.codeId;
          })
        })
      }

      this.bookingDetail.state = DtoState.Created;
      this.bookingDetail.pKey = 0;
      this.bookingDetail.isBookingSelected = true;
      this.bookingDetail.aggregate = false;
      this.bookingDetail.isExcludedFromGL = false;
      this.bookingPlanList[index].state = DtoState.Dirty;

      this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1] = this.bookingDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onBookingRowDelete(event: RunnAccBookingDto, gridData: RunnAccBookingDto[]) {

    const accNrIndex = event.runnAccGLList.findIndex(x => x.accountNr == null);
    const postalKeyIndex = event.runnAccGLList.findIndex(x => x.postingKey == null);
    const currencyIndex = event.runnAccGLList.findIndex(x => x.currency == null);

    if (this.bookingPlanform.valid || event.balanceMovementType == null || event.journalNr == null || accNrIndex != -1 || postalKeyIndex != -1 || currencyIndex != -1) {
      const index = this.bookingPlanList.findIndex(x => x.isSelected)
      this.bookingPlanList[index].state = DtoState.Dirty;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      gridData.splice(deletedata, 1);
      this.bookingPlanList[index].runnAccBookingList = [...gridData]
      if (gridData.length > 0) {
        this.balMovEditable = true;
        this.settingIsBookingSelectedFalse();
        this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1].isBookingSelected = true;
        this.bookingDetail = this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1];
        if (this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1].runnAccGLList.length > 0) {
          this.settingIsGlSelectedFalse();
          this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1].runnAccGLList[0].isGLSelected = true;
          this.gLDetail = this.bookingPlanList[index].runnAccBookingList[this.bookingPlanList[index].runnAccBookingList.length - 1].runnAccGLList[0];
        }
      }
      else {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showBookingDetail = false
        }, 2)
      }
    }
  }

  gLDataSelection(event: RunnAccGLDto) {
    if (this.bookingPlanform.valid) {
      this.settingIsGlSelectedFalse();
      this.gLDetail = event;
      this.gLDetail.isGLSelected = true;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  addGL() {
    if (this.bookingPlanform.valid) {
      this.settingExternalErrorFalse();
      const index = this.bookingPlanList.findIndex(x => x.isSelected)
      const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected)
      this.showGLDetail = true;

      const newRow = new RunnAccGLDto;
      newRow.isGLSelected = true;
      const newuserList = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList;
      newuserList.push({ ...newRow });
      this.gLDetail = new RunnAccGLDto();
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList = [...newuserList];
      this.settingIsGlSelectedFalse();
      this.gLDetail.state = DtoState.Created;
      this.gLDetail.pKey = 0;
      this.gLDetail.isGLSelected = true;
      this.bookingPlanList[index].state = DtoState.Dirty;   

      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.length - 1] = this.gLDetail;
    }
    else {
      this.settingExternalErrorTrue();
    }
  }

  onGLRowDelete(event: RunnAccGLDto, gridData: RunnAccGLDto[]) {
    if (this.bookingPlanform.valid || event.accountNr == null || event.postingKey == null || event.currency == null) {
      const index = this.bookingPlanList.findIndex(x => x.isSelected)
      const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected)
      this.bookingPlanList[index].state = DtoState.Dirty;

      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      gridData.splice(deletedata, 1);
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList = [...gridData]
      if (gridData.length > 0) {
        this.settingIsGlSelectedFalse();
        this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.length - 1].isGLSelected = true;
        this.gLDetail = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.length - 1];
      }
      else {
        this.settingExternalErrorFalse();
        setTimeout(() => {
          this.showGLDetail = false;
        }, 2)
      }
    }
  }

  settingIsSelectedFalse() {
    this.bookingPlanList.forEach(x => x.isSelected = false)
  }

  settingIsBookingSelectedFalse() {
    const index = this.bookingPlanList.findIndex(x => x.isSelected)
    this.bookingPlanList[index].runnAccBookingList.forEach(x => x.isBookingSelected = false);
  }

  settingIsGlSelectedFalse() {
    const index = this.bookingPlanList.findIndex(x => x.isSelected)
    const detailIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    this.bookingPlanList[index].runnAccBookingList[detailIndex].runnAccGLList.forEach(x => x.isGLSelected = false);
  }

  settingBookingPlanStateDirty() {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);

    if (this.bookingPlanList[index].state != DtoState.Created) {
      this.bookingPlanList[index].state = DtoState.Dirty;
    }
  }

  settingBookingStateDirty() {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);

    if (this.bookingPlanList[index].runnAccBookingList[bookingIndex].state != DtoState.Created) {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].state = DtoState.Dirty;
    }
  }

  settingGLStateDirty() {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    const GLIndex = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.findIndex(x => x.isGLSelected);

    if (this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].state != DtoState.Created) {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].state = DtoState.Dirty;
    }
  }

  onChangeName(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].name = event?.target?.value;
    this.bookingPlanDetail.name = event?.target?.value;
    if (event?.target?.value == "") {
      this.NameTextBoxconfig.externalError = true;
    }
  }

  onChangeOwner(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].modifiedowner = event?.value;
    this.bookingPlanDetail.modifiedowner = event?.value;
    this.bookingPlanList[index].owner = event?.value?.pKey;
    this.bookingPlanDetail.owner = event?.value?.pKey;
    if (event?.value == null) {
      this.OwnerDropdownConfig.externalError = true;
    }
  }

  onChangeStartDate(event: Date) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    const displayDate = this.datePipe.transform(event, 'dd/MM/yyyy');
    this.bookingPlanList[index].modifiedStartDate = displayDate;
    this.bookingPlanDetail.modifiedStartDate = displayDate;
    this.bookingPlanList[index].startDate = event;
    this.bookingPlanDetail.startDate = event;
    if (event == null) {
      this.StartDateConfig.externalError = true;
    }
  }

  onChangeEndDate(event: Date) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    const displayDate = this.datePipe.transform(event, 'dd/MM/yyyy');
    this.bookingPlanList[index].modifiedEndDate = displayDate;
    this.bookingPlanDetail.modifiedEndDate = displayDate;
    this.bookingPlanList[index].endDate = event;
    this.bookingPlanDetail.endDate = event;
  }

  onChangeSeqNt(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    if (event != null) {
      this.bookingPlanList[index].seqNt = parseInt(event);
      this.bookingPlanDetail.seqNt = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.SeqNtTextBoxconfig.externalError = true;
      }
    } else {
      this.bookingPlanList[index].seqNt = event;
      this.bookingPlanDetail.seqNt = event;
      this.SeqNtTextBoxconfig.externalError = true;
    }
  }

  onChangeRunnAccStatus(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].runnAccAccountStatus = event?.value;
    this.bookingPlanDetail.runnAccAccountStatus = event?.value;
  }

  onChangeRunnAccAmortizationSchedule(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].runnAccAmortizationSchedule = event?.value;
    this.bookingPlanDetail.runnAccAmortizationSchedule = event?.value;
  }

  onChangeConsumerProductType(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].consumerProductType = event?.value;
    this.bookingPlanDetail.consumerProductType = event?.value;
  }

  onChangeRunnAccOwnerType(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].ownerType = event?.value;
    this.bookingPlanDetail.ownerType = event?.value;
    if (event?.value == null) {
      this.OwnerTypeDropdownConfig.externalError = true;
    }
  }

  onChaneRunningAcountType(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].runnAccAccountType = event?.value;
    this.bookingPlanDetail.runnAccAccountType = event?.value;
  }

  onChangeMinDuration(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    if (event != null) {
      this.bookingPlanList[index].minDuration = parseInt(event);
      this.bookingPlanDetail.minDuration = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.MinDurationTextBoxconfig.externalError = true;
      }
    } else {
      this.bookingPlanList[index].minDuration = event;
      this.bookingPlanDetail.minDuration = event;
    }
  }

  onChangeCountry(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].country = event?.value;
    this.bookingPlanDetail.country = event?.value;
  }

  onChangeProductNBr(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    this.settingBookingPlanStateDirty();
    this.bookingPlanList[index].modifiedProductNbr = event?.value;
    this.bookingPlanDetail.modifiedProductNbr = event?.value;
    this.bookingPlanList[index].productNbr = event?.value?.codeId;
    this.bookingPlanDetail.productNbr = event?.value?.codeId;
    if (event?.value == null) {
      this.ProductNbrDropdownConfig.externalError = true;
    }
  }

  onChangeBalanceMovementType(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    this.bookingPlanList[index].runnAccBookingList[bookingIndex].balanceMovementType = event?.value;
    this.bookingPlanDetail.runnAccBookingList[bookingIndex].balanceMovementType = event?.value;
    this.bookingDetail.balanceMovementType = event?.value;
    if (event?.value == null) {
      this.BalanceMovementTypeDropdownConfig.externalError = true;
    }
  }

  onChangeAggregate(event: boolean) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    if (event != null) {
      this.bookingDetail.aggregate = event;
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].aggregate = event;
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].modifiedAggregate = event.toString();
    }
  }

  onChangeIsExcludedFromGL(event: boolean) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    this.settingBookingPlanStateDirty();
     this.settingBookingStateDirty();
    if (event != null) {
      this.bookingDetail.isExcludedFromGL = event;
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].isExcludedFromGL = event;
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].modifiedGL = event.toString();
    }
  }

  onChangeJournalNr(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    if (event != null) {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].journalNr = parseInt(event);
      this.bookingPlanDetail.runnAccBookingList[bookingIndex].journalNr = parseInt(event);
      this.bookingDetail.journalNr = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.JournalNrTextBoxconfig.externalError = true;
      }
    } else {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].journalNr = event;
      this.bookingPlanDetail.runnAccBookingList[bookingIndex].journalNr = event;
      this.bookingDetail.journalNr = event;
      this.JournalNrTextBoxconfig.externalError = true;
    }
  }

  onChangeAccountNr(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    const GLIndex = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.findIndex(x => x.isGLSelected)
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    this.settingGLStateDirty();
    if (event != null) {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].accountNr = parseInt(event);
      this.bookingPlanDetail.runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].accountNr = parseInt(event);
      this.bookingDetail.runnAccGLList[GLIndex].accountNr = parseInt(event);
      this.gLDetail.accountNr = parseInt(event);
      if (parseInt(event) > this.intMaxValue) {
        this.AccountNrTextBoxconfig.externalError = true;
      }
    } else {
      this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].accountNr = event;
      this.bookingPlanDetail.runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].accountNr = event;
      this.bookingDetail.runnAccGLList[GLIndex].accountNr = event;
      this.gLDetail.accountNr = event;
      this.AccountNrTextBoxconfig.externalError = true;
    }
  }

  onChangePostingKey(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    const GLIndex = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.findIndex(x => x.isGLSelected)
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    this.settingGLStateDirty();
    this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].postingKey = event?.value;
    this.bookingPlanDetail.runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].postingKey = event?.value;
    this.bookingDetail.runnAccGLList[GLIndex].postingKey = event?.value;
    this.gLDetail.postingKey = event?.value;
    if (event?.value == null) {
      this.PostingKeyDropdownConfig.externalError = true;
    }
  }

  onChangeCurrency(event: any) {
    const index = this.bookingPlanList.findIndex(x => x.isSelected);
    const bookingIndex = this.bookingPlanList[index].runnAccBookingList.findIndex(x => x.isBookingSelected);
    const GLIndex = this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList.findIndex(x => x.isGLSelected)
    this.settingBookingPlanStateDirty();
    this.settingBookingStateDirty();
    this.settingGLStateDirty();
    this.bookingPlanList[index].runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].currency = event?.value;
    this.bookingPlanDetail.runnAccBookingList[bookingIndex].runnAccGLList[GLIndex].currency = event?.value;
    this.bookingDetail.runnAccGLList[GLIndex].currency = event?.value;
    this.gLDetail.currency = event?.value;
    if (event?.value == null) {
      this.CurrencyDropdownConfig.externalError = true;
    }
  }

  settingExternalErrorTrue() {
    this.BalanceMovementTypeDropdownConfig.externalError = true;
    this.NameTextBoxconfig.externalError = true;
    this.StartDateConfig.externalError = true;
    this.SeqNtTextBoxconfig.externalError = true;
    this.OwnerTypeDropdownConfig.externalError = true;
    this.ProductNbrDropdownConfig.externalError = true;
    this.JournalNrTextBoxconfig.externalError = true;
    this.AccountNrTextBoxconfig.externalError = true;
    this.CurrencyDropdownConfig.externalError = true;
    this.PostingKeyDropdownConfig.externalError = true;
    this.OwnerDropdownConfig.externalError = true;
  }

  settingExternalErrorFalse() {
    this.BalanceMovementTypeDropdownConfig.externalError = false;
    this.NameTextBoxconfig.externalError = false;
    this.StartDateConfig.externalError = false;
    this.SeqNtTextBoxconfig.externalError = false;
    this.OwnerTypeDropdownConfig.externalError = false;
    this.ProductNbrDropdownConfig.externalError = false;
    this.JournalNrTextBoxconfig.externalError = false;
    this.AccountNrTextBoxconfig.externalError = false;
    this.CurrencyDropdownConfig.externalError = false;
    this.PostingKeyDropdownConfig.externalError = false;
    this.OwnerDropdownConfig.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updated = this.bookingPlanList.findIndex(x => x.state == DtoState.Created || x.state == DtoState.Dirty);
    if (this.saveBookingPlanData.length > 0 || updated != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onClickYes(bookingPlanList: RunnAccBookingPlanDto[]) {
    this.showDialog = false;
    this.onValidate(bookingPlanList);
    this.onSave(bookingPlanList);
    setTimeout(() => {
      if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
        window.location.assign(this.navigateUrl);
      }
    }, 100)
  }

  onClickNo() {
    this.settingExternalErrorFalse()
    //this.RemoveBusinessError(this.translate.instant('runningAccount.RunnAccBookingPlan.validation.nameBusinessError'));
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }

  onClickCancel() {
    this.showDialog = false;
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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }

    })
  }


  buildConfiguration() {
    const balanceMovementTypeError = new ErrorDto;
    balanceMovementTypeError.validation = "required";
    balanceMovementTypeError.isModelError = true;
    balanceMovementTypeError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.balMov');
    this.BalanceMovementTypeDropdownConfig.required = true;
    this.BalanceMovementTypeDropdownConfig.Errors = [balanceMovementTypeError];

    const nameError = new ErrorDto;
    nameError.validation = "required";
    nameError.isModelError = true;
    nameError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.name');
    this.NameTextBoxconfig.required = true;
    this.NameTextBoxconfig.Errors = [nameError];

    const startDateError = new ErrorDto;
    startDateError.validation = "required";
    startDateError.isModelError = true;
    startDateError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.startDate');
    this.StartDateConfig.required = true;
    this.StartDateConfig.Errors = [startDateError];

    const seqNtError = new ErrorDto;
    seqNtError.validation = "required";
    seqNtError.isModelError = true;
    seqNtError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.seqNt');
    this.SeqNtTextBoxconfig.required = true;
    this.SeqNtTextBoxconfig.Errors = [seqNtError];

    const maxLimitValidation = new ErrorDto;
    maxLimitValidation.validation = "maxError";
    maxLimitValidation.isModelError = true;
    maxLimitValidation.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.numberInt32Check');
    this.maxErrorDto = [maxLimitValidation];
    this.SeqNtTextBoxconfig.maxValueValidation = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.InputIncorrect');

    const ownerTypeError = new ErrorDto;
    ownerTypeError.validation = "required";
    ownerTypeError.isModelError = true;
    ownerTypeError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.ownerType');
    this.OwnerTypeDropdownConfig.required = true;
    this.OwnerTypeDropdownConfig.Errors = [ownerTypeError];

    const productNbrError = new ErrorDto;
    productNbrError.validation = "required";
    productNbrError.isModelError = true;
    productNbrError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.productNbr');
    this.ProductNbrDropdownConfig.required = true;
    this.ProductNbrDropdownConfig.Errors = [productNbrError];

    const journalNrError = new ErrorDto;
    journalNrError.validation = "required";
    journalNrError.isModelError = true;
    journalNrError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.journalNr');
    this.JournalNrTextBoxconfig.required = true;
    this.JournalNrTextBoxconfig.Errors = [journalNrError];
    this.JournalNrTextBoxconfig.maxValueValidation = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.InputIncorrect');

    const accountNrError = new ErrorDto;
    accountNrError.validation = "required";
    accountNrError.isModelError = true;
    accountNrError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.accountNr');
    this.AccountNrTextBoxconfig.required = true;
    this.AccountNrTextBoxconfig.Errors = [accountNrError];
    this.AccountNrTextBoxconfig.maxValueValidation = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.InputIncorrect');

    const currencyError = new ErrorDto;
    currencyError.validation = "required";
    currencyError.isModelError = true;
    currencyError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.currency');
    this.CurrencyDropdownConfig.required = true;
    this.CurrencyDropdownConfig.Errors = [currencyError];

    const postingKeyError = new ErrorDto;
    postingKeyError.validation = "required";
    postingKeyError.isModelError = true;
    postingKeyError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.postalKey');
    this.PostingKeyDropdownConfig.required = true;
    this.PostingKeyDropdownConfig.Errors = [postingKeyError];

    const ownerError = new ErrorDto;
    ownerError.validation = "required";
    ownerError.isModelError = true;
    ownerError.validationMessage = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.owner');
    this.OwnerDropdownConfig.required = true;
    this.OwnerDropdownConfig.Errors = [ownerError];

    this.MinDurationTextBoxconfig.maxValueValidation = this.translate.instant('runningAccount.RunnAccBookingPlan.validation.InputIncorrect');

  }
}

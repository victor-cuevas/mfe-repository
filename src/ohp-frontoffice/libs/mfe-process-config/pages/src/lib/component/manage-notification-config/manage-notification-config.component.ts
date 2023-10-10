import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import {
  FluidButtonConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { CodeTable } from './Models/code-table.model';
import { ManageNotificationInitialData } from './Models/manage-notification-intialdata.model';
import { NotificationConfigDto } from './Models/notification-config.model';
import { NotificationConfig2ProductDto } from './Models/notification-config2ProductDto.model';
import { NotificationConfig2ServicingCustomerDto } from './Models/notification-config2ServicingCustomerDto.model';
import { ManageNotificationConfigService } from './Services/manage-notification-config.service';
import {Dtostate} from './Models/dtobase.model'
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Component({
  selector: 'mprsc-manage-notification-config',
  templateUrl: './manage-notification-config.component.html',
  styleUrls: ['./manage-notification-config.component.scss']
})
export class ManageNotificationConfigComponent implements OnInit {
  @ViewChild('notificationform', { static: true }) notificationform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  public TimingDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ReferenceDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public FollowUpEventDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public EventContextDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ProductLinkDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public ServicingCustomerDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';

  /*CodeTableValues */
  CreditProviderNameList!: CodeTable[];
  EventContextTypeList!: CodeTable[];
  FollowUpEventNameList!: CodeTable[];
  IntervalMeasureList!: CodeTable[];
  ProductNameList!: CodeTable[];
  ReferenceDateTypeList!: CodeTable[];
  TimingList!: CodeTable[];

  initalDataList!: ManageNotificationInitialData;

  /*NotificationList Dto*/
  notificationList!: NotificationConfigDto[];
  notificationData: NotificationConfigDto = new NotificationConfigDto();
  productList!: NotificationConfig2ProductDto[];
  deletedArray: NotificationConfigDto[] = [];

  commonProductList!: CodeTable[];
  commonServicingList!: CodeTable[];

  /*Others*/
  disableText = false;
  disableIntervalMeasure = false;
  showProductGrid = false;
  validationHeader!: string;
  showDialog!: boolean;
  hideCard = true;
  NotificationHeader!: any[];
  navigateURL:any
  exceptionBox= false;
  errorCode !: string;
  highlightNotification :NotificationConfigDto = new NotificationConfigDto()

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedroute: ActivatedRoute,
    private notficationService: ManageNotificationConfigService,
    public validationService: fluidValidationService,
    public router: Router,
    public spinnerService: SpinnerService,
    public commonService:ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('process.Validation.Header');
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    
    this.buildConfiguration();
    this.activatedroute.data.subscribe((data:any) => {
      this.spinnerService.setIsLoading(false);
      this.CreditProviderNameList = data.notificationData.manageNotificationConfigInitialData.creditProviderNameList;
      this.EventContextTypeList = data.notificationData.manageNotificationConfigInitialData.eventContextTypeList;
      this.FollowUpEventNameList = data.notificationData.manageNotificationConfigInitialData.followUpEventNameList;
      this.IntervalMeasureList = data.notificationData.manageNotificationConfigInitialData.intervalMeasureList;
      this.ProductNameList = data.notificationData.manageNotificationConfigInitialData.productNameList;
      this.ReferenceDateTypeList = data.notificationData.manageNotificationConfigInitialData.referenceDateTypeList;
      this.TimingList = data.notificationData.manageNotificationConfigInitialData.timingList;

      const UpdatedData = data.notificationData.notificationConfigList.map((notificationData: NotificationConfigDto) => {
        const updateProductLinkList = notificationData.notificationConfig2ProductList.map(productData => {
          return { ...productData, isReadOnly: true, isDeleted: false };
        });

        const updateServicingList = notificationData.notificationConfig2ServicingCustomerList.map(servicingData => {
          return { ...servicingData, isReadOnly: true, isDeleted: false };
        });

        return {
          ...notificationData,
          randomnumber: this.generateRandomNumber(),
          selectedRow: false,
          notificationConfig2ProductList: updateProductLinkList,
          notificationConfig2ServicingCustomerList: updateServicingList
        };
      });

      this.notificationList = [...UpdatedData];
      this.notificationList[0].selectedRow = true;
      this.highlightNotification = this.notificationList[0]
      this.notificationData = this.notificationList[0];
      this.notificationData.notificationConfig2ProductList = [...this.notificationList[0].notificationConfig2ProductList];
      this.notificationData.notificationConfig2ServicingCustomerList = [
        ...this.notificationList[0].notificationConfig2ServicingCustomerList
      ];
      if (this.notificationData.eventContextType?.caption == 'Credit' && this.notificationData.eventContextType?.codeId == 2) {
        this.showProductGrid = true;
      }
      if (this.notificationData.timing?.codeId == 2 && this.notificationData.timing?.caption == 'On') {
        this.disableIntervalMeasure = true;
        this.disableText = true;
      }
    });
    this.NotificationHeader = [
      { header: this.translate.instant('process.manageNotify.tabel.nrofIntervals'), field: 'nrOfIntervals', width: '15%' },
      { header: this.translate.instant('process.manageNotify.tabel.interval'), field: 'intervalMeasure.caption', width: '15%' },
      { header: this.translate.instant('process.manageNotify.tabel.timing'), field: 'timing.caption', width: '15%' },
      { header: this.translate.instant('process.manageNotify.tabel.referenceDate'), field: 'referenceDateType.caption', width: '25%' },
      { header: this.translate.instant('process.manageNotify.tabel.eventContext'), field: 'eventContextType.caption', width: '22%' },
      {
        header: this.translate.instant('process.manageNotify.tabel.delete'),
        field: 'delete',
        fieldType: 'deleteButton',
        width: '8%',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const timingRequiredError = new ErrorDto();
    timingRequiredError.validation = 'required';
    timingRequiredError.isModelError = true;
    timingRequiredError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.timing') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.TimingDropdownConfig.required = true;
    this.TimingDropdownConfig.Errors = [timingRequiredError];

    const referenceRequiredError = new ErrorDto();
    referenceRequiredError.validation = 'required';
    referenceRequiredError.isModelError = true;
    referenceRequiredError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.dataype') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.ReferenceDropdownConfig.required = true;
    this.ReferenceDropdownConfig.Errors = [referenceRequiredError];

    const followUpRequiredError = new ErrorDto();
    followUpRequiredError.validation = 'required';
    followUpRequiredError.isModelError = true;
    followUpRequiredError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.eventName') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.FollowUpEventDropdownConfig.required = true;
    this.FollowUpEventDropdownConfig.Errors = [followUpRequiredError];

    const eventContextRequiredError = new ErrorDto();
    eventContextRequiredError.validation = 'required';
    eventContextRequiredError.isModelError = true;
    eventContextRequiredError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.eventContext') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.EventContextDropdownConfig.required = true;
    this.EventContextDropdownConfig.Errors = [eventContextRequiredError];

    const productRequiredError = new ErrorDto();
    productRequiredError.validation = 'required';
    productRequiredError.isModelError = true;
    productRequiredError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.product') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.ProductLinkDropdownConfig.required = true;
    this.ProductLinkDropdownConfig.Errors = [productRequiredError];

    const servicingCustomerError = new ErrorDto();
    servicingCustomerError.validation = 'required';
    servicingCustomerError.isModelError = true;
    servicingCustomerError.validationMessage =
      this.translate.instant('process.manageNotify.ValidationError.servicingCustomer') +
      this.translate.instant('process.manageNotify.ValidationError.required');
    this.ServicingCustomerDropdownConfig.required = true;
    this.ServicingCustomerDropdownConfig.Errors = [servicingCustomerError];
  }

  addNotificationConfig() {
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();
    if (this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer) {
      if (this.notificationList.length == 0) {
        this.hideCard = true;
      }
      this.resetError();
      let updatenotificationList = [...this.notificationList];
      updatenotificationList = this.rowDeselectData(updatenotificationList);
      this.notificationData = new NotificationConfigDto();
      this.notificationData.notificationConfig2ProductList = [];
      this.notificationData.notificationConfig2ServicingCustomerList = [];

      this.disableText = false;
      this.disableIntervalMeasure = false;
      this.showProductGrid = false;

      updatenotificationList.push({
        ...this.notificationData,
        selectedRow: true,
        randomnumber: this.generateRandomNumber(),
        state: 1
      });

      this.notificationList = [...updatenotificationList];
      
      this.notificationform.resetForm();
      this.highlightNotification = this.notificationList[this.notificationList.length-1];
    } else {
      this.ThrowError();
    }
  }

  onIntervalChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

    if (selectedIndex >= 0) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.nrOfIntervals = +event.target.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].nrOfIntervals = updategrid.nrOfIntervals;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.nrOfIntervals = +event.target.value;
    }
  }

  onintervalMeasureChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

    if (selectedIndex >= 0) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.intervalMeasure = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].intervalMeasure = updategrid.intervalMeasure;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.intervalMeasure = event.value;
    }
  }

  onTimingChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = [...this.notificationList];
      const updategrid = { ...updateData[selectedIndex] };

      updategrid.timing = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].timing = updategrid.timing;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.timing = event.value;

      if (event.value.codeId == 2 && event.value.caption == 'On') {
        this.notificationList[selectedIndex].nrOfIntervals = 0;
        this.notificationList[selectedIndex].intervalMeasure = null;
        this.notificationData.intervalMeasure = null;
        this.notificationData.nrOfIntervals = 0;
        this.disableIntervalMeasure = true;
        this.disableText = true;
      } else {
        this.disableIntervalMeasure = false;
        this.disableText = false;
      }
    } else if (event?.value == null) {
      const updateData = [...this.notificationList];
      const updategrid = { ...updateData[selectedIndex] };
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].timing = null;
      this.notificationData.timing = null;
      this.notificationList[selectedIndex].state = updategrid.state;

      this.TimingDropdownConfig.externalError = true;
    }
  }

  onreferenceDateTypeChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.referenceDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].referenceDateType = updategrid.referenceDateType;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.referenceDateType = event.value;
    } else if (event?.value == null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.referenceDateType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].referenceDateType = null;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.referenceDateType = null;
      this.ReferenceDropdownConfig.externalError = true;
    }
  }

  onfollowUpEventNameChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEventName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].followUpEventName = updategrid.followUpEventName;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.followUpEventName = event.value;
    } else if (event?.value == null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.followUpEventName = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].followUpEventName = null;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.followUpEventName = null;
      this.FollowUpEventDropdownConfig.externalError = true;
    }
  }

  oneventContextTypeChange(event: any) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventContextType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].eventContextType = updategrid.eventContextType;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.eventContextType = event.value;

      if (event.value.codeId == 2 && event.value.caption == 'Credit') {
        this.showProductGrid = true;
      } else {
        this.showProductGrid = false;
        this.notificationList[selectedIndex].notificationConfig2ProductList = [];
        this.notificationData.notificationConfig2ProductList = [];
      }
    } else if (event?.value == null) {
      const updateData = this.notificationList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.eventContextType = event.value;
      if (updategrid.state != Dtostate.Created) {
        updategrid.state = Dtostate.Dirty;
      }
      this.notificationList[selectedIndex].eventContextType = null;
      this.notificationList[selectedIndex].state = updategrid.state;
      this.notificationData.eventContextType = null;
      this.showProductGrid = false;
      this.EventContextDropdownConfig.externalError = true;
    }
  }

  onRowselect(event: NotificationConfigDto) {
    if (this.notificationform.valid || event.selectedRow) {
      let updatedNotificationData = this.notificationList;
      const eventIndex = updatedNotificationData.findIndex(x => x.selectedRow);

      updatedNotificationData = this.rowDeselectData(updatedNotificationData);

      this.notificationList[eventIndex].selectedRow = updatedNotificationData[eventIndex].selectedRow;

      const selectedIndex = updatedNotificationData.findIndex(x => x.randomnumber == event.randomnumber);

      if (event.timing?.codeId == 2 && event.timing?.caption == 'On') {
        this.disableIntervalMeasure = true;
        this.disableText = true;
      } else {
        this.disableIntervalMeasure = false;
        this.disableText = false;
      }
      if (event.eventContextType?.caption != 'Credit' && event.eventContextType?.codeId != 2) {
        this.showProductGrid = false;
      } else {
        this.showProductGrid = true;
      }
      this.notificationList[selectedIndex].selectedRow = true;

      this.highlightNotification = this.notificationList[selectedIndex]

      this.notificationData = event;
    } else {
      this.ThrowError();
    }
  }

  onRowDelete(event: NotificationConfigDto, notificationList: NotificationConfigDto[]) {
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();

    if ((this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer) || event.selectedRow) {
      const notificationListData = [...notificationList];
      const todeleteIndex = notificationListData.findIndex((data: NotificationConfigDto) => {
        return data?.randomnumber === event?.randomnumber;
      });

      if (todeleteIndex != notificationListData.length - 1) {
        if (notificationListData[todeleteIndex].state == Dtostate.Created) {
          notificationListData.splice(todeleteIndex, 1);
          this.RemoveErrors();
        } else {
          notificationListData[todeleteIndex].state = Dtostate.Deleted;
          this.deletedArray.push({ ...notificationListData[todeleteIndex] });
          notificationListData.splice(todeleteIndex, 1);
          this.RemoveErrors();
        }

        if (notificationListData.length > 0) {
          this.notificationList = this.rowDeselectData(notificationListData);
          this.notificationList[0].selectedRow = true;
          this.notificationData = this.notificationList[0];
          this.highlightNotification = this.notificationList[0];
          this.notificationData.notificationConfig2ProductList = [...this.notificationList[0].notificationConfig2ProductList];
          this.notificationData.notificationConfig2ServicingCustomerList = [
            ...this.notificationList[0].notificationConfig2ServicingCustomerList
          ];
          if (this.notificationData.eventContextType?.caption == 'Credit' && this.notificationData.eventContextType?.codeId == 2) {
            this.showProductGrid = true;
          }
          else {

            this.showProductGrid = false;

          }
          if (this.notificationData.timing?.codeId == 2 && this.notificationData.timing?.caption == 'On') {
            this.disableIntervalMeasure = true;
            this.disableText = true;
          }
          else {

            this.disableIntervalMeasure = false;

            this.disableText = false;

          }
        } else {
          this.notificationList = [];
          this.notificationData = new NotificationConfigDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (notificationListData[todeleteIndex].state == Dtostate.Created) {
          notificationListData.splice(todeleteIndex, 1);
          this.RemoveErrors();
        } else {
          notificationListData[todeleteIndex].state = Dtostate.Deleted;
          this.deletedArray.push({ ...notificationListData[todeleteIndex] });
          notificationListData.splice(todeleteIndex, 1);
          this.RemoveErrors();
        }

        if (notificationListData.length > 0) {
          this.notificationList = this.rowDeselectData(notificationListData);
          this.notificationList[notificationListData.length - 1].selectedRow = true;
          const lastIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
          this.notificationData = this.notificationList[lastIndex];
          this.highlightNotification = this.notificationList[lastIndex];
          this.notificationData.notificationConfig2ProductList = [...this.notificationList[lastIndex].notificationConfig2ProductList];
          this.notificationData.notificationConfig2ServicingCustomerList = [
            ...this.notificationList[lastIndex].notificationConfig2ServicingCustomerList
          ];
          if (this.notificationData.eventContextType?.caption == 'Credit' && this.notificationData.eventContextType?.codeId == 2) {
            this.showProductGrid = true;
          }
          else {

            this.showProductGrid = false;
         }
          if (this.notificationData.timing?.codeId == 2 && this.notificationData.timing?.caption == 'On') {
            this.disableIntervalMeasure = true;
            this.disableText = true;
          }
          else {

            this.disableIntervalMeasure = false;

            this.disableText = false;

          }
        } else {
          this.notificationList = [];
          this.notificationData = new NotificationConfigDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      this.ThrowError();
    }
  }

  onaddProduct() {
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();
    if (this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer) {
      this.resetError();
      const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

      this.commonProductList = this.ProductNameList.filter(val => {
        return !this.notificationList[selectedIndex].notificationConfig2ProductList.find(x => {
          if (!x.isDeleted) {
            return x.productName?.codeId == val?.codeId;
          }
          return false;
        });
      });

      const notificationproductConfig = new NotificationConfig2ProductDto();
      notificationproductConfig.state = 1;
      notificationproductConfig.isReadOnly = false;
      notificationproductConfig.isDeleted = false;
      notificationproductConfig.productNameList = this.commonProductList;
      this.notificationList[selectedIndex].notificationConfig2ProductList.push(notificationproductConfig);
      this.notificationData.notificationConfig2ProductList = this.notificationList[selectedIndex].notificationConfig2ProductList;
    } else {
      this.ThrowError();
    }
  }

  onProductLinkChange(event: any, index: number) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    this.notificationList[selectedIndex].notificationConfig2ProductList[index].productName = event.value;
    this.notificationList[selectedIndex].notificationConfig2ProductList[index].isReadOnly = true;

    if (this.notificationList[selectedIndex].state == Dtostate.Created) {
      this.notificationList[selectedIndex].state = Dtostate.Created;
    } else {
      this.notificationList[selectedIndex].state = Dtostate.Dirty;
    }
  }

  ondropdownDelete(event: NotificationConfig2ProductDto, index: number) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    event.productName = <CodeTable>{};
    setTimeout(() => {
      this.spliceProductDropdown(this.notificationList[selectedIndex].notificationConfig2ProductList, index);
    }, 100);

    if (this.notificationList[selectedIndex].state == Dtostate.Created) {
      this.notificationList[selectedIndex].state = Dtostate.Created;
    } else {
      this.notificationList[selectedIndex].state = Dtostate.Dirty;
    }
  }

  spliceProductDropdown(productList: NotificationConfig2ProductDto[], deleteIndex: number) {
    productList[deleteIndex].isDeleted = true;
  }

  addServicecustomer() {
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();
    if (this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer) {
      this.resetError();
      const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);

      this.commonServicingList = this.CreditProviderNameList.filter(val => {
        return !this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList.find(x => {
          if (!x.isDeleted) {
            return x.creditProviderName?.codeId == val?.codeId;
          }
          return false;
        });
      });

      const notificationServicingCustConfig = new NotificationConfig2ServicingCustomerDto();
      notificationServicingCustConfig.state = 1;
      notificationServicingCustConfig.isReadOnly = false;
      notificationServicingCustConfig.isDeleted = false;
      notificationServicingCustConfig.creditProviderNameList = this.commonServicingList;
      this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList.push(notificationServicingCustConfig);
      this.notificationData.notificationConfig2ServicingCustomerList =
        this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList;
    } else {
      this.ThrowError();
    }
  }
  oncreditProviderNameChange(event: any, index: number) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList[index].creditProviderName = event.value;
    this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList[index].isReadOnly = true;

    if (this.notificationList[selectedIndex].state == Dtostate.Created) {
      this.notificationList[selectedIndex].state = Dtostate.Created;
    } else {
      this.notificationList[selectedIndex].state = Dtostate.Dirty;
    }
  }

  onservicingDelete(event: NotificationConfig2ServicingCustomerDto, index: number) {
    const selectedIndex = this.notificationList.findIndex((x: NotificationConfigDto) => x.selectedRow);
    event.creditProviderName = <CodeTable>{};
    setTimeout(() => {
      this.spliceServicingCustomer(this.notificationList[selectedIndex].notificationConfig2ServicingCustomerList, index);
    }, 100);

    if (this.notificationList[selectedIndex].state == Dtostate.Created) {
      this.notificationList[selectedIndex].state = Dtostate.Created;
    } else {
      this.notificationList[selectedIndex].state = Dtostate.Dirty;
    }
  }

  spliceServicingCustomer(servicingcustomerList: NotificationConfig2ServicingCustomerDto[], deleteIndex: number) {
    servicingcustomerList[deleteIndex].isDeleted = true;
  }

  onSave(notificationList: NotificationConfigDto[]) {
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();
    if (this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer) {
      notificationList.forEach(x => {
        const notDeleted = x.notificationConfig2ProductList.filter(y => y.isDeleted == false);

        x.notificationConfig2ProductList = notDeleted;
      });
      notificationList.forEach(x => {
        const notDeleted = x.notificationConfig2ServicingCustomerList.filter(y => y.isDeleted == false);

        x.notificationConfig2ServicingCustomerList = notDeleted;
      });

      notificationList.map(notificationData => {
        if (notificationData.state != 0) {
          this.deletedArray.push({ ...notificationData });
        }
      });

      this.spinnerService.setIsLoading(true);
      this.notficationService.saveNotification(this.deletedArray).subscribe(
        responsedata => {
          this.spinnerService.setIsLoading(false);
          if (responsedata) {
            this.deletedArray = [];
            this.notficationService.getNotificationData().subscribe(
              (data: any) => {
                this.spinnerService.setIsLoading(false);

                const UpdatedData = data.notificationConfigList.map((notificationData: NotificationConfigDto) => {
                  const updateProductLinkList = notificationData.notificationConfig2ProductList.map(productData => {
                    return { ...productData, isReadOnly: true, isDeleted: false };
                  });

                  const updateServicingList = notificationData.notificationConfig2ServicingCustomerList.map(servicingData => {
                    return { ...servicingData, isReadOnly: true, isDeleted: false };
                  });

                  return {
                    ...notificationData,
                    randomnumber: this.generateRandomNumber(),
                    selectedRow: false,
                    notificationConfig2ProductList: updateProductLinkList,
                    notificationConfig2ServicingCustomerList: updateServicingList
                  };
                });

                this.notificationList = [...UpdatedData];
                const SelectedIndex =  this.notificationList.findIndex(
                 x=>x.nrOfIntervals == this.notificationData.nrOfIntervals &&
                 x.eventContextType?.codeId == this.notificationData.eventContextType?.codeId &&
                 x.intervalMeasure?.codeId == this.notificationData.intervalMeasure?.codeId && 
                 x.timing?.codeId == this.notificationData.timing?.codeId &&
                 x.referenceDateType?.codeId == this.notificationData.referenceDateType?.codeId &&
                 x.followUpEventName?.codeId == this.notificationData.followUpEventName?.codeId &&
                 this.checkProductList(x.notificationConfig2ProductList) &&
                 this.checkServicingCustomerList(x.notificationConfig2ServicingCustomerList)
                );

                this.notificationList[SelectedIndex].selectedRow = true;
                this.notificationData = this.notificationList[SelectedIndex];
                this.highlightNotification = this.notificationList[SelectedIndex]
                this.notificationData.notificationConfig2ProductList = [...this.notificationList[SelectedIndex].notificationConfig2ProductList];
                this.notificationData.notificationConfig2ServicingCustomerList = [
                  ...this.notificationList[SelectedIndex].notificationConfig2ServicingCustomerList
                ];
                if (this.notificationData.eventContextType?.caption == 'Credit' && this.notificationData.eventContextType?.codeId == 2) {
                  this.showProductGrid = true;
                }
                if (this.notificationData.timing?.codeId == 2 && this.notificationData.timing?.caption == 'On') {
                  this.disableIntervalMeasure = true;
                  this.disableText = true;
                }
              },
              err => {
                if(err?.error?.errorCode){
                  this.errorCode = err.error.errorCode;
                }else{
                  this.errorCode= 'InternalServiceFault';
                }
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
          this.spinnerService.setIsLoading(false);
          this.exceptionBox = true;
        }
      );
    } else {
      if (isEmptyProductLink) {
        this.ProductLinkDropdownConfig.externalError = true;
      }
      if (isEmptyServicingCustomer) {
        this.ServicingCustomerDropdownConfig.externalError = true;
      }
    }
  }

  checkProductList(productList:NotificationConfig2ProductDto[]){
    let IsEqual = true;
    if(productList.length == this.notificationData.notificationConfig2ProductList.length){
      for(let i=0;i<productList.length;i++){
        for(let j=i;j<this.notificationData.notificationConfig2ProductList.length;j++){
          if(productList[i].productName.codeId == this.notificationData.notificationConfig2ProductList[j].productName.codeId){
            break;
          }else{
            IsEqual= false;
            break;
          }
        }
        if(!IsEqual){
          break;
        }
      }
    }else{
      IsEqual= false; 
    }
    return IsEqual;
  }

  checkServicingCustomerList(ServicingList:NotificationConfig2ServicingCustomerDto[]){
    let IsEqual = true;
    if(ServicingList.length == this.notificationData.notificationConfig2ServicingCustomerList.length){
      for(let i=0;i<ServicingList.length;i++){
        for(let j=i;j<this.notificationData.notificationConfig2ProductList.length;j++){
          if(ServicingList[i].creditProviderName.codeId == this.notificationData.notificationConfig2ServicingCustomerList[j].creditProviderName.codeId){
            break;
          }else{
            IsEqual= false;
            break;
          }
        }
        if(!IsEqual){
          break;
        }
      }
    }else{
      IsEqual= false; 
    }
    console.log(IsEqual);
    return IsEqual;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }
  rowDeselectData(actiondata: NotificationConfigDto[]) {
    const deSelectData = actiondata;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: NotificationConfigDto) => {
            return {
              ...x,
              selectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }

  ThrowError() {
    this.TimingDropdownConfig.externalError = true;
    this.FollowUpEventDropdownConfig.externalError = true;
    this.EventContextDropdownConfig.externalError = true;
    this.ReferenceDropdownConfig.externalError = true;
    this.ProductLinkDropdownConfig.externalError = true;
    this.ServicingCustomerDropdownConfig.externalError = true;
  }

  resetError() {
    this.TimingDropdownConfig.externalError = false;
    this.FollowUpEventDropdownConfig.externalError = false;
    this.EventContextDropdownConfig.externalError = false;
    this.ReferenceDropdownConfig.externalError = false;
    this.ProductLinkDropdownConfig.externalError = false;
    this.ServicingCustomerDropdownConfig.externalError = false;
  }

  RemoveErrors() {
    const Timing = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.timing') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (Timing >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Timing, 1);
    }

    const DateType = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.dataype') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (DateType >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(DateType, 1);
    }

    const eventName = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.eventName') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (eventName >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(eventName, 1);
    }

    const eventContext = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.eventContext') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (eventContext >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(eventContext, 1);
    }

    const Index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.product') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (Index >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
    }

    const Index1 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('process.manageNotify.ValidationError.servicingCustomer') +
          this.translate.instant('process.manageNotify.ValidationError.required')
    );
    if (Index1 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index1, 1);
    }
  }

  checkProductNotification() {
    if (this.notificationData.notificationConfig2ProductList && this.notificationData.notificationConfig2ProductList.length > 0) {
      for (let i = 0; i < this.notificationData.notificationConfig2ProductList.length; i++) {
        if (
          !this.notificationData.notificationConfig2ProductList[i].productName ||
          this.notificationData.notificationConfig2ProductList[i].productName === <CodeTable>{}
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkServicingCustomerNotification() {
    if (
      this.notificationData.notificationConfig2ServicingCustomerList &&
      this.notificationData.notificationConfig2ServicingCustomerList.length > 0
    ) {
      for (let i = 0; i < this.notificationData.notificationConfig2ServicingCustomerList.length; i++) {
        if (
          !this.notificationData.notificationConfig2ServicingCustomerList[i].creditProviderName ||
          this.notificationData.notificationConfig2ServicingCustomerList[i].creditProviderName === <CodeTable>{}
        ) {
          return true;
        }
      }
    }
    return false;
  }

  onClose() {

    const isChangedIndexExist = this.notificationList.findIndex(x => x.state == 3 || x.state == 1);
    const isChangedServicingCust =this.notificationData.notificationConfig2ServicingCustomerList.findIndex(x => x.state == 3 || x.state == 1)
    const isChangedProduct = this.notificationData.notificationConfig2ProductList.findIndex(x => x.state == 3 || x.state == 1);
    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0 || isChangedServicingCust>=0) {
      this.showDialog = true;
    } else {
      this.RemoveErrors();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(notificationList: NotificationConfigDto[]) {
    this.showDialog = false;
    const isEmptyProductLink = this.checkProductNotification();
    const isEmptyServicingCustomer = this.checkServicingCustomerNotification();
    if(this.notificationform.valid && !isEmptyProductLink && !isEmptyServicingCustomer){
      this.onSave(notificationList);
      window.location.assign(this.navigateURL);
    }else{
      if (isEmptyProductLink) {
        this.ProductLinkDropdownConfig.externalError = true;
      }
      if (isEmptyServicingCustomer) {
        this.ServicingCustomerDropdownConfig.externalError = true;
      }
    }
   
  }

  onDialogNo() {
    this.showDialog = false;
    this.RemoveErrors();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException(){
    this.exceptionBox = false;
  }
}

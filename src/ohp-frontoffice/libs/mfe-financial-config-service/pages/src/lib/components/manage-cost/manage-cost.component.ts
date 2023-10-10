import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FluidAutoCompleteConfig, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '@close-front-office/mfe-financial-config-service/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { ManageCostService } from './service/manage-cost.service';
import { getAllCostResponse } from './Models/getAllCostResponse.model';
import { reminderCost } from './Models/remainderCost.model';
import { postageCost } from './Models/postageCost.model';
import { mutationCost } from './Models/mutationCost.model';
import { productRef } from './Models/productRef.model';
import { creditProviderRef } from './Models/creditProvider.model';
import { mutationType } from './Models/mutationType.model';
import { stateModel } from './Models/state.model';
import { codeTable } from './Models/codeTable.model';
import { DatePipe } from '@angular/common';
import { TabView } from 'primeng/tabview';
import { DecimalTransformPipe } from '@close-front-office/shared/fluid-controls';

@Component({
  selector: 'mfcs-manage-cost',
  templateUrl: './manage-cost.component.html',
  styleUrls: ['./manage-cost.component.scss']
})
export class ManageCostComponent implements OnInit {
  @ViewChild("searchCriteriaform", { static: true }) searchCriteriaform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public ReminderAmountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PostageAmountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public MutationAmountTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public AutoCompleteTextBoxconfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public ReminderStartDateDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public PostageStartDateDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public MutationStartDateDateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  placeholder = 'select';
  getAllCostsResponse!: getAllCostResponse;
  postData: getAllCostResponse = new getAllCostResponse;
  remainderCostCard!: reminderCost;
  postageCostCard!: postageCost;
  mutationCostCard!: mutationCost;
  reminderIndex: any
  postageIndex: any
  mutationIndex: any
  Header = this.translate.instant('financial.validations.Header')
  filteredcountries: codeTable[] = [];
  deletedMutationRecords: mutationCost[] = [];
  deletedReminderRecords: reminderCost[] = [];
  deletedPostageRecords: postageCost[] = [];
  MutationDup: mutationCost[] = [];
  ReminderDup: reminderCost[] = [];
  PostageDup: postageCost[] = [];
  RCostHeader!: any[];
  PostageHeader!: any[];
  MutationHeader!: any[];
  defaultDate!: Date
  reminderBusinessError = this.translate.instant('financial.ManageCost.mandatory.reminderbusiness')
  postageBusinessError = this.translate.instant('financial.ManageCost.mandatory.postagebusiness')
  mutationBusinessError = this.translate.instant('financial.ManageCost.mandatory.mutationbusiness')
  navigateUrl!: string
  isErrors!: boolean
  show!: boolean
  exceptionBox!: boolean
  NothideReminder!: boolean
  NothidePostage!: boolean
  NothideMutation!: boolean
  SelectedTabIndex!: number
  currentTabIndex!: number
  errorCode!: string

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public manageCostService: ManageCostService,
    public fluidValidation: fluidValidationService, public route: ActivatedRoute,
    public spinnerService: SpinnerService, public commonService: ConfigContextService, public datePipe: DatePipe, public decimalpipe: DecimalTransformPipe) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
    this.SelectedTabIndex = 0;
    this.currentTabIndex = 0;
  }

  handleChange(event: any) {

    const currentIndex = this.currentTabIndex
    let isCurrentTabValid = true;
    if (currentIndex == 0) {
      if (this.isReminderBusinessError()) {
        this.throwBusinessError(this.reminderBusinessError);
        isCurrentTabValid = false
      }
      else {
        this.RemoveBusinessError(this.reminderBusinessError);
      }
      if (isCurrentTabValid) {
        this.userDetailsform.valid ? isCurrentTabValid = true : isCurrentTabValid = false
      }
     
    }
    else if (currentIndex == 1) {
      if (this.isPostageBusinessError()) {
        this.throwBusinessError(this.postageBusinessError);
        isCurrentTabValid = false
      }
      else {
        this.RemoveBusinessError(this.postageBusinessError);

      }
      if (isCurrentTabValid) {
        this.userDetailsform.valid ? isCurrentTabValid = true : isCurrentTabValid = false
      }
    }
    else {
      if (this.isMutationBusinessError()) {
        this.throwBusinessError(this.mutationBusinessError);
        isCurrentTabValid = false
      }
      else {
        this.RemoveBusinessError(this.mutationBusinessError);

      }
      if (isCurrentTabValid) {
        this.userDetailsform.valid ? isCurrentTabValid = true : isCurrentTabValid = false
      }
    }

    if (isCurrentTabValid) {
      this.SelectedTabIndex = event.index;
      this.currentTabIndex = event.index
    }
    else {
      setTimeout(() => {
        this.SelectedTabIndex = currentIndex;
      }, 0);
    }
   
  }

  

    //Reminder Cost
  SettingReminderFalse() {
    if (this.getAllCostsResponse.reminderCostList.length > 0) {
      this.getAllCostsResponse.reminderCostList.forEach(x => {
        x.isEntered = false;
      })
    }

  }

  isReminderBusinessError(): boolean {

    this.ReminderDup = this.getAllCostsResponse.reminderCostList.reduce((array: reminderCost[], current) => {
      if ((
        !array.some(
          (item: reminderCost) => item.modifiedDate == current.modifiedDate &&
            item.product?.productNrAndName == current.product?.productNrAndName &&
            item.creditProvider?.name?.caption == current.creditProvider?.name?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.ReminderDup.length != this.getAllCostsResponse.reminderCostList.length) {

      return true;
    }
    else {

      this.ReminderDup = [];
      return false;
    }

  }

  clickReminderGrid(dataselected: reminderCost) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

        if (!this.isReminderBusinessError()) {
         this.SettingReminderFalse();
        this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(item => {
            return item == dataselected
          })
        this.getAllCostsResponse.reminderCostList[this.reminderIndex].isEntered = true;
          this.remainderCostCard = dataselected;
          this.RemoveBusinessError(this.reminderBusinessError);

        }
        else {
          this.throwBusinessError(this.reminderBusinessError);
        }

      }
      else {
        this.ReminderStartDateDateconfig.externalError = true;
        this.ReminderAmountTextBoxconfig.externalError = true;
        
      }
    }
  }

  addReminderRow() {
    
    if ((this.userDetailsform.valid) ||
      this.getAllCostsResponse.reminderCostList.length == 0) {

      if (!this.isReminderBusinessError()) {
      const reminderCostObj = new reminderCost();
        this.SettingReminderFalse();
      reminderCostObj.isEntered = true;
      reminderCostObj.state = stateModel.Created;
      reminderCostObj.pKey = 0;
      reminderCostObj.canValidate = false;
      reminderCostObj.rowVersion = 0;
      const zero = 0;
      reminderCostObj.amount = zero;
      reminderCostObj.startDate = this.defaultDate;
        reminderCostObj.modifiedDate = this.datePipe.transform(this.defaultDate, 'dd/MM/yyyy')
        let floatValue = parseFloat((zero.toString())).toFixed(2);
        floatValue = floatValue.toString().replace('.', ',');
        reminderCostObj.modifiedAmount = floatValue;
      const newlist = this.getAllCostsResponse.reminderCostList;
      newlist.push({ ...reminderCostObj });
      this.getAllCostsResponse.reminderCostList = [...newlist];
      this.remainderCostCard = new reminderCost();
      this.remainderCostCard = this.getAllCostsResponse.reminderCostList[this.getAllCostsResponse.reminderCostList.length - 1]
      
      this.NothideReminder = true;
       this.RemoveBusinessError(this.reminderBusinessError)
       this.ReminderStartDateDateconfig.externalError = false;
        this.ReminderAmountTextBoxconfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.reminderBusinessError)
      }

    }
    else {
      this.ReminderStartDateDateconfig.externalError = true;
      this.ReminderAmountTextBoxconfig.externalError = true;
    }
  }

  onReminderRowDelete(event: reminderCost, array: reminderCost[]) {


    if (this.userDetailsform.valid || ((event.amount == null || event.startDate == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)

      if (!this.isReminderBusinessError() || (this.isReminderBusinessError() && event.isEntered)) {

        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedReminderRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.getAllCostsResponse.reminderCostList = [...array];
        if (this.getAllCostsResponse.reminderCostList.length == 0) {
          setTimeout(() => {
            this.NothideReminder = false;
          }, 5);
          
        }
        if (this.getAllCostsResponse.reminderCostList.length > 0) {
          this.SettingReminderFalse();

          this.remainderCostCard = this.getAllCostsResponse.reminderCostList[0]
          this.getAllCostsResponse.reminderCostList[0].isEntered = true;

        }
        this.RemoveBusinessError(this.reminderBusinessError);
        this.ReminderStartDateDateconfig.externalError = false;
        this.ReminderAmountTextBoxconfig.externalError = false;
      }
      else {
        this.throwBusinessError(this.reminderBusinessError);
    }
    }
    else {
      this.ReminderStartDateDateconfig.externalError = true;
      this.ReminderAmountTextBoxconfig.externalError = true;
    }

  }

  changeReminderStartDate(event: any) {

    this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.reminderCostList[this.reminderIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].state = stateModel.Dirty;
    }
    if (event != null) {

      this.remainderCostCard.startDate = event;
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].startDate = event;
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].modifiedDate = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.remainderCostCard.startDate = null as unknown as Date
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].startDate = null as unknown as Date;
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].modifiedDate = ''
      if (this.isReminderBusinessError()) {
        this.throwBusinessError(this.reminderBusinessError)
      }
      else {
        this.RemoveBusinessError(this.reminderBusinessError)
      }
      this.ReminderStartDateDateconfig.externalError = true;
    }
  }

  changeReminderAmount(event: any,isChanged:boolean) {

    this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.reminderCostList[this.reminderIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].state = stateModel.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

          this.getAllCostsResponse.reminderCostList[this.reminderIndex].amount = parseFloat(floatValue)
          this.getAllCostsResponse.reminderCostList[this.reminderIndex].modifiedAmount = event;
        
        this.remainderCostCard.amount = parseFloat(floatValue);

      }
     
    }
    else {
     
      this.remainderCostCard.amount = event;

      setTimeout(() => {
        this.remainderCostCard.amount = null as unknown as number;
        this.getAllCostsResponse.reminderCostList[this.reminderIndex].modifiedAmount = '';
        this.ReminderAmountTextBoxconfig.externalError=true

      }, 3)

    }
  }

  changeReminderProduct(event:any) {

    this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.reminderCostList[this.reminderIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      console.log(event?.value)
      this.remainderCostCard.product = event?.value;
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].product = event?.value;
    }
    else {
      this.remainderCostCard.product = null as unknown as productRef
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].product = null as unknown as productRef
      if (this.isReminderBusinessError()) {
        this.throwBusinessError(this.reminderBusinessError)
      }
      else {
        this.RemoveBusinessError(this.reminderBusinessError)
      }
    }
  }

  changeReminderCreditProvider(event: any) {

    this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.reminderCostList[this.reminderIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      console.log(event?.value)
      this.remainderCostCard.creditProvider = event?.value;
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].creditProvider = event?.value;
    }
    else {
      this.remainderCostCard.creditProvider = null as unknown as creditProviderRef
      this.getAllCostsResponse.reminderCostList[this.reminderIndex].creditProvider = null as unknown as creditProviderRef
      if (this.isReminderBusinessError()) {
        this.throwBusinessError(this.reminderBusinessError)
      }
      else {
        this.RemoveBusinessError(this.reminderBusinessError)
      }
    }
  }

 //Postage Cost
  SettingPostageFalse() {
    if (this.getAllCostsResponse.postageCostList.length > 0) {
      this.getAllCostsResponse.postageCostList.forEach(x => {
        x.isEntered = false;
      })
    }

  }

  isPostageBusinessError(): boolean {

    this.PostageDup = this.getAllCostsResponse.postageCostList.reduce((array: postageCost[], current) => {
      if ((
        !array.some(
          (item: postageCost) => item.modifiedDate == current.modifiedDate &&
            item.country?.caption == current.country?.caption &&
            item.registered == current.registered
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.PostageDup.length != this.getAllCostsResponse.postageCostList.length) {

      return true;
    }
    else {

      this.PostageDup = [];
      return false;
    }

  }

  clickPostageGrid(dataselected: postageCost) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

         if (!this.isPostageBusinessError()) {
         this.SettingPostageFalse();
        this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(item => {
          return item == dataselected
        })
        this.getAllCostsResponse.postageCostList[this.postageIndex].isEntered = true;
           this.postageCostCard = new postageCost()
           setTimeout(() => {
             this.postageCostCard = dataselected;

           }, 2)

           this.RemoveBusinessError(this.postageBusinessError);

        }
        else {
        this.throwBusinessError(this.postageBusinessError);
         }

      }
      else {
        this.PostageStartDateDateconfig.externalError = true;
        this.PostageAmountTextBoxconfig.externalError = true;
        
      }
    }
  }

  addPostageRow() {
    
    if ((this.userDetailsform.valid) ||
      this.getAllCostsResponse.postageCostList.length == 0) {

      if (!this.isPostageBusinessError()) {
      const postageCostObj = new postageCost();
      this.SettingPostageFalse();
      postageCostObj.isEntered = true;
      postageCostObj.state = stateModel.Created;
      postageCostObj.pKey = 0;
      postageCostObj.canValidate = false;
      postageCostObj.rowVersion = 0;
      const zero = 0;
      postageCostObj.amount = zero;
      postageCostObj.startDate = this.defaultDate;
        postageCostObj.modifiedDate = this.datePipe.transform(this.defaultDate, 'dd/MM/yyyy')
        postageCostObj.registered = false;
        postageCostObj.modifiedRegistered = this.translate.instant('financial.dialog.No');
        let floatValue = parseFloat((zero.toString())).toFixed(2);
        floatValue = floatValue.toString().replace('.', ',');
        postageCostObj.modifiedAmount = floatValue;
      const newlist = this.getAllCostsResponse.postageCostList;
      newlist.push({ ...postageCostObj });
      this.getAllCostsResponse.postageCostList = [...newlist];
      this.postageCostCard = new postageCost(); 
        this.postageCostCard = this.getAllCostsResponse.postageCostList[this.getAllCostsResponse.postageCostList.length - 1]
        this.NothidePostage = true;
      this.RemoveBusinessError(this.postageBusinessError)
      this.PostageStartDateDateconfig.externalError = false;
      this.PostageAmountTextBoxconfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.postageBusinessError)
      }

    }
    else {
      this.PostageStartDateDateconfig.externalError = true;
      this.PostageAmountTextBoxconfig.externalError = true;
    }
  }

  onPostageRowDelete(event: postageCost, array: postageCost[]) {


    if (this.userDetailsform.valid || ((event.amount == null || event.startDate == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if (!this.isPostageBusinessError() || (this.isPostageBusinessError() && event.isEntered)) {

        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedPostageRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.getAllCostsResponse.postageCostList = [...array];
        if (this.getAllCostsResponse.postageCostList.length == 0) {
          setTimeout(() => {
            this.NothidePostage = false;
          }, 5);
         
        }
        if (this.getAllCostsResponse.postageCostList.length > 0) {
          this.SettingPostageFalse();

          this.postageCostCard = this.getAllCostsResponse.postageCostList[0]
          this.getAllCostsResponse.postageCostList[0].isEntered = true;

        }
        this.RemoveBusinessError(this.postageBusinessError);
        this.PostageStartDateDateconfig.externalError = false;
        this.PostageAmountTextBoxconfig.externalError = false;
      }
      else {
         this.RemoveBusinessError(this.postageBusinessError);
      }
    }
    else {
      this.PostageStartDateDateconfig.externalError = true;
      this.PostageAmountTextBoxconfig.externalError = true;
    }

  }

  changePostageStartDate(event: any) {

    this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.postageCostList[this.postageIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.postageCostList[this.postageIndex].state = stateModel.Dirty;
    }

    if (event != null) {

      this.postageCostCard.startDate = event;
      this.getAllCostsResponse.postageCostList[this.postageIndex].startDate = event;
      this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedDate = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.postageCostCard.startDate = null as unknown as Date
      this.getAllCostsResponse.postageCostList[this.postageIndex].startDate = null as unknown as Date
      this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedDate = ''
      if (this.isPostageBusinessError()) {
        this.throwBusinessError(this.postageBusinessError)
      }
      else {
        this.RemoveBusinessError(this.postageBusinessError)
      }
      this.PostageStartDateDateconfig.externalError = true;
    }
  }

  changePostageAmount(event: any, isChanged: boolean) {

    this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.postageCostList[this.postageIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.postageCostList[this.postageIndex].state = stateModel.Dirty;
    }

    if (event != null) {

      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

          this.getAllCostsResponse.postageCostList[this.postageIndex].amount = parseFloat(floatValue);
          this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedAmount = event

        this.postageCostCard.amount = parseFloat(floatValue);
      }
      
    }
    else {
      this.postageCostCard.amount = event
      setTimeout(() => {

        this.getAllCostsResponse.postageCostList[this.postageIndex].amount = null as unknown as number;
        this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedAmount=''
        this.PostageAmountTextBoxconfig.externalError = true;

      }, 10)
    }
  }

  changePostageCountry(event: any) {

    this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.postageCostList[this.postageIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.postageCostList[this.postageIndex].state = stateModel.Dirty;
    }

    if (event != null) {

      this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(get => {
        return get.isEntered == true;
      })

      if (this.getAllCostsResponse.postageCostList[this.postageIndex].state == stateModel.Unknown) {
        this.getAllCostsResponse.postageCostList[this.postageIndex].state = stateModel.Dirty;
      }

      const country = this.getAllCostsResponse.countryList.filter(x => {
       return x.caption == event?.caption;
      })
      if (country[0] != null) {
       
        this.postageCostCard.country = country[0];
        this.getAllCostsResponse.postageCostList[this.postageIndex].country = country[0];
       
      }
    }
    else {
      this.postageCostCard.country = null as unknown as codeTable
      this.getAllCostsResponse.postageCostList[this.postageIndex].country = null as unknown as codeTable
      if (this.isPostageBusinessError()) {
        this.throwBusinessError(this.postageBusinessError)
      }
      else {
        this.RemoveBusinessError(this.postageBusinessError)
      }
    }
  }

  filterCountry(event: any) {
    if (event) {
      this.filteredcountries = [];

      this.getAllCostsResponse.countryList
        .filter(data => {
          if (data.caption?.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filteredcountries.push(data);
          }

        });
    }
  }

  

  changePostageRegistered(event: any) {

    this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.postageCostList[this.postageIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.postageCostList[this.postageIndex].state = stateModel.Dirty;
    }

    if (event != null) {
      console.log(event)
      this.postageCostCard.registered = event;
      this.getAllCostsResponse.postageCostList[this.postageIndex].registered = event;
      if (event) {
        this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedRegistered = this.translate.instant('financial.dialog.Yes');
      }
      else {
        this.getAllCostsResponse.postageCostList[this.postageIndex].modifiedRegistered = this.translate.instant('financial.dialog.No');

      }
      if (this.isPostageBusinessError()) {
        this.throwBusinessError(this.postageBusinessError)
      }
      else {
        this.RemoveBusinessError(this.postageBusinessError)
      }
    }
  }

  

 //Mutation Cost
  SettingMutationFalse() {
    if (this.getAllCostsResponse.mutationCostList.length > 0) {
      this.getAllCostsResponse.mutationCostList.forEach(x => {
        x.isEntered = false;
      })
    }

  }

  isMutationBusinessError(): boolean {

    this.MutationDup = this.getAllCostsResponse.mutationCostList.reduce((array: mutationCost[], current) => {
      if ((
        !array.some(
          (item: mutationCost) => item.modifiedDate == current.modifiedDate &&
            item.mutationType?.caption == current.mutationType?.caption &&
            item.creditProvider?.name?.caption == current.creditProvider?.name?.caption
        ))
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (this.MutationDup.length != this.getAllCostsResponse.mutationCostList.length) {

      return true;
    }
    else {

      this.MutationDup = [];
      return false;
    }

  }

  clickMutationGrid(dataselected: mutationCost) {
    if (dataselected) {

      if (this.userDetailsform.valid || dataselected.isEntered) {

         if (!this.isMutationBusinessError()) {
         this.SettingMutationFalse();
        this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(item => {
          return item == dataselected
        })
        this.getAllCostsResponse.mutationCostList[this.mutationIndex].isEntered = true;
           this.mutationCostCard = dataselected;
           this.RemoveBusinessError(this.mutationBusinessError);

        }
        else {
        this.throwBusinessError(this.mutationBusinessError);
         }

      }
      else {
        this.PostageStartDateDateconfig.externalError = true;
        this.PostageAmountTextBoxconfig.externalError = true;
       
      }
    }
  }

  onMutationRowDelete(event: mutationCost, array: mutationCost[]) {


    if (this.userDetailsform.valid || ((event.amount == null || event.startDate == null) &&
      event.isEntered)) {
      const deletedata = array.findIndex(data => {
        return data == event;
      })
      console.log(deletedata)
      if (!this.isMutationBusinessError() || (this.isMutationBusinessError() && event.isEntered)) {

        if (event.state != stateModel.Created) {
          event.state = stateModel.Deleted;
          this.deletedMutationRecords.push({ ...event })
        }
        array.splice(deletedata, 1);
        this.getAllCostsResponse.mutationCostList = [...array];
        if (this.getAllCostsResponse.mutationCostList.length == 0) {
          setTimeout(() => {
            this.NothideMutation = false;
          }, 5);
          
        }
        if (this.getAllCostsResponse.mutationCostList.length > 0) {
          this.SettingMutationFalse();

          this.mutationCostCard = this.getAllCostsResponse.mutationCostList[0]
          this.getAllCostsResponse.mutationCostList[0].isEntered = true;

        }
        this.RemoveBusinessError(this.mutationBusinessError);
        this.MutationStartDateDateconfig.externalError = false;
        this.MutationAmountTextBoxconfig.externalError = false;
      }
      else {
          this.throwBusinessError(this.mutationBusinessError);
      }
    }
    else {
      this.MutationStartDateDateconfig.externalError = true;
      this.MutationAmountTextBoxconfig.externalError = true;
    }

  }

  addMutationRow() {
     if ((this.userDetailsform.valid) ||
      this.getAllCostsResponse.mutationCostList.length == 0) {

      if (!this.isMutationBusinessError()) {
      const mutationCostObj = new mutationCost();
      this.SettingMutationFalse();
      mutationCostObj.isEntered = true;
      mutationCostObj.state = stateModel.Created;
      mutationCostObj.pKey = 0;
      mutationCostObj.canValidate = false;
      mutationCostObj.rowVersion = 0;
      const zero = 0;
      mutationCostObj.amount = zero;
      mutationCostObj.startDate = this.defaultDate;
        mutationCostObj.modifiedDate = this.datePipe.transform(this.defaultDate, 'dd/MM/yyyy')
        let floatValue = parseFloat((zero.toString())).toFixed(2);
        floatValue = floatValue.toString().replace('.', ',');
        mutationCostObj.modifiedAmount = floatValue;
      const newlist = this.getAllCostsResponse.mutationCostList;
      newlist.push({ ...mutationCostObj });
      this.getAllCostsResponse.mutationCostList = [...newlist];
      this.mutationCostCard = new mutationCost();
        this.mutationCostCard = this.getAllCostsResponse.mutationCostList[this.getAllCostsResponse.mutationCostList.length - 1]
        this.NothideMutation = true;
      this.RemoveBusinessError(this.mutationBusinessError)
      this.MutationStartDateDateconfig.externalError = false;
      this.MutationAmountTextBoxconfig.externalError = false;

      }
      else {
        this.throwBusinessError(this.mutationBusinessError)
      }

    }
    else {
      this.MutationStartDateDateconfig.externalError = true;
      this.MutationAmountTextBoxconfig.externalError = true;
      
    }
  }

  changeMutationStartDate(event: any) {

    this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.mutationCostList[this.mutationIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].state = stateModel.Dirty;
    }

    if (event != null) {

      this.mutationCostCard.startDate = event;
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].startDate = event;
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].modifiedDate = this.datePipe.transform(event, 'dd/MM/yyyy')

    }
    else {
      this.mutationCostCard.startDate = null as unknown as Date
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].startDate = null as unknown as Date
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].modifiedDate = '';
      if (this.isMutationBusinessError()) {
        this.throwBusinessError(this.mutationBusinessError)
      }
      else {
        this.RemoveBusinessError(this.mutationBusinessError)
      }
      this.MutationStartDateDateconfig.externalError = true;
    }
  }

  changeMutationAmount(event: any,ischanged:boolean) {

    this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.mutationCostList[this.mutationIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].state = stateModel.Dirty;
    }

    if (event != null) {

      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('')
        const value = eventConversion.toString().replace(',', '.')
        const floatValue = parseFloat(value).toFixed(2);

          this.getAllCostsResponse.mutationCostList[this.mutationIndex].amount = parseFloat(floatValue);
          this.getAllCostsResponse.mutationCostList[this.mutationIndex].modifiedAmount = event
      
        this.mutationCostCard.amount = parseFloat(floatValue);
      }
     
    }
    else {
      this.mutationCostCard.amount = event
     
      setTimeout(() => {

        this.getAllCostsResponse.mutationCostList[this.mutationIndex].amount = null as unknown as number;
        this.getAllCostsResponse.mutationCostList[this.mutationIndex].modifiedAmount = '';
        this.MutationAmountTextBoxconfig.externalError = true;

      }, 10)
     
    }
  }

  changeMutationType(event:any) {

    this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.mutationCostList[this.mutationIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      console.log(event?.value)
      this.mutationCostCard.mutationType = event?.value;
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].mutationType = event?.value;
    }
    else {
      this.mutationCostCard.mutationType = null as unknown as mutationType
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].mutationType = null as unknown as mutationType
      if (this.isMutationBusinessError()) {
        this.throwBusinessError(this.mutationBusinessError)
      }
      else {
        this.RemoveBusinessError(this.mutationBusinessError)
      }
    }
  }

  changeMutationCreditProvider(event: any) {

    this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(get => {
      return get.isEntered == true;
    })

    if (this.getAllCostsResponse.mutationCostList[this.mutationIndex].state == stateModel.Unknown) {
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].state = stateModel.Dirty;
    }

    if (event?.value != null) {
      console.log(event?.value)
      this.mutationCostCard.creditProvider = event?.value;
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].creditProvider = event?.value;
    }
    else {
      this.mutationCostCard.creditProvider = null as unknown as creditProviderRef
      this.getAllCostsResponse.mutationCostList[this.mutationIndex].creditProvider = null as unknown as creditProviderRef
      if (this.isMutationBusinessError()) {
        this.throwBusinessError(this.mutationBusinessError)
      }
      else {
        this.RemoveBusinessError(this.mutationBusinessError)
      }
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
    const unsavedReminder = this.getAllCostsResponse.reminderCostList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    const unsavedPostage = this.getAllCostsResponse.postageCostList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    const unsavedMutation = this.getAllCostsResponse.mutationCostList.findIndex(x => {
      return x.state == stateModel.Created || x.state == stateModel.Dirty
    })
    if (this.deletedMutationRecords.length > 0 || unsavedReminder != -1 || unsavedPostage != -1 ||
      unsavedMutation != -1 || this.deletedPostageRecords.length > 0 || this.deletedMutationRecords.length > 0) {
     this.show = true;
    }
    else {
      this.show = false;
      window.location.assign(this.navigateUrl);

    }
  }
  onYes(GridData: getAllCostResponse) {
   this.show = false;
    this.onSave(GridData);
    if (!this.isErrors) {
      window.location.assign(this.navigateUrl);

    }
  }
  onNo() {
    this.show = false;
    this.RemoveBusinessError(this.reminderBusinessError)
    this.RemoveBusinessError(this.mutationBusinessError)
    this.RemoveBusinessError(this.postageBusinessError)
    this.ReminderStartDateDateconfig.externalError = false;
    this.ReminderAmountTextBoxconfig.externalError = false;
    this.PostageStartDateDateconfig.externalError = false;
    this.PostageAmountTextBoxconfig.externalError = false;
    this.MutationStartDateDateconfig.externalError = false;
    this.MutationAmountTextBoxconfig.externalError = false;
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
   
    this.RCostHeader = [
      { header: this.translate.instant('financial.ManageCost.tabel.valid'), field: 'modifiedDate', width: '20%', dateSort:'startDate' },
      { header: this.translate.instant('financial.ManageCost.tabel.amount'), field: 'modifiedAmount', width: '20%', amountSort: 'amount' },
      { header: this.translate.instant('financial.ManageCost.tabel.linked'), field: 'product.productNrAndName', width: '30%' },
      { header: this.translate.instant('financial.ManageCost.tabel.creditProvider'), field: 'creditProvider.name.caption', width: '25%' },
      { header: this.translate.instant('financial.ManageCost.tabel.'), field: '', width: '5%',fieldType:'deleteButton' },

    ];

   
    this.PostageHeader = [
      { header: this.translate.instant('financial.ManageCost.tabel.validP'), field: 'modifiedDate', width: '20%', dateSort: 'startDate' },
      { header: this.translate.instant('financial.ManageCost.tabel.amountP'), field: 'modifiedAmount', width: '20%', amountSort: 'amount' },
      { header: this.translate.instant('financial.ManageCost.tabel.Country'), field: 'country.caption', width: '30%' },
      { header: this.translate.instant('financial.ManageCost.tabel.Registered'), field: 'modifiedRegistered', width: '25%' },
      { header: this.translate.instant('financial.ManageCost.tabel.'), field: '', width: '5%', fieldType: 'deleteButton' },

    ];

   
    this.MutationHeader = [
      { header: this.translate.instant('financial.ManageCost.tabel.validM'), field: 'modifiedDate', width: '20%', dateSort: 'startDate' },
      { header: this.translate.instant('financial.ManageCost.tabel.amountM'), field: 'modifiedAmount', width: '20%', amountSort: 'amount' },
      { header: this.translate.instant('financial.ManageCost.tabel.CreditProviderM'), field: 'creditProvider.name.caption', width: '30%' },
      { header: this.translate.instant('financial.ManageCost.tabel.MutationType'), field: 'mutationType.caption', width: '25%' },
      { header: this.translate.instant('financial.ManageCost.tabel.'), field: '', width: '5%', fieldType: 'deleteButton' }
    ]

    this.buildConfiguration()

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false)
     
        const getResponse = res.manageCostData
        this.getAllCostsResponse = { ...getResponse };

      console.log(this.getAllCostsResponse)
      
      if (this.getAllCostsResponse.currentDate != null) {
        this.defaultDate = new Date(this.getAllCostsResponse.currentDate)
      }
        if (this.getAllCostsResponse.postageCostList.length > 0) {
          this.getAllCostsResponse.postageCostList.forEach(x => {
            if (x.registered) {
              x.modifiedRegistered = this.translate.instant('financial.dialog.Yes');

            }
            else {
              x.modifiedRegistered = this.translate.instant('financial.dialog.No');
            }
          })
        }

        this.getAllCostsResponse.reminderCostList.forEach(x => {
          x.startDate = new Date(x.startDate);
          x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
          x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
          x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
        })

        this.deletedReminderRecords = [...new Array<reminderCost>()]
        this.deletedPostageRecords = [...new Array<postageCost>()]
        this.deletedMutationRecords = [...new Array<mutationCost>()]

        this.reminderIndex = 0;
        if (this.getAllCostsResponse.reminderCostList.length > 0) {
          this.NothideReminder = true;
          this.SettingReminderFalse();
          this.getAllCostsResponse.reminderCostList[this.reminderIndex].isEntered = true;
          this.remainderCostCard = this.getAllCostsResponse.reminderCostList[this.reminderIndex];
        }


        this.getAllCostsResponse.postageCostList.forEach(x => {
          x.startDate = new Date(x.startDate);
          x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
          x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
          x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
        })
        this.postageIndex = 0;
        if (this.getAllCostsResponse.postageCostList.length > 0) {
          this.NothidePostage = true;
          this.SettingPostageFalse();
          this.getAllCostsResponse.postageCostList[this.postageIndex].isEntered = true;
          this.postageCostCard = this.getAllCostsResponse.postageCostList[this.postageIndex];
        }


        this.getAllCostsResponse.mutationCostList.forEach(x => {
          x.startDate = new Date(x.startDate);
          x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
          x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
          x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
        })
        

        this.mutationIndex = 0;
        if (this.getAllCostsResponse.mutationCostList.length > 0) {
          this.NothideMutation = true;
          this.SettingMutationFalse();
          this.getAllCostsResponse.mutationCostList[this.mutationIndex].isEntered = true;
          this.mutationCostCard = this.getAllCostsResponse.mutationCostList[this.mutationIndex];
        }

      
    }
    )


  }

  onSave(GridData: getAllCostResponse) {

    if (this.isReminderBusinessError()) {
      this.throwBusinessError(this.reminderBusinessError)
      this.isErrors = true;
    }

    else if (this.isPostageBusinessError()) {
      this.throwBusinessError(this.postageBusinessError)
      this.isErrors = true;
    }

    else if (this.isMutationBusinessError()) {
      this.throwBusinessError(this.mutationBusinessError)
      this.isErrors = true;
    }

    else if (this.userDetailsform.valid) {

       this.isErrors = false;

      const saveData = { ...GridData };

      saveData.reminderCostList.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedReminderRecords.push({ ...x })
        }

      })

      saveData.postageCostList.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedPostageRecords.push({ ...x })
        }

      })

      saveData.mutationCostList.forEach(x => {
        if (x.state != stateModel.Unknown) {
          this.deletedMutationRecords.push({ ...x })
        }

      })

      this.postData.reminderCostList = [...this.deletedReminderRecords]
      this.postData.postageCostList = [...this.deletedPostageRecords]
      this.postData.mutationCostList = [...this.deletedMutationRecords]

      if (this.postData.reminderCostList.length > 0) {
        this.postData.reminderCostList.forEach(x => {
          if (x.startDate != null) {
            x.startDate = new Date(
              Date.UTC(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate(), 0, 0, 0)
            );
          }
        })
      }

      if (this.postData.postageCostList.length > 0) {
        this.postData.postageCostList.forEach(x => {
          if (x.startDate != null) {
            x.startDate = new Date(
              Date.UTC(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate(), 0, 0, 0)
            );
          }
        })
      }

      if (this.postData.mutationCostList.length > 0) {
        this.postData.mutationCostList.forEach(x => {
          if (x.startDate != null) {
            x.startDate = new Date(
              Date.UTC(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate(), 0, 0, 0)
            );
          }
        })
      }

      console.log(this.postData)
      this.spinnerService.setIsLoading(true);
      this.manageCostService.PostManageCostResponse(this.postData).subscribe(res => {
        this.spinnerService.setIsLoading(false);
        
          this.show = false;
          this.deletedReminderRecords = [...new Array<reminderCost>()]
          this.deletedPostageRecords = [...new Array<postageCost>()]
          this.deletedMutationRecords = [...new Array<mutationCost>()]

          this.manageCostService.GetManageCostResponse().subscribe(res => {
            this.spinnerService.setIsLoading(false);
            const getResponse = res as getAllCostResponse
            this.getAllCostsResponse = { ...getResponse };

            this.RemoveBusinessError(this.reminderBusinessError)
            this.RemoveBusinessError(this.mutationBusinessError)
            this.RemoveBusinessError(this.postageBusinessError)
            this.ReminderStartDateDateconfig.externalError = false;
            this.ReminderAmountTextBoxconfig.externalError = false;
            this.PostageStartDateDateconfig.externalError = false;
            this.PostageAmountTextBoxconfig.externalError = false;
            this.MutationStartDateDateconfig.externalError = false;
            this.MutationAmountTextBoxconfig.externalError = false;

            if (this.getAllCostsResponse.currentDate != null) {
              this.defaultDate = new Date(this.getAllCostsResponse.currentDate)
            }

            //reminder cost
            if (this.getAllCostsResponse.reminderCostList.length > 0) {

              this.getAllCostsResponse.reminderCostList.forEach(x => {
                x.startDate = new Date(x.startDate);
                x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
                x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
                x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
              })

              this.SettingReminderFalse();
              this.reminderIndex = this.getAllCostsResponse.reminderCostList.findIndex(i => {
                return ((i.amount == this.remainderCostCard.amount) && ((i.startDate.getDate() == this.remainderCostCard.startDate.getDate()) && (i.startDate.getMonth() == this.remainderCostCard.startDate.getMonth()) && (i.startDate.getFullYear() == this.remainderCostCard.startDate.getFullYear())) &&
                  (i.product?.productNrAndName == this.remainderCostCard.product?.productNrAndName) && (i.creditProvider?.name?.caption == this.remainderCostCard.creditProvider?.name?.caption))
              })
              this.getAllCostsResponse.reminderCostList[this.reminderIndex].isEntered = true;
              this.remainderCostCard = this.getAllCostsResponse.reminderCostList[this.reminderIndex];
            }

            //postage cost
            if (this.getAllCostsResponse.postageCostList.length > 0) {

             
                this.getAllCostsResponse.postageCostList.forEach(x => {
                  if (x.registered) {
                    x.modifiedRegistered = this.translate.instant('financial.dialog.Yes');

                  }
                  else {
                    x.modifiedRegistered = this.translate.instant('financial.dialog.No');
                  }
                })
              

              this.getAllCostsResponse.postageCostList.forEach(x => {
                x.startDate = new Date(x.startDate);
                x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
                x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
                x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
              })

              this.SettingPostageFalse();
              this.postageIndex = this.getAllCostsResponse.postageCostList.findIndex(i => {
                return ((i.amount == this.postageCostCard.amount) && ((i.startDate.getDate() == this.postageCostCard.startDate.getDate()) && (i.startDate.getMonth() == this.postageCostCard.startDate.getMonth()) && (i.startDate.getFullYear() == this.postageCostCard.startDate.getFullYear())) &&
                  (i.country?.caption == this.postageCostCard.country?.caption) && (i.modifiedRegistered == this.postageCostCard.modifiedRegistered))
              })
              this.getAllCostsResponse.postageCostList[this.postageIndex].isEntered = true;
              this.postageCostCard = this.getAllCostsResponse.postageCostList[this.postageIndex];
            }

            //mutation cost

            if (this.getAllCostsResponse.mutationCostList.length > 0) {

              this.getAllCostsResponse.mutationCostList.forEach(x => {
                x.startDate = new Date(x.startDate);
                x.modifiedDate = this.datePipe.transform(x.startDate, 'dd/MM/yyyy')
                x.modifiedAmount = parseFloat(x.amount as unknown as string).toFixed(2)
                x.modifiedAmount = this.decimalpipe.transform(x.modifiedAmount) as string
              })

              this.SettingMutationFalse();
              this.mutationIndex = this.getAllCostsResponse.mutationCostList.findIndex(i => {
                return ((i.amount == this.mutationCostCard.amount) && ((i.startDate.getDate() == this.mutationCostCard.startDate.getDate()) && (i.startDate.getMonth() == this.mutationCostCard.startDate.getMonth()) && (i.startDate.getFullYear() == this.mutationCostCard.startDate.getFullYear())) &&
                  (i.mutationType?.caption == this.mutationCostCard.mutationType?.caption) && (i.creditProvider?.name?.caption == this.mutationCostCard.creditProvider?.name?.caption))
              })
              this.getAllCostsResponse.mutationCostList[this.mutationIndex].isEntered = true;
              this.mutationCostCard = this.getAllCostsResponse.mutationCostList[this.mutationIndex];
            }

          }, err => {
            if (err?.error?.errorCode) {
              this.errorCode = err.error.errorCode;
            }
            else {
              this.errorCode = "InternalServiceFault"
            }
            this.spinnerService.setIsLoading(false);
            this.deletedReminderRecords = [...new Array<reminderCost>()]
            this.deletedPostageRecords = [...new Array<postageCost>()]
            this.deletedMutationRecords = [...new Array<mutationCost>()]
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
          this.deletedReminderRecords = [...new Array<reminderCost>()]
          this.deletedPostageRecords = [...new Array<postageCost>()]
          this.deletedMutationRecords = [...new Array<mutationCost>()]
          this.exceptionBox = true;
        })
    }
    else {
      this.isErrors = true;
      this.PostageStartDateDateconfig.externalError = true;
      this.PostageAmountTextBoxconfig.externalError = true;
      this.ReminderStartDateDateconfig.externalError = true;
      this.ReminderAmountTextBoxconfig.externalError = true;
      this.MutationStartDateDateconfig.externalError = true;
      this.MutationAmountTextBoxconfig.externalError = true;
    }
  }

  buildConfiguration() {
    const ReminderStartRequired = new ErrorDto;
    ReminderStartRequired.validation = "required";
    ReminderStartRequired.isModelError = true;
    ReminderStartRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.validFrom') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.ReminderStartDateDateconfig.Errors = [ReminderStartRequired];
    this.ReminderStartDateDateconfig.required = true

    const ReminderAmountRequired = new ErrorDto;
    ReminderAmountRequired.validation = "required";
    ReminderAmountRequired.isModelError = true;
    ReminderAmountRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.Amount') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.ReminderAmountTextBoxconfig.Errors = [ReminderAmountRequired];
    this.ReminderAmountTextBoxconfig.required = true

    const postagestartRequired = new ErrorDto;
    postagestartRequired.validation = "required";
    postagestartRequired.isModelError = true;
    postagestartRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.validFrom') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.PostageStartDateDateconfig.Errors = [postagestartRequired];
    this.PostageStartDateDateconfig.required = true

    const postageAmountRequired = new ErrorDto;
    postageAmountRequired.validation = "required";
    postageAmountRequired.isModelError = true;
    postageAmountRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.Amount') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.PostageAmountTextBoxconfig.Errors = [postageAmountRequired];
    this.PostageAmountTextBoxconfig.required = true

    const MutationStartRequired = new ErrorDto;
    MutationStartRequired.validation = "required";
    MutationStartRequired.isModelError = true;
    MutationStartRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.validFrom') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.MutationStartDateDateconfig.Errors = [MutationStartRequired];
    this.MutationStartDateDateconfig.required = true

    const MutationAmountRequired = new ErrorDto;
    MutationAmountRequired.validation = "required";
    MutationAmountRequired.isModelError = true;
    MutationAmountRequired.validationMessage = this.translate.instant('financial.ManageCost.mandatory.Amount') + this.translate.instant('financial.ManageCost.mandatory.required');
    this.MutationAmountTextBoxconfig.Errors = [MutationAmountRequired];
    this.MutationAmountTextBoxconfig.required = true
  }

  

}

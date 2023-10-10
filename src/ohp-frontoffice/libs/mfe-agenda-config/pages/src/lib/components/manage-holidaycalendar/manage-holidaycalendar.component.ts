import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FluidButtonConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidTextAreaConfig,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';

import { NgForm } from '@angular/forms';
import { ErrorDto,fluidValidationService } from '@close-front-office/shared/fluid-controls';
import { HolidayCalenderDto } from './models/holiday-calendar.model';
import { TranslateService } from '@ngx-translate/core';
import { HolidayCalendarService } from './services/holiday-calendar.service';
import { SpinnerService } from '@close-front-office/mfe-agenda-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';


@Component({
  selector: 'magenda-manage-holidaycalendar',
  templateUrl: './manage-holidaycalendar.component.html',
  styleUrls: ['./manage-holidaycalendar.component.scss']
})

export class ManageHolidayCalendarComponent implements OnInit {
  @ViewChild('masterholidaycalform', { static: true }) masterholidaycalform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public RequiredDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public TextAreaConfig: FluidTextAreaConfig = this.fluidService.FluidTextAreaConfig;

  holidayList!: HolidayCalenderDto[];
  holidayHeader!: any[];
  holidayDetail: HolidayCalenderDto = new HolidayCalenderDto();
  stateChanged: HolidayCalenderDto[] = [];
  
  dataSelected: any;
  validationHeader!: string;

  showDialog!: boolean;

  businessError!:string
  highlightHoliday = new HolidayCalenderDto();
  navigateURL:any
  hideholidayCard = false;
  exceptionbox= false;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public datePipe: DatePipe,
    public route: ActivatedRoute,
    public service: HolidayCalendarService,
    public translate: TranslateService,
    public fluidValidation: fluidValidationService,
    public router: Router,
    public spinnerService:SpinnerService,
    public commonService:ConfigContextService

  ) {
    this.businessError = this.translate.instant('agenda.holidaycalendar.ValidationError.buisnessError');
    this.validationHeader = this.translate.instant('agenda.Validation.Header');
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateURL = mfeConfig?.remoteUrl
  }

  ngOnInit(): void {
    
    this.buildConfiguration();
    this.route.data.subscribe((data:any) => {
      if(data.holidayCalenderData != null){
        this.spinnerService.setIsLoading(false);
        const updateHolidayCalendar = data.holidayCalenderData?.map((holidayList: HolidayCalenderDto) => {
          return {
            ...holidayList,
            date: new Date(holidayList?.date),
            modifiedDate: this.datePipe.transform(holidayList?.date, 'dd/MM/yyyy'),
            isSelected: false,
            randomNumber: this.generateRandomNumber()
          };
        });
        
        if(updateHolidayCalendar.length >0){
          updateHolidayCalendar[0].isSelected = true;
         this.holidayList = updateHolidayCalendar;
          this.holidayDetail = updateHolidayCalendar[0];
          this.highlightHoliday = updateHolidayCalendar[0]
        }else{
          this.hideholidayCard= true;
        }

      }
     
    });

    this.holidayHeader = [
      { header: this.translate.instant('agenda.holidaycalendar.Date'),dateSort:'date', field: 'modifiedDate', width: '30%' },
      { header: this.translate.instant('agenda.holidaycalendar.Description'), field: 'shortDescription', width: '62%' },
      { header: this.translate.instant('agenda.general.Delete'), field: 'deleteButton', width: '8%', fieldType: 'deleteButton', pSortableColumnDisabled: true }
    ];
  }

  buildConfiguration() {
    const requiredError = new ErrorDto();
    requiredError.validation = 'required';
    requiredError.isModelError = true;
    requiredError.validationMessage = this.translate.instant('agenda.holidaycalendar.ValidationError.Date') + this.translate.instant('agenda.holidaycalendar.ValidationError.required');;
    this.RequiredDateConfig.required = true;
    this.RequiredDateConfig.Errors = [requiredError];
  }

  /*Row Deletion From Grid*/
  onRowDelete(event: HolidayCalenderDto, griddatas: HolidayCalenderDto[]) {
    const isexistingNewRow = this.emptyRowValidation();
    const isduplicatedateexist = this.isDuplicateDateExists(this.holidayList);

    if (!isexistingNewRow || event.isSelected) {
      let overViewData = [...griddatas];
      this.RequiredDateConfig.externalError = false;
      if (isduplicatedateexist && !event.isSelected) {
        this.throwBusinessError(this.businessError);
      } else {
        const deleteIndex = overViewData.findIndex(data => {
          return data?.['randomNumber'] === event.randomNumber;
        });
        if (deleteIndex != overViewData.length - 1) {
          if (overViewData[deleteIndex].state == 1) {
            overViewData.splice(deleteIndex, 1);
            this.RemoveBusinessError(this.businessError);
          } else {
            overViewData[deleteIndex].state = 4;
            this.stateChanged.push({ ...overViewData[deleteIndex] });
            overViewData.splice(deleteIndex, 1);
            this.RemoveBusinessError(this.businessError);
          }

          if (overViewData.length > 0) {
            overViewData = this.deselectData(overViewData);
            this.holidayList = this.rowSelectData(overViewData[0]?.['randomNumber'], overViewData);

            const firstdataindex = this.holidayList.findIndex((x: HolidayCalenderDto) => x?.['isSelected']);

            if (firstdataindex >= 0) {
              this.holidayDetail = this.holidayList[firstdataindex];
              this.highlightHoliday = this.holidayList[firstdataindex];
            } else {
              this.masterholidaycalform.resetForm();
            }
          } else {
            this.holidayList = [];
            this.holidayDetail = new HolidayCalenderDto();
            setTimeout(()=>{
              this.hideholidayCard= true;          
            },100)
          }
        } else {
          if (overViewData[deleteIndex].state == 1) {
            overViewData.splice(deleteIndex, 1);
            this.RemoveBusinessError(this.businessError);
          } else {
            overViewData[deleteIndex].state = 4;
            this.stateChanged.push({ ...overViewData[deleteIndex] });
            overViewData.splice(deleteIndex, 1);
            this.RemoveBusinessError(this.businessError);
          }

          if (overViewData.length > 0) {
            overViewData = this.deselectData(overViewData);
            this.holidayList = this.rowSelectData(overViewData[overViewData?.length - 1]?.['randomNumber'], overViewData);

            const lastdataindex = this.holidayList.findIndex((x: HolidayCalenderDto) => x?.['isSelected']);

            if (lastdataindex >= 0) {
              this.holidayDetail = this.holidayList[lastdataindex];
              this.highlightHoliday = this.holidayList[lastdataindex];
            } else {
              this.masterholidaycalform.resetForm();
            }
          } else {
            this.holidayList = [];
            this.holidayDetail = new HolidayCalenderDto();
            setTimeout(()=>{
              this.hideholidayCard= true;          
            },100)
          }
        }
      }
    } else {
      this.RequiredDateConfig.externalError = true;
    }
  }

  /*Add New Row to Grid */
  addNewRow() {
    const isexistingNewRow = this.emptyRowValidation();
    const samedateexist = this.isDuplicateDateExists(this.holidayList);

    if (!isexistingNewRow && !samedateexist) {
      if(this.holidayList.length == 0){
        this.hideholidayCard= false;
      }

      let overViewData = this.holidayList;
      overViewData = this.deselectData(overViewData);

      const newRow = new HolidayCalenderDto();
      this.holidayDetail = new HolidayCalenderDto();
      

      const newuserList = overViewData;
      newuserList.push({ ...newRow, modifiedDate: '', isSelected: true, randomNumber: this.generateRandomNumber(), state: 1 });

      this.holidayList = [...newuserList];
      this.masterholidaycalform.resetForm();
      this.RequiredDateConfig.externalError = false;
      this.highlightHoliday = newuserList[newuserList.length-1];
    } else {
      if (isexistingNewRow) {
        this.RequiredDateConfig.externalError = true;
      } else if (samedateexist) {
        this.throwBusinessError(this.businessError);
      }
    }
  }

  /*Row Selection From Grid*/
  onRowSelect(event: HolidayCalenderDto) {
    if (event) {
      const samedateexist = this.isDuplicateDateExists(this.holidayList);

      const isexistingNewRow = this.emptyRowValidation();

      if (samedateexist) {
        this.throwBusinessError(this.businessError);
      } else if (isexistingNewRow && !event.isSelected) {
        this.RequiredDateConfig.externalError = true;
      } else {
        let overViewData = this.holidayList;

        const eventIndex = overViewData.findIndex(x => x.isSelected);

        overViewData = this.deselectData(overViewData);

        this.holidayList[eventIndex].isSelected = overViewData[eventIndex].isSelected;

        const newSelectedIndex = overViewData.findIndex(x => x.randomNumber === event.randomNumber);

        overViewData = this.rowSelectData(event.randomNumber, overViewData);

        this.holidayList[newSelectedIndex].isSelected = overViewData[newSelectedIndex].isSelected;

        this.holidayDetail = this.holidayList[newSelectedIndex]


        this.highlightHoliday = this.holidayList[newSelectedIndex]

       
        if (event.date != null) {
          this.holidayDetail.date = new Date(event.date);
          this.holidayDetail.shortDescription = event.shortDescription;
        } else {
          this.holidayDetail = new HolidayCalenderDto();
          this.holidayDetail.shortDescription = event.shortDescription;
        }
      }
    }
  }

  onDescriptionChangeHandler(event: any) {
    const selectedIndex = this.holidayList.findIndex((x: HolidayCalenderDto) => x.isSelected);

    if (selectedIndex >= 0) {
      const updateData = this.holidayList;
      const updategrid = { ...updateData[selectedIndex] };
      if (updategrid.state != 1) {
        updategrid.state = 3;
      }
      updategrid.shortDescription = event.target.value;
      this.holidayList[selectedIndex].shortDescription = updategrid.shortDescription;
      this.holidayList[selectedIndex].state = updategrid.state;
      this.holidayDetail.shortDescription = event.target.value;
    }
  }

  onDateChangeHandler(event: Date) {
    const selectedIndex = this.holidayList.findIndex((x: HolidayCalenderDto) => x?.['isSelected']);

    if(event != null){
      if (selectedIndex >= 0) {
        const updateData = this.holidayList;
        const displayDate = this.datePipe.transform(event, 'dd/MM/yyyy');
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.date = event;
        if (updategrid.state != 1) {
          updategrid.state = 3;
        }
        updategrid.modifiedDate = displayDate;
        
  
        this.holidayList[selectedIndex].modifiedDate = updategrid.modifiedDate;
        this.holidayList[selectedIndex].date =  updategrid.date;
        this.holidayList[selectedIndex].state = updategrid.state;
  
        this.holidayDetail.date = event;
        this.RemoveBusinessError(this.businessError);
      }
    }else{   
        this.RequiredDateConfig.externalError = true;
        this.holidayDetail.date = event;
        this.holidayList[selectedIndex].date = event;
        this.holidayList[selectedIndex].modifiedDate = null;
    }
  }

  /*Save Data changes */
  onSave(Holidaydata: HolidayCalenderDto[]) {
    const samedateexist = this.isDuplicateDateExists(this.holidayList);

    if (this.masterholidaycalform.valid && !samedateexist) {
      let selectedData = new HolidayCalenderDto();
      let findSelectedIndex!: number;

      
      Holidaydata.map(holidaydata => {
        if (holidaydata.isSelected) {
          selectedData = holidaydata;
        }

        if (holidaydata.state != 0) {       
          holidaydata.date =  new Date(
            Date.UTC(holidaydata.date.getFullYear(), holidaydata.date.getMonth(), holidaydata.date.getDate(), 0, 0, 0)
          );
          this.stateChanged.push({ ...holidaydata });
        }
      });
      const SaveData = this.stateChanged.map(({ modifiedDate, isSelected, randomNumber, ...holidayList }) => ({ ...holidayList }));

      this.spinnerService.setIsLoading(true);
      this.service.saveManageHolidayCalender(SaveData).subscribe(responseList => {
      this.spinnerService.setIsLoading(false);
        if (responseList.length > 0) {

          this.stateChanged = [];
          const responseHolidayData = responseList.map((data: HolidayCalenderDto) => {
            return {
              ...data,
              date: new Date(data?.date),
              modifiedDate: this.datePipe.transform(data?.date, 'dd/MM/yyyy'),
              isSelected: false,
              randomNumber: this.generateRandomNumber(),
              state: 0
            };
          });

        findSelectedIndex = responseHolidayData.findIndex((x: HolidayCalenderDto) => x.modifiedDate === selectedData.modifiedDate);
          if (findSelectedIndex >= 0) {
            responseHolidayData[findSelectedIndex].isSelected = true;

            this.holidayList =[...responseHolidayData] ;
            this.highlightHoliday = this.holidayList[findSelectedIndex];
            this.holidayDetail.date =  this.holidayList[findSelectedIndex].date;
             this.holidayDetail.shortDescription = this.holidayList[findSelectedIndex].shortDescription;
          }else{
            this.hideholidayCard= true;
          }
        }
                  
      },err =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionbox = true;
      });
    } else {
      if (samedateexist) {
        this.throwBusinessError(this.businessError);
      } 
    }
  }

  /*Validation Check For Empty Row and Duplicate Date*/
  emptyRowValidation() {
    const validateOverviewData = this.holidayList;
    const invalidData = validateOverviewData.filter(data => !data?.date);
    return invalidData.length > 0 ? true : false;
  }

  isDuplicateDateExists(newgridDate: HolidayCalenderDto[]) {
    const removeNullDateValue = newgridDate.filter((date: HolidayCalenderDto) => date?.['modifiedDate'] && date?.['modifiedDate'] !== '');
    const uniqueValues = [...new Set(removeNullDateValue.map((date: HolidayCalenderDto) => date?.['modifiedDate']))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
  }

  /*Error Handling For Repetitive Data in Grid*/
  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
        if (x.ErrorMessage != ErrorMessage && !x.IsBusinessError) {
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
        }
      });
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

  /*Dialog Functionality starts */
  onClose() {
  
    const isChangedIndexExist = this.holidayList.findIndex(x => x.state == 3 || x.state == 1 );
    if (isChangedIndexExist >= 0 || this.stateChanged.length > 0) {
      this.showDialog = true;
    } else {
      window.location.assign(this.navigateURL);
    }
  }

  onDialogYes() {
    this.showDialog = false;
    const isChangedIndexExist = this.holidayList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.stateChanged.length > 0) {
      const isexistingNewRow = this.emptyRowValidation();
      const samedateexist = this.isDuplicateDateExists(this.holidayList);
      if (!isexistingNewRow && !samedateexist) {
        this.onSave(this.holidayList);
        window.location.assign(this.navigateURL);
      } else if (samedateexist) {
        this.throwBusinessError(this.businessError);
      } else {
        this.buildConfiguration();
        this.RequiredDateConfig.externalError = true;
      }
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.RemoveBusinessError(this.businessError)
    this.RequiredDateConfig.externalError = false;
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onCloseModel(event: any){
 this.showDialog = false; 
  }

  onException(){
    this.exceptionbox = false;
  }
  /*Dialog Functionality ends */

  /*Screen Functionality Logic*/
  deselectData(overViewData: HolidayCalenderDto[]) {
    const deSelectData = overViewData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: HolidayCalenderDto) => {
            return {
              ...x,
              isSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  rowSelectData(randomnumber: number, overViewData: HolidayCalenderDto[]) {
    const gridData = overViewData;
    const selectedIndex = gridData.findIndex((x: HolidayCalenderDto) => x?.['randomNumber'] === randomnumber);
    if (selectedIndex >= 0) {
      const updatedData = { ...gridData[selectedIndex] };
      updatedData['isSelected'] = true;
      gridData[selectedIndex] = updatedData;
    }
    return gridData;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }
}

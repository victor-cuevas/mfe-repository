import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { FluidButtonConfig, FluidCheckBoxConfig, FluidControlsBaseService, ErrorDto, FluidControlTextBoxConfig, FluidDropDownConfig, FluidPickListConfig } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { DtoState } from './Models/dtoBase.model';
import { CmGenericMappingDto } from './Models/cm-generic-mappingDto.model';
import { codeTable } from './Models/codeTable.model';
import { CmGenericMappingService } from './services/cm-generic-mapping.service';
import { ConfigContextService } from '@close-front-office/shared/config';


@Component({
  selector: 'maic-generic-mapping-cm',
  templateUrl: './generic-mapping-cm.component.html',
  styleUrls: ['./generic-mapping-cm.component.scss']
})
export class GenericMappingCmComponent implements OnInit {
  @ViewChild("cmgenericMappingform", { static: true }) cmgenericMappingform!: NgForm;
  @ViewChild("userDetailsform", { static: true }) userDetailsform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  public RequiredExternalValue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredInternalValue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredInternalType: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredContextDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MappingDirectionDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  
  placeholder = 'Select';
  internaldrop!: any;
  ExternalValue!: any;
  InternalValue!: any;
  InternalType!: any;
  MappingContext!: any;
  MappingDirection!: any;
  generic!: any[];
  genericHeader!: any[];
  intMaxValue = 2147483647;
  exceptionBox!: boolean;
  errorCode !: string;

  dropdownList = [
    { option: 'English', value: 'English' },
    { option: 'Dutch', value: 'Dutch' },
    { option: 'French', value: 'French' }
  ];

  mappingContextlist: codeTable[]=[];
  mappingDirectionlist: codeTable[]=[];
  cmgenericMappingList: CmGenericMappingDto[]=[];
  highlightGenericData = new CmGenericMappingDto();
  cmgenericMappingdata: CmGenericMappingDto = new CmGenericMappingDto();
  hideCard = true;
  deletedArray: CmGenericMappingDto[] = [];
  showDialog = false;
  navigateURL:any
  validationHeader!: string;
  numberErrorDto: ErrorDto[] = [];


  constructor(public fluidService: FluidControlsBaseService, 
    public translate: TranslateService,
    public activeatedRoute : ActivatedRoute,
    public spinnerservice : SpinnerService,
    public cmgenericmappingService: CmGenericMappingService,
    public commonService: ConfigContextService
    ) {
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activeatedRoute.data.subscribe((data:any) =>{
      this.spinnerservice.setIsLoading(false);
      this.mappingContextlist = data.getGenericMappingCodetabl.mappingContextList;
      this.mappingDirectionlist = data.getGenericMappingCodetabl.mappingDirectionList;

      const updatedGenericData = data.getGenericMapping.map((genericData: CmGenericMappingDto) => {
        return { ...genericData, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (updatedGenericData.length > 0) {
        updatedGenericData[0].rowSelected = true;
        this.cmgenericMappingList = [...updatedGenericData];
        this.cmgenericMappingdata = this.cmgenericMappingList[0];
        this.highlightGenericData = this.cmgenericMappingList[0];
      }
    

    });

    
    this.genericHeader = [
      { header: this.translate.instant('app-instance.cmGeneric.tabel.ExternalValue'), field: 'externalValue', width: '15%' },
      { header: this.translate.instant('app-instance.cmGeneric.tabel.InternalValue'), field: 'internalValue', width: '15%' },
      { header: this.translate.instant('app-instance.cmGeneric.tabel.InternalType'), field: 'internalType', width: '20%' },
      { header: this.translate.instant('app-instance.cmGeneric.tabel.MappingContext'), field: 'mappingContext.caption', width: '20%' },
      { header: this.translate.instant('app-instance.cmGeneric.tabel.MappingDirection'), field: 'mappingDirection.caption', width: '22%' },
      { header: this.translate.instant('app-instance.cmGeneric.tabel.Delete'), field: 'Delete', fieldType: 'deleteButton', width: '8%' }];

  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onExternalTypeChange(event:any){
    const selectedIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.externalValue = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].externalValue = updategrid.externalValue;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.externalValue = event;
    } else {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.externalValue = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].externalValue = updategrid.externalValue;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.externalValue = null;
      this.RequiredExternalValue.externalError = true;
  }
}
  oninternalValueTypeChange(event:any){
    const selectedIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      if (+event > this.intMaxValue) {
        const updateData = this.cmgenericMappingList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.internalValue = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.cmgenericMappingList[selectedIndex].internalValue = updategrid.internalValue;
        this.cmgenericMappingList[selectedIndex].state = updategrid.state;
        this.cmgenericMappingdata.internalValue = +event;
        // this.RequiredInternalValue.externalError = true;
      } else {
        const updateData = this.cmgenericMappingList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.internalValue = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.cmgenericMappingList[selectedIndex].internalValue = updategrid.internalValue;
        this.cmgenericMappingList[selectedIndex].state = updategrid.state;
        this.cmgenericMappingdata.internalValue = +event;
      }
    } else {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalValue = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].internalValue = null;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.internalValue = null;
      this.RequiredInternalValue.externalError = true;
    }
  }
  onintinternalTypeTypeChange(event:any){
    const selectedIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalType = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].internalType = updategrid.internalType;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.internalType = event;
    } else {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalType = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].internalType = updategrid.internalType;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.internalType = null;
      this.RequiredInternalType.externalError = true;
    }
  }
  onMappingContextChange(event:any){
    const selectedIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].mappingContext = updategrid.mappingContext;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.mappingContext = event.value;
    } else if (event?.value == null) {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].mappingContext = null;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.mappingContext = null;
       this.RequiredContextDropdown.externalError = true;
    }

  }
  onmappingDirectionChange(event:any){
    const selectedIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingDirection = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].mappingDirection = updategrid.mappingDirection;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.mappingDirection = event.value;
    } else if (event?.value == null) {
      const updateData = this.cmgenericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingDirection = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.cmgenericMappingList[selectedIndex].mappingDirection = null;
      this.cmgenericMappingList[selectedIndex].state = updategrid.state;
      this.cmgenericMappingdata.mappingDirection = null;
      this.MappingDirectionDropdown.externalError = true;
    }

  }

   addNewRow() {
    if (this.cmgenericMappingform.valid) {
      if (this.cmgenericMappingList.length == 0) {
        this.hideCard = true;
      }
      let updategenericMappingList = [...this.cmgenericMappingList];
      updategenericMappingList = this.rowDeselectData(updategenericMappingList);
      this.cmgenericMappingdata = new CmGenericMappingDto();
      updategenericMappingList.push({
        ...this.cmgenericMappingdata,
        randomNumber: this.generateRandomNumber(),
        rowSelected: true,
        state: 1
      });
      this.cmgenericMappingList = [...updategenericMappingList];
      this.highlightGenericData = this.cmgenericMappingList[this.cmgenericMappingList?.length-1];
      this.cmgenericMappingform.resetForm();
      this.removeGenericError();
    } else {
      this.throwGenericError();
    }
  }

  rowDeselectData(genericData: CmGenericMappingDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: CmGenericMappingDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onRowDelete(event: CmGenericMappingDto) {
    if (this.cmgenericMappingform.valid || event.rowSelected) {
      const genericListData = [...this.cmgenericMappingList];

      const todeleteIndex = genericListData.findIndex((data: CmGenericMappingDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != genericListData.length - 1) {
        if (genericListData[todeleteIndex].state == 1) {
          genericListData.splice(todeleteIndex, 1);
        } else {
          genericListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...genericListData[todeleteIndex] });
          genericListData.splice(todeleteIndex, 1);
        }

        if (genericListData.length > 0) {
          this.cmgenericMappingList = this.rowDeselectData(genericListData);
          this.cmgenericMappingList[0].rowSelected = true;
          this.cmgenericMappingdata = this.cmgenericMappingList[0];
          this.highlightGenericData = this.cmgenericMappingList[0];
        } else {
          this.cmgenericMappingList = [];
          this.cmgenericMappingdata = new CmGenericMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (genericListData[todeleteIndex].state == 1) {
          genericListData.splice(todeleteIndex, 1);
        } else {
          genericListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...genericListData[todeleteIndex] });
          genericListData.splice(todeleteIndex, 1);
        }

        if (genericListData.length > 0) {
          this.cmgenericMappingList = this.rowDeselectData(genericListData);
          this.cmgenericMappingList[this.cmgenericMappingList?.length - 1].rowSelected = true;
          const lastIndex = this.cmgenericMappingList.findIndex((x: CmGenericMappingDto) => x.rowSelected);

          this.cmgenericMappingdata = this.cmgenericMappingList[lastIndex];
          this.highlightGenericData = this.cmgenericMappingList[lastIndex];
        } else {
          this.cmgenericMappingList = [];
          this.cmgenericMappingdata = new CmGenericMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      this.throwGenericError();
    }
  }

  onRowselect(event: CmGenericMappingDto) {
    if (this.cmgenericMappingform.valid || event.rowSelected) {
      let updateGenericData = this.cmgenericMappingList;
      const eventIndex = updateGenericData.findIndex(x => x.rowSelected);

      updateGenericData = this.rowDeselectData(updateGenericData);

      this.cmgenericMappingList[eventIndex].rowSelected = updateGenericData[eventIndex].rowSelected;

      const selectedIndex = updateGenericData.findIndex(x => x.randomNumber == event.randomNumber);

      this.cmgenericMappingList[selectedIndex].rowSelected = true;
      this.highlightGenericData = this.cmgenericMappingList[selectedIndex];
      this.cmgenericMappingdata = event;
    } else {
      this.throwGenericError();
    }
  }

  onSave(genericMappingList: CmGenericMappingDto[]) {
    if (this.cmgenericMappingform.valid) {
      genericMappingList.map(genericMappingListData => {
        if (genericMappingListData.state != 0) {
          this.deletedArray.push({ ...genericMappingListData });
        }
      });
      this.spinnerservice.setIsLoading(true);
      this.cmgenericmappingService.savecmGenericMapping(this.deletedArray).subscribe(responseData => {
        this.spinnerservice.setIsLoading(false);
        if (responseData) {
          this.deletedArray = [];
          this.cmgenericmappingService.getcmGenericMapping().subscribe((data: any) => {
            this.deletedArray = [];
            this.spinnerservice.setIsLoading(false);
            const updatedGenericData = data.map((genericData: CmGenericMappingDto) => {
              return { ...genericData, randomNumber: this.generateRandomNumber(), rowSelected: false };
            });

            if (updatedGenericData.length > 0) {
              const genericIndex = updatedGenericData.findIndex((x:CmGenericMappingDto)=>
              x.externalValue == this.cmgenericMappingdata.externalValue &&
              x.internalType == this.cmgenericMappingdata.internalType &&
              x.internalValue == this.cmgenericMappingdata.internalValue &&
              x.mappingContext?.codeId == this.cmgenericMappingdata.mappingContext?.codeId &&
              x.mappingDirection?.codeId == this.cmgenericMappingdata.mappingDirection?.codeId 
            )
            updatedGenericData[genericIndex].rowSelected = true;
            this.cmgenericMappingList = [...updatedGenericData];

            this.cmgenericMappingdata = this.cmgenericMappingList[genericIndex];
            this.highlightGenericData = this.cmgenericMappingList[genericIndex];
            }
          },
            (err: any) => {
              if(err?.error?.errorCode){
                this.errorCode = err.error.errorCode;
              }else{
                this.errorCode= 'InternalServiceFault';
              }
              this.spinnerservice.setIsLoading(false);
              this.deletedArray = [];
              this.exceptionBox = true;
            });
        }
      },(err: any) =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerservice.setIsLoading(false);
        this.deletedArray = [];
        this.exceptionBox = true;
      });
    }else{
      this.throwGenericError();
    }
  }

  onClose() {

    const isChangedIndexExist = this.cmgenericMappingList.findIndex(x => x.state == 3 || x.state == 1);
   
    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeGenericError();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(genericMappingList: CmGenericMappingDto[]) {
    this.showDialog = false;

    if(this.cmgenericMappingform.valid){
      this.onSave(genericMappingList);
      window.location.assign(this.navigateURL);
    }else{
      this.throwGenericError()
    }
   
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeGenericError();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const externalValueError = new ErrorDto();
    externalValueError.validation = 'required';
    externalValueError.isModelError = true;
    externalValueError.validationMessage =
      this.translate.instant('app-instance.cmGeneric.validationError.ExternalValue') +
      this.translate.instant('app-instance.cmGeneric.validationError.required');
    this.RequiredExternalValue.required = true;
    this.RequiredExternalValue.Errors = [externalValueError];

    const maxValValidation = new ErrorDto();
    maxValValidation.validation = 'maxError';
    maxValValidation.isModelError = true;
    maxValValidation.validationMessage = this.translate.instant('app-instance.cmGeneric.validationError.numberInt32Check');
    this.numberErrorDto = [maxValValidation];
    const internalValueError = new ErrorDto();
    internalValueError.validation = 'required';
    internalValueError.isModelError = true;
    internalValueError.validationMessage =
      this.translate.instant('app-instance.cmGeneric.validationError.InternalValue') +
      this.translate.instant('app-instance.cmGeneric.validationError.required');
    this.RequiredInternalValue.required = true;
    this.RequiredInternalValue.Errors = [internalValueError];
    this.RequiredInternalValue.maxValueValidation = this.translate.instant('app-instance.cmGeneric.validationError.InputIncorrect');

    const internalTypeError = new ErrorDto();
    internalTypeError.validation = 'required';
    internalTypeError.isModelError = true;
    internalTypeError.validationMessage =
      this.translate.instant('app-instance.cmGeneric.validationError.InternalType') +
      this.translate.instant('app-instance.cmGeneric.validationError.required');
    this.RequiredInternalType.required = true;
    this.RequiredInternalType.Errors = [internalTypeError];

    const contextDropdownError = new ErrorDto();
    contextDropdownError.validation = 'required';
    contextDropdownError.isModelError = true;
    contextDropdownError.validationMessage =
      this.translate.instant('app-instance.cmGeneric.validationError.MappingContext') +
      this.translate.instant('app-instance.cmGeneric.validationError.required');
    this.RequiredContextDropdown.required = true;
    this.RequiredContextDropdown.Errors = [contextDropdownError];

    const mappingDirectionError = new ErrorDto();
    mappingDirectionError.validation = 'required';
    mappingDirectionError.isModelError = true;
    mappingDirectionError.validationMessage =
      this.translate.instant('app-instance.cmGeneric.validationError.MappingDirection') +
      this.translate.instant('app-instance.cmGeneric.validationError.required');
    this.MappingDirectionDropdown.required = true;
    this.MappingDirectionDropdown.Errors = [mappingDirectionError];
  }

  throwGenericError() {
    this.RequiredContextDropdown.externalError = true;
    this.RequiredExternalValue.externalError = true;
    this.RequiredInternalType.externalError = true;
    this.RequiredInternalValue.externalError = true;
    this.MappingDirectionDropdown.externalError = true;
  }
  removeGenericError() {
    this.RequiredContextDropdown.externalError = false;
    this.RequiredExternalValue.externalError = false;
    this.RequiredInternalType.externalError = false;
    this.RequiredInternalValue.externalError = false;
    this.MappingDirectionDropdown.externalError = false;
  }

  onException() {
    this.exceptionBox = false;
  }
}

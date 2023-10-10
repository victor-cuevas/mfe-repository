import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { CreditProviderRefDto } from './Models/credit-providerRedDto.model';
import { GenericMappingDto } from './Models/generic-mappingDto.model';
import { mappingContextDto } from './Models/mapping-contextDto.model';
import { mappingDirectionDto } from './Models/mapping-directionDto.model';
import { DtoState } from './Models/dtoBase.model';
import { GenericMappingService } from './services/generic-mapping.service';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'maic-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {
  @ViewChild('genericMappingform', { static: true }) genericMappingform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public RequiredExternalValue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredInternalValue: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredInternalType: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredContextDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MappingDirectionDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  genericMappingHeader!: any[];
  intMaxValue = 2147483647;
  validationHeader!: string;
  showDialog = false;
  exceptionBox!: boolean;
  errorCode !: string;

  /*GenericMappindData */
  genericMappingList!: GenericMappingDto[];
  mappingContextList!: mappingContextDto[];
  directionList!: mappingDirectionDto[];
  creditProviderList!: CreditProviderRefDto;

  genericMappingData = new GenericMappingDto();
  deletedArray: GenericMappingDto[] = [];
  numberErrorDto: ErrorDto[] = [];
  highlightGenericData = new GenericMappingDto();
  navigateURL:any
  hideCard = true;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    public genericService: GenericMappingService,
    public commonService:ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');
    const mfeConfig = this.commonService.getDefaultConfigRoute()
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.mappingContextList = data.contextList;
      this.directionList = data.directionList;
      this.creditProviderList = data.creditProviderList;

      const updatedGenericData = data.genericMappingData.map((genericData: GenericMappingDto) => {
        return { ...genericData, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (updatedGenericData.length > 0) {
        updatedGenericData[0].rowSelected = true;
        this.genericMappingList = [...updatedGenericData];
        this.genericMappingData = this.genericMappingList[0];
        this.highlightGenericData = this.genericMappingList[0];
      }
    });

    this.genericMappingHeader = [
      { header: this.translate.instant('app-instance.GenericMapping.tabel.ExternalValue'), field: 'externalValue', width: '20%' },
      { header: this.translate.instant('app-instance.GenericMapping.tabel.InternalValue'), field: 'internalValue', width: '10%' },
      { header: this.translate.instant('app-instance.GenericMapping.tabel.InternalType'), field: 'internalType', width: '15%' },
      { header: this.translate.instant('app-instance.GenericMapping.tabel.MappingContext'), field: 'mappingContext.caption', width: '15%' },
      {
        header: this.translate.instant('app-instance.GenericMapping.tabel.MappingDirection'),
        field: 'mappingDirection.caption',
        width: '15%'
      },
      {
        header: this.translate.instant('app-instance.GenericMapping.tabel.CreditProvider'),
        field: 'creditProviderRef.name.caption',
        width: '12%'
      },
      {
        header: this.translate.instant('app-instance.GenericMapping.tabel.delete'),
        field: 'delete',
        fieldType: 'deleteButton',
        width: '8%',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const externalValueError = new ErrorDto();
    externalValueError.validation = 'required';
    externalValueError.isModelError = true;
    externalValueError.validationMessage =
      this.translate.instant('app-instance.GenericMapping.validationError.ExternalValue') +
      this.translate.instant('app-instance.GenericMapping.validationError.required');
    this.RequiredExternalValue.required = true;
    this.RequiredExternalValue.Errors = [externalValueError];

    const maxValValidation = new ErrorDto();
    maxValValidation.validation = 'maxError';
    maxValValidation.isModelError = true;
    maxValValidation.validationMessage = this.translate.instant('app-instance.GenericMapping.validationError.numberInt32Check');
    this.numberErrorDto = [maxValValidation];
    const internalValueError = new ErrorDto();
    internalValueError.validation = 'required';
    internalValueError.isModelError = true;
    internalValueError.validationMessage =
      this.translate.instant('app-instance.GenericMapping.validationError.InternalValue') +
      this.translate.instant('app-instance.GenericMapping.validationError.required');
    this.RequiredInternalValue.required = true;
    this.RequiredInternalValue.Errors = [internalValueError];
    this.RequiredInternalValue.maxValueValidation = this.translate.instant('app-instance.GenericMapping.validationError.InputIncorrect');

    const internalTypeError = new ErrorDto();
    internalTypeError.validation = 'required';
    internalTypeError.isModelError = true;
    internalTypeError.validationMessage =
      this.translate.instant('app-instance.GenericMapping.validationError.InternalType') +
      this.translate.instant('app-instance.GenericMapping.validationError.required');
    this.RequiredInternalType.required = true;
    this.RequiredInternalType.Errors = [internalTypeError];

    const contextDropdownError = new ErrorDto();
    contextDropdownError.validation = 'required';
    contextDropdownError.isModelError = true;
    contextDropdownError.validationMessage =
      this.translate.instant('app-instance.GenericMapping.validationError.MappingContext') +
      this.translate.instant('app-instance.GenericMapping.validationError.required');
    this.RequiredContextDropdown.required = true;
    this.RequiredContextDropdown.Errors = [contextDropdownError];

    const mappingDirectionError = new ErrorDto();
    mappingDirectionError.validation = 'required';
    mappingDirectionError.isModelError = true;
    mappingDirectionError.validationMessage =
      this.translate.instant('app-instance.GenericMapping.validationError.MappingDirection') +
      this.translate.instant('app-instance.GenericMapping.validationError.required');
    this.MappingDirectionDropdown.required = true;
    this.MappingDirectionDropdown.Errors = [mappingDirectionError];
  }

  onRowDelete(event: GenericMappingDto) {
    if (this.genericMappingform.valid || event.rowSelected) {
      const genericListData = [...this.genericMappingList];

      const todeleteIndex = genericListData.findIndex((data: GenericMappingDto) => {
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
          this.genericMappingList = this.rowDeselectData(genericListData);
          this.genericMappingList[0].rowSelected = true;
          this.genericMappingData = this.genericMappingList[0];
          this.highlightGenericData = this.genericMappingList[0];
        } else {
          this.genericMappingList = [];
          this.genericMappingData = new GenericMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.removeGenericError();
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
          this.genericMappingList = this.rowDeselectData(genericListData);
          this.genericMappingList[this.genericMappingList?.length - 1].rowSelected = true;
          const lastIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);

          this.genericMappingData = this.genericMappingList[lastIndex];
          this.highlightGenericData = this.genericMappingList[lastIndex];
        } else {
          this.genericMappingList = [];
          this.genericMappingData = new GenericMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.removeGenericError();
        }
      }
    } else {
      this.throwGenericError();
    }
  }

  onRowselect(event: GenericMappingDto) {
    if (this.genericMappingform.valid || event.rowSelected) {
      let updateGenericData = this.genericMappingList;
      const eventIndex = updateGenericData.findIndex(x => x.rowSelected);

      updateGenericData = this.rowDeselectData(updateGenericData);

      this.genericMappingList[eventIndex].rowSelected = updateGenericData[eventIndex].rowSelected;

      const selectedIndex = updateGenericData.findIndex(x => x.randomNumber == event.randomNumber);

      this.genericMappingList[selectedIndex].rowSelected = true;
      this.highlightGenericData = this.genericMappingList[selectedIndex];
      this.genericMappingData = event;
    } else {
      this.throwGenericError();
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onExternalTypeChange(event: any) {
    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.externalValue = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].externalValue = updategrid.externalValue;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.externalValue = event;
    } else {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.externalValue = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].externalValue = updategrid.externalValue;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.externalValue = null;
      this.RequiredExternalValue.externalError = true;
    }
  }

  onIntervalValueChange(event: any) {
    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      if (+event > this.intMaxValue) {
        const updateData = this.genericMappingList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.internalValue = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.genericMappingList[selectedIndex].internalValue = updategrid.internalValue;
        this.genericMappingList[selectedIndex].state = updategrid.state;
        this.genericMappingData.internalValue = +event;
        this.RequiredInternalValue.externalError = true;
      } else {
        const updateData = this.genericMappingList;
        const updategrid = { ...updateData[selectedIndex] };
        updategrid.internalValue = +event;
        if (updategrid.state != DtoState.Created) {
          updategrid.state = DtoState.Dirty;
        }
        this.genericMappingList[selectedIndex].internalValue = updategrid.internalValue;
        this.genericMappingList[selectedIndex].state = updategrid.state;
        this.genericMappingData.internalValue = +event;
      }
    } else {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalValue = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].internalValue = null;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.internalValue = null;
      this.RequiredInternalValue.externalError = true;
    }
  }

  onInternalTypeChange(event: any) {
    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalType = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].internalType = updategrid.internalType;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.internalType = event;
    } else {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.internalType = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].internalType = updategrid.internalType;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.internalType = null;
      this.RequiredInternalType.externalError = true;
    }
  }

  onMappingContextChange(event: any) {
    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].mappingContext = updategrid.mappingContext;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.mappingContext = event.value;
    } else if (event?.value == null) {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingContext = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].mappingContext = null;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.mappingContext = null;
      this.RequiredContextDropdown.externalError = true;
    }

  }

  onCreditProviderChange(event: any) {

    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.creditProviderRef = event.value;
      updategrid.creditProviderId = event.value?.pKey
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].creditProviderRef = updategrid.creditProviderRef;
      this.genericMappingList[selectedIndex].creditProviderId = updategrid.creditProviderId
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.creditProviderRef = event.value;
    }else{
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.creditProviderRef = null;
      updategrid.creditProviderId = null
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].creditProviderRef = updategrid.creditProviderRef;
      this.genericMappingList[selectedIndex].creditProviderId = updategrid.creditProviderId
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.creditProviderRef = null;
    }

  }

  onMappingDirectionChange(event: any) {
    const selectedIndex = this.genericMappingList.findIndex((x: GenericMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingDirection = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].mappingDirection = updategrid.mappingDirection;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.mappingDirection = event.value;
    } else if (event?.value == null) {
      const updateData = this.genericMappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.mappingDirection = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.genericMappingList[selectedIndex].mappingDirection = null;
      this.genericMappingList[selectedIndex].state = updategrid.state;
      this.genericMappingData.mappingDirection = null;
      this.MappingDirectionDropdown.externalError = true;
    }

  }

  addNewRow() {
    if (this.genericMappingform.valid) {
      if (this.genericMappingList.length == 0) {
        this.hideCard = true;
      }
      let updategenericMappingList = [...this.genericMappingList];
      updategenericMappingList = this.rowDeselectData(updategenericMappingList);
      this.genericMappingData = new GenericMappingDto();
      updategenericMappingList.push({
        ...this.genericMappingData,
        randomNumber: this.generateRandomNumber(),
        rowSelected: true,
        state: 1
      });
      this.genericMappingList = [...updategenericMappingList];
      this.highlightGenericData = this.genericMappingList[this.genericMappingList?.length-1];
      this.genericMappingform.resetForm();
      this.removeGenericError();
    } else {
      this.throwGenericError();
    }
  }

  onSave(genericMappingList: GenericMappingDto[]) {
    if (this.genericMappingform.valid) {
      this.removeGenericError();
      genericMappingList.map(genericMappingListData => {
        if (genericMappingListData.state != 0) {
          this.deletedArray.push({ ...genericMappingListData });
        }
      });
      this.spinnerService.setIsLoading(true);
      this.genericService.saveGenericMappingScreenData(this.deletedArray).subscribe(responseData => {
        this.spinnerService.setIsLoading(false);
        if (responseData) {
          this.deletedArray = [];
          this.genericService.getGenericMappingScreenData().subscribe((data: any) => {
            this.spinnerService.setIsLoading(false);
            const updatedGenericData = data.map((genericData: GenericMappingDto) => {
              return { ...genericData, randomNumber: this.generateRandomNumber(), rowSelected: false };
            });

            if (updatedGenericData.length > 0) {
              const genericIndex = updatedGenericData.findIndex((x:GenericMappingDto)=>
                x.externalValue == this.genericMappingData.externalValue &&
                x.internalType == this.genericMappingData.internalType &&
                x.internalValue == this.genericMappingData.internalValue &&
                x.mappingContext?.codeId == this.genericMappingData.mappingContext?.codeId &&
                x.mappingDirection?.codeId == this.genericMappingData.mappingDirection?.codeId &&
                x.creditProviderRef?.name?.codeId == this.genericMappingData.creditProviderRef?.name?.codeId
              )
              updatedGenericData[genericIndex].rowSelected = true;
              this.genericMappingList = [...updatedGenericData];

              this.genericMappingData = this.genericMappingList[genericIndex];
              this.highlightGenericData = this.genericMappingList[genericIndex];
            }
          },err =>{
            if(err?.error?.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          });
        }
      },err =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
      });
    }else{
      this.throwGenericError();
    }
  }

  onClose() {

    const isChangedIndexExist = this.genericMappingList.findIndex(x => x.state == 3 || x.state == 1);
   
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

  onDialogYes(genericMappingList: GenericMappingDto[]) {
    this.showDialog = false;

    if(this.genericMappingform.valid){
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


  rowDeselectData(genericData: GenericMappingDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: GenericMappingDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
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

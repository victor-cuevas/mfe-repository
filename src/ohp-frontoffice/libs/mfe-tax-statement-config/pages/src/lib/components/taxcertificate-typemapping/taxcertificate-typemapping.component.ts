import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ErrorDto,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { TaxCertificateCategoryDto } from './Models/taxCertificateCategoryDto.model';
import { TaxCertificateConfigTypeMappingDto } from './Models/taxcertificateconfig-typemappingDto.model';
import { TaxCertificateConfigTypeDto } from './Models/taxCertificateConfigTypeDto.model';
import { DtoState } from './Models/dtoBase.model';
import { TaxcertificateTypemappingService } from './Services/taxcertificate-typemapping.service';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mtsc-taxcertificate-typemapping',
  templateUrl: './taxcertificate-typemapping.component.html',
  styleUrls: ['./taxcertificate-typemapping.component.scss']
})
export class TaxcertificateTypemappingComponent implements OnInit {
  @ViewChild('typeMappingform', { static: true }) typeMappingform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredTaxConfigType: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredTaxCategory: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredTaxReference: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  placeholder = 'Select';
  hideCard = true;
  taxcertificateHeader!: any[];
  validationHeader!: string;

  typemappingList: TaxCertificateConfigTypeMappingDto[] = [];
  typemappingData: TaxCertificateConfigTypeMappingDto = new TaxCertificateConfigTypeMappingDto();
  taxCategoryList: TaxCertificateCategoryDto[] = [];
  taxConfigTypeList: TaxCertificateConfigTypeDto[] = [];

  deletedArray: TaxCertificateConfigTypeMappingDto[] = [];
  highlightTypeMapping: TaxCertificateConfigTypeMappingDto = new TaxCertificateConfigTypeMappingDto();
  showDialog = false;
  navigateURL: any;
  businessValidationError = this.translate.instant('tax-statement.taxcertificate.ValidationError.BusinessValidation');
  exceptionBox!: boolean;
  errorCode!: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public typemappingService: TaxcertificateTypemappingService,
    public commonService: ConfigContextService,
    public spinnerService: SpinnerService,
    public fluidValidation: fluidValidationService,
  ) {
    this.validationHeader = this.translate.instant('tax-statement.Validation.Header');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.taxCategoryList = data.taxCategoryList;
      this.taxConfigTypeList = data.taxConfigTypeList;
      const updateTypeMapping = data.taxcertificatetypeMapping.map((data: TaxCertificateConfigTypeMappingDto) => {
        return { ...data, randomNumber: this.generateRandomNumber(), rowSelected: false, modifieddirection: data.direction?.toString() };
      });

      if (updateTypeMapping.length > 0) {
        updateTypeMapping[0].rowSelected = true;
        this.typemappingList = [...updateTypeMapping];
        this.typemappingData = this.typemappingList[0];
        this.highlightTypeMapping = this.typemappingList[0];
      }else{
        this.hideCard = false
      }
    });

    this.taxcertificateHeader = [
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxCertificate'),
        field: 'taxCertificateConfigType.caption',
        width: '25%'
      },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxcertificateCategory'),
        field: 'taxCertificateCategory.caption',
        width: '25%'
      },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxCertificateReference'),
        field: 'taxCertificateReference',
        width: '25%'
      },
      { header: this.translate.instant('tax-statement.taxcertificate.tabel.Direction'), field: 'modifieddirection', width: '20%' },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.delete'),
        field: 'delete',
        fieldType: 'deleteButton',
        width: '5%',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const configTypeError = new ErrorDto();
    configTypeError.validation = 'required';
    configTypeError.isModelError = true;
    configTypeError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCertificateConfigType') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredTaxConfigType.required = true;
    this.RequiredTaxConfigType.Errors = [configTypeError];

    const categoryError = new ErrorDto();
    categoryError.validation = 'required';
    categoryError.isModelError = true;
    categoryError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCeritificateCategory') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredTaxCategory.required = true;
    this.RequiredTaxCategory.Errors = [categoryError];

    const referenceError = new ErrorDto();
    referenceError.validation = 'required';
    referenceError.isModelError = true;
    referenceError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCertificateReference') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredTaxReference.required = true;
    this.RequiredTaxReference.Errors = [referenceError];
  }

  onRowDelete(event: TaxCertificateConfigTypeMappingDto) {
    if ((this.typeMappingform.valid && !this.isBusinessError()) || event.rowSelected) {
      const typeMappingListData = [...this.typemappingList];

      const todeleteIndex = typeMappingListData.findIndex((data: TaxCertificateConfigTypeMappingDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != typeMappingListData.length - 1) {
        if (typeMappingListData[todeleteIndex].state == 1) {
          typeMappingListData.splice(todeleteIndex, 1);
          this.removeTypeMappingError();
          this.RemoveBusinessError(this.businessValidationError)
        } else {
          typeMappingListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...typeMappingListData[todeleteIndex] });
          typeMappingListData.splice(todeleteIndex, 1);
          this.removeTypeMappingError();
          this.RemoveBusinessError(this.businessValidationError)
        }

        if (typeMappingListData.length > 0) {
          this.typemappingList = this.rowDeselectData(typeMappingListData);
          this.typemappingList[0].rowSelected = true;
          this.typemappingData = this.typemappingList[0];
          this.highlightTypeMapping = this.typemappingList[0];
        } else {
          this.typemappingList = [];
          this.typemappingData = new TaxCertificateConfigTypeMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.removeTypeMappingError();
        }
      } else {
        if (typeMappingListData[todeleteIndex].state == 1) {
          typeMappingListData.splice(todeleteIndex, 1);
          this.removeTypeMappingError();
          this.RemoveBusinessError(this.businessValidationError)
        } else {
          typeMappingListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...typeMappingListData[todeleteIndex] });
          typeMappingListData.splice(todeleteIndex, 1);
          this.removeTypeMappingError();
          this.RemoveBusinessError(this.businessValidationError)
        }

        if (typeMappingListData.length > 0) {
          this.typemappingList = this.rowDeselectData(typeMappingListData);
          this.typemappingList[this.typemappingList?.length - 1].rowSelected = true;
          const lastIndex = this.typemappingList.findIndex((x: TaxCertificateConfigTypeMappingDto) => x.rowSelected);

          this.typemappingData = this.typemappingList[lastIndex];
          this.highlightTypeMapping = this.typemappingList[lastIndex];
        } else {
          this.typemappingList = [];
          this.typemappingData = new TaxCertificateConfigTypeMappingDto();
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
          this.removeTypeMappingError();
        }
      }
    } else {
      
      if(this.isBusinessError()){
        this.throwBusinessError(this.businessValidationError);
      }else{
        this.throwTypeMappingError();
      }
    }
  }

  onRowselect(event: TaxCertificateConfigTypeMappingDto) {
    if (this.typeMappingform.valid || event.rowSelected) {
      if(!this.isBusinessError()){
        this.RemoveBusinessError(this.businessValidationError)
        let updatemappingData = this.typemappingList;
        const eventIndex = updatemappingData.findIndex(x => x.rowSelected);
  
        updatemappingData = this.rowDeselectData(updatemappingData);
  
        this.typemappingList[eventIndex].rowSelected = updatemappingData[eventIndex].rowSelected;
  
        const selectedIndex = updatemappingData.findIndex(x => x.randomNumber == event.randomNumber);
  
        this.typemappingList[selectedIndex].rowSelected = true;
        this.highlightTypeMapping = this.typemappingList[selectedIndex];
        this.typemappingData = event;
      }else{
        this.throwBusinessError(this.businessValidationError);
      }
      
    } else {
      this.throwTypeMappingError();
    }
  }

  addNewRow() {
    if (this.typeMappingform.valid) {
     if (!this.isBusinessError()) {
      if (this.typemappingList.length == 0) {
        this.hideCard = true;
      }
      
        this.RemoveBusinessError(this.businessValidationError)
        let updatetypeMappingList = [...this.typemappingList];
        updatetypeMappingList = this.rowDeselectData(updatetypeMappingList);
        this.typemappingData = new TaxCertificateConfigTypeMappingDto();
        this.typemappingData.direction = false;
        this.typemappingData.modifieddirection = this.typemappingData.direction?.toString();
        updatetypeMappingList.push({
          ...this.typemappingData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.typemappingList = [...updatetypeMappingList];
        this.highlightTypeMapping = this.typemappingList[this.typemappingList?.length - 1];
        this.typeMappingform.resetForm();
        this.removeTypeMappingError();
      } else {
        this.throwBusinessError(this.businessValidationError);
      }
    } else {
      this.throwTypeMappingError();
    }
  }

  rowDeselectData(genericData: TaxCertificateConfigTypeMappingDto[]) {
    const deSelectData = genericData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: TaxCertificateConfigTypeMappingDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onTaxConfigChange(event: any) {
    const selectedIndex = this.typemappingList.findIndex((x: TaxCertificateConfigTypeMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateConfigType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateConfigType = updategrid.taxCertificateConfigType;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateConfigType = event.value;
    } else if (event?.value == null) {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateConfigType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateConfigType = null;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateConfigType = null;
      this.RequiredTaxConfigType.externalError = true;
    }
  }

  onTaxCategoryChange(event: any) {
    const selectedIndex = this.typemappingList.findIndex((x: TaxCertificateConfigTypeMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateCategory = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateCategory = updategrid.taxCertificateCategory;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateCategory = event.value;
    } else if (event?.value == null) {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateCategory = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateCategory = null;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateCategory = null;
      this.RequiredTaxCategory.externalError = true;
    }
  }

  onTaxReferenceChange(event: any) {
    const selectedIndex = this.typemappingList.findIndex((x: TaxCertificateConfigTypeMappingDto) => x.rowSelected);
    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateReference = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateReference = updategrid.taxCertificateReference;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateReference = event;
    } else {
      const updateData = this.typemappingList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateReference = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.typemappingList[selectedIndex].taxCertificateReference = updategrid.taxCertificateReference;
      this.typemappingList[selectedIndex].state = updategrid.state;
      this.typemappingData.taxCertificateReference = null;
      this.RequiredTaxReference.externalError = true;
    }
  }

  onDirectionChange(event: boolean) {
    const selectedIndex = this.typemappingList.findIndex((x: TaxCertificateConfigTypeMappingDto) => x.rowSelected);

    if (this.typemappingList[selectedIndex].state != DtoState.Created) {
      this.typemappingList[selectedIndex].state = DtoState.Dirty;
    }

    if (event != null) {
      this.typemappingData.direction = event;
      this.typemappingList[selectedIndex].direction = event;
      this.typemappingList[selectedIndex].modifieddirection = event.toString();
    }
  }

  onSave(typeMappingList: TaxCertificateConfigTypeMappingDto[]) {

    if (this.typeMappingform.valid) {
      if(!this.isBusinessError()){
        this.RemoveBusinessError(this.businessValidationError)
        typeMappingList.map(typeMappingData => {
          if (typeMappingData.state != 0) {
            this.deletedArray.push({ ...typeMappingData });
          }
        });
  
        this.typemappingService.saveTaxCertificateConfigTypeMapping(this.deletedArray).subscribe(
          responseData => {
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            if (responseData) {
              this.typemappingService.getTaxCertificateConfigTypeMapping().subscribe(
                (responseData: any) => {
                  this.spinnerService.setIsLoading(false);
                  const updateTypeMapping = responseData.map((data: TaxCertificateConfigTypeMappingDto) => {
                    return {
                      ...data,
                      randomNumber: this.generateRandomNumber(),
                      rowSelected: false,
                      modifieddirection: data.direction?.toString()
                    };
                  });
  
                  if (updateTypeMapping.length > 0) {
                    this.typemappingList = [...updateTypeMapping];
                    const index = this.typemappingList.findIndex(x =>
                      x.taxCertificateCategory?.codeId == this.typemappingData.taxCertificateCategory?.codeId &&
                      x.taxCertificateConfigType?.codeId == this.typemappingData.taxCertificateConfigType?.codeId &&
                      x.taxCertificateReference == this.typemappingData.taxCertificateReference &&
                      x.direction == this.typemappingData.direction);

                    this.typemappingList[index].rowSelected = true;
                    this.typemappingData = this.typemappingList[index];
                    this.highlightTypeMapping = this.typemappingList[index];
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.deletedArray = [];
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
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );
      }else{
        this.throwBusinessError(this.businessValidationError)
      }
      
    }
  }

  isBusinessError(): boolean {
    const TypeMappingDup = this.typemappingList.reduce((array: TaxCertificateConfigTypeMappingDto[], current) => {
      if (
        !array.some(
          (item: TaxCertificateConfigTypeMappingDto) =>
            item.taxCertificateConfigType?.caption == current.taxCertificateConfigType?.caption &&
            item.taxCertificateCategory?.caption == current.taxCertificateCategory?.caption && 
            item.taxCertificateReference == current.taxCertificateReference
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (TypeMappingDup.length != this.typemappingList.length) {
      return true;
    } else {
      return false;
    }
  }

  onClose() {
    const isChangedIndexExist = this.typemappingList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.typeMappingform.resetForm();
      this.removeTypeMappingError();
      this.RemoveBusinessError(this.businessValidationError)
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(typeMappingList: TaxCertificateConfigTypeMappingDto[]) {
    this.showDialog = false;

    if (this.typeMappingform.valid) {
      if(!this.isBusinessError()){
        this.onSave(typeMappingList);
        this.typeMappingform.resetForm();
        this.removeTypeMappingError();
        this.RemoveBusinessError(this.businessValidationError)
        window.location.assign(this.navigateURL);
      }else{
        this.throwBusinessError(this.businessValidationError)
      }
     
    } else {
      this.throwTypeMappingError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.typeMappingform.resetForm();
    this.removeTypeMappingError();
    this.RemoveBusinessError(this.businessValidationError)
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  throwTypeMappingError() {
    this.RequiredTaxCategory.externalError = true;
    this.RequiredTaxConfigType.externalError = true;
    this.RequiredTaxReference.externalError = true;
  }

  removeTypeMappingError() {
    this.RequiredTaxReference.externalError = false;
    this.RequiredTaxConfigType.externalError = false;
    this.RequiredTaxCategory.externalError = false;
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
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

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ErrorDto,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { CodeTable } from './Models/code-table.model';
import { RelatedProductTypeDef } from './Models/related-product.model';
import { Dtostate } from './Models/dtobase.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { RelatedProductDefinitionService } from './Service/related-product-definition.service';

@Component({
  selector: 'mprdc-related-product-definition',
  templateUrl: './related-product-definition.component.html',
  styleUrls: ['./related-product-definition.component.scss']
})
export class RelatedProductDefinitionComponent implements OnInit {
  @ViewChild('relatedproductform', { static: true }) relatedproductform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  RelatedProDefDefHeader!: any[];

  placeholder = 'Select';
  deletedArray: RelatedProductTypeDef[] = [];
  validationHeader!: string;
  showDialog!: boolean;
  disableAddNew = false;

  RelatedProductTypeList!: CodeTable[];
  RelatedProductData: RelatedProductTypeDef[]=[];
  commonProductList!: CodeTable[];
  higlightRelatedProduct: RelatedProductTypeDef = new RelatedProductTypeDef();
  exceptionBox !: boolean;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public router: Router,
    public spinnerService: SpinnerService,
    public validationService: fluidValidationService,
    public translate: TranslateService,
    public route: ActivatedRoute,
    public relatedProductService: RelatedProductDefinitionService
  ) {
    this.validationHeader = this.translate.instant('product.Validation.Header');
  }
  ngOnInit(): void {
    this.buildConfiguration();
    this.route.data.subscribe((relatedProduct:any) => {
      this.spinnerService.setIsLoading(false);
      this.RelatedProductTypeList = relatedProduct.InitialData.relatedProductTypeList;

      const updatedData = relatedProduct.relatedProductData.map((relatedData: RelatedProductTypeDef) => {
        this.commonProductList = this.RelatedProductTypeList;
        relatedData.relatedProductTypeList;
        return {
          ...relatedData,
          isReadOnly: false,
          selectedRow: false,
          relatedProductTypeList: this.commonProductList,
          randomnumber: this.generateRandomNumber(),
          disabledropdown: true,
          disabletextbox: false
        };
      });
      if(relatedProduct.relatedProductData.length >0){
        updatedData[0].selectedRow = true;
        this.RelatedProductData = [...updatedData];
        this.higlightRelatedProduct = this.RelatedProductData[0];
      }
      
    });
    if(this.RelatedProductTypeList?.length ==   this.RelatedProductData?.length){
      this.disableAddNew = true;
    }
    this.RelatedProDefDefHeader = [
      {
        header: this.translate.instant('product.RelatedProduct.label.RelatedProType'),
        field: 'relatedProductType',
        width: '45%',
        property: 'textdropdownList',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('product.RelatedProduct.label.DefaultPolicy'),
        field: 'defaultPolicyPercentage',
        width: '42%',
        property: 'percentText',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('product.general.Delete'),
        field: null,
        width: '8%',
        property: 'Delete',
        pSortableColumnDisabled: true
      }
    ];
  }

  buildConfiguration() {
    const dropdownError = new ErrorDto();
    dropdownError.validation = 'required';
    dropdownError.isModelError = true;
    dropdownError.validationMessage =
      this.translate.instant('product.RelatedProduct.ValidationError.RelatedProType') +
      this.translate.instant('product.RelatedProduct.ValidationError.required');
    this.DropdownConfig.required = true;
    this.DropdownConfig.Errors = [dropdownError];

    const textboxError = new ErrorDto();
    textboxError.validation = 'required';
    textboxError.isModelError = true;
    textboxError.validationMessage =
      this.translate.instant('product.RelatedProduct.ValidationError.DefaultPolicy') +
      this.translate.instant('product.RelatedProduct.ValidationError.required');
    this.RequiredTextBoxconfig.invalidDefaultValidation =
      this.translate.instant('product.RelatedProduct.ValidationError.DefaultPolicy') +
      this.translate.instant('product.RelatedProduct.ValidationError.required');
    this.RequiredTextBoxconfig.required = true;
    this.RequiredTextBoxconfig.Errors = [textboxError];
  }

  onRowDelete(event: RelatedProductTypeDef, relatedproductList: RelatedProductTypeDef[]) {
    let isNullCheck = false;
    const relatedproductData = [...relatedproductList];
    for (let i = 0; i < relatedproductData.length; i++) {
      if (
        !relatedproductData[i].relatedProductType ||
        !relatedproductData[i].defaultPolicyPercentage ||
        relatedproductData[i].defaultPolicyPercentage === 0 ||
        relatedproductData[i].relatedProductType === <CodeTable>{}
      ) {
        isNullCheck = true;
        break;
      }
    }

    if (isNullCheck) {
      if (event.defaultPolicyPercentage && event.relatedProductType) {
        this.RequiredTextBoxconfig.externalError = true;
        this.DropdownConfig.externalError = true;
        return;
      }
    }

    const deleteIndex = relatedproductData.findIndex((mutationList: RelatedProductTypeDef) => {
      return mutationList.randomnumber == event.randomnumber;
    });

    if (relatedproductData[deleteIndex].state == Dtostate.Created) {
      this.disableAddNew = false;
      this.RelatedProductData.forEach(x => {
        x.disabletextbox = false;
      });
      this.RemoveErrors();
      setTimeout(() => {
        this.spliceProductData(relatedproductData, deleteIndex);
      }, 100);
    } else {
      this.disableAddNew = false;
      relatedproductData[deleteIndex].state = Dtostate.Deleted;
      this.deletedArray.push(relatedproductData[deleteIndex]);

      this.RelatedProductData.forEach(x => {
        x.disabletextbox = false;
      });

      this.RemoveErrors();

      setTimeout(() => {
        this.spliceProductData(relatedproductData, deleteIndex);
      }, 200);
    }
  }

  spliceProductData(relatedproductData: any, deleteIndex: number) {
    relatedproductData.splice(deleteIndex, 1);

    if (relatedproductData.length > 0) {
      const UpdatedList = this.deselectData(relatedproductData);
      this.RelatedProductData = UpdatedList;
      this.RelatedProductData[0].selectedRow = true;
      // this.RequiredTextBoxconfig.externalError = false;
      this.higlightRelatedProduct = this.RelatedProductData[0];
    }else{
      this.RelatedProductData =[];
    }
  }

  addNew() {

    if (this.relatedproductform.valid) {
        this.RequiredTextBoxconfig.externalError = false;
        this.DropdownConfig.externalError = false;
        let productList:any[] = [];
        if(this.RelatedProductData?.length>0){
          productList = [...this.RelatedProductData]
          this.RelatedProductData = this.disableTextbox(this.RelatedProductData);
           productList = [...this.RelatedProductData];
          const prevIndex = productList.findIndex(x => x.selectedRow);
          const deselectedData = this.deselectData(productList);
          this.RelatedProductData[prevIndex].selectedRow = deselectedData[prevIndex].selectedRow;
        }

        this.commonProductList = this.RelatedProductTypeList.filter(val => {
          return !productList.find(x => {
            return x.relatedProductType?.codeId == val?.codeId;
          });
        });


         const newproductData = new RelatedProductTypeDef();
        newproductData.isReadOnly = true;
        newproductData.state = 1;
        newproductData.disabletextbox = false;
        newproductData.selectedRow = true;
        newproductData.disabledropdown = false;
        newproductData.relatedProductTypeList = [...this.commonProductList];
        newproductData.randomnumber = this.generateRandomNumber();

        this.RelatedProductData.push({ ...newproductData });
        if(this.commonProductList.length == 1){
          this.disableAddNew = true;
        }
        this.higlightRelatedProduct = this.RelatedProductData[this.RelatedProductData?.length-1];

    } else {
      this.RequiredTextBoxconfig.externalError = true;
      this.DropdownConfig.externalError = true;
    }
  }

  onrelatedProductSelect(event: any, rowData: any) {
    let mutationDefinition = [...this.RelatedProductData];
    const prevIndex = mutationDefinition.findIndex(x => x.selectedRow);
    mutationDefinition = this.deselectData(mutationDefinition);
    this.RelatedProductData[prevIndex].selectedRow = mutationDefinition[prevIndex].selectedRow;
    const SelectedIndex = this.RelatedProductData.findIndex(x => x.randomnumber == rowData.randomnumber);
    this.RelatedProductData[SelectedIndex].selectedRow = true;

    if (this.RelatedProductData[SelectedIndex].state != Dtostate.Created) {
      this.RelatedProductData[SelectedIndex].state = Dtostate.Dirty;
      this.RelatedProductData[SelectedIndex].relatedProductType = event.value;
      if (this.relatedproductform.valid) {
        this.RelatedProductData.forEach(x => {
          x.disabletextbox = false;
        });
      }
    } else if (this.RelatedProductData[SelectedIndex].state == Dtostate.Created) {
      this.RelatedProductData[SelectedIndex].relatedProductType = event.value;

      this.RelatedProductData[SelectedIndex].disabledropdown = true;
      if (this.relatedproductform.valid) {
        this.RelatedProductData.forEach(x => {
          x.disabletextbox = false;
        });
      }
    }
  }

  onRowSelect(event: any) {
    if (event) {
      if (this.relatedproductform.valid || event.selectedRow) {
        const mutationList = this.RelatedProductData;
        const prevIndex = mutationList.findIndex(x => x.selectedRow);
        const deselectedData = this.deselectData(mutationList);
        this.RelatedProductData[prevIndex].selectedRow = deselectedData[prevIndex].selectedRow;

        const Index = this.RelatedProductData.findIndex(x => x.randomnumber == event.randomnumber);
        this.RelatedProductData[Index].selectedRow = true;
        this.higlightRelatedProduct = this.RelatedProductData[Index];
      } else if (this.relatedproductform.valid || !event.isSelected) {
        this.RequiredTextBoxconfig.externalError = true;
        this.DropdownConfig.externalError = true;
      }
    }
  }

  onPercentChange(event: any, rowData: any,ischanged:boolean) {
    let mutationDefinition = [...this.RelatedProductData];
    const prevIndex = mutationDefinition.findIndex(x => x.selectedRow);
    mutationDefinition = this.deselectData(mutationDefinition);
    this.RelatedProductData[prevIndex].selectedRow = mutationDefinition[prevIndex].selectedRow;
    const SelectedIndex = this.RelatedProductData.findIndex(x => x.randomnumber == rowData.randomnumber);
    this.RelatedProductData[SelectedIndex].selectedRow = true;
    if (SelectedIndex != -1) {
      if (this.RelatedProductData[SelectedIndex].state != Dtostate.Created){
        this.RelatedProductData[SelectedIndex].state = Dtostate.Dirty;
      }

      if (event != null && event != '0,00') {
        if (!ischanged) {
          const eventConversion = event.toString().split('.').join('');
          const value = eventConversion.toString().replace(',', '.');
          const floatValue = parseFloat(value).toFixed(2);
          // const floatValueReplaced = floatValue.toString().replace('.', ',')

          this.RelatedProductData[SelectedIndex].defaultPolicyPercentage = parseFloat(floatValue);
        }
        /*Enable TextBox if the event is valid*/
        if (this.relatedproductform.valid) {
          this.RelatedProductData.forEach(x => {
            x.disabletextbox = false;
          });
        }
      } else {
        /*Disable TextBox if the event is Invalid*/
        this.RelatedProductData.forEach(x => {
          x.disabletextbox = true;
        });

        this.RelatedProductData[SelectedIndex].disabletextbox = false;

        this.higlightRelatedProduct = this.RelatedProductData[SelectedIndex];
        this.RelatedProductData[SelectedIndex].defaultPolicyPercentage = event;
        if (event == '0,00') {
          this.RequiredTextBoxconfig.externalError = true;
        } else {
          setTimeout(() => {
            this.RelatedProductData[SelectedIndex].defaultPolicyPercentage = null as unknown as number;

            this.RequiredTextBoxconfig.externalError = true;
          }, 4);
        }
      }
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  deselectData(relatedProduct: RelatedProductTypeDef[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: RelatedProductTypeDef) => {
            return {
              ...x,
              selectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }

  disableTextbox(relatedProduct: RelatedProductTypeDef[]) {
    const deSelectData = relatedProduct;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: RelatedProductTypeDef) => {
            return {
              ...x,
              disabletextbox: true
            };
          })
        : [];
    return updateDeselect;
  }

  validateRow() {
    const emptyValidate = this.RelatedProductData;
    const invalidData = emptyValidate.filter(
      x => !x.defaultPolicyPercentage || x.defaultPolicyPercentage == 0 || x.relatedProductType == <CodeTable>{}
    );
    return invalidData.length > 0 ? true : false;
  }

  onSave(relatedProductData: RelatedProductTypeDef[]) {
    if (this.relatedproductform.valid) {
      const selectedRelatedProduct = relatedProductData.find((x:RelatedProductTypeDef)=>x.selectedRow)
      relatedProductData.map((relatedProductData: any) => {
        if (relatedProductData.state != 0) {
          this.deletedArray.push({ ...relatedProductData });
        }
      });

      this.spinnerService.setIsLoading(true);
      this.relatedProductService.saveProductDefinition(this.deletedArray).subscribe(data => {
        this.spinnerService.setIsLoading(false);
        const constResponseData = data;
        this.deletedArray = [];
        const updatedData = constResponseData.map((relatedData: RelatedProductTypeDef) => {
          this.commonProductList = this.RelatedProductTypeList;
          relatedData.relatedProductTypeList;
          return {
            ...relatedData,
            state: 0,
            isReadOnly: false,
            selectedRow: false,
            relatedProductTypeList: this.commonProductList,
            randomnumber: this.generateRandomNumber(),
            disabledropdown: true
          };
        });

        if(updatedData?.length >0){
          const SelectedRelatedIndex = updatedData.findIndex(x=>x.relatedProductType?.codeId == selectedRelatedProduct?.relatedProductType.codeId)
          updatedData[SelectedRelatedIndex].selectedRow = true;
          this.RelatedProductData = [...updatedData];
          this.higlightRelatedProduct = this.RelatedProductData[SelectedRelatedIndex];
        }
        
        if(this.RelatedProductTypeList?.length ==   this.RelatedProductData?.length){
          this.disableAddNew = true;
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
    } else {
      this.RequiredTextBoxconfig.externalError = true;
      this.DropdownConfig.externalError = true;
    }
  }

  RemoveErrors() {
    const Index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('product.RelatedProduct.ValidationError.RelatedProType') +
          this.translate.instant('product.RelatedProduct.ValidationError.required')
    );
    if (Index >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
    }

    const Index1 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x =>
        x.ErrorMessage ==
        this.translate.instant('product.RelatedProduct.ValidationError.DefaultPolicy') +
          this.translate.instant('product.RelatedProduct.ValidationError.required')
    );
    if (Index1 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index1, 1);
    }
  }

  onClose() {
    const isChangedIndexExist = this.RelatedProductData.findIndex(x => x.state == 3 || x.state == 1);
    if(isChangedIndexExist >= 0 || this.deletedArray.length > 0){
      this.showDialog = true;
    }else {
      this.router.navigate([''], { relativeTo: this.route });
    }
    
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(mutationDefintion: RelatedProductTypeDef[]) {
    this.showDialog = false;
    if (this.relatedproductform.valid){
       this.onSave(mutationDefintion);
       this.router.navigate([''], { relativeTo: this.route });
    }else {
      this.RequiredTextBoxconfig.externalError = true;
      this.DropdownConfig.externalError = true;
    }
 
  }

  onDialogNo() {
    this.showDialog = false;
     this.RemoveErrors();
    this.router.navigate([''], { relativeTo: this.route });
    
  }

  onDialogCancel() {
    this.showDialog = false;
  }
  onException() {
    this.exceptionBox = false;
  }
}

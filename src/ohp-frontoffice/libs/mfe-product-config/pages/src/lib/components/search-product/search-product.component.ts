import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ConsumerProductType } from './Models/consumerproduct-type.model';
import { CreditProviderRef } from './Models/creditprovider-ref.model';
import { Dtostate } from './Models/dtobase.model';
import { ProductFamily } from './Models/product-family.model';
import { ProductRefDto } from './Models/productref.model';
import { ResponseSearchProduct } from './Models/responseSearchProduct.model';
import { SearchProductCodeTables } from './Models/searchproduct-codetable.model';
import { SearchProductCriteriaDto } from './Models/searchproduct-criteria.model';
import { SearchProductResult } from './Models/searchproductresult.model';
import { SearchProductService } from './Service/search-product.service';

@Component({
  selector: 'mprdc-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  @ViewChild('productform', { static: true }) productform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  productResult: SearchProductCriteriaDto = new SearchProductCriteriaDto();
  responseProductresult: ResponseSearchProduct = new ResponseSearchProduct();
  deleteProduct: ProductRefDto = new ProductRefDto();
  updateProduct: SearchProductResult = new SearchProductResult();
  resetPagination =0;

  placeholder = 'Select';
  commercialOwnerList!: CreditProviderRef[];
  economicalOwnerList!: CreditProviderRef[];
  judicialOwnerList!: CreditProviderRef[];
  consumerProductList!: ConsumerProductType[];
  productFamily!: ProductFamily[];
  recordsAvailable = 0;
  pageRow = 10;

  productCodetable!: SearchProductCodeTables;
  showsearch!: boolean;
  showupdate!: boolean;
  showRead!: boolean;
  paginationContent = 'Total Records : ' + this.recordsAvailable;

  showDialog!: boolean;
  sortDisabled!: boolean;
  validationHeader!: string;

  productResultHeader!: any[];
  dataSelected: any;
  exceptionBox !: boolean;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public activateRoute: ActivatedRoute,
    public searchproductService: SearchProductService,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public fluidValidation: fluidValidationService,
    public router: Router,
    public route: ActivatedRoute,
    public spinnerService:SpinnerService
  ) {
    this.showsearch = false;
    this.validationHeader = this.translate.instant('product.Validation.Header');
  }

  ngOnInit(): void {

    this.sortDisabled = true;
    this.activateRoute.data.subscribe((data:any) => {
      this.spinnerService.setIsLoading(false);
      this.productFamily = data.searchProductData.productFamilyList;
      this.consumerProductList = data.searchProductData.productTypeList;
      this.commercialOwnerList = data.searchProductData.creditProviderRefList;
      this.economicalOwnerList = data.searchProductData.creditProviderRefList;
      this.judicialOwnerList = data.searchProductData.creditProviderRefList;
    });

    this.productResultHeader = [
      {
        header: this.translate.instant('product.SearchProduct.product'),
        field: 'productNr',
        width: '6%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.producttype'),
        field: 'consumerProductTypeDto.caption',
        width: '10%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.Begin'),
        field: 'modifiedActiveDate',
        width: '10%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.End'),
        field: 'modifiedEndDate',
        width: '10%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.productname'),
        field: 'productName.caption',
        width: '10%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.commnercialname'),
        field: 'commercialNameDto.caption',
        width: '17%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.economicalowner'),
        field: 'economicalOwner.name.caption',
        width: '18%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: this.translate.instant('product.SearchProduct.judicialowner'),
        field: 'judicialOwner.name.caption',
        width: '14%',
        pSortableColumnDisabled: this.sortDisabled
      },
      {
        header: '',
        field: 'customizeDeleteButton',
        width: '5%',
        fieldType: 'customizeDeleteButton',
        pSortableColumnDisabled: true
      }
    ];
  }
  onRowDelete(event: SearchProductResult) {
    
    this.showDialog = true;
    this.deleteProduct.commercialName = event.commercialNameDto;
    this.deleteProduct.productNr = event.productNr;
    this.deleteProduct.productName = event.productName;
    this.deleteProduct.state = Dtostate.Deleted;
    this.deleteProduct.pKey = event.pKey;
  }
  onRowSelect(event: any) {

    if (event) {
      this.showupdate = true;
      this.showRead = true;
      this.updateProduct = event;
    }else{
      this.showupdate = false;
      this.showRead = false;
    }
  }

  onUpdate(updateProduct: SearchProductResult) {
    this.router.navigate(['new-product'], { relativeTo: this.route.parent, state: { updateProductData: updateProduct.pKey, Type: updateProduct.consumerProductTypeDto?.caption, IsRead: false } });
  }
  onRead(updateProduct: SearchProductResult) {
    this.router.navigate(['new-product'], { relativeTo: this.route.parent, state: { updateProductData: updateProduct.pKey, Type: updateProduct.consumerProductTypeDto?.caption, IsRead: true } });
  }
  onRowDblSelect(updateProduct: SearchProductResult){
    this.router.navigate(['new-product'], { relativeTo: this.route.parent, state: { updateProductData: updateProduct.pKey, Type: updateProduct.consumerProductTypeDto?.caption, IsRead: false } });
  }
  commercialownerChange(event: any) {
    if (event.value) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.servicingCustomer = event?.value;
    } else if (event.value == null) {
      this.productResult.pageIndex = 0;
      this.productResult.servicingCustomer = event?.value;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }

  economicalOwnerChange(event: any) {
    if (event.value) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.economicalOwner = event?.value;
    } else if (event.value == null) {
      this.productResult.pageIndex = 0;
      this.productResult.economicalOwner = event?.value;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }

  judicialOwnerChange(event: any) {
    if (event?.value) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.judicialOwner = event?.value;
    } else if (event.value == null) {
      this.productResult.pageIndex = 0;
      this.productResult.judicialOwner = event?.value;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }

  onproductNrchange(event: string) {
    if (event) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.productNr = +event;
    } else if (event == null || +event == 0) {
      this.productResult.pageIndex = 0;
      this.productResult.productNr = null;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }
  onProductFamilyChange(event: any) {
    if (event?.value) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.productFamily = event?.value;
    } else if (event.value == null) {
      this.productResult.pageIndex = 0;
      this.productResult.productFamily = event?.value;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }
  onDateChange(event: Date) {
    if (event) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.activeDate = event;
    } else if (event == null) {
      this.productResult.pageIndex = 0;
      this.productResult.activeDate = event;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }

  onCommercialNameChange(event: any) {
    if (event) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.commercialName = event;
    } else if (event == null || event == '') {
      this.productResult.pageIndex = 0;
      this.productResult.commercialName = null;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }
  onConsumerProductTypeChange(event: any) {
    if (event?.value) {
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.consumerProductType = event?.value;
    } else if (event.value == null) {
      this.productResult.pageIndex = 0;
      this.productResult.consumerProductType = event?.value;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
  }
  onproductNameChange(event: any) {
    if (event){
      this.showsearch = true;
      this.productResult.pageIndex = 0;
      this.productResult.productName = event;
    }else if (event == null){
      this.productResult.pageIndex = 0;
      this.productResult.productName = event;
      if (this.onNullCheck()) {
        this.showsearch = false;
      }
    }
    
  }

  onPageIndex(event: any) {
    if (event && !this.onNullCheck()) {
      this.productResult.pageSize = event.rows;
      this.productResult.pageIndex = event.first / event.rows;

      if (event?.sortOrder && event?.sortField) {
        this.productResult.sortColumn = event.sortField;
        if (event.sortOrder == 1) {
          this.productResult.sortMode = 'desc';
          this.onSearch(this.productResult);
        } else if (event.sortOrder == -1) {
          this.productResult.sortMode = 'asc';
          this.onSearch(this.productResult);
        }
      } else {
        this.productResult.sortColumn = null;
        this.productResult.sortMode = null;
        this.onSearch(this.productResult);
      }
    }
  }
  onSearch(searchcriteriadata: SearchProductCriteriaDto) {
    searchcriteriadata.pageSize = 10;

    if (searchcriteriadata.activeDate != null) {
      searchcriteriadata.activeDate =  new Date(
        Date.UTC(searchcriteriadata.activeDate.getFullYear(),
         searchcriteriadata.activeDate.getMonth(), searchcriteriadata.activeDate.getDate(), 0, 0, 0)
      );
    }

    this.spinnerService.setIsLoading(true);
    this.searchproductService.getSearchCriteriaProduct(searchcriteriadata).subscribe(
      data => {
        this.spinnerService.setIsLoading(false);
        this.removeBusinessError(this.translate.instant('product.Validation.SearchValidation'));
        this.paginationContent = 'Total Records : ' + data.totalItemCount;
        this.responseProductresult.pageIndex = data.pageIndex;
        this.recordsAvailable = data.totalItemCount;

        this.resetPagination = data.pageIndex*this.pageRow

        if (data.items.length > 0) {
          this.showRead = false;
          this.showupdate = false;
          this.productResultHeader.map(x => {
            if (x.field != 'customizeDeleteButton'){ x.pSortableColumnDisabled = false;}
          });
          const productItem = data.items.map(itemList => {
            if (new Date(itemList.endDate).toISOString() === new Date('0001-01-01T00:00:00').toISOString() ||
            new Date(itemList.endDate).toISOString() === new Date('1970-01-01T00:00:00').toISOString()
             ) {
              itemList.modifiedEndDate = null;
            } else {
              itemList.modifiedEndDate = this.datePipe.transform(itemList?.endDate, 'dd/MM/yyyy');
            }
            return {
              ...itemList,
              startDate: new Date(itemList.startDate),
              endDate: new Date(itemList.endDate),
              modifiedActiveDate: this.datePipe.transform(itemList?.startDate, 'dd/MM/yyyy')
            };
          });
          
          if( this.productResult.sortColumn != null && this.productResult.sortColumn != '' ){
            const sortcolumn = this.productResult.sortColumn;
            if(sortcolumn == 'productNr' && this.productResult.sortMode =='asc'){
                productItem.sort((a,b)=>a.productNr> b.productNr? -1 : 1)
            }else if (sortcolumn == 'productNr' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.productNr > b.productNr) ? 1 : -1);
            }
            
            if(sortcolumn == 'consumerProductTypeDto.caption' && this.productResult.sortMode =='asc'){
                productItem.sort((a,b)=>a.consumerProductTypeDto.caption> b.consumerProductTypeDto.caption? -1 : 1)

            }else if (sortcolumn == 'consumerProductTypeDto.caption' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.consumerProductTypeDto.caption > b.consumerProductTypeDto.caption) ? 1 : -1);
            }

            if(sortcolumn == 'modifiedActiveDate' && this.productResult.sortMode =='asc'){
                productItem.sort((a,b)=>a.startDate> b.startDate? -1 : 1)
            
            }else if (sortcolumn == 'modifiedActiveDate' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
            }

            if(sortcolumn == 'modifiedEndDate' && this.productResult.sortMode =='asc'){
               productItem.sort((a,b)=>a.endDate> b.endDate? -1 : 1)
            
            }else if (sortcolumn == 'modifiedEndDate' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.endDate > b.endDate) ? 1 : -1);
            }
            if(sortcolumn == 'productName.caption' && this.productResult.sortMode =='asc'){
              productItem.sort((a,b)=>a?.productName.caption> b?.productName.caption? -1 : 1)
              
            }else if (sortcolumn == 'productName.caption' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a?.productName?.caption > b?.productName?.caption) ? 1 : -1);
            }
            if(sortcolumn == 'servicingCustomer.name.caption' && this.productResult.sortMode =='asc'){
               productItem.sort((a,b)=>a.servicingCustomer?.name?.caption> b.servicingCustomer?.name?.caption? -1 : 1)
             
            }else if (sortcolumn == 'servicingCustomer.name.caption' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.servicingCustomer?.name?.caption > b.servicingCustomer?.name?.caption) ? 1 : -1);
            }
            if(sortcolumn == 'economicalOwner.name.caption' && this.productResult.sortMode =='asc'){
                productItem.sort((a,b)=>a.economicalOwner?.name?.caption> b.economicalOwner?.name?.caption? -1 : 1)
          
            }else if (sortcolumn == 'economicalOwner.name.caption' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.economicalOwner?.name?.caption > b.economicalOwner?.name?.caption) ? 1 : -1);
            }
            if(sortcolumn == 'judicialOwner.name.caption' && this.productResult.sortMode =='asc'){
                productItem.sort((a,b)=>a.judicialOwner?.name?.caption> b.judicialOwner?.name?.caption? -1 : 1)
             
            }else if (sortcolumn == 'judicialOwner.name.caption' && this.productResult.sortMode == 'desc') {
              productItem.sort((a, b) => (a.judicialOwner?.name?.caption > b.judicialOwner?.name?.caption) ? 1 : -1);
            }

          }
          
          this.responseProductresult.items = productItem;
        }
      },
      error => {
        this.spinnerService.setIsLoading(false);
        this.showRead = false;
        this.showupdate = false;
        this.productResultHeader.map(x => {
          if (x.field != 'customizeDeleteButton'){ x.pSortableColumnDisabled = true;}
        });
        this.handleBusinessError(this.translate.instant('product.Validation.SearchValidation'));

         this.responseProductresult.items =[];
         this.responseProductresult.pageIndex =0;
         this.responseProductresult.totalItemCount=0;
         this.resetPagination = 0;
         this.recordsAvailable = 0;
         this.paginationContent = 'Total Records : ' + this.recordsAvailable
       
      }
    );
  }

  onClear() {
    this.productform.resetForm();
    this.productResult.productNr = null;
    this.productResult.servicingCustomer = null;
    this.productResult.judicialOwner = null;
    this.productResult.economicalOwner = null;
    this.productResult.consumerProductType = null;
    this.productResult.productFamily = null;
    this.productResult.productName = null;
    this.productResult.commercialName = null;

    this.removeBusinessError(this.translate.instant('product.Validation.SearchValidation'));
    this.showsearch = false;
  }

  handleBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
        if (x.ErrorMessage != ErrorMessage) {
          this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
        }
      });
    } else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  removeBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );

      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes() {
    this.spinnerService.setIsLoading(true);
    this.searchproductService.deleteProduct(this.deleteProduct).subscribe(data => {
      this.spinnerService.setIsLoading(false);
      if (data) {
        this.showDialog = false;
        this.productResult.pageIndex = 0;
        this.onSearch(this.productResult);
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
    this.showDialog = false;
  }
  onDialogNo() {
    this.showDialog = false;
  }

  onNullCheck() {
    if (
      (!this.productResult?.economicalOwner || this.productResult.economicalOwner == null) &&
      (!this.productResult?.servicingCustomer || this.productResult.servicingCustomer == null) &&
      (!this.productResult?.judicialOwner || this.productResult.judicialOwner == null) &&
      (!this.productResult?.consumerProductType || this.productResult.consumerProductType == null) &&
      (!this.productResult?.productFamily || this.productResult.productFamily == null) &&
      (!this.productResult?.productName || this.productResult.productName == null || this.productResult.productName == '') &&
      (!this.productResult?.commercialName || this.productResult.commercialName == null || this.productResult.commercialName == '') &&
      (!this.productResult?.productNr || this.productResult.productNr == null) &&
      (!this.productResult?.activeDate || this.productResult.activeDate == null)
    ) {
      return true;
    } else {
      return false;
    }
  }

  onException() {
    this.exceptionBox = false;
  }
}

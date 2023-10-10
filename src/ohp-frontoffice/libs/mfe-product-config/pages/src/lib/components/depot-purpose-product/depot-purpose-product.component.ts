import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
} from '@close-front-office/shared/fluid-controls';
import { ActivatedRoute, Router } from '@angular/router';
import { DepotPurposeProductsDto } from './Models/depot-purpose-product.model';
import { DepotPurposeProductService } from './Service/depot-purpose-product.service';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import {Dtostate} from './Models/dtobase.model'

@Component({
  selector: 'mprdc-depot-purpose-product',
  templateUrl: './depot-purpose-product.component.html',
  styleUrls: ['./depot-purpose-product.component.scss']
})
export class DepotPurposeProductComponent implements OnInit {
  @ViewChild('depotpurposeForm', { static: true }) depotpurposeForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

 
  DepotPurposeHeader!: any[];
  DepotPuposeData!: DepotPurposeProductsDto[];
  saveData: DepotPurposeProductsDto[] = [];
  showDialog!: boolean
  highlightDepotPurpose:DepotPurposeProductsDto = new DepotPurposeProductsDto()
  exceptionBox !: boolean;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public DepotService: DepotPurposeProductService,
    public translate: TranslateService,
    public activatedroute: ActivatedRoute,
    public router : Router,
    public spinnerService:SpinnerService
  ) {}
  ngOnInit(): void {
    this.activatedroute.data.subscribe((data:any) => {
      this.spinnerService.setIsLoading(false);
      const updateDepotData = data.depotPurposeData.map((x: any) => {
        return { ...x, rowSelected: false };
      });
      this.DepotPuposeData = [...updateDepotData];
      this.DepotPuposeData[0].rowSelected = true;
      this.highlightDepotPurpose = this.DepotPuposeData[0];
    });

    this.DepotPurposeHeader = [
      {
        header: this.translate.instant('product.DepotPurposeProduct.label.ConstructionDepot'),
        field: 'constructionDepotPurposeType.caption',
        property: 'text',
        width: '60%',
        
      },
      {
        header: this.translate.instant('product.DepotPurposeProduct.label.BlockedTypeDepot'),
        field: 'isPurposeBlockedForAutoDeduction',
        property: 'checkbox',
        width: '30%',
        pSortableColumnDisabled:true
      }
    ];
  }

  onCheckBoxChange(event: any, rowData: DepotPurposeProductsDto) {
    const depotData = [...this.DepotPuposeData];
    const prevIndex = depotData.findIndex(x => x.rowSelected);
    const updatedDepot = this.deselectData(depotData);
    this.DepotPuposeData[prevIndex].rowSelected = updatedDepot[prevIndex].rowSelected;

    const SelectedIndex = this.DepotPuposeData.findIndex(x => x.constructionDepotPurposeType === rowData.constructionDepotPurposeType);

    if (SelectedIndex != -1) {
      this.DepotPuposeData[SelectedIndex].state = Dtostate.Dirty;
      this.DepotPuposeData[SelectedIndex].isPurposeBlockedForAutoDeduction = event;
      this.DepotPuposeData[SelectedIndex].rowSelected = true;
      this.highlightDepotPurpose = this.DepotPuposeData[SelectedIndex];
    }
  }

  onSave(depotpuposeData: any) {
    if (depotpuposeData.length > 0) {
      const SelectedDepotPurposeData = depotpuposeData.find((x:DepotPurposeProductsDto)=>x.rowSelected)
      depotpuposeData.map((x: DepotPurposeProductsDto) => {
        if (x.state != Dtostate.Unknown) {
          this.saveData.push({ ...x });
        }
      });


     if (this.saveData.length > 0){
      this.spinnerService.setIsLoading(true);
      this.DepotService.saveDepotData(this.saveData).subscribe(data => {
        this.spinnerService.setIsLoading(false);
        this.saveData = [];
        const updateDepotData = data.map((x: any) => {
          return { ...x, rowSelected: false, state: 0 };
        });
        if(updateDepotData.length>0){
          const depotPurposeIndex= updateDepotData.findIndex(x=>x.constructionDepotPurposeType?.codeId == SelectedDepotPurposeData.constructionDepotPurposeType.codeId)
          this.DepotPuposeData = [...updateDepotData];
          this.DepotPuposeData[depotPurposeIndex].rowSelected = true;
          this.highlightDepotPurpose = this.DepotPuposeData[depotPurposeIndex];
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
  }
       
}

  rowSelect(rowData: DepotPurposeProductsDto) {
    const depotData = [...this.DepotPuposeData];
    const prevIndex = depotData.findIndex(x => x.rowSelected);
    const updatedDepot = this.deselectData(depotData);
    this.DepotPuposeData[prevIndex].rowSelected = updatedDepot[prevIndex].rowSelected;

    const SelectedIndex = this.DepotPuposeData.findIndex(x => x.constructionDepotPurposeType === rowData.constructionDepotPurposeType);
   
    if(SelectedIndex != -1){
      this.DepotPuposeData[SelectedIndex].rowSelected = true;
      this.highlightDepotPurpose = this.DepotPuposeData[SelectedIndex];
    }
    
  }

  deselectData(depotPurposeData: DepotPurposeProductsDto[]) {
    const deSelectData = depotPurposeData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: DepotPurposeProductsDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }
  onClose() {
    const isChangedIndexExist = this.DepotPuposeData.findIndex(x => x.state == 3 || x.state == 1);
    if(isChangedIndexExist >= 0 ){
      this.showDialog = true;
    }else{
      this.router.navigate([''], { relativeTo: this.activatedroute });
    }
    
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(depotPurpose: DepotPurposeProductsDto[]) {
    this.showDialog = false;
    this.onSave(depotPurpose);
    this.router.navigate([''], { relativeTo: this.activatedroute });
  }

  onDialogNo() {
    this.showDialog = false;
    this.router.navigate([''], { relativeTo: this.activatedroute });
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }
}

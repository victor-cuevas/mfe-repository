import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  DecimalTransformPipe,
  ErrorDto,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  fluidValidationService,
  ValidationErrorDto,
} from '@close-front-office/shared/fluid-controls';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProviderDto, DepotProductsDto, DepotTypeDto, DtoState } from './models/depot-product.model';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import { DepotProductService } from './service/depot-product.service';

@Component({
  selector: 'mprdc-depot-product',
  templateUrl: './depot-product.component.html',
  styleUrls: ['./depot-product.component.scss'],
})
export class DepotProductComponent implements OnInit {
  @ViewChild('depotProductform', { static: true }) depotProductform!: NgForm;
  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public DepotTypeCaptionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CreditProviderNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  public depotProductList: DepotProductsDto[] = [];
  public depotProductDetail!: DepotProductsDto;
  depotProductTypeList!: DepotTypeDto[];
  depotProductSaveData: DepotProductsDto[] = [];
  creditProviderNameList: CreditProviderDto[] = [];
  showDialog!: boolean;
  intMaxValue = 2147483647;
  placeholder = 'select';
  isEnableAdd!: boolean;
  validationHeader = this.translate.instant('product.Validation.Header');
  exceptionBox!: boolean;
  errorCode!: string;
  isEnableDelete!: boolean;
  isFormValid!: boolean;
  deletedRecord: DepotProductsDto[] = [];
  subsidy = 'Subsidy';
  newConstructionDepotCodeId = 1;
  renovationDepotCodeId = 2;
  subsidyCodeId = 4;
  tempDepotProductType!: DepotTypeDto;

  DepotHeader!: any[];
  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public router: Router,
    public route: ActivatedRoute,
    public spinnerService: SpinnerService,
    private service: DepotProductService,
    private decimalPipe: DecimalTransformPipe,
    public fluidValidation: fluidValidationService,
  ) {}
  ngOnInit(): void {
    this.buildConfiguration();

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.depotProductTypeList = res.depotTypeData;
    });

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.creditProviderNameList = res.creditProvider;
    });

    this.route.data.subscribe((res: any) => {
      this.spinnerService.setIsLoading(false);
      this.depotProductList = res.depotProductData;
      this.isFormValid = true;
      if (
        this.depotProductList?.length ==
        this.depotProductTypeList.filter(x => x.depotTypeCaption != this.subsidy).length * this.creditProviderNameList?.length +
        this.depotProductTypeList.length
      ) {
        this.isEnableAdd = false;
      } else {
        this.isEnableAdd = true;
      }

      const updatedList = this.depotProductList.map(x => {
        let depotInterestValue = null;
        let provisionAmountValue = null;
        let initialAmountValue = null;

        if (x.minimumInitialAmount != null) {
          initialAmountValue = parseFloat(x.minimumInitialAmount as string).toFixed(2);
          initialAmountValue = this.decimalPipe.transform(x.minimumInitialAmount) as string;
        }
        if (x.minimumProvisionAmount != null) {
          provisionAmountValue = parseFloat(x.minimumProvisionAmount as string).toFixed(2);
          provisionAmountValue = this.decimalPipe.transform(x.minimumProvisionAmount) as string;
        }
        if (x.depotInterestPercentageMargin != null) {
          depotInterestValue = parseFloat(x.depotInterestPercentageMargin as string).toFixed(2);
          depotInterestValue = this.decimalPipe.transform(x.depotInterestPercentageMargin) as string;
        }

        return {
          ...x,
          modifiedMinimumInitialAmount: initialAmountValue,
          modifiedMinimumProvisionAmount: provisionAmountValue,
          modifiedDepotInterestPercentageMargin: depotInterestValue,
        };
      });
      this.depotProductList = updatedList;
      if (this.depotProductList.length > 0) {
        this.depotProductList[0].isSelected = true;
        this.depotProductDetail = this.depotProductList[0];
        const index = this.depotProductTypeList.findIndex(x => x.depotTypeCaption == this.depotProductList[0].depotTypeCaption);
        this.depotProductDetail.depotCaption = this.depotProductTypeList[index];
      }

      this.depotProductList.forEach(x => {
        if (!x.isInterestPercentageDerivedFromCredit && x.isInterestPercentageDerivedFromCredit != null) {
          x.isDefaultInterestPercentageEditable = true;
        } else x.isDefaultInterestPercentageEditable = false;

        if (x.depotType.codeId == this.renovationDepotCodeId && x.constructionDepotType.codeId == this.subsidyCodeId) {
          x.manualInterestPercentageChangeAllowedVisibility = false;
        } else x.manualInterestPercentageChangeAllowedVisibility = true;
      });
      this.depotProductDetail.depotProductTypeList = this.depotProductTypeList;
      this.depotProductDetail.creditProviderNameList = this.creditProviderNameList;
      this.depotProductDetail.isSubsityDepotType = this.depotProductDetail.depotCaption.depotTypeCaption == this.subsidy ? true : false;
      if (!this.depotProductDetail.isSubsityDepotType) {
        this.depotProductDetail.creditProviderName = this.depotProductList[0].creditProviderName;
      }
    });

    this.DepotHeader = [
      { header: this.translate.instant('product.depotProduct.label.DepotType'), field: 'depotTypeCaption', width: '16%' },
      { header: this.translate.instant('product.depotProduct.label.ExtensionPeriod'), field: 'extensionPeriodInMonths', width: '17%' },
      { header: this.translate.instant('product.depotProduct.label.MaxDuration'), field: 'maximumDurationOfDepotInMonths', width: '17%' },
      {
        header: this.translate.instant('product.depotProduct.label.MinInitialAmount'),
        field: 'modifiedMinimumInitialAmount',
        amountSort: 'minimumInitialAmount',
        width: '17%',
      },
      {
        header: this.translate.instant('product.depotProduct.label.minimumProvisionAmount'),
        field: 'modifiedMinimumProvisionAmount',
        amountSort: 'minimumProvisionAmount',
        width: '17%',
      },
      {
        header: this.translate.instant('product.depotProduct.label.DepotIntMargin'),
        field: 'modifiedDepotInterestPercentageMargin',
        amountSort: 'depotInterestPercentageMargin',
        width: '16%',
      },
      {
        header: this.translate.instant('product.depotProduct.label.CreditProvider'),
        field: 'creditProviderName.name.caption',
        width: '16%',
      },
    ];
  }

  dataSelection(event: DepotProductsDto) {
    if (this.depotProductform.valid || event) {
      this.removeBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
      this.removeBusinessError(this.translate.instant('product.Validation.DepotType'));
      const depotIndex = this.depotProductList.findIndex(x => x.pKey == 0);
      if (depotIndex != -1) {
        this.depotProductList.splice(depotIndex, 1);
      }
      this.depotProductDetail = event;
      this.depotProductDetail.depotProductTypeList = this.depotProductTypeList;

      const index = this.depotProductDetail.depotProductTypeList.findIndex(x => x.depotTypeCaption == event.depotTypeCaption);
      this.depotProductDetail.depotCaption = this.depotProductDetail.depotProductTypeList[index];
      this.depotProductDetail.depotTypeCaption = this.depotProductDetail.depotCaption.depotTypeCaption;
      const gridIndex = this.depotProductList.findIndex(x => (x.creditProviderName != null ? x.creditProviderName.name.caption : '')
        == (this.depotProductDetail.creditProviderName != null ? this.depotProductDetail.creditProviderName.name.caption : '')
        && x.depotTypeCaption == this.depotProductDetail.depotTypeCaption);
      this.depotProductList[gridIndex].state = DtoState.Dirty;
      this.depotProductList[gridIndex].isSelected = true;
      this.depotProductDetail.isSelected = true;
    } else {
      this.DepotTypeCaptionDropdownConfig.externalError = true;
    }
    this.depotProductDetail.creditProviderNameList = this.creditProviderNameList;
    this.depotProductDetail.isSubsityDepotType = this.depotProductDetail.depotTypeCaption == this.subsidy ? true : false;
    if (!this.depotProductDetail.isSubsityDepotType && this.depotProductDetail.creditProviderName != null) {
      this.depotProductDetail.creditProviderName.name.caption =
        event.creditProviderName != null ? event.creditProviderName.name.caption : '';
    }

    if (
      this.depotProductDetail.isInterestPercentageDerivedFromCredit &&
      this.depotProductDetail.isInterestPercentageDerivedFromCredit != null
    ) {
      this.depotProductDetail.isDefaultInterestPercentageEditable = false;
    } else this.depotProductDetail.isDefaultInterestPercentageEditable = true;

    if (
      this.depotProductDetail.depotType.codeId == this.renovationDepotCodeId &&
      this.depotProductDetail.constructionDepotType.codeId == this.subsidyCodeId
    ) {
      this.depotProductDetail.manualInterestPercentageChangeAllowedVisibility = false;
    } else {
      this.depotProductDetail.manualInterestPercentageChangeAllowedVisibility = true;
    }
    this.tempDepotProductType = new DepotTypeDto;
  }
  onChangeCreditProvider(event: any) {
    this.depotProductDetail.creditProviderName = event ? event?.value : null;

    if (
      this.depotProductList.filter(
        x => (x.creditProviderName != null && Object.keys(x.creditProviderName.name).length > 0 ? x.creditProviderName.name.caption : null)
          == (this.depotProductDetail.creditProviderName != null && Object.keys(this.depotProductDetail.creditProviderName.name).length > 0 ?
            this.depotProductDetail.creditProviderName.name.caption : null) && x.depotTypeCaption == this.depotProductDetail.depotTypeCaption).length > 1
    ) {
      this.handleBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
    } else {
      this.removeBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
      const index = this.depotProductList.findIndex(x => x.isSelected);
      if (this.depotProductList[index].state != DtoState.Created) {
        this.depotProductList[index].state = DtoState.Dirty;
      }
    }
    this.changeFieldsVisibility();
  }
  deleteDepotProduct() {
    if (this.depotProductform.valid) {
      this.settingIsSelectedFalse();
      const newuserList = this.depotProductList;
      let index = this.depotProductList.findIndex(
        x =>
          x.depotTypeCaption == this.depotProductDetail.depotTypeCaption &&
          x.creditProviderName == this.depotProductDetail.creditProviderName,
      );
      this.deletedRecord.push(this.depotProductList[index]);
      newuserList.splice(index, 1);
      this.depotProductSaveData.splice(index, 1);
      index = index == 0 ? index + 1 : index - 1;
      this.depotProductList = [...newuserList];

      if (this.depotProductList.length == 0) {
        this.isEnableDelete = true;
      } else {
        this.isEnableDelete = false;
      }

      this.deletedRecord.forEach(x => (x.state = DtoState.Deleted));
      this.depotProductList[index].isSelected = true;
      this.depotProductDetail = this.depotProductList[index];
      this.depotProductDetail.depotProductTypeList = this.depotProductTypeList;

      const captionIndex = this.depotProductTypeList.findIndex(x => x.depotTypeCaption == this.depotProductList[index].depotTypeCaption);
      this.depotProductDetail.depotCaption = this.depotProductTypeList[captionIndex];

      this.depotProductDetail.creditProviderNameList = this.creditProviderNameList;
      this.depotProductDetail.creditProviderName = this.depotProductList[index].creditProviderName;
      this.removeBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
      this.removeBusinessError(this.translate.instant('product.Validation.DepotType'));
    } else {
      this.DepotTypeCaptionDropdownConfig.externalError = true;
    }
  }

  addDepotProduct() {
    if (this.depotProductform.valid) {
      if (this.depotProductDetail.depotTypeCaption == null) {
        this.handleBusinessError(this.translate.instant('product.Validation.DepotType'));
        this.isEnableAdd = false;
      }
      else {
        this.isEnableAdd = true;
        this.removeBusinessError(this.translate.instant('product.Validation.DepotType'));

        this.settingIsSelectedFalse();
        const newRow = new DepotProductsDto();
        newRow.isSelected = true;
        const newuserList = this.depotProductList;
        newuserList.push({ ...newRow });
        this.depotProductDetail = new DepotProductsDto();
        this.depotProductList = [...newuserList];

        this.depotProductDetail.depotProductTypeList = this.depotProductTypeList;
        this.depotProductDetail.creditProviderNameList = this.creditProviderNameList;
        this.depotProductDetail.state = DtoState.Created;
        this.depotProductDetail.pKey = 0;
        this.tempDepotProductType = new DepotTypeDto;
        this.depotProductDetail.isSelected = true;
        this.depotProductDetail.depotCaption = new DepotTypeDto;
        this.depotProductList[this.depotProductList.length - 1] = this.depotProductDetail;
      }
    } else {
      this.DepotTypeCaptionDropdownConfig.externalError = true;
    }
  }

  onSave(depotProduct: DepotProductsDto[]) {
    if (this.depotProductform.valid) {
      if (this.depotProductDetail.depotTypeCaption == null || depotProduct.filter(x => x.depotTypeCaption == null).length > 1) {
        this.handleBusinessError(this.translate.instant('product.Validation.DepotType'));
        this.isEnableAdd = false;
      }
      else {
        this.isEnableAdd = true;
        this.removeBusinessError(this.translate.instant('product.Validation.DepotType'));


        depotProduct.forEach(x => {
          if (x.state != DtoState.Unknown) {
            if (x.isDueDateDepot) {
              x.minimumProvisionAmount = null;
            } else {
              x.isOnlyUsedForCreditInterest = false;
            }
            if (x.isSubsityDepotType) {
              x.isManualInterestPercentageChangeAllowed = false;
            }
            this.depotProductSaveData.push({ ...x });
          }
        });

        if (this.deletedRecord != null && this.deletedRecord.length > 0) {
          this.service.deleteDepotProduct(this.deletedRecord).subscribe(res => {
            this.deletedRecord = [];
          });
        }
        if (this.depotProductSaveData.length > 0) {
          this.service.saveDepotProduct(this.depotProductSaveData).subscribe(
            res => {
              this.spinnerService.setIsLoading(false);
              this.depotProductList = res;
              this.depotProductList.forEach(x => (x.state = DtoState.Unknown));

              if (
                this.depotProductList?.length ==
                this.depotProductTypeList.filter(x => x.depotTypeCaption != this.subsidy).length * this.creditProviderNameList?.length +
                this.depotProductTypeList.length
              ) {
                this.isEnableAdd = false;
              } else {
                this.isEnableAdd = true;
              }

              const updatedList = this.depotProductList.map(x => {
                let depotInterestValue = null;
                let provisionAmountValue = null;
                let initialAmountValue = null;

                if (x.minimumInitialAmount != null) {
                  initialAmountValue = parseFloat(x.minimumInitialAmount as string).toFixed(2);
                  initialAmountValue = this.decimalPipe.transform(x.minimumInitialAmount) as string;
                }
                if (x.minimumProvisionAmount != null) {
                  provisionAmountValue = parseFloat(x.minimumProvisionAmount as string).toFixed(2);
                  provisionAmountValue = this.decimalPipe.transform(x.minimumProvisionAmount) as string;
                }
                if (x.depotInterestPercentageMargin != null) {
                  depotInterestValue = parseFloat(x.depotInterestPercentageMargin as string).toFixed(2);
                  depotInterestValue = this.decimalPipe.transform(x.depotInterestPercentageMargin) as string;
                }

                return {
                  ...x,
                  modifiedMinimumInitialAmount: initialAmountValue,
                  modifiedMinimumProvisionAmount: provisionAmountValue,
                  modifiedDepotInterestPercentageMargin: depotInterestValue,
                };
              });
              this.depotProductList = updatedList;
              const gridIndex = this.depotProductList.findIndex(x => (x.creditProviderName != null ? x.creditProviderName.name.caption : '')
                == (this.depotProductDetail.creditProviderName != null ? this.depotProductDetail.creditProviderName.name.caption : '')
                && x.depotTypeCaption == this.depotProductDetail.depotTypeCaption)
              this.depotProductList[gridIndex].isSelected = true;
              this.depotProductDetail.isSelected = true;
              this.depotProductDetail = this.depotProductList[gridIndex];
              this.depotProductDetail.creditProviderNameList = this.creditProviderNameList;
              this.depotProductDetail.depotProductTypeList = this.depotProductTypeList;
              this.tempDepotProductType = new DepotTypeDto;
              const index = this.depotProductTypeList.findIndex(x => x.depotTypeCaption == this.depotProductList[gridIndex].depotTypeCaption);
              this.depotProductDetail.depotCaption = this.depotProductTypeList[index];
              this.depotProductDetail.depotTypeCaption = this.depotProductDetail.depotCaption.depotTypeCaption;
              this.depotProductDetail.isSubsityDepotType =
                this.depotProductDetail.depotCaption.depotTypeCaption == this.subsidy ? true : false;
              this.depotProductList.forEach(x => {
                if (!x.isInterestPercentageDerivedFromCredit) {
                  x.isDefaultInterestPercentageEditable = true;
                } else x.isDefaultInterestPercentageEditable = false;

                if (x.depotType.codeId == this.renovationDepotCodeId && x.constructionDepotType.codeId == this.subsidyCodeId) {
                  x.manualInterestPercentageChangeAllowedVisibility = false;
                } else x.manualInterestPercentageChangeAllowedVisibility = true;
              });

              this.depotProductSaveData = [];
            },
            err => {
              this.depotProductSaveData = [];
              this.spinnerService.setIsLoading(false);
              this.exceptionBox = true;
              if (err?.error?.errorCode) {
                this.errorCode = err?.error?.errorCode;
              } else {
                this.errorCode = 'InternalServiceFault';
              }
            },
          );
        }
      }
    } else {
      this.DepotTypeCaptionDropdownConfig.externalError = true;
    }
  }

  settingIsSelectedFalse() {
    this.depotProductList.forEach(x => (x.isSelected = false));
  }

  onChangeDepotTypeCaption(event: any) {
    if (event != null) {

      const indexType = this.depotProductDetail.depotProductTypeList.findIndex(x => x.depotTypeCaption == event?.value?.depotTypeCaption);
      this.depotProductDetail.depotCaption = this.depotProductDetail.depotProductTypeList[indexType];
      this.depotProductDetail.depotType = event?.value?.depotType;
      this.depotProductDetail.depotTypeCaption = this.depotProductDetail.depotCaption.depotTypeCaption;
      this.depotProductDetail.constructionDepotType = event?.value?.constructionDepotType;

      this.tempDepotProductType = event.value;
      this.depotProductDetail.isSubsityDepotType = event?.value?.depotTypeCaption == this.subsidy ? true : false;

      if (this.depotProductList.filter(x => x.depotTypeCaption == event?.value?.depotTypeCaption && x.creditProviderName == null).length >
        1 ||
        this.depotProductList.filter(
          x => (x.creditProviderName != null && Object.keys(x.creditProviderName.name).length > 0 ? x.creditProviderName.name.caption : null)
            == (this.depotProductDetail.creditProviderName != null && Object.keys(this.depotProductDetail.creditProviderName.name).length > 0 ?
              this.depotProductDetail.creditProviderName.name.caption : '')
            && x.depotTypeCaption == this.depotProductDetail.depotTypeCaption).length > 1 ||
        (this.depotProductDetail.isSubsityDepotType && this.depotProductList.filter(x => x.depotTypeCaption == this.subsidy).length > 1)
      ) {
        this.tempDepotProductType = event.value;
        this.handleBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
      } else {
        const index = this.depotProductList.findIndex(x => x.isSelected);
        if (this.depotProductList[index].state != DtoState.Created) {
          this.depotProductList[index].state = DtoState.Dirty;
        }

        this.removeBusinessError(this.translate.instant('product.Validation.DepotProductValidation'));
        this.removeBusinessError(this.translate.instant('product.Validation.DepotType'));
      }
    }
    this.changeFieldsVisibility();
  }
  changeFieldsVisibility() {
    this.depotProductDetail.isSubsityDepotType = this.depotProductDetail.depotTypeCaption == this.subsidy ? true : false;

    if (this.depotProductDetail.depotType.codeId == this.newConstructionDepotCodeId) {
      this.depotProductDetail.isDueDateDepot = true;
    } else {
      this.depotProductDetail.isDueDateDepot = false;
    }
    if (
      this.depotProductDetail.depotType.codeId == this.renovationDepotCodeId &&
      this.depotProductDetail.constructionDepotType.codeId == this.subsidyCodeId
    ) {
      this.depotProductDetail.manualInterestPercentageChangeAllowedVisibility = false;
    } else {
      this.depotProductDetail.manualInterestPercentageChangeAllowedVisibility = true;
      if (
        this.depotProductDetail.isInterestPercentageDerivedFromCredit &&
        this.depotProductDetail.isInterestPercentageDerivedFromCredit != null
      ) {
        this.depotProductDetail.isDefaultInterestPercentageEditable = false;
      } else this.depotProductDetail.isDefaultInterestPercentageEditable = true;
    }
    if (this.depotProductDetail.isSubsityDepotType) this.depotProductDetail.creditProviderName = null;
  }

  onChangeExtensionPeriodInMonths(event: any) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event?.target?.value > this.intMaxValue || event?.target?.value == '') {
      this.depotProductDetail.extensionPeriodInMonths = event?.target?.value;
      setTimeout(() => {
        this.depotProductDetail.extensionPeriodInMonths = 0;
      }, 1);
    } else {
      this.depotProductDetail.extensionPeriodInMonths = event?.target?.value;
    }
  }

  onChangeMaximumDurationOfDepotInMonths(event: any) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event?.target?.value > this.intMaxValue || event?.target?.value == '') {
      this.depotProductDetail.maximumDurationOfDepotInMonths = event?.target?.value;
      setTimeout(() => {
        this.depotProductDetail.maximumDurationOfDepotInMonths = 0;
      }, 1);
    } else {
      this.depotProductDetail.maximumDurationOfDepotInMonths = event?.target?.value;
    }
  }

  onChangeMaximumInterestPeriodInMonths(event: any) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event?.target?.value > this.intMaxValue || event?.target?.value == '') {
      this.depotProductDetail.maximumInterestPeriodInMonths = event?.target?.value;
      setTimeout(() => {
        this.depotProductDetail.maximumInterestPeriodInMonths = 0;
      }, 1);
    } else {
      this.depotProductDetail.maximumInterestPeriodInMonths = event?.target?.value;
    }
  }

  onChangeMinimumInitialAmount(event: any, isChanged: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);

        this.depotProductDetail.minimumInitialAmount = parseFloat(floatValue);
        this.depotProductDetail.modifiedMinimumInitialAmount = event;
      }
    } else {
      this.depotProductDetail.minimumInitialAmount = 0.000000009;
      setTimeout(() => {
        this.depotProductDetail.minimumInitialAmount = 0;
        this.depotProductDetail.modifiedMinimumInitialAmount = 0;
      }, 1);
    }
  }

  onChangeMinimumProvisionAmount(event: any, isChanged: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);

        this.depotProductDetail.minimumProvisionAmount = parseFloat(floatValue);
        this.depotProductDetail.modifiedMinimumProvisionAmount = event;
      }
    } else {
      this.depotProductDetail.minimumProvisionAmount = 0.000000009;
      setTimeout(() => {
        this.depotProductDetail.minimumProvisionAmount = 0;
        this.depotProductDetail.modifiedMinimumProvisionAmount = 0 as unknown as string;
      }, 1);
    }
  }

  onChangeDepotInterestPercentageMargin(event: any, isChanged: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);

        this.depotProductDetail.depotInterestPercentageMargin = parseFloat(floatValue);
        this.depotProductDetail.modifiedDepotInterestPercentageMargin = event;
      }
    } else {
      this.depotProductDetail.depotInterestPercentageMargin = null;
      this.depotProductDetail.modifiedDepotInterestPercentageMargin = null;
    }
  }

  onChangeIsInterestPercentageDerivedFromCredit(event: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    this.depotProductDetail.isInterestPercentageDerivedFromCredit = event;
    if (
      this.depotProductDetail.isInterestPercentageDerivedFromCredit ||
      this.depotProductDetail.isInterestPercentageDerivedFromCredit == null
    ) {
      this.depotProductDetail.isDefaultInterestPercentageEditable = false;
    } else this.depotProductDetail.isDefaultInterestPercentageEditable = true;
  }

  onChangeDefaultInterestPercentage(event: any, isChanged: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    if (event != null) {
      if (!isChanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);

        this.depotProductDetail.defaultInterestPercentage = parseFloat(floatValue);
      }
    } else {
      this.depotProductDetail.defaultInterestPercentage = null;
    }
  }

  onChangeUseOutstandingForPrepaymentAllowed(event: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    this.depotProductDetail.useOutstandingForPrepaymentAllowed = event;
  }

  onChangeIsOnlyUsedForCreditInterest(event: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    this.depotProductDetail.isOnlyUsedForCreditInterest = event;
  }

  onChangeIsManualInterestPercentageChangeAllowed(event: boolean) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    this.depotProductDetail.isManualInterestPercentageChangeAllowed = event;
  }

  onChangeExternalReference(event: string) {
    const index = this.depotProductList.findIndex(x => x.isSelected);
    if (this.depotProductList[index].state != DtoState.Created) {
      this.depotProductList[index].state = DtoState.Dirty;
    }
    this.depotProductDetail.externalReference = event;
  }

  onException() {
    this.exceptionBox = false;
  }

  onClose() {
    const updatedDepotProduct = this.depotProductList.findIndex(x => x.state == DtoState.Dirty || x.state == DtoState.Created);
    if (updatedDepotProduct != -1) this.showDialog = true;
    else this.router.navigate(['']);
  }

  onYes(depotProductList: DepotProductsDto[]) {
    this.showDialog = false;
    this.onSave(depotProductList);
    this.router.navigate(['']);
  }

  onNo() {
    this.showDialog = false;
    this.DepotTypeCaptionDropdownConfig.externalError = false;
    this.router.navigate(['']);
  }
  onCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {
    const depotTypeCaptionError = new ErrorDto();
    depotTypeCaptionError.validation = 'required';
    depotTypeCaptionError.isModelError = true;
    depotTypeCaptionError.validationMessage = this.translate.instant('product.depotProduct.validation.depotType');
    this.DepotTypeCaptionDropdownConfig.required = true;
    this.DepotTypeCaptionDropdownConfig.Errors = [depotTypeCaptionError];
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
    this.isEnableAdd = false;
    this.isFormValid = false;
  }

  removeBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError,
      );

      if (Index >= 0) {
        this.isFormValid = true;
        this.isEnableAdd = true;
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }
}

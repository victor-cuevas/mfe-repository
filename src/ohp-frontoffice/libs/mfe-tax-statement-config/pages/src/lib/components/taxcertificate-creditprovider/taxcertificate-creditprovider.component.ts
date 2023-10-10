import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
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
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { TaxCertificateCategoryDto } from '../taxcertificate-typemapping/Models/taxCertificateCategoryDto.model';
import { BalanceMovementTypeDto } from './Models/balance-movementTypeDto.model';
import { codeTable } from './Models/codeTable.model';
import { ConvertedTxTypeDto } from './Models/converted-txTypeDto.model';
import { TaxCertificateConfig2CreditProviderDto } from './Models/taxCertificate-Config-CreditProvider.model';
import { TaxCertificateConfigTypeDto } from './Models/taxCertificate-config-type.model';
import { TaxCertificateConfigType } from './Models/taxCertificateConfig.model';
import { TaxCertificateTypeDto } from './Models/taxCertificateTypeDto.model';
import { TxElTypeDto } from './Models/txElTypeDto.model';
import { DtoState } from './Models/dtoBase.model';
import { TaxcertificateCreditProviderService } from './Services/taxcertificate-credit-provider.service';
import { CreditProviderRefDto } from './Models/creditProviderRef.model';
import { SpinnerService } from '@close-front-office/mfe-tax-statement-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'mtsc-taxcertificate-creditprovider',
  templateUrl: './taxcertificate-creditprovider.component.html',
  styleUrls: ['./taxcertificate-creditprovider.component.scss']
})
export class TaxcertificateCreditproviderComponent implements OnInit {
  @ViewChild('creditProviderform', { static: true }) creditProviderform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public Dateconfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredConfigTypeDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredCategoryDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredCertificateTypeDropdown: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';

  taxconfig!: any[];
  taxconfigHeader!: any[];
  taxConfigTypeList: TaxCertificateConfigTypeDto[] = [];
  taxTxelList: TxElTypeDto[] = [];
  convertedTxTypeList: ConvertedTxTypeDto[] = [];
  taxCertificateList: TaxCertificateTypeDto[] = [];
  taxCertificateCategoryList: TaxCertificateCategoryDto[] = [];
  balanceMovementList: BalanceMovementTypeDto[] = [];
  creditProviderList: CreditProviderRefDto[] = [];

  taxCertificateConfigListData: TaxCertificateConfigType[] = [];
  taxCertificateConfigData: TaxCertificateConfigType = new TaxCertificateConfigType();
  highlightTaxConfigList: TaxCertificateConfigType = new TaxCertificateConfigType();

  targetList: CreditProviderRefDto[] = [];
  creditList: TaxCertificateConfig2CreditProviderDto[] = [];
  target: CreditProviderRefDto[] = [];
  source: any[] = [];

  deletedArray: TaxCertificateConfigType[] = [];
  hideCard = true;
  validationHeader!: string;
  fieldBusinessValidation!: string;
  duplicateValidationError!: string;
  pickListError!: string;
  showDialog = false;

  sourceCaption: any[] = [];
  targetCaption: any[] = [];
  navigateURL: any;
  exceptionBox!: boolean;
  errorCode !: string;
  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public taxCreditProviderService: TaxcertificateCreditProviderService,
    public fluidValidation: fluidValidationService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('tax-statement.Validation.Header');
    this.fieldBusinessValidation = this.translate.instant('tax-statement.taxcertificate.ValidationError.CreditBusinessValidation');
    this.pickListError = this.translate.instant('tax-statement.taxcertificate.picklist.ValidationError.CreditProvider');
    this.duplicateValidationError = this.translate.instant('tax-statement.taxcertificate.ValidationError.BusinessValidation');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);

      this.taxConfigTypeList = data.taxConfigTypeList;
      this.taxTxelList = data.taxTxELList;
      this.convertedTxTypeList = data.convertedTxTypeList;
      this.taxCertificateList = data.taxCertificateList;
      this.taxCertificateCategoryList = data.taxCategoryList;
      this.balanceMovementList = data.balancemovementList;
      this.creditProviderList = data.taxCreditProviderList;

      const updateConfigList = data.taxConfigData.map((taxConfigData: TaxCertificateConfigType) => {
        return {
          ...taxConfigData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: false,
          modifieddecrease: taxConfigData.decrease?.toString()
        };
      });

      if (updateConfigList.length > 0) {
        updateConfigList[0].rowSelected = true;
        this.taxCertificateConfigListData = updateConfigList;
        this.taxCertificateConfigData = updateConfigList[0];
        this.highlightTaxConfigList = updateConfigList[0];
        this.assigningSourceTarget(0);
      } else {
        this.hideCard = false;
      }
    });

    this.taxconfigHeader = [
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxCertificateConfig'),
        field: 'taxCertificateConfigType.caption',
        width: '14%'
      },
      { header: this.translate.instant('tax-statement.taxcertificate.tabel.TxelType'), field: 'txElType.caption', width: '19%' },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.ConvertedtxType'),
        field: 'convertedTxType.caption',
        width: '15%'
      },
      { header: this.translate.instant('tax-statement.taxcertificate.tabel.Decrease'), field: 'modifieddecrease', width: '10%' },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxcertificateType'),
        field: 'taxCertificateType.caption',
        width: '10%'
      },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.TaxcertificateCategorys'),
        field: 'taxCertificateCategory.caption',
        width: '15%'
      },
      {
        header: this.translate.instant('tax-statement.taxcertificate.tabel.BalancemovementType'),
        field: 'balanceMovementType.caption',
        width: '17%'
      },
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
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCertificateConfigTypes') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredConfigTypeDropdown.required = true;
    this.RequiredConfigTypeDropdown.Errors = [configTypeError];

    const certificateTypeError = new ErrorDto();
    certificateTypeError.validation = 'required';
    certificateTypeError.isModelError = true;
    certificateTypeError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCeritificateType') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredCertificateTypeDropdown.required = true;
    this.RequiredCertificateTypeDropdown.Errors = [certificateTypeError];

    const categoryError = new ErrorDto();
    categoryError.validation = 'required';
    categoryError.isModelError = true;
    categoryError.validationMessage =
      this.translate.instant('tax-statement.taxcertificate.ValidationError.TaxCeritificateCategorys') +
      this.translate.instant('tax-statement.taxcertificate.ValidationError.required');
    this.RequiredCategoryDropdown.required = true;
    this.RequiredCategoryDropdown.Errors = [categoryError];
  }

  onAdd() {
    if (this.creditProviderform.valid) {
      if (!this.emptyData() && !this.emptyCreditProviderExist() && !this.isDuplicateError()) {
        if (this.taxCertificateConfigListData.length == 0) {
          this.hideCard = true;
        }

        this.RemoveBusinessError(this.fieldBusinessValidation);
        this.RemoveBusinessError(this.pickListError);
        this.RemoveBusinessError(this.duplicateValidationError);

        let updatetypeMappingList = [...this.taxCertificateConfigListData];
        updatetypeMappingList = this.rowDeselectData(updatetypeMappingList);
        this.taxCertificateConfigData = new TaxCertificateConfigType();
        this.taxCertificateConfigData.decrease = false;
        this.taxCertificateConfigData.modifieddecrease = this.taxCertificateConfigData.decrease?.toString();
        this.taxCertificateConfigData.taxCertificateConfig2CreditProviderList = [];
        updatetypeMappingList.push({
          ...this.taxCertificateConfigData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.taxCertificateConfigListData = [...updatetypeMappingList];
        this.creditProviderform.resetForm();
        this.RemoveCreditError();

        const SelectedIndex = this.taxCertificateConfigListData.findIndex(x => x.rowSelected);
        if (SelectedIndex >= 0) {
          this.assigningSourceTarget(SelectedIndex);
        }

        this.highlightTaxConfigList = this.taxCertificateConfigListData[SelectedIndex];
      } else {
        if (this.emptyData()) {
          this.throwBusinessError(this.fieldBusinessValidation);
        } else if (this.emptyCreditProviderExist()) {
          this.throwBusinessError(this.pickListError);
        } else {
          this.throwBusinessError(this.duplicateValidationError);
        }
      }
    } else {
      this.throwCreditError();
    }
  }

  onRowselect(event: TaxCertificateConfigType) {
    if (this.creditProviderform.valid || event.rowSelected) {
      if ((!this.emptyData() && !this.emptyCreditProviderExist() && !this.isDuplicateError()) || event.rowSelected) {
        this.RemoveBusinessError(this.fieldBusinessValidation);
        this.RemoveBusinessError(this.pickListError);
        this.RemoveBusinessError(this.duplicateValidationError);

        let updatemappingData = this.taxCertificateConfigListData;
        const eventIndex = updatemappingData.findIndex(x => x.rowSelected);

        updatemappingData = this.rowDeselectData(updatemappingData);

        this.taxCertificateConfigListData[eventIndex].rowSelected = updatemappingData[eventIndex].rowSelected;

        const selectedIndex = updatemappingData.findIndex(x => x.randomNumber == event.randomNumber);

        this.taxCertificateConfigListData[selectedIndex].rowSelected = true;
        this.highlightTaxConfigList = this.taxCertificateConfigListData[selectedIndex];
        this.taxCertificateConfigData = event;
        this.assigningSourceTarget(selectedIndex);
      } else {
        if (this.emptyData()) {
          this.throwBusinessError(this.fieldBusinessValidation);
        } else if (this.emptyCreditProviderExist()) {
          this.throwBusinessError(this.pickListError);
        } else {
          this.throwBusinessError(this.duplicateValidationError);
        }
      }
    } else {
      this.throwCreditError();
    }
  }

  rowDeselectData(taxConfigData: TaxCertificateConfigType[]) {
    const deSelectData = taxConfigData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: TaxCertificateConfigType) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.sourceCaption = [];
    this.targetCaption = [];
    this.taxCertificateConfigListData[index].taxCertificateConfig2CreditProviderList.forEach(user => {
      if(user.state != 4){
        const filter = this.creditProviderList.findIndex(y => {
          return user.creditProvider.name.codeId == y.name.codeId;
        });
        if (filter != -1) {
          this.targetList.push(this.creditProviderList[filter]);
        }
      }
     
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.creditProviderList];
    this.target.forEach((user: CreditProviderRefDto) => {
      const index = sourcelist.findIndex(value => {
        return value.name.codeId == user.name.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];

    this.sourceCaption = this.source.map((x: CreditProviderRefDto) => {
      return { ...x.name };
    });

    this.targetCaption = this.target.map((y: CreditProviderRefDto) => {
      return { ...y.name };
    });
  }

  changeTarget(event: any) {
    if (event != undefined) {
      this.RemoveBusinessError(this.pickListError);

      const index = this.taxCertificateConfigListData.findIndex(get => {
        return get.rowSelected == true;
      });

      if (index >= 0) {
        if (this.taxCertificateConfigListData[index].state != DtoState.Created) {
          this.taxCertificateConfigListData[index].state = DtoState.Dirty;
        }
        const creditProviderList: codeTable[] = [];

        event.forEach((x: any) => {
          creditProviderList.push(x);
        });

        let filterData: any[] = [];

        filterData = this.creditProviderList.filter(val => {
          return creditProviderList.find(x => {
            return x.codeId == val.name.codeId;
          });
        });

        /*Storing Existing CodeId in List */
        const oldTaxCertificateConfigListData =
          this.taxCertificateConfigListData[index].taxCertificateConfig2CreditProviderList.length > 0
            ? [...this.taxCertificateConfigListData[index].taxCertificateConfig2CreditProviderList]
            : [];
        const oldCodeIds: any = [];
        oldTaxCertificateConfigListData.map(codeData => {
          if (codeData?.creditProvider?.name?.codeId) {
            oldCodeIds.push(codeData.creditProvider.name.codeId);
          }
        });

        /*Storing New CodeId in List from Target */
        const newCodeIds: any = [];
        filterData.map(codeData => {
          if (codeData?.name?.codeId) {
            const oldCodeData: any = {
              refCodeId: codeData.name.codeId,
              refCodeValue: codeData
            };
            newCodeIds.push(oldCodeData);
          }
        });

        /*Moving Data from Target to Source*/
        oldCodeIds.map((oldData: any) => {
          const findNewCodeIndex = newCodeIds.findIndex((newId: any) => newId.refCodeId === oldData);
          if (findNewCodeIndex === -1) {
            const getTaxIndex = oldTaxCertificateConfigListData.findIndex(
              (codeData: any) => codeData?.creditProvider?.name?.codeId === oldData
            );
            if (getTaxIndex >= 0) {
              const updateTax = { ...oldTaxCertificateConfigListData[getTaxIndex] };
              if (updateTax.state === 1) {
                oldTaxCertificateConfigListData.splice(getTaxIndex, 1);
              } else if (updateTax.state === 0) {
                updateTax.state = 4;
                oldTaxCertificateConfigListData[getTaxIndex] = updateTax;
              }
            }
          }
        });

        /*Moving Data from Source to Target*/
        newCodeIds.map((y: any) => {
          const getIndex = oldCodeIds.findIndex((x: any) => x === y.refCodeId);
          //Add Index if it is  new Data
          if (getIndex === -1) {
            const updateTax: any = { creditProvider: { ...y.refCodeValue, name: { ...y.refCodeValue.name } }, state: 1 };
            oldTaxCertificateConfigListData.push(updateTax);
          } else {
             //Update if it is Existing Data
            const getTaxIndex = oldTaxCertificateConfigListData.findIndex(
              (codeData: any) => codeData?.creditProvider?.name?.codeId === y.refCodeId
            );
            if (getTaxIndex >= 0) {
              const updateTax = { ...oldTaxCertificateConfigListData[getTaxIndex] };
              if (updateTax.state === 4) {
                updateTax.state = 0;
                oldTaxCertificateConfigListData[getTaxIndex] = updateTax;
              }
            }
          }
        });

        /*Update in the CreditProviderList */
        this.taxCertificateConfigListData[index].taxCertificateConfig2CreditProviderList =
          oldTaxCertificateConfigListData.length > 0
            ? oldTaxCertificateConfigListData.map((x: any) => {
                const updatedTaxData = { ...x, creditProvider: { ...x.creditProvider, name: { ...x.creditProvider.name } } };
                return updatedTaxData;
              })
            : [];
      }
    }
  }

  onRowDelete(event: any) {
    if (this.creditProviderform.valid || event.rowSelected) {
      if ((!this.emptyData() && !this.emptyCreditProviderExist() && !this.isDuplicateError()) || event.rowSelected) {
        const taxConfigListData = [...this.taxCertificateConfigListData];

        const todeleteIndex = taxConfigListData.findIndex((data: TaxCertificateConfigType) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != taxConfigListData.length - 1) {
          if (taxConfigListData[todeleteIndex].state == 1) {
            taxConfigListData.splice(todeleteIndex, 1);
            this.RemoveCreditError();
            this.RemoveBusinessError(this.fieldBusinessValidation);
            this.RemoveBusinessError(this.pickListError);
            this.RemoveBusinessError(this.duplicateValidationError);
          } else {
            taxConfigListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...taxConfigListData[todeleteIndex] });
            taxConfigListData.splice(todeleteIndex, 1);
            this.RemoveCreditError();
            this.RemoveBusinessError(this.fieldBusinessValidation);
            this.RemoveBusinessError(this.pickListError);
            this.RemoveBusinessError(this.duplicateValidationError);
          }

          if (taxConfigListData.length > 0) {
            this.taxCertificateConfigListData = this.rowDeselectData(taxConfigListData);
            this.taxCertificateConfigListData[0].rowSelected = true;
            this.taxCertificateConfigData = this.taxCertificateConfigListData[0];
            this.highlightTaxConfigList = this.taxCertificateConfigListData[0];
            this.assigningSourceTarget(0);
          } else {
            this.taxCertificateConfigListData = [];
            this.taxCertificateConfigData = new TaxCertificateConfigType();
            this.taxCertificateConfigData.taxCertificateConfig2CreditProviderList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
            this.RemoveCreditError();
          }
        } else {
          if (taxConfigListData[todeleteIndex].state == 1) {
            taxConfigListData.splice(todeleteIndex, 1);
            this.RemoveCreditError();
            this.RemoveBusinessError(this.fieldBusinessValidation);
            this.RemoveBusinessError(this.pickListError);
            this.RemoveBusinessError(this.duplicateValidationError);
          } else {
            taxConfigListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...taxConfigListData[todeleteIndex] });
            taxConfigListData.splice(todeleteIndex, 1);
            this.RemoveCreditError();
            this.RemoveBusinessError(this.fieldBusinessValidation);
            this.RemoveBusinessError(this.pickListError);
            this.RemoveBusinessError(this.duplicateValidationError);
          }

          if (taxConfigListData.length > 0) {
            this.taxCertificateConfigListData = this.rowDeselectData(taxConfigListData);
            this.taxCertificateConfigListData[this.taxCertificateConfigListData?.length - 1].rowSelected = true;
            const lastIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);

            this.taxCertificateConfigData = this.taxCertificateConfigListData[lastIndex];
            this.highlightTaxConfigList = this.taxCertificateConfigListData[lastIndex];
            this.assigningSourceTarget(lastIndex);
          } else {
            this.taxCertificateConfigListData = [];
            this.taxCertificateConfigData = new TaxCertificateConfigType();
            this.taxCertificateConfigData.taxCertificateConfig2CreditProviderList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
            this.RemoveCreditError();
          }
        }
      } else {
        if (this.emptyData()) {
          this.throwBusinessError(this.fieldBusinessValidation);
        } else if (this.emptyCreditProviderExist()) {
          this.throwBusinessError(this.pickListError);
        } else {
          this.throwBusinessError(this.duplicateValidationError);
        }
      }
    } else {
      this.throwCreditError();
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  ontaxCertificateConfigType(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateConfigType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateConfigType = updategrid.taxCertificateConfigType;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateConfigType = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateConfigType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateConfigType = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateConfigType = null;
      this.RequiredConfigTypeDropdown.externalError = true;
    }
  }

  onTxelTypeChange(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      this.RemoveBusinessError(this.fieldBusinessValidation);
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.txElType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].txElType = updategrid.txElType;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.txElType = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.txElType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].txElType = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.txElType = null;
    }
  }

  onConvertedtxelType(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      this.RemoveBusinessError(this.fieldBusinessValidation);
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.convertedTxType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].convertedTxType = updategrid.convertedTxType;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.convertedTxType = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.convertedTxType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].convertedTxType = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.convertedTxType = null;
    }
  }

  onTaxCertificateTypeChange(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateType = updategrid.taxCertificateType;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateType = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateType = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateType = null;
      this.RequiredCertificateTypeDropdown.externalError = true;
    }
  }

  onTaxCertificateCategoryChange(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateCategory = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateCategory = updategrid.taxCertificateCategory;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateCategory = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.taxCertificateCategory = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].taxCertificateCategory = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.taxCertificateCategory = null;
      this.RequiredCategoryDropdown.externalError = true;
    }
  }
  onBalanceMovementType(event: any) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      this.RemoveBusinessError(this.fieldBusinessValidation);
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.balanceMovementType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].balanceMovementType = updategrid.balanceMovementType;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.balanceMovementType = event.value;
    } else if (event?.value == null) {
      const updateData = this.taxCertificateConfigListData;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.balanceMovementType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.taxCertificateConfigListData[selectedIndex].balanceMovementType = null;
      this.taxCertificateConfigListData[selectedIndex].state = updategrid.state;
      this.taxCertificateConfigData.balanceMovementType = null;
    }
  }
  ondecreaseChange(event: boolean) {
    const selectedIndex = this.taxCertificateConfigListData.findIndex((x: TaxCertificateConfigType) => x.rowSelected);

    if (this.taxCertificateConfigListData[selectedIndex].state != DtoState.Created) {
      this.taxCertificateConfigListData[selectedIndex].state = DtoState.Dirty;
    }

    if (event != null) {
      this.taxCertificateConfigData.decrease = event;
      this.taxCertificateConfigListData[selectedIndex].decrease = event;
      this.taxCertificateConfigListData[selectedIndex].modifieddecrease = event.toString();
    }
  }

  onSave(taxCertificateConfigList: TaxCertificateConfigType[]) {
    if (this.creditProviderform.valid) {
      if (!this.emptyData() && !this.emptyCreditProviderExist() && !this.isDuplicateError()) {
        this.RemoveBusinessError(this.fieldBusinessValidation);
        this.RemoveBusinessError(this.pickListError);
        this.RemoveBusinessError(this.duplicateValidationError);

        taxCertificateConfigList.map(data => {
          if (data.state != 0) {
            this.deletedArray.push({ ...data });
          }
        });

        this.taxCreditProviderService.saveTaxCertificateConfig(this.deletedArray).subscribe(
          data => {
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];
            if (data) {
              this.taxCreditProviderService.getTaxConfig().subscribe(
                (responseData: any) => {
                  this.spinnerService.setIsLoading(false);
                  const updateConfigList = responseData.map((taxConfigData: TaxCertificateConfigType) => {
                    return {
                      ...taxConfigData,
                      randomNumber: this.generateRandomNumber(),
                      rowSelected: false,
                      modifieddecrease: taxConfigData.decrease?.toString()
                    };
                  });

                  if (updateConfigList.length > 0) {
                    this.taxCertificateConfigListData = updateConfigList;
                    const index = this.taxCertificateConfigListData.findIndex(x =>
                      x.balanceMovementType?.codeId == this.taxCertificateConfigData.balanceMovementType?.codeId &&
                      x.convertedTxType?.codeId == this.taxCertificateConfigData.convertedTxType?.codeId &&
                      x.txElType?.codeId == this.taxCertificateConfigData.txElType?.codeId &&
                      x.decrease == this.taxCertificateConfigData.decrease &&
                      x.taxCertificateCategory?.codeId == this.taxCertificateConfigData.taxCertificateCategory?.codeId &&
                      x.taxCertificateConfigType?.codeId == this.taxCertificateConfigData.taxCertificateConfigType?.codeId &&
                      x.taxCertificateType?.codeId == this.taxCertificateConfigData.taxCertificateType?.codeId)

                    this.taxCertificateConfigListData[index].rowSelected = true;
                    this.taxCertificateConfigData = this.taxCertificateConfigListData[index];
                    this.highlightTaxConfigList = this.taxCertificateConfigListData[index];
                    this.assigningSourceTarget(index);
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
                  this.deletedArray = [];
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
            this.deletedArray = [];
          }
        );
      } else {
        if (this.emptyData()) {
          this.throwBusinessError(this.fieldBusinessValidation);
        } else if (this.emptyCreditProviderExist()) {
          this.throwBusinessError(this.pickListError);
        } else {
          this.throwBusinessError(this.duplicateValidationError);
        }
      }
    }
  }

  throwCreditError() {
    this.RequiredCategoryDropdown.externalError = true;
    this.RequiredCertificateTypeDropdown.externalError = true;
    this.RequiredConfigTypeDropdown.externalError = true;
  }
  RemoveCreditError() {
    this.RequiredCategoryDropdown.externalError = false;
    this.RequiredCertificateTypeDropdown.externalError = false;
    this.RequiredConfigTypeDropdown.externalError = false;
  }

  emptyData() {
    const validateTaxData = this.taxCertificateConfigListData;
    const invalidData = validateTaxData.filter(data => (!data?.balanceMovementType && !data?.convertedTxType && !data.txElType) || (data?.balanceMovementType && data?.convertedTxType) || (data?.balanceMovementType && data?.txElType) || (data?.convertedTxType && data?.txElType) );
    return invalidData.length > 0 ? true : false;
  }

  emptyCreditProviderExist() {
    let isEmpty = false;
    const validateTaxData = this.taxCertificateConfigListData;
    for (let i = 0; i < validateTaxData.length; i++) {
      if (validateTaxData[i].taxCertificateConfig2CreditProviderList.length == 0) {
        isEmpty = true;
        break;
      } else {
        for (let j = 0; j < validateTaxData[i].taxCertificateConfig2CreditProviderList.length; j++) {
          if (validateTaxData[i].taxCertificateConfig2CreditProviderList[j].state == 4) {
            isEmpty = true;
          } else {
            isEmpty = false;
            break;
          }
        }
        if (isEmpty) {
          break;
        }
      }
    }
    return isEmpty;
  }

  isDuplicateError(): boolean {
    const TaxCertificateDup = this.taxCertificateConfigListData.reduce((array: TaxCertificateConfigType[], current) => {
      if (
        !array.some(
          (item: TaxCertificateConfigType) =>
            item.taxCertificateConfigType?.codeId == current.taxCertificateConfigType?.codeId &&
            item.taxCertificateCategory?.codeId == current.taxCertificateCategory?.codeId &&
            item.taxCertificateType?.codeId == current.taxCertificateType?.codeId &&
            item.txElType?.codeId == current.txElType?.codeId &&
            item.balanceMovementType?.codeId == current.balanceMovementType?.codeId &&
            item.convertedTxType?.codeId == current.convertedTxType?.codeId
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (TaxCertificateDup.length != this.taxCertificateConfigListData.length) {
      return true;
    } else {
      return false;
    }
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

  onClose() {
    const isChangedIndexExist = this.taxCertificateConfigListData.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.RemoveCreditError();
      this.RemoveBusinessError(this.fieldBusinessValidation);
      this.RemoveBusinessError(this.pickListError);
      this.RemoveBusinessError(this.duplicateValidationError);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(typeMappingList: TaxCertificateConfigType[]) {
    this.showDialog = false;

    if (this.creditProviderform.valid) {
      if (!this.emptyData() && !this.emptyCreditProviderExist() && !this.isDuplicateError()) {
        this.onSave(typeMappingList);
        this.RemoveCreditError();
        this.RemoveBusinessError(this.fieldBusinessValidation);
        this.RemoveBusinessError(this.pickListError);
        this.RemoveBusinessError(this.duplicateValidationError);
        window.location.assign(this.navigateURL);
      } else {
        if (this.emptyData()) {
          this.throwBusinessError(this.fieldBusinessValidation);
        } else if (this.emptyCreditProviderExist()) {
          this.throwBusinessError(this.pickListError);
        } else {
          this.throwBusinessError(this.duplicateValidationError);
        }
      }
    } else {
      this.throwCreditError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.RemoveCreditError();
    this.RemoveBusinessError(this.fieldBusinessValidation);
    this.RemoveBusinessError(this.pickListError);
    this.RemoveBusinessError(this.duplicateValidationError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }
}

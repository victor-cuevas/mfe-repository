
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DecimalTransformPipe, ErrorDto, FluidButtonConfig, FluidCheckBoxConfig, FluidControlDatePickerConfig, FluidControlsBaseService, FluidControlTextBoxConfig, FluidDropDownConfig, fluidValidationService, ValidationErrorDto } from '@close-front-office/shared/fluid-controls';
import { CodeTable, IndexationConfigDto, ManageIndexationConfigInitialDataDto, RealEstateValueType2LoanPurposeDto, RealEstateValueType2ProductDto, RealEstateValueType2RealEstatePurposeTypeDto, RealEstateValueTypeConfigDto, SaveManageIndexationConfigDto } from '../../models/manage-indexation.model';
import { IndexationService } from '../../service/indexation.service';
import { SpinnerService } from '@close-front-office/mfe-asset-config/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'masc-manage-indexation',
  templateUrl: './manage-indexation.component.html',
  styleUrls: ['./manage-indexation.component.scss']
})
export class ManageIndexationComponent implements OnInit {

  @ViewChild("indexationform", { static: true }) indexationform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public productNameDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public loanPurposeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public realEstatePurposeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public realEstateValueTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public validFromDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;
  public validToDateConfig: FluidControlDatePickerConfig = this.fluidService.FluidDateConfig;

  public indexationList: ManageIndexationConfigInitialDataDto = new ManageIndexationConfigInitialDataDto;
  indexationDetails!: IndexationConfigDto;
  realEstateDetails: RealEstateValueTypeConfigDto = new RealEstateValueTypeConfigDto();
  saveIndexation: SaveManageIndexationConfigDto = new SaveManageIndexationConfigDto;
  dataSelected: any;
  validationHeader!: string;
  loanPurposeList: CodeTable[] = [];
  realEstatePurposeList: CodeTable[] = [];
  commonProductDropdown: CodeTable[] = [];
  commonLoadDropdown: CodeTable[] = [];
  commonRealEstateDropdown: CodeTable[] = [];
  commonRealEstateValueDropdown: CodeTable[] = [];
  confirmationMessage!: string;
  showConfirmationDialog!: boolean;
  showDialog!: boolean;
  onSelectIndexation!: boolean;
  isValidToCheck!: boolean;
  placeholder = "select";
  manageIndexationHeader: any[] = []
  navigateUrl!: string;
  exceptionBox!: boolean;
  errorCode!: string;

  realEstateValue = [{ field: 'realEstateValueType', header: this.translate.instant('asset.indexation.labels.realEstateValueType'), property: 'realEstateValueType', pSortableColumnDisabled: true, width: '40%' },
  { field: 'isIndexationApplicable', header: this.translate.instant('asset.indexation.labels.applyIndexation'), property: 'isIndexationApplicable', width: '20%' },
  { field: 'isPossibleReferenceValue', header: this.translate.instant('asset.indexation.labels.useAsReferenceValue'), property: 'isPossibleReferenceValue', width: '20%' },
  { field: 'isOverrulingReferenceValueAllowed', header: this.translate.instant('asset.indexation.labels.allowOverrulingReferenceValue'), property: 'isOverrulingReferenceValueAllowed', pSortableColumnDisabled: true, width: '20%' }]

  product = [{ field: 'productName.caption', header: this.translate.instant('asset.indexation.labels.productName'), property: 'productName', width: '92%' }, { field: null, property: 'Delete', header: this.translate.instant('asset.indexation.labels.delete'), width: '8%' }]

  loan = [{ field: 'loanPurpose.caption', header: this.translate.instant('asset.indexation.labels.loanPurpose'), property: 'loanPurpose', width: '92%' }, { field: null, property: 'Delete', header: this.translate.instant('asset.indexation.labels.delete'), width: '8%' }]

  realEstate = [{ field: 'realEstatePurposeType.caption', header: this.translate.instant('asset.indexation.labels.realEstatePurposeType'), property: 'realEstatePurposeType', width: '92%' }, { field: null, property: 'Delete', header: this.translate.instant('asset.indexation.labels.delete'), width: '8%' }]

  

  constructor(public fluidService: FluidControlsBaseService, public translate: TranslateService, public assetService: IndexationService, public datePipe: DatePipe,
    private fluidValidation: fluidValidationService, private spinnerService: SpinnerService, private route: ActivatedRoute, private decimalPipe: DecimalTransformPipe,
    private commonService: ConfigContextService, public router: Router) {
    const config = commonService.getDefaultConfigRoute();
    this.navigateUrl = config?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.validationHeader = this.translate.instant('asset.validation.validationHeader');
    this.saveIndexation.ignoreValidation = false;
    this.isValidToCheck = false;
    this.route.data.subscribe((res:any) => {
      this.spinnerService.setIsLoading(false);
      this.indexationList = res.IndexationData

      this.indexationList.manageIndexationConfigList.forEach(x => {
        x.modifiedIndexA = x.indexFactorA?.toFixed(2) as string;
        x.modifiedIndexB = x.indexFactorB?.toFixed(2) as string;
        x.modifiedIndexD = x.indexFactorD?.toFixed(2) as string;
        x.modifiedIndexE = x.indexFactorE?.toFixed(2) as string;
        x.modifiedIndexG = x.indexFactorG?.toFixed(2) as string;
        x.modifiedIndexH = x.indexFactorH?.toFixed(2) as string;
        x.modifiedIndexK = x.indexFactorK?.toFixed(2) as string;
        x.modifiedIndexL = x.indexFactorL?.toFixed(2) as string;
        x.modifiedIndexM = x.indexFactorM?.toFixed(2) as string;
        x.modifiedIndexP = x.indexFactorP?.toFixed(2) as string;
        x.modifiedIndexS = x.indexFactorS?.toFixed(2) as string;
        x.modifiedIndexX = x.indexFactorX?.toFixed(2) as string;
        x.modifiedCorrectionFactor = x.correctionFactor?.toFixed(2) as string;
      })

      const updatedList = this.indexationList.manageIndexationConfigList.map(x => {
        return {
          ...x,
          validFrom: new Date(x?.validFrom),
          validTo: new Date(x?.validTo as Date),
          modifiedValidFrom: this.datePipe.transform(x?.validFrom, 'dd/MM/yyyy'),
          modifiedValidTo: this.datePipe.transform(x?.validTo, 'dd/MM/yyyy'),
        }
      })
      this.indexationList.manageIndexationConfigList = updatedList;
      this.indexationList.manageIndexationConfigList.forEach(x => {
        if (x.modifiedValidTo == null)
          x.validTo = null;
      })
      this.indexationList.manageIndexationConfigList[0].isSelected = true;
      this.indexationDetails = this.indexationList.manageIndexationConfigList[0];
      this.indexationList.manageRealEstateValueTypeConfigList[0].isRealEstateSelected = true;
      this.realEstateDetails = this.indexationList.manageRealEstateValueTypeConfigList[0];
      this.realEstateDetails.selectedIndex = 0;
      this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2ProductList.forEach(y => y.isDeleted = false))
      this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2LoanPurposeList.forEach(y => y.isDeleted = false))
      this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2RealEstatePurposeTypeList.forEach(y => y.isDeleted = false))
      this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.isCheckBoxReadOnly = true)
      this.realEstateDetails.isCheckBoxReadOnly = false;
      if (this.indexationList.manageIndexationConfigList.length != 0)
        this.onSelectIndexation = true;
      else
        this.onSelectIndexation = false;
      this.commonRealEstateValueDropdown = [...this.indexationList.manageIndexationConfigInitialData.realEstateValueTypeList];

      this.manageIndexationHeader = [{ header: this.translate.instant('asset.indexation.labels.validFrom'), field: 'modifiedValidFrom', dateSort: 'validFrom', width: '7%' },
        { header: this.translate.instant('asset.indexation.labels.validTo'), field: 'modifiedValidTo', dateSort: 'validTo', width: '7%' },
        { header: this.translate.instant('asset.indexation.labels.reference'), field: 'reference', width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.a'), field: 'modifiedIndexA', amountSort:'indexFactorA', width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.b'), field: 'modifiedIndexB', amountSort: 'indexFactorB', width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.d'), field: 'modifiedIndexD', amountSort: 'indexFactorD',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.e'), field: 'modifiedIndexE', amountSort: 'indexFactorE',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.x'), field: 'modifiedIndexX', amountSort: 'indexFactorX',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.g'), field: 'modifiedIndexG', amountSort: 'indexFactorG',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.m'), field: 'modifiedIndexM', amountSort: 'indexFactorM',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.l'), field: 'modifiedIndexL', amountSort: 'indexFactorL',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.h'), field: 'modifiedIndexH', amountSort: 'indexFactorH',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.s'), field: 'modifiedIndexS', amountSort: 'indexFactorS',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.p'), field: 'modifiedIndexP', amountSort: 'indexFactorP', width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.k'), field: 'modifiedIndexK', amountSort: 'indexFactorK',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.correctionFactor'), field: 'modifiedCorrectionFactor', amountSort: 'correctionFactor',width: '5%' },
        { header: this.translate.instant('asset.indexation.labels.roundingScale'), field: 'roundingScale.caption', width: '5%' },
      { header: this.translate.instant('asset.indexation.labels.delete'), field: 'deleteButton', width: '5%', fieldType: 'deleteButton' }]
    }, err => {
      this.spinnerService.setIsLoading(false);
      this.exceptionBox = true;
      if (err?.error?.errorCode) {
        this.errorCode = err?.error?.errorCode;
      }
      else {
        this.errorCode = 'InternalServiceFault';
      }
    })
  }

  dataSelection(event: IndexationConfigDto) {
    if (this.indexationform.valid && !this.isValidToCheck) {
      if (event) {
        this.RemoveBusinessErrors();
        this.settingIsSelectedFalse();
        this.indexationDetails = event;
        this.indexationDetails.isSelected = true;
      }
    }
    else {
      this.validateRealEstateError();
    }
  }

  realEstateDataSelect(event: RealEstateValueTypeConfigDto) {
    if ((this.indexationform.valid || event.isRealEstateSelected) && !this.isValidToCheck) {
      if (event) {
        this.RemoveBusinessErrors();
        this.settingIsRealEstateSelectedFalse();
        this.settingCheckboxDisableTrue();
        this.realEstateDetails = event;
        this.realEstateDetails.isRealEstateSelected = true;
        const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
        this.realEstateDetails.selectedIndex = index;
        this.realEstateDetails.isCheckBoxReadOnly = false;
      }
    }
    else {
      this.validateRealEstateError();
    }
  }

  settingCheckboxDisableTrue() {
    this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.isCheckBoxReadOnly = true);
  }

  IsPeriodOverlapping(startDateA: Date, endDateA: Date | null, startDateB: Date, endDateB: Date | null): boolean {
    if (!endDateA && !endDateB) { return true }
    else if (endDateA && !endDateB && startDateB <= endDateA) { return true; }
    else if (!endDateA && endDateB && endDateB >= startDateA) { return true; }
    else if (endDateA && endDateB && startDateA <= endDateB && endDateA >= startDateB) { return true; }
    return false
  }

  onSave(data: ManageIndexationConfigInitialDataDto) {
    this.RemoveBusinessErrors();
    const indexationConfigListFiltered = data.manageIndexationConfigList.filter(x => x.state != 4);
    indexationConfigListFiltered.sort((a, b) => (a.validFrom < b.validFrom) ? -1 : 1).pop()
    const sortedList = indexationConfigListFiltered.sort((a, b) => (a.validFrom < b.validFrom) ? -1 : 1);
    const index = sortedList.findIndex(x => x.validTo == null)

    const indexationListFiltered = data.manageIndexationConfigList.filter(x => x.state != 4);

    let validCheck = false;
    indexationListFiltered.map(x => indexationListFiltered.map(y => {
      if (x != y && this.IsPeriodOverlapping(x.validFrom, x.validTo, y.validFrom, y.validTo)) {
        validCheck = true;
      }

    }))

    if (this.indexationform.valid && !this.isValidToCheck) {
      if (index == -1) {
        if (!validCheck) {

          data.manageIndexationConfigList.map(x => {
            if (x.state != 0) {
              if (x.validFrom != null || x.validFrom != undefined) {
                x.validFrom = new Date(Date.UTC(x.validFrom.getFullYear(), x.validFrom.getMonth(), x.validFrom.getDate(), 0, 0, 0));
              }
              if (x.validTo != null || x.validTo != undefined) {
                x.validTo = new Date(Date.UTC(x.validTo.getFullYear(), x.validTo.getMonth(), x.validTo.getDate(), 0, 0, 0));
              }
            }
          })

          data.manageRealEstateValueTypeConfigList.forEach(x => {
            const notDeleted = x.realEstateValueTypeConfig2ProductList.filter(y => y.isDeleted == false)
            x.realEstateValueTypeConfig2ProductList = notDeleted;
          })

          data.manageRealEstateValueTypeConfigList.forEach(x => {
            const notDeleted = x.realEstateValueTypeConfig2LoanPurposeList.filter(y => y.isDeleted == false)
            x.realEstateValueTypeConfig2LoanPurposeList = notDeleted;
          })

          data.manageRealEstateValueTypeConfigList.forEach(x => {
            const notDeleted = x.realEstateValueTypeConfig2RealEstatePurposeTypeList.filter(y => y.isDeleted == false)
            x.realEstateValueTypeConfig2RealEstatePurposeTypeList = notDeleted;
          })

          if (this.saveIndexation.ignoreValidation == false) {
            const saveData = { ...data };
            saveData.manageIndexationConfigList.forEach(x => {

              if (x.state != 0) {
                this.saveIndexation.manageIndexationConfigList.push({ ...x })
              }
            });
            saveData.manageRealEstateValueTypeConfigList.forEach(x => {

              if (x.state != 0) {
                this.saveIndexation.manageRealEstateValueTypeConfigList.push({ ...x })
              }
            });
          }
          this.spinnerService.setIsLoading(true);
          this.assetService.saveManageIndexation(this.saveIndexation).subscribe(res => {
            const list = res as SaveManageIndexationConfigDto;
            this.spinnerService.setIsLoading(false);
            if (list.enableWarning && list.validateDelete) {
              this.confirmationMessage = this.translate.instant('asset.indexation.confirmation.DoYouWishToContinueDelete?');
              this.showConfirmationDialog = true;
            }
            else if (list.enableWarning && list.validateUpdate) {
              this.confirmationMessage = this.translate.instant('asset.indexation.confirmation.DoYouWishToContinueUpdate?');
              this.showConfirmationDialog = true;
            }
            else {
              this.indexationList.manageIndexationConfigList = list.manageIndexationConfigList;
              this.indexationList.manageRealEstateValueTypeConfigList = list.manageRealEstateValueTypeConfigList;

              this.indexationList.manageIndexationConfigList.forEach(x => {
                x.modifiedIndexA = x.indexFactorA?.toFixed(2) as string;
                x.modifiedIndexB = x.indexFactorB?.toFixed(2) as string;
                x.modifiedIndexD = x.indexFactorD?.toFixed(2) as string;
                x.modifiedIndexE = x.indexFactorE?.toFixed(2) as string;
                x.modifiedIndexG = x.indexFactorG?.toFixed(2) as string;
                x.modifiedIndexH = x.indexFactorH?.toFixed(2) as string;
                x.modifiedIndexK = x.indexFactorK?.toFixed(2) as string;
                x.modifiedIndexL = x.indexFactorL?.toFixed(2) as string;
                x.modifiedIndexM = x.indexFactorM?.toFixed(2) as string;
                x.modifiedIndexP = x.indexFactorP?.toFixed(2) as string;
                x.modifiedIndexS = x.indexFactorS?.toFixed(2) as string;
                x.modifiedIndexX = x.indexFactorX?.toFixed(2) as string;
                x.modifiedCorrectionFactor = x.correctionFactor?.toFixed(2) as string;
              })

              const updatedList = this.indexationList.manageIndexationConfigList.map(x => {
                return {
                  ...x,
                  validFrom: new Date(x?.validFrom),
                  validTo: new Date(x?.validTo as Date),
                  modifiedValidFrom: this.datePipe.transform(x?.validFrom, 'dd/MM/yyyy'),
                  modifiedValidTo: this.datePipe.transform(x?.validTo, 'dd/MM/yyyy')
                }
              })
              this.indexationList.manageIndexationConfigList = updatedList;
              this.indexationList.manageIndexationConfigList.forEach(x => {
                if (x.modifiedValidTo == null)
                  x.validTo = null;
              })
              const indexationIndex = this.indexationList.manageIndexationConfigList.findIndex(x => x.modifiedValidFrom == this.indexationDetails.modifiedValidFrom);
              if (indexationIndex != -1) {
                this.indexationList.manageIndexationConfigList[indexationIndex].isSelected = true;
                this.indexationDetails = this.indexationList.manageIndexationConfigList[indexationIndex];
                this.indexationDetails.isSelected = true;
              }
              const realEstateIndex = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.realEstateValueType.caption == this.realEstateDetails.realEstateValueType.caption);
              if (realEstateIndex != -1) {
                this.settingIsRealEstateSelectedFalse();
                this.settingCheckboxDisableTrue();
                this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.state = 0);
                this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2ProductList.forEach(y => y.isDeleted = false))
                this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2LoanPurposeList.forEach(y => y.isDeleted = false))
                this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.realEstateValueTypeConfig2RealEstatePurposeTypeList.forEach(y => y.isDeleted = false))
                this.indexationList.manageRealEstateValueTypeConfigList[realEstateIndex].isRealEstateSelected = true;
                this.indexationList.manageRealEstateValueTypeConfigList[realEstateIndex].isCheckBoxReadOnly = false;
                this.realEstateDetails = this.indexationList.manageRealEstateValueTypeConfigList[realEstateIndex];
                this.realEstateDetails.isRealEstateSelected = true;
              }
              this.saveIndexation = new SaveManageIndexationConfigDto;
              this.saveIndexation.ignoreValidation = false;
            }

          }, err => {
            this.spinnerService.setIsLoading(false);
            if (err.error.toString().indexOf(this.translate.instant('asset.indexation.businessError.IndexesMandatory')) > -1) {
              this.throwBusinessError(this.translate.instant('asset.indexation.businessError.IndexesMandatory'));
            }
            else {
              this.exceptionBox = true;
              if (err?.error?.errorCode) {
                this.errorCode = err?.error?.errorCode;
              }
              else {
                this.errorCode = 'InternalServiceFault';
              }
            }
            this.saveIndexation = new SaveManageIndexationConfigDto;
            this.saveIndexation.ignoreValidation = false;
          });

        }
        else {
          this.throwBusinessError(this.translate.instant('asset.indexation.businessError.validFromCheck'))
        }
      }
      else {
        this.throwBusinessError(this.translate.instant('asset.indexation.businessError.validToDateNullCheck'))
      }
    }
    else {
      this.validateRealEstateError();
    }

  }

  RemoveBusinessErrors() {
    this.RemoveBusinessError(this.translate.instant('asset.indexation.businessError.validToDateNullCheck'))
    this.RemoveBusinessError(this.translate.instant('asset.indexation.businessError.validFromCheck'))
    this.RemoveBusinessError(this.translate.instant('asset.indexation.businessError.IndexesMandatory'));
  }

  onClickYes(indexationList: ManageIndexationConfigInitialDataDto) {
    this.saveIndexation.ignoreValidation = true;
    this.onSave(indexationList);
    this.showConfirmationDialog = false;
  }

  onClickNo(indexationList: ManageIndexationConfigInitialDataDto) {
    this.saveIndexation.ignoreValidation = true;
    this.saveIndexation.manageIndexationConfigList = [];
    this.saveIndexation.manageRealEstateValueTypeConfigList = [];
    this.onSave(indexationList);
    this.showConfirmationDialog = false;
  }
  onClickCancel() {
    this.showConfirmationDialog = false;
  }

  addIndexation() {
    if (this.indexationform.valid && !this.isValidToCheck) {
      this.validFromDateConfig.externalError = false;
      this.RemoveBusinessErrors();
      this.settingIsSelectedFalse();
      this.onSelectIndexation = true;
      const newRow = new IndexationConfigDto;
      newRow.isSelected = true;
      const newuserList = this.indexationList.manageIndexationConfigList;
      newuserList.push({ ...newRow });
      this.indexationDetails = new IndexationConfigDto;
      this.indexationList.manageIndexationConfigList = [...newuserList];
      const index = this.indexationList.manageIndexationConfigInitialData.roundingScaleList.findIndex(x => x.codeId == 6);
      this.indexationDetails.pKey = 0;
      this.indexationDetails.state = 1;
      this.indexationDetails.rowVersion = 0;
      this.indexationDetails.isSelected = true;
      this.indexationDetails.roundingScale = this.indexationList.manageIndexationConfigInitialData.roundingScaleList[index];
      this.indexationList.manageIndexationConfigList[this.indexationList.manageIndexationConfigList.length - 1] = this.indexationDetails;
    }
    else {
      this.validateRealEstateError();
    }
  }

  addRealEstateValue() {
    if (this.indexationform.valid && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      if (this.indexationList.manageRealEstateValueTypeConfigList.length > 0) {
        this.commonRealEstateValueDropdown = this.indexationList.manageIndexationConfigInitialData.realEstateValueTypeList.filter(val => {
          return !this.indexationList.manageRealEstateValueTypeConfigList.find(x => {
            return x.realEstateValueType.codeId == val.codeId;
          })
        })
      }

      this.settingIsRealEstateSelectedFalse();
      this.settingCheckboxDisableTrue();
      const newRow = new RealEstateValueTypeConfigDto;
      newRow.isReadOnly = true;
      newRow.isRealEstateSelected = true;
      newRow.isCheckBoxReadOnly = false;
      newRow.realEstateValueTypeList = this.commonRealEstateValueDropdown;
      const newuserList = this.indexationList.manageRealEstateValueTypeConfigList;
      newuserList.push({ ...newRow });
      this.indexationList.manageRealEstateValueTypeConfigList = [...newuserList];
      this.realEstateDetails = new RealEstateValueTypeConfigDto;
      this.realEstateDetails.state = 1;
      this.realEstateDetails.pKey = 0;
      this.realEstateValueTypeDropdownConfig.externalError = false;
    }
    else {
      this.validateRealEstateError();
    }
  }

  addProduct() {
    if (this.indexationform.valid && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.commonProductDropdown = this.indexationList.manageIndexationConfigInitialData.productNameList.filter(val => {
        return !this.realEstateDetails.realEstateValueTypeConfig2ProductList.find(x => {
          if (!x.isDeleted)
            return x.productName.codeId == val.codeId;
          return false
        });
      })

      const newRow = new RealEstateValueType2ProductDto;
      newRow.isReadOnly = true;
      newRow.isProductReadOnly = false;
      newRow.isDeleted = false;
      this.commonProductDropdown.forEach(x => newRow.productNameList.push({ ...x }));
      this.realEstateDetails.realEstateValueTypeConfig2ProductList.push({ ...newRow });

      this.indexationList.manageRealEstateValueTypeConfigList[index].realEstateValueTypeConfig2ProductList = this.realEstateDetails.realEstateValueTypeConfig2ProductList;
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.productNameDropdownConfig.externalError = false;
    }
    else {
      this.validateRealEstateError();
    }
  }

  addLoan() {
    if (this.indexationform.valid && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.commonLoadDropdown = this.indexationList.manageIndexationConfigInitialData.loanPurposeList.filter(val => {
        return !this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList.find(x => {
          if (!x.isDeleted)
            return x.loanPurpose.codeId == val.codeId;
          return false
        });
      })


      const newRow = new RealEstateValueType2LoanPurposeDto;
      newRow.isReadOnly = true;
      newRow.isLoanReadOnly = false;
      newRow.isDeleted = false;
      newRow.loanPurposeList = this.commonLoadDropdown;
      const newuserList = this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList;
      newuserList.push({ ...newRow });
      this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList = [...newuserList];
      this.indexationList.manageRealEstateValueTypeConfigList[index].realEstateValueTypeConfig2LoanPurposeList = this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList;
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.loanPurposeDropdownConfig.externalError = false;
    }
    else {
      this.validateRealEstateError();
    }
  }

  addRealEstate() {
    if (this.indexationform.valid && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.commonRealEstateDropdown = this.indexationList.manageIndexationConfigInitialData.realEstatePurposeTypeList.filter(val => {
        return !this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList.find(x => {
          if (!x.isDeleted)
            return x.realEstatePurposeType.codeId == val.codeId;
          return false
        });
      })

      const newRow = new RealEstateValueType2RealEstatePurposeTypeDto;
      newRow.isReadOnly = true;
      newRow.isRealEstateReadOnly = false;
      newRow.isDeleted = false;
      newRow.realEstatePurposeTypeList = this.commonRealEstateDropdown;
      const newuserList = this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList;
      newuserList.push({ ...newRow });
      this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList = [...newuserList];
      this.indexationList.manageRealEstateValueTypeConfigList[index].realEstateValueTypeConfig2RealEstatePurposeTypeList = this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList;
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.realEstatePurposeDropdownConfig.externalError = false;
    }
    else {
      this.validateRealEstateError();
    }
  }

  onRowDelete(event: IndexationConfigDto, gridData: IndexationConfigDto[]) {
    this.RemoveBusinessErrors();
    if ((this.indexationform.valid && !this.isValidToCheck) || (event.validFrom == undefined || event.validFrom == null)) {
      this.settingIsSelectedFalse();
      event.isSelected = true;
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      if (this.indexationDetails.state != 1) {
        event.state = 4;
        this.saveIndexation.manageIndexationConfigList.push({ ...event });
      }
      gridData.splice(deletedata, 1);
      this.indexationList.manageIndexationConfigList = [...gridData];
      this.validFromDateConfig.externalError = false;
      if (this.indexationList.manageIndexationConfigList.length > 0) {
        this.settingIsSelectedFalse();
        this.indexationList.manageIndexationConfigList[0].isSelected = true;
        this.indexationDetails = this.indexationList.manageIndexationConfigList[0];
      }
      if (this.indexationList.manageIndexationConfigList.length == 0) {

        setTimeout(() => {
          this.onSelectIndexation = false;
        }, 1);
      }
    }
  }

  onProductDelete(event: RealEstateValueType2ProductDto, gridData: RealEstateValueType2ProductDto[]) {
    if (this.indexationform.valid || event.productName == undefined && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })

      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      if (this.productNameDropdownConfig.externalError) {
        this.productNameDropdownConfig.externalError = false;
        setTimeout(() => {
          this.deleteProduct(deletedata, this.realEstateDetails.realEstateValueTypeConfig2ProductList);
        }, 0.00001);
      }
      else {
        this.deleteProduct(deletedata, this.realEstateDetails.realEstateValueTypeConfig2ProductList);
      }
    }
  }

  deleteProduct(deletedata: number, realEstateDetails: RealEstateValueType2ProductDto[]) {
    realEstateDetails[deletedata].isDeleted = true;
  }

  onLoanDelete(event: RealEstateValueType2LoanPurposeDto, gridData: RealEstateValueType2LoanPurposeDto[]) {
    if (this.indexationform.valid || event.loanPurpose == undefined && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      if (this.loanPurposeDropdownConfig.externalError) {
        this.loanPurposeDropdownConfig.externalError = false;
        setTimeout(() => {
          this.deleteLoan(deletedata, this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList);
        }, 0.00001)
      }
      else {
        this.deleteLoan(deletedata, this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList);
      }
    }
  }

  deleteLoan(deletedata: number, realEstateDetails: RealEstateValueType2LoanPurposeDto[]) {
    realEstateDetails[deletedata].isDeleted = true;
  }

  onRealEstateDelete(event: RealEstateValueType2RealEstatePurposeTypeDto, gridData: RealEstateValueType2RealEstatePurposeTypeDto[]) {
    if (this.indexationform.valid || event.realEstatePurposeType == undefined && !this.isValidToCheck) {
      this.RemoveBusinessErrors();
      const deletedata = gridData.findIndex(data => {
        return (data == event);
      })
      const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
      this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      if (this.realEstatePurposeDropdownConfig.externalError) {
        this.realEstatePurposeDropdownConfig.externalError = false;
        setTimeout(() => {
          this.deleteRealEstate(deletedata, this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList);
        }, 0.00001);
      }
      else {
        this.deleteRealEstate(deletedata, this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList);
      }
    }
  }

  deleteRealEstate(deletedata: number, realEstateDetails: RealEstateValueType2RealEstatePurposeTypeDto[]) {
    realEstateDetails[deletedata].isDeleted = true;
  }

  settingIsSelectedFalse() {
    this.indexationList.manageIndexationConfigList.forEach(x => x.isSelected = false);
  }

  settingIsRealEstateSelectedFalse() {
    this.indexationList.manageRealEstateValueTypeConfigList.forEach(x => x.isRealEstateSelected = false);
  }

  validateRealEstateError() {
    const productIndex = this.realEstateDetails.realEstateValueTypeConfig2ProductList.findIndex(x => x.productName == undefined)
    const loanIndex = this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList.findIndex(x => x.loanPurpose == undefined)
    const realEstateIndex = this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList.findIndex(x => x.realEstatePurposeType == undefined)

    if (this.indexationDetails?.validFrom == undefined || this.indexationDetails?.validFrom == null) {
      this.validFromDateConfig.externalError = true;
    }

    const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (this.indexationList.manageRealEstateValueTypeConfigList[index].realEstateValueType == undefined) {
      this.realEstateValueTypeDropdownConfig.externalError = true;
    }
    if (productIndex != -1) {
      this.productNameDropdownConfig.externalError = true;
    }
    if (loanIndex != -1) {
      this.loanPurposeDropdownConfig.externalError = true;
    }
    if (realEstateIndex != -1) {
      this.realEstatePurposeDropdownConfig.externalError = true;
    }
  }

  onChangeValidFrom(event: Date) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (event) {
      const displayDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (index != -1) {
        if (this.indexationList.manageIndexationConfigList[index].state == 0)
          this.indexationList.manageIndexationConfigList[index].state = 3;
        this.indexationList.manageIndexationConfigList[index].validFrom = event;
        this.indexationList.manageIndexationConfigList[index].modifiedValidFrom = displayDate;
      }
      this.indexationDetails.modifiedValidFrom = displayDate;
      this.indexationDetails.validFrom = event;
    }
    else {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      this.indexationList.manageIndexationConfigList[index].validFrom = event;
      this.indexationList.manageIndexationConfigList[index].modifiedValidFrom = null;
      this.indexationDetails.modifiedValidFrom = null;
      this.indexationDetails.validFrom = event;
      this.validFromDateConfig.externalError = true;
    }
  }

  onChangeValidTo(event: Date) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (event) {
      const displayDate = this.datePipe.transform(event, 'dd/MM/yyyy');
      if (index != -1) {
        if (this.indexationList.manageIndexationConfigList[index].state == 0)
          this.indexationList.manageIndexationConfigList[index].state = 3;
        this.indexationList.manageIndexationConfigList[index].validTo = event;
        this.indexationList.manageIndexationConfigList[index].modifiedValidTo = displayDate;
      }
      this.indexationDetails.modifiedValidTo = displayDate;
      this.indexationDetails.validTo = event;
    }
    else {
      this.indexationDetails.modifiedValidTo = null;
      this.indexationDetails.validTo = null;
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      this.indexationList.manageIndexationConfigList[index].modifiedValidTo = null;
      this.indexationList.manageIndexationConfigList[index].validTo = null;
    }
  }

  onChangeReference(event: any) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      this.indexationList.manageIndexationConfigList[index].reference = event?.target?.value;
    }
    this.indexationDetails.reference = event?.target?.value;
  }

  onChangeCorrectionFactor(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].correctionFactor = parseFloat(floatValue);
          this.indexationDetails.correctionFactor = parseFloat(floatValue);
          this.indexationDetails.modifiedCorrectionFactor = floatValue
        }
      }
      else {
        setTimeout(() => {
          this.indexationList.manageIndexationConfigList[index].correctionFactor = null;
          this.indexationDetails.correctionFactor = null;
          this.indexationDetails.modifiedCorrectionFactor = null
        }, 2)
      }
    }
  }

  onChangeRoundingScale(event: CodeTable) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      this.indexationList.manageIndexationConfigList[index].roundingScale = event;
    }
    this.indexationDetails.roundingScale = event;
  }

  onChangeIndexFactorA(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorA = parseFloat(floatValue);
          this.indexationDetails.indexFactorA = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexA = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorA = null;
        this.indexationDetails.indexFactorA = null;
        this.indexationDetails.modifiedIndexA = null
      }
    }
  }

  onChangeIndexFactorM(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorM = parseFloat(floatValue);
          this.indexationDetails.indexFactorM = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexM = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorM = null;
        this.indexationDetails.indexFactorM = null;
        this.indexationDetails.modifiedIndexM = null
      }
    }

  }

  onChangeIndexFactorB(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorB = parseFloat(floatValue);
          this.indexationDetails.indexFactorB = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexB = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorB = null;
        this.indexationDetails.indexFactorB = null;
        this.indexationDetails.modifiedIndexB = null
      }
    }

  }

  onChangeIndexFactorL(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorL = parseFloat(floatValue);
          this.indexationDetails.indexFactorL = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexL = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorL = null;
        this.indexationDetails.indexFactorL = null;
        this.indexationDetails.modifiedIndexL = null
      }
    }

  }

  onChangeIndexFactorD(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorD = parseFloat(floatValue);
          this.indexationDetails.indexFactorD = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexD = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorD = null;
        this.indexationDetails.indexFactorD = null;
        this.indexationDetails.modifiedIndexD = null
      }
    }
  }

  onChangeIndexFactorH(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorH = parseFloat(floatValue);
          this.indexationDetails.indexFactorH = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexH = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorH = null;
        this.indexationDetails.indexFactorH = null;
        this.indexationDetails.modifiedIndexH = null
      }
    }
  }

  onChangeIndexFactorE(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorE = parseFloat(floatValue);
          this.indexationDetails.indexFactorE = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexE = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorE = null;
        this.indexationDetails.indexFactorE = null;
        this.indexationDetails.modifiedIndexE = null
      }
    }
  }

  onChangeIndexFactorS(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorS = parseFloat(floatValue);
          this.indexationDetails.indexFactorS = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexS = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorS = null;
        this.indexationDetails.indexFactorS = null;
        this.indexationDetails.modifiedIndexS = null
      }
    }
  }

  onChangeIndexFactorX(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorX = parseFloat(floatValue);
          this.indexationDetails.indexFactorX = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexX = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorX = null;
        this.indexationDetails.indexFactorX = null;
        this.indexationDetails.modifiedIndexX = null
      }
    }
  }

  onChangeIndexFactorP(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorP = parseFloat(floatValue);
          this.indexationDetails.indexFactorP = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexP = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorP = null;
        this.indexationDetails.indexFactorP = null;
        this.indexationDetails.modifiedIndexP = null
      }
    }
  }

  onChangeIndexFactorG(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorG = parseFloat(floatValue);
          this.indexationDetails.indexFactorG = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexG = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorG = null;
        this.indexationDetails.indexFactorG = null;
        this.indexationDetails.modifiedIndexG = null
      }
    }
  }

  onChangeIndexFactorK(event: any, isChanged: boolean) {
    const index = this.indexationList.manageIndexationConfigList.findIndex(x => x.isSelected);
    if (index != -1) {
      if (this.indexationList.manageIndexationConfigList[index].state == 0)
        this.indexationList.manageIndexationConfigList[index].state = 3;
      if (event != null) {
        if (!isChanged) {
          const eventConversion = event.toString().split('.').join('')
          const value = eventConversion.toString().replace(',', '.')
          const floatValue = parseFloat(value).toFixed(2);

          this.indexationList.manageIndexationConfigList[index].indexFactorK = parseFloat(floatValue);
          this.indexationDetails.indexFactorK = parseFloat(floatValue);
          this.indexationDetails.modifiedIndexK = floatValue
        }
      }
      else {
        this.indexationList.manageIndexationConfigList[index].indexFactorK = null;
        this.indexationDetails.indexFactorK = null;
        this.indexationDetails.modifiedIndexK = null
      }
    }
  }

  onChangeRealEstateValueType(event: any) {
    const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    this.indexationList.manageRealEstateValueTypeConfigList[index].realEstateValueType = event?.value;
    this.indexationList.manageRealEstateValueTypeConfigList[index].isRealEstateValueReadOnly = true;
  }

  onChangeisIndexationApplicable(event: boolean) {

    const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (index != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[index].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.indexationList.manageRealEstateValueTypeConfigList[index].isIndexationApplicable = event;
    }
  }

  onChangeisPossibleReferenceValue(event: boolean) {
    const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (index != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[index].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.indexationList.manageRealEstateValueTypeConfigList[index].isPossibleReferenceValue = event;
    }
  }

  onChangeisOverrulingReferenceValueAllowed(event: boolean, events: any) {
    this.realEstateDataSelect(events);
    const index = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (index != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[index].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[index].state = 3;
      this.indexationList.manageRealEstateValueTypeConfigList[index].isOverrulingReferenceValueAllowed = event;
    }
  }

  onChangeProduct(event: any, index: number) {
    const listindex = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (listindex != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[listindex].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[listindex].state = 3;
    }
    this.realEstateDetails.realEstateValueTypeConfig2ProductList[index].productName = event?.value;
    this.realEstateDetails.realEstateValueTypeConfig2ProductList[index].isProductReadOnly = true;
  }

  onChangeLoan(event: any, index: number) {
    const listindex = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (listindex != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[listindex].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[listindex].state = 3;
    }
    this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList[index].loanPurpose = event?.value;
    this.realEstateDetails.realEstateValueTypeConfig2LoanPurposeList[index].isLoanReadOnly = true;
  }

  onChangeRealEstate(event: any, index: number) {
    const listindex = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.isRealEstateSelected);
    if (listindex != -1) {
      if (this.indexationList.manageRealEstateValueTypeConfigList[listindex].state == 0)
        this.indexationList.manageRealEstateValueTypeConfigList[listindex].state = 3;
    }
    this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList[index].realEstatePurposeType = event?.value;
    this.realEstateDetails.realEstateValueTypeConfig2RealEstatePurposeTypeList[index].isRealEstateReadOnly = true;
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
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList
        .findIndex(x => x.ErrorMessage == ErrorMessage && x.IsBusinessError)
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    })
  }

  onException() {
    this.exceptionBox = false;
  }


  onClose() {
    const updatedIndexation = this.indexationList.manageIndexationConfigList.findIndex(x => x.state == 1 || x.state == 3);
    const updatedRealEstate = this.indexationList.manageRealEstateValueTypeConfigList.findIndex(x => x.state == 1 || x.state == 3);
    if (this.saveIndexation.manageIndexationConfigList.length > 0 || this.saveIndexation.manageRealEstateValueTypeConfigList.length > 0 || updatedIndexation != -1 || updatedRealEstate != -1)
      this.showDialog = true;
    else
      window.location.assign(this.navigateUrl);
  }

  onYes(indexationList: ManageIndexationConfigInitialDataDto) {
    this.showDialog = false;
      this.onSave(indexationList);
      setTimeout(() => {
        if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length == 0) {
          window.location.assign(this.navigateUrl);
        }
      }, 100)
  }

  onNo() {
    this.RemoveBusinessErrors();
    this.validFromDateConfig.externalError = false
    this.realEstateValueTypeDropdownConfig.externalError = false
    this.productNameDropdownConfig.externalError = false
    this.loanPurposeDropdownConfig.externalError = false
    this.realEstatePurposeDropdownConfig.externalError = false
    this.showDialog = false;
    window.location.assign(this.navigateUrl);
  }
  onCancel() {
    this.showDialog = false;
  }

  buildConfiguration() {

    const validFromError = new ErrorDto;
    validFromError.validation = "required";
    validFromError.isModelError = true;
    validFromError.validationMessage = this.translate.instant('asset.indexation.validationError.validFrom');
    this.validFromDateConfig.required = true;
    this.validFromDateConfig.Errors = [validFromError];

    const productNameError = new ErrorDto;
    productNameError.validation = "required";
    productNameError.isModelError = true;
    productNameError.validationMessage = this.translate.instant('asset.indexation.validationError.productName');
    this.productNameDropdownConfig.required = true;
    this.productNameDropdownConfig.Errors = [productNameError];

    const loanPurposeError = new ErrorDto;
    loanPurposeError.validation = "required";
    loanPurposeError.isModelError = true;
    loanPurposeError.validationMessage = this.translate.instant('asset.indexation.validationError.loanPurpose');
    this.loanPurposeDropdownConfig.required = true;
    this.loanPurposeDropdownConfig.Errors = [loanPurposeError];

    const realEstatePurposeError = new ErrorDto;
    realEstatePurposeError.validation = "required";
    realEstatePurposeError.isModelError = true;
    realEstatePurposeError.validationMessage = this.translate.instant('asset.indexation.validationError.realEstatePurposeType');
    this.realEstatePurposeDropdownConfig.required = true;
    this.realEstatePurposeDropdownConfig.Errors = [realEstatePurposeError];

    const realEstateValueError = new ErrorDto;
    realEstateValueError.validation = "required";
    realEstateValueError.isModelError = true;
    realEstateValueError.validationMessage = this.translate.instant('asset.indexation.validationError.realEstateValueType');
    this.realEstateValueTypeDropdownConfig.required = true;
    this.realEstateValueTypeDropdownConfig.Errors = [realEstateValueError];

  }
}

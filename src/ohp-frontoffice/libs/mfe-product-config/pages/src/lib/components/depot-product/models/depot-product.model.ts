import { DtoBase } from "../../search-product/Models/dtobase.model";

export class BaseModel {
  pKey!: number;
  rowVersion!: number
  state!: DtoState
  canValidate!: boolean
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class DepotProductsDto extends BaseModel 
 {
  depotType!: CodeTable;
  extensionPeriodInMonths!: number | null
  maximumDurationOfDepotInMonths!: number | null
  minimumInitialAmount!: number | null | string
  minimumProvisionAmount!: number | null | string
  constructionDepotType!: CodeTable
  maximumInterestPeriodInMonths!: number | null
  preannounceEndOfDepotPeriod!: number
  isDueDateDepot!: boolean
  depotInterestPercentageMargin!: number | null | string
  isInterestPercentageDerivedFromCredit!: boolean
  isOnlyUsedForCreditInterest!: boolean
  defaultInterestPercentage!: number | null
  useOutstandingForPrepaymentAllowed!: boolean
  isManualInterestPercentageChangeAllowed!: boolean
  depotTypeCaption!: string
  isDefaultInterestPercentageEditable!: boolean
  externalReference!: string
  manualInterestPercentageChangeAllowedVisibility!: boolean
  isSelected!: boolean
  modifiedMinimumInitialAmount!: string | null | number
  modifiedMinimumProvisionAmount!: string | null
  modifiedDepotInterestPercentageMargin!: string | null
  isEnableDropDown!: boolean;
  depotProductTypeList!: DepotTypeDto[];
  depotCaption!: DepotTypeDto;
  creditProviderName!: CreditProviderDto | null;
  creditProviderNameList!: CreditProviderDto[];
  isSubsityDepotType!: boolean
}

export class CodeTable {
  codeId!: number;
  enumCaption!: string;
  caption!: string;
}

export class DepotTypeDto {
  id!:string
  depotTypeCaption!: string
  depotType!: CodeTable
  constructionDepotType!: CodeTable
}

export enum DepotType {
  Due_Date_Depot = 1,
  Construction_Depot = 2
}

export class CreditProviderDto extends DtoBase {
  name!: CodeTable
}

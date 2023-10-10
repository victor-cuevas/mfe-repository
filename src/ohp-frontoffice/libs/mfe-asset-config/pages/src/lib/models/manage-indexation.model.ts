export class BaseDto {
  pKey!: number;
  rowVersion!: number;
  state!: DtoState;
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class CodeTable {
  codeId!: number;
  caption?: string;
  enumCaption!: string;
}

export class ManageIndexationConfigInitialDataDto {
  manageIndexationConfigInitialData: ManageIndexationCodeTablesDto = new ManageIndexationCodeTablesDto;
  manageIndexationConfigList: IndexationConfigDto[]=[];
  manageRealEstateValueTypeConfigList: RealEstateValueTypeConfigDto[]=[];
}

export class ManageIndexationCodeTablesDto {
  indexationConfigList!: CodeTable[];
  roundingScaleList!: CodeTable[];
  realEstateValueTypeList!: CodeTable[];
  productNameList!: CodeTable[];
  loanPurposeList!: CodeTable[];
  realEstatePurposeTypeList!: CodeTable[];
}

export class IndexationConfigDto extends BaseDto {
  correctionFactor!: number | null;
  provinceCodeNL!: string;
  roundingScale!: CodeTable;
  validFrom!: Date;
  validTo!: Date| null;
  indexFactorA!: number | null;
  indexFactorB!: number | null;
  indexFactorD!: number | null;
  indexFactorE!: number | null;
  indexFactorG!: number | null;
  indexFactorH!: number | null;
  indexFactorK!: number | null;
  indexFactorL!: number | null;
  indexFactorM!: number | null;
  indexFactorP!: number | null;
  indexFactorS!: number | null;
  indexFactorX!: number | null;
  indexationConfigPKeyToProvinceCodeNLDictionary!: Dictionary[];
  reference!: string;
  isSelected!: boolean; 
  modifiedValidFrom!: string | null;
  modifiedValidTo!: string | null;
  modifiedIndexA!: string | null;
  modifiedIndexB!: string | null;
  modifiedIndexD!: string | null;
  modifiedIndexE!: string | null;
  modifiedIndexG!: string | null;
  modifiedIndexH!: string | null;
  modifiedIndexK!: string | null;
  modifiedIndexL!: string | null;
  modifiedIndexM!: string | null;
  modifiedIndexP!: string | null;
  modifiedIndexS!: string | null;
  modifiedIndexX!: string | null;
  modifiedCorrectionFactor!: string | null;
}

interface Dictionary {
  key: string;
  value: string;
}

export class RealEstateValueTypeConfigDto extends BaseDto {
  realEstateValueType!: CodeTable;
  isReadOnly!: boolean;
  isIndexationApplicable!: boolean;
  isPossibleReferenceValue!: boolean;
  isOverrulingReferenceValueAllowed!: boolean;
  realEstateValueTypeList!: CodeTable[];
  realEstateValueTypeConfig2ProductList: RealEstateValueType2ProductDto[]=[];
  realEstateValueTypeConfig2LoanPurposeList: RealEstateValueType2LoanPurposeDto[]=[];
  realEstateValueTypeConfig2RealEstatePurposeTypeList: RealEstateValueType2RealEstatePurposeTypeDto[] = [];
  isRealEstateSelected!: boolean;
  selectedIndex!: number;
  isRealEstateValueReadOnly!: boolean;
  isCheckBoxReadOnly!: boolean;
}

export class RealEstateValueType2ProductDto extends BaseDto {
  productName!: CodeTable;
  productNameList: CodeTable[]=[];
  isReadOnly!: boolean;
  isProductReadOnly!: boolean;
  isDeleted!: boolean;
}

export class RealEstateValueType2LoanPurposeDto extends BaseDto {
  loanPurpose!: CodeTable;
  loanPurposeList!: CodeTable[];
  isReadOnly!: boolean;
  isLoanReadOnly!: boolean;
  isDeleted!: boolean;
}

export class RealEstateValueType2RealEstatePurposeTypeDto extends BaseDto{
  realEstatePurposeType!: CodeTable;
  realEstatePurposeTypeList!: CodeTable[];
  isReadOnly!: boolean;
  isRealEstateReadOnly!: boolean;
  isDeleted!: boolean;
}

export class SaveManageIndexationConfigDto {
  manageIndexationConfigList: IndexationConfigDto[]=[];
  manageRealEstateValueTypeConfigList: RealEstateValueTypeConfigDto[]=[];
  ignoreValidation!: boolean;
  enableWarning!: boolean;
  validateUpdate!: boolean;
  validateDelete!: boolean;
}

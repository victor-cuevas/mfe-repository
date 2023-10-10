
export class DtoBase {
  pKey!: number
  rowVersion!: number
  canValidate!: boolean
  state!: DtoState
}

export enum DtoState {
  Unknown,
  Created,
  Unmodified,
  Dirty,
  Deleted
}

export class CodeTable {
  codeId!: number
  caption!: string
  extRefCode!: string
  seqNo!: number
  defaultCaption!: string
  enumCaption!: string
}

export class RefClassBaseDto {
  pKey!: number
  rowVersion!: number
}

export class GetFreeFieldConfigScreenDto {
  freeFieldTypeList!:CodeTable[]
  freeFieldList!: CodeTable[]
  fieldListValueList!: CodeTable[]
  freeFieldContextTypeList!: CodeTable[]
  freeFieldContextSubTypeList!: CodeTable[]
  debtSourceTypeList!: CodeTable[]
  debtSourceSubTypeList!: CodeTable[]
  collectionMeasureTypeList!: CodeTable[]
  salesTypeList!: CodeTable[]
  dossierTypeList!: CodeTable[]
  roleTypeList!: CodeTable[]
  legalEntityList!: LegalEntityRefDto[]
}

export class CmFreeFieldConfigDto extends DtoBase {
  fieldName!: string
  freeField!: CodeTable
  fieldType!: CodeTable
  freeFieldContextType!: CodeTable
  freeFieldContextSubType!: CodeTable
  freeFieldLength!: number
  tagName!: string
  legalEntity!: LegalEntityRefDto
  sequence!: number
  freeFieldConfig2ListValueList: CmFreeFieldConfig2ListValueDto[]=[]
  freeFieldListValueList!: CodeTable
  freeFieldConfig2ContextSubTypeValueList!: CmFreeFieldConfig2FreeFieldContextSubTypeValueDto[]
  isSelected!: boolean
  enablefreeFieldLen!: boolean
}

export class LegalEntityRefDto extends RefClassBaseDto {
  name!: string
  hostedOrganizationName!: string
}

export class CmFreeFieldConfig2ListValueDto extends DtoBase {
  freeFieldListValue!: CodeTable
}

export class CmFreeFieldConfig2FreeFieldContextSubTypeValueDto extends DtoBase {
  freeFieldContextSubType!: number
}

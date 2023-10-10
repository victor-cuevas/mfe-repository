export class DtoBase {
  pKey!: number
  rowVersion!: number
  canValidate!: boolean
  state!:DtoState
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

export class GetManageFreeFieldConfigScreenDataResponseDto {
  manageFreeFieldConfigInitialData!: ManageFreeFieldConfigInitialDataDto
  freeFieldConfigList: FreeFieldConfigDto[]=[];
}

export class ManageFreeFieldConfigInitialDataDto extends DtoBase {
  fieldTypeList!: CodeTable[]
  servicingOrganizationList: ServicingOrganizationDto[]=[]
  freeFieldList!: CodeTable[]
  freeFieldListValueList!: CodeTable[]
}

export class FreeFieldConfigDto extends DtoBase {
  fieldName!: string
  freeField!: CodeTable
  fieldType!: CodeTable
  freeFieldLen!: number
  tagName!: string
  servicingOrganization!: ServicingOrganizationDto 
  sequence!: number | null
  freeFieldConfig2ListValueList: FreeFieldConfig2ListValueDto[]=[]
  isLinkedToFreeFieldValue!: boolean
  isSelected!: boolean;
  isListItemVisible!: boolean;
  hasNoProductCopy!: boolean;
  enablefreeFieldLen!: boolean;
}

export class FreeFieldConfig2ListValueDto extends DtoBase {
  listValue!: CodeTable
  isSelected!: boolean
}

export class ServicingOrganizationDto extends DtoBase {
  name!: CodeTable
}

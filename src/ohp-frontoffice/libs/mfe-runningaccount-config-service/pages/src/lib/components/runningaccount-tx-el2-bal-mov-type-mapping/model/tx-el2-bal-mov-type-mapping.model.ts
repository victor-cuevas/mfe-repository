export class EntityDtoBase {
  pKey!: number
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

export class GetTxEl2BalMoveTypeMappingListDto {
  txEl2BalMovTypeMappingList!: TxEl2BalMovTypeMappingDto[]
  balanceMovementTypeList!: CodeTable[]
  txElTypeList!: CodeTable[]
}

export class CodeTable {
  codeId!: number
  enumCaption!: string
  caption!:string
}

export class TxEl2BalMovTypeMappingDto extends EntityDtoBase{
  balanceMovementTypeCd!: number
  txElTypeCd!: number
  txElType!: CodeTable
  balanceMovementType!: CodeTable
  isSelected!: boolean
  txElTypeList!: CodeTable[]
}


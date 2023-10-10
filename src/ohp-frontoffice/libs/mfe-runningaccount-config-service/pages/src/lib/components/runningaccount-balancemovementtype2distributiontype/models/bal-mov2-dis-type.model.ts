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

export class GetBalMovementType2DistTypeListDto {
  balanceMovementType2DistTypeList!: BalMovementType2DistTypeDto[]
  balanceMovementTypeList!:CodeTable[]
  distributionTypeList!:CodeTable[]
}

export class CodeTable {
  codeId!: number
  enumCaption!: string
  caption!: string
}

export class BalMovementType2DistTypeDto extends EntityDtoBase{
  balanceMovementTypeCd!: number
  distributionTypeCd!: number
  balanceMovementType!: CodeTable
  distributionType!: CodeTable
  isSelected!: boolean
  balanceMovementTypeList!: CodeTable[]
}

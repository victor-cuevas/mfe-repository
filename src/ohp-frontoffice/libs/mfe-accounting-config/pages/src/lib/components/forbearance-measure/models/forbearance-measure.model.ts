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

export class CodeTable {
  codeId!: number
  enumCaption!: string
  caption!: string
}

export class ForbearanceMeasureConfigDto extends EntityDtoBase {
  forbearanceMeasureTypeCd!: number
  nrOfMonthsForPaymentHoliday!: number
  isSubstantialModificationApplicable!: boolean
  substantialModificationPercentage!: number
  nrOfDaysForConcessionTx!: number
  forbearanceMeasureType!: ForbearanceMeasureTypeDto
  isSelected!: boolean
  modifiedSubstantialModificationPercentage!: string
  modifiedIsApplicable!:string
  isForBearanceTypeReadOnly!: boolean
  forbearanceTypeList: CodeTable[]=[]
}

export class ForbearanceMeasureTypeDto extends CodeTable {

}

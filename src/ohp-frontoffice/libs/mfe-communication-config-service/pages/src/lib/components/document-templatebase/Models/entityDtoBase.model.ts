export class EntityDtoBase {
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
  
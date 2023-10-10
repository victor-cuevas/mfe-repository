import { stateModel } from "./state.model"


export class baseModel {
  pKey!: number
  rowVersion!: number
  state!: stateModel
  canValidate!: boolean
}

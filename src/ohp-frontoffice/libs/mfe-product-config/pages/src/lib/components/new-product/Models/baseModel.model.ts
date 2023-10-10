import { stateModel } from "./stateModel.model"

export class baseModel {
  state!: stateModel
  pKey!: number
  rowVersion!: number
  canValidate!: boolean
}

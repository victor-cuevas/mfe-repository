import { state } from "./stateModel"

export class baseModel {
  pKey!: number
  rowVersion!: number
  state!: state
  canValidate!: boolean
}

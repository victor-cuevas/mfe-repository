import { State } from "./modelState"

export class BaseModel {
  pKey?: number
  rowVersion?: number
  state?:State
  canValidate?:boolean
}

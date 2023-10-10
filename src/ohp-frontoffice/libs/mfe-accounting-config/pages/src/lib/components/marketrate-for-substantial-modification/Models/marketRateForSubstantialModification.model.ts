import { baseModel } from "./baseModel.model"


export class marketRateForSubstantialModification extends baseModel {
  nrOfYears!:number
  validFrom!:Date
  validTo!: Date
  modifiedValidFrom!: string | null
  modifiedValidTo!: string | null
  modifiedMarketRate!:string
  marketRate!: number
  isEntered!: boolean
}

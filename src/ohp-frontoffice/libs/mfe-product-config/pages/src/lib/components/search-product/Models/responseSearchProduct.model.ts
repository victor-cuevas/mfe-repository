import { SearchProductResult } from './searchproductresult.model'

export class ResponseSearchProduct{
     items !:SearchProductResult[]
      totalItemCount  !: number
      pageIndex !: number
}
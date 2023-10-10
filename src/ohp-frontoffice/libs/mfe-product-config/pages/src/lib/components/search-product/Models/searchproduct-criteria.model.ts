import { ConsumerProductType } from './consumerproduct-type.model'
import { Dtostate } from './dtobase.model'
import { EconomicalOwnerDto } from './economicalowner.model'
import { JudicialOwnerDto } from './judicialowner.model'
import { ProductName } from './product-name.model'
import { ServicingcustomerDto } from './servicing-customer.model'


export class SearchProductCriteriaDto{
    state !:Dtostate
    pageIndex !: number
    pageSize !: number 
    sortMode !:string | null
    sortColumn !:string  | null
    canValidate !: boolean
    enableSearch !: boolean
    servicingCustomer !: ServicingcustomerDto | null
    economicalOwner !:EconomicalOwnerDto| null
    judicialOwner !: JudicialOwnerDto| null
    consumerProductType !:ConsumerProductType| null
    productFamily !: ProductName | null
    productName !: string | null;
    commercialName!: string | null
    productNr!: number | null
    activeDate!: Date
}
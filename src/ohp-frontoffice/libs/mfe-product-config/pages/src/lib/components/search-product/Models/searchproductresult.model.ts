import { CommercialNameDto } from './commercial-name.model';
import { ConsumerProductType } from './consumerproduct-type.model';
import { DtoBase } from './dtobase.model';
import { EconomicalOwnerDto } from './economicalowner.model';
import { JudicialOwnerDto } from './judicialowner.model';
import { ProductFamily } from './product-family.model';
import { ProductName } from './product-name.model';
import { ServicingcustomerDto } from './servicing-customer.model';


export class SearchProductResult extends DtoBase{
    servicingCustomer !: ServicingcustomerDto
    economicalOwner !:EconomicalOwnerDto
    judicialOwner !: JudicialOwnerDto
    consumerProductTypeDto !:ConsumerProductType
    productFamily !: ProductFamily
    productName !: ProductName
    commercialNameDto!: CommercialNameDto
    productNr!: number
    startDate!: Date 
    endDate  !: Date 
    hasNoProductCopy!: boolean
    modifiedActiveDate !: string | null
    modifiedEndDate!: string| null
}
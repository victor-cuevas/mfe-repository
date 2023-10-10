import { CommercialNameDto } from './commercial-name.model';
import { DtoBase } from './dtobase.model';
import { ProductName } from './product-name.model';

export class ProductRefDto extends DtoBase {

    productNr !: number;
    commercialName !: CommercialNameDto
    productName !: ProductName
    productNrAndName !: string;
}
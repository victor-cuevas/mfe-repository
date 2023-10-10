import { CodeTable } from './code-table.model';
import { RefClassBaseDto } from './ref-classBaseDto.model';

export class ProductRef extends RefClassBaseDto{
      productNr !: number
      commercialName !: CodeTable
      productName !: CodeTable
      productNrAndName !: string
}
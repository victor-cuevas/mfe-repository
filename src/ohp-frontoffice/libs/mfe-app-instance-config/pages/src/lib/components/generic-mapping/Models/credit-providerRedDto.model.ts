import { codeTable } from './codeTable.model';

export class RefClassBaseDto {
    pKey!: number;
    rowVersion!: number;
}
  
export class CreditProviderRefDto extends RefClassBaseDto {
  name!: codeTable;
}


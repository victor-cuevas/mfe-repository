import { CodeTableDtoBase } from './code-table.model';
import { NameDto } from './name.model';

export class EconomicalOwnerDto{
    PKey !: number
    rowVersion !:number
    name !:NameDto  
}
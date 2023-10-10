import { CodeTableDtoBase } from './code-table.model';
import { NameDto } from './name.model';

export class JudicialOwnerDto{
    PKey !: number
    rowVersion !:number
    name !:NameDto  
}
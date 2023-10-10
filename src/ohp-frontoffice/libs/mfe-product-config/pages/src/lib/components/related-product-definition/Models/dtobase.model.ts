export enum Dtostate{
    Unknown=0,
    Created=1,
    Unmodified=2,
    Dirty=3,
    Deleted=4
}

export class DtoBase{
   pKey !: number
     RowVersion !:number
     state!:  Dtostate  
     canValidate !: boolean  
}
export enum Dtostate{
    Unknown=0,
    Created=1,
    Unmodified=2,
    Dirty=3,
    Deleted=4
}

export class TempVariables{

    public  modifiedHandleTime!: string | null;
    public isSelected !: boolean;
    public randomNumber!:number

}

export class Dtobase extends TempVariables{
    public pKey!: number 
    public  rowVersion !:number
    public  state !: Dtostate
    public  canValidate !: boolean
}
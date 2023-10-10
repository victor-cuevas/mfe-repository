import { BaseModel } from "../../action-receiver/Model/baseModel"

export class User extends BaseModel{
 name!:string |null
 displayName!:string
 userName!:string
 }

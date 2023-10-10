import { BaseModel } from "./baseModel";
export class ActionReceiver2User extends BaseModel {
  userName!: string;
  isOnlyForTaskCreation!: boolean;
  isReadOnly!: boolean;
  isEntered!: boolean;
}


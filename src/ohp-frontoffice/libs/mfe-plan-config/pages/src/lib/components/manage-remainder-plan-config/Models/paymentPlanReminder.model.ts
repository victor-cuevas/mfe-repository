import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";


export class paymentPlanReminder extends baseModel {
  numberOfDaysAfterPromise!: number;
  followUpEventName!: codeTable;
  lastPromiseEvent!: codeTable;
  isNotification!: boolean;
  numberOfDaysBeforePromise!: number;
  paymentMethod!: codeTable;
  isDelete!: boolean
}

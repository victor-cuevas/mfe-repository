import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { followUpEventForReminderStep } from "./followUpEventForReminderStep.model";
import { reminderAction } from "./reminderAction.model";
import { reminderCommunication } from "./reminderCommunication.model";
import { reminderDocument } from "./reminderDocument.model";
import { reminderRoleCreation } from "./reminderRoleCreation.model";

export class reminderScenarioStep extends baseModel {
  elapsedPeriodFromBeforeStep!: number;
  elapsedPeriodFromStatus!: number;
  notes!: string;
  numberOfDueDates!: number | null;
  name!: string;
  seqNr!: number;
  minDueAmount!: number | null;
  chargeIOA!: boolean | null;
  isReminder!: boolean;
  isFormalNotice!: boolean;
  stopCommission!: boolean | null;
  changeDossierStatus!: boolean;
  targetDossierStatus!: codeTable;
  communicationList: reminderCommunication[]=[];
  actionList: reminderAction[]=[];
  roleCreationList: reminderRoleCreation[]=[];
  elapsedPeriodType!: codeTable;
  elapsedPeriod!: number;
  reminderDocumentList: reminderDocument[]=[];
  followUpEventForReminderStepList: followUpEventForReminderStep[]=[];
}


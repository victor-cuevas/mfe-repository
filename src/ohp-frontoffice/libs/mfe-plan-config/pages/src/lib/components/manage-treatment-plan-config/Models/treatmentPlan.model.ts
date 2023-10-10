import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { paymentPlanReminder } from "./paymentPlanReminder.model";
import { paymentPlanSimulationConfiguration } from "./paymentPlanSimulationConfiguration.model";


export class treatmentPlan extends baseModel {
  name!: string;
  paymentPlanTerminateDaysAfterLastReminder!: number | null;
  paymentPlanSimulationConfigurationList: paymentPlanSimulationConfiguration[]=[];
  chargingPeriodOfDossierCosts!: boolean;
  isAllocatedManually!: boolean;
  isPaidOutManually!: boolean;
  isRemindedManually!: boolean;
  paymentPlanMaxWarnings!: number;
  paymentPlanGraceAmount!: number;
  paymentPlanNotificationDays!: number | null;
  chargingPeriodOfDossierCost!: codeTable;
  paymentPlanStartDateFromImportDays!: number;
  paymentPlanReminderList: paymentPlanReminder[]=[];
  paymentPlanNotificationList!: paymentPlanReminder[];
  paymentPlanReminder: paymentPlanReminder[] = [];
  paymentPlanNotification: paymentPlanReminder[] = [];
  paymentPlanMinimumInstallmentAmount!: number;
  enforceMinPromiseAmount!: boolean;
  terminatePaymentPlanEvent!: codeTable;
  finalizePaymentPlanEvent!: codeTable;
  noMachtingPaymentAmountEvent!: codeTable;
  remainingPromiseAmountEvent!: codeTable;
  activatePaymentPlan!: codeTable;
  deactivatePaymentPlan!: codeTable;
  promiseIsMetEvent!: codeTable;
  promiseIsMetAfterResetEvent!: codeTable;
  promiseIsResetEvent!: codeTable;
  automaticDossierClosureAtPaymentPlanFinalization!: boolean;
  dossierClosureAllowedWithPreventivePaymentPlan!: boolean;
  enforceMinDueAmount!: boolean;
}

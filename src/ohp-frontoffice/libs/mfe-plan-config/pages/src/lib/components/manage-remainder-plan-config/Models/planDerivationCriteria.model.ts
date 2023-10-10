import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { costPlanRef } from "./costPlanRef.model";
import { customerRef } from "./customerRef.model";
import { initiatorRef } from "./initiatorRef.model";
import { legalEntityRef } from "./legalEntityRef.model";
import { paymentAllocationPlanRef } from "./paymentAllocationPlanRef.model";
import { reminderPlanRef } from "./reminderPlanRef.model";
import { treatmentPlanRef } from "./treatmentPlanRef.model";


export class planDerivationCriteria extends baseModel {
  name!: string;
  debtorType!: codeTable;
  invoiceMaxAmount!: number ;
  invoiceMinAmount!: number ;
  invoiceMaxAvgAge!: number ;
  invoiceMinAvgAge!: number;
  invoiceMinNewestDate!: Date;
  invoiceMaxNewestDate!: Date ;
  invoiceMinOldestDate!: Date ;
  invoiceMaxOldestDate!: Date;
  priority!: number;
  validFrom!: Date ;
  validTo!: Date ;
  modifiedvalidFrom!: string | null;
  modifiedvalidTo!: string | null;
  costPlan!: costPlanRef;
  paymentAllocationPlan!: paymentAllocationPlanRef;
  treatmentPlan!: treatmentPlanRef;
  reminderPlan!: reminderPlanRef;
  legalEntity!: legalEntityRef;
  customer!: customerRef;
  initiator!: initiatorRef;
  dossierType!: codeTable;
  isCustomerindependent!: boolean;
  isLegalEntityIndependent!: boolean;
  isInitiatorIndependent!: boolean;
  
  proBonoDossier!: boolean | null;
}

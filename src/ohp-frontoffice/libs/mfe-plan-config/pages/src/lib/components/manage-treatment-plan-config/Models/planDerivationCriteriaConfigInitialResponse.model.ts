import { codeTable } from "./codeTable.model";
import { costConfigRef } from "./costConfigRef.model";
import { customerRef } from "./customerRef.model";
import { initiatorRef } from "./initiatorRef.model";
import { legalEntityRef } from "./legalEntityRef.model";
import { reminderScenarioRef } from "./reminderScenarioRef.model";

export class planDerivationCriteriaConfigInitialResponse {
    debtorTypeList: codeTable[]=[];
    customerList: customerRef[]=[];
    dossierStatusList: codeTable[]=[];
    costConfigRefList: costConfigRef[]=[];
    reminderScenarioRefList: reminderScenarioRef[]=[];
    periodicityList: codeTable[]=[];
    legalEntityList: legalEntityRef[]=[];
    followUpEventNameList: codeTable[]=[];
    initiatorList: initiatorRef[]=[];
    dossierTypeList: codeTable[]=[];
    paymentMethodList: codeTable[]=[];
}

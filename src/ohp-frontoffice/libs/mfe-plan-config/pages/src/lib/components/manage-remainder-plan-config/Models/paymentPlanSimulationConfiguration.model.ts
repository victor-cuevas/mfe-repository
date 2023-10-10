import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";


export class paymentPlanSimulationConfiguration extends baseModel {
  formulaName!: string;
  periodicity!: codeTable;
  periods!: number;
}

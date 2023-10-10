import { baseModel } from "./baseModel.model";

export class reservationCommission extends baseModel {
  startPeriod!: number|null;
  endPeriod!: number|null;
  rate!: number|null;
  isEntered!: boolean
}


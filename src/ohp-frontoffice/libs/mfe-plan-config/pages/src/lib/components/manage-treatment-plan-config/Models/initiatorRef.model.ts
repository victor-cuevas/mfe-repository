import { baseModel } from "./baseModel.model";

export class initiatorRef extends baseModel {
  name!: string;
  legalEntityFK!: number | null;
}

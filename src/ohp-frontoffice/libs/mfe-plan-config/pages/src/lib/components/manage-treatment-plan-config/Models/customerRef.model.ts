import { baseModel } from "./baseModel.model";

export class customerRef extends baseModel {
  name!: string;
  legalEntityFK!: number | null;
}

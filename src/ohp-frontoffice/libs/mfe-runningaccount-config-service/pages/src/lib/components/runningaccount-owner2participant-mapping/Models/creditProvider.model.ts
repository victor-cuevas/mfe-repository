import { baseModel } from "./baseModel.model";
import { codeTable } from "./codeTable.model";
import { servicingOrganzation } from "./servicingOrganization.model";

export class creditProvider extends baseModel {
  name!: codeTable
  servicingOrganization!: servicingOrganzation
}

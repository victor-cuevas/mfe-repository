import { planConfigSearchCriteria } from "./planConfigSearchCriteria.model";
import { planType } from "./planType.model";
import { requestBase } from "./requestBase.model";


export class planConfigInput extends requestBase {
  planConfigCriteria: planConfigSearchCriteria = new planConfigSearchCriteria;
  planType!: planType;
}

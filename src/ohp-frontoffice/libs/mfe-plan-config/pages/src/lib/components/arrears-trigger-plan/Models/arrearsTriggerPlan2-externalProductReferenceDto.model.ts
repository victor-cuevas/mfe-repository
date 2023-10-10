import { DtoBase } from './dtoBase.model';

export class ArrearsTriggerPlan2ExternalProductReferenceDto extends DtoBase {
  externalProductReference!: string | null;
  externalrowSelected !: boolean;
  externalrandomNumber !: number;
  isExternalDeleted !: boolean;
}

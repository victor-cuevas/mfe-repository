import { CreditProviderName } from "./creditproviderName.model";

export class ServicingCustomer {
  pKey!: number
  rowVersion!: number
  name: CreditProviderName = new CreditProviderName();
}

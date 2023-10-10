import { auditInfo } from "./auditInfo.model";
import { sessionToken } from "./sessionToken.model";

export class requestBase {
  sessionToken!: sessionToken;
  auditInfo!: auditInfo;
}

import { AuthorizationContextModel } from '../model/authorizationContextModel';

export interface ICredentials {
  email: string;
  password: string;
  username: string;
  getMe: AuthorizationContextModel;
}

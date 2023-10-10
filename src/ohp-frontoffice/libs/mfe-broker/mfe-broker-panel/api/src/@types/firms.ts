import { SubmissionRouteType } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

export interface Club {
  label: string;
  value: string;
  disabled: boolean;
}
export interface FESubmissionRoute {
  label: string;
  value: string;
  id: string;
  submissionRouteType: SubmissionRouteType;
  firmFcaReference: number;
  disabled: boolean;
}

export interface SubmissionRouteGroup {
  label: string;
  value: string;
  items: FESubmissionRoute[];
}

export interface SubmissionRouteAssociation {
  name: string;
  id: string;
  submissionRouteType?: SubmissionRouteType;
  firmFcaReference?: number;
}

export interface SubmissionRoutesObject {
  [key: string]: FESubmissionRoute;
}

export interface ClubsObject {
  [key: string]: Club;
}

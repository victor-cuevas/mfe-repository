export interface FESubmissionRoute {
  label: string;
  value: string;
  disabled: boolean;
}

export interface SubmissionRoutesObject {
  [key: string]: FESubmissionRoute;
}

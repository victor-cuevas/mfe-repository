type FormType = 'INPUT' | 'DROPDOWN' | 'RADIO' | 'CHECKBOX' | 'DATE';

export interface IInputDetails<T> {
  matcher: RegExp;
  value: T;
}

interface IFormData<T extends FormType, D> {
  type: T;
  details: IInputDetails<D>;
}

export type FormData =
  | IFormData<'INPUT', string | number>
  | IFormData<'DROPDOWN', string | RegExp>
  | IFormData<'RADIO', string | RegExp>
  | IFormData<'CHECKBOX', null>
  | IFormData<'DATE', string>;

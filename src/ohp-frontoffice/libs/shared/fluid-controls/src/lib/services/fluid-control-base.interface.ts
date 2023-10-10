import { ErrorDto } from '../models/models';

export interface FluidControlConfigBaseInterface {
  label: string;
  icon: string;
  iconPos: string;
  disabled: boolean;
  style: string;
  styleClass: string;
  name: string;
}

export class FluidControlConfigBase implements FluidControlConfigBaseInterface {
  label!: string;
  icon!: string;
  iconPos!: string;
  disabled!: boolean;
  style!: string;
  styleClass!: string;
  name!: string;
  required!: boolean;
  Errors!: Array<ErrorDto>;
  calendarLanguage: any;
  minValueValidation: any;
  maxValueValidation: any;
  externalError: any;
  get IsRequired(): boolean {
    return true;
  }
}

export interface FluidControlBaseInterface {
  IsEnabled(): boolean;
  HasRequiredValidation(): boolean;
}

export abstract class FluidControlBase implements FluidControlBaseInterface {
  abstract IsEnabled(): boolean;

  abstract HasRequiredValidation(): boolean;

  abstract OnClickEvent(event: any): void;
}

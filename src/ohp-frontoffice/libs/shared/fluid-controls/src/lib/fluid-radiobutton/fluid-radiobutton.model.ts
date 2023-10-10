import { FluidControlConfigBase } from '../services/fluid-control-base.interface';

export class FluidRadioButtonConfig extends FluidControlConfigBase {}

export enum ButtonType {
  TOGGLE = 'toggle',
  RADIO = 'radio',
}

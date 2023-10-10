export type InputType =
  | 'text'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'email'
  | 'file'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'tel'
  | 'text'
  | 'hidden';

export interface ILabelConfig {
  textClass?: string | string[];
  requiredClass?: string | string[];
}

export interface IHintConfig {
  text: string;
  showHint?: boolean;
  position?: 'right' | 'left' | 'top' | 'bottom';
  color?: 'info' | 'success' | 'danger' | 'warning' | 'neutral';
  tooltipClass?: string | string[];
  containerClass?: string | string[];
  icon?: string;
}

export interface IFieldConfig extends Record<InputType, unknown> {
  text: {
    class?: string | string[];
  };
}

export interface IErrorConfig {
  class?: string | string[];
}

export interface IFormItemConfig {
  label?: ILabelConfig | null;
  hint?: IHintConfig | null;
  field?: IFieldConfig | null;
  error?: IErrorConfig | null;
  options?: {
    [key: string]: unknown; // TODO: specify the necessary options when implemented
  } | null;
}

export const defaultConfig: Required<IFormItemConfig> = {
  label: null,
  hint: null,
  field: null,
  error: null,
  options: null,
};

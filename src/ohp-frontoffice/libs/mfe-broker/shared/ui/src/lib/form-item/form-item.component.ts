import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { InputType } from 'zlib';
import { defaultConfig, IFormItemConfig, IHintConfig } from './form-item.types';
import { pushClass, Required } from './helpers';

@Component({
  selector: 'cfo-form-item',
  templateUrl: './form-item.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FormItemComponent,
      multi: true,
    },
  ],
})
export class FormItemComponent implements OnInit {
  /* Inputs */
  @Input() @Required label!: string;
  @Input() config?: IFormItemConfig;
  @Input() errorMessages?: {
    [key: string]: string;
  };
  @Input() inputClass?: string;
  @Input() isDisabled?: boolean;
  @Input() isReadOnly?: boolean;
  @Input() placeholder?: string;
  @Input() required?: boolean;
  @Input() type: InputType = 'text';

  @ViewChild(FormControlDirective, { static: true }) formControlDirective!: FormControlDirective;
  @Input() control?: AbstractControl | FormControl | null;
  @Input() formControlName?: string;

  tooltip: Required<IHintConfig> | null = null;

  /* Getters */
  get configuration(): Required<IFormItemConfig> {
    return Object.assign({}, defaultConfig, this.config);
  }
  get disabled(): boolean {
    return !!this.isReadOnly || !!this.isDisabled;
  }
  get formControl(): FormControl {
    const control = this.control || this.controlContainer.control?.get(this.formControlName ?? '');
    if (!control) {
      throw new Error(
        'The <cfo-form-item> element must be rendered inside a FormGroup. Pass the FormControl or the formControlName as an attribute',
      );
    }
    return control as FormControl;
  }
  get isRequired(): boolean {
    return !!this.required || this.formControl.hasValidator(Validators.required);
  }
  get parsedLabel() {
    return this.capitalizeFirstLetter(this.label);
  }
  get parsedPlaceholder() {
    return this.capitalizeFirstLetter(this.placeholder ?? '');
  }
  get styles() {
    const styles = {
      label: {
        text: ['forminput__label--text'],
        required: ['forminput__label--required'],
      },
      hint: {
        wrapper: ['forminput__hint'],
        tooltip: [] as string[],
        icon: ['pi'],
      },
      field: {
        text: ['forminput__field--text'],
      },
      error: ['forminput__error'],
    };

    const { label, hint, field, error } = this.configuration;

    // input classes
    if (this.inputClass) styles.field.text.push(this.inputClass);
    if (field?.text.class) pushClass(styles.field.text, field.text.class);

    // error classes
    if (error?.class) pushClass(styles.error, error.class);

    // label classes
    if (label?.textClass) pushClass(styles.label.text, label.textClass);
    if (label?.requiredClass) pushClass(styles.label.required, label.requiredClass);

    // hint classes
    if (hint?.tooltipClass) pushClass(styles.hint.tooltip, hint.tooltipClass);
    if (hint?.containerClass) pushClass(styles.hint.wrapper, hint.containerClass);
    if (hint?.containerClass) pushClass(styles.hint.wrapper, hint.containerClass);
    if (this.tooltip?.color) {
      pushClass(styles.hint.tooltip, `tooltip-${this.tooltip?.color}`);
      pushClass(styles.hint.wrapper, `tooltip-${this.tooltip?.color}`);
    }
    if (this.tooltip?.position) pushClass(styles.hint.tooltip, `tooltip-${this.tooltip?.position}-arrow`);

    return styles;
  }

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    if (this.disabled) {
      this.formControl.disable();
    }

    if (this.required) {
      this.formControl.setValidators(Validators.required);
    }

    this.tooltip = this.useTooltip(this.configuration.hint)
      ? {
          text: this.configuration.hint?.text ?? '',
          showHint: true,
          position: this.configuration.hint?.position ?? 'right',
          color: this.configuration.hint?.color ?? 'info',
          tooltipClass: this.configuration.hint?.tooltipClass ?? '',
          containerClass: this.configuration.hint?.containerClass ?? '',
          icon: this.configuration.hint?.icon ?? 'pi-info-circle',
        }
      : null;
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    const firstLetter = text[0].toUpperCase();
    return `${firstLetter}${text.slice(1)}`;
  }

  useTooltip(tooltip: IHintConfig | null): tooltip is IHintConfig {
    if (!this.configuration.hint) {
      return false;
    }
    return this.configuration.hint.showHint ?? true;
  }

  /* ControlValueAccessor methods */
  registerOnTouched(fn: Parameters<ControlValueAccessor['registerOnTouched']>): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: Parameters<ControlValueAccessor['registerOnChange']>): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  writeValue(obj: Parameters<ControlValueAccessor['writeValue']>): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor?.setDisabledState && this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
  }
}

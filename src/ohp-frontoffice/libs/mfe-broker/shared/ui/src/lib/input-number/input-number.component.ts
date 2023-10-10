import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { RequiredInput } from '@close-front-office/mfe-broker/core';

import { CurrencyConfig, DecimalConfig, LeadingZerosConfig, Mode } from '../models/InputNumberModels';

@Component({
  selector: 'cfo-input-number',
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent {
  MODE: typeof Mode = Mode;

  @Input() @RequiredInput form!: FormGroup;
  @Input() @RequiredInput controlName!: string;
  @Input() className = 'journey-input--large';

  @Input()
  set config(config: DecimalConfig | CurrencyConfig | LeadingZerosConfig) {
    if (config && config?.mode && config.mode === Mode.ZEROS) {
      const length = (config as LeadingZerosConfig).length;

      this._config = {
        mode: Mode.ZEROS,
        min: 0,
        length: length !== undefined ? length : 1,
      };
    } else if (config && config?.mode && config.mode === Mode.CURRENCY) {
      const min = (config as CurrencyConfig).min;

      this._config = {
        mode: Mode.CURRENCY,
        currency: (config as CurrencyConfig).currency || 'GBP',
        min: min !== undefined ? min : null,
        maxFractionDigits: (config as CurrencyConfig).maxFractionDigits || 0,
      };
    } else {
      const min = (config as DecimalConfig).min;
      const max = (config as DecimalConfig).max;

      this._config = {
        mode: Mode.DECIMAL,
        useGrouping: (config as DecimalConfig).useGrouping ?? true,
        min: min !== undefined ? min : null,
        max: max !== undefined ? max : null,
        maxFractionDigits: (config as DecimalConfig).maxFractionDigits || 0,
        minFractionDigits: (config as DecimalConfig).minFractionDigits || 0,
      };
    }
    this.cd.markForCheck();
  }

  get config(): DecimalConfig | CurrencyConfig | LeadingZerosConfig {
    return this._config;
  }

  private _config: DecimalConfig | CurrencyConfig | LeadingZerosConfig = {
    mode: Mode.DECIMAL,
    useGrouping: true,
    min: null,
    max: null,
    length: null,
    maxFractionDigits: 0,
    minFractionDigits: 0,
  };

  onInput(event: { originalEvent: Event; value: string }) {
    this.form.get(this.controlName)?.setValue(event.value);
    this.form.get(this.controlName)?.markAsDirty();
  }

  onBlur() {
    if (this.config.mode === Mode.ZEROS && this.config.length && this.config.fillWithZeros) {
      const value = this.form.get(this.controlName)?.value;
      const zeros = '0'.repeat(this.config.length - value.length);
      this.form.get(this.controlName)?.setValue(zeros + value);
    }
    if (this.config.mode === Mode.ZEROS && this.config?.length) {
      const value = this.form.get(this.controlName)?.value?.substring(0, this.config?.length);
      this.form.get(this.controlName)?.setValue(value);
    }
  }

  changeInput(): void {
    const value = this.form.get(this.controlName)?.value?.toString() ?? '';
    this.form.get(this.controlName)?.setValue(value.replace(/\D/g, ''));
  }

  constructor(private cd: ChangeDetectorRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): boolean {
    const { key, ctrlKey } = event;
    const value = this.form.get(this.controlName)?.value?.toString() ?? '';

    // Allow keyboard special keys but not symbols
    if (key.length > 1) {
      // prevent submit on "Enter"
      if (key === 'Enter') return false;
      return true;
    }

    // Allow length under the limit
    if (this.config?.length && value.length < this.config.length) {
      // Allow only numeric values
      if (/\d/.test(key)) return true;
      // Allow copy paste of values
      else if (ctrlKey) {
        return true;
      }
    }

    return false;
  }
}

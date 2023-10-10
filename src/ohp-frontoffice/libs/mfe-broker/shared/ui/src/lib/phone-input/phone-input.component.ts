import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { CountryISO, NgxIntlTelInputComponent, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { skip } from 'rxjs/operators';

type Size = 'medium' | 'large' | 'full-width';

@Component({
  selector: 'cfo-phone-input[controlName]',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneInputComponent implements AfterViewInit, OnChanges {
  formControl?: AbstractControl;
  showErrors = false;
  @Input() size: Size = 'medium';
  @Input() controlName!: string;
  @Input() enableAutoCountrySelect = true;
  @Input() enablePlaceholder = false;
  @Input() maxLength = 14;
  @Input() numberFormat: PhoneNumberFormat = PhoneNumberFormat.National;
  @Input() preferredCountries: CountryISO[] = [CountryISO.UnitedKingdom];
  @Input() readonly = false;
  @Input() searchCountryField: Array<SearchCountryField> = [SearchCountryField.Iso2, SearchCountryField.Name, SearchCountryField.DialCode];
  @Input() searchCountryFlag = true;
  @Input() selectFirstCounty = false;
  @Input() selectedCountryIso: CountryISO = CountryISO.UnitedKingdom;
  @ViewChild('phoneInput') phoneInput!: NgxIntlTelInputComponent;

  constructor(public rootFormGroup: FormGroupDirective, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.formControl = this.rootFormGroup.control?.get(this.controlName) as AbstractControl;
    this.cd.detectChanges();
    // fixes initial country flag bug - described in readme
    this.formControl?.valueChanges.pipe(skip(1)).subscribe(() => {
      this.setCountryFlag();
      this.cd.detectChanges();
    });
    // fixes readme styling - described in readme
    this.readonly && this.toggleReadOnly(true);

    if (this.formControl?.disabled) {
      this.toggleReadOnly(true);
    } else {
      this.toggleReadOnly(false);
    }
    setTimeout(() => {
      this.showErrors = true;
      this.cd.detectChanges();
    }, 250);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.readonly?.currentValue && this.phoneInput) {
      this.readonly = changes.readonly?.currentValue;
      this.toggleReadOnly(true);
    }
    if (changes.readonly?.previousValue && !changes.readonly?.currentValue) {
      this.readonly = changes.readonly?.currentValue;
      this.toggleReadOnly(false);
    }
  }

  // fixes initial country flag bug - described in readme
  private setCountryFlag(): void {
    if (this.phoneInput?.selectedCountry) {
      this.selectedCountryIso = this.phoneInput.selectedCountry.iso2 as CountryISO;
      this.phoneInput.selectedCountryISO = this.phoneInput.selectedCountry.iso2 as CountryISO;
      const form = document.getElementById(`form-${this.controlName}`);
      const flagContainer = form?.getElementsByClassName('iti__flag');
      flagContainer && flagContainer[0].classList.replace(flagContainer[0].classList[1], `iti__${this.selectedCountryIso}`);
    }
  }

  // fixes readme styling - described in readme
  private toggleReadOnly(readOnly: boolean): void {
    if (readOnly) {
      this.formControl?.disable();
      this.formControl?.markAsPristine();
    } else {
      this.formControl?.enable();
      this.formControl?.markAsPristine();
    }
  }
}

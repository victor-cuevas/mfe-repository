import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidCheckboxComponent } from './fluid-checkbox/fluid-checkbox.component';
import { FluidControlsBaseService } from './services/fluid-control-base.service';
import { FormsModule } from '@angular/forms';
import { FluidControlBaseComponent } from './services/fluid-control-base.component';
import { FluidDialogComponent } from './fluid-dialog/fluid-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FluidTextBoxComponent } from './fluid-textbox/fluid-textbox.component';
import { FluidPatternValidatorDirective } from './validators/fluid-pattern.validators';
import { FluidCurrencyMaskDirective } from './directives/fluid-currency-mask.directive';
import { FluidInitialFormatterDirective } from './directives/fluid-Initial-format.directive';
import { MinMaxValueValidatorDirective } from './directives/fluid.value.directive';
import { FluidPercentageMaskDirective } from './directives/fluid-percentage-mask.directive';
import { FluidIBANFormatterDirective } from './directives/fluid-iban-format.directive';
import { FluidDigitsOnlyDirective } from './directives/fluid-digits-only-directive';
import { FluidPostalCodeFormatterDirective } from './directives/fluid-postalCode-format.directive';
import { FluidIBANValidatorDirective } from './directives/fluid-iban.validator';
import { FluidMaskConfigService } from './services/fluid-mask-config.service';
import { FluidFormatIBANPipe } from './Pipes/fluid-format-iban.pipe';
import { TableModule } from 'primeng/table';
import { FluidGridComponent } from './fluid-grid/fluid-grid.component';
import { FluidRadiobuttonComponent } from './fluid-radiobutton/fluid-radiobutton.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FluidTextAreaComponent } from './fluid-textArea/fluid-textArea.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FluidDatePickerComponent } from './fluid-datepicker/fluid-datepicker.component';
import { ButtonModule } from 'primeng/button';
import { FluidButtonComponent } from './fluid-button/fluid-button.component';
import { FluidDropdownComponent } from './fluid-dropdown/fluid-dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { FluidValidationErrorComponent } from './fluid-validation-error/fluid-validation-error.component';
import { FluidValidationsDirective } from './directives/fluid-validations.directive';
import {MessagesModule} from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { FluidAutoCompleteComponent } from './fluid-autocomplete/fluid-autocomplete.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FluidPickListComponent } from './fluid-picklist/fluid-pickList.component';
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { FluidCalendarDirective } from './directives/fluid-calendar.directive';
import { DecimalTransformPipe } from './Pipes/decimal-transform.pipe';



const modules = [
  CheckboxModule,
  CommonModule,
  FormsModule,
  DialogModule,
  InputTextModule,
  TableModule,
  RadioButtonModule,
  InputTextareaModule,
  CalendarModule,
  ButtonModule,
  DropdownModule,
  ProgressBarModule,
  MessagesModule,
  AccordionModule,
  AutoCompleteModule,
  PickListModule,
  TabViewModule,
  TriStateCheckboxModule

]
@NgModule({
  imports: [...modules],
  declarations: [
    FluidControlBaseComponent,
    FluidCheckboxComponent,
    FluidDialogComponent,
    FluidTextBoxComponent,
    FluidPatternValidatorDirective,
    FluidCurrencyMaskDirective,
    FluidInitialFormatterDirective,
    MinMaxValueValidatorDirective,
    FluidPercentageMaskDirective,
    FluidIBANFormatterDirective,
    FluidDigitsOnlyDirective,
    FluidPostalCodeFormatterDirective,
    FluidIBANValidatorDirective,
    FluidCalendarDirective,
    FluidFormatIBANPipe,
    FluidGridComponent,
    FluidRadiobuttonComponent,
    FluidTextAreaComponent,
    FluidDatePickerComponent,
    FluidButtonComponent,
    FluidDropdownComponent,
    FluidValidationErrorComponent,
    FluidValidationsDirective,
    FluidAutoCompleteComponent,
    FluidPickListComponent,
    DecimalTransformPipe

  ],
  exports: [
    ...modules,
    FluidCheckboxComponent,
    FluidDialogComponent,
    FluidTextBoxComponent,
    FluidPatternValidatorDirective,
    FluidCurrencyMaskDirective,
    FluidInitialFormatterDirective,
    MinMaxValueValidatorDirective,
    FluidPercentageMaskDirective,
    FluidIBANFormatterDirective,
    FluidDigitsOnlyDirective,
    FluidPostalCodeFormatterDirective,
    FluidIBANValidatorDirective,
    FluidCalendarDirective,
    FluidFormatIBANPipe,
    FluidGridComponent,
    FluidRadiobuttonComponent,
    FluidTextAreaComponent,
    FluidDatePickerComponent,
    FluidButtonComponent,
    FluidDropdownComponent,
    FluidValidationErrorComponent,
    FluidValidationsDirective,
    FluidAutoCompleteComponent,
    FluidPickListComponent,
    DecimalTransformPipe
 ],
  providers: [FluidControlsBaseService,FluidMaskConfigService,DecimalPipe,MessageService],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedFluidControlsModule {}

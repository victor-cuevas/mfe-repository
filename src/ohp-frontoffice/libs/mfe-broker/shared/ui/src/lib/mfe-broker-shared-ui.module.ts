import { CommonModule, TitleCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { AccountComponent } from './profile/account/account.component';
import { AccountInfoComponent } from './forms/account-info/account-info.component';
import { AddressSearchComponent } from './address-search/address-search.component';
import { AlertComponent } from './alert/alert.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { AssistantsComponent } from './profile/assistants/assistants.component';
import { AssistantsTableComponent } from './profile/assistants-table/assistants-table.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CaseTransferComponent } from './case-transfer/case-transfer.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CheckPermissionsDirective } from './directives/check-permissions.directive';
import { CircularPercentageComponent } from './circular-percentage/circular-percentage.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { DisableControlDirective } from './directives/disabled-control.directive';
import { DividerModule } from 'primeng/divider';
import { DocumentStatusComponent } from './document-status/document-status.component';
import { DropdownItemComponent } from './dropdown-item/dropdown-item.component';
import { DropDownMenuComponent } from './drop-down-menu/drop-down-menu.component';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ErrorCardComponent } from './error-card/error-card.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FormItemComponent } from './form-item/form-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalLayoutComponent } from './global-layout/global-layout.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberComponent } from './input-number/input-number.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { LinkedAdvisorsComponent } from './profile/linked-advisors/linked-advisors.component';
import { LinkedAdvisorsTableComponent } from './profile/linked-advisors-table/linked-advisors-table.component';
import { LoginDetailsComponent } from './forms/login-details/login-details.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MyLenderMenuComponent } from './lender/my-lender-menu/my-lender-menu.component';
import { MyProfileMenuComponent } from './profile/my-profile-menu/my-profile-menu.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { OnlyCharactersDirective } from './directives/only-characters.directive';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PersonalDetailsComponent } from './forms/personal-details/personal-details.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { PipesModule } from '@close-front-office/mfe-broker/core';
import { ProfileComponent } from './profile/profile/profile.component';
import { ProfileMenuComponent } from './profile/profile-menu/profile-menu.component';
import { ProfilePageComponent } from './profile/profile-page.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RepeaterComponent, RepeaterItemComponent } from './repeater/repeater.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextComponent } from './text/text.component';
import { ToastComponent } from './toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TradingAddressComponent } from './forms/trading-address/trading-address.component';
import { TradingAddressesComponent } from './profile/trading-addresses/trading-addresses.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoleComponent } from './forms/user-role/user-role.component';
import { ValidationErrorsComponent } from './validation-errors/validation-errors.component';

const modules = [
  AccordionModule,
  AutoCompleteModule,
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  CommonModule,
  DialogModule,
  DropdownModule,
  DynamicDialogModule,
  FileUploadModule,
  InputMaskModule,
  InputNumberModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  MenubarModule,
  MenuModule,
  MessageModule,
  MessagesModule,
  NgxIntlTelInputModule,
  OverlayPanelModule,
  PasswordModule,
  RadioButtonModule,
  SelectButtonModule,
  StepsModule,
  TableModule,
  TabViewModule,
  TagModule,
  ToastModule,
  TooltipModule,
  TranslateModule,
];

@NgModule({
  imports: [...modules, ReactiveFormsModule, PipesModule, PanelMenuModule, FormsModule, DividerModule],
  declarations: [
    AccountComponent,
    AccountInfoComponent,
    AddressSearchComponent,
    AddressSearchComponent,
    AlertComponent,
    ApplicantsComponent,
    AssistantsComponent,
    AssistantsTableComponent,
    BreadcrumbComponent,
    CaseTransferComponent,
    CheckPermissionsDirective,
    CircularPercentageComponent,
    DialogComponent,
    DisableControlDirective,
    DocumentStatusComponent,
    DropdownItemComponent,
    DropDownMenuComponent,
    ErrorCardComponent,
    ErrorCardComponent,
    FileUploadComponent,
    FilterMenuComponent,
    FormItemComponent,
    GlobalLayoutComponent,
    InputNumberComponent,
    LinkedAdvisorsComponent,
    LinkedAdvisorsTableComponent,
    LoginDetailsComponent,
    MyLenderMenuComponent,
    MyProfileMenuComponent,
    OnlyCharactersDirective,
    PersonalDetailsComponent,
    PhoneInputComponent,
    ProfileComponent,
    ProfileMenuComponent,
    ProfilePageComponent,
    RadioButtonComponent,
    RepeaterComponent,
    RepeaterItemComponent,
    TextComponent,
    ToastComponent,
    TradingAddressComponent,
    TradingAddressesComponent,
    UserRoleComponent,
    ValidationErrorsComponent,
  ],
  exports: [
    ...modules,
    AccountComponent,
    AccountInfoComponent,
    AddressSearchComponent,
    AlertComponent,
    ApplicantsComponent,
    AssistantsComponent,
    AssistantsTableComponent,
    BreadcrumbComponent,
    CaseTransferComponent,
    CheckPermissionsDirective,
    CircularPercentageComponent,
    DialogComponent,
    DisableControlDirective,
    DocumentStatusComponent,
    DropdownItemComponent,
    DropDownMenuComponent,
    ErrorCardComponent,
    FileUploadComponent,
    FilterMenuComponent,
    FormItemComponent,
    GlobalLayoutComponent,
    InputNumberComponent,
    LinkedAdvisorsComponent,
    LinkedAdvisorsTableComponent,
    LoginDetailsComponent,
    MyLenderMenuComponent,
    MyProfileMenuComponent,
    OnlyCharactersDirective,
    PersonalDetailsComponent,
    PhoneInputComponent,
    ProfileComponent,
    ProfileMenuComponent,
    ProfilePageComponent,
    RadioButtonComponent,
    RepeaterComponent,
    RepeaterItemComponent,
    TextComponent,
    ToastComponent,
    TradingAddressComponent,
    TradingAddressesComponent,
    UserRoleComponent,
    ValidationErrorsComponent,
  ],
  providers: [TitleCasePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MfeBrokerSharedUiModule {}

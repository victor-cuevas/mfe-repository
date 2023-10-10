import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogData } from '../../models/DialogData';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { AccountInfoComponent } from '../../forms/account-info/account-info.component';
import { LoginDetailsComponent } from '../../forms/login-details/login-details.component';

@Component({
  selector: 'cfo-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  @ViewChild(AccountInfoComponent) accountInfo!: AccountInfoComponent;
  @ViewChild(LoginDetailsComponent) loginDetails!: LoginDetailsComponent;

  @Input() title!: string;
  @Input() intermediaryName?: string;
  @Input() readOnly = false;
  @Output() deactivateAccountEvent = new EventEmitter<void>();

  showDeactivateAccount = false;
  deactivateAccountDataPopup: DialogData | undefined;

  accountForm = this.fb.group({
    emailNotification: null,
  });

  constructor(private translate: TranslateService, private fb: FormBuilder) {}

  ngOnInit() {
    if (this.readOnly) this.accountForm.disable();
  }

  openDeactivateAccountModal() {
    this.showDeactivateAccount = true;
    this.deactivateAccountDataPopup = {
      type: 'danger',
      icon: 'pi pi-user-minus',
      header: this.translate.instant('dialog.deactivateAccount'),
      content: this.translate.instant('dialog.deactivateAccountMsg'),
    };
  }

  cancelDeactivateAccount() {
    this.showDeactivateAccount = false;
  }

  confirmDeactivateAccount() {
    this.deactivateAccountEvent.emit();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cfo-account-info',
  templateUrl: './account-info.component.html',
})
export class AccountInfoComponent implements OnInit {
  @Input() isOpen = false;
  @Input() readOnly = false;
  @Input() addNewLender!: boolean;

  accountInfoForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    mobile: [undefined, Validators.required],
    tel: [undefined],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.readOnly) this.accountInfoForm.disable();
    if (this.addNewLender) this.accountInfoForm.controls.tel.setValidators(Validators.required);
  }
}

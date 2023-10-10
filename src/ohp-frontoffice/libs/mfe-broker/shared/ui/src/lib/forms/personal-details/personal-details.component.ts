import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userTitleOptions } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'cfo-personal-details',
  templateUrl: './personal-details.component.html',
})
export class PersonalDetailsComponent implements OnInit {
  @Input() hasFCADataFeature = false;
  @Input() open = false;
  @Input() readOnly = false;
  @Input() addNewLender!: boolean;
  currentYear = new Date().getFullYear() - 18;
  defaultDate = new Date(this.currentYear, new Date().getMonth());

  // TODO: change to codetables once we have the call in PANEL
  titles = userTitleOptions;

  personalDetailsForm: FormGroup = this.fb.group({
    title: [''],
    firstName: ['', Validators.required],
    surName: ['', Validators.required],
    dob: [undefined, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.addNewLender) {
      this.personalDetailsForm.controls.title.setValidators(Validators.required);
    }

    if (this.readOnly) this.personalDetailsForm.disable();
  }
}

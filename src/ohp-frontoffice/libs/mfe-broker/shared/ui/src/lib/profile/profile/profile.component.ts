import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonalDetailsComponent } from '../../forms/personal-details/personal-details.component';
import { IntermediaryRole } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  selector: 'cfo-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  @ViewChild(PersonalDetailsComponent) personalDetails!: PersonalDetailsComponent;

  @Input() title!: string;
  @Input() intermediaryData!: any;
  @Input() firmDetails!: any;
  @Input() isLender = false;

  intermediaryRole: typeof IntermediaryRole = IntermediaryRole;

  editProfileForm = this.fb.group({
    userRole: ['', Validators.required],
    firmName: { value: '', disabled: true },
    advisorUniqueId: { value: null, disabled: true },
  });

  constructor(private fb: FormBuilder) {}
}

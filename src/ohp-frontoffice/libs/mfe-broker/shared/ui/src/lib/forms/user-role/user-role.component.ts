import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRole } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  selector: 'cfo-user-role',
  templateUrl: './user-role.component.html',
})
export class UserRoleComponent implements OnInit {
  @Input() hasFCADataFeature = false;
  @Input() isAdvisorUniqueIDSelected = false;
  @Input() hasFCADetails = false;
  @Input() readOnly = false;
  @Input() isNewLender!: boolean;

  @Output() populateDataFromAdvisorUniqueID = new EventEmitter<string>();
  @Output() unlockDefaultStructureEvent = new EventEmitter<boolean>();

  userRoles = [
    { icon: 'pi pi-user', type: 'Assistant', value: 'Assistant' },
    { icon: 'pi pi-user', type: 'Advisor', value: 'Advisor' },
    { icon: 'pi pi-user', type: 'Supervisor', value: 'Supervisor' },
    {
      icon: 'pi pi-user',
      type: 'Assistant and Supervisor',
      value: 'SupervisorAndAssistant',
    },
    {
      icon: 'pi pi-user',
      type: 'Advisor and Supervisor',
      value: 'SupervisorAndAdvisor',
    },
    { icon: 'pi pi-user', type: 'Viewer', value: 'Viewer' },
  ];

  userRoleForm: FormGroup = this.fb.group({
    firmName: [{ value: null, disabled: true }],
    userRole: ['ASSISTANT', Validators.required],
    advisorUniqueId: [{ value: null, disabled: true }],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.isNewLender) {
      this.userRoles = [
        { icon: 'pi pi-user', type: 'Viewer', value: UserRole.LenderAdvisorViewer },
        { icon: 'pi pi-user', type: 'Broker Support', value: UserRole.LenderAdvisorSupport },
        { icon: 'pi pi-user', type: 'Lender Admin', value: UserRole.LenderAdvisorAdmin },
      ];
    }

    this.userRoleForm.get('userRole')?.valueChanges.subscribe(val => {
      if (val === 'Advisor' || val === 'SupervisorAndAdvisor') {
        this.userRoleForm.get('advisorUniqueId')?.setValidators(Validators.required);
      } else {
        this.userRoleForm.get('advisorUniqueId')?.setValidators(null);
        this.userRoleForm.get('advisorUniqueId')?.setValue(null);
      }
    });
    if (this.readOnly) this.userRoleForm.disable();
  }

  populateData(advisorUniqueID: string) {
    this.populateDataFromAdvisorUniqueID.emit(advisorUniqueID);
  }

  unlockDefaultStructure() {
    this.unlockDefaultStructureEvent.emit(true);
  }
}

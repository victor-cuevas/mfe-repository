import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckPermissionsService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AdvisorIntermediariesResponse,
  AdvisorIntermediary,
  CaseDataResponse,
  CaseService,
  IntermediaryService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  templateUrl: './case-transfer.component.html',
})
export class CaseTransferComponent implements OnInit {
  transferForm: FormGroup = this.fb.group({ intermediary: [null, Validators.required] });
  intermediaries: AdvisorIntermediary[] | null = null;
  results: AdvisorIntermediary[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private caseService: CaseService,
    private permissionsService: CheckPermissionsService,
  ) {}

  ngOnInit() {
    this.config.data.firmId &&
      this.intermediaryService
        .intermediaryGetAdvisorIntermediaries(this.config.data.firmId)
        .subscribe((data: AdvisorIntermediariesResponse) => {
          this.intermediaries = data.advisorIntermediaries as AdvisorIntermediary[];
        });
  }

  doTransfer() {
    const transferCaseOwnershipRequest = { newOwnerId: this.transferForm.value?.intermediary?.intermediaryId };
    const obs: Observable<CaseDataResponse>[] = this.config.data.cases.map(
      (c: CaseDataResponse) => c.caseId && this.caseService.casePutTransferOwnership(c.caseId, transferCaseOwnershipRequest),
    );

    forkJoin(obs).subscribe(() => {
      this.ref.close({ intermediary: this.transferForm.value.intermediary, shouldRedirect: this.checkRedirect() });
    });
  }

  search(event: any) {
    this.results =
      this.intermediaries?.filter(el => {
        return (
          (el.email?.toLowerCase().includes(event.query.toLowerCase()) || el.fullName?.toLowerCase().includes(event.query.toLowerCase())) &&
          (this.config.data.cases.length > 1 || this.config.data.cases[0].assigneeId !== el.intermediaryId)
        );
      }) || [];
  }

  private checkRedirect(): boolean {
    return !this.permissionsService.isAllowedForAssignee(this.transferForm.value.intermediary.intermediaryId, 'View');
  }
}

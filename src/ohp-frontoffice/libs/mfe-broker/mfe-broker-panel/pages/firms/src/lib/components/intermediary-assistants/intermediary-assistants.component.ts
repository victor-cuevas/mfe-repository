import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';

import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { IntermediaryDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  IntermediaryResponse,
  IntermediaryRole,
  IntermediaryService,
  IntermediarySummary,
  SortOrder,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  templateUrl: './intermediary-assistants.component.html',
})
export class IntermediaryAssistantsComponent implements OnInit {
  firmId = this.route.parent?.snapshot.data.fetchedData?.firmDetails?.firmId || '';
  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  intermediaryId = this.intermediaryDetails?.intermediaryId || '';
  searchResults$ = new BehaviorSubject<IntermediarySummary[]>([]);
  assistant$: Observable<IntermediarySummary | undefined> = of(undefined);
  assistants$ = new BehaviorSubject<IntermediarySummary[]>(this.intermediaryDetails?.subordinateIntermediaries || []);
  isReadOnlyMode = this.route.snapshot.data.readOnlyMode;
  assistantsIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private intermediaryService: IntermediaryService,
    private intermediaryDetailsService: IntermediaryDetailsService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.assistants$.subscribe(assistants => {
      this.assistantsIds = assistants.map((assistant: IntermediarySummary) => assistant.brokerId || '');
    });
  }

  onAdd(assistant: IntermediarySummary) {
    if (!(assistant.brokerId && assistant?.role && assistant?.permission)) return;
    this.spinnerService.setIsLoading(true);
    this.intermediaryService
      .intermediaryPutIntermediaryAssignPermission(assistant?.brokerId, {
        intermediaryRole: assistant.role as IntermediaryRole, //TODO remove when bff change the PanelIntermediaryRole
        permissionType: assistant.permission,
        parentIntermediaryId: this.intermediaryDetails.intermediaryId ?? '',
      })
      .subscribe(() => {
        this.intermediaryDetails.intermediaryId &&
          this.intermediaryService
            .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId)
            .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
            .subscribe(() => {
              this.intermediaryService
                .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId || '')
                .subscribe((response: IntermediaryResponse) => {
                  this.intermediaryDetails = response;
                  this.assistants$.next(response.subordinateIntermediaries || []);
                });
              this.toastService.showMessage({ summary: `The assistant has been added successfully` });
            });
      });
  }

  onUnlink(brokerId: string) {
    this.intermediaryService
      .intermediaryPutIntermediaryRevokePermission(brokerId, { parentIntermediaryId: this.intermediaryDetails.intermediaryId ?? '' })
      .subscribe(() => {
        this.intermediaryDetails.intermediaryId &&
          this.intermediaryService
            .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId)
            .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
            .subscribe(() => {
              this.intermediaryService
                .intermediaryGetIntermediaryById(this.intermediaryDetails.intermediaryId || '')
                .subscribe((response: IntermediaryResponse) => {
                  this.intermediaryDetails = response;
                  this.assistants$.next(response.subordinateIntermediaries || []);
                });
              this.toastService.showMessage({ summary: `The assistant has been removed successfully` });
            });
      });
  }

  onSearch(event: any) {
    this.intermediaryService
      .intermediarySearchIntermediaries(this.firmId, {
        partialName: event.query,
        nameSortOrder: SortOrder.Ascending,
      })
      .pipe(
        map(resp => {
          if (resp.intermediaries) {
            return resp.intermediaries.filter(item => item.brokerId !== this.intermediaryDetails.intermediaryId);
          }
          return [];
        }),
      )
      .subscribe(val => this.searchResults$.next(val));
  }

  onChangeCollaboration(event: any) {
    this.assistant$ = this.assistants$.pipe(
      map(assistants => assistants.find((el: IntermediarySummary) => el.brokerId === event.brokerId)),
    );

    this.assistant$.pipe(take(1)).subscribe((assistant: IntermediarySummary | undefined) => {
      assistant && this.onAdd({ ...assistant, permission: event.collaboration });
    });
  }
}

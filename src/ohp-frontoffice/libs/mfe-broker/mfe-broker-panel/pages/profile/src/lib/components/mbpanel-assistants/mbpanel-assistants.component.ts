import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { finalize, map, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { getPanelUser, loadPanelUserFailure, loadPanelUserSuccess } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  IntermediaryRole,
  IntermediarySearchResponse,
  IntermediarySummary,
  PortalUserService,
  SortOrder,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  templateUrl: './mbpanel-assistants.component.html',
})
export class MbpanelAssistantsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  firmId = this.route.parent?.snapshot.data.intermediary?.firmDetails?.firmId || '';
  intermediaryId = this.route.parent?.snapshot.data.intermediary.reduxData.intermediaryId || '';
  searchResults$ = new BehaviorSubject<IntermediarySummary[]>([]);
  assistant$: Observable<IntermediarySummary | undefined> = of(undefined);
  assistants$ = this.store.select(getPanelUser).pipe(
    takeUntil(this.onDestroy$),
    map(panelUser => JSON.parse(JSON.stringify(panelUser?.subordinateIntermediaries || []))),
  );
  assistantsIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private portalUserService: PortalUserService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.assistants$.subscribe(assistants => {
      this.assistantsIds = assistants.map((assistant: IntermediarySummary) => assistant.brokerId || '');
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onAdd(assistant: IntermediarySummary) {
    if (!(assistant.brokerId && assistant?.role && assistant?.permission)) return;
    this.spinnerService.setIsLoading(true);
    this.portalUserService
      .portalUserPutIntermediaryAssignPermission(assistant?.brokerId, {
        intermediaryRole: assistant.role as IntermediaryRole,
        permissionType: assistant.permission,
      })
      .subscribe(() => {
        this.portalUserService
          .portalUserGetMe()
          .pipe(
            take(1),
            finalize(() => this.spinnerService.setIsLoading(false)),
          )
          .subscribe(
            response => {
              return this.store.dispatch(loadPanelUserSuccess({ entity: response }));
            },
            (error: any) => {
              return this.store.dispatch(loadPanelUserFailure({ error }));
            },
          );
      });
  }

  onUnlink(brokerId: string) {
    this.portalUserService.portalUserPutIntermediaryRevokePermission(brokerId).subscribe(() => {
      this.portalUserService
        .portalUserGetMe()
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe(
          response => {
            return this.store.dispatch(loadPanelUserSuccess({ entity: response }));
          },
          (error: any) => {
            return this.store.dispatch(loadPanelUserFailure({ error }));
          },
        );
    });
  }

  onSearch(event: any) {
    this.portalUserService
      .portalUserSearchIntermediaries({ partialName: event.query, nameSortOrder: SortOrder.Ascending })
      .pipe(
        map((resp: IntermediarySearchResponse) => {
          if (resp.intermediaries) {
            return resp.intermediaries;
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

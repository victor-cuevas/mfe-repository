import { Directive, HostListener } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { map, concatMap, take } from 'rxjs/operators';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Directive()
export abstract class GenericStepForm {
  abstract readonly STEP_NAME: string;

  abstract hasUnsavedChanges(): boolean;

  abstract saveData(): Observable<any>;

  abstract mapToDTO(): any;

  abstract checkActiveJourney(): void;

  //abstract getStepStatus(): StepStatusEnum; //TODO implement this method everywhere

  public shouldSaveOnRedux = false;
  public haveUnsavedChanges = false;

  protected debounceSub$ = new Subject<boolean>();
  protected onDestroy$ = new Subject();
  private _isSaving = new BehaviorSubject<boolean>(false);
  public isSaving$ = this._isSaving.asObservable();

  set isSaving(value: boolean) {
    this._isSaving.next(value);
  }

  get isSaving() {
    return this._isSaving.getValue();
  }

  protected checkSubscription() {
    if (this.debounceSub$ && !this.debounceSub$.isStopped) {
      this.debounceSub$.next(true);
      this.debounceSub$.unsubscribe();
    }
  }

  protected onDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  protected showConfirmationDialog(ref: DynamicDialogRef): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      ref.onClose.subscribe((result: boolean) => {
        if (result) {
          this.shouldSave().subscribe(() => subscriber.next(true));
          subscriber.next(result);
        } else {
          subscriber.error(result);
        }
      });
    });
  }

  protected shouldSave(): Observable<boolean> {
    this.checkSubscription();

    if (this.hasUnsavedChanges()) {
      if (this._isSaving) {
        return this.isSaving$.pipe(
          concatMap(() =>
            this.saveData().pipe(
              map(response => {
                if (this.shouldSaveOnRedux) {
                  this.saveOnRedux(response);
                }
                return true;
              }),
            ),
          ),
        );
      }
      return this.saveData().pipe(
        map(response => {
          if (this.shouldSaveOnRedux) {
            this.saveOnRedux(response);
          }
          return true;
        }),
      );
    } else {
      return of(true);
    }
  }

  protected saveOnRedux(item: any): void {}

  public canDeactivate(): Observable<boolean> {
    return this.shouldSave();
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadNotification($event: any) {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = 'You have unsaved changes! If you leave, your changes will be lost.';
    }
  }
}

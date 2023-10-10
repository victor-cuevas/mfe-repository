import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FmaContactService {
  private _applicantFullName = new BehaviorSubject<string>('');

  set applicantFullName(value: string) {
    this._applicantFullName.next(value);
  }

  get applicantFullName() {
    return this._applicantFullName.getValue();
  }
}

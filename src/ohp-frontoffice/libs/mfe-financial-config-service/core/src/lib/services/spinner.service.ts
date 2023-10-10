import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoading = false;

  constructor() {
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }
}

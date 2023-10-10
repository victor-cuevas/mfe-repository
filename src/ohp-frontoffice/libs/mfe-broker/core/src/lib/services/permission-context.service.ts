import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionContextService {
  private assigneeContext = '';
  private currentIntermediaryContext = '';
  private currentFirmContext = '';

  setAssigneeContext(assignee: string) {
    this.assigneeContext = assignee;
  }

  getAssigneeContext(): string {
    return this.assigneeContext;
  }

  setCurrentIntermediaryContext(intermediary: string) {
    this.currentIntermediaryContext = intermediary;
  }

  getCurrentIntermediaryContext(): string {
    return this.currentIntermediaryContext;
  }

  setCurrentFirmContext(firm: string) {
    this.currentFirmContext = firm;
  }

  getCurrentFirmContext(): string {
    return this.currentFirmContext;
  }
}

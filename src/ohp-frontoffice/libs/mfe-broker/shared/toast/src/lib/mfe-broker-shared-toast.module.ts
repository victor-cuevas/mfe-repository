import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './shared-toast.service';

@NgModule({
  imports: [CommonModule],
  providers: [ToastService],
})
export class MfeBrokerSharedToastModule {}

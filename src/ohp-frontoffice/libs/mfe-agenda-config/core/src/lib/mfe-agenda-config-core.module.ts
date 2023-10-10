import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterceptorInheritanceModule } from '@close-front-office/shared/interceptor-inheritance';

@NgModule({
  imports: [CommonModule, InterceptorInheritanceModule]
})
export class MfeAgendaConfigCoreModule {}

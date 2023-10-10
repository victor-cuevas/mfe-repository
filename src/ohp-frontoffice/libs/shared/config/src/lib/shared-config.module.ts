import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigContextService } from './services/config-context.service';

@NgModule({
  imports: [CommonModule],
  providers: [ConfigContextService]
})
export class SharedConfigModule {}

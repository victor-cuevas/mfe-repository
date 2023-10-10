import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CaseService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { RouterTestingModule } from '@angular/router/testing';
import { PERMISSIONS, PipesModule } from '@close-front-office/mfe-broker/core';
import { MessageService } from 'primeng/api';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { provideMockStore } from '@ngrx/store/testing';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { CheckPermissionsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'translationsPath', '.json');
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientTestingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    PipesModule,
    InputTextModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    MessageService,
    CaseService,
    FormGroupDirective,
    provideMockStore({}),
    DatePipe,
    DialogService,
    TitleCasePipe,
    { provide: PERMISSIONS, useClass: CheckPermissionsService }
  ],
  exports: [TranslateModule, RouterTestingModule, PipesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedTestingHelperModule {}

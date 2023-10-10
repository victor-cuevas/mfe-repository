import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AddressService } from './api/address.service';
import { CalculationService } from './api/calculation.service';
import { CaseService } from './api/case.service';
import { ConfigurationService } from './api/configuration.service';
import { DIPService } from './api/dIP.service';
import { DocumentService } from './api/document.service';
import { FMAService } from './api/fMA.service';
import { FirmService } from './api/firm.service';
import { IllustrationService } from './api/illustration.service';
import { IntermediaryService } from './api/intermediary.service';
import { PaymentService } from './api/payment.service';
import { PortalUserService } from './api/portalUser.service';
import { ProductService } from './api/product.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}

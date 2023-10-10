import { TestBed } from '@angular/core/testing';
import { MortgageTermService } from './mortgage-term.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'translationsPath', '.json');
}

describe('MortgageTermService', () => {
  let service: MortgageTermService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        HttpClientTestingModule,
      ],
      providers: [MessageService, Store],
    });
    service = TestBed.inject(MortgageTermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMortgageTermTotalMonths', () => {
    it('should return the correct number of months when given year and month input', () => {
      expect(service.getMortgageTermTotalMonths(1, 6)).toEqual(18);
      expect(service.getMortgageTermTotalMonths(3, 2)).toEqual(38);
      expect(service.getMortgageTermTotalMonths(0, 1)).toEqual(1);
    });
  });

  describe('getMortgageTermMonthsAndYears', () => {
    it('should return the correct number of years and months when given month input', () => {
      expect(service.getMortgageTermMonthsAndYears(12)).toEqual({ years: 1, months: 0 });
      expect(service.getMortgageTermMonthsAndYears(15)).toEqual({ years: 1, months: 3 });
      expect(service.getMortgageTermMonthsAndYears(37)).toEqual({ years: 3, months: 1 });
    });
  });
});

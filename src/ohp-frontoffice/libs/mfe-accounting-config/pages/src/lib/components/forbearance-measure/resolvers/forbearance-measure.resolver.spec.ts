import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ForbearanceMeasureResolver } from './forbearance-measure.resolver';

describe('ForbearanceMeasureResolver', () => {
  let resolver: ForbearanceMeasureResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule]});
    resolver = TestBed.inject(ForbearanceMeasureResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

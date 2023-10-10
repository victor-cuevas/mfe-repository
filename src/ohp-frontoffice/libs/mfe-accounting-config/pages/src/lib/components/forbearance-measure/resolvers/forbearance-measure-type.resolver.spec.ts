import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ForbearanceMeasureTypeResolver } from './forbearance-measure-type.resolver';

describe('ForbearanceMeasureTypeResolver', () => {
  let resolver: ForbearanceMeasureTypeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule]});
    resolver = TestBed.inject(ForbearanceMeasureTypeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

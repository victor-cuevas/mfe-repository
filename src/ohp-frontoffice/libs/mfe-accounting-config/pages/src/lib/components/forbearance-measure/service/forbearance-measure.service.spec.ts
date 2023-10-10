import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ForbearanceMeasureService } from './forbearance-measure.service';

describe('ForbearanceMeasureService', () => {
  let service: ForbearanceMeasureService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule]});
    service = TestBed.inject(ForbearanceMeasureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

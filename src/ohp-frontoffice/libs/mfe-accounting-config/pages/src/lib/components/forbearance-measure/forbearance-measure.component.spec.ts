import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbearanceMeasureComponent } from './forbearance-measure.component';
import { SharedFluidControlsModule } from '@close-front-office/shared/fluid-controls';
import { AccountingTestingHelperModule } from '@close-front-office/mfe-accounting-config/shared';

describe('ForbearanceMeasureComponent', () => {
  let component: ForbearanceMeasureComponent;
  let fixture: ComponentFixture<ForbearanceMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForbearanceMeasureComponent],
      imports: [SharedFluidControlsModule, AccountingTestingHelperModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbearanceMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

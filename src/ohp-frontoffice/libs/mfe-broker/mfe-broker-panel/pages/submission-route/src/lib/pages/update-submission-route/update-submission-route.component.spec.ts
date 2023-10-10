import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';

import { UpdateSubmissionRouteComponent } from './update-submission-route.component';

describe('UpdateSubmissionRouteComponent', () => {
  let component: UpdateSubmissionRouteComponent;
  let fixture: ComponentFixture<UpdateSubmissionRouteComponent>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestingHelperModule, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [UpdateSubmissionRouteComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubmissionRouteComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });
  describe('component', () => {
    describe('component setup', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });
    describe('edit page', () => {
      beforeEach(() => {
        component.id = '1';
        fixture.detectChanges();
      });
      it('should render edit template', () => {
        const submissionTypeLabel = fixture.debugElement.nativeElement.querySelectorAll('div.mbpanel-type-label');

        expect(submissionTypeLabel.length).toBe(1);
      });

      it('should not lock submissionType', () => {
        const lockSubmissionTypeSpy = jest.spyOn(component, 'lockSubmissionType').mockReturnThis();
        jest.spyOn(component, 'setValues').mockReturnThis();

        component.ngOnInit();

        expect(lockSubmissionTypeSpy).not.toHaveBeenCalled();
      });

      it('should not prepopulate the form data', () => {
        const setValuesSpy = jest.spyOn(component, 'setValues').mockReturnThis();
        jest.spyOn(component, 'lockSubmissionType').mockReturnThis();

        component.ngOnInit();

        expect(setValuesSpy).not.toHaveBeenCalled();
      });
    });

    describe('add page', () => {
      beforeEach(() => {
        component.id = null;
      });
      it('should render add template', () => {
        const submissionTypeLabel = fixture.debugElement.nativeElement.querySelectorAll('div.mbpanel-type-label');

        fixture.detectChanges();

        expect(submissionTypeLabel.length).toBe(3);
      });

      describe('form', () => {
        it('should be invalid', () => {
          expect(component.submissionRouteForm.valid).toBe(false);
        });
        it('should set default submissionRouteType to Network', () => {
          const submissionRouteType = component.submissionRouteForm.get('submissionRouteType');

          fixture.detectChanges();

          expect(submissionRouteType?.value).toBe('Network');
        });
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AddIntermediaryComponent } from './add-intermediary.component';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

describe('AddIntermediaryComponent', () => {
  let component: AddIntermediaryComponent;
  let fixture: ComponentFixture<AddIntermediaryComponent>;
  let mockToastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIntermediaryComponent],
      imports: [SharedTestingHelperModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    mockToastService = TestBed.inject(ToastService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntermediaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component setup', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('form submit', () => {
    it('should validate the forms', () => {
      const validationSpy = jest.spyOn(component, 'validateForms');

      component.submit();

      expect(validationSpy).toHaveBeenCalled();
    });

    it('should not post data if forms are not validated', () => {
      const postDataSpy = jest.spyOn(component, 'postIntermediary');

      component.submit();

      expect(postDataSpy).not.toHaveBeenCalled();
    });

    it('should post data if forms are validated', () => {
      jest.spyOn(component, 'validateForms').mockReturnValue(true);
      const postDataSpy = jest.spyOn(component, 'postIntermediary').mockReturnThis();

      component.submit();

      expect(postDataSpy).toHaveBeenCalled();
    });

    it('should display a message when submit fails', () => {
      const toastSpy = jest.spyOn(mockToastService, 'showMessage');

      component.submit();

      expect(toastSpy).toHaveBeenCalled();
    });
  });
});

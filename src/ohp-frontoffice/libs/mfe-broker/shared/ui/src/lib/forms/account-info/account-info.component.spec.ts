import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountInfoComponent } from './account-info.component';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { mockAccountInfoIntermediary } from '../../__mocks__/account-information';

describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountInfoComponent],
      imports: [ReactiveFormsModule, SharedTestingHelperModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component setup', () => {
    describe('component', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('form', () => {
      it('Should be email and mobile fields required', () => {
        //Arrange
        const email = component.accountInfoForm.controls.email;
        const mobile = component.accountInfoForm.controls.mobile;
        //Act
        fixture.detectChanges();
        //Assert
        expect(email.valid).toBeFalsy();
        expect(email.errors?.required).toBeTruthy();
        expect(mobile.valid).toBeFalsy();
        expect(mobile.errors?.required).toBeTruthy();
      });

      it('Should fields be valid when the data are entered', () => {
        //Arrange
        const email = component.accountInfoForm.controls.email;
        const mobile = component.accountInfoForm.controls.mobile;
        const tel = component.accountInfoForm.controls.tel;
        //Act
        email.setValue('user@gmail.com');
        mobile.setValue('99999999');
        tel.setValue('99999999');
        fixture.detectChanges();
        //Assert
        expect(email.valid).toBeTruthy();
        expect(mobile.valid).toBeTruthy();
        expect(tel.valid).toBeTruthy();
      });

      it('Should the form be valid when all required data are entered', () => {
        //Arrange
        const formData = mockAccountInfoIntermediary;

        //Act
        component.accountInfoForm.patchValue(formData);
        fixture.detectChanges();

        //Assert
        expect(component.accountInfoForm.valid).toBeTruthy();
      });
    });
  });
});

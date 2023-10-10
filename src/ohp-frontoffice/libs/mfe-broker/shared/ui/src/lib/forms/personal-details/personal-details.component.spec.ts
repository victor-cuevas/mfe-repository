import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './personal-details.component';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { mockPersonalDetailsIntermediary } from '../../__mocks__/personal-details';

describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent],
      imports: [ReactiveFormsModule, SharedTestingHelperModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsComponent);
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
      it('Should be firstName and surname fields required', () => {
        //Arrange
        const fistNameInput = component.personalDetailsForm.controls.firstName;
        const surNameInput = component.personalDetailsForm.controls.surName;
        //Act
        fixture.detectChanges();
        //Assert
        expect(fistNameInput.valid).toBeFalsy();
        expect(fistNameInput.errors?.required).toBeTruthy();
        expect(surNameInput.valid).toBeFalsy();
        expect(surNameInput.errors?.required).toBeTruthy();
      });

      it('Should fields be valid when the data are entered', () => {
        //Arrange
        const titleInput = component.personalDetailsForm.controls.title;
        const fistNameInput = component.personalDetailsForm.controls.firstName;
        const surNameInput = component.personalDetailsForm.controls.surName;
        const dobInput = component.personalDetailsForm.controls.dob;
        //Act
        titleInput.setValue('Mrs');
        fistNameInput.setValue('Jasja');
        surNameInput.setValue('Prick');
        dobInput.setValue(28 / 12 / 1989);
        fixture.detectChanges();
        //Assert
        expect(titleInput.valid).toBeTruthy();
        expect(fistNameInput.valid).toBeTruthy();
        expect(surNameInput.valid).toBeTruthy();
        expect(dobInput.valid).toBeTruthy();
      });

      it('Should the form be valid when all required data are entered', () => {
        //Arrange
        const formData = mockPersonalDetailsIntermediary;

        //Act
        component.personalDetailsForm.patchValue(formData);
        fixture.detectChanges();

        //Assert
        expect(component.personalDetailsForm.valid).toBeTruthy();
      });
    });
  });
});

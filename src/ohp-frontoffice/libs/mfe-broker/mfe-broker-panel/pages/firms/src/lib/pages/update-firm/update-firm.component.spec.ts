import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { mockFirm } from '../../__mocks__/firm-form';
import { UpdateFirmComponent } from './update-firm.component';
import { AccordionModule } from 'primeng/accordion';

describe('UpdateFirmComponent', () => {
  let component: UpdateFirmComponent;
  let fixture: ComponentFixture<UpdateFirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateFirmComponent],
      imports: [
        ReactiveFormsModule,
        SharedTestingHelperModule,
        RouterTestingModule,
        InputNumberModule,
        AccordionModule,
        MultiSelectModule,
        DropdownModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFirmComponent);
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
      it('should display the form with all the fields', () => {
        //Arrange
        const formElement = fixture.debugElement.nativeElement.querySelector('#firmForm');
        const inputElements = formElement.querySelectorAll('input');

        //Act
        fixture.detectChanges();

        //Assert
        expect(inputElements.length).toEqual(11);
      });

      it('Should fields be valid when the data is entered ', () => {
        //Arrange
        const firmTypeControl = component.firmForm.get('firmType');
        const firmNameControl = component.firmForm.get('firmName');
        const emailControl = component.firmForm.get('email');
        const fcaReference = component.firmForm.get('fcaReference');
        const complaintsWebpageControl = component.firmForm.get('complaintsWebpage');

        //Act
        firmTypeControl?.setValue('testType');
        firmNameControl?.setValue('testName');
        emailControl?.setValue('test@test.com');
        fcaReference?.setValue('GFD67');
        complaintsWebpageControl?.setValue('http://test.com');
        fixture.detectChanges();

        //Assert
        expect(firmTypeControl?.valid).toBeTruthy();
        expect(firmNameControl?.valid).toBeTruthy();
        expect(emailControl?.valid).toBeTruthy();
        expect(fcaReference?.valid).toBeTruthy();
        expect(complaintsWebpageControl?.valid).toBeTruthy();
      });

      it('Should the form be valid when all required data is entered', () => {
        //Arrange
        const formData = mockFirm;
        //Act
        component.firmForm?.patchValue(formData);
        fixture.detectChanges();

        //Assert
        expect(component.firmForm.valid).toBeTruthy();
      });
    });
  });
});

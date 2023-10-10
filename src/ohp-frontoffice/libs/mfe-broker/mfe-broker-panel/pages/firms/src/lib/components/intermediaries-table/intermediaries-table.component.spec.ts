import { HttpResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntermediaryService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { SharedTestingHelperModule } from '@close-front-office/shared/testing-helper';
import { MfeBrokerSharedUiModule } from '@close-front-office/mfe-broker/shared-ui';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { mockIntermediaries } from '../../__mocks__/intermediaries';
import { IntermediariesTableComponent } from './intermediaries-table.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('IntermediariesTableComponent', () => {
  let component: IntermediariesTableComponent;
  let fixture: ComponentFixture<IntermediariesTableComponent>;
  let mockServiceIntermediary: IntermediaryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntermediariesTableComponent],
      imports: [
        SharedTestingHelperModule,
        InputSwitchModule,
        MfeBrokerSharedUiModule,
        TableModule,
        DialogModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    mockServiceIntermediary = TestBed.inject(IntermediaryService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediariesTableComponent);
    component = fixture.componentInstance;
  });

  describe('component setup', () => {
    describe('component', () => {
      it('should create', () => {
        // assert
        expect(component).toBeTruthy();
      });
    });
    describe('ngOnInit', () => {
      it('should call IntermediaryService.intermediarySearch', () => {
        // arrange
        const getFirmMembersSpy = jest.spyOn(mockServiceIntermediary, 'intermediarySearchIntermediariesAll');

        // act
        fixture.detectChanges();
        // assert
        expect(getFirmMembersSpy).toHaveBeenCalled();
      });
    });

    describe('table', () => {
      it('should render all intermediaries in the table', () => {
        jest
          .spyOn(mockServiceIntermediary, 'intermediarySearchIntermediaries')
          .mockReturnValue(of(new HttpResponse({ body: mockIntermediaries })));

        component.loadFirmMembers({});
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('tr.px-3')).length).toBe(1);
      });
    });
  });
});

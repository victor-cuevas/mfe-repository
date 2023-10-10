import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidAutoCompleteConfig,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  fluidValidationService,
  FluidDropDownConfig,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { PrintDocumentContextFilterDto } from './Models/print-document-contextFilterDto.model';
import { PrintDocumentCreditStatusFilterDto } from './Models/print-document-creditstatus.model';
import { PrintDocumentCreditSubStatusFilterDto } from './Models/print-document-CreditSubStatusFilterDto.models';
import { PrintDocumentFilterDto } from './Models/print-document-filterDto.model';
import { PrintDocumentUserProfileNameFilterDto } from './Models/print-document-userProfileName-filterDto.model';
import { DtoState } from './Models/dtoBase.model';
import { PrintDocumentFilterService } from './Services/print-document-filter.service';
import { codeTable } from './Models/codeTable.model';

import { SpinnerService } from '@close-front-office/mfe-communication-config-service/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import { PrintDocumentFilterConfigSearchDto } from './Models/print-document-filterConfigSearchDto.model';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { DocumentTemplateDto } from './Models/document-template.model';

@Component({
  selector: 'mccs-print-document-filter',
  templateUrl: './print-document-filter.component.html',
  styleUrls: ['./print-document-filter.component.scss']
})
export class PrintDocumentFilterComponent implements OnInit {
  @ViewChild('printDocumentFilterform', { static: true }) printDocumentFilterform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public AutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;
  public NameAutoCompleteConfig: FluidAutoCompleteConfig = this.fluidService.FluidAutoCompleteConfig;

  placeholder = '';
  internaldrop!: any;
  templateCode!: any;
  templateName!: any;
  CommunicationMedium!: any;
  Seqnr!: any;
  BalancemovementType!: any;

  printHeader!: any[];

  creditHeader!: any[];

  creditSubHeader!: any[];

  userProfileHeader!: any[];

  contextHeader!: any[];
  showDialog = false;
  exceptionBox!: boolean;
  errorCode !: string;
  validationHeader!: string;

  printDocumentList: PrintDocumentFilterDto[] = [];
  printDocumentMasterList: PrintDocumentFilterDto[] = [];
  printDocumentData: PrintDocumentFilterDto = new PrintDocumentFilterDto();
  modifiedPrintDocument: PrintDocumentFilterDto[] = [];
  searchTemplate: DocumentTemplateDto = new DocumentTemplateDto();
  highlightPrintDocument: PrintDocumentFilterDto = new PrintDocumentFilterDto();
  navigateURL:any;
  SelectedIndex!:number;
  filterTemplateName:any;
  filterTemplateCode:any;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public printDocumentService: PrintDocumentFilterService,
    public fluidValidation: fluidValidationService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
  ) {
    this.validationHeader = this.translate.instant('communication.Validation.validationHeader');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      const updatePrintDocument = data.printdocumentdata.printDocumentFilters.map((x: any) => {
        return { ...x, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (updatePrintDocument.length > 0) {
        updatePrintDocument[0].rowSelected = true;
        this.printDocumentList = [...updatePrintDocument];
        this.printDocumentData = this.printDocumentList[0];
        this.highlightPrintDocument = this.printDocumentList[0];
        this.printDocumentMasterList = this.printDocumentList;
      }
    
    });

    this.printHeader = [
     { header: this.translate.instant('communication.print.tabel.templateCode'), field: 'documentTemplate.pKey', width: '10%' },
      { header: this.translate.instant('communication.print.tabel.templateName'), field: 'documentTemplate.name', width: '90%' }
    ];

    this.creditHeader = [
      { header: this.translate.instant('communication.print.tabel.'), field: 'isSelected', property: 'creditcheckbox', width: '10%' },
      { header: this.translate.instant('communication.print.tabel.'), field: 'creditStatus.caption', property: 'credittext', width: '90%' }
    ];

    this.creditSubHeader = [
      { header: this.translate.instant('communication.print.tabel.'), field: 'isSelected', property: 'creditSubStscheckbox', width: '10%' },
      {
        header: this.translate.instant('communication.print.tabel.'),
        field: 'creditSubStatus.caption',
        property: 'creditSubStstext',
        width: '90%'
      }
    ];

    this.creditSubHeader = [
      { header: this.translate.instant('communication.print.tabel.'), field: 'isSelected', property: 'creditSubStscheckbox', width: '10%' },
      {
        header: this.translate.instant('communication.print.tabel.'),
        field: 'creditSubStatus.caption',
        property: 'creditSubStstext',
        width: '90%'
      }
    ];

    this.userProfileHeader = [
      {
        header: this.translate.instant('communication.print.tabel.'),
        field: 'isSelected',
        property: 'userProfileNamecheckbox',
        width: '10%'
      },
      {
        header: this.translate.instant('communication.print.tabel.'),
        field: 'userProfileName.caption',
        property: 'userProfileNametext',
        width: '90%'
      }
    ];

    this.contextHeader = [
      { header: this.translate.instant('communication.print.tabel.'), field: 'isSelected', property: 'contextcheckbox', width: '10%' },
      {
        header: this.translate.instant('communication.print.tabel.'),
        field: 'printDocumentContext.caption',
        property: 'contexttext',
        width: '90%'
      }
    ];
  }

  
  filterTemplateNames(event: any) {
    if (event) {
      this.filterTemplateName = [];
      this.printDocumentList.filter(data => {
        if (data.documentTemplate.name.toLowerCase().startsWith(event?.query.toLowerCase())) {
            this.filterTemplateName.push(data);
          }
        });
    }
  }

  filterTemplateCodes(event: any) {
    if (event) {
      this.filterTemplateCode = [];
      this.printDocumentList.filter(data => {
          if (data.documentTemplate.pKey.toString().startsWith(event?.query)) {
            this.filterTemplateCode.push(data);
          }
        });
    }
  }

  changeTemplateCode(event: any) {
    if (event.target.value) {
      const code = this.printDocumentList.filter(x => {
        return x.documentTemplate.pKey.toString().startsWith(event?.target?.value);
      });
      if (code[0] != null) {
        this.searchTemplate.pKey = code[0].documentTemplate.pKey;
      }
    }
     else {
      this.searchTemplate.pKey = null as unknown as number;
    }
  }

  changeTemplateName(event: any) {
    if (event.target.value) {
      const name = this.printDocumentList.filter(x => {
        return x.documentTemplate.name.startsWith(event?.target?.value);
      });
      if (name[0] != null) {
        this.searchTemplate.name = name[0].documentTemplate.name;
       }
      }
       else {
       this.searchTemplate.name = null as unknown as string;
      }
  }

  onSearch(searchTemplate: DocumentTemplateDto) {
    this.printDocumentList = this.printDocumentMasterList;
    if(searchTemplate.pKey != null)
    {
      this.printDocumentList = this.printDocumentList.filter(y => y.documentTemplate?.pKey == searchTemplate.pKey)
    }
    if(searchTemplate.name != null)
    {
      const searchTemplateName = searchTemplate.name.toLowerCase();
      this.printDocumentList = this.printDocumentList.filter(y => y.documentTemplate?.name.toLowerCase().startsWith(searchTemplateName))
    }
    if(this.printDocumentList.length == 0)
    {
      this.throwBusinessError(this.translate.instant('communication.print.BusinessError.NoRecord'));
      return;
    }
    
    this.printDocumentData = this.printDocumentList[0];
    this.highlightPrintDocument = this.printDocumentList[0];
  }

  onClear() {
    this.printDocumentService.getPrintDocumentScreen().subscribe((responseData: any) => {
      this.spinnerService.setIsLoading(false);
      const updatePrintDocument = responseData.printDocumentFilters.map((x: any) => {
        return { ...x, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (updatePrintDocument.length > 0) {
        updatePrintDocument[0].rowSelected = true;
        this.printDocumentList = [...updatePrintDocument];
        this.printDocumentData = this.printDocumentList[0];
        this.highlightPrintDocument = this.printDocumentList[0];
      }    
     this.searchTemplate =  new DocumentTemplateDto;
     this.RemoveBusinessError(this.translate.instant('communication.print.BusinessError.NoRecord'));
     return;
     });
  }

  throwBusinessError(ErrorMessage: string) {
    if (this.fluidValidation.FluidBaseValidationService.ValidationErrorList.length > 0) {
      const index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(x => {
        return x.ErrorMessage == ErrorMessage;
      });
      if (index == -1) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
      }
    } else {
      this.fluidValidation.FluidBaseValidationService.ValidationErrorList.push(new ValidationErrorDto(ErrorMessage, true));
    }
  }

  RemoveBusinessError(ErrorMessage: string) {
    this.fluidValidation.FluidBaseValidationService.ValidationErrorList.map(x => {
      const Index = this.fluidValidation.FluidBaseValidationService.ValidationErrorList.findIndex(
        x => x.ErrorMessage == ErrorMessage && x.IsBusinessError
      );
      if (Index >= 0) {
        this.fluidValidation.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
      }
    });
  }

  onRowSelect(event: PrintDocumentFilterDto) {

    if(event){
      let updateprintdocumentData = this.printDocumentList;
      const eventIndex = updateprintdocumentData.findIndex(x => x.rowSelected);
  
      updateprintdocumentData = this.deselectPrintData(updateprintdocumentData);
  
      this.printDocumentList[eventIndex].rowSelected = updateprintdocumentData[eventIndex].rowSelected;
  
      const selectedIndex = updateprintdocumentData.findIndex(x => x.randomNumber == event.randomNumber);
  
      this.printDocumentList[selectedIndex].rowSelected = true;
      //this.highlightTypeMapping = this.typemappingList[selectedIndex];

      
      this.printDocumentData =  this.printDocumentList[selectedIndex];
      if(this.printDocumentData.maximumDue === null){
        // this.printDocumentFilterform.controls['MaxinumDue'].setValue(null);
      }
      this.highlightPrintDocument = this.printDocumentList[selectedIndex];
    }

  }

  onCreditCheckBoxChange(event: boolean, rowData: PrintDocumentCreditStatusFilterDto, creditstsindex: number) {

    const updateprintdocumentData = this.printDocumentList;
    const TemplateIndex = updateprintdocumentData.findIndex(x => x.rowSelected);

    if (TemplateIndex >= 0) {
      const updateData = this.printDocumentList[TemplateIndex];
      const updategrid = { ...updateData.printDocumentCreditStatusFilters[creditstsindex] };
      updategrid.isSelected = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.printDocumentList[TemplateIndex].printDocumentCreditStatusFilters[creditstsindex].isSelected = updategrid.isSelected;
      this.printDocumentList[TemplateIndex].printDocumentCreditStatusFilters[creditstsindex].state = updategrid.state;
      this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      this.printDocumentData.printDocumentCreditStatusFilters[creditstsindex].isSelected = event;
    }

  }

  onCreditSubStatusCheckBoxChange(event: boolean, rowData: PrintDocumentCreditSubStatusFilterDto, creditsubstsindex: number) {
    const updateprintdocumentData = this.printDocumentList;
    const TemplateIndex = updateprintdocumentData.findIndex(x => x.rowSelected);

    if (TemplateIndex >= 0) {
      const updateData = this.printDocumentList[TemplateIndex];
      const updategrid = { ...updateData.printDocumentCreditSubStatusFilters[creditsubstsindex] };
      updategrid.isSelected = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.printDocumentList[TemplateIndex].printDocumentCreditSubStatusFilters[creditsubstsindex].isSelected = updategrid.isSelected;
      this.printDocumentList[TemplateIndex].printDocumentCreditSubStatusFilters[creditsubstsindex].state = updategrid.state;
      this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      this.printDocumentData.printDocumentCreditSubStatusFilters[creditsubstsindex].isSelected = event;
    }

  }

  onuserProfileNameCheckBoxChange(event: boolean, rowData: PrintDocumentUserProfileNameFilterDto, userProfileIndex: number) {
    const updateprintdocumentData = this.printDocumentList;
    const TemplateIndex = updateprintdocumentData.findIndex(x => x.rowSelected);

    if (TemplateIndex >= 0) {
      const updateData = this.printDocumentList[TemplateIndex];
      const updategrid = { ...updateData.printDocumentUserProfileNameFilters[userProfileIndex] };
      updategrid.isSelected = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.printDocumentList[TemplateIndex].printDocumentUserProfileNameFilters[userProfileIndex].isSelected = updategrid.isSelected;
      this.printDocumentList[TemplateIndex].printDocumentUserProfileNameFilters[userProfileIndex].state = updategrid.state;
      this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      this.printDocumentData.printDocumentUserProfileNameFilters[userProfileIndex].isSelected = event;
    }

  }

  onprintDocumentContextCheckBoxChange(event: boolean, rowData: PrintDocumentContextFilterDto, contextIndex: number) {
    const updateprintdocumentData = this.printDocumentList;
    const TemplateIndex = updateprintdocumentData.findIndex(x => x.rowSelected);

    if (TemplateIndex >= 0) {
      const updateData = this.printDocumentList[TemplateIndex];
      const updategrid = { ...updateData.printDocumentContextFilters[contextIndex] };
      updategrid.isSelected = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.printDocumentList[TemplateIndex].printDocumentContextFilters[contextIndex].isSelected = updategrid.isSelected;
      this.printDocumentList[TemplateIndex].printDocumentContextFilters[contextIndex].state = updategrid.state;
      this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      this.printDocumentData.printDocumentContextFilters[contextIndex].isSelected = event;
    }

  }
  onMaxinumDueChange(event: any, ischanged: boolean) {
    const updateprintdocumentData = this.printDocumentList;
    const TemplateIndex = updateprintdocumentData.findIndex(x => x.rowSelected);

    if (event != null && event != '') {
      if (!ischanged) {
        const eventConversion = event.toString().split('.').join('');
        const value = eventConversion.toString().replace(',', '.');
        const floatValue = parseFloat(value).toFixed(2);

        this.printDocumentList[TemplateIndex].maximumDue = parseFloat(floatValue);
        this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      }
    } else {
      setTimeout(() => {
        this.printDocumentList[TemplateIndex].maximumDue = 0;
        this.printDocumentList[TemplateIndex].state = DtoState.Dirty;
      }, 1);
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  deselectPrintData(printdocumentFilter: PrintDocumentFilterDto[]) {
    const deSelectData = printdocumentFilter;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: PrintDocumentFilterDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onSave(printDocumentList: PrintDocumentFilterDto[]) {
    printDocumentList.map((x: PrintDocumentFilterDto) => {
      if (x.state != DtoState.Unknown) {
        this.modifiedPrintDocument.push({ ...x });
      }
    });

    this.printDocumentService.savePrintDocument(this.modifiedPrintDocument).subscribe(data => {
      this.spinnerService.setIsLoading(false);
      this.modifiedPrintDocument = [];
      this.printDocumentService.getPrintDocumentScreen().subscribe((responseData: any) => {
        this.spinnerService.setIsLoading(false);
        const updatePrintDocument = responseData.printDocumentFilters.map((x: any) => {
          return { ...x, randomNumber: this.generateRandomNumber(), rowSelected: false };
        });

        if (updatePrintDocument.length > 0) {
         
          this.printDocumentList = [...updatePrintDocument];
          const selectedIndex = this.printDocumentList.findIndex(x=>x.documentTemplate.name === this.printDocumentData.documentTemplate.name)
          updatePrintDocument[selectedIndex].rowSelected = true;
          this.printDocumentData = this.printDocumentList[selectedIndex];
          this.highlightPrintDocument = this.printDocumentList[selectedIndex];
        }
      },err =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
      });
    },err =>{
      if(err?.error?.errorCode){
        this.errorCode = err.error.errorCode;
      }else{
        this.errorCode= 'InternalServiceFault';
      }
      this.spinnerService.setIsLoading(false);
      this.exceptionBox = true;
    });
  }

  onClose() {
    const isChangedIndexExist = this.printDocumentList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.modifiedPrintDocument.length > 0) {
      this.showDialog = true;
    } else {
      this.onClear();
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(printDocumentList: PrintDocumentFilterDto[]) {
    this.showDialog = false;

    this.onSave(printDocumentList);
    this.onClear();
    window.location.assign(this.navigateURL);
  }

  onDialogNo() {
    this.showDialog = false;
    this.onClear();
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }  
}

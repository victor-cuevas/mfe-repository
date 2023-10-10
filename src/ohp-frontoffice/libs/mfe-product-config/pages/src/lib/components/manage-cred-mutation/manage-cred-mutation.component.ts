import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModelGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorDto,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidDropDownConfig,
  fluidValidationService
} from '@close-front-office/shared/fluid-controls';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeTableDto } from './models/code-table.modle';
import { MutationDefinitionDto } from './models/mutation-definition.model';
import { RateAdaptationCriterionDto } from './models/rate-adaptationcriterion.model';
import { MutationReasonConfigDto } from './models/mutation-reason.model';
import { MissingDocumentDto } from './models/missing-document.model';
import { RequiredActionDto } from './models/required-action.model';
import { MutationDataDto } from './models/mutation-data.model';
import { ManageCredMutationService } from './services/manage-cred-mutation.service';
import { SpinnerService } from '@close-front-office/mfe-product-config/core';
import {DtoState} from './models/dto-base.model'

@Component({
  selector: 'mprdc-manage-cred-mutation',
  templateUrl: './manage-cred-mutation.component.html',
  styleUrls: ['./manage-cred-mutation.component.scss']
})
export class ManageCredMutationComponent implements OnInit {
  @ViewChild('mutationForm', { static: true }) mutationForm!: NgForm;
  @ViewChild('mutationReasonForm', { static: true }) mutationReasonForm!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MutationTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RateSelectionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;

  public MutationReasonDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public MissingDocDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public BlockingTypeDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredActionDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  MutationDefHeader!: any[];
  MutationResHeader!: any[];
  MutationMissHeader!: any[];
  MutationReqHeader!: any[];

  placeholder = 'Select';
  showDialog!: boolean;

  SelectedTabIndex!: number;

  /*MutationDefintion Dto */
  rateSelectionDateTypeList!: CodeTableDto[];
  mutationType!: CodeTableDto[];
  rateadaptationCriteria!: CodeTableDto[];

  mutationdefintionList!: MutationDefinitionDto[];
  mutationData: MutationDefinitionDto = new MutationDefinitionDto();

  higlightData : MutationDefinitionDto = new MutationDefinitionDto();

  commonrateCriteria!: RateAdaptationCriterionDto[];
  checkExistingMutation!: CodeTableDto;
  deletedArray = new MutationDataDto();

  commonUpdatedDropdown!: CodeTableDto[];
  commonRateDropdown!: CodeTableDto[];

  /*Mutation Reason Dto */
  mutationReasonNameList!: CodeTableDto[];
  blockingTypeList!: CodeTableDto[];
  missingDocNameList!: CodeTableDto[];
  requiredActionList!: CodeTableDto[];

  mutationReasonList!: MutationReasonConfigDto[];
  mutationdetails: MutationReasonConfigDto = new MutationReasonConfigDto();
  commonReasonUpdateDropdown!: CodeTableDto[];
  commonMissingDocDropdown!: CodeTableDto[];
  commonRequireAction!: CodeTableDto[];

  commonMissingDoc!: CodeTableDto[];
  higlightReasonData : MutationReasonConfigDto = new MutationReasonConfigDto();
  hidemissingDocCard = false;
  hidecheckbox = false;
  exceptionBox !: boolean;
  errorCode !: string;
  /*Validation*/
  validationHeader!: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public mutationService: ManageCredMutationService,
    public validationService: fluidValidationService,
    public router: Router,
    public spinnerService: SpinnerService
  ) {
    this.validationHeader = this.translate.instant('product.Validation.Header');

    this.validationService.ActivateTabEvent.subscribe((selectedTabIndex: number) => {
      this.SelectedTabIndex = selectedTabIndex;
    });
  }

  ngOnInit(): void { 
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data:any) => {
      this.spinnerService.setIsLoading(false);
      this.rateSelectionDateTypeList = data.mutationData.manageMutationInitialData.rateSelectionDateTypeList;
      this.mutationType = data.mutationData.manageMutationInitialData.mutationTypeList;
      this.rateadaptationCriteria = data.mutationData.manageMutationInitialData.rateAdaptationCriterionNameList;
      this.mutationReasonNameList = data.mutationData.manageMutationInitialData.mutationReasonNameList;
      this.blockingTypeList = data.mutationData.manageMutationInitialData.blockingTypeList;
      this.missingDocNameList = data.mutationData.manageMutationInitialData.missingDocNameList;
      this.requiredActionList = data.mutationData.manageMutationInitialData.requiredActionList;

      this.commonMissingDoc = this.missingDocNameList;

      const updateddefinitionList = data.mutationData.manageMutationData.mutationDefinitionList.map((data: any) => {
        return {
          ...data,
          SelectedRow: false,
          randomNumber: this.generateRandomNumber(),
          disableMutation: true,
          disableCheckBox: true
        };
      });

      const updatedReasonList = data.mutationData.manageMutationData.mutationReasonList.map((data: any) => {
        return { ...data, SelectedRow: false, randomNumber: this.generateRandomNumber() };
      });

      this.mutationdefintionList = [...updateddefinitionList];
      if(this.mutationdefintionList.length>0){
        this.mutationdefintionList[0].SelectedRow = true;
        this.mutationdefintionList[0].disableCheckBox = false;
      }else{
        this.hidecheckbox= true;
      }
      

      this.mutationReasonList = [...updatedReasonList];

      if(this.mutationReasonList.length>0){
        if(this.mutationReasonList.length>0){
          this.mutationReasonList[0].SelectedRow = true;
        }if(this.mutationReasonList[0].missingDocumentConfigList.length>0){
          this.mutationReasonList[0].missingDocumentConfigList[0].SelectedRow = true;
        }if(this.mutationReasonList[0].requiredActionConfigList.length>0){
           this.mutationReasonList[0].requiredActionConfigList[0].SelectedRow = true;
        }
      }else{
        this.hidemissingDocCard= true;
      }
      if (this.mutationdefintionList.length > 0) {
        this.mutationData.rateAdaptationCriterionList = this.mutationdefintionList[0].rateAdaptationCriterionList;
        /*Common rateadaption criteria */
        this.commonrateCriteria = this.mutationdefintionList[0].rateAdaptationCriterionList.map((x: RateAdaptationCriterionDto) => {
          return { ...x, isSelected: false };
        });
      }
   

      

      /*Update  Dropdown in mutationDefinitionList for eachElement */
      const updatedDropdown = this.mutationdefintionList.map((data: MutationDefinitionDto) => {
        this.commonUpdatedDropdown = this.mutationType;
        this.commonRateDropdown = this.rateSelectionDateTypeList;
        return { ...data, mutationTypeList: this.commonUpdatedDropdown, rateSelectionDateTypeList: this.commonRateDropdown };
      });
      this.mutationdefintionList = [...updatedDropdown];
      if (this.mutationdefintionList.length > 0){
        this.higlightData = this.mutationdefintionList[0]
      }
      /* Update  Dropdown in mutationReasonList for eachElement  */

      const UpdateReasonDropdown = this.mutationReasonList.map((data: any) => {
        this.commonReasonUpdateDropdown = this.mutationReasonNameList;
        const missingDocUpdate = data.missingDocumentConfigList.map((x: any) => {
          this.commonMissingDocDropdown = this.missingDocNameList;
          return { ...x, missingDocNameList: this.commonMissingDocDropdown, isDeleted: false };
        });

        const requireActionUpdate = data.requiredActionConfigList.map((y: any) => {
          this.commonRequireAction = this.requiredActionList;
          return { ...y, requiredActionList: this.commonRequireAction, isDeleted: false };
        });

        return {
          ...data,
          mutationReasonNameList: this.commonReasonUpdateDropdown,
          missingDocumentConfigList: missingDocUpdate,
          requiredActionConfigList: requireActionUpdate
        };
      });
      this.mutationReasonList = [...UpdateReasonDropdown];
      if(this.mutationReasonList.length > 0){
        this.higlightReasonData =this.mutationReasonList[0]
        this.mutationdetails.missingDocumentConfigList = this.mutationReasonList[0].missingDocumentConfigList;
        this.mutationdetails.requiredActionConfigList = this.mutationReasonList[0].requiredActionConfigList;
      }
      
    });

    this.MutationDefHeader = [
      {
        header: this.translate.instant('product.ManageMutation.tabel.MutationType'),
        field: 'mutationType',
        width: '35%',
        property: 'textdropdownList',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('product.ManageMutation.tabel.RateSelectionDate'),
        field: 'rateSelectionDateType',
        width: '30%',
        property: 'dropdownList',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('product.ManageMutation.tabel.AutomaticRateRevaluation'),
        field: 'automaticRateReevaluationCheckNeeded',
        width: '27%',
        property: 'checkbox'
      },
      {
        header: this.translate.instant('product.general.Delete'),
        field: null,
        width: '8%',
        property: 'Delete',
        pSortableColumnDisabled: true
      }
    ];

    this.MutationResHeader = [
      {
        header: this.translate.instant('product.ManageMutation.tabel.MutationRes'),
        field: 'mutationReasonName',
        width: '92%',
        property: 'textdropdownList',
        pSortableColumnDisabled: true
      },
      { header: this.translate.instant('product.general.Delete'), field: null, width: '8%', property: 'Delete',pSortableColumnDisabled: true}
    ];

    this.MutationMissHeader = [
      {
        header: this.translate.instant('product.ManageMutation.tabel.MissingDocName'),
        field: 'missingDocName',
        width: '50%',
        property: 'textdropdownList',
        pSortableColumnDisabled: true
      },
      {
        header: this.translate.instant('product.ManageMutation.tabel.BlockingType'),
        field: 'blockingType',
        width: '42%',
        property: 'blocktextdropdownList',
        pSortableColumnDisabled: true
      },
      { header: this.translate.instant('product.general.Delete'), field: null, width: '8%', property: 'Delete',pSortableColumnDisabled: true}
    ];

    this.MutationReqHeader = [
      {
        header: this.translate.instant('product.ManageMutation.tabel.RequiredAction'),
        field: 'requiredAction',
        width: '92%',
        property: 'textdropdownList',
        pSortableColumnDisabled: true
      },
      { header: this.translate.instant('product.general.Delete'), field: null, width: '8%', property: 'Delete',pSortableColumnDisabled: true}
    ];
  }

  buildConfiguration() {
    const mutationrequiredError = new ErrorDto();
    mutationrequiredError.validation = 'required';
    mutationrequiredError.isModelError = true;
    mutationrequiredError.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.MutationType') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.MutationTypeDropdownConfig.required = true;
    this.MutationTypeDropdownConfig.Errors = [mutationrequiredError];

    const rateselectionRequiredError = new ErrorDto();
    rateselectionRequiredError.validation = 'required';
    rateselectionRequiredError.isModelError = true;
    rateselectionRequiredError.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.RateSelectionDate') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.RateSelectionDropdownConfig.required = true;
    this.RateSelectionDropdownConfig.Errors = [rateselectionRequiredError];

    /*Mutation Reason Validation */
    const mutationReasonError = new ErrorDto();
    mutationReasonError.validation = 'required';
    mutationReasonError.isModelError = true;
    mutationReasonError.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.MutationRes') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.MutationReasonDropdownConfig.required = true;
    this.MutationReasonDropdownConfig.Errors = [mutationReasonError];

    const missingDocError = new ErrorDto();
    missingDocError.validation = 'required';
    missingDocError.isModelError = true;
    missingDocError.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.MissingDocName') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.MissingDocDropdownConfig.required = true;
    this.MissingDocDropdownConfig.Errors = [missingDocError];

    const blockingTypeError = new ErrorDto();
    blockingTypeError.validation = 'required';
    blockingTypeError.isModelError = true;
    blockingTypeError.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.BlockingType') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.BlockingTypeDropdownConfig.required = true;
    this.BlockingTypeDropdownConfig.Errors = [blockingTypeError];

    const requireAction = new ErrorDto();
    requireAction.validation = 'required';
    requireAction.isModelError = true;
    requireAction.validationMessage =
      this.translate.instant('product.ManageMutation.validationError.RequiredAction') +
      this.translate.instant('product.ManageMutation.validationError.required');
    this.RequiredActionDropdownConfig.required = true;
    this.RequiredActionDropdownConfig.Errors = [requireAction];
  }

  /*Mutation Defintion Delete Function */
  onRowDelete(event: MutationDefinitionDto, mutationdefintionList: MutationDefinitionDto[]) {
    let isNullCheck = false;
    const mutationData = [...mutationdefintionList];
    for (let i = 0; i < mutationData.length; i++) {
      if (
        !mutationData[i].mutationType ||
        !mutationData[i].rateSelectionDateType ||
        mutationData[i].mutationType === <CodeTableDto>{} ||
        mutationData[i].rateSelectionDateType === <CodeTableDto>{}
      ) {
        isNullCheck = true;
        break;
      }
    }

    if (isNullCheck) {
      if (event.mutationType && event.rateSelectionDateType) {
        this.MutationTypeDropdownConfig.externalError = true;
        this.RateSelectionDropdownConfig.externalError = true;
        return;
      }
    }

    const deleteIndex = mutationData.findIndex((mutationList: MutationDefinitionDto) => {
      return mutationList.randomNumber == event.randomNumber;
    });

    if (mutationData[deleteIndex].state == DtoState.Created) {
      event.mutationType = <CodeTableDto>{};
      event.rateSelectionDateType = <CodeTableDto>{};
      setTimeout(() => {
        this.DeleteMutationData(mutationData, deleteIndex);
      }, 100);
    } else {
      mutationData[deleteIndex].state = DtoState.Deleted;
      this.deletedArray.mutationDefinitionList.push(mutationData[deleteIndex]);

      event.mutationType = <CodeTableDto>{};
      event.rateSelectionDateType = <CodeTableDto>{};
      setTimeout(() => {
        this.DeleteMutationData(mutationData, deleteIndex);
      }, 100);
    }
  }

  DeleteMutationData(mutationData: any, deleteIndex: number) {
    mutationData.splice(deleteIndex, 1);
    if (mutationData.length > 0) {
      this.mutationdefintionList = this.deselectData(mutationData);
      this.mutationdefintionList[0].SelectedRow = true;
      this.mutationData.rateAdaptationCriterionList = this.mutationdefintionList[0].rateAdaptationCriterionList;
      this.higlightData = this.mutationdefintionList[0]
    }else{
      this.mutationdefintionList = this.deselectData(mutationData);
      this.hidecheckbox= true;
      
    }
  }

  /*Mutation Defintion GridRow Select Function */

  mutationDefintionSelect(event: any) {
    if (event) {
      if (this.mutationForm.valid || event.SelectedRow) {
        const mutationList = this.mutationdefintionList;
        const prevIndex = mutationList.findIndex(x => x.SelectedRow);
        const deselectedData = this.deselectData(mutationList);
        this.mutationdefintionList[prevIndex].SelectedRow = deselectedData[prevIndex].SelectedRow;
        this.mutationdefintionList[prevIndex].disableCheckBox = true;
        const Index = this.mutationdefintionList.findIndex(x => x.randomNumber == event.randomNumber);
        this.mutationdefintionList[Index].SelectedRow = true;
        this.mutationdefintionList[Index].disableCheckBox = false;
        this.mutationData.rateAdaptationCriterionList = event.rateAdaptationCriterionList;
        this.higlightData = this.mutationdefintionList[Index]
      } else if (this.mutationForm.valid || !event.isSelected) {
        this.checkMutationDefintionValid();
      }
    }
  }

  /*Mutation Type Change Dropdown Function */
  onmutationDropdownSelect(event: any,rowData:any) {
    let mutationDefinition = [...this.mutationdefintionList];
    const prevIndex = mutationDefinition.findIndex(x => x.SelectedRow);
    mutationDefinition = this.deselectData(mutationDefinition);
    this.mutationdefintionList[prevIndex].SelectedRow = mutationDefinition[prevIndex].SelectedRow;
    this.mutationdefintionList[prevIndex].disableCheckBox = true;
    const SelectedIndex = this.mutationdefintionList.findIndex(x => x.randomNumber == rowData.randomNumber);
    this.mutationdefintionList[SelectedIndex].SelectedRow = true;

    if (this.mutationdefintionList[SelectedIndex].state != DtoState.Created) {
      this.mutationdefintionList[SelectedIndex].state = DtoState.Dirty;
      this.mutationdefintionList[SelectedIndex].mutationType = event.value;
    } else if (this.mutationdefintionList[SelectedIndex].state == DtoState.Created) {
      this.mutationdefintionList[SelectedIndex].mutationType = event.value;

      this.mutationdefintionList[SelectedIndex].disableMutation = true;
    }
  }

  /*Rate Selection Change Dropdown Function */

  onrateSelectionType(event: any, rowData: any) {
    let mutationDefinition = [...this.mutationdefintionList];
    const prevIndex = mutationDefinition.findIndex(x => x.SelectedRow);
    mutationDefinition = this.deselectData(mutationDefinition);
    this.mutationdefintionList[prevIndex].SelectedRow = mutationDefinition[prevIndex].SelectedRow;
    this.mutationdefintionList[prevIndex].disableCheckBox = true;
    const SelectedIndex = this.mutationdefintionList.findIndex(x => x.randomNumber == rowData.randomNumber);
    this.mutationdefintionList[SelectedIndex].SelectedRow = true;

    if (event.value) {
      this.mutationdefintionList[SelectedIndex].rateSelectionDateType = event.value;
      if (this.mutationdefintionList[SelectedIndex].state != DtoState.Created) {
        this.mutationdefintionList[SelectedIndex].state = DtoState.Dirty;
      }
      this.mutationdefintionList[SelectedIndex].showClearIcon = true;
      this.mutationdefintionList[SelectedIndex].disableCheckBox = false;
    } else {
      this.mutationdefintionList[SelectedIndex].rateSelectionDateType = event.value;
      this.mutationdefintionList[SelectedIndex].showClearIcon = false;
      this.RateSelectionDropdownConfig.externalError = true;
      this.mutationdefintionList[SelectedIndex].disableCheckBox = false;
    }
  }

  /*RateReevaluation Checkbox Change  */

  onRateReevaluationCheck(event: any, rowData: any) {
    let mutationDefinition = [...this.mutationdefintionList];
    const prevIndex = mutationDefinition.findIndex(x => x.SelectedRow);
    mutationDefinition = this.deselectData(mutationDefinition);
    this.mutationdefintionList[prevIndex].SelectedRow = mutationDefinition[prevIndex].SelectedRow;
    const SelectedIndex = this.mutationdefintionList.findIndex(x => x.randomNumber == rowData.randomNumber);
    this.mutationdefintionList[SelectedIndex].SelectedRow = true;

    if (this.mutationdefintionList[SelectedIndex].state == DtoState.Created) {
      this.mutationdefintionList[SelectedIndex].state = DtoState.Created;
      this.mutationdefintionList[SelectedIndex].automaticRateReevaluationCheckNeeded = event;
      if (this.mutationdefintionList[SelectedIndex].disableCheckBox) {
        this.mutationdefintionList[SelectedIndex].disableCheckBox = false;
      }
    } else {
      this.mutationdefintionList[SelectedIndex].state = DtoState.Dirty;
      this.mutationdefintionList[SelectedIndex].automaticRateReevaluationCheckNeeded = event;
    }
  }

  /*RateAdaptationCriterion Checkbox Change  */

  onRateAdaptationChecked(event: any, ratecriteriaData: any, index: number) {
    const activeIndex = this.mutationdefintionList.findIndex(x => x.SelectedRow);

    if (this.mutationdefintionList[activeIndex].state == DtoState.Created) {
      this.mutationdefintionList[activeIndex].state = DtoState.Created;
      this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].state = DtoState.Created;
      this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].isSelected = event;
      this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].pKey = 0;
      this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].rowVersion = 0;
    } else {
      this.mutationdefintionList[activeIndex].state = DtoState.Dirty;
      if (event) {
        this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].isSelected = event;
        this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].state = DtoState.Dirty;
      } else {
        this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].isSelected = event;
        this.mutationdefintionList[activeIndex].rateAdaptationCriterionList[index].state = DtoState.Deleted;
      }
    }
  }

  /*Add New Row in MutationDefiniton in Grid */

  addmutationDefinition() {
    if (this.mutationForm.valid) {
      this.MutationTypeDropdownConfig.externalError = false;
      this.RateSelectionDropdownConfig.externalError = false;
      const mutationList = this.mutationdefintionList;
      if(mutationList.length > 0){
      const prevIndex = mutationList.findIndex(x => x.SelectedRow);
      const deselectedData = this.deselectData(mutationList);
      this.mutationdefintionList[prevIndex].SelectedRow = deselectedData[prevIndex].SelectedRow;
      }
    

      if (this.mutationdefintionList.length > 0) {
        this.commonUpdatedDropdown = this.mutationType.filter(val => {
          return !this.mutationdefintionList.find(x => {
            return x.mutationType.codeId == val.codeId;
          });
        });
      }

      const newmutationData = new MutationDefinitionDto();
      newmutationData.isReadOnly = true;
      newmutationData.SelectedRow = true;
      newmutationData.disableMutation = false;
      newmutationData.disableCheckBox = true;
      newmutationData.state = 1;
      newmutationData.mutationTypeList = this.commonUpdatedDropdown;
      newmutationData.randomNumber = this.generateRandomNumber();
      newmutationData.showClearIcon = false;
      newmutationData.rateSelectionDateTypeList = [...this.commonRateDropdown];
      newmutationData.rateAdaptationCriterionList = this.commonrateCriteria;
      this.mutationdefintionList.push({ ...newmutationData });
      this.mutationData.rateAdaptationCriterionList = this.commonrateCriteria;
      this.mutationdefintionList = [...this.mutationdefintionList];
      this.higlightData = this.mutationdefintionList[this.mutationdefintionList.length-1];
      this.hidecheckbox = false;
    } else {
      this.MutationTypeDropdownConfig.externalError = true;
      this.RateSelectionDropdownConfig.externalError = true;
    }
  }

  deselectData(mutationData: MutationDefinitionDto[]) {
    const deSelectData = mutationData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: MutationDefinitionDto) => {
            return {
              ...x,
              SelectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }
  onSave(mutationDefintion: MutationDefinitionDto[], mutationReason: MutationReasonConfigDto[]) {
    if (!this.mutationReasonForm.invalid && this.mutationForm.valid) {

      const selectedDefinition= mutationDefintion.find(x=>x.SelectedRow);
      const selectedReason = mutationReason.find(x=>x.SelectedRow);

      mutationDefintion.map(mutationData => {
        if (mutationData.state != 0) {
          this.deletedArray.mutationDefinitionList.push({ ...mutationData });
        }
      });

      /*Filter Deleted Array */
      mutationReason.forEach(x => {
        const notDeleted = x.missingDocumentConfigList.filter(y => y.isDeleted == false);

        x.missingDocumentConfigList = notDeleted;
      });

      mutationReason.forEach(x => {
        const notDeleted = x.requiredActionConfigList.filter(y => y.isDeleted == false);
        x.requiredActionConfigList = notDeleted;
      });

      mutationReason.map(mutationReason => {
        if (mutationReason.state != 0) {
          this.deletedArray.mutationReasonList.push({ ...mutationReason });
        }
      });

      /*Save Api Call*/
      this.spinnerService.setIsLoading(true);
      this.mutationService.saveManageMutation(this.deletedArray).subscribe((data: any) => {
        this.spinnerService.setIsLoading(false);
        this.deletedArray.mutationDefinitionList = [];
        this.deletedArray.mutationReasonList = [];

        /*Mutation Definition Update  */
        const updateDefinitionList = data.mutationDefinitionList.map((definitionData: MutationDefinitionDto) => {
          const updateRateAdaptation = definitionData.rateAdaptationCriterionList.map(x => {
            return { ...x, state: 0 };
          });

          return {
            ...definitionData,
            rateAdaptationCriterionList: updateRateAdaptation,
            SelectedRow: false,
            randomNumber: this.generateRandomNumber(),
            disableMutation: true,
            showClearIcon: true,
            disableCheckBox: true,
            state: 0
          };
        });
        this.mutationdefintionList = [...updateDefinitionList];
        const selectedDefinitionIndex=  this.mutationdefintionList.findIndex(x=>x.mutationType?.codeId == selectedDefinition?.mutationType?.codeId);
        if(mutationDefintion.length>0){

          this.mutationdefintionList[selectedDefinitionIndex].SelectedRow = true;
          this.mutationdefintionList[selectedDefinitionIndex].disableCheckBox = false;
        }
       

        this.commonrateCriteria = this.mutationdefintionList[selectedDefinitionIndex].rateAdaptationCriterionList.map((x: RateAdaptationCriterionDto) => {
          return { ...x, isSelected: false };
        });

        const updatedDropdown = this.mutationdefintionList.map((data: MutationDefinitionDto) => {
          this.commonUpdatedDropdown = this.mutationType;
          this.commonRateDropdown = this.rateSelectionDateTypeList;
          return { ...data, mutationTypeList: this.commonUpdatedDropdown, rateSelectionDateTypeList: this.commonRateDropdown };
        });
        this.mutationdefintionList = [...updatedDropdown];
        if(this.mutationdefintionList.length > 0){
          this.mutationData.rateAdaptationCriterionList = this.mutationdefintionList[selectedDefinitionIndex].rateAdaptationCriterionList;
          this.higlightData = this.mutationdefintionList[selectedDefinitionIndex];
        }else{
          this.hidemissingDocCard= true;
        }
       
        /*MutationReason  Update */
        const updateResponseReasonList = data.mutationReasonList.map((data: any) => {
          const missingDocConfig = data.missingDocumentConfigList.map((x: any) => {
            return { ...x, state: 0 };
          });
          const requiredConfig = data.requiredActionConfigList.map((x: any) => {
            return { ...x, state: 0 };
          });
          return {
            ...data,
            SelectedRow: false,
            randomNumber: this.generateRandomNumber(),
            state: 0,
            missingDocumentConfigList: missingDocConfig,
            requiredActionConfigList: requiredConfig
          };
        });

        this.mutationReasonList = [...updateResponseReasonList];
        const selectedReasonIndex=  this.mutationReasonList.findIndex(x=>x.mutationReasonName?.codeId == selectedReason?.mutationReasonName?.codeId);

        if(this.mutationReasonList.length > 0){
          if(this.mutationReasonList.length>0){
            this.mutationReasonList[selectedReasonIndex].SelectedRow = true;
          }if(this.mutationReasonList[selectedReasonIndex].missingDocumentConfigList.length>0){
            this.mutationReasonList[selectedReasonIndex].missingDocumentConfigList[0].SelectedRow = true;
          }if(this.mutationReasonList[selectedReasonIndex].requiredActionConfigList.length>0){
             this.mutationReasonList[0].requiredActionConfigList[0].SelectedRow = true;
          }
        }else{
          this.hidecheckbox= true;
        }
       
      
        const UpdateReasonDropdown = this.mutationReasonList.map((data: any) => {
          this.commonReasonUpdateDropdown = this.mutationReasonNameList;
          const missingDocUpdate = data.missingDocumentConfigList.map((x: any) => {
            this.commonMissingDocDropdown = this.missingDocNameList;
            return { ...x, missingDocNameList: this.commonMissingDocDropdown, isDeleted: false };
          });

          const requireActionUpdate = data.requiredActionConfigList.map((y: any) => {
            this.commonRequireAction = this.requiredActionList;
            return { ...y, requiredActionList: this.commonRequireAction, isDeleted: false };
          });

          return {
            ...data,
            mutationReasonNameList: this.commonReasonUpdateDropdown,
            missingDocumentConfigList: missingDocUpdate,
            requiredActionConfigList: requireActionUpdate
          };
        });
        this.mutationReasonList = [...UpdateReasonDropdown];
        if(this.mutationReasonList.length > 0){
          this.mutationdetails.missingDocumentConfigList = this.mutationReasonList[selectedReasonIndex].missingDocumentConfigList;
          this.mutationdetails.requiredActionConfigList = this.mutationReasonList[selectedReasonIndex].requiredActionConfigList;
          this.higlightReasonData = this.mutationReasonList[selectedReasonIndex];
        }
       
      }, err =>{
        if(err?.error?.errorCode){
          this.errorCode = err.error.errorCode;
        }else{
          this.errorCode= 'InternalServiceFault';
        }
        this.spinnerService.setIsLoading(false);
        this.exceptionBox = true;
      })
   
    } else {
      if (!this.mutationForm.valid) {
        this.checkMutationDefintionValid();
      }
      if (this.mutationReasonForm.invalid) {
        if (this.checkValidation()) {
          this.MutationReasonDropdownConfig.externalError = true;
        }
        if (this.checkmissingDoc()) {
          this.MissingDocDropdownConfig.externalError = true;
          this.BlockingTypeDropdownConfig.externalError = true;
        }
        if (this.checkrequiredAction()) {
          this.RequiredActionDropdownConfig.externalError = true;
        }
      }
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  /*Mutation Reason Tab */
  mutationReasonSelect(event: any) {
    if (event) {
      if (!this.mutationReasonForm.invalid || event.SelectedRow) {
        const mutationReason = this.mutationReasonList;
        const prevIndex = mutationReason.findIndex(x => x.SelectedRow);
        const deselectedData = this.deselectMutationReason(mutationReason);
        this.mutationReasonList[prevIndex].SelectedRow = deselectedData[prevIndex].SelectedRow;
        const Index = this.mutationReasonList.findIndex(x => x.randomNumber == event.randomNumber);
        this.mutationReasonList[Index].SelectedRow = true;
        if (this.mutationReasonList[Index].missingDocumentConfigList.length > 0) {
          this.mutationReasonList[Index].missingDocumentConfigList[0].SelectedRow = true;
        }
        if (this.mutationReasonList[Index].requiredActionConfigList.length > 0) {
          this.mutationReasonList[Index].requiredActionConfigList[0].SelectedRow = true;
        }
          this.higlightReasonData = this.mutationReasonList[Index];
        this.mutationdetails.missingDocumentConfigList = this.mutationReasonList[Index].missingDocumentConfigList;
        this.mutationdetails.requiredActionConfigList = this.mutationReasonList[Index].requiredActionConfigList;
      } else if (this.mutationReasonForm.invalid || !event.isSelected) {
        if (this.checkValidation()) {
          this.MutationReasonDropdownConfig.externalError = true;
        }
        if (this.checkmissingDoc()) {
          this.MissingDocDropdownConfig.externalError = true;
          this.BlockingTypeDropdownConfig.externalError = true;
        }
        if (this.checkrequiredAction()) {
          this.RequiredActionDropdownConfig.externalError = true;
        }
      }
    }
  }
 
  /*Add New Row in MutationReason  Grid */
  addMutationReason() {
    if (!this.mutationReasonForm.invalid) {
      const mutationReasonList = [...this.mutationReasonList];
      if(mutationReasonList.length >0){
        const prevIndex = mutationReasonList.findIndex(x => x.SelectedRow);
        const deselectedData = this.deselectMutationReason(mutationReasonList);
        this.mutationReasonList[prevIndex].SelectedRow = deselectedData[prevIndex].SelectedRow;
      }
      

      this.commonReasonUpdateDropdown = this.mutationReasonNameList.filter(val => {
        return !mutationReasonList.find(x => {
          return x.mutationReasonName?.codeId == val?.codeId;
        });
      });

      const newmutationReasonData = new MutationReasonConfigDto();
      newmutationReasonData.isReadOnly = true;
      newmutationReasonData.SelectedRow = true;
      newmutationReasonData.state = DtoState.Created;
      newmutationReasonData.disableReason = false;

      newmutationReasonData.mutationReasonNameList = this.commonReasonUpdateDropdown;
      newmutationReasonData.randomNumber = this.generateRandomNumber();
      newmutationReasonData.missingDocumentConfigList = [];
      newmutationReasonData.requiredActionConfigList = [];
      this.mutationReasonList.push({ ...newmutationReasonData });
      this.mutationdetails.missingDocumentConfigList = [];
      this.mutationdetails.requiredActionConfigList = [];
      this.higlightReasonData = this.mutationReasonList[this.mutationReasonList.length-1];
      this.MutationReasonDropdownConfig.externalError = false;
      this.hidemissingDocCard= false;
    } else {
      if (this.checkValidation()) {
        this.MutationReasonDropdownConfig.externalError = true;
      }
      if (this.checkmissingDoc()) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
      }
      if (this.checkrequiredAction()) {
        this.RequiredActionDropdownConfig.externalError = true;
      }
    }
  }

  /* MutationReason Dropdown Change */
  onmutationReasonChange(event: any) {
    const activeIndex = this.mutationReasonList.findIndex(x => x.SelectedRow);
    if (this.mutationReasonList[activeIndex].state == DtoState.Created) {
      this.mutationReasonList[activeIndex].mutationReasonName = event.value;
      this.mutationReasonList[activeIndex].disableReason = true;
    } else if (this.mutationReasonList[activeIndex].state != DtoState.Created) {
      this.mutationReasonList[activeIndex].state = DtoState.Dirty;
      this.mutationReasonList[activeIndex].mutationReasonName = event.value;
      this.mutationReasonList[activeIndex].disableReason = true;
    }
  }
    /* MutationReason Delete in Grid*/
  onMutationreasonDelete(event: MutationReasonConfigDto, mutationReasonList: MutationReasonConfigDto[]) {
    if (!this.mutationReasonForm.invalid || event.SelectedRow) {
      const mutationReasonData = [...mutationReasonList];
      const deleteIndex = mutationReasonData.findIndex((mutationReason: MutationReasonConfigDto) => {
        return mutationReason.randomNumber == event.randomNumber;
      });

      if (deleteIndex >= 0) {
        if (mutationReasonData[deleteIndex].state == 1) {
          event.mutationReasonName = <CodeTableDto>{};
          this.RemoveErrors();

          setTimeout(() => {
            this.onMutationReasonSplice(mutationReasonData, deleteIndex);
          }, 100);
        } else {
          mutationReasonData[deleteIndex].state = 4;
          this.deletedArray.mutationReasonList.push({ ...mutationReasonData[deleteIndex] });

          event.mutationReasonName = <CodeTableDto>{};
          this.RemoveErrors();

          setTimeout(() => {
            this.onMutationReasonSplice(mutationReasonData, deleteIndex);
          }, 100);
        }
      }
    } else {
      if (this.checkValidation()) {
        this.MutationReasonDropdownConfig.externalError = true;
      }
      if (this.checkmissingDoc()) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
      }
      if (this.checkrequiredAction()) {
        this.RequiredActionDropdownConfig.externalError = true;
      }
    }
  }

  onMutationReasonSplice(mutationReasonData: any, deleteIndex: number) {
    mutationReasonData.splice(deleteIndex, 1);

    if (mutationReasonData.length > 0) {
      this.mutationReasonList = this.deselectMutationReason(mutationReasonData);
      this.mutationReasonList[0].SelectedRow = true;
      this.higlightReasonData = this.mutationReasonList[0];
      this.mutationdetails.missingDocumentConfigList = this.mutationReasonList[0].missingDocumentConfigList;
      this.mutationdetails.requiredActionConfigList = this.mutationReasonList[0].requiredActionConfigList;
    }else{
      this.mutationReasonList = this.deselectMutationReason(mutationReasonData);
      this.hidemissingDocCard= true;
    }
  }

  /*AddNew Row in MissingDocument Config Grid */
  addMissingDoc() {
    if (!this.mutationReasonForm.invalid) {
      this.MissingDocDropdownConfig.externalError = false;
      this.BlockingTypeDropdownConfig.externalError = false;

      const mutationReasonList = [...this.mutationReasonList];
      const SelectedIndex = mutationReasonList.findIndex(x => x.SelectedRow);
      if (mutationReasonList[SelectedIndex].missingDocumentConfigList.length > 0) {
        const missingDocPrevIndex = mutationReasonList[SelectedIndex].missingDocumentConfigList.findIndex(x => x.SelectedRow);

        mutationReasonList[SelectedIndex].missingDocumentConfigList = this.deselectMutationMissingDoc(
          mutationReasonList[SelectedIndex].missingDocumentConfigList
        );
        this.mutationdetails.missingDocumentConfigList[missingDocPrevIndex].SelectedRow =
          mutationReasonList[SelectedIndex].missingDocumentConfigList[missingDocPrevIndex].SelectedRow;
      }

      this.commonMissingDoc = this.missingDocNameList.filter(val => {
        return !mutationReasonList[SelectedIndex].missingDocumentConfigList.find(x => {
          if (!x.isDeleted) {
            return x.missingDocName?.codeId == val?.codeId;
          }
          return false;
        });
      });

      const missingDocData = new MissingDocumentDto();
      missingDocData.isReadOnly = true;
      missingDocData.SelectedRow = true;
      missingDocData.state = DtoState.Created;
      missingDocData.isDeleted = false;
      missingDocData.disableMissingDoc = false;
      missingDocData.blockingTypeList = [...this.blockingTypeList];
      missingDocData.missingDocNameList = [...this.commonMissingDoc];
      this.mutationReasonList[SelectedIndex].missingDocumentConfigList.push({ ...missingDocData });
      if(this.mutationReasonList[SelectedIndex].state != 1){
        this.mutationReasonList[SelectedIndex].state =3
      } 
      this.mutationdetails.missingDocumentConfigList = this.mutationReasonList[SelectedIndex].missingDocumentConfigList;
    } else {
      if (this.checkValidation()) {
        this.MutationReasonDropdownConfig.externalError = true;
      }
      if (this.checkmissingDoc()) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
      }
      if (this.checkrequiredAction()) {
        this.RequiredActionDropdownConfig.externalError = true;
      }
    }
  }

   /*MissingDocument Name Dropdown Change */
  onMissingDocChange(event: any,index:number) {
    const ReasonIndex = this.mutationReasonList.findIndex(x => x?.SelectedRow);
    const missingDocList = this.mutationReasonList[ReasonIndex].missingDocumentConfigList;
    const MissingIndex = missingDocList.findIndex(x => x.SelectedRow);
    const updatedMissingDocList = this.deselectMutationMissingDoc(missingDocList);
    this.mutationReasonList[ReasonIndex].missingDocumentConfigList[MissingIndex].SelectedRow =
      updatedMissingDocList[MissingIndex].SelectedRow;
    this.mutationdetails.missingDocumentConfigList[MissingIndex].SelectedRow = updatedMissingDocList[MissingIndex].SelectedRow;
    
    if (event.value) {
      
      if (this.mutationReasonList[ReasonIndex].state == DtoState.Created) {
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].missingDocName = event.value;
        this.mutationReasonList[ReasonIndex].state = DtoState.Created;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].state = DtoState.Created;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].disableMissingDoc = true;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].SelectedRow = true;
      } else {
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].missingDocName = event.value;
        this.mutationReasonList[ReasonIndex].state = DtoState.Dirty;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].state = DtoState.Dirty;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].disableMissingDoc = true;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[index].SelectedRow = true;
      }
      this.mutationdetails.missingDocumentConfigList[index] = this.mutationReasonList[ReasonIndex].missingDocumentConfigList[MissingIndex];
    }
  }

  
 /*BlockingType Dropdown Change */
  onBlockingTypeChange(event: any, rowData: any, Index: number) {
    const ReasonIndex = this.mutationReasonList.findIndex(x => x?.SelectedRow);
    const missingDocList = this.mutationReasonList[ReasonIndex].missingDocumentConfigList;
    const MissingIndex = missingDocList.findIndex(x => x.SelectedRow);
    const updatedMissingDocList = this.deselectMutationMissingDoc(missingDocList);
    this.mutationReasonList[ReasonIndex].missingDocumentConfigList[MissingIndex].SelectedRow =
      updatedMissingDocList[MissingIndex].SelectedRow;
    this.mutationdetails.missingDocumentConfigList[MissingIndex].SelectedRow = updatedMissingDocList[MissingIndex].SelectedRow;

    if (event.value) {
      if (this.mutationReasonList[ReasonIndex].state == DtoState.Created) {
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].blockingType = event.value;
        this.mutationReasonList[ReasonIndex].state = DtoState.Created;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].state = DtoState.Created;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].SelectedRow = true;
      } else {
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].blockingType = event.value;
        this.mutationReasonList[ReasonIndex].state = DtoState.Dirty;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].state = DtoState.Dirty;
        this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index].SelectedRow = true;
      }
      this.mutationdetails.missingDocumentConfigList[Index] = this.mutationReasonList[ReasonIndex].missingDocumentConfigList[Index];
    } else {
      if (this.checkValidation()) {
        this.MutationReasonDropdownConfig.externalError = true;
      }
      if (this.checkmissingDoc()) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
      }
      if (this.checkrequiredAction()) {
        this.RequiredActionDropdownConfig.externalError = true;
      }
    }
  }

 /*MissingDocument Config Row  Select Function */
  onMissingDocSelect(event: any) {
    if (event) {
      if (!this.mutationReasonForm.invalid || event.SelectedRow) {
        console.log();
      } else {
        if (this.checkValidation()) {
          this.MutationReasonDropdownConfig.externalError = true;
        }
        if (this.checkmissingDoc()) {
          this.MissingDocDropdownConfig.externalError = true;
          this.BlockingTypeDropdownConfig.externalError = true;
        }
        if (this.checkrequiredAction()) {
          this.RequiredActionDropdownConfig.externalError = true;
        }
      }
    }
  }

 /*MissingDocument Config Row  Delete */
  onMissingDocDelete(event: any) {
    let isNullCheck = false;
    const mutationData = [...this.mutationReasonList];

    const findMutationSelectedIndex = mutationData.findIndex(x => x.SelectedRow);
    const findMissingDocIndex = mutationData[findMutationSelectedIndex]?.missingDocumentConfigList.findIndex(x => x.SelectedRow);
    for (let i = 0; i < mutationData[findMutationSelectedIndex].missingDocumentConfigList.length; i++) {
      if (
        !mutationData[findMutationSelectedIndex].missingDocumentConfigList[i].missingDocName ||
        mutationData[findMutationSelectedIndex].missingDocumentConfigList[i].missingDocName == <CodeTableDto>{}
      ) {
        isNullCheck = true;
        break;
      }
    }
    if (isNullCheck) {
      if (event.missingDocName && event.blockingType) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
        return;
      }
    }

    const deleteIndex = mutationData[findMutationSelectedIndex]?.missingDocumentConfigList.findIndex(
      x => x.missingDocName == event.missingDocName
    );

    if (deleteIndex >= 0) {
      if (mutationData[findMutationSelectedIndex].missingDocumentConfigList[deleteIndex].state == DtoState.Created) {
        event.missingDocName = <CodeTableDto>{};
        event.blockingType = <CodeTableDto>{};
        setTimeout(() => {
          this.spliceMissingDoc(mutationData[findMutationSelectedIndex].missingDocumentConfigList, deleteIndex, findMutationSelectedIndex);
        }, 100);
      } else {
        mutationData[findMutationSelectedIndex].missingDocumentConfigList[deleteIndex].state = DtoState.Deleted;
        mutationData[findMutationSelectedIndex].state = DtoState.Dirty;
        event.missingDocName = <CodeTableDto>{};
        event.blockingType = <CodeTableDto>{};
        setTimeout(() => {
          this.spliceMissingDoc(mutationData[findMutationSelectedIndex].missingDocumentConfigList, deleteIndex, findMutationSelectedIndex);
        }, 100);
      }
    }
  }
  spliceMissingDoc(missingDocData: MissingDocumentDto[], deleteIndex: number, mutationReasonIndex: number) {
    missingDocData[deleteIndex].isDeleted = true;
    this.mutationReasonList[mutationReasonIndex].missingDocumentConfigList = this.deselectMutationMissingDoc(missingDocData);
    this.mutationReasonList[mutationReasonIndex].missingDocumentConfigList[0].SelectedRow = true;
    missingDocData[0].SelectedRow = true;
    this.mutationdetails.missingDocumentConfigList = missingDocData;
  }

  /*Add New Row in RequiredAction */
  addNewRequiredAction() {
    if (!this.mutationReasonForm.invalid) {
      this.RequiredActionDropdownConfig.externalError = false;

      const mutationReasonList = [...this.mutationReasonList];
      const SelectedIndex = mutationReasonList.findIndex(x => x.SelectedRow);
      if (mutationReasonList[SelectedIndex].requiredActionConfigList.length > 0) {
        const missingDocPrevIndex = mutationReasonList[SelectedIndex].requiredActionConfigList.findIndex(x => x.SelectedRow);
        mutationReasonList[SelectedIndex].requiredActionConfigList = this.deselectRequiredActionList(
          mutationReasonList[SelectedIndex].requiredActionConfigList
        );
        this.mutationdetails.requiredActionConfigList[missingDocPrevIndex].SelectedRow =
          mutationReasonList[SelectedIndex].requiredActionConfigList[missingDocPrevIndex].SelectedRow;
      }

      this.commonRequireAction = this.requiredActionList.filter(val => {
        return !mutationReasonList[SelectedIndex].requiredActionConfigList.find(x => {
          if (!x.isDeleted) {
            return x.requiredAction?.codeId == val.codeId;
          }
          return false;
        });
      });

      const requiredActionData = new RequiredActionDto();
      requiredActionData.isReadOnly = true;
      requiredActionData.SelectedRow = true;
      requiredActionData.state = DtoState.Created;
      requiredActionData.isDeleted = false;
      requiredActionData.disableRequiredAction = false;
      requiredActionData.requiredActionList = [...this.commonRequireAction];

      this.mutationReasonList[SelectedIndex].requiredActionConfigList.push({ ...requiredActionData });
      if(this.mutationReasonList[SelectedIndex].state != 1){
        this.mutationReasonList[SelectedIndex].state =3
      } 
      this.mutationdetails.requiredActionConfigList = this.mutationReasonList[SelectedIndex].requiredActionConfigList;
    } else {
      if (this.checkValidation()) {
        this.MutationReasonDropdownConfig.externalError = true;
      }
      if (this.checkmissingDoc()) {
        this.MissingDocDropdownConfig.externalError = true;
        this.BlockingTypeDropdownConfig.externalError = true;
      }
      if (this.checkrequiredAction()) {
        this.RequiredActionDropdownConfig.externalError = true;
      }
    }
  }

  /*Required Action Dropdown Change in MutationReason */
  requiredActionChange(event: any) {
    if (event.value) {
      const Index = this.mutationReasonList.findIndex(x => x?.SelectedRow);
      const requiredActionIndex = this.mutationReasonList[Index].requiredActionConfigList.findIndex(x => x?.SelectedRow);
      if (this.mutationReasonList[Index].state == DtoState.Created) {
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].requiredAction = event.value;
        this.mutationReasonList[Index].state =  DtoState.Created;
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].state =  DtoState.Created;
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].disableRequiredAction = true;
      } else {
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].requiredAction = event.value;
        this.mutationReasonList[Index].state =  DtoState.Dirty;
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].state = DtoState.Dirty;
        this.mutationReasonList[Index].requiredActionConfigList[requiredActionIndex].disableRequiredAction = true;
      }
      this.mutationdetails.requiredActionConfigList = this.mutationReasonList[Index].requiredActionConfigList;
    }
  }

  /*Required Action Select in Mutation Reason */
  onrequiredActionSelect(event: any) {
    if (event) {
      if (!this.mutationReasonForm.invalid || event.SelectedRow) {
        event.SelectedRow = true;
      } else {
        if (this.checkValidation()) {
          this.MutationReasonDropdownConfig.externalError = true;
        }
        if (this.checkmissingDoc()) {
          this.MissingDocDropdownConfig.externalError = true;
          this.BlockingTypeDropdownConfig.externalError = true;
        }
        if (this.checkrequiredAction()) {
          this.RequiredActionDropdownConfig.externalError = true;
        }
      }
    }
  }

  /*Required Action Delete in Mutation Reason */
  onRequiredActionDelete(event: RequiredActionDto) {
    let isNullCheck = false;

    const mutationData = [...this.mutationReasonList];
    const findMutationSelectedIndex = mutationData.findIndex(x => x.SelectedRow);
    const findRequiredActionIndex = mutationData[findMutationSelectedIndex]?.requiredActionConfigList.findIndex(x => x.SelectedRow);

    for (let i = 0; i < mutationData[findMutationSelectedIndex].requiredActionConfigList.length; i++) {
      if (
        !mutationData[findMutationSelectedIndex].requiredActionConfigList[i].requiredAction ||
        mutationData[findMutationSelectedIndex].requiredActionConfigList[i].requiredAction == <CodeTableDto>{}
      ) {
        isNullCheck = true;
        break;
      }
    }

    if (isNullCheck) {
      if (event.requiredAction) {
        this.RequiredActionDropdownConfig.externalError = true;
        return;
      }
    }

    const deleteIndex = mutationData[findMutationSelectedIndex]?.requiredActionConfigList.findIndex(
      x => x.requiredAction == event.requiredAction
    );

    if (deleteIndex >= 0) {
      if (mutationData[findMutationSelectedIndex].requiredActionConfigList[deleteIndex].state == DtoState.Created) {
        event.requiredAction = <CodeTableDto>{};
        setTimeout(() => {
          this.splicerequiredAction(
            mutationData[findMutationSelectedIndex].requiredActionConfigList,
            deleteIndex,
            findMutationSelectedIndex
          );
        }, 100);
      } else {
        mutationData[findMutationSelectedIndex].requiredActionConfigList[deleteIndex].state = DtoState.Deleted;
        mutationData[findMutationSelectedIndex].state = DtoState.Dirty;
        event.requiredAction = <CodeTableDto>{};
        setTimeout(() => {
          this.splicerequiredAction(
            mutationData[findMutationSelectedIndex].requiredActionConfigList,
            deleteIndex,
            findMutationSelectedIndex
          );
        }, 100);
      }
    }
  }

  splicerequiredAction(requiredActionData: RequiredActionDto[], deleteIndex: number, mutationReasonIndex: number) {
    requiredActionData[deleteIndex].isDeleted = true;
    this.mutationReasonList[mutationReasonIndex].requiredActionConfigList = this.deselectRequiredActionList(requiredActionData);
    this.mutationReasonList[mutationReasonIndex].requiredActionConfigList[0].SelectedRow = true;
    requiredActionData[0].SelectedRow = true;
    this.mutationdetails.requiredActionConfigList = requiredActionData;
  }

  deselectMutationReason(mutationReason: MutationReasonConfigDto[]) {
    const deSelectData = mutationReason;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: MutationReasonConfigDto) => {
            return {
              ...x,
              SelectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }
  deselectMutationMissingDoc(missingDoc: MissingDocumentDto[]) {
    const deSelectData = missingDoc;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: MissingDocumentDto) => {
            return {
              ...x,
              SelectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }
  deselectRequiredActionList(requiredAction: RequiredActionDto[]) {
    const deSelectData = requiredAction;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: RequiredActionDto) => {
            return {
              ...x,
              SelectedRow: false
            };
          })
        : [];
    return updateDeselect;
  }

  checkValidation() {
    for (let i = 0; i < this.mutationReasonList.length; i++) {
      if (!this.mutationReasonList[i].mutationReasonName || this.mutationReasonList[i].mutationReasonName == <CodeTableDto>{}) {
        return true;
      }
    }
    return false;
  }

  checkmissingDoc() {
    if (this.mutationdetails?.missingDocumentConfigList.length > 0) {
      for (let i = 0; i < this.mutationdetails?.missingDocumentConfigList.length; i++) {
        if (
          !this.mutationdetails.missingDocumentConfigList[i].missingDocName ||
          !this.mutationdetails.missingDocumentConfigList[i].blockingType ||
          this.mutationdetails.missingDocumentConfigList[i].missingDocName == <CodeTableDto>{} ||
          this.mutationdetails.missingDocumentConfigList[i].missingDocName == <CodeTableDto>{}
        ) {
          return true;
        }
      }
    }
    return false;
  }

  checkrequiredAction() {
    if (this.mutationdetails?.requiredActionConfigList.length > 0) {
      for (let i = 0; i < this.mutationdetails?.requiredActionConfigList.length; i++) {
        if (
          !this.mutationdetails.requiredActionConfigList[i].requiredAction ||
          this.mutationdetails.requiredActionConfigList[i].requiredAction == <CodeTableDto>{}
        ) {
          return true;
        }
      }
    }

    return false;
  }
  checkMutationDefintionValid() {
    this.mutationdefintionList.map(x => {
      if (!x.mutationType || x.mutationType === <CodeTableDto>{}) {
        this.MutationTypeDropdownConfig.externalError = true;
      }
      if (!x.rateSelectionDateType || x.rateSelectionDateType === <CodeTableDto>{}) {
        this.RateSelectionDropdownConfig.externalError = true;
      }
    });
  }

  RemoveErrors() {

    const Index4 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('product.ManageMutation.validationError.MutationRes') +
      this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index4 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index4, 1);
    }

    const Index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('product.ManageMutation.validationError.MissingDocName') +  this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
    }

    const Index1 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('product.ManageMutation.validationError.BlockingType') +  this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index1 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index1, 1);
    }

    const Index2 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage == this.translate.instant('product.ManageMutation.validationError.RequiredAction') + this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index2 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index2, 1);
    }
  }

  RemoveMutationDefErrors() {
    const Index = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage ==  this.translate.instant('product.ManageMutation.validationError.MutationType') +
      this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index, 1);
    }

    const Index1 = this.validationService.FluidBaseValidationService.ValidationErrorList.findIndex(
      x => x.ErrorMessage ==  this.translate.instant('product.ManageMutation.validationError.RateSelectionDate') +
      this.translate.instant('product.ManageMutation.validationError.required')
    );
    if (Index1 >= 0) {
      this.validationService.FluidBaseValidationService.ValidationErrorList.splice(Index1, 1);
    }

  }

  onClose() {
    
    const isChangedIndexExist = this.mutationdefintionList.findIndex(x => x.state == 3 || x.state == 1);
    const isreasonIndexChanged = this.mutationReasonList.findIndex(x=>x.state == 3 || x.state ==1);

    if (isChangedIndexExist >= 0 || isreasonIndexChanged >= 0 ||
       this.deletedArray.mutationDefinitionList.length > 0 ||
        this.deletedArray.mutationReasonList.length > 0  && (
          !this.mutationReasonForm.invalid && this.mutationForm.valid) ) {
      this.showDialog = true;
    } else {
      this.router.navigate([''], { relativeTo: this.activatedRoute });
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(mutationDefintion: MutationDefinitionDto[], mutationReason: MutationReasonConfigDto[]) {
    this.showDialog = false;
    if (!this.mutationReasonForm.invalid && this.mutationForm.valid){
      this.onSave(mutationDefintion, mutationReason);
      this.router.navigate([''], { relativeTo: this.activatedRoute });
    }else{
      if (!this.mutationForm.valid) {
        this.checkMutationDefintionValid();
      }
      if (this.mutationReasonForm.invalid) {
        if (this.checkValidation()) {
          this.MutationReasonDropdownConfig.externalError = true;
        }
        if (this.checkmissingDoc()) {
          this.MissingDocDropdownConfig.externalError = true;
          this.BlockingTypeDropdownConfig.externalError = true;
        }
        if (this.checkrequiredAction()) {
          this.RequiredActionDropdownConfig.externalError = true;
        }
      }
    }
    
  }

  onDialogNo() {
    this.showDialog = false;
    this.RemoveErrors();
    this.RemoveMutationDefErrors();
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }
}

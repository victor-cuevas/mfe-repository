import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-collection-measure-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import {
  ErrorDto,
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { CodeTableDtoBase } from './Models/code-tableDto.model';
import { CollectionMeasuresConfigDto } from './Models/collection-measure-configDto.model';
import { CollectionMeasureType2DossierStatusDto } from './Models/collection-measure-dossier-statusDto.model';
import { DossierStatusDto } from './Models/dossier-statusDto.model';
import { DtoState } from './Models/dtoBase.model';
import { CollectionMeasureConfigService } from './Services/collection-measure-config.service';
@Component({
  selector: 'mcmc-collection-measure-config',
  templateUrl: './collection-measure-config.component.html',
  styleUrls: ['./collection-measure-config.component.scss']
})
export class CollectionMeasureConfigComponent implements OnInit {
  @ViewChild('collectionMeasureform', { static: true }) collectionMeasureform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredDropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredElapsedPeriod : FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  collectionMeasureHeader!: any[];
  dataSelected: any;
  type!: string;
  startEvent!: string;
  stopEvent!: string;
  createEvent!: string;
  isRole!: boolean;
  simulation!: boolean;

  caption!: string;
  placeholder = 'Select';
  errorCode !: string;

  collectionMeasureConfigList: CollectionMeasuresConfigDto[] = [];
  collectionMeasureConfigData: CollectionMeasuresConfigDto = new CollectionMeasuresConfigDto();
  followUpEventList: CodeTableDtoBase[] = [];
  dossierList: DossierStatusDto[] = [];
  collectionMeasureTypeList: CodeTableDtoBase[] = [];
  intervalTypeMeasureTypeList: CodeTableDtoBase[]=[];
  highlightCollectionMeaasure: CollectionMeasuresConfigDto = new CollectionMeasuresConfigDto();

  targetList: DossierStatusDto[] = [];
  source: DossierStatusDto[] = [];
  target: DossierStatusDto[] = [];
  sourceCaption: any[] = [];
  targetCaption: any[] = [];
  deletedArray: CollectionMeasuresConfigDto[] = [];

  showDialog!: boolean;
  exceptionBox!: boolean;
  validationHeader!: string;
  showCheckBox!: boolean;
  hideCard = true;

  dossierError!: string;
  businessError!: string;
  navigateURL: any;
  elapsedPeriodDto: ErrorDto[]=[];
  intMaxValue = 2147483647;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public collectionMeasureService: CollectionMeasureConfigService,
    public spinnerService: SpinnerService,
    public fluidValidation: fluidValidationService,
    public commonService: ConfigContextService
  ) {
    this.validationHeader = this.translate.instant('collectionMeasure.validations.Header');
    this.dossierError = this.translate.instant('collectionMeasure.ValidationError.DossierBusinessError');
    this.businessError = this.translate.instant('collectionMeasure.ValidationError.BusinessValidation');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.followUpEventList = data.followUpEventNameList;
      this.dossierList = data.dossierStatusList;
      this.collectionMeasureTypeList = data.collectionMeasureTypeList;
      this.intervalTypeMeasureTypeList = data.intervalTypeList
      const updateCollectionList = data.collectionMeasureList.map((x: CollectionMeasuresConfigDto) => {
        return { ...x, isSelected: false, randomNumber: this.generateRandomNumber() };
      });

      if (updateCollectionList.length > 0) {
        updateCollectionList[0].isSelected = true;
        this.collectionMeasureConfigList = [...updateCollectionList];
        this.collectionMeasureConfigData = this.collectionMeasureConfigList[0];
        this.highlightCollectionMeaasure = this.collectionMeasureConfigList[0];
        if (this.collectionMeasureConfigList[0].type?.codeId == 3) {
          this.showCheckBox = true;
        } else {
          this.showCheckBox = false;
        }
        this.assigningSourceTarget(0);
      } else {
        this.hideCard = false;
      }
    });

    this.collectionMeasureHeader = [
      { header: this.translate.instant('collectionMeasure.tabel.type'), field: 'type.caption', width: '95%' },
      { header: this.translate.instant('collectionMeasure.tabel.delete'), field: '', fieldType: 'deleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const TypeError = new ErrorDto();
    TypeError.validation = 'required';
    TypeError.isModelError = true;
    TypeError.validationMessage =
      this.translate.instant('collectionMeasure.ValidationError.collectionMeasureType') +
      this.translate.instant('collectionMeasure.ValidationError.required');
    this.RequiredDropdownConfig.required = true;
    this.RequiredDropdownConfig.Errors = [TypeError];

    const maxValValidation = new ErrorDto();
    maxValValidation.validation = 'maxError';
    maxValValidation.isModelError = true;
    maxValValidation.validationMessage = this.translate.instant('collectionMeasure.ValidationError.numberInt32Check');
    this.elapsedPeriodDto = [maxValValidation];
    this.RequiredElapsedPeriod.maxValueValidation = this.translate.instant('collectionMeasure.ValidationError.InputIncorrect');

  }

  onAdd() {
    if (this.collectionMeasureform.valid) {
      if (!this.emptyDossierExist() && !this.isDuplicateCollectionTypeExists(this.collectionMeasureConfigList)) {
        this.RemoveBusinessError(this.dossierError);
        this.RemoveBusinessError(this.businessError);

        if (this.collectionMeasureConfigList.length == 0) {
          this.hideCard = true;
        }
        this.showCheckBox = false;
        let updateCollectionList = [...this.collectionMeasureConfigList];
        updateCollectionList = this.rowDeselectData(updateCollectionList);
        this.collectionMeasureConfigData = new CollectionMeasuresConfigDto();
        this.collectionMeasureConfigData.collectionMeasureType2DossierStatusList = [];
        updateCollectionList.push({
          ...this.collectionMeasureConfigData,
          randomNumber: this.generateRandomNumber(),
          isPartyMeasure:false,
          isSelected: true,
          state: 1
        });
        this.collectionMeasureConfigList = [...updateCollectionList];
        this.collectionMeasureform.resetForm();
        this.removeCollectionMeasureError();

        const SelectedIndex = this.collectionMeasureConfigList.findIndex(x => x.isSelected);
        if (SelectedIndex >= 0) {
          this.assigningSourceTarget(SelectedIndex);
        }

        this.highlightCollectionMeaasure = this.collectionMeasureConfigList[SelectedIndex];
      } else {
        if (this.emptyDossierExist()) {
          this.throwBusinessError(this.dossierError);
        } else {
          this.throwBusinessError(this.businessError);
        }
      }
    } else {
      this.throwCollectionMeasureError();
    }
  }

  onRowselect(event: CollectionMeasuresConfigDto) {
    if (this.collectionMeasureform.valid || event.isSelected) {
      if ((!this.emptyDossierExist() && !this.isDuplicateCollectionTypeExists(this.collectionMeasureConfigList)) || event.isSelected) {
        this.RemoveBusinessError(this.dossierError);
        this.RemoveBusinessError(this.businessError);

        let updateCollectionData = this.collectionMeasureConfigList;
        const eventIndex = updateCollectionData.findIndex(x => x.isSelected);

        updateCollectionData = this.rowDeselectData(updateCollectionData);

        this.collectionMeasureConfigList[eventIndex].isSelected = updateCollectionData[eventIndex].isSelected;

        const selectedIndex = updateCollectionData.findIndex(x => x.randomNumber == event.randomNumber);

        this.collectionMeasureConfigList[selectedIndex].isSelected = true;
        this.highlightCollectionMeaasure = this.collectionMeasureConfigList[selectedIndex];
        if (this.collectionMeasureConfigList[selectedIndex].type?.codeId == 3) {
          this.showCheckBox = true;
        } else {
          this.showCheckBox = false;
        }
        this.collectionMeasureConfigData = event;
        this.assigningSourceTarget(selectedIndex);
      } else {
        if (this.emptyDossierExist()) {
          this.throwBusinessError(this.dossierError);
        } else {
          this.throwBusinessError(this.businessError);
        }
      }
    } else {
      this.throwCollectionMeasureError();
    }
  }

  rowDeselectData(collectionConfigData: CollectionMeasuresConfigDto[]) {
    const deSelectData = collectionConfigData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: CollectionMeasuresConfigDto) => {
            return {
              ...x,
              isSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onRowDelete(event: any) {
    if (this.collectionMeasureform.valid || event.isSelected) {
      if ((!this.emptyDossierExist() && !this.isDuplicateCollectionTypeExists(this.collectionMeasureConfigList)) || event.isSelected) {
        const CollectionListData = [...this.collectionMeasureConfigList];

        const todeleteIndex = CollectionListData.findIndex((data: CollectionMeasuresConfigDto) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != CollectionListData.length - 1) {
          if (CollectionListData[todeleteIndex].state == 1) {
            CollectionListData.splice(todeleteIndex, 1);
            this.removeCollectionMeasureError();
            this.RemoveBusinessError(this.dossierError);
            this.RemoveBusinessError(this.businessError);
          } else {
            CollectionListData[todeleteIndex].state = 4;
            CollectionListData[todeleteIndex].collectionMeasureType2DossierStatusList =
              this.deleteDossierStatus(CollectionListData[todeleteIndex].collectionMeasureType2DossierStatusList)
            this.deletedArray.push({ ...CollectionListData[todeleteIndex] });
            CollectionListData.splice(todeleteIndex, 1);
            this.removeCollectionMeasureError();
            this.RemoveBusinessError(this.dossierError);
            this.RemoveBusinessError(this.businessError);
          }

          if (CollectionListData.length > 0) {
            this.collectionMeasureConfigList = this.rowDeselectData(CollectionListData);
            this.collectionMeasureConfigList[0].isSelected = true;
            this.collectionMeasureConfigData = this.collectionMeasureConfigList[0];
            this.highlightCollectionMeaasure = this.collectionMeasureConfigList[0];
            if (this.collectionMeasureConfigList[0].type?.codeId == 3) {
              this.showCheckBox = true;
            } else {
              this.showCheckBox = false;
            }
            this.assigningSourceTarget(0);
          } else {
            this.collectionMeasureConfigList = [];
            this.collectionMeasureConfigData = new CollectionMeasuresConfigDto();
            this.collectionMeasureConfigData.collectionMeasureType2DossierStatusList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        } else {
          if (CollectionListData[todeleteIndex].state == 1) {
            CollectionListData.splice(todeleteIndex, 1);
            this.removeCollectionMeasureError();
            this.RemoveBusinessError(this.dossierError);
            this.RemoveBusinessError(this.businessError);
          } else {
            CollectionListData[todeleteIndex].state = 4;
            CollectionListData[todeleteIndex].collectionMeasureType2DossierStatusList =
              this.deleteDossierStatus(CollectionListData[todeleteIndex].collectionMeasureType2DossierStatusList)
            this.deletedArray.push({ ...CollectionListData[todeleteIndex] });
            CollectionListData.splice(todeleteIndex, 1);
            this.removeCollectionMeasureError();
            this.RemoveBusinessError(this.dossierError);
            this.RemoveBusinessError(this.businessError);
          }

          if (CollectionListData.length > 0) {
            this.collectionMeasureConfigList = this.rowDeselectData(CollectionListData);
            this.collectionMeasureConfigList[this.collectionMeasureConfigList?.length - 1].isSelected = true;
            const lastIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);

            this.collectionMeasureConfigData = this.collectionMeasureConfigList[lastIndex];
            this.highlightCollectionMeaasure = this.collectionMeasureConfigList[lastIndex];
            if (this.collectionMeasureConfigList[lastIndex].type?.codeId == 3) {
              this.showCheckBox = true;
            } else {
              this.showCheckBox = false;
            }
            this.assigningSourceTarget(lastIndex);
          } else {
            this.collectionMeasureConfigList = [];
            this.collectionMeasureConfigData = new CollectionMeasuresConfigDto();
            this.collectionMeasureConfigData.collectionMeasureType2DossierStatusList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        }
      } else {
        if (this.emptyDossierExist()) {
          this.throwBusinessError(this.dossierError);
        } else {
          this.throwBusinessError(this.businessError);
        }
      }
    } else {
      this.throwCollectionMeasureError();
    }
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.sourceCaption = [];
    this.targetCaption = [];
    this.collectionMeasureConfigList[index].collectionMeasureType2DossierStatusList.forEach(data => {
      if (data.state != 4) {
        const filterIndex = this.dossierList.findIndex(y => {
          return data.dossierStatus.codeId == y.codeId;
        });
        if (filterIndex != -1) {
          this.targetList.push(this.dossierList[filterIndex]);
        }
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.dossierList];
    this.target.forEach((data: DossierStatusDto) => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == data.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];

    this.sourceCaption = this.source.map((x: DossierStatusDto) => {
      return { ...x };
    });

    this.targetCaption = this.target.map((y: DossierStatusDto) => {
      return { ...y };
    });
  }

  changeTarget(event: any) {
    if (event != undefined) {
      const Selectedindex = this.collectionMeasureConfigList.findIndex(get => {
        return get.isSelected == true;
      });

      if (Selectedindex >= 0) {
        this.RemoveBusinessError(this.dossierError);
        if (this.collectionMeasureConfigList[Selectedindex].state != DtoState.Created) {
          this.collectionMeasureConfigList[Selectedindex].state = DtoState.Dirty;
        }

        const filterdossierList: CodeTableDtoBase[] = [];
        event.forEach((x: any) => {
          filterdossierList.push(x);
        });

        let filterData: any[] = [];
        filterData = this.dossierList.filter(val => {
          return filterdossierList.find(x => {
            return x.codeId == val.codeId;
          });
        });

        const oldCollectionMeasureListData =
          this.collectionMeasureConfigList[Selectedindex].collectionMeasureType2DossierStatusList.length > 0
            ? [...this.collectionMeasureConfigList[Selectedindex].collectionMeasureType2DossierStatusList]
            : [];
        const oldCodeIds: any = [];
        oldCollectionMeasureListData.map(codeData => {
          if (codeData?.dossierStatus?.caption) {
            oldCodeIds.push(codeData?.dossierStatus?.codeId);
          }
        });

        const newCodeIds: any = [];
        filterData.map(codeData => {
          if (codeData?.codeId) {
            const oldCodeData: any = {
              refCodeId: codeData.codeId,
              refCodeValue: codeData
            };
            newCodeIds.push(oldCodeData);
          }
        });

        oldCodeIds.map((oldData: any) => {
          const findNewCodeIndex = newCodeIds.findIndex((newId: any) => newId.refCodeId === oldData);
          if (findNewCodeIndex === -1) {
            const getTaxIndex = oldCollectionMeasureListData.findIndex((codeData: any) => codeData?.dossierStatus?.codeId === oldData);
            if (getTaxIndex >= 0) {
              const updateTax = { ...oldCollectionMeasureListData[getTaxIndex] };
              if (updateTax.state === 1) {
                oldCollectionMeasureListData.splice(getTaxIndex, 1);
              } else if (updateTax.state === 0) {
                updateTax.state = 4;
                oldCollectionMeasureListData[getTaxIndex] = updateTax;
              }
            }
          }
        });

        newCodeIds.map((y: any) => {
          const getIndex = oldCodeIds.findIndex((x: any) => x === y.refCodeId);
          //Add Index if it is  new Data
          if (getIndex === -1) {
            const updateTax: any = {
              collectionMeasureType: this.collectionMeasureConfigList[Selectedindex].type,
              dossierStatus: { ...y.refCodeValue },
              state: 1
            };
            oldCollectionMeasureListData.push(updateTax);
          } else {
            //Update if it is Existing Data
            const getTaxIndex = oldCollectionMeasureListData.findIndex(
              (codeData: any) => codeData?.creditProvider?.name?.codeId === y.refCodeId
            );
            if (getTaxIndex >= 0) {
              const updateTax = { ...oldCollectionMeasureListData[getTaxIndex] };
              if (updateTax.state === 4) {
                updateTax.state = 0;
                oldCollectionMeasureListData[getTaxIndex] = updateTax;
              }
            }
          }
        });

        this.collectionMeasureConfigList[Selectedindex].collectionMeasureType2DossierStatusList =
          oldCollectionMeasureListData.length > 0
            ? oldCollectionMeasureListData.map((x: any) => {
                const updatedTaxData = { ...x, dossierStatus: { ...x.dossierStatus } };
                return updatedTaxData;
              })
            : [];
      }
    }
  }

  onTypeChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.type = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].type = updategrid.type;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.type = event.value;

      if (this.collectionMeasureConfigList[selectedIndex].type?.codeId == 3) {
        this.showCheckBox = true;
      } else {
        this.showCheckBox = false;
      }
    } else if (event?.value == null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.type = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].type = null;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.type = null;
      this.RequiredDropdownConfig.externalError = true;
      this.showCheckBox = false;
    }
  }

  onstartEventChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.startEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].startEvent = updategrid.startEvent;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.startEvent = event.value;
    } else if (event?.value == null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.startEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].startEvent = null;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.startEvent = null;
    }
  }
  onstopEventChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.stopEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].stopEvent = updategrid.stopEvent;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.stopEvent = event.value;
    } else if (event?.value == null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.stopEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].stopEvent = null;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.stopEvent = null;
      // this.RequiredTaxCategory.externalError = true;
    }
  }
  onCreateEventChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.creationEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].creationEvent = updategrid.creationEvent;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.creationEvent = event.value;
    } else if (event?.value == null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.creationEvent = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].creationEvent = null;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.creationEvent = null;
      // this.RequiredTaxCategory.externalError = true;
    }
  }
  onRoleChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);

    if (this.collectionMeasureConfigList[selectedIndex].state != DtoState.Created) {
      this.collectionMeasureConfigList[selectedIndex].state = DtoState.Dirty;
    }

    if (event != null) {
      this.collectionMeasureConfigData.isRoleLinkingApplicable = event;
      this.collectionMeasureConfigList[selectedIndex].isRoleLinkingApplicable = event;
    }
  }
  onSimulationChange(event: any) {
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);

    if (this.collectionMeasureConfigList[selectedIndex].state != DtoState.Created) {
      this.collectionMeasureConfigList[selectedIndex].state = DtoState.Dirty;
    }
    if (event != null) {
      this.collectionMeasureConfigData.showSimulation = event;
      this.collectionMeasureConfigList[selectedIndex].showSimulation = event;
    }
  }

  onintervalTypeMeasureTypeChange(event:any){
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);
    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.closeMeasureIntervalType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].closeMeasureIntervalType = updategrid.closeMeasureIntervalType;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.closeMeasureIntervalType = event.value;
    } else if (event?.value == null) {
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.closeMeasureIntervalType = event.value;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].closeMeasureIntervalType = null;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.closeMeasureIntervalType = null;
    }
  }

  onelapsedPeriodChange(event:any){
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);

    if (selectedIndex >= 0  && event != null && event != ''){

      if (+event > this.intMaxValue){
        this.RequiredElapsedPeriod.externalError = true;
      }

      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.elapsedPeriodToCloseMeasure = +event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].elapsedPeriodToCloseMeasure = updategrid.elapsedPeriodToCloseMeasure;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.elapsedPeriodToCloseMeasure = +event;
    }else{
      const updateData = this.collectionMeasureConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.elapsedPeriodToCloseMeasure = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.collectionMeasureConfigList[selectedIndex].elapsedPeriodToCloseMeasure = updategrid.elapsedPeriodToCloseMeasure;
      this.collectionMeasureConfigList[selectedIndex].state = updategrid.state;
      this.collectionMeasureConfigData.elapsedPeriodToCloseMeasure = null;
    }
  }

  onisPartyMeasureChange(event:any){
    const selectedIndex = this.collectionMeasureConfigList.findIndex((x: CollectionMeasuresConfigDto) => x.isSelected);

    if (this.collectionMeasureConfigList[selectedIndex].state != DtoState.Created) {
      this.collectionMeasureConfigList[selectedIndex].state = DtoState.Dirty;
    }

    if (event != null) {
      this.collectionMeasureConfigData.isPartyMeasure = event;
      this.collectionMeasureConfigList[selectedIndex].isPartyMeasure = event;
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onSave(collectionMeasureConfigList: CollectionMeasuresConfigDto[]) {
    if (this.collectionMeasureform.valid) {
      if (!this.emptyDossierExist() && !this.isDuplicateCollectionTypeExists(this.collectionMeasureConfigList)) {
        this.RemoveBusinessError(this.dossierError);
        this.RemoveBusinessError(this.businessError);
        this.removeCollectionMeasureError();

        collectionMeasureConfigList.map(data => {
          if (data.state != 0) {
            this.deletedArray.push({ ...data });
          }
        });

        this.collectionMeasureService.saveCollectionMeasureConfig(this.deletedArray).subscribe(
          data => {
            this.deletedArray = [];
            this.spinnerService.setIsLoading(false);
            if (data) {
              this.collectionMeasureService.getCollectionMeasureConfig().subscribe(
                (responseData: any) => {
                  this.deletedArray = [];
                  this.spinnerService.setIsLoading(false);
                  const updateCollectionList = responseData.map((x: CollectionMeasuresConfigDto) => {
                    return { ...x, isSelected: false, randomNumber: this.generateRandomNumber() };
                  });

                  if (updateCollectionList.length > 0) {
                    this.collectionMeasureConfigList = [...updateCollectionList];
                    const selectedIndex = this.collectionMeasureConfigList.findIndex(
                      x => x.type?.codeId === this.collectionMeasureConfigData.type?.codeId
                    );
                    this.collectionMeasureConfigData = this.collectionMeasureConfigList[selectedIndex];
                    this.highlightCollectionMeaasure = this.collectionMeasureConfigList[selectedIndex];
                    this.collectionMeasureConfigList[selectedIndex].isSelected = true;
                    if (this.collectionMeasureConfigList[selectedIndex].type?.codeId == 3) {
                      this.showCheckBox = true;
                    } else {
                      this.showCheckBox = false;
                    }
                    this.assigningSourceTarget(selectedIndex);
                  } else {
                    this.hideCard = false;
                  }
                },
                err => {
                  if(err?.error?.errorCode){
                    this.errorCode = err.error.errorCode;
                  }else{
                    this.errorCode= 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.deletedArray = [];
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            if(err?.error?.errorCode){
              this.errorCode = err.error.errorCode;
            }else{
              this.errorCode= 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.deletedArray = [];
            this.exceptionBox = true;
          }
        );
      } else {
        if (this.emptyDossierExist()) {
          this.throwBusinessError(this.dossierError);
        } else {
          this.throwBusinessError(this.businessError);
        }
      }
    }
  }

  onClose() {
    const isChangedIndexExist = this.collectionMeasureConfigList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(collectionMeasureList: CollectionMeasuresConfigDto[]) {
    this.showDialog = false;
    if (this.collectionMeasureform.valid) {
      if (!this.emptyDossierExist() && !this.isDuplicateCollectionTypeExists(this.collectionMeasureConfigList)) {
        this.onSave(collectionMeasureList);
        window.location.assign(this.navigateURL);
      } else {
        if (this.emptyDossierExist()) {
          this.throwBusinessError(this.dossierError);
        } else {
          this.throwBusinessError(this.businessError);
        }
      }
    } else {
      this.throwCollectionMeasureError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeCollectionMeasureError();
    this.RemoveBusinessError(this.dossierError);
    this.throwBusinessError(this.businessError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  throwCollectionMeasureError() {
    this.RequiredDropdownConfig.externalError = true;
  }

  removeCollectionMeasureError() {
    this.RequiredDropdownConfig.externalError = false;
  }

  emptyDossierExist() {
    let isEmpty = false;
    const validateCollectionData = this.collectionMeasureConfigList;
    for (let i = 0; i < validateCollectionData.length; i++) {
      if (validateCollectionData[i].collectionMeasureType2DossierStatusList.length == 0) {
        isEmpty = true;
        break;
      } else {
        for (let j = 0; j < validateCollectionData[i].collectionMeasureType2DossierStatusList.length; j++) {
          if (validateCollectionData[i].collectionMeasureType2DossierStatusList[j].state == 4) {
            isEmpty = true;
          } else {
            isEmpty = false;
            break;
          }
        }
        if (isEmpty) {
          break;
        }
      }
    }
    return isEmpty;
  }

  isDuplicateCollectionTypeExists(newgridDate: CollectionMeasuresConfigDto[]) {
    const removeNullDateValue = newgridDate.filter((date: CollectionMeasuresConfigDto) => date.type?.codeId);
    const uniqueValues = [...new Set(removeNullDateValue.map((date: CollectionMeasuresConfigDto) => date.type?.codeId))];

    if (uniqueValues.length < removeNullDateValue.length) {
      return true;
    } else {
      return false;
    }
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

  deleteDossierStatus(dossierStatus: CollectionMeasureType2DossierStatusDto[]){
    dossierStatus.forEach(x=>{
      x.state = DtoState.Deleted;
    })
    return dossierStatus;
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
}

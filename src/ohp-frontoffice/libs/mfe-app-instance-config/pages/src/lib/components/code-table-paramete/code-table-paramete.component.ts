import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FluidButtonConfig,
  FluidCheckBoxConfig,
  FluidControlDatePickerConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidDropDownConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { ErrorDto } from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { codeTable } from './Models/codeTable.model';
import { CodetableParameterDto } from './Models/codetableParameterDto.model';
import { CodeTableParameterService } from './Services/code-table-parameter.service';
import { DtoState } from './Models/dtoBase.model';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';

@Component({
  selector: 'maic-code-table-paramete',
  templateUrl: './code-table-paramete.component.html',
  styleUrls: ['./code-table-paramete.component.scss']
})
export class CodeTableParameteComponent implements OnInit {
  @ViewChild('codeTableParamform', { static: true }) codeTableParamform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public RequiredTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PasswordTextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public DropdownConfig: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public CheckboxConfig: FluidCheckBoxConfig = this.fluidService.FluidCheckBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredParameterName: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;
  public RequiredCodeTableName: FluidDropDownConfig = this.fluidService.FluidDropDownConfig;

  placeholder = 'Select';
  internaldrop!: any;
  CodetableName!: any;
  ParameterName!: any;
  isSingleValue!: any;
  codetable!: any[];
  codetableHeader!: any[];

  codeTableParamList: CodetableParameterDto[] = [];
  codeTableParamData: CodetableParameterDto = new CodetableParameterDto();

  codeTableValueList: codeTable[] = [];
  codeTableNameList: codeTable[] = [];

  targetList: codeTable[] = [];
  source: codeTable[] = [];
  target: codeTable[] = [];
  sourceCaption: any[] = [];
  targetCaption: any[] = [];

  deletedArray: CodetableParameterDto[] = [];
  showDialog = false;
  hideCard = true;
  exceptionBox!: boolean;
  validationHeader!: string;
  navigateURL: any;
  highlightCodeTable: CodetableParameterDto = new CodetableParameterDto();
  parameterItemBusinessError!: string;
  duplicateBusinessError!: string;
  errorCode !: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public codetableParamService: CodeTableParameterService,
    public spinnerService: SpinnerService,
    public commonService: ConfigContextService,
    public fluidValidation: fluidValidationService
  ) {
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');
    this.parameterItemBusinessError = this.translate.instant('app-instance.codetable.ValidationError.SingleParamBusinesssError');
    this.duplicateBusinessError = this.translate.instant('app-instance.codetable.ValidationError.BusinessError');
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);
      this.codeTableNameList = data.getCodetableNameList;

      const removeDuplicateValues = this.isDuplicateObjectExists(data.getCodetableParamList);

      const UpdateCodeTableParam = removeDuplicateValues.map((x: CodetableParameterDto) => {
        const UpdateCodeTableName = this.codeTableNameList.filter(y => y.caption === x.codetableName?.toLocaleLowerCase());
        return {
          ...x,
          codetableNameObj: UpdateCodeTableName[0],
          rowSelected: false,
          randomNumber: this.generateRandomNumber(),
          modifiedisSingleValue: x.isSingleValue.toString()
        };
      });

      if (UpdateCodeTableParam.length > 0) {
        UpdateCodeTableParam[0].rowSelected = true;
        this.codeTableParamList = [...UpdateCodeTableParam];
        this.codeTableParamData = this.codeTableParamList[0];
        this.codetableParamService.getCodeTableValues(this.codeTableParamData?.codetableName).subscribe((data: any) => {
          this.spinnerService.setIsLoading(false);
          this.codeTableValueList = data;
          this.assigningSourceTarget(0);
        },err=>{
          this.spinnerService.setIsLoading(false);
        });
        this.highlightCodeTable = this.codeTableParamList[0];
      } else {
        this.hideCard = false;
      }
    });

    this.codetableHeader = [
      { header: this.translate.instant('app-instance.codetable.tabel.CodetableName'), field: 'codetableName', width: '30%' },
      { header: this.translate.instant('app-instance.codetable.tabel.ParameterName'), field: 'parameterName', width: '50%' },
      { header: this.translate.instant('app-instance.codetable.tabel.isSingleValue'), field: 'modifiedisSingleValue', width: '15%' },
      { header: this.translate.instant('app-instance.codetable.tabel.Delete'), field: 'Delete', fieldType: 'deleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const codeTableNameError = new ErrorDto();
    codeTableNameError.validation = 'required';
    codeTableNameError.isModelError = true;
    codeTableNameError.validationMessage =
      this.translate.instant('app-instance.codetable.ValidationError.CodetableName') +
      this.translate.instant('app-instance.codetable.ValidationError.required');
    this.RequiredCodeTableName.required = true;
    this.RequiredCodeTableName.Errors = [codeTableNameError];

    const paramNameError = new ErrorDto();
    paramNameError.validation = 'required';
    paramNameError.isModelError = true;
    paramNameError.validationMessage =
      this.translate.instant('app-instance.codetable.ValidationError.ParameterName') +
      this.translate.instant('app-instance.codetable.ValidationError.required');
    this.RequiredParameterName.required = true;
    this.RequiredParameterName.Errors = [paramNameError];
  }

  onAdd() {
    if (this.codeTableParamform.valid) {
      if (!this.isDuplicateError()) {
        if (this.codeTableParamList.length == 0) {
          this.hideCard = false;
        }
        this.RemoveBusinessError(this.duplicateBusinessError);

        let updatecodeTableParamList = [...this.codeTableParamList];
        updatecodeTableParamList = this.rowDeselectData(updatecodeTableParamList);
        this.codeTableParamData = new CodetableParameterDto();
        this.codeTableParamData.isSingleValue = false;
        this.codeTableParamData.modifiedisSingleValue = this.codeTableParamData.isSingleValue?.toString();
        this.codeTableParamData.codetableParameterItemList = [];
        this.codeTableValueList = [];
        this.targetCaption = [];
        this.sourceCaption = [];
        updatecodeTableParamList.push({
          ...this.codeTableParamData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.codeTableParamList = [...updatecodeTableParamList];
        this.codeTableParamform.resetForm();
        this.removeCodeTableError();

        const SelectedIndex = this.codeTableParamList.findIndex(x => x.rowSelected);
        if (SelectedIndex >= 0) {
          this.highlightCodeTable = this.codeTableParamList[SelectedIndex];
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwCodeTableError();
    }
  }

  onRowDelete(event: CodetableParameterDto) {
    if ((this.codeTableParamform.valid && !this.isDuplicateError()) || event.rowSelected) {
      const codeTableParamListData = [...this.codeTableParamList];

      const todeleteIndex = codeTableParamListData.findIndex((data: CodetableParameterDto) => {
        return data?.randomNumber === event?.randomNumber;
      });

      if (todeleteIndex != codeTableParamListData.length - 1) {
        if (codeTableParamListData[todeleteIndex].state == 1) {
          codeTableParamListData.splice(todeleteIndex, 1);
          this.removeCodeTableError();
          this.RemoveBusinessError(this.duplicateBusinessError);
        } else {
          codeTableParamListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...codeTableParamListData[todeleteIndex] });
          codeTableParamListData.splice(todeleteIndex, 1);
          this.removeCodeTableError();
          this.RemoveBusinessError(this.duplicateBusinessError);
        }

        if (codeTableParamListData.length > 0) {
          this.codeTableParamList = this.rowDeselectData(codeTableParamListData);
          this.codeTableParamList[0].rowSelected = true;
          this.codeTableParamData = this.codeTableParamList[0];
          this.highlightCodeTable = this.codeTableParamList[0];

          this.codetableParamService.getCodeTableValues(this.codeTableParamData.codetableName).subscribe((data: any) => {
            this.spinnerService.setIsLoading(false);
            this.codeTableValueList = data;
            this.assigningSourceTarget(0);
          },err=>{
            this.spinnerService.setIsLoading(false);
          });
        } else {
          this.codeTableParamList = [];
          this.codeTableParamData = new CodetableParameterDto();
          this.codeTableParamData.codetableParameterItemList = [];
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      } else {
        if (codeTableParamListData[todeleteIndex].state == 1) {
          codeTableParamListData.splice(todeleteIndex, 1);
          this.removeCodeTableError();
          this.RemoveBusinessError(this.duplicateBusinessError);
        } else {
          codeTableParamListData[todeleteIndex].state = 4;
          this.deletedArray.push({ ...codeTableParamListData[todeleteIndex] });
          codeTableParamListData.splice(todeleteIndex, 1);
          this.removeCodeTableError();
          this.RemoveBusinessError(this.duplicateBusinessError);
        }

        if (codeTableParamListData.length > 0) {
          this.codeTableParamList = this.rowDeselectData(codeTableParamListData);
          this.codeTableParamList[this.codeTableParamList?.length - 1].rowSelected = true;
          const lastIndex = this.codeTableParamList.findIndex((x: CodetableParameterDto) => x.rowSelected);

          this.codeTableParamData = this.codeTableParamList[lastIndex];
          this.highlightCodeTable = this.codeTableParamList[lastIndex];

          this.codetableParamService.getCodeTableValues(this.codeTableParamData.codetableName).subscribe((data: any) => {
            this.spinnerService.setIsLoading(false);
            this.codeTableValueList = data;
            this.assigningSourceTarget(lastIndex);
          },err=>{
            this.spinnerService.setIsLoading(false);
          });
        } else {
          this.codeTableParamList = [];
          this.codeTableParamData = new CodetableParameterDto();
          this.codeTableParamData.codetableParameterItemList = [];
          setTimeout(() => {
            this.hideCard = false;
          }, 100);
        }
      }
    } else {
      if (this.isDuplicateError()) {
        this.throwBusinessError(this.duplicateBusinessError);
      } else {
        this.throwCodeTableError();
      }
    }
  }

  onRowselect(event: CodetableParameterDto) {
    if (this.codeTableParamform.valid || event.rowSelected) {
      if (!this.isDuplicateError() || event.rowSelected) {
        this.RemoveBusinessError(this.duplicateBusinessError);

        this.removeCodeTableError();

        let updatecodeTableParamList = this.codeTableParamList;
        const eventIndex = updatecodeTableParamList.findIndex(x => x.rowSelected);

        updatecodeTableParamList = this.rowDeselectData(updatecodeTableParamList);

        this.codeTableParamList[eventIndex].rowSelected = updatecodeTableParamList[eventIndex].rowSelected;

        const selectedIndex = updatecodeTableParamList.findIndex(x => x.randomNumber == event.randomNumber);

        this.codeTableParamList[selectedIndex].rowSelected = true;
        this.highlightCodeTable = this.codeTableParamList[selectedIndex];

        this.codeTableParamData = event;
        this.codetableParamService.getCodeTableValues(this.codeTableParamData.codetableName).subscribe((data: any) => {
          this.spinnerService.setIsLoading(false);
          this.codeTableValueList = data;
          this.assigningSourceTarget(selectedIndex);
        },err=>{
          this.spinnerService.setIsLoading(false);
        });
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwCodeTableError();
    }
  }

  rowDeselectData(collectionConfigData: CodetableParameterDto[]) {
    const deSelectData = collectionConfigData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: CodetableParameterDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onCodeTableNameChange(event: any) {
    const selectedIndex = this.codeTableParamList.findIndex((x: CodetableParameterDto) => x.rowSelected);

    if (selectedIndex >= 0 && event?.value != null) {
      const updateData = this.codeTableParamList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.codetableNameObj = event.value;
      updategrid.codetableName = event.value.caption;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.codeTableParamList[selectedIndex].codetableNameObj = updategrid.codetableNameObj;
      this.codeTableParamList[selectedIndex].codetableName = updategrid.codetableName;
      this.codeTableParamList[selectedIndex].state = updategrid.state;
      this.codeTableParamData.codetableNameObj = event.value;
      this.codeTableParamData.codetableName = updategrid.codetableName;

      this.codetableParamService.getCodeTableValues(this.codeTableParamData?.codetableName).subscribe((data: any) => {
        this.spinnerService.setIsLoading(false);
        this.codeTableValueList = data;
        this.targetList = [];
        this.sourceCaption = [];
        this.targetCaption = [];
        this.target = [...this.targetList];
        this.source = [...this.codeTableValueList];
        this.sourceCaption = this.source.map((x: codeTable) => {
          return { ...x };
        });    
        this.codeTableParamList[selectedIndex].codetableParameterItemList = [];
      },err =>{
        this.spinnerService.setIsLoading(false);
      });
    } else if (event?.value == null) {
      const updateData = this.codeTableParamList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.codetableNameObj = event.value;
      updategrid.codetableName = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.codeTableParamList[selectedIndex].codetableNameObj = null;
      this.codeTableParamList[selectedIndex].codetableName = null;
      this.codeTableParamList[selectedIndex].state = updategrid.state;
      this.codeTableParamData.codetableNameObj = null;
      this.RequiredCodeTableName.externalError = true;
    }
  }

  onparameterNameChange(event: any) {
    const selectedIndex = this.codeTableParamList.findIndex((x: CodetableParameterDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.codeTableParamList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.parameterName = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.codeTableParamList[selectedIndex].parameterName = updategrid.parameterName;
      this.codeTableParamList[selectedIndex].state = updategrid.state;
      this.codeTableParamData.parameterName = event;
    } else {
      const updateData = this.codeTableParamList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.parameterName = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.codeTableParamList[selectedIndex].parameterName = updategrid.parameterName;
      this.codeTableParamList[selectedIndex].state = updategrid.state;
      this.codeTableParamData.parameterName = null;
      this.RequiredParameterName.externalError = true;
    }
  }

  onSingleValueChange(event: any) {
    const selectedIndex = this.codeTableParamList.findIndex((x: CodetableParameterDto) => x.rowSelected);

    if (this.codeTableParamList[selectedIndex].state != DtoState.Created) {
      this.codeTableParamList[selectedIndex].state = DtoState.Dirty;
    }

    if (event != null) {
      this.codeTableParamData.isSingleValue = event;
      this.codeTableParamList[selectedIndex].isSingleValue = event;
      this.codeTableParamList[selectedIndex].modifiedisSingleValue = event.toString();
    }
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.sourceCaption = [];
    this.targetCaption = [];
    const SelectedIndex = this.codeTableParamList.findIndex(x => x.rowSelected);
    this.codeTableParamList[SelectedIndex].codetableParameterItemList.forEach(data => {
      if (data.state != 4) {
        const filterIndex = this.codeTableValueList.findIndex(y => {
          return data.codetableValue == y.codeId;
        });
        if (filterIndex != -1) {
          this.targetList.push(this.codeTableValueList[filterIndex]);
        }
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.codeTableValueList];
    this.target.forEach((data: codeTable) => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == data.codeId;
      });
      if (index != -1) {
        sourcelist.splice(index, 1);
      }
    });
    this.source = [...sourcelist];

    this.sourceCaption = this.source.map((x: codeTable) => {
      return { ...x };
    });

    this.targetCaption = this.target.map((y: codeTable) => {
      return { ...y };
    });
  }

  changeTarget(event: any) {
    if (event != undefined) {
      const Selectedindex = this.codeTableParamList.findIndex(get => {
        return get.rowSelected == true;
      });

      if (Selectedindex >= 0) {
        this.RemoveBusinessError(this.parameterItemBusinessError);
        if (this.codeTableParamList[Selectedindex].state != DtoState.Created) {
          this.codeTableParamList[Selectedindex].state = DtoState.Dirty;
        }

        const filterdossierList: codeTable[] = [];
        event.forEach((x: any) => {
          filterdossierList.push(x);
        });

        let filterData: any[] = [];
        filterData = this.codeTableValueList.filter(val => {
          return filterdossierList.find(x => {
            return x.codeId == val.codeId;
          });
        });

        const oldCodeTableParamListData =
          this.codeTableParamList[Selectedindex].codetableParameterItemList.length > 0
            ? [...this.codeTableParamList[Selectedindex].codetableParameterItemList]
            : [];
        const oldCodeIds: any = [];
        oldCodeTableParamListData.map(codeData => {
          if (codeData?.codetableValue) {
            oldCodeIds.push(codeData?.codetableValue);
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
            const getTaxIndex = oldCodeTableParamListData.findIndex((codeData: any) => codeData?.codetableValue === oldData);
            if (getTaxIndex >= 0) {
              const updateTax = { ...oldCodeTableParamListData[getTaxIndex] };
              if (updateTax.state === 1) {
                oldCodeTableParamListData.splice(getTaxIndex, 1);
              } else if (updateTax.state === 0) {
                //updateTax.state = 4;
                oldCodeTableParamListData.splice(getTaxIndex, 1);
                //oldCodeTableParamListData[getTaxIndex] = updateTax;
              }
            }
          }
        });

        newCodeIds.map((y: any) => {
          const getIndex = oldCodeIds.findIndex((x: any) => x === y.refCodeId);
          //Add Index if it is  new Data
          if (getIndex === -1) {
            const updateCodeVal: any = {
              codetableValue: y.refCodeId,
              state: 1
            };
            oldCodeTableParamListData.push(updateCodeVal);
          } else {
            //Update if it is Existing Data
            const getCodeValueIndex = oldCodeTableParamListData.findIndex((codeData: any) => codeData?.codetableValue === y.refCodeId);
            if (getCodeValueIndex >= 0) {
              const updateTax = { ...oldCodeTableParamListData[getCodeValueIndex] };
              if (updateTax.state === 4) {
                updateTax.state = 0;
                oldCodeTableParamListData[getCodeValueIndex] = updateTax;
              }
            }
          }
        });

        this.codeTableParamList[Selectedindex].codetableParameterItemList =
          oldCodeTableParamListData.length > 0
            ? oldCodeTableParamListData.map((x: any) => {
                const updatedTaxData = { ...x, codetableValue: x.codetableValue };
                return updatedTaxData;
              })
            : [];
      }
    }
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  onSave(codeTableParamList: CodetableParameterDto[]) {
    if (this.codeTableParamform.valid) {
      if (!this.isDuplicateError()) {
        this.RemoveBusinessError(this.duplicateBusinessError);
        let isSingleParamItemExist = true;

        codeTableParamList.map(data => {
          if (data.state != 0) {
            if (data.isSingleValue) {
              if (this.isSingleParamItemExist(data)) {
                this.deletedArray.push({ ...data });
              } else {
                isSingleParamItemExist = false;
                this.throwBusinessError(this.parameterItemBusinessError + `'${data.parameterName}'`);
              }
            } else {
              this.deletedArray.push({ ...data });
            }
          }
        });
        this.removeCodeTableError();

        if (isSingleParamItemExist) {
          this.deletedArray.map(x => {
            this.RemoveBusinessError(this.parameterItemBusinessError + `'${x.parameterName}'`);
          });

          this.codetableParamService.saveCodeTableParamList(this.deletedArray).subscribe(
            data => {
              this.deletedArray = [];
              this.spinnerService.setIsLoading(false);
              if (data) {
                this.codetableParamService.getCodetableParamList().subscribe(
                  (responseData: any) => {
                    const removeDuplicateValues = this.isDuplicateObjectExists(responseData);

                    this.spinnerService.setIsLoading(false);
                    const UpdateCodeTableParam = removeDuplicateValues.map((x: CodetableParameterDto) => {
                      const UpdateCodeTableName = this.codeTableNameList.filter(y => y.caption === x.codetableName?.toLocaleLowerCase());

                      return {
                        ...x,
                        codetableNameObj: UpdateCodeTableName[0],
                        rowSelected: false,
                        randomNumber: this.generateRandomNumber(),
                        modifiedisSingleValue: x.isSingleValue.toString()
                      };
                    });

                    if (UpdateCodeTableParam.length > 0) {
                      this.codeTableParamList = [...UpdateCodeTableParam];
                      const selectedIndex = this.codeTableParamList.findIndex(
                        x =>
                          x.parameterName === this.codeTableParamData.parameterName &&
                          x.codetableName === this.codeTableParamData.codetableName
                      );
                      this.codeTableParamList[selectedIndex].rowSelected = true;
                      this.codeTableParamData = this.codeTableParamList[selectedIndex];
                      this.highlightCodeTable = this.codeTableParamList[selectedIndex];
                      this.codetableParamService.getCodeTableValues(this.codeTableParamData.codetableName).subscribe((data: any) => {
                        this.spinnerService.setIsLoading(false);
                        this.codeTableValueList = data;
                        this.assigningSourceTarget(selectedIndex);
                      },err=>{
                        this.spinnerService.setIsLoading(false);
                      });
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
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    }
  }

  isSingleParamItemExist(paramData: CodetableParameterDto) {
    let isSingleValueExist = false;

    if (paramData.codetableParameterItemList.length != 0) {
      if (paramData.codetableParameterItemList.length == 1) {
        for (let i = 0; i < paramData.codetableParameterItemList.length; i++) {
          if (paramData.codetableParameterItemList[i].state == 4) {
            isSingleValueExist = false;
          } else {
            isSingleValueExist = true;
            break;
          }
        }
        return isSingleValueExist;
      } else {
        const ParamItemList = [];
        for (let i = 0; i < paramData.codetableParameterItemList.length; i++) {
          if (paramData.codetableParameterItemList[i].state != 4) {
            ParamItemList.push(paramData.codetableParameterItemList[i]);
          }
        }
        if (ParamItemList.length == 1) {
          isSingleValueExist = true;
          return isSingleValueExist;
        } else {
          return isSingleValueExist;
        }
      }
    } else {
      return isSingleValueExist;
    }
  }

  isDuplicateError(): boolean {
    const TaxCertificateDup = this.codeTableParamList.reduce((array: CodetableParameterDto[], current) => {
      if (
        !array.some(
          (item: CodetableParameterDto) =>
            item.parameterName == current.parameterName
        )
      ) {
        array.push(current);
      }
      return array;
    }, []);

    if (TaxCertificateDup.length != this.codeTableParamList.length) {
      return true;
    } else {
      return false;
    }
  }

  throwCodeTableError() {
    this.RequiredCodeTableName.externalError = true;
    this.RequiredParameterName.externalError = true;
  }

  removeCodeTableError() {
    this.RequiredCodeTableName.externalError = false;
    this.RequiredParameterName.externalError = false;
  }

  onClose() {
    const isChangedIndexExist = this.codeTableParamList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeCodeTableError();
      this.RemoveBusinessError(this.duplicateBusinessError);
      window.location.assign(this.navigateURL);
    }
  }

  onCloseModel(event: any) {
    this.showDialog = false;
  }

  onDialogYes(codeTableParamList: CodetableParameterDto[]) {
    this.showDialog = false;
    let isSingleParamItemExist = true;

    codeTableParamList.map(data => {
      if (data.isSingleValue) {
        if (!this.isSingleParamItemExist(data)) {
          isSingleParamItemExist = false;
          this.throwBusinessError(this.parameterItemBusinessError + `'${data.parameterName}'`);
        }
      }
    });
    if (this.codeTableParamform.valid) {
      if (!this.isDuplicateError()) {
        if (isSingleParamItemExist) {
          this.onSave(codeTableParamList);
          window.location.assign(this.navigateURL);
        }
      } else {
        this.throwBusinessError(this.duplicateBusinessError);
      }
    } else {
      this.throwCodeTableError();
    }
  }

  onDialogNo() {
    this.showDialog = false;
    this.removeCodeTableError();
    this.RemoveBusinessError(this.duplicateBusinessError);
    window.location.assign(this.navigateURL);
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
    window.location.reload();
  }

  isDuplicateObjectExists(newgridDate: CodetableParameterDto[]) {
    const removeDupDatas = newgridDate.reduce((array: CodetableParameterDto[], current) => {
      if (!array.some((item: CodetableParameterDto) => item.pKey === current.pKey)) {
        array.push(current);
      }
      return array;
    }, []);

    return removeDupDatas;
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
}

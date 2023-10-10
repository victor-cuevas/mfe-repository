import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@close-front-office/mfe-app-instance-config/core';
import { ConfigContextService } from '@close-front-office/shared/config';
import {
  ErrorDto,
  FluidButtonConfig,
  FluidControlsBaseService,
  FluidControlTextBoxConfig,
  FluidPickListConfig,
  fluidValidationService,
  ValidationErrorDto
} from '@close-front-office/shared/fluid-controls';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { ArrearsConfiguration2TxElTypeDto } from './Models/arrears-configuration2TxElTypeDto.model';
import { ArrearsConfigurationDto } from './Models/arrears-configurationDto.model';
import { codeTable } from './Models/codeTable.model';
import { TxElTypeDto } from './Models/txel-typeDto.model';
import { DtoState } from './Models/dtoBase.model';
import { ArrearsConfigurationService } from './Services/arrears-configuration.service';

@Component({
  selector: 'maic-arrears-configuration',
  templateUrl: './arrears-configuration.component.html',
  styleUrls: ['./arrears-configuration.component.scss']
})
export class ArrearsConfigurationComponent implements OnInit {
  @ViewChild('arrearConfigurationform', { static: true }) arrearConfigurationform!: NgForm;

  public ButtonConfig: FluidButtonConfig = this.fluidService.FluidButtonConfig;
  public TextBoxconfig: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;
  public PickListConfig: FluidPickListConfig = this.fluidService.FluidPickListConfig;

  public RequiredName: FluidControlTextBoxConfig = this.fluidService.FluidTextBoxConfig;

  arrearTriggerConfigList!: any[];
  arrearConfigHeader!: any[];
  arrearName!: string;

  sourceCaption: any[] = [];
  targetCaption: any[] = [];
  caption!: any;
  errorCode!: string;
  showDialog = false;
  exceptionBox = false;
  validationHeader!: string;
  navigateURL: any;

  arrearConfigList: ArrearsConfigurationDto[] = [];
  arrearConfigData: ArrearsConfigurationDto = new ArrearsConfigurationDto();
  highlightArrearConfig: ArrearsConfigurationDto = new ArrearsConfigurationDto();
  txelList: codeTable[] = [];
  hideCard = true;
  textboxReadonly= true;

  targetList: codeTable[] = [];
  target: codeTable[] = [];
  source: codeTable[] = [];
  deletedArray: ArrearsConfigurationDto[] = [];
  businessError!: string;
  pickListError !: string;

  constructor(
    public fluidService: FluidControlsBaseService,
    public translate: TranslateService,
    public commonService: ConfigContextService,
    public activatedRoute: ActivatedRoute,
    public spinnerService: SpinnerService,
    public arrearConfigService: ArrearsConfigurationService,
    public fluidValidation: fluidValidationService
  ) {
    this.validationHeader = this.translate.instant('app-instance.validation.validationHeader');
    this.businessError = this.translate.instant('app-instance.arrearsConfig.ValidationError.DupBusinessError');
    this.pickListError = this.translate.instant('app-instance.arrearsConfig.ValidationError.Txel')
    const mfeConfig = this.commonService.getDefaultConfigRoute();
    this.navigateURL = mfeConfig?.remoteUrl;
  }

  ngOnInit(): void {
    this.buildConfiguration();
    this.activatedRoute.data.subscribe((data: any) => {
      this.spinnerService.setIsLoading(false);

      this.txelList = data.txelList;

      const updatearrearConfigData = data.arrearConfigList.map((arrearConfigData: ArrearsConfigurationDto) => {
        return { ...arrearConfigData, randomNumber: this.generateRandomNumber(), rowSelected: false };
      });

      if (updatearrearConfigData.length > 0) {
        this.arrearConfigList = updatearrearConfigData;
        this.arrearConfigList.forEach(x => x.hasNoProductCopy = !x.isLinkedwithCreditProviderSettings);
        this.arrearConfigList[0].rowSelected = true;
        this.arrearConfigData = this.arrearConfigList[0];
        this.highlightArrearConfig = this.arrearConfigList[0];
        this.assigningSourceTarget(0);
      } else {
        this.hideCard = false;
      }
    });

    this.arrearConfigHeader = [
      {
        header: this.translate.instant('app-instance.arrearsConfig.tabel.Name'),
        field: 'name',
        width: '95%'
      },
      { header: this.translate.instant('app-instance.arrearsConfig.tabel.Delete'), field: 'Delete', fieldType: 'customizeDeleteButton', width: '5%' }
    ];
  }

  buildConfiguration() {
    const nameError = new ErrorDto();
    nameError.validation = 'required';
    nameError.isModelError = true;
    nameError.validationMessage =
      this.translate.instant('app-instance.arrearsConfig.ValidationError.Name') +
      this.translate.instant('app-instance.arrearsConfig.ValidationError.Required');
    this.RequiredName.required = true;
    this.RequiredName.Errors = [nameError];
  }

  generateRandomNumber() {
    const randomnumber = Math.random();
    return randomnumber;
  }

  assigningSourceTarget(index: number) {
    this.targetList = [];
    this.sourceCaption = [];
    this.targetCaption = [];
    this.arrearConfigList[index].arrearsConfiguration2TxElTypeList.forEach(user => {
      if (user.state != 4) {
        const filter = this.txelList.findIndex(y => {
          return user.txElType.codeId == y.codeId;
        });
        if (filter != -1) {
          this.targetList.push(this.txelList[filter]);
        }
      }
    });
    this.target = [...this.targetList];
    const sourcelist = [...this.txelList];
    this.target.forEach((user: codeTable) => {
      const index = sourcelist.findIndex(value => {
        return value.codeId == user.codeId;
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

  onAddArrearConfig() {
    if (this.arrearConfigurationform.valid && !this.emptyTxelTypeExist()) {
      this.RemoveBusinessError(this.pickListError);
      if (!this.isDuplicateError()) {
        if (this.arrearConfigList.length == 0) {
          this.hideCard = true;
        }
        this.textboxReadonly = false;
        let updatearrearConfigList = [...this.arrearConfigList];
        updatearrearConfigList = this.rowDeselectData(updatearrearConfigList);
        this.arrearConfigData = new ArrearsConfigurationDto();
        this.arrearConfigData.hasNoProductCopy = true;
        this.arrearConfigData.arrearsConfiguration2TxElTypeList = [];
        updatearrearConfigList.push({
          ...this.arrearConfigData,
          randomNumber: this.generateRandomNumber(),
          rowSelected: true,
          state: 1
        });
        this.arrearConfigList = [...updatearrearConfigList];

        this.arrearConfigurationform.resetForm();
        this.removeArrearConfigError();
        this.RemoveBusinessError(this.businessError);

        const SelectedIndex = this.arrearConfigList.findIndex(x => x.rowSelected);
        if (SelectedIndex >= 0) {
          this.assigningSourceTarget(SelectedIndex);
        }

        this.highlightArrearConfig = this.arrearConfigList[SelectedIndex];
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      if(this.emptyTxelTypeExist()){
        this.throwBusinessError( this.pickListError);
        this.throwArrearConfigError();
      }else{
        this.throwArrearConfigError();
      }
     
    }
  }

  rowDeselectData(arrrearConfigData: ArrearsConfigurationDto[]) {
    const deSelectData = arrrearConfigData;
    const updateDeselect =
      deSelectData.length > 0
        ? deSelectData.map((x: ArrearsConfigurationDto) => {
            return {
              ...x,
              rowSelected: false
            };
          })
        : [];
    return updateDeselect;
  }

  onRowDelete(event: ArrearsConfigurationDto) {
    if ((this.arrearConfigurationform.valid && !this.emptyTxelTypeExist()) || event.rowSelected) {
      this.RemoveBusinessError(this.pickListError);
      if (!this.isDuplicateError() || event.rowSelected) {
        const arrearConfigListData = [...this.arrearConfigList];

        const todeleteIndex = arrearConfigListData.findIndex((data: ArrearsConfigurationDto) => {
          return data?.randomNumber === event?.randomNumber;
        });

        if (todeleteIndex != arrearConfigListData.length - 1) {
          if (arrearConfigListData[todeleteIndex].state == 1) {
            arrearConfigListData.splice(todeleteIndex, 1);
            this.removeArrearConfigError();
            this.RemoveBusinessError(this.businessError);
          } else {
            arrearConfigListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...arrearConfigListData[todeleteIndex] });
            arrearConfigListData.splice(todeleteIndex, 1);
            this.removeArrearConfigError();
            this.RemoveBusinessError(this.businessError);
          }

          if (arrearConfigListData.length > 0) {
            this.arrearConfigList = this.rowDeselectData(arrearConfigListData);
            this.arrearConfigList[0].rowSelected = true;
            this.arrearConfigData = this.arrearConfigList[0];
            this.highlightArrearConfig = this.arrearConfigList[0];
            this.assigningSourceTarget(0);
            this.textboxReadonly = true;
          } else {
            this.arrearConfigList = [];
            this.arrearConfigData = new ArrearsConfigurationDto();
            this.arrearConfigData.arrearsConfiguration2TxElTypeList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        } else {
          if (arrearConfigListData[todeleteIndex].state == 1) {
            arrearConfigListData.splice(todeleteIndex, 1);
            this.removeArrearConfigError();
            this.RemoveBusinessError(this.businessError);
          } else {
            arrearConfigListData[todeleteIndex].state = 4;
            this.deletedArray.push({ ...arrearConfigListData[todeleteIndex] });
            arrearConfigListData.splice(todeleteIndex, 1);
            this.removeArrearConfigError();
            this.RemoveBusinessError(this.businessError);
          }

          if (arrearConfigListData.length > 0) {
            this.arrearConfigList = this.rowDeselectData(arrearConfigListData);
            this.arrearConfigList[this.arrearConfigList?.length - 1].rowSelected = true;
            const lastIndex = this.arrearConfigList.findIndex((x: ArrearsConfigurationDto) => x.rowSelected);

            this.arrearConfigData = this.arrearConfigList[lastIndex];
            this.highlightArrearConfig = this.arrearConfigList[lastIndex];
            this.assigningSourceTarget(lastIndex);
            this.textboxReadonly = true;
          } else {
            this.arrearConfigList = [];
            this.arrearConfigData = new ArrearsConfigurationDto();
            this.arrearConfigData.arrearsConfiguration2TxElTypeList = [];
            setTimeout(() => {
              this.hideCard = false;
            }, 100);
          }
        }
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      if(this.emptyTxelTypeExist()){
        this.throwBusinessError(this.pickListError);
        this.throwArrearConfigError();
      }else{
        this.throwArrearConfigError();
      }
      
    }
  }

  onRowSelectArrrearConfig(event: ArrearsConfigurationDto) {
    if ((this.arrearConfigurationform.valid && !this.emptyTxelTypeExist())) {
      this.RemoveBusinessError(this.pickListError);
      this.removeArrearConfigError();

      if (!this.isDuplicateError()) {
        let updateArrearConfig = this.arrearConfigList;
        const eventIndex = updateArrearConfig.findIndex(x => x.rowSelected);

        updateArrearConfig = this.rowDeselectData(updateArrearConfig);

        this.arrearConfigList[eventIndex].rowSelected = updateArrearConfig[eventIndex].rowSelected;

        const selectedIndex = updateArrearConfig.findIndex(x => x.randomNumber == event.randomNumber);

        this.arrearConfigList[selectedIndex].rowSelected = true;
        this.highlightArrearConfig = this.arrearConfigList[selectedIndex];
        this.arrearConfigData = event;
        this.assigningSourceTarget(selectedIndex);
        this.RemoveBusinessError(this.businessError);
        this.textboxReadonly = true;
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      if(this.emptyTxelTypeExist()){
        this.throwBusinessError(this.pickListError);
        this.throwArrearConfigError();
      }else{
        this.throwArrearConfigError();
      } 
      
    }
  }

  onArrearNameChange(event: any) {
    const selectedIndex = this.arrearConfigList.findIndex((x: ArrearsConfigurationDto) => x.rowSelected);

    if (selectedIndex >= 0 && event != null && event != '') {
      const updateData = this.arrearConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.name = event;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearConfigList[selectedIndex].name = updategrid.name;
      this.arrearConfigList[selectedIndex].state = updategrid.state;
      this.arrearConfigData.name = event;
    } else {
      const updateData = this.arrearConfigList;
      const updategrid = { ...updateData[selectedIndex] };
      updategrid.name = null;
      if (updategrid.state != DtoState.Created) {
        updategrid.state = DtoState.Dirty;
      }
      this.arrearConfigList[selectedIndex].name = updategrid.name;
      this.arrearConfigList[selectedIndex].state = updategrid.state;
      this.arrearConfigData.name = null;
      this.RequiredName.externalError = true;
    }
  }

  changeTarget(event: any) {
    if (event != undefined) {
      const Selectedindex = this.arrearConfigList.findIndex(get => {
        return get.rowSelected == true;
      });

      if (Selectedindex >= 0) {
        this.RemoveBusinessError(this.pickListError);
        if (this.arrearConfigList[Selectedindex].state != DtoState.Created) {
          this.arrearConfigList[Selectedindex].state = DtoState.Dirty;
        }

        const filtertxelList: codeTable[] = [];
        event.forEach((x: any) => {
          filtertxelList.push(x);
        });

        let filterData: any[] = [];
        filterData = this.txelList.filter(val => {
          return filtertxelList.find(x => {
            return x.codeId == val.codeId;
          });
        });

        const oldTxelListData =
          this.arrearConfigList[Selectedindex].arrearsConfiguration2TxElTypeList.length > 0
            ? [...this.arrearConfigList[Selectedindex].arrearsConfiguration2TxElTypeList]
            : [];

        const oldCodeIds: any = [];
        oldTxelListData.map(codeData => {
          if (codeData?.txElType?.codeId) {
            oldCodeIds.push(codeData?.txElType?.codeId);
          }
        });

        const newCodeId: any[] = [];
        filterData.map(codeData => {
          if (codeData?.codeId) {
            const oldCodeData: any = {
              refCodeId: codeData.codeId,
              refCodeValue: codeData
            };
            newCodeId.push(oldCodeData);
          }
        });

        oldCodeIds.map((oldData: any) => {
          const findNewCodeIndex = newCodeId.findIndex((newId: any) => newId.refCodeId === oldData);
          if (findNewCodeIndex === -1) {
            const getTxelIndex = oldTxelListData.findIndex((codeData: any) => codeData?.txElType?.codeId === oldData);
            if (getTxelIndex >= 0) {
              const updateTxel = { ...oldTxelListData[getTxelIndex] };
              if (updateTxel.state === 1) {
                oldTxelListData.splice(getTxelIndex, 1);
              } else if (updateTxel.state === 0) {
                updateTxel.state = 4;
                oldTxelListData.splice(getTxelIndex, 1);
                oldTxelListData[getTxelIndex] = updateTxel;
              }
            }
          }
        });

        newCodeId.map(newCodeData => {
          const newCodeIndex = oldCodeIds.findIndex((x: any) => x === newCodeData.refCodeId);
          if (newCodeIndex === -1) {
            const UpdateTxelList: any = {
              txElType: { ...newCodeData.refCodeValue },
              state: 1
            };
            oldTxelListData.push(UpdateTxelList);
          } else {
            const getCodeValueIndex = oldTxelListData.findIndex((codeData: any) => codeData?.txElType?.codeId === newCodeData.refCodeId);
            if (getCodeValueIndex >= 0) {
              const UpdateTxelList = { ...oldTxelListData[getCodeValueIndex] };
              if (UpdateTxelList.state === 4) {
                UpdateTxelList.state = 0;
                oldTxelListData[getCodeValueIndex] = UpdateTxelList;
              }
            }
          }
        });

        this.arrearConfigList[Selectedindex].arrearsConfiguration2TxElTypeList =
          oldTxelListData.length > 0
            ? oldTxelListData.map((x: any) => {
                const updatedTaxData = { ...x, txElType: { ...x.txElType } };
                return updatedTaxData;
              })
            : [];
      }
    }
  }

  onSave(arrearConfig: ArrearsConfigurationDto[]) {
    if (this.arrearConfigurationform.valid && !this.emptyTxelTypeExist()) {
      this.RemoveBusinessError(this.pickListError);
      if (!this.isDuplicateError()) {
        arrearConfig.map(arrearConfigData => {
          if (arrearConfigData.state != 0) {
            this.deletedArray.push({ ...arrearConfigData });
          }
        });

        this.arrearConfigService.SaveArrearsConfigurationList(this.deletedArray).subscribe(
          responsedata => {
            this.spinnerService.setIsLoading(false);
            if (responsedata) {
              this.deletedArray = [];
              this.arrearConfigService.getArrearsConfigurationList().subscribe(
                (data: any) => {
                  this.spinnerService.setIsLoading(false);
                  const updatearrearConfigData = data.map((arrearConfigData: ArrearsConfigurationDto) => {
                    return { ...arrearConfigData, randomNumber: this.generateRandomNumber(), rowSelected: false };
                  });

                  if (updatearrearConfigData.length > 0) {
                    const arrearIndex = updatearrearConfigData.findIndex(
                      (x: ArrearsConfigurationDto) => x.name == this.arrearConfigData?.name
                    );
                    updatearrearConfigData[arrearIndex].rowSelected = true;
                    this.arrearConfigList = [...updatearrearConfigData];
                    this.arrearConfigList.forEach(x => x.hasNoProductCopy = !x.isLinkedwithCreditProviderSettings);
                    this.arrearConfigData = this.arrearConfigList[arrearIndex];
                    this.highlightArrearConfig = this.arrearConfigList[arrearIndex];
                    this.textboxReadonly = true;
                  } else {
                    this.hideCard = false;
                  }
                },
                err => {
                  if (err?.error?.errorCode) {
                    this.errorCode = err.error.errorCode;
                  } else {
                    this.errorCode = 'InternalServiceFault';
                  }
                  this.spinnerService.setIsLoading(false);
                  this.exceptionBox = true;
                }
              );
            }
          },
          err => {
            if (err?.error?.errorCode) {
              this.errorCode = err.error.errorCode;
            } else {
              this.errorCode = 'InternalServiceFault';
            }
            this.spinnerService.setIsLoading(false);
            this.exceptionBox = true;
          }
        );
      } else {
        this.throwBusinessError(this.businessError);
      }
    }else {
      if(this.emptyTxelTypeExist()){
        this.throwBusinessError( this.pickListError);
        this.throwArrearConfigError();
      }else{
        this.throwArrearConfigError();
      }
     
    }
  }

  onClose() {
    const isChangedIndexExist = this.arrearConfigList.findIndex(x => x.state == 3 || x.state == 1);

    if (isChangedIndexExist >= 0 || this.deletedArray.length > 0) {
      this.showDialog = true;
    } else {
      this.removeArrearConfigError();
      this.RemoveBusinessError(this.pickListError);
      this.RemoveBusinessError(this.businessError);
      window.location.assign(this.navigateURL);
    }
  }

  onYes(arrearConfigList: ArrearsConfigurationDto[]) {
    this.showDialog = false;

    if (this.arrearConfigurationform.valid) {
      if (!this.isDuplicateError()) {
        this.onSave(arrearConfigList);
        window.location.assign(this.navigateURL);
      } else {
        this.throwBusinessError(this.businessError);
      }
    } else {
      this.throwArrearConfigError();
    }
  }

  onNo() {
    this.showDialog = false;
    this.removeArrearConfigError();
    this.RemoveBusinessError(this.pickListError)
    this.RemoveBusinessError(this.businessError)
    window.location.assign(this.navigateURL);
  }

  onCancel() {
    this.showDialog = false;
  }

  onException() {
    this.exceptionBox = false;
  }

  throwArrearConfigError() {
    this.RequiredName.externalError = true;
  }

  removeArrearConfigError() {
    this.RequiredName.externalError = false;
  }

  isDuplicateError(): boolean {
    const TaxCertificateDup = this.arrearConfigList.reduce((array: ArrearsConfigurationDto[], current) => {
      if (!array.some((item: ArrearsConfigurationDto) => item.name == current.name)) {
        array.push(current);
      }
      return array;
    }, []);

    if (TaxCertificateDup.length != this.arrearConfigList.length) {
      return true;
    } else {
      return false;
    }
  }

  emptyTxelTypeExist() {
    let isEmpty = false;
    const validateTaxData = this.arrearConfigList;
    for (let i = 0; i < validateTaxData.length; i++) {
      if (validateTaxData[i].arrearsConfiguration2TxElTypeList.length == 0) {
        isEmpty = true;
        break;
      } else {
        for (let j = 0; j < validateTaxData[i].arrearsConfiguration2TxElTypeList.length; j++) {
          if (validateTaxData[i].arrearsConfiguration2TxElTypeList[j].state == 4) {
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

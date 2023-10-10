import { FluidCheckBoxConfig } from '../fluid-checkbox/fluid-checkbox.model';
import { ErrorDto } from '../models/models';
import { Injectable } from '@angular/core';
import { FluidControlTextBoxConfig } from '../fluid-textbox/fluid-textbox.model';
import { FluidRadioButtonConfig } from '../..';
import { FluidTextAreaConfig } from '../..';
import { FluidControlDatePickerConfig } from '../fluid-datepicker/fluid-datepicker.model';
import { FluidButtonConfig } from '../fluid-button/fluid-button.model';
import { FluidDropDownConfig } from '../fluid-dropdown/fluid-dropdown.model';
import { FluidControlGridConfig } from '../fluid-grid/fluid-grid.model';
import { FluidAutoCompleteConfig } from '../fluid-autocomplete/fluid-autocomplete.model';
import { FluidPickListConfig } from '../fluid-picklist/fluid-pickList.model';

@Injectable()
export class FluidControlsBaseService {

  get FluidCheckBoxConfig(): FluidCheckBoxConfig {
    const config = new FluidCheckBoxConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }

  get FluidTextBoxConfig(): FluidControlTextBoxConfig {
    const config = new FluidControlTextBoxConfig();
    config.required = false;
    config.externalError = false;
    config.minLengthValidation = '';
    config.uppercaseValidation = '';
    config.lowercaseValidation = '';
    config.numberValidation = '';
    config.specialCharacterValidation = '';
    config.validationHeader = '';
    config.invalidDefaultValidation = '';
    config.invalidPostalCodeValidation = '';
    config.invalidIBANValidation = '';
    config.indexArray = new Array<number>();
    config.Errors = new Array<ErrorDto>();
    return config;
  }
  
  get FluidRadioButtonConfig(): FluidRadioButtonConfig {
    const config = new FluidRadioButtonConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }

  get FluidTextAreaConfig(): FluidTextAreaConfig {
    const config = new FluidTextAreaConfig();
     config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }

  get FluidDateConfig(): FluidControlDatePickerConfig {
    const config = new FluidControlDatePickerConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    config.indexArray = new Array<number>();
    return config;
  }

  get FluidButtonConfig(): FluidButtonConfig {
    const config = new FluidButtonConfig();
    config.label = 'Test Button';
    
    return config;
  }
  
  get FluidDropDownConfig(): FluidDropDownConfig {
    const config = new FluidDropDownConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }

  get FluidGridConfig(): FluidControlGridConfig {
    let config: any ;
     return config;
  }

  get FluidAutoCompleteConfig(): FluidAutoCompleteConfig {
    const config = new FluidAutoCompleteConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }
  
  get FluidPickListConfig(): FluidPickListConfig {
    const config = new FluidPickListConfig();
    config.required = false;
    config.Errors = new Array<ErrorDto>();
    return config;
  }
}

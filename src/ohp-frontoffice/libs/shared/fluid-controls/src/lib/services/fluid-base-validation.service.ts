import { Injectable } from '@angular/core';
import { ValidationErrorDto } from '../models/models';

export interface IFluidStateService {
    
    ValidationErrorList: ValidationErrorDto[];
}

@Injectable({providedIn:'root'})
export class FluidStateService implements IFluidStateService {

     ValidationErrorList : ValidationErrorDto[]=[];

}
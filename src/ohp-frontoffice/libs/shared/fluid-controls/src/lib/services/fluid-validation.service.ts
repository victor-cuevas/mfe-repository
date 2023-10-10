import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { FluidStateService, IFluidStateService } from './fluid-base-validation.service';

@Injectable({providedIn:'root'})
export class fluidValidationService{
    FluidBaseValidationService: IFluidStateService;
    private _nativeHTMLControls: string[] = ['input', 'select', 'textarea', 'button', 'a'];
    private _activateTabEvent: EventEmitter<number> = new EventEmitter();
    ActivateTabEvent: Observable<number> = this._activateTabEvent.asObservable();

    constructor(fluidvalidationStateService: FluidStateService,){
        this.FluidBaseValidationService = fluidvalidationStateService;
    }

    FormatString(...params: string[]) {
        
        let result = params[0];
        for (let i = 1; i < params.length; i++) {
            const regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            result = result.replace(regEx, params[i]);
        }
        return result;
    }

    IsNativeHTMLControl(control: string): boolean {
        return this._nativeHTMLControls.indexOf(control.toLowerCase()) > -1;
    }

    GetNativeHTMLControlElement(element: HTMLElement, exactControlName?: string ): Element | undefined {
        let foundElement: any;
        if (exactControlName && this.IsNotEmpty(exactControlName)) {
            foundElement = element.getElementsByTagName(exactControlName.toLowerCase()).item(0);
        } else {

            let isFound = false;
            this._nativeHTMLControls.forEach((value: string) => {
                const elements: HTMLCollectionOf<Element> = element.getElementsByTagName(value);
                if (!isFound && elements.length) {
                    foundElement = elements.item(0);
                    isFound = true;
                }
            });
        }
        return foundElement;
    }

    IsNotEmpty(value: any) {
        return !this.IsEmpty(value);
    }

    IsEmpty(value: any) {
        return value === undefined || value === '' || value === null;
    }
    ActivateTabOfControl(tabIndex: number) {
        this._activateTabEvent.emit(tabIndex);
    }
}
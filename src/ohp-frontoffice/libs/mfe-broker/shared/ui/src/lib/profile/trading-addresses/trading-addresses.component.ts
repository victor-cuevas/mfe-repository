import { Component, Input, ViewChild } from '@angular/core';
import { TradingAddressComponent } from '../../forms/trading-address/trading-address.component';

@Component({
  selector: 'cfo-trading-addresses',
  templateUrl: './trading-addresses.component.html',
})
export class TradingAddressesComponent {
  @ViewChild(TradingAddressComponent) tradingAddress!: TradingAddressComponent;

  @Input() title!: string;
  @Input() intermediaryName?: string;
  @Input() firmName!: string;
  @Input() readOnly = false;

  constructor() {}
}

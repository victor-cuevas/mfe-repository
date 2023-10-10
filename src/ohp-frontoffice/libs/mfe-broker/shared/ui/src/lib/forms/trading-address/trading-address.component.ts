import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'cfo-trading-address',
  templateUrl: './trading-address.component.html',
})
export class TradingAddressComponent implements OnInit {
  @Input() firmName!: string | undefined;
  @Input() isOpen = false;
  @Input() readOnly = false;

  tradingAddresses: any[] = [];

  addressForm: FormGroup = this.fb.group({
    tradingAddress: [null],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.readOnly) this.addressForm.disable();
  }
}

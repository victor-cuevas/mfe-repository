import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DataService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'cfo-radio-button',
  templateUrl: 'radio-button.component.html',
})
export class RadioButtonComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() value: any;

  @Input() disabledExternal: boolean | undefined;

  @Input() label: string | undefined;

  @Input() name: string | undefined;

  @Input() tabindex: number | undefined;

  @Input() inputId: string | undefined;

  @Input() ariaLabelledBy: string | undefined;

  @Input() ariaLabel: string | undefined;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() labelStyleClass: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFocus: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onBlur: EventEmitter<any> = new EventEmitter();

  @ViewChild('rb') inputViewChild: ElementRef | undefined;

  model: any;

  focused = false;

  onModelChange(value: any) {}

  onModelTouched() {}

  constructor(@Self() private ngControl: NgControl, private dataService: DataService, private cd: ChangeDetectorRef) {
    ngControl.valueAccessor = this;
    this.styleClass = '';
    this.labelStyleClass = '';
  }

  get checked() {
    return this.model === this.value;
  }

  ngOnInit() {
    this.ngControl?.control?.valueChanges.subscribe(value => {
      if (this.model === value) return;
      this.writeValue(value);
    });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  writeValue(value: any) {
    this.model = value;
  }

  handleClick(event: Event, radioButton: HTMLElement, focus: any) {
    event.preventDefault();
    this.select(event);

    !this.disabledExternal && focus && radioButton.focus();
  }

  select(event: Event) {
    if (this.disabledExternal) return;

    if (this.model !== this.value) {
      this.model = this.value;
      this.onModelChange(this.model);
      this.onClick.emit(event);
    }
  }

  onInputFocus(event: Event) {
    this.focused = true;
    this.onFocus.emit(event);
  }

  onInputBlur(event: Event) {
    this.focused = false;
    this.onModelTouched();
    this.onBlur.emit(event);
  }

  onChange(event: Event) {
    this.select(event);
  }

  focus() {
    this.inputViewChild?.nativeElement.focus();
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  ElementRef,
  TemplateRef ,
  ContentChild
} from '@angular/core';
import { FluidControlBaseComponent } from '../services/fluid-control-base.component';

import { FluidControlType } from '../models/enum';
import { Table } from 'primeng/table';

@Component({
  selector: 'cfc-fluid-grid',
  templateUrl: './fluid-grid.component.html'
})
export class FluidGridComponent
  extends FluidControlBaseComponent
  implements OnChanges
{
  pageIndex!: number;
  headerList: any = [{}];
  dataList: any = [];
  expandedItems: any = [];
  expandedRow: any = {};
  representatives: any;
  @Output() gridPageIndex = new EventEmitter();
  @Input() gridData: any;
  @Input() gridDataHeader: any;
  @Input() headerStatus: any;
  @Input() paginationStatus: any;
  @Input() paginationReportStatus: any;
  @Input() rowsPageOption: any;
  @Input() pageReportContent: any;
  @Input() gridNoDataContent: any;
  @Input() dataSelection: any;
  @Input() dataSelectionMode: any;
  @Input() dataKey: any;
  @Input() PageRows !: number
  @Input() totalRecords !: number
  @Input() resetFirst !: number
  @Output() dataSelectionChange = new EventEmitter();
  @Output() linkSelection = new EventEmitter();
  @Output() copyRequestSelection = new EventEmitter();
  @Output() copyResponseSelection = new EventEmitter();
  @Output() rowClickedEvent = new EventEmitter();
  @Output() deleteRowEvent = new EventEmitter();
  @Output() rowDoubleClickEvent = new EventEmitter();
  @Output() dropDownValueChange = new EventEmitter();
  @Input() selectedDetail: any
  @Output() CheckboxChanged = new EventEmitter();

  
  @ContentChild('rowExpansionTemplate') rowExpansionTemplate!: TemplateRef<ElementRef>;
  @ViewChild('fluidGridTable') table!: Table;
  ControlType = FluidControlType;

  constructor() {
    super();
  }

  ngOnChanges() {
    this.dataList = this.gridData;
    this.headerList = this.gridDataHeader;
  }

  dataChange(event: any) {
  this.dataSelectionChange.emit(event);
  }

  onCheckBoxChange(event: any) {
    this.CheckboxChanged.emit(event);
  }

  rowClicked(rowData:any) {
    this.rowClickedEvent.emit(rowData);
  }

  onRowDblClick(rowData:any){
    this.rowDoubleClickEvent.emit(rowData);
   }

  OnClickLink(rowData:any,event:any) {
    event.stopPropagation();
    this.linkSelection.emit(rowData);
  }

  OnCopyRequest(event:any) {
    event.stopPropagation();
    this.copyRequestSelection.emit(event);
  }

  OnCopyResponse(event:any) {
    event.stopPropagation();
    this.copyResponseSelection.emit(event);
  }
  OnDeleteRow(event:any) {
    this.deleteRowEvent.emit(event);
  }

  getCellData(row: any, col: any, isAmount?: boolean): any {
    const nestedProperties: string[] = col.field.split('.');
    let value: any = row;

    if (value) {
      for (const prop of nestedProperties) {
        if (value[prop]) {
          value = value[prop];
        }
      }
      if (typeof value === 'object') {
        value = null;
      }
      if (isAmount) {
        const currentvalue = value.toString().replace(',', '.')
        const floatValue = parseFloat(currentvalue).toFixed(2);
        return floatValue;
      }
      else {
        return value;
      }
    } else {
      return '';
    }
  }

  loadData() {
    this.pageIndex += 1;
    this.gridPageIndex.emit(this.pageIndex);
  }

  paginate(event:any) {
    this.gridPageIndex.emit(event);
  }

  onDateSelect(value: any) {
    console.log(value);
  }

  onSelectionchange(event: any, index: number, name: string) {
    const events = { value: event.value, index: index, name:name };
    this.dropDownValueChange.emit(events);
  }

  multiDropdownFilter(event:any) {
    this.table.filter(event.value, 'representative', 'in');
  }

  filterTable(event: any, field:any, condition:any) {
    this.table.filter(event.value, field, condition);
  }
}

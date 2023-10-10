import { Pipe, PipeTransform } from '@angular/core';
import { CodeTablesService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { PortalCodeTables } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Pipe({
  name: 'label',
})
export class LabelPipe implements PipeTransform {
  constructor(private codeTablesService: CodeTablesService) {}

  transform(value: string | undefined | null, codeTableId: typeof PortalCodeTables[number]): string {
    const codeTable = this.codeTablesService.getCodeTable(codeTableId);
    const valueMatch = codeTable.filter(element => element.value === value);

    if (!value) return '';

    return valueMatch?.length === 1 && valueMatch[0]?.label ? valueMatch[0].label : '';
  }
}

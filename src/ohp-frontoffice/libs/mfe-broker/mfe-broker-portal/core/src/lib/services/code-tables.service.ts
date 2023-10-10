import { Injectable } from '@angular/core';

import {
  BrokerCodeTableOption,
  CodeTables,
  PortalCodeTables,
  defaultCodeTables,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class CodeTablesService {
  private _codeTables: CodeTables = defaultCodeTables;

  set codeTables(data: CodeTables) {
    this._codeTables = data;
  }

  get codeTables(): CodeTables {
    return this._codeTables;
  }

  getCodeTable(id: PortalCodeTables): BrokerCodeTableOption[] {
    return this._codeTables[id] || [];
  }
}

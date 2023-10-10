import { BrokerCodeTableOption } from '../index';

const tuple = <T extends string[]>(...args: T) => args;

export const PanelCodeTables = tuple('cdtb-countrycode');

export type PanelCodeTables = typeof PanelCodeTables[number];
export type CodeTables = Record<PanelCodeTables, BrokerCodeTableOption[]>;

export const defaultCodeTables: CodeTables = PanelCodeTables.reduce((acc, codeTable) => ({ ...acc, [codeTable]: [] }), {} as CodeTables);

type SelectExpected = "celd"|"row"|"column"|"rows";

type CeldValue = string|number|boolean|null;
type RowValue = {[key: string]: CeldValue};
type ColumnValue = CeldValue[];
type RowsValue = RowValue[];

export type ExpectedResult<E extends SelectExpected> = 
    E extends "celd" ? CeldValue :
    E extends "row" ? RowValue|null :
    E extends "column" ? ColumnValue :
    RowsValue;

export type { SelectExpected, CeldValue, RowValue, ColumnValue, RowsValue };
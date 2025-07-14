import { Database } from "sqlite3";
import { ColumnType } from "./sqlite-express";
import { RecordWithTtl } from "dns";


type Celd = string|number|boolean|Object;
type Row = {[string]: Celd};
type CeldList = Celd[];
type RowList = Row[];





